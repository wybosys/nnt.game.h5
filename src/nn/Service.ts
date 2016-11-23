module nn.svc {
    
    // Service 支持的功能
    export enum Feature {        
        SHARE, // 分享
        PAY, // 支付
        LOGIN, // 登陆
        SWITCHUSER, // 切换账号 
        PROFILE, // 用户信息
        AUTH, // 授权
        LOGOUT, // 注销
        REPORT, // 汇报数据
        LOADING, // 加载进度
        GETAPP, // 微端
        BIND, // 绑定
        SUBSCRIBE, // 关注
        DESKTOP, // 添加到桌面
        BBS, // 论坛
        STATUS, // 状态
        CUSTOMER, // 客服
        LANZUAN, // 蓝钻
    };

    // 当前已知的平台
    export enum Platform {
        XHB, // 小伙伴
        WANBA, // 玩吧
        QQGAME, // qq游戏
        QQBROWSER, // qq浏览器
        X360, // 360
        X360ZS, // 360手机助手
        MOCK, // 测试用的平台
    };

    export abstract class Content
    implements ISObjectWrapper
    {
        signals:Signals;
        attach:(obj:any)=>void;
        dispose:()=>void;

        // 服务器发来的数据，如果!=null则通常代表服务器组装了所有参数以及签名，则Service将舍去其他参数，直接使用这个data
        data:jsonobj;

        // 为了加速调用过程，proc中保存着services里面的处理函数名称
        proc:string;
    }
    
    /** 支付的数据 */
    export class PayContent
    extends Content
    {
        /** 支付的项目 */
        product:any;        
        
        proc = 'pay';
    }

    /** 分享的数据 */
    export class ShareContent
    extends Content
    {
        /** 分享出去的链接 */
        url:string = '';

        /** 分享出去的图片 */
        image:string = '';

        /** 分享出去的标题 */
        title:string = '';

        /** 分享出去的内容 */
        detail:string = '';

        proc = 'share';
    }

    /** 登陆到sdk, 一些SDK的特殊要求也放在这里面处理 */
    export class LoginContent
    extends Content
    {
        /** S2S 拿到用户id */
        pid:numstr;
        
        /** 客服系统缓存历史消息的最大条目 */
        maxCustomerMessages:number;

        proc = 'login';
    }
        
    /** 第三方平台上的用户信息 */
    export class ProfileContent
    extends Content
    {
        /** 是否已经登录 */
        islogin:boolean;
        
        /** 头像地址 */
        avatar:string;
        
        /** 昵称 */
        nickname:string;

        proc = 'profile';
    }

    /** 状态 */
    export class StatusContent
    extends Content
    {
        /** 是否运行在微端中 */
        appmode:boolean;
        
        /** 已经绑定手机 */
        phone:boolean;
        
        /** 已经关注 */
        subscribe:boolean;
        
        /** 当前的货币单位 */
        monetaryName:string;
        
        /** 当前的货币汇率 */
        monetaryRate:number;
        
        /** 是否有折扣 
            @note 如果是null，则代表没有折扣，!null 则为具体的折扣数值
        */
        monetaryDiscount:number;

        /** 兑换 */
        excharge(v:number):number {
            if (this.monetaryDiscount != null)
                return v * this.monetaryRate * this.monetaryDiscount;
            return v * this.monetaryRate;
        }

        proc = 'status';
    }

    /** 登出 */
    export class LogoutContent
    extends Content
    {
        proc = 'logout';
    }

    /** 切换账号 */
    export class SwitchUserContent
    extends Content
    {
        proc = 'switchuser';
    }

    /** 加载进度 */
    export class LoadingContent
    extends Content
    {
        constructor(t:number, c:number) {
            super();
            this.total = t;
            this.current = c;
        }
        
        total:number;
        current:number;

        proc = 'loading';
    }

    /** 授权信息 */
    export class AuthContent
    extends Content
    {        
        /** 游戏在渠道的标志 */
        app:string = '';
        
        /** 授权的id */
        pid:numstr = '';

        /** 渠道号 */
        channel:number = 0;

        /** 授权类型 */
        type:number = 0;

        /** 授权key */
        key:string = '';
        
        /** 凭据 */
        ticket:string = '';

        /** 时间戳 */
        timestamp:string = '';

        /** 随机串 */
        nonce:string = '';

        /** 授权签名 */
        signature:string = '';

        /** 授权的平台代号 */
        platform:Platform;

        /** 让sdk可以调用到游戏的通用对话框 */
        alert:(data:{msg:string, title?:string, done:()=>void})=>void;
        confirm:(data:{msg:string, title?:string, done:()=>void, cancel?:()=>void})=>void;
        prompt:(data:{msg?:string, title?:string, placeholder?:string, done:(val:string)=>void, cancel?:()=>void})=>void;

        proc = 'auth';
    }

    /** 游戏汇报信息 */
    export enum ReportType
    {
        LOGIN, // 登陆
        ROLE, // 角色
        UPGRADE, // 升级
        PROGRESS, // 游戏进度
        SCORE, // 分数
    }

    /** 提交信息 */
    export class ReportContent
    extends Content
    {
        // 类型
        type:ReportType;
        
        // base
        roleId:numstr; // 角色id
        nickname:string; // 昵称
        region:numstr; // 区
        server:numstr; // 服务器
        
        // extend
        level:number; // 级别
        viplevel:number; // vip级别
        score:number; // 得分
        newuser:boolean; // 是否新人
        progress:numstr; // 第几关

        proc = 'report';
    }

    /** 绑定手机 */
    export class BindContent
    extends Content
    {
        /** 请求绑定了手机 */
        phone:boolean;

        proc = 'bind';
    }

    /** 打开论坛 */
    export class BBSContent
    extends Content
    {
        proc = 'bbs';
    }

    /** 添加关注 */
    export class SubscribeContent
    extends Content
    {
        /** 请求关注 */
        subscribe:boolean;

        proc = 'subscribe';
    }

    /** 下载微端 */
    export class GetAppContent
    extends Content    
    {
        proc = 'getapp';
    }

    /** 保存到桌面 */
    export class SendToDesktopContent
    extends Content
    {
        proc = 'sendtodesktop';
    }

    export class LanZuanContent
    extends Content
    {
        proc = 'lanzuan';
    }

    export class LanZuanXuFeiContent
    extends Content
    {
        /* 续费成功后的通知地址 */
        notifyUrl:string;

        proc = 'lanzuanxufei';
    }

    // 收到了新的客服消息
    export let SignalMessagesGot = "::nn::service::messages::got";

    // 平台支持的状态变化
    export let SignalStatusChanged = "::nn::service::status::changed";

    export class Message {        
        id:number;
        
        /** 内容 */
        message:string;

        /** 发送人的名字 */
        senderName:string;
    }

    /** 打开客服系统 */
    export class CustomerContent
    extends Content
    {
        /** 拉取所有的 */
        all:boolean;

        proc = 'customer';
    }

    /** 发送客服聊天 
        @note 基类的参数就不需要传了
     */
    export class SendCustomerContent
    extends CustomerContent
    {
        /** 发送的消息 */
        message:string;
        
        /** 用户等级 */
        level:number;
        viplevel:number;
    }

    export abstract class Service
    extends SObject
    {
        constructor() {
            super();
        }
        
        _initSignals() {
            super._initSignals();
            this._signals.register(SignalMessagesGot);
            this._signals.register(SignalStatusChanged);
        }
        
        /** 查询是否支持该功能 */
        support(feature:Feature):boolean {
            return false;
        }

        /** 调用功能 */
        fetch(c:svc.Content) {
            let fun = this[c.proc];
            if (fun == null) {
                fatal("没有找到Service中对应Content的处理方法");
                return;
            }
            fun.call(this, c);
        }

        /** 支付 */
        abstract pay(c:svc.PayContent);

        /** 检查支付条件 */
        abstract payable(price:number):boolean;
        
        /** 分享 */
        abstract share(c:svc.ShareContent);

        /** 获得登录的信息 */
        abstract profile(c:svc.ProfileContent);

        /** 登录 */
        abstract login(c:svc.LoginContent);
        
        /** 授权动作 */
        abstract auth(c:svc.AuthContent);

        /** 汇报 */
        abstract report(c:svc.ReportContent);

        /** 加载进度 */
        abstract loading(c:svc.LoadingContent);

        /** 下载微端 */
        abstract getapp(c:svc.GetAppContent);

        /** 保存到桌面 */
        abstract sendtodesktop(c:svc.SendToDesktopContent);

        /** 登出 */
        abstract logout(c:svc.LogoutContent);

        /** 切换账号 */
        abstract switchuser(c:svc.SwitchUserContent);

        /** 绑定 */
        abstract bind(c:svc.BindContent);

        /** 关注 */
        abstract subscribe(c:svc.SubscribeContent);

        /** 状态 */
        abstract status(c:svc.StatusContent);

        /** 打开论坛 */
        abstract bbs(c:svc.BBSContent);

        /** 打开客服系统 */
        abstract customer(c:svc.CustomerContent);

        /** 蓝钻*/
        abstract lanzuan(c:svc.LanZuanContent);

        /** 蓝钻续费*/
        abstract lanzuanxufei(c:svc.LanZuanXuFeiContent);
        
        /** 服务的唯一标示 */
        static ID:string = "";
        static QQAPPID:string = "";

        /** 服务的描述 */
        static DESCRIPTION:{NAME:string; CONTACT:string};

        /** 通常第三方服务需要异步load各自平台的SDK，所以需要在调用功能前保证SDK已经加载完毕 */
        static prepared:boolean;
        static Prepare(cb:()=>void, ctx:any) {
            cb.call(ctx);
        }

        toString():string {
            return [
                'id: ' + ObjectClass(this).ID,
                'description: ' + ObjectClass(this).DESCRIPTION.NAME,
                'class: ' + Classname(this)
            ].join('\n');
        }
    }

    export class Signature {
        /** 需要签名的内容 */
        content:any;

        /** 签名成功
            @data 签名得到的数据
         */
        next(data:string) {
            this.cb.call(this.ctx, data);
        }

        cb:(data:any)=>void;
        ctx:any;
    }
}

module nn {
    
    class _ContentWrapper
    extends SObjectWrapper
    {
        constructor(cnt:svc.Content) {
            super(cnt);
            this.signals.register(SignalSucceed);
            this.signals.register(SignalFailed);
        }
    }
    
    export abstract class ServicesManager
    extends SObject
    {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
        }
        
        dispose() {
            this._service = drop(this._service);
            super.dispose();
        }

        /** 注册可用的service列表
            @note 默认manager会遍历当前可用的第一个service
        */
        static register(cls:any) {
            this._SERVICES.push(cls);
        }
        static _SERVICES = new Array<any>();
        
        /** 绑定平台的签名接口 
            @note 部分平台需要对参数进行加密后再传回去，所以需要提供一个签名函数
        */
        bindSignature(fun:(cnt:svc.Signature)=>void, ctx?:any) {
            this._sigfun = fun;
            this._sigctx = ctx;
        }
        
        /** 调用签名 
            @note 和bind配对使用 */
        signature(cnt:any, cb:(data:any)=>void, ctx?:any) {
            let pl = new svc.Signature();
            pl.content = cnt;
            pl.cb = cb;
            pl.ctx = ctx;
            this._sigfun.call(this._sigctx, pl);
        }
        
        protected _sigfun:(cnt:svc.Signature)=>void;
        protected _sigctx:any;

        /** 初始化 
            @note app需要重载该函数实现不同渠道，不同service 
            @return 继承自 AbstractService 的类
        */
        abstract detectService():any;

        // 当前服务的实例
        private _service:svc.Service = null;
        get service():svc.Service {
            return this._service;
        }

        /** 获得支持的特性 */
        static support(feature:svc.Feature):boolean {
            return this._shared._service.support(feature);
        }

        /** 获取第三方的数据 */
        static fetch(cnt:svc.Content,
                     suc?:(s?:Slot)=>void,
                     ctx?:any);
        static fetch(cnt:svc.Content,
                     suc?:(s?:Slot)=>void,
                     failed?:(s?:Slot)=>void,
                     ctx?:any);
        static fetch()
        {
            let p:any = arguments;
            let cnt:svc.Content = p[0];
            let suc:(s:Slot)=>void = p[1];
            let failed:(s:Slot)=>void;
            let ctx:any;
            if (typeof(p[2]) == 'function') {
                failed = p[2];
                ctx = p[3];
            } else {                
                failed = null;
                ctx = p[2];
            }
            let cls = ObjectClass(this._shared._service);
            if (cls.prepared) {
                this.doFetch(cnt, suc, failed, ctx);
            } else {
                cls.Prepare(()=>{
                    cls.prepared = true;
                    this.doFetch(cnt, suc, failed, ctx);
                }, this);
            }
        }

        protected static doFetch(cnt:svc.Content,
                                 suc:(s?:Slot)=>void,
                                 failed:(s?:Slot)=>void,
                                 ctx:any)
        {
            // 解耦合content的生命期
            new _ContentWrapper(cnt);
            
            if (ctx) // 防止ctx析构后数据才返回造成的处理遗漏
                cnt.attach(ctx);
            if (suc)
                cnt.signals.connect(SignalSucceed, suc, ctx);
            if (failed)
                cnt.signals.connect(SignalFailed, failed, ctx);
            
            // 不能放到try中，防止出问题不能断在出问题的地方
            this._shared._service.fetch(cnt);
        }

        /** 设置成默认的实现 
            @param cls 默认使用的服务类型，如果是null则使用manager选择的服务
        */
        setAsDefault(cls = null):ServicesManager {
            if (cls == null)
                cls = this.detectService();
            
            // 首先检验当前的service类型
            this._service = new cls();
            
            // 设置为全局
            ServicesManager._shared = this;
            return this;
        }

        private static _shared:ServicesManager;
        static get shared():ServicesManager {
            return this._shared;
        }
        static set shared(v:ServicesManager) {
            fatal("不能直接设置");
        }
    }

    export class AnyServices
    extends ServicesManager
    {
        detectService():any {
            let cls = ArrayT.QueryObject(ServicesManager._SERVICES, (e:any):boolean=>{
                return e.IsCurrent();
            });
            assert(cls);
            return cls;
        }
    }
    
}
