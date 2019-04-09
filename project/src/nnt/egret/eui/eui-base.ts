// 为了阻止wing莫名其妙的感知
let eeui = eui;

// 模块为毛这样命名而不是命名为 nn.eui 是因为2b的wing不能识别nn.eui.这种多级的并且也不识别nneui这种
module eui {


    export type StackPageType = nn.InstanceType<egret.DisplayObject>;
    export type UiType = egret.DisplayObject;

    export interface IViewStack {
        push(page: egret.DisplayObject);

        pop();

        pages(): egret.DisplayObject[];
    }

    export class ComponentU extends eui.Component implements eui.IItemRenderer {

        constructor() {
            super();
            this.touchEnabled = false;
            this.addEventListener(eui.UIEvent.COMPLETE, this.__cmp_completed, this);
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.__cmp_completed, this);
        }

        // 当皮肤处理完成后调用
        onLoaded() {
            // pass
        }

        private __created: boolean;
        private __thmcreated: boolean;

        private __cmp_completed(evt: UIEvent) {
            if (!this.skinName)
                this.__thmcreated = true;
            if (evt.type == eui.UIEvent.COMPLETE) {
                this.__created = true;
                if (this.__thmcreated)
                    this.onLoaded();
            } else if (evt.type == eui.UIEvent.CREATION_COMPLETE) {
                this.__thmcreated = true;
                if (this.__created)
                    this.onLoaded();
            }
        }

        /** 直接配置信号 */
        public slots: string = null;

        /** 灵活的任意配置的数据 */
        public tag: any = null;

        /** 业务中经常会遇到对于该组件的描述，底层提供避免业务重复声明
         @note 不使用public公开的原因是通常业务层需要重载以实现具体的回馈
         */
        protected _help: any = null;
        get help(): any {
            return this._help;
        }

        set help(h: any) {
            this._help = h;
        }

        /** 隶属于的控件，可以方便业务层的数据穿透 */
        belong: any = null;

        protected __disposed = false;
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

            // 移出手势
            this.clearGestures();

            // 停止所有动画
            this.stopAllAnimates();

            // 停止所有计时器
            if (this._timers) {
                this._timers.forEach((e: nn.Timer) => {
                    e.drop();
                });
                this._timers = null;
            }

            if (this.__need_remove_from_launchersmanager)
                nn.Launchers.unregister(<any>this);
        }

        private _gestures: Array<nn.Gesture>;
        get gestures(): Array<nn.Gesture> {
            if (this._gestures == null)
                this._gestures = new Array<nn.Gesture>();
            return this._gestures;
        }

        addGesture(ges: nn.Gesture) {
            // 信号的控制由gesture对象自己控制
            ges.detach();
            ges.attach(this);
        }

        clearGestures() {
            if (this._gestures) {
                nn.ArrayT.Clear(this._gestures, (o: nn.Gesture) => {
                    o.drop();
                });
            }
        }

        timer(duration: nn.Interval, count: number, idr?: string): nn.Timer {
            if (this._timers == null)
                this._timers = new Array<nn.Timer>();
            if (idr != null) {
                let tmr = nn.ArrayT.RemoveObjectByFilter(this._timers, (e: nn.Timer): boolean => {
                    return e.tag == idr;
                });
                if (tmr) {
                    tmr.drop();
                }
            }
            let tmr = new nn.Timer(duration, count);
            tmr.tag = idr;
            tmr.signals.connect(nn.SignalDone, () => {
                nn.ArrayT.RemoveObject(this._timers, tmr);
            }, null);
            this._timers.push(tmr);
            tmr.start();
            // 预先调用一次tick用来更新ui上的显示
            nn.Defer(tmr.oneTick, tmr);
            return tmr;
        }

        private _timers: Array<nn.Timer>;

        // 和core模块的意义相同
        protected onAppeared() {
            ComponentU.ProcessAppeared(this);
        }

        protected onDisappeared() {
            ComponentU.ProcessDisppeared(this);
        }

        static ProcessAppeared(ui: any) {
            for (let i = 0; i < ui.numChildren; ++i) {
                let c: any = ui.getChildAt(i);
                if (c.onAppeared)
                    c.onAppeared();
            }
        }

        static ProcessDisppeared(ui: any) {
            for (let i = 0; i < ui.numChildren; ++i) {
                let c: any = ui.getChildAt(i);
                if (c.onDisappeared)
                    c.onDisappeared();
            }
        }

        onVisibleChanged() {
            if (this._signals)
                this._signals.emit(nn.SignalVisibleChanged);
        }

        $setVisible(b: boolean): boolean {
            if (this.visible != b) {
                super.$setVisible(b);
                this.onVisibleChanged();
                return true;
            }
            return false;
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number) {
            super.$onAddToStage(stage, nestLevel);

            // 如果实现了IFrameRender接口，则自动添加帧渲染的回调
            let self: any = this;
            if (self.onRender) {
                nn.FramesManager.RENDERS.add(self);
            }
        }

        $onRemoveFromStage() {
            super.$onRemoveFromStage();

            let self: any = this;
            if (self.onRender) {
                nn.FramesManager.RENDERS.delete(self);
            }

            // 移除认为是析构
            this.drop();
        }

        protected _initSignals() {
            this._signals.delegate = this;
            this._signals.register(nn.SignalClicked);
            this._signals.register(nn.SignalTouchBegin);
            this._signals.register(nn.SignalTouchEnd);
            this._signals.register(nn.SignalTouchMove);
            this._signals.register(nn.SignalTouchReleased);
            this._signals.register(nn.SignalVisibleChanged);
        }

        protected _signals: nn.Signals;
        get signals(): nn.Signals {
            if (this._signals)
                return this._signals;
            this._instanceSignals();
            return this._signals;
        }

        protected _instanceSignals() {
            this._signals = new nn.Signals(this);
            this._initSignals();
        }

        _signalConnected(sig: string, s?: nn.Slot) {
            switch (sig) {
                case nn.SignalTouchBegin: {
                    this.touchEnabled = true;
                    nn.EventHook(this, egret.TouchEvent.TOUCH_BEGIN, this.__cmp_touchbegin, this);
                }
                    break;
                case nn.SignalTouchEnd: {
                    this.touchEnabled = true;
                    nn.EventHook(this, egret.TouchEvent.TOUCH_END, this.__cmp_touchend, this);
                }
                    break;
                case nn.SignalTouchMove: {
                    this.touchEnabled = true;
                    nn.EventHook(this, egret.TouchEvent.TOUCH_MOVE, this.__cmp_touchmove, this);
                }
                    break;
                case nn.SignalTouchReleased: {
                    this.touchEnabled = true;
                    nn.EventHook(this, egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.__cmp_touchrelease, this);
                }
                    break;
                case nn.SignalClicked: {
                    this.touchEnabled = true;
                    nn.EventHook(this, egret.TouchEvent.TOUCH_TAP, this.__cmp_tap, this);
                }
                    break;
            }
        }

        // 为了支持Arch.ts中定义的模块加载架构
        private __need_remove_from_launchersmanager: boolean;

        private _touch: nn.Touch;
        get touch(): nn.Touch {
            if (this._touch == null)
                this._touch = new nn.Touch();
            return this._touch;
        }

        private __cmp_tap(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this.signals.emit(nn.SignalClicked, t);
            e.stopPropagation();
        }

        private __cmp_touchbegin(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalTouchBegin, t);
        }

        private __cmp_touchend(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalTouchEnd, t);
        }

        private __cmp_touchrelease(e: egret.TouchEvent) {
            if (this.__disposed)
                return;
            let t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalTouchEnd, t);
        }

        private __cmp_touchmove(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalTouchMove, t);
            t.lastPosition.copy(t.currentPosition);
        }

        private bindSlots(e: any) {
            if (!e.slots || e.__slots_binded)
                return;

            // 如果设置了 slots，则需要处理具体的信号连接
            let ss = e.slots.split(';');
            ss.forEach((s: string) => {
                if (s == '')
                    return;
                let a = s.split('=>');
                let sig = egret.getDefinitionByName(a[0]);
                if (sig == null) {
                    nn.warn("找不到皮肤文件里slots中的Signal:" + a[0]);
                    return;
                }
                let tgt = this['_' + a[1]];
                if (typeof (tgt) == 'string') {
                    e.signals.redirect(sig, tgt, this);
                } else {
                    e.signals.connect(sig, tgt, this);
                }
            });

            e.__slots_binded = true;
        }

        setSkinPart(partName: string, instance: any) {
            let varname = partName;
            //nn.noti("绑定变量 " + varname);
            super.setSkinPart(varname, instance);

            // 如果实现了euiext进行扩展处理
            let uiext = <IEUIExt>instance;
            if (uiext.onPartBinded)
                uiext.onPartBinded(partName, this);

            this.bindSlots(instance);
        }

        onPartBinded(name: string, tgt: any) {
            this.belong = tgt;
        }

        addChild(sp: egret.DisplayObject | nn.CComponent): egret.DisplayObject {
            let ui: egret.DisplayObject;
            if (sp instanceof nn.CComponent) {
                ui = (<nn.CComponent>sp).handle();
            } else {
                ui = <egret.DisplayObject>sp;
            }
            return super.addChild(ui);
        }

        addChildAt(sp: egret.DisplayObject | nn.CComponent, idx: number): egret.DisplayObject {
            let ui: egret.DisplayObject;
            if (sp instanceof nn.CComponent) {
                ui = (<nn.CComponent>sp).handle();
            } else {
                ui = <egret.DisplayObject>sp;
            }
            return super.addChildAt(ui, idx);
        }

        removeChild(sp: egret.DisplayObject | nn.CComponent): egret.DisplayObject {
            let ui: egret.DisplayObject;
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

        // 播放动画
        playAnimate(ani: Animate, idr?: any): Animate {
            return _EUIExt.playAnimate(this, ani, idr);
        }

        // 查找身上的动画
        findAnimate(idr: any): Animate {
            return _EUIExt.findAnimate(this, idr);
        }

        // 停止身上的动画
        stopAnimate(idr: any) {
            _EUIExt.stopAnimate(this, idr);
        }

        // 停止身上的所有动画
        stopAllAnimates() {
            _EUIExt.stopAllAnimates(this);
        }

        // 构造一个基础动画对象
        animate(cb: (ani: nn.CAnimate) => void): Promise<void> {
            return _EUIExt.MakeAnimate(this, cb);
        }

        // 约定使用该函数返回容器的上一级
        goBack() {
            _EUIExt.goBack(this);
        }

        protected _data: any = undefined;
        get data(): any {
            return this._data;
        }

        set data(d: any) {
            this._data = d;
            // 如果skin＝＝null，需要业务在onloaded中手动调用updateData来决定刷新的时机
            if (this.skin)
                this.updateData();
        }

        protected _itemIndex: number;
        get itemIndex(): number {
            return this._itemIndex;
        }

        set itemIndex(n: number) {
            this._itemIndex = n;
        }

        protected _selected: boolean;
        get selected(): boolean {
            return this._selected;
        }

        set selected(s: boolean) {
            if (this._selected == s)
                return;
            this._selected = s;
            this.invalidateState();
        }

        getCurrentState(): string {
            if (this._selected)
                return 'down';
            if (this.enabled == false)
                return 'disabled';
            super.getCurrentState();
        }

        public get interactiveEnabled(): boolean {
            return this.touchEnabled;
        }

        public set interactiveEnabled(v: boolean) {
            this.touchEnabled = v;
            this.touchChildren = v;
        }

        setLayoutBoundsSize(width: number, height: number) {
            super.setLayoutBoundsSize(width, height);
        }

        /** 隶属的栈 */
        get viewStack(): IViewStack {
            return _EUIExt.getViewStack(this);
        }

        set viewStack(sck: IViewStack) {
            _EUIExt.setViewStack(this, sck);
        }

        /** 展示与否 */
        get exhibition(): boolean {
            return _EUIExt.getExhibition(this);
        }

        set exhibition(b: boolean) {
            _EUIExt.setExhibition(this, b);
        }

        /** 刷新布局 */
        updateLayout() {
            // pass
        }

        /** 刷新数据 */
        updateData() {
            // pass
        }

        /** 锚点 */
        protected _anchorPointX = 0;
        public get anchorPointX(): number {
            return this._anchorPointX;
        }

        public set anchorPointX(v: number) {
            if (v == this._anchorPointX)
                return;
            this._anchorPointX = v;
            this.invalidateDisplayList();
        }

        protected _anchorPointY = 0;
        public get anchorPointY(): number {
            return this._anchorPointY;
        }

        public set anchorPointY(v: number) {
            if (v == this._anchorPointY)
                return;
            this._anchorPointY = v;
            this.invalidateDisplayList();
        }

        public get anchorPoint(): nn.Point {
            return new nn.Point(this._anchorPointX, this._anchorPointY);
        }

        public set anchorPoint(pt: nn.Point) {
            if (this._anchorPointX == pt.x && this._anchorPointY == pt.y)
                return;
            this._anchorPointX = pt.x;
            this._anchorPointY = pt.y;
            this.invalidateDisplayList();
        }

        // 重载以支持各种需要依赖实际尺寸的功能
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number) {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            if (this._anchorPointX || this._anchorPointY) {
                this.anchorOffsetX = unscaledWidth * this._anchorPointX;
                this.anchorOffsetY = unscaledHeight * this._anchorPointY;
            }
            // 每一次更新均会调整位置
            this.updateLayout();
        }

        convertPointTo(pt: nn.Point, sp: egret.DisplayObject | nn.CComponent): nn.Point {
            return ConvertPoint(this, pt, sp);
        }

        convertRectTo(rc: nn.Rect, sp: egret.DisplayObject | nn.CComponent): nn.Rect {
            return ConvertRect(this, rc, sp);
        }

        updateCache() {
            this.validateDisplayList();
        }

        get frame(): nn.Rect {
            return nn.getFrame(this);
        }

        set frame(rc: nn.Rect) {
            nn.setFrame(this, rc);
        }

        bounds(): nn.Rect {
            return nn.getBounds(this);
        }
    }

    /** 业务非wing重用模块继承该类型 */
    export class SpriteU
        extends ComponentU {

        // pass
    }

    nn.EntryCheckSettings = (cls: any, data: nn.EntrySettings): boolean => {
        if (data.singletone) {
            if (nn.Desktop._AllOpenings.length &&
                nn.IsInherit(cls, eui.DialogU)) {
                let fnd = nn.ArrayT.QueryObject(nn.Desktop._AllOpenings, (dsk: nn.Desktop): boolean => {
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

    // 从皮肤对象提取类对象
    export function getAppClazzForSkin(skin: any): any {
        // 调试模式
        if (typeof generateEUI == 'undefined') {
            let skin_path: string = skin.prototype.__class__;
            if (skin_path.indexOf('Skin') != (skin_path.length - 4)) {
                nn.fatal(`皮肤 ${skin_path} 命名错误，无法获取对应的类`);
                return null;
            }
            return nn.GetObjectOfWindowByKeyPath(nn.StringT.SubStr(skin_path, 0, skin_path.length - 4));
        }

        // 发布模式
        let skin_full_path = nn.ObjectT.QueryKey(generateEUI.paths, (v, k) => {
            return v == skin;
        });
        let clazz_path = nn.ObjectT.QueryKey(generateEUI.skins, (v, k) => {
            return v == skin_full_path;
        });
        return nn.GetObjectOfWindowByKeyPath(clazz_path);
    }
}
