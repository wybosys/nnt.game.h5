// 为了阻止wing莫名其妙的感知
var eeui = eui;

// 模块为毛这样命名而不是命名为 nn.eui 是因为2b的wing不能识别hd.eui.这种多级的并且也不识别hdeui这种
module eui {

    export type StackPageType = nn.InstanceType<egret.DisplayObject>;
    export type UiType = egret.DisplayObject;

    export interface IViewStack
    {
        push(page:egret.DisplayObject);
        pop();
        pages():egret.DisplayObject[];
    }

    export class ComponentU
    extends eui.Component
    implements eui.IItemRenderer
    {
        constructor() {
            super();
            this.touchEnabled = false;
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onLoaded, this);
        }

        onLoaded() {}

        /** 直接配置信号 */
        public slots:string = null;

        /** 灵活的任意配置的数据 */
        public tag:any = null;
        
        /** 业务中经常会遇到对于该组件的描述，底层提供避免业务重复声明 
            @note 不使用public公开的原因是通常业务层需要重载以实现具体的回馈
        */
        protected _help:any = null;
        get help():any {
            return this._help;
        }
        set help(h:any) {
            this._help = h;
        }

        /** 隶属于的控件，可以方便业务层的数据穿透 */
        belong:any = null;

        __disposed = false;
        protected _refcnt = 1;
        drop() {
            if (nn.ISDEBUG && this.__disposed) {
                nn.warn("对象 " + nn.Classname(this) + " 已经析构");
            }
            
            if (--this._refcnt == 0)
                this.dispose();
        }
        
        grab() {
            ++this._refcnt;
        }

        dispose() {
            this.belong = null;
            
            // 清空信号连接
            if (this._signals) {
                this._signals.dispose();
                this._signals = undefined;
            }            

            // 停止所有动画
            this.stopAllAnimates();

            // 停止所有计时器
            if (this._timers) {
                this._timers.forEach((e:nn.Timer)=>{
                    e.drop();
                });
                this._timers = null;
            }
            
            if (this.__need_remove_from_launchersmanager)
                nn.LaunchersManager.unregister(<any>this);
        }

        timer(duration:nn.Interval, count:number, idr?:string):nn.Timer
        {
            if (this._timers == null)
                this._timers = new Array<nn.Timer>();
            if (idr != null) {
                let tmr = nn.ArrayT.RemoveObjectByFilter(this._timers, (e:nn.Timer):boolean=>{
                    return e.tag == idr;
                });
                if (tmr) {
                    tmr.drop();
                }
            }
            let tmr = new nn.Timer(duration, count);
            tmr.tag = idr;
            tmr.signals.connect(nn.SignalDone, ()=>{
                nn.ArrayT.RemoveObject(this._timers, tmr);
            }, null);
            this._timers.push(tmr);
            tmr.start();
            // 预先调用一次tick用来更新ui上的显示
            nn.Defer(tmr.oneTick, tmr);
            return tmr;
        }
        private _timers:Array<nn.Timer>;

        // 和core模块的意义相同
        protected onAppeared() {}        
        protected onDisappeared() {}

        static _ProcessAppeared(ui:any) {            
            if (ui.onAppeared)
                ui.onAppeared();
            for (let i = 0; i < ui.numChildren; ++i) {
                let c:any = ui.getChildAt(i);
                if (c.onAppeared)
                    c.onAppeared();
            }
        }

        static _ProcessDisppeared(ui:any) {
            if (ui.onDisappeared)
                ui.onDisappeared();
            for (let i = 0; i < ui.numChildren; ++i) {
                let c:any = ui.getChildAt(i);
                if (c.onDisappeared)
                    c.onDisappeared();
            }
        }

        onVisibleChanged() {
            if (this._signals)
                this._signals.emit(nn.SignalVisibleChanged);
        }

        $setVisible(b:boolean):boolean {
            if (super.$setVisible(b)) {
                this.onVisibleChanged();
                return true;
            }
            return false;
        }
        
        $onAddToStage(stage:egret.Stage, nestLevel:number) {
            super.$onAddToStage(stage, nestLevel);
        }
        
        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.drop();
        }
        
        protected _initSignals() {
            this._signals.delegate = this;
            this._signals.register(nn.SignalClicked);
            this._signals.register(nn.SignalVisibleChanged);
        }

        protected _signals:nn.Signals;
        get signals():nn.Signals {
            if (this._signals)
                return this._signals;
            this._instanceSignals();
            return this._signals;
        }

        protected _instanceSignals() {
            this._signals = new nn.Signals(this);            
            this._initSignals();
        }

        _signalConnected(sig:string, s?:nn.Slot) {
            if (sig == nn.SignalClicked) {
                this.touchEnabled = true;
                nn.EventHook(this, egret.TouchEvent.TOUCH_TAP, this.__cmp_tap, this);
            }
        }

        // 为了支持Arch.ts中定义的模块加载架构
        private __need_remove_from_launchersmanager:boolean;

        private __cmp_tap(e:egret.TouchEvent) {
            this.signals.emit(nn.SignalClicked);
            e.stopPropagation();
        }

        setSkinPart(partName:string, instance:any) {
            let varname = partName;            
            //nn.noti("绑定变量 " + varname);
            super.setSkinPart(varname, instance);
            
            // 如果实现了euiext进行扩展处理
            let uiext = <IEUIExt>instance;
            if (uiext.onPartBinded)
                uiext.onPartBinded(partName, this);

            // 如果设置了 slots，则需要处理具体的信号连接
            if (instance.slots != null) {
                let ss = instance.slots.split(';');
                ss.forEach((s:string)=>{
                    if (s == '')
                        return;
                    let a = s.split('=>');
                    let sig = egret.getDefinitionByName(a[0]);
                    if (sig == null) {
                        nn.warn("找不到皮肤文件里slots中的Signal:" + a[0]);
                        return;
                    }
                    let tgt = this['_' + a[1]];
                    if (typeof(tgt) == 'string') {
                        instance.signals.redirect(sig, tgt, this);
                    } else {
                        instance.signals.connect(sig, tgt, this);
                    }
                });
            }
        }

        onPartBinded(name:string, tgt:any) {
            this.belong = tgt;
        }

        addChild(sp:egret.DisplayObject | nn.CComponent):egret.DisplayObject {
            let ui:egret.DisplayObject;
            if (sp instanceof nn.CComponent) {
                ui = (<nn.CComponent>sp).handle();
            } else {
                ui = <egret.DisplayObject>sp;
            }
            return super.addChild(ui);
        }

        addChildAt(sp:egret.DisplayObject | nn.CComponent, idx:number):egret.DisplayObject {
            let ui:egret.DisplayObject;
            if (sp instanceof nn.CComponent) {
                ui = (<nn.CComponent>sp).handle();
            } else {
                ui = <egret.DisplayObject>sp;
            }
            return super.addChildAt(ui, idx);
        }

        removeChild(sp:egret.DisplayObject | nn.CComponent):egret.DisplayObject {
            let ui:egret.DisplayObject;
            if (sp instanceof nn.CComponent) {
                let c = <nn.CComponent>sp;
                ui = c.handle();
                c.drop();
            } else {
                ui = <egret.DisplayObject>sp;
                if ((<any>ui).drop)
                    (<any>ui).drop();
            }
            return super.removeChild(ui);
        }

        removeFromParent() {
            _EUIExt.removeFromParent(this);
        }

        playAnimate(ani:Animate, idr?:any):Animate {
            return _EUIExt.playAnimate(this, ani, idr);
        }

        findAnimate(idr:any):Animate {
            return _EUIExt.findAnimate(this, idr);
        }

        stopAnimate(idr:any) {
            _EUIExt.stopAnimate(this, idr);
        }

        stopAllAnimates() {
            _EUIExt.stopAllAnimates(this);
        }

        // 约定使用该函数返回容器的上一级
        goBack() {
            _EUIExt.goBack(this);
        }
        
        protected _data:any = undefined;
        get data():any {
            return this._data;
        }
        set data(d:any) {
            this._data = d;
            // 如果skin＝＝null，需要业务在onloaded中手动调用updateData来决定刷新的时机
            if (this.skin)
                this.updateData();
        }

        protected _itemIndex:number;
        get itemIndex():number {
            return this._itemIndex;
        }
        set itemIndex(n:number) {
            this._itemIndex = n;
        }

        protected _selected:boolean;
        get selected():boolean {
            return this._selected;
        }
        set selected(s:boolean) {
            if (this._selected == s)
                return;
            this._selected = s;
            this.invalidateState();
        }

        getCurrentState():string {
            if (this._selected)
                return 'down';
            if (this.enabled == false)
                return 'disabled';
            super.getCurrentState();
        }

        public get interactiveEnabled():boolean {
            return this.touchEnabled;
        }
        public set interactiveEnabled(v:boolean) {
            this.touchEnabled = v;
            this.touchChildren = v;
        }

        setLayoutBoundsSize(width:number, height:number) {
            super.setLayoutBoundsSize(width, height);
        }

        /** 隶属的栈 */
        get viewStack():IViewStack {
            return _EUIExt.getViewStack(this);
        }
        set viewStack(sck:IViewStack) {
            _EUIExt.setViewStack(this, sck);
        }

        /** 展示与否 */
        get exhibition():boolean {
            return _EUIExt.getExhibition(this);
        }        
        set exhibition(b:boolean) {
            _EUIExt.setExhibition(this, b);
        }
        
        /** 刷新布局 */
        updateLayout() {}            
        
        /** 刷新数据 */
        updateData() {}

        /** 锚点 */
        protected _anchorPointX = 0;
        public get anchorPointX():number {
            return this._anchorPointX;
        }
        public set anchorPointX(v:number) {
            if (v == this._anchorPointX)
                return;
            this._anchorPointX = v;
            this.invalidateDisplayList();
        }
        
        protected _anchorPointY = 0;
        public get anchorPointY():number {
            return this._anchorPointY;
        }
        public set anchorPointY(v:number) {
            if (v == this._anchorPointY)
                return;
            this._anchorPointY = v;
            this.invalidateDisplayList();
        }
        
        // 重载以支持各种需要依赖实际尺寸的功能
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number) {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            if (this._anchorPointX || this._anchorPointY) {
                this.anchorOffsetX = unscaledWidth * this._anchorPointX;
                this.anchorOffsetY = unscaledHeight * this._anchorPointY;
            }
            // 每一次更新均会调整位置
            this.updateLayout();
        }

        convertPointTo(pt:nn.Point, sp:egret.DisplayObject | nn.CComponent):nn.Point {
            return ConvertPoint(this, pt, sp);
        }

        convertRectTo(rc:nn.Rect, sp:egret.DisplayObject | nn.CComponent):nn.Rect {
            return ConvertRect(this, rc, sp);
        }

        updateCache() {
            this.validateDisplayList();
        }

        get frame():nn.Rect {
            return nn.getFrame(this);
        }        
        set frame(rc:nn.Rect) {
            nn.setFrame(this, rc);
        }

        bounds():nn.Rect {
            return nn.getBounds(this);
        }
    }

    // 避免暴露到wing中
    var _eui = eui;

    /** 业务非wing重用模块继承该类型 */
    export class SpriteU
    extends _eui.ComponentU
    {
    }
    
    nn.EntryCheckSettings = (cls:any, data:nn.EntrySettings):boolean=>{
        if (data.singletone) {
            if (nn.Desktop._AllOpenings.length &&
                nn.IsInherit(cls, eui.DialogU))
            {
                let fnd = nn.ArrayT.QueryObject(nn.Desktop._AllOpenings, (dsk:nn.Desktop):boolean=>{
                    return nn.ObjectClass(dsk.contentView.handle()) == cls;
                });
                if (fnd != null) {
                    nn.warn("模块 " + nn.Classname(cls) + " 已经打开");
                    return false;
                }
            }
        }
        return true;
    }
}
