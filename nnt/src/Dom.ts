module nn {
    
    export class HtmlBuilder
    {
        enter(element:string):this {
            this._ele = element;
            this._buf += '<' + element + ' ';
            return this;
        }

        pop():this {
            if (this._style)
                this._buf += 'style="' + this._style + '" ';
            this._buf += '>';
            if (this._text)
                this._buf += this._text;
            this._buf += '</' + this._ele + '>';
            return this;
        }

        style(key:string, value:string|number):this {
            if (this._style == null)
                this._style = '';
            this._style += key + ':' + value + ';';
            return this;
        }

        attr(key:string, value:string|number):this {
            this._buf += key + '=';
            let strval = <string>value;
            if (typeof(value) == 'string' && strval.length && strval[0] != '#')
                this._buf += '"' + value + '" ';
            else
                this._buf += value + ' ';
            return this;
        }

        text(str:string):this {
            this._text = str;
            return this;
        }
        
        toString():string {
            return this._buf;
        }

        private _ele:string;
        private _text:string;
        private _style:string;
        private _buf:string = '';
    }

    function getEvent(stop:boolean):Event {
        let ret;
        if (window.event) {
            ret = window.event;
        } else {
            let e = arguments.callee.caller;
            while(e.caller!=null){
                e = e.caller;
            }
            ret = e.arguments[0];
        }
        if (stop)
            ret.stopImmediatePropagation();
        return ret;
    }

    export module dom {

        export let ScaleFactorX:number;
        export let ScaleFactorDeX:number;
        export let ScaleFactorY:number;
        export let ScaleFactorDeY:number;
        export let ScaleFactorSize:number;
        export let ScaleFactorDeSize:number;

        export type DomId = string | Element;

        export function getElementById(id:DomId):Element {
            if (typeof(id) == 'string')
                return document.getElementById(<string>id);
            return <Element>id;
        }

        export class DomObject
        extends SObject
        implements SignalsDelegate
        {
            constructor(id?:DomId) {
                super();
                if (id)
                    this.node = getElementById(id);
            }

            dispose() {
                super.dispose();
                if (this._listeners) {
                    MapT.Clear(this._listeners);
                }
            }

            static From(id:DomId):DomObject {
                return new DomObject(id);
            }

            protected _initSignals() {
                super._initSignals();
                this._signals.delegate = <SignalsDelegate>this;
                this._signals.register(SignalClicked);
            }
            
            _signalConnected(sig:string) {
                switch (sig) {
                case SignalClicked: {
                    this.setAttr("onclick", this.method('__dom_clicked'));
                } break;
                }
            }

            event:Event;
            
            private __dom_clicked() {
                this.event = getEvent(true);                
                this._signals && this._signals.emit(SignalClicked);
            }

            updateData() {}

            get css():string {
                return this._node.style.cssText;
            }
            set css(v:string) {
                this._node.style.cssText = v;
            }

            _style:any;
            get style():any {
                if (this._style == null)
                    this._style = this._node.style;
                return this._style;
            }

            get content():string {
                return this._node.textContent;
            }
            set content(v:string) {
                this._node.textContent = v;
            }

            get id():any {
                return this.getAttr('id');
            }
            
            set id(v:any) {
                this.setAttr('id', v);
            }

            getAttr(k:any, def?:any):any {
                let v = this._node.getAttribute(k);
                return v == null ? def : v;
            }
            setAttr(k:any, v:any) {
                this._node.setAttribute(k, v);
            }

            private _fontSize:number;
            get fontSize():number {
                return this._fontSize * ScaleFactorDeSize;
            }
            set fontSize(v:number) {
                if (this._fontSize == v)
                    return;
                this._fontSize = v;
                this._node.style.fontSize = v * ScaleFactorSize + 'em';
            }

            private _src:string;
            get src():string {
                return this._src;
            }
            set src(s:string) {
                this._src = s;
                this._node.style.src = 'url(' + s + ')';
            }

            get width():number {
                return this._node.clientWidth;
            }

            get height():number {
                return this._node.clientHeight;
            }

            add(node:DomObject):DomObject {
                node.parent = this;
                this._node.appendChild(node._node);
                this.nodes.push(node);
                node.preload(()=>{
                    node.onLoaded();
                }, this);
                return this;
            }
            
            protected preload(cb:()=>void, ctx?:any) {
                cb.call(ctx);
            }
            
            protected onLoaded() {}

            br() {
                this._node.appendChild(document.createElement('br'));
            }

            remove(node:DomObject) {
                if (node.parent != this)
                    return;
                node._node.parentElement.removeChild(node._node);
                node.parent = null;
                nn.ArrayT.RemoveObject(this.nodes, node);
                
                // 移除即代表析构
                drop(node);
            }

            removeFromParent() {
                if (this.parent)
                    this.parent.remove(this);
            }

            private _visible = true;
            get visible():boolean {
                return this._visible;
            }
            set visible(b:boolean) {
                if (b == this._visible)
                    return;
                this._visible = b;
                this._node.style.display = b ? 'block' : 'none';
            }

            setFrame(rc:nn.Rect) {
                if (this._node.style.position != 'absolute')
                    this._node.style.position = 'absolute';
                this._node.style.left = rc.x + 'px';
                this._node.style.top = rc.y + 'px';
                this._node.style.width = rc.width + 'px';
                this._node.style.height = rc.height + 'px';
            }
                        
            private _node:any;
            protected get node():any {
                return this._node;
            }
            protected set node(n:any) {
                if (n == this._node)
                    return;
                if (this._node)
                    this.remove(this._node);
                this._node = n;
                if (this._node) {
                    this.id = this.hashCode;
                    if (this.parent)
                        this.parent.add(n);
                }
            }

            protected method(mtdname:string):string {
                if (this.listener(mtdname) == null)
                    this._node[mtdname] = this.bindListener(mtdname, ()=>{
                        this[mtdname]();
                    });
                return "document.getElementById(" + this.id + ")['" + mtdname + "']()";
            }            
            
            parent:DomObject;
            nodes = new Array<DomObject>();

            /** 维护 listener */
            listener(idr:any):Function {
                return this._listeners ? this._listeners[idr] : undefined;
            }
            bindListener(idr:any, cb:(e:any)=>void):Function {
                this.listeners[idr] = cb;
                return cb;
            }
            
            protected _listeners:KvObject<any, Function>;
            protected get listeners():KvObject<any, Function> {
                if (this._listeners == null)
                    this._listeners = new KvObject<any, Function>();                
                return this._listeners;
            }
        }
        
        export class Button
        extends DomObject
        {
            constructor(id?:DomId) {
                super(id);
                if (id == null)
                    this.node = document.createElement('button');
                this.style.backgroundColor = 'transparent';
                this.style.border = 'none';
            }

            _image:string;
            get image():string {
                return this._image;
            }
            set image(img:string) {
                if (this._image == undefined) {
                    this.style.backgroundSize = 'contain';
                    this.style.backgroundPosition = 'center';
                    this.style.backgroundRepeat = 'no-repeat';
                }
                this._image = img;
                this.style.backgroundImage = 'url(' + img + ')';
            }
        }

        export class Label
        extends DomObject
        {
            constructor(id?:DomId) {
                super(id);
                if (id == null)
                    this.node = document.createElement('label');
                this.fontSize = 1;
            }
        }

        export class Image
        extends DomObject
        {
            constructor(id?:DomId) {
                super(id);
                if (id == null)
                    this.node = document.createElement('img');
            }
        }

        export class Sprite
        extends DomObject
        {
            constructor(id?:DomId) {
                super(id);
                if (id == null)
                    this.node = document.createElement('div');
                this.style.position = 'relative';
            }
        }

        export class Desktop
        extends DomObject
        {
            constructor(dom?:DomObject, id?:DomId) {
                super(id);
                if (id == null)
                    this.node = document.createElement('div');
                this.contentView = dom;

                let s = this.style;
                s.position = 'absolute';
                s.zIndex = 0;
                s.width = '100%';
                s.height = '100%';
                s.left = '0px';
                s.top = '0px';
                s.backgroundColor = 'rgba(0,0,0,0.7)';

                this.signals.connect(SignalClicked, this.__dsk_clicked, this);
            }

            clickedToClose:boolean;

            _contentView:DomObject;
            get contentView():DomObject {
                return this._contentView;
            }
            set contentView(v:DomObject) {
                if (v == this._contentView)
                    return;
                if (this._contentView) {
                    this._contentView.removeFromParent();
                    this._contentView.signals.disconnectOfTarget(this);
                }
                this._contentView = v;
                if (v) {
                    v.signals.register(SignalRequestClose);
                    v.signals.connect(SignalRequestClose, this.close, this);
                    this.add(v);
                }
            }

            open() {
                Dom.add(this);
            }

            close() {
                this.removeFromParent();
            }

            private __dsk_clicked() {
                if (this.clickedToClose)
                    this.close();
            }
        }

        export function x(v:number) {
            return Integral(v * ScaleFactorX);
        }

        export function y(v:number) {
            return Integral(v * ScaleFactorY);            
        }

        export function size(v:number) {
            return Integral(v * ScaleFactorSize);
        }
    }

    export interface IDom {
        openLink(url:string);
        simulateLink(url:string);
        openUrl(url:string);
        simulateClick(cb:()=>void, ctx?:any);
    }
    
    class _Dom
    extends dom.DomObject
    implements IDom
    {
        constructor() {
            super();
            this.node = document.body;
        }

        updateBounds() {
            // 设计尺寸按照 iphone5
            let design = new Size(320, 568);
            let browser = Device.shared.screenBounds;
            dom.ScaleFactorX = browser.width / design.width;
            dom.ScaleFactorY = browser.height / design.height;
            dom.ScaleFactorDeX = 1 / dom.ScaleFactorX;
            dom.ScaleFactorDeY = 1 / dom.ScaleFactorY;
            dom.ScaleFactorSize = Math.min(dom.ScaleFactorX, dom.ScaleFactorY);
            dom.ScaleFactorDeSize = 1 / dom.ScaleFactorDeSize;
        }

        protected _initSignals() {
            super._initSignals();
        }

        /** 打开新页面 */
        openLink(url:string) {
            log("打开新页面：" + url);
            window.open(url);
        }

        /** 模拟一次点击链接 */
        simulateLink(url:string) {
            log("模拟点击链接：" + url);
            //let n = document.createElement('a');
            //n.href = url;
            //n.click();
            try {
                window.top.location.href = url;
            } catch (err) {
                location.href = url;
            }
        }

        /** 打开页面 */
        openUrl(url:string) {
            if (Device.shared.isMobile)
                this.simulateLink(url);
            else
                this.openLink(url);
        }

        /** 模拟一次点击 */
        private _waitclick = new Closure(null, null);
        simulateClick(cb:()=>void, ctx?:any) {
            let n:any = document.createElement('div');
            if (n == null) {
                cb.call(ctx);
                return;
            }
            
            this._waitclick.reset(cb, ctx);
            
            n.style.display = 'none';
            n.setAttribute('id', '::n2::dom::simulateclick');
            n.setAttribute('onclick', this.method('__cb_simulate_click'));
            this.node.appendChild(n);
            n.click();
            n.remove();
        }

        private __cb_simulate_click() {
            this._waitclick.invoke();
            this._waitclick.reset(null, null);
        }
    }

    export let Dom:IDom = new _Dom();
    
}
