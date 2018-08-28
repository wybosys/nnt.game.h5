module nn {

    let gs_convertpt = new egret.Point();
    let gs_convertrc = new egret.Rectangle();

    export class Touch extends CTouch {
        get target(): any {
            return this._e.target;
        }

        get currentTarget(): any {
            return this._e.currentTarget;
        }

        private _e: egret.TouchEvent;

        set _event(e: egret.TouchEvent) {
            this._e = e;
            if (e == null)
                return;

            let x, y;
            if (e.currentTarget != e.target) {
                // 需要转化到当前
                e.currentTarget.globalToLocal(e.stageX, e.stageY, gs_convertpt);
                x = gs_convertpt.x;
                y = gs_convertpt.y;
            } else {
                x = e.localX;
                y = e.localY;
            }

            x *= ScaleFactorDeX;
            y *= ScaleFactorDeY;

            switch (e.type) {
                case egret.TouchEvent.TOUCH_MOVE: {
                    this.currentPosition.reset(x, y);
                }
                    break;
                case egret.TouchEvent.TOUCH_BEGIN: {
                    this.startPosition.reset(x, y);
                    this.lastPosition.copy(this.startPosition);
                    this.currentPosition.copy(this.startPosition);
                }
                    break;
                case egret.TouchEvent.TOUCH_END:
                case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:
                case egret.TouchEvent.TOUCH_TAP: {
                    this.currentPosition.reset(x, y);
                }
                    break;
            }
        }

        cancel() {
            this._e.stopImmediatePropagation();
        }

        veto() {
            this._e.stopPropagation();
        }

        positionInView(v: CComponent): Point {
            let c = CComponent.FromImp(this._e.currentTarget);
            return c.convertPointTo(this.currentPosition, v);
        }
    }

    class ExtSprite extends egret.Sprite {
        constructor() {
            super();
            this.width = 0;
            this.height = 0;
        }

        $hitTest(stageX: number, stageY: number): egret.DisplayObject {
            let cmp = CComponent.FromImp(this);
            if (cmp)
                return cmp.hitTest(stageX, stageY);
            return super.$hitTest(stageX, stageY);
        }

        $measureContentBounds(rc: egret.Rectangle) {
            rc.width = this.width;
            rc.height = this.height;
        }
    }

    export class ExtBitmap extends egret.Bitmap {
        constructor() {
            super();
            this.width = 0;
            this.height = 0;
        }
    }

    export class Component extends CComponent {
        constructor() {
            super();
        }

        protected createImp() {
            this._imp = new ExtSprite();
        }

        _signalConnected(sig: string, s?: Slot) {
            super._signalConnected(sig, s);
            switch (sig) {
                case SignalTouchBegin:
                case SignalTouchEnd:
                case SignalTouchMove: {
                    this.touchEnabled = true;
                    EventHook(this._imp, egret.TouchEvent.TOUCH_BEGIN, this.__dsp_touchbegin, this);
                    EventHook(this._imp, egret.TouchEvent.TOUCH_END, this.__dsp_touchend, this);
                    EventHook(this._imp, egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.__dsp_touchrelease, this);
                    EventHook(this._imp, egret.TouchEvent.TOUCH_MOVE, this.__dsp_touchmove, this);
                }
                    break;
                case SignalAddedToStage: {
                    EventHook(this._imp, egret.Event.ADDED_TO_STAGE, this.__dsp_addedtostage, this);
                }
                    break;
                case SignalClicked: {
                    this.touchEnabled = true;
                    EventHook(this._imp, egret.TouchEvent.TOUCH_TAP, this.__dsp_tap, this);
                }
                    break;
                case SignalPreTouch: {
                    EventHook(this._imp, egret.TouchEvent.TOUCH_BEGIN, this.__dsp_pretouch, this, true);
                    EventHook(this._imp, egret.TouchEvent.TOUCH_END, this.__dsp_pretouch, this, true);
                    EventHook(this._imp, egret.TouchEvent.TOUCH_MOVE, this.__dsp_pretouch, this, true);
                }
                    break;
                case SignalPreClick: {
                    EventHook(this._imp, egret.TouchEvent.TOUCH_TAP, this.__dsp_preclick, this, true);
                }
                    break;
            }
        }

        dispose() {
            if (DEBUG && this._imp == null) {
                fatal('错误的多次析构UI对象 ' + Classname(this));
            }

            // 经过测试，addEventListener 当imp＝＝null的时候会自动释放，所以不需要清除之前hook的event

            for (let i = 0; i < this._imp.numChildren; ++i) {
                let c = this.getChildAt(i);
                if (c)
                    c.drop();
            }

            this._touch = undefined;
            super.dispose();
        }

        protected instance() {
            this._imp = new egret.Sprite();
        }

        protected validate(): boolean {
            let imp = this._imp;
            return imp != null
                && imp.width > 0
                && imp.height > 0;
        }

        protected hitTestChild(x: number, y: number): egret.DisplayObject {
            return egret.Sprite.prototype.$hitTest.call(this._imp, x, y);
        }

        protected hitTestClient(stageX: number, stageY: number): egret.DisplayObject {
            let imp = this._imp;
            if (!imp.$renderNode || !imp.$visible) {
                return null;
            }
            let m = imp.$getInvertedConcatenatedMatrix();
            let localX = m.a * stageX + m.c * stageY + m.tx;
            let localY = m.b * stageX + m.d * stageY + m.ty;
            return Rect.ContainsPoint(localX, localY,
                0, 0, imp.width, imp.height) ?
                imp : null;
        }

        get onStage(): boolean {
            return this._imp.stage != null;
        }

        // 归属于实例上的家在资源转为egret专版实现，主n2egret版本建议使用静态资源定义的方式
        resourceGroups: Array<string>;
        clazzResourceProgress: any;
        showResourceProgress: boolean;

        /** 加载场景，如果存在设定的资源组，则需要提前加载资源组 */
        loadScene(cb: () => void, ctx: any) {
            if (!ResManager.isGroupsArrayLoaded(this.resourceGroups)) {
                let res = ResManager.capsules(this.resourceGroups);
                if (this.showResourceProgress) {
                    if (RESOURCELOADINGISHUD) {
                        Hud.ShowProgress();
                        res.load(() => {
                            Hud.HideProgress();
                            cb.call(ctx);
                        });
                    } else {
                        let cls = this.clazzResourceProgress;
                        if (cls == null)
                            cls = CApplication.shared.clazzResourceProgress.type;
                        let loading = new cls();
                        res.signals.connect(SignalChanged, (s: Slot) => {
                            (<IProgress>loading).progressValue = s.data;
                        }, null);
                        loading.open(false);
                        res.load(() => {
                            loading.close();
                            cb.call(ctx);
                        });
                    }
                } else {
                    res.load(() => {
                        cb.call(ctx);
                    });
                }
            } else {
                cb.call(ctx);
            }
        }

        addChild(c: CComponent, layout = true) {
            this._imp.addChild((<IComponent><any>c)._imp);
            (<Component>c).loadScene(() => {
                if (this.__disposed)
                    return; // 加载延迟但是UI已经关掉
                this.onChildAdded(c, layout);
            }, this);
        }

        addChildAt(c: CComponent, idx: number, layout = true) {
            this._imp.addChildAt((<IComponent><any>c)._imp, idx);
            (<Component>c).loadScene(() => {
                if (this.__disposed)
                    return; // 加载延迟但是UI已经关掉
                this.onChildAdded(c, layout);
            }, this);
        }

        removeChild(c: CComponent) {
            this._imp.removeChild((<IComponent><any>c)._imp);
            this.onChildRemoved(c);
        }

        removeChildren() {
            this.children.forEach((c: CComponent) => {
                this.removeChild(c);
            }, this);
            this._imp.removeChildren();
        }

        getChildAt(idx: number): CComponent {
            return Component.FromImp(this._imp.getChildAt(idx));
        }

        setChildIndex(c: CComponent, idx: number) {
            this._imp.setChildIndex(c.handle(), idx);
        }

        getChildIndex(c: CComponent) {
            return this._imp.getChildIndex(c.handle());
        }

        swapChildAt(idx0: number, idx1: number) {
            this._imp.swapChildrenAt(idx0, idx1);
        }

        swapChild(l: CComponent, r: CComponent) {
            this._imp.swapChildren(l.handle(), r.handle());
        }

        hasChild(c: CComponent): boolean {
            return this._imp.contains(c.handle());
        }

        bringFront(v?: CComponent) {
            let idx = v ? this.parent.getChildIndex(v) : (<IComponent><any>this.parent)._imp.numChildren;
            (<IComponent><any>this.parent)._imp.setChildIndex(this._imp, idx);
        }

        sendBack(v?: CComponent) {
            let idx = v ? this.parent.getChildIndex(v) : 0;
            if (idx > 0)
                --idx;
            (<IComponent><any>this.parent)._imp.setChildIndex(this._imp, idx);
        }

        hollowOut(c: CComponent) {
            c.handle().blendMode = egret.BlendMode.ERASE;
            this._imp.addChild(c.handle());
            this.hasHollowOut = true;
        }

        get numChildren(): number {
            return this._imp.numChildren;
        }

        get zPosition(): number {
            let imp: any = this._imp;
            if (imp.parent == null)
                return imp._zposition;
            let num = imp.parent.numChildren;
            let idx = imp.parent.getChildIndex(imp);
            return num - 1 - idx;
        }

        set zPosition(pos: number) {
            let self = this;
            let imp = self._imp;
            if (imp._zposition == pos)
                return;
            imp._zposition = pos;
            if (imp.parent == null)
                return;
            self.parent.setNeedsZPosition();
        }

        static _SortDepth(l: any, r: any): number {
            return r._zposition - l._zposition;
        }

        updateZPosition() {
            let self = this;
            let imp = self._imp;
            let cnt = imp.numChildren;

            // 和default来比较，分别排序
            let depthsPos = [], depthsNeg = [];
            for (let i = 0; i < cnt; ++i) {
                let c: any = imp.getChildAt(i);
                if (c._zposition > ZPOSITION.DEFAULT)
                    depthsPos.push(c);
                else if (c._zposition < ZPOSITION.DEFAULT)
                    depthsNeg.push(c);
            }

            // 越小代表越靠近用户
            if (depthsNeg.length) {
                // 优先排列所有具有层次关系的，避免被普通的对象遮盖住
                depthsNeg.sort(Component._SortDepth);
                depthsNeg.forEach((c: egret.DisplayObject) => {
                    imp.setChildIndex(c, cnt);
                });
            }

            // 越大代表越远离
            if (depthsPos.length) {
                depthsPos.sort(Component._SortDepth);
                depthsPos.forEach((c: egret.DisplayObject, i: number) => {
                    imp.setChildIndex(c, 0);
                });
            }
        }

        get children(): Array<CComponent> {
            let r = [];
            for (let i = 0; i < this.numChildren; ++i) {
                let t = Component.FromImp(this._imp.getChildAt(i));
                t && r.push(t);
            }
            return r;
        }

        get parent(): CComponent {
            if (DEBUG && this._imp == null) {
                warn('实例已经析构或尚未实现，请检查对象生命期，使用grab和drop手动维护');
            }
            let p = this._imp.parent;
            return p ? Component.FromImp(p) : null;
        }

        get touchEnabled(): boolean {
            return this._imp.touchEnabled;
        }

        set touchEnabled(b: boolean) {
            this._imp.touchEnabled = b;
        }

        get touchChildren(): boolean {
            return this._imp.touchChildren;
        }

        set touchChildren(b: boolean) {
            this._imp.touchChildren = b;
        }

        get visible(): boolean {
            return this._imp.visible;
        }

        set visible(b: boolean) {
            if (b == this._imp.visible)
                return;
            this._imp.visible = b;
            this.onVisibleChanged();
        }

        get clipsToBounds(): boolean {
            return this._imp.mask != null;
        }

        set clipsToBounds(b: boolean) {
            if (this._imp.mask && !b)
                this._imp.mask = undefined;
            else if (this._imp.mask == null && b)
                this._imp.mask = <any>new Rect(0, 0, this._imp.width, this._imp.height);
        }

        get clipsRegion(): Rect {
            return <any>this._imp.mask;
        }

        set clipsRegion(rc: Rect) {
            this._imp.mask = <any>rc;
        }

        get maskView(): CComponent {
            let m = this._imp.mask;
            return m ? m._fmui : null;
        }

        set maskView(v: CComponent) {
            this._imp.mask = v.handle();
        }

        set animate(ani: CAnimate) {
            ani.clone().bind(this).play();
        }

        get animate(): CAnimate {
            warn("Component的animate只允许set");
            return null;
        }

        private _translate: Point;
        get translate(): Point {
            return this._translate ? this._translate.clone() : null;
        }

        set translate(pt: Point) {
            let rc = this.frame;
            if (this._translate) {
                rc.x -= this._translate.x;
                rc.y -= this._translate.y;
            }
            this._translate = pt;
            this.frame = rc;
        }

        private _scale: Point;
        get scale(): Point {
            return this._scale;
        }

        set scale(pt: Point) {
            this._scale = pt;
            this._imp.scaleX = pt ? pt.x : 1;
            this._imp.scaleY = pt ? pt.y : 1;
        }

        private _rotation: Angle;
        get rotation(): Angle {
            return this._rotation;
        }

        set rotation(ang: Angle) {
            this._rotation = ang;
            this._imp.rotation = ang ? ang.angle : 0;
        }

        set alpha(v: number) {
            this._imp.alpha = v;
        }

        get alpha(): number {
            return this._imp.alpha;
        }

        private _cacheEnabled: boolean;
        get cacheEnabled(): boolean {
            return this._cacheEnabled;
        }

        set cacheEnabled(b: boolean) {
            if (this._cacheEnabled == b)
                return;
            this._cacheEnabled = b;
            this._imp.cacheAsBitmap = b;
        }

        flushCache() {
            // egret2.5的实现会自动刷新
        }

        updateCache() {
            // egret2.5的实现会自动刷新
        }

        setNeedsCache() {
            // egret2.5的实现会自动刷新
        }

        private _anchorPoint: Point;

        get anchor(): Point {
            return this._anchorPoint;
        }

        set anchor(pt: Point) {
            if (nn.ObjectT.IsEqual(pt, this._anchorPoint))
                return;
            this._anchorPoint = pt;
            this._anchorOffset = undefined;
            if (pt == null) {
                let dx: number = this._imp.anchorOffsetX;
                let dy: number = this._imp.anchorOffsetY;
                this._imp.x -= dx;
                this._imp.y -= dy;
                this._imp.anchorOffsetX = 0;
                this._imp.anchorOffsetY = 0;
            } else {
                let dx: number = pt.x * this._imp.width;
                let dy: number = pt.y * this._imp.height;
                this._imp.anchorOffsetX = dx;
                this._imp.anchorOffsetY = dy;
                this._imp.x += dx;
                this._imp.y += dy;
            }
        }

        private _anchorOffset: Point;
        get anchorOffset(): Point {
            return this._anchorOffset;
        }

        set anchorOffset(pt: Point) {
            if (nn.ObjectT.IsEqual(pt, this._anchorOffset))
                return;
            this._anchorOffset = pt;
            this._anchorPoint = null;
            // 恢复一下原始位置
            this._imp.x -= this._imp.anchorOffsetX;
            this._imp.y -= this._imp.anchorOffsetY;
            if (pt == null) {
                this._imp.anchorOffsetX = 0;
                this._imp.anchorOffsetY = 0;
            } else {
                this._imp.anchorOffsetX = pt.x;
                this._imp.anchorOffsetY = pt.y;
                this._imp.x += pt.x;
                this._imp.y += pt.y;
            }
        }

        set frame(rc: Rect) {
            this.setFrame(rc, true);
        }

        get frame(): Rect {
            let x = this._imp.x;
            let y = this._imp.y;
            let w = this._imp.width;
            let h = this._imp.height;

            // 如过有锚点，需要扣除掉为了让egret渲染符合我们的定义而做的偏移
            if (this._anchorPoint || this._anchorOffset) {
                x -= this._imp.anchorOffsetX;
                y -= this._imp.anchorOffsetY;
            }

            // 不对translate做反偏移，避免业务层取到的位置不是显示的位置

            x *= ScaleFactorDeX;
            y *= ScaleFactorDeY;
            w *= ScaleFactorDeW;
            h *= ScaleFactorDeH;

            return new Rect(x, y, w, h);
        }

        setFrame(rc: Rect, anchor: boolean = true) {
            let x = rc.x * ScaleFactorX;
            let y = rc.y * ScaleFactorY;
            let w = rc.width * ScaleFactorW;
            let h = rc.height * ScaleFactorH;

            // 偏移
            if (this._translate) {
                x += this._translate.x * ScaleFactorX;
                y += this._translate.y * ScaleFactorY;
            }

            // 计算锚点
            if (anchor && this._anchorPoint) {
                let dx = this._anchorPoint.x * w;
                let dy = this._anchorPoint.y * h;
                this._imp.anchorOffsetX = dx;
                this._imp.anchorOffsetY = dy;
                x += dx;
                y += dy;
            }

            // 规整
            if (!this.floatCoordinate) {
                x = Integral(x);
                y = Integral(y);
                w = Integral(w);
                h = Integral(h);
            }

            let imp = this._imp;
            let layout = imp.width != w || imp.height != h;
            imp.x = x;
            imp.y = y;
            imp.width = w;
            imp.height = h;
            if (imp.mask instanceof egret.Rectangle)
                (<egret.Rectangle>imp.mask).setTo(0, 0, w, h);
            if (layout)
                this.setNeedsLayout();
        }

        getX(): number {
            return this._imp.x * ScaleFactorDeX;
        }

        getY(): number {
            return this._imp.y * ScaleFactorDeY;
        }

        getWidth(): number {
            return this._imp.width * ScaleFactorDeW;
        }

        getHeight(): number {
            return this._imp.height * ScaleFactorDeH;
        }

        protected impSetFrame(rc: Rect, ui: egret.DisplayObject) {
            if (!this.floatCoordinate) {
                ui.x = Integral(rc.x * ScaleFactorX);
                ui.y = Integral(rc.y * ScaleFactorY);
                ui.width = Integral(rc.width * ScaleFactorW);
                ui.height = Integral(rc.height * ScaleFactorH);
            } else {
                ui.x = rc.x * ScaleFactorX;
                ui.y = rc.y * ScaleFactorY;
                ui.width = rc.width * ScaleFactorW;
                ui.height = rc.height * ScaleFactorH;
            }
        }

        bounds(): Rect {
            return new Rect(0, 0,
                this._imp.width * ScaleFactorDeW,
                this._imp.height * ScaleFactorDeH);
        }

        private _backgroundColor: ColorType;
        get backgroundColor(): ColorType {
            return this._backgroundColor;
        }

        set backgroundColor(c: ColorType) {
            this._backgroundColor = c;
            this._drawBackground(null);
        }

        private _borderLine: Line;
        get borderLine(): Line {
            return this._borderLine;
        }

        set borderLine(l: Line) {
            this._borderLine = l;
            this._drawBackground(null);
        }

        private _backgroundImageSource: TextureSource;
        private _backgroundImageView: ExtBitmap;

        get backgroundImage(): TextureSource {
            if (this._backgroundImageView == null)
                return null;
            COriginType.shared.imp = this._backgroundImageView.texture;
            return COriginType.shared;
        }

        set backgroundImage(ts: TextureSource) {
            if (this._backgroundImageSource == ts)
                return;
            this._backgroundImageSource = ts;
            if (ts == null) {
                if (this._backgroundImageView)
                    this._backgroundImageView.texture = null;
                return;
            }
            if (this._backgroundImageView == null) {
                this._backgroundImageView = new ExtBitmap();
                this._imp.addChildAt(this._backgroundImageView, 0);
                this.setNeedsLayout();
            }
            ResManager.getTexture(ts, ResPriority.NORMAL, (tex: ICacheTexture) => {
                if (this._backgroundImageSource != ts)
                    return; // 多次设置以最后一次为准
                impSetTexture(this._backgroundImageView, tex.use());
            }, this);
        }

        private _lyrBackground: egret.Shape;

        protected _drawBackground(rc: Rect) {
            let self = this;
            if (rc == null) {
                rc = self.bounds()
                    .applyEdgeInsets(self.backgroundEdgeInsets)
                    .applyScaleFactor();
            }

            // 如过镂空，则需要新建一个层负责绘制背景
            let gra: egret.Graphics;
            if (self.hasHollowOut) {
                let lyr = self._lyrBackground;
                if (lyr == null) {
                    lyr = new egret.Shape();
                    (<any>lyr)._zposition = ZPOSITION.DEFAULT + 1;
                    self._imp.addChildAt(lyr, 0);
                    self._lyrBackground = lyr;
                }
                lyr.x = rc.x;
                lyr.y = rc.y;
                lyr.width = rc.width;
                lyr.height = rc.height;
                gra = lyr.graphics;
                // 此中状态下，背景其实是画在内部
                rc.x = rc.y = 0;
            } else {
                gra = self._imp.graphics;
            }

            gra.clear();
            let color = self._backgroundColor;
            if (color) {
                gra.beginFill.apply(gra, GetColorComponent(color));
                gra.drawRect(rc.x, rc.y, rc.width, rc.height);
                gra.endFill();
            }
            let line = self._borderLine;
            if (this._borderLine) {
                let colors = GetColorComponent(line.color);
                gra.lineStyle(line.width, colors[0], colors[1], line.smooth);
                gra.drawRect(rc.x, rc.y, rc.width, rc.height);
            }
        }

        private _gestures: Array<Gesture>;
        get gestures(): Array<Gesture> {
            if (this._gestures == null)
                this._gestures = new Array<Gesture>();
            return this._gestures;
        }

        addGesture(ges: Gesture) {
            // 信号的控制由gesture对象自己控制
            ges.detach();
            ges.attach(this);
        }

        clearGestures() {
            if (this._gestures) {
                nn.ArrayT.Clear(this._gestures, (o: Gesture) => {
                    o.drop();
                });
            }
        }

        updateLayout() {
            super.updateLayout();
            let bkgrc = this.bounds()
                .applyEdgeInsets(this.backgroundEdgeInsets)
                .applyScaleFactor();

            if (this._backgroundColor)
                this._drawBackground(bkgrc);
            let iv = this._backgroundImageView;
            if (iv) {
                iv.x = bkgrc.x;
                iv.y = bkgrc.y;
                iv.width = bkgrc.width;
                iv.height = bkgrc.height;
            }
        }

        private _touch: Touch;
        get touch(): Touch {
            if (this._touch == null)
                this._touch = new Touch();
            return this._touch;
        }

        private __dsp_touchbegin(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(SignalTouchBegin, t);
        }

        private __dsp_touchend(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(SignalTouchEnd, t);
        }

        private __dsp_touchrelease(e: egret.TouchEvent) {
            if (this.__disposed)
                return;
            let t = this.touch;
            t._event = e;
            this._signals.emit(SignalTouchEnd, t);
        }

        private __dsp_touchmove(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(SignalTouchMove, t);
            t.lastPosition.copy(t.currentPosition);
        }

        private __dsp_pretouch(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(SignalPreTouch, t);
        }

        private __dsp_preclick(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(SignalPreClick, t);
        }

        private __dsp_addedtostage() {
            this._signals.emit(SignalAddedToStage);
        }

        private __dsp_tap(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(SignalClicked, t);
            // 防止之后的被点击
            e.stopPropagation();
        }

        convertPointTo(pt: Point, des: CComponent): Point {
            let from: egret.DisplayObject = this._imp;
            let to: egret.DisplayObject = des ? (<IComponent><any>des)._imp : (<IComponent><any>CApplication.shared.gameLayer)._imp;
            from.localToGlobal(pt.x * ScaleFactorX, pt.y * ScaleFactorY, gs_convertpt);
            to.globalToLocal(gs_convertpt.x, gs_convertpt.y, gs_convertpt);
            gs_convertpt.x *= ScaleFactorDeX;
            gs_convertpt.y *= ScaleFactorDeY;
            return new Point(gs_convertpt.x, gs_convertpt.y);
        }

        convertRectTo(rc: Rect, des: CComponent): Rect {
            let from: egret.DisplayObject = this._imp;
            let to: egret.DisplayObject = des ? (<IComponent><any>des)._imp : (<IComponent><any>CApplication.shared.gameLayer)._imp;
            from.localToGlobal(rc.x * ScaleFactorX, rc.y * ScaleFactorY, gs_convertpt);
            to.globalToLocal(gs_convertpt.x, gs_convertpt.y, gs_convertpt);
            gs_convertpt.x *= ScaleFactorDeX;
            gs_convertpt.y *= ScaleFactorDeY;
            return new Rect(gs_convertpt.x, gs_convertpt.y,
                rc.width, rc.height);
        }

        renderToTexture(): TextureSource {
            gs_convertrc.x = gs_convertrc.y = 0;
            gs_convertrc.width = this._imp.width;
            gs_convertrc.height = this._imp.height;

            // 刷新一次图形缓存
            this.updateCache();

            // draw到内存纹理中
            let tex = new egret.RenderTexture();
            if (tex.drawToTexture(this._imp, gs_convertrc) == false)
                warn("绘制 ui 到纹理失败");

            COriginType.shared.imp = tex;
            return COriginType.shared;
        }
    }

    export function impSetTexture(bmp: egret.Bitmap, tex: egret.Texture) {
        let part = tex ? tex[ResPartKey] : null;
        let p9 = tex ? tex['scale9Grid'] : null;
        if (part) {
            let url = new URL(part);
            if (url.fields['repeat'] !== undefined)
                bmp.fillMode = egret.BitmapFillMode.REPEAT;
            if (url.fields['point9'] !== undefined) {
                let r = ArrayT.Convert(url.fields['point9'].split(','), (e: string): number => {
                    return parseInt(e);
                });
                p9 = new egret.Rectangle(r[0], r[1], r[2], r[3]);
            }
        }

        bmp.texture = tex;
        bmp.scale9Grid = p9;
    }

    let __PROTO: any = Point.prototype;
    __PROTO.setTo = function (x: number, y: number) {
        this.x = x;
        this.y = y;
    };
}
