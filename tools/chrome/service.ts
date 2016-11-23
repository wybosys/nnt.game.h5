/// <reference path="chrome.d.ts" />

module hd
{
    export function ObjectClass(o:any):any {
        let r = o['prototype'];
        if (r == null)
            r = o['constructor']['prototype'];
        return r;
    }

    let QID = 0;

    export class Model {
        constructor(cmd:string) {
            this.cmd = cmd;            
        }
        
        cmd:string = '';

        qid:number = ++QID; // 序列号
        rest:boolean = false; // 是否是响应模式
        rsp:boolean = false; // 是否已经返回

        static Copy(l:Model, r:Model) {
            for (let k in l) {
                if (k.indexOf('_') == 0)
                    continue;
                let v = l[k];
                let t = typeof(v);
                if (k in r)
                    l[k] = r[k];
            }
        }

        toString():string {
            return JSON.stringify(this);
        }
    }

    interface IService
    {
        // 获得模型
        fetch(m:Model, cb:(m:Model)=>void, ctx?:any);

        // 异步模型
        post(m:Model);

        // 等待请求
        wait(cmd:string, cb:(m:Model)=>void, ctx?:any);

        // 加载文件
        require(file:string);
    }

    class Closure
    {
        constructor(cb:any, ctx:any) {
            this.cb = cb;
            this.ctx = ctx;
        }
        
        cb:any;
        ctx:any;
        
        invoke() {
            this.cb.call(this.ctx);
        }
    }

    class AsyncQueue
    extends Closure
    {
        constructor(cb:any, ctx:any, m:Model) {
            super(cb, ctx);
            this.m = m;
        }
        m:Model;
    }

    class WaitQueue
    extends Closure
    {
        constructor(cb:any, ctx:any, cmd:string) {
            super(cb, ctx);
            this.cmd = cmd;
        }
        cmd:string;
    }

    class AsyncQueues
    {
        push(m:Model, cb:any, ctx:any) {
            if (m.qid in this._map) {
                console.log('重复请求model');
                return;
            }
            this._map[m.qid] = new AsyncQueue(cb, ctx, m);
        }

        invoke(m:Model) {
            if (!(m.qid in this._map)) {
                //console.log('请求了一个不存在model'); 不需要报
                return;
            }
            
            let aq = this._map[m.qid];
            delete this._map[m.qid];
            // 从另外一个复制数值
            Model.Copy(aq.m, m);
            // 调用回调
            aq.cb.call(aq.ctx, aq.m);
        }
        
        private _map = {};
    }

    class WaitQueues
    {
        push(cmd:string, cb:any, ctx:any) {
            if (cmd in this._map) {
                console.log('重复等待命令');
                return;
            }
            this._map[cmd] = new WaitQueue(cb, ctx, cmd);
        }

        invoke(data:any, cb:(data:any)=>Model, ctx?:any) {
            let m = cb.call(ctx, data);
            if (!(m.cmd in this._map))
                return;
            let wq = this._map[m.cmd];
            Model.Copy(wq.m, m);
            wq.cb.call(wq.ctx, wq.m);
        }
        
        private _map = {};
    }

    export function eventHook(obj:any, event:string, cb:any, ctx:any, haseventchar:boolean) {
        if (eventHooked(obj, event, cb, ctx))
            return;
        if (obj._safe_events == null)
            obj._safe_events = [];
        this._safe_events.push([obj, event, cb, ctx]);
        if (haseventchar)
            obj.addEventListener(event, cb, ctx);
        else
            obj.addListener(cb, ctx);
    }

    export function eventHooked(obj:any, event:string, cb:any, ctx?:any):boolean {
        if (obj._safe_events == null)
            return false;
        for (let i = 0; i < obj._safe_events.length; ++i) {
            let se = obj._safe_events[i];
            if (se[0] == obj && se[1] == event && se[2] == cb && se[3] == ctx)
                return true;
        }
        return false;
    }

    class ServiceChrome
    implements IService
    {
        constructor(idr:string = '::svc::main') {
            this._idr = idr;            
        }

        fetch(m:Model, cb:(m:Model)=>void, ctx?:any) {
            m.rest = true;
            // 放到异步队列中
            this._aqs.push(m, cb, ctx);
            this.post(m);
        }

        connect() {
            if (this._chn == null) {
                this._chn = chrome.runtime.connect({'name':this._idr});
                // 需要监听异步返回的请求
                this._chn.onMessage.addListener((m:Model)=>{
                    if (m.rest == false)
                        return;                    
                    if (m.rsp == false)
                        return;
                    this._aqs.invoke(m);
                });
            }
        }
        
        // post/wait 对应异步调用过程        
        post(m:Model) {
            this._chn.postMessage(m);
        }

        listen() {
            if (this._chn) {
                console.log('already listen');
                return;
            }
            chrome.runtime.onConnect.addListener((port:chrome.runtime.Port)=>{
                if (port.name != this._idr)
                    return;
                this._chn = port;
                if (this.onConnect)
                    this.onConnect.invoke();
            });
        }

        onConnect:Closure;

        wait(cmd:string, cb:(m:Model)=>void, ctx?:any) {
            this._chn.onMessage.addListener((m:Model)=>{
                if (m.rsp == false &&
                    m.cmd == cmd)
                {
                    cb.call(ctx, m);
                    // 如果是响应模式，需要自动调用反馈
                    if (m.rest) {
                        m.rsp = true;
                        this.post(m);
                    }
                }            
            });
        }

        // 和wait的区别是不主动响应请求
        protected expect(cmd:string, cb:(m:Model)=>void, ctx?:any) {
            this._chn.onMessage.addListener((m:Model)=>{
                if (m.rsp == false &&
                    m.cmd == cmd)
                {
                    cb.call(ctx, m);
                }            
            });
        }

        require(file:string) {
            alert('不支持动态加载文件');
        }

        get tab():chrome.tabs.Tab {
            return this._chn.sender.tab;
        }

        get channel():chrome.runtime.Port {
            return this._chn;
        }

        protected _idr:string; // 标记
        protected _chn:chrome.runtime.Port; // 连接
        protected _aqs = new AsyncQueues();
    }    

    export class ServiceBackground
    extends ServiceChrome
    {
        constructor() {
            super();

            // 打开监听
            this.listen();

            // 业务层连上后再处理
            this._svcdt.onConnect = new Closure(()=>{
                this._svcdt.wait(ServiceBackground.CMD_DEVTOOLS, this.cbDevtools, this);
            }, this);
            this._svcdt.listen();

            this._svcnt.onConnect = new Closure(()=>{
                this._svcnt.wait(ServiceBackground.CMD_CONTENT, this.cbContent, this);
            }, this);
            this._svcnt.listen();
        }

        static CMD_DEVTOOLS = 'devtools';
        static CMD_CONTENT = 'content';
        
        private _svcdt = new ServiceChrome('::svc::devtools');
        private _svcnt = new ServiceChrome('::svc::content');

        private cbDevtools(m:model.Env) {
            console.log('app::devtools connected');
            // 转发所有收到的对象
            this._svcdt.channel.onMessage.addListener((m:model.Env)=>{
                if (this._svcnt.channel == null)
                    return;
                this._svcnt.post(m);
            });
        }
        
        private cbContent(m:model.Env) {
            console.log('app::content connected');            
            //let tab = this._svcnt.tab;
            //chrome.tabs.executeScript(tab.id, {file:"service.js"});
            //chrome.tabs.executeScript(tab.id, {file:"injected.js"});
            
            // 抓发所有收到的对象
            this._svcnt.channel.onMessage.addListener((m:any)=>{
                if (this._svcdt.channel == null)
                    return;
                this._svcdt.post(m);                
            });
        }        
    }

    export class ServiceDevtools
    extends ServiceChrome
    {
        constructor() {
            super('::svc::devtools');
            this.connect();
            this.post(new model.Env(ServiceBackground.CMD_DEVTOOLS));
        }

        eval(exp:string, cb:(result:any)=>void, ctx?:any) {
            let m = new model.Eval(exp);
            this.fetch(m, ()=>{
                cb.call(ctx, m.result);
            }, this);
        }
    }

    export class ServiceContent
    extends ServiceChrome
    {
        constructor() {
            super('::svc::content');
            
            // injects脚本
            this.require('service.js');
            this.require('injected.js');

            this.connect();
            this.post(new model.Env(ServiceBackground.CMD_CONTENT));

            // 监听injected过来的反馈
            document.addEventListener('::svc::ci::i', (e:any)=>{
                let m = e.detail;
                if (m.rest == false)
                    return;
                if (m.rsp == false)
                    return;
                this._aqs.invoke(m);
            });

            // 实现默认基础函数的监听
            this.command(model.Eval.CMD);
        }
        
        require(file:string) {
            let s:any = document.createElement('script');
            s.src = chrome.extension.getURL(file);
            (document.head || document.documentElement).appendChild(s);
        }

        // 实现命令
        command(cmd:string) {
            this.expect(cmd, (m:Model)=>{
                this.fetchInjected(m, (m:Model)=>{                    
                    this.post(m);
                }, this);
            }, this);
        }
    
        // 建立 content 和 injected 之间的通信
        fetchInjected(m:Model, cb:(m:Model)=>void, ctx?:any) {
            this._aqs.push(m, cb, ctx);
            document.dispatchEvent(new CustomEvent('::svc::ci::c', {detail:m}));
        }
        
        postInjected(m:Model) {
            document.dispatchEvent(new CustomEvent('::svc::ci::c', {detail:m}));
        }

        waitInjected(cmd:string, cb:(m:Model)=>void, ctx?:any) {
            document.addEventListener('::svc::ci:i', (e:any)=>{
                let m = e.detail;
                if (m.cmd != cmd)
                    return;
                cb.call(ctx, m);
            });
        }

        protected _aqs = new AsyncQueues();
    }

    export class ServiceInjected
    implements IService
    {
        constructor() {
            // 默认实现的命令
            this.wait(model.Eval.CMD, this.cmdEval, this);
        }
        
        post(m:Model) {
            document.dispatchEvent(new CustomEvent('::svc::ci::i', {detail:m}));
        }

        wait(cmd:string, cb:(m:Model)=>void, ctx?:any) {
            document.addEventListener('::svc::ci::c', (e:any)=>{
                let m = e.detail;
                if (m.cmd != cmd)
                    return;                
                cb.call(ctx, m);
                if (m.rest) {
                    m.rsp = true;
                    this.post(m);
                }
            });
        }

        fetch(m:Model, cb:(m:Model)=>void, ctx?:any) {}
        
        // 加载文件
        require(file:string) {
            let s:any = document.createElement('script');
            s.src = chrome.extension.getURL(file);
            (document.head || document.documentElement).appendChild(s);
        }

        private cmdEval(m:model.Eval) {
            m.result = eval(m.exp);
        }
    }

    export class WsConnector
    implements IService
    {
        constructor(host:string = 'ws://localhost:59000') {
            this._host = host;
        }

        connect() {
            if (this._hdl) {
                console.log('已经连接到服务器');
                return;
            }

            this._hdl = new WebSocket(this._host);            
            this._hdl.onmessage = (ev:MessageEvent):any => {
                this._wqs.invoke(ev, (ev:MessageEvent):Model =>{
                    return JSON.parse(ev.data);
                }, this);
                return 0;
            };
        }

        fetch(m:Model, cb:(m:Model)=>void, ctx?:any) {
            m.rest = true;
            this._aqs.push(m, cb, ctx);
            this.post(m);
        }

        post(m:Model) {
            this._hdl.send(m.toString());
        }

        wait(cmd:string, cb:(m:Model)=>void, ctx?:any) {
            this._wqs.push(cmd, cb, ctx);
        }

        require(file:string) {}

        private _host:string;
        private _hdl:WebSocket;
        private _aqs = new AsyncQueues();
        private _wqs = new WaitQueues();
    }
                
    export module model
    {
        export class Env
        extends Model
        {
            tabid:number = 0;
        }
        
        export class NodeList
        extends Model
        {
            static CMD = '::node::list';
            constructor(id:number) {                
                super(NodeList.CMD);
                this.id = id;
            }
            id:number = 0;
            children = new Array<any>();
        }

        export class NodeParent
        extends Model
        {
            static CMD = '::node::parent';
            constructor(id:number) {
                super(NodeParent.CMD);
                this.id = id;
            }
            id:number = 0;
            parent:any = null;
        }

        export class Eval
        extends Model
        {
            static CMD = '::eval';
            constructor(exp:string) {
                super(Eval.CMD);
                this.exp = exp;
            }
            exp:string = '';
            result:any = null;
        }

        // 获得布局的代码文件
        export class LayoutScript
        extends Model
        {
            static CMD = '::layout::script';
            constructor(clazz:string) {
                super(LayoutScript.CMD);
                this.clazz = clazz;
            }
            clazz:string = '';
            content:string = '';
        }
    }
}
