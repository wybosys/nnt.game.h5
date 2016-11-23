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

    let gs_convertpt = new egret.Point();

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

        removeFromParent = _EUIBaseExtPROTO.removeFromParent;
        playAnimate = _EUIBaseExtPROTO.playAnimate;
        findAnimate = _EUIBaseExtPROTO.findAnimate;
        stopAnimate = _EUIBaseExtPROTO.stopAnimate;
        stopAllAnimates = _EUIBaseExtPROTO.stopAllAnimates;

        // 约定使用该函数返回容器的上一级
        goBack() {
            _EUIBaseExtPROTO.goBack.call(this);
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
            return _EUIBaseExtPROTO.getViewStack.call(this);
        }
        set viewStack(sck:IViewStack) {
            _EUIBaseExtPROTO.setViewStack.call(this, sck);
        }

        /** 展示与否 */
        set exhibition(b:boolean) {
            _EUIBaseExtPROTO.setExhibition.call(this, b);
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

        convertPointTo = _EUIBaseExtPROTO.convertPointTo;
        convertRectTo = _EUIBaseExtPROTO.convertRectTo;
        updateCache = _EUIBaseExtPROTO.updateCache;
        
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

    export class _EUIBaseExt
    {
        removeFromParent() {
            let self:egret.DisplayObject = <any>this;
            if (self.parent)
                self.parent.removeChild(self);
        }

        private _viewStack:IViewStack;
        setViewStack(sck:IViewStack) {
            this._viewStack = sck;
        }
        getViewStack():IViewStack {
            if (this._viewStack)
                return this._viewStack;
            let self:egret.DisplayObject = <any>this;
            let p:any = self.parent;
            if (p && !('viewStack' in p)) {
                while (p) {
                    if ('viewStack' in p)
                        break;
                    p = p.parent;
                }
            }
            return p ? p.viewStack : null;
        }

        /* 返回上一级，采用逐层实现的方式，比如A(B(C(D，调用D的goback，如果D没有实现goback，则使用C，如果C是Dialog，则必然实现了goback方式，如果C没有goback方法（比如标准的eui对象），那继续向上追溯，一般业务中必然会遇到一个扩充后的对象
         */
        goBack() {
            let self:any = this;
            // 查找含有goback方法的上级
            let p = nn.queryParent(this, (o:any):any=>{
                if (o.goBack != undefined)
                    return o;
                return null;
            });
            // 调用父级元素的回退方法
            p.goBack();
        }

        /* eui提供了基础的visible和includeInLayout，但是业务中会遇到同时操作这两个属性，所以提供一个便捷的设置 */
        private _exhibition:boolean = true;
        setExhibition(b:boolean) {
            if (this._exhibition == b)
                return;
            this._exhibition = b;
            let self:any = this;
            self.visible = b;
            self.includeInLayout = b;
        }

        getExhibition():boolean {
            return this._exhibition;
        }

        /** 设置遮罩 */
        setClipbounds(rc:nn.Rect) {
            let self:any = this;
            self.mask = rc;
        }
        
        getClipbounds():nn.Rect {
            let self:any = this;
            return self.mask;
        }

        convertPointTo(pt:nn.Point, sp:egret.DisplayObject | nn.CComponent):nn.Point {
            return ConvertPoint(<any>this, pt, sp);
        }

        convertRectTo(rc:nn.Rect, sp:egret.DisplayObject | nn.CComponent):nn.Rect {
            return ConvertRect(<any>this, rc, sp);
        }

        updateCache() {
            let self:any = <any>this;
            self.validateDisplayList();
        }

        // 播放动画相关
        private _playingAnimates:Array<Animate>;
        playAnimate(ani:Animate, idr?:any):Animate {
            if (idr == null)
                idr = ani.tag ? ani.tag : ani.hashCode;
            
            if (this._playingAnimates == null)
                this._playingAnimates = new Array<Animate>();
            if (this.findAnimate(idr) != null) {
                nn.warn("动画 " + idr + " 正在运行");
                return null;
            }
            
            ani = ani.clone();
            ani.tag = idr;
            this._playingAnimates.push(ani);
            ani.complete(this.__cb_aniend, this);

            let self:egret.DisplayObject = <any>this;
            ani.bind(self).play();
            return ani;
        }

        findAnimate(idr:any):Animate {
            if (this._playingAnimates)
                return nn.ArrayT.QueryObject(this._playingAnimates, (ani:Animate):boolean=>{
                    return ani.tag == idr;
                });
            return null;
        }

        stopAnimate(idr:any) {
            if (this._playingAnimates == null)
                return;
            let ani = this.findAnimate(idr);
            if (ani == null)
                return;
            ani.stop();
            nn.ArrayT.RemoveObject(this._playingAnimates, ani);
            return;
        }

        stopAllAnimates() {
            if (this._playingAnimates) {
                nn.ArrayT.Clear(this._playingAnimates, (ani:Animate)=>{
                    ani.stop();
                });
            }
        }
        
        private __cb_aniend(s:nn.Slot) {
            let ani = s.sender;
            nn.ArrayT.RemoveObject(this._playingAnimates, ani);
        }
    }

    export var _EUIBaseExtPROTO = _EUIBaseExt.prototype;

    export function ConvertPoint(fromsp:egret.DisplayObject|nn.CComponent, pt:nn.Point, tosp:egret.DisplayObject|nn.CComponent):nn.Point {
        let from:egret.DisplayObject;
        if (fromsp instanceof nn.CComponent)
            from = (<nn.CComponent>fromsp).handle();
        else 
            from = <egret.DisplayObject>fromsp;
        let to:egret.DisplayObject;
        if (tosp instanceof nn.CComponent)
            to = (<nn.CComponent>tosp).handle();
        else 
            to = <egret.DisplayObject>tosp;
        if (from == null)
            from = (<nn.IComponent><any>nn.Application.shared.gameLayer)._imp;
        if (to == null)
            to = (<nn.IComponent><any>nn.Application.shared.gameLayer)._imp;
        from.localToGlobal(pt.x, pt.y, gs_convertpt);
        to.globalToLocal(gs_convertpt.x, gs_convertpt.y, gs_convertpt);
        return new nn.Point(gs_convertpt.x, gs_convertpt.y);
    }
    
    export function ConvertRect(fromsp:egret.DisplayObject|nn.CComponent, rc:nn.Rect, tosp:egret.DisplayObject|nn.CComponent):nn.Rect {
        let from:egret.DisplayObject;
        if (fromsp instanceof nn.CComponent)
            from = (<nn.CComponent>fromsp).handle();
        else 
            from = <egret.DisplayObject>fromsp;
        let to:egret.DisplayObject;
        if (tosp instanceof nn.CComponent)
            to = (<nn.CComponent>tosp).handle();
        else 
            to = <egret.DisplayObject>tosp;
        if (from == null)
            from = (<nn.IComponent><any>nn.Application.shared.gameLayer)._imp;
        if (to == null)
            to = (<nn.IComponent><any>nn.Application.shared.gameLayer)._imp;
        from.localToGlobal(rc.x, rc.y, gs_convertpt);
        to.globalToLocal(gs_convertpt.x, gs_convertpt.y, gs_convertpt);
        return new nn.Rect(gs_convertpt.x, gs_convertpt.y,
                           rc.width, rc.height);        
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