module nn {

    // 中间层定义
    export interface IComponent {
        _imp: any;
    }

    /** 内部实现的基类 */
    export abstract class CComponent extends SObject implements IReqResources {
        constructor() {
            super();
            // 绑定内部控件双方
            this.createImp();
            if (this._imp)
                (<any>this._imp)._fmui = this;
        }

        // 获取内部实现的控件的实体
        protected _imp: any;

        handle(): any {
            return this._imp;
        }

        // 创建实现类的实例
        protected abstract createImp();

        // 获得内部控件对应的UI对象
        static FromImp(imp: any): any {
            return imp._fmui;
        }

        // debugClassname
        get descriptionName(): string {
            return Classname(this);
        }

        protected _instanceSignals() {
            super._instanceSignals();
            this._signals.delegate = this;
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalTouchBegin);
            this._signals.register(SignalTouchEnd);
            this._signals.register(SignalTouchMove);
            this._signals.register(SignalTouchReleased);
            this._signals.register(SignalConstriantChanged);
            this._signals.register(SignalLoaded);
            this._signals.register(SignalAddedToStage);
            this._signals.register(SignalClicked);
            this._signals.register(SignalPreTouch);
            this._signals.register(SignalPreClick);
        }

        dispose() {
            // 断开gui类和实现类的关系
            (<any>this._imp)._fmui = undefined;
            this._imp = undefined;

            // 清空附加数据
            this.tag = undefined;
            this._viewStack = undefined;
            if (this._states) {
                this._states.drop();
                this._states = undefined;
            }
            if (this.transitionObject) {
                this.transitionObject.drop();
                this.transitionObject = undefined;
            }
            this.clearGestures();

            // 停止所有相关的动画
            this.stopAllAnimates();

            super.dispose();
        }

        // 子类空间处理实现相关的事件绑定
        _signalConnected(sig: string, s?: Slot) {
        }

        // override 计算点击到哪个子元素
        protected abstract hitTestChild(x: number, y: number): any;

        // override 计算点击到自身
        protected abstract hitTestClient(x: number, y: number): any;

        // 计算点击
        protected hitTest(x: number, y: number): any {
            if (this.touchChildren == false)
                return this.hitTestClient(x, y);
            let r = this.hitTestChild(x, y);
            if (r == null)
                r = this.hitTestClient(x, y);
            return r;
        }

        /** 标记 */
        tag: any;

        protected validate(): boolean {
            return true;
        }

        // override 加子控件
        // 注意如果add一个已经有parent的元素，则自动切换到新的parent
        abstract addChild(c: CComponent);
        abstract addChild(c: CComponent, layout: boolean);

        // override 加子控件
        abstract addChildAt(c: CComponent, idx: number);
        abstract addChildAt(c: CComponent, idx: number, layout: boolean);

        // override 获得子控件
        abstract getChildAt(idx: number): CComponent;

        // override 子控件的index
        abstract setChildIndex(c: CComponent, idx: number);

        abstract getChildIndex(c: CComponent): number;

        // override 交换两个子控件
        abstract swapChildAt(idx0: number, idx1: number);

        abstract swapChild(l: CComponent, r: CComponent);

        // override 删除所有子控件
        abstract removeChildren();

        // override 移除子控件
        abstract removeChild(c: CComponent);

        // override 判断是否含有子控件
        abstract hasChild(c: CComponent): boolean;

        // 通过tag来查找控件
        getChildByTag(tag: any): CComponent {
            let chds = this.children;
            for (let i = 0; i < chds.length; ++i) {
                if (chds[i].tag == tag)
                    return chds[i];
            }
            return null;
        }

        // override 提到最前
        abstract bringFront(v?: CComponent);

        // override 放到最后
        abstract sendBack(v?: CComponent);

        // override 镂空子控件
        abstract hollowOut(c: CComponent);

        // 是否含有镂空的控件
        hasHollowOut: boolean;

        // override 直接调整z位置
        zPosition: number;

        // 当子级加入时业务级调用
        protected onChildAdded(c: CComponent, layout: boolean) {
            // 子元素的加入需要更新一下自身的布局
            if (layout && !this.__islayouting && this.validate())
                this.setNeedsLayout();
            // 如果已经显示在舞台，激活一下appear
            if (c.onStage)
                c.setNeedsAppear();

            // 回调加载成功
            c.onLoaded();
            // 资源也准备好了
            c.updateResource();
        }

        // override 更新子类的z轴顺序
        abstract updateZPosition();

        // 当子级移除时业务级调用
        protected onChildRemoved(c: CComponent) {
            c.drop();
        }

        /** 是否已经在舞台中 */
        onStage: boolean;

        /** 父级 */
        parent: CComponent;

        /** 隶属的元素，一般为父级 */
        private _belong: CComponent;
        get belong(): CComponent {
            return this._belong ? this._belong : this.parent;
        }

        set belong(c: CComponent) {
            this._belong = c;
        }

        /** 触摸开关 */
        touchEnabled: boolean;
        touchChildren: boolean;

        /** 是否可以触摸 */
        get interactiveEnabled(): boolean {
            return this.touchEnabled || this.touchChildren;
        }

        set interactiveEnabled(b: boolean) {
            this.touchEnabled = b;
            this.touchChildren = b;
        }

        /** 缓存开关 */
        cacheEnabled: boolean;

        /** 裁剪 */
        clipsToBounds: boolean;

        /** 裁剪区域 */
        clipsRegion: Rect;

        /** 使用view的透明区来表示遮罩 */
        maskView: CComponent;

        /** 计算位置的方式 */
        locatingType = LocatingType.LAYOUT;

        /** 设置相对位置，需要在适当的地方（通常为updateLayout调用一下update */
        relativeFrame: RRect;

        updateRelativeLayout(inview?: CComponent, anchor?: boolean) {
            if (this.relativeFrame == null ||
                this.locatingType == LocatingType.LAYOUT)
                return;

            if (inview == null)
                inview = this.parent;
            var prc = inview.boundsForLayout();
            var rc = this.relativeFrame.toRect(prc);

            // 计算最终frame
            if (nn.Mask.isset(LocatingType.SCALE_FACTOR_X, this.locatingType))
                rc.x *= StageScaleFactorX;
            if (nn.Mask.isset(LocatingType.SCALE_FACTOR_Y, this.locatingType))
                rc.y *= StageScaleFactorY;
            if (nn.Mask.isset(LocatingType.SCALE_FACTOR_WIDTH, this.locatingType))
                rc.width *= StageScaleFactorX;
            if (nn.Mask.isset(LocatingType.SCALE_FACTOR_HEIGHT, this.locatingType))
                rc.height *= StageScaleFactorY;

            this.setFrame(rc, anchor);
        }

        /** 动画变成属性
         @note 只允许设置，不允许get，设计的CAnimate会当结束后自动释放掉自己
         */
        set animate(ani: CAnimate) {
            // override
        }

        /** 播放动画
         @note 有别于直接通过ani播放动画，可以避免loop动画忘记stop引起的内存泄漏，以及如过当页面invisble时，不及时pause动画导致额外消耗计算资源，返回用于动画的实际的实体
         */
        private _playingAnimates: Array<CAnimate>;

        playAnimate(ani: CAnimate, idr?: any): CAnimate {
            if (idr == null)
                idr = ani.tag ? ani.tag : ani.hashCode;

            if (this._playingAnimates == null)
                this._playingAnimates = new Array<CAnimate>();
            if (this.findAnimate(idr) != null) {
                warn("存在同样名字的动画");
                return null;
            }

            ani = ani.clone();
            ani.tag = idr;
            this._playingAnimates.push(ani);
            ani.complete(this.__cb_aniend, this);
            ani.bind(this).play();
            return ani;
        }

        /** 根据id查找动画 */
        findAnimate(idr: any): CAnimate {
            if (this._playingAnimates)
                return nn.ArrayT.QueryObject(this._playingAnimates, (ani: CAnimate): boolean => {
                    return ani.tag == idr;
                });
            return null;
        }

        /** 根据id停止动画 */
        stopAnimate(idr: any) {
            if (this._playingAnimates == null)
                return;
            let ani = this.findAnimate(idr);
            if (ani == null)
                return;
            ani.stop();
            nn.ArrayT.RemoveObject(this._playingAnimates, ani);
            return;
        }

        /** 停止所有的动画 */
        stopAllAnimates() {
            if (this._playingAnimates) {
                nn.ArrayT.Clear(this._playingAnimates, (ani: CAnimate) => {
                    ani.stop();
                });
            }
        }

        private __cb_aniend(s: Slot) {
            // 移除播放结束的
            let ani = s.sender;
            nn.ArrayT.RemoveObject(this._playingAnimates, ani);
            //noti("动画 " + ani.tag + " 停止");
        }

        /** 锚点
         @note 约定如下：
         1，不论锚点位置，setframe始终设置的是控件的外沿的范围（保证逻辑和所见一致）
         2，不论锚点位置，getframe 获得的始终为控件外沿的范围
         */
        anchor: Point;
        anchorOffset: Point;

        /** 外沿的尺寸 */
        frame: Rect;

        abstract setFrame(rc: Rect, anchor: boolean);

        /** 内部坐标使用浮点 */
        floatCoordinate: boolean;

        // 设置内部实现类的大小
        protected impSetFrame(rc: Rect, ui: any) {
            // override
        }

        /** 获得内部区域 */
        abstract bounds(): Rect;

        /** 背景 */
        backgroundColor: ColorType;
        backgroundImage: TextureSource;
        backgroundEdgeInsets: EdgeInsets;

        /** 边缘 */
        borderLine: Line;

        /** override 强制刷缓存 */
        abstract flushCache();

        /** 更新缓存 */
        updateCache() {
            if (this.cacheEnabled)
                this.setNeedsCache();
        }

        /** 请求更新缓存 */
        setNeedsCache() {
            FramesManager.needsCache(this);
        }

        /** 当加载时的回调
         @note 加载流程 loadScene -> onLoaded */
        protected onLoaded() {
            if (this._signals)
                this._signals.emit(SignalLoaded);
        }

        // 资源组，参见 ReqResources
        static GetReqResources(): Array<ReqResource> {
            return ReqResources.GetReqResources.call(this);
        }

        static ResourcesRequire(res: Array<string>) {
            ReqResources.ResourcesRequire.call(this, res);
        }

        static ClazzResourceProgress = ReqResources.ClazzResourceProgress;
        static ShowResourceProgress = ReqResources.ShowResourceProgress;

        getReqResources(): Array<ReqResource> {
            return ReqResources.prototype.getReqResources.call(this);
        }

        /** 当资源准备完成时更新资源 */
        protected updateResource() {
            // override
        }

        /** 加载需要的资源 */
        loadReqResources(cb: () => void, ctx?: any) {
            let cls = ObjectClass(this);
            let reqRes = nn.ArrayT.Concat(cls.GetReqResources(), this.getReqResources());
            if (length(reqRes) == 0) {
                cb.call(ctx);
                return;
            }
            let res = ResManager.capsules(reqRes);
            if (cls.ShowResourceProgress) {
                if (cls.ClazzResourceProgress) {
                    let clsloading = cls.ClazzResourceProgress;
                    if (clsloading == null)
                        clsloading = CApplication.shared.clazzResourceProgress.type;
                    let loading = new clsloading();
                    res.signals.connect(SignalChanged, (s: Slot) => {
                        (<IProgress>loading).progressValue = s.data;
                    }, null);
                    loading.open(false);
                    res.load(() => {
                        loading.close();
                        cb.call(ctx);
                    });
                } else if (RESOURCELOADINGISHUD) {
                    Hud.ShowProgress();
                    res.load(() => {
                        Hud.HideProgress();
                        cb.call(ctx);
                    });
                }
            } else {
                res.load(() => {
                    cb.call(ctx);
                });
            }
        }

        /** 实例化GUI对象
         @note 如果设置了静态的resourceGroups，则需要在回调中使用真正的实例
         */
        static New<T>(cb: (o: T) => void, ...p: any[]): T {
            let cls = ObjectClass(this);
            let reqRes = cls.GetReqResources();
            if (length(reqRes) == 0) {
                let obj = NewObject(cls, p);
                cb.call(this, obj);
                return obj;
            }
            let res = ResManager.capsules(reqRes);
            if (cls.ShowResourceProgress) {
                if (cls.ClazzResourceProgress) {
                    let clsloading = cls.ClazzResourceProgress;
                    if (clsloading == null)
                        clsloading = CApplication.shared.clazzResourceProgress.type;
                    let loading = new clsloading();
                    res.signals.connect(SignalChanged, (s: Slot) => {
                        (<IProgress>loading).progressValue = s.data;
                    }, null);
                    loading.open(false);
                    res.load(() => {
                        loading.close();
                        let obj = NewObject(cls, p);
                        cb.call(this, obj);
                    });
                } else if (RESOURCELOADINGISHUD) {
                    Hud.ShowProgress();
                    res.load(() => {
                        Hud.HideProgress();
                        let obj = NewObject(cls, p);
                        cb.call(this, obj);
                    });
                }
            } else {
                res.load(() => {
                    let obj = NewObject(cls, p);
                    cb.call(this, obj);
                });
            }
            return null;
        }

        /** 请求更新布局 */
        setNeedsLayout() {
            FramesManager.needsLayout(this);
        }

        // 是否正在布局，参见FramesManager
        protected __islayouting: boolean;

        /** 强制刷新布局 */
        flushLayout() {
            FramesManager.cancelLayout(this);
            this.updateLayout();
        }

        /** 更新布局 */
        updateLayout() {
            // override
        }

        /** 需要刷新z顺序 */
        setNeedsZPosition() {
            FramesManager.needsZPosition(this);
        }

        /** 更新数据 */
        updateData() {
            // override
        }

        /** 手势 */
        abstract addGesture(ges: IGesture);

        abstract clearGestures();

        /** 触摸事件带出的数据 */
        touch: CTouch;

        /** 按键事件带出的数据 */
        keyboard: CKeyboard;

        /** override 位置转换 */
        abstract convertPointTo(pt: Point, des: CComponent): Point;

        abstract convertRectTo(rc: Rect, des: CComponent): Rect;

        /** override 绘制到纹理 */
        abstract renderToTexture(): TextureSource;

        // 设置大小的工具函数
        setX(v: number): this {
            let rc = this.frame;
            rc.x = v;
            this.frame = rc;
            return this;
        }

        getX(): number {
            return this.frame.x;
        }

        setY(v: number): this {
            let rc = this.frame;
            rc.y = v;
            this.frame = rc;
            return this;
        }

        getY(): number {
            return this.frame.y;
        }

        setWidth(v: number): this {
            let rc = this.frame;
            if (rc.width == v)
                return this;
            rc.width = v;
            this.frame = rc;
            return this;
        }

        getWidth(): number {
            return this.frame.width;
        }

        setHeight(v: number): this {
            let rc = this.frame;
            if (rc.height == v)
                return this;
            rc.height = v;
            this.frame = rc;
            return this;
        }

        getHeight(): number {
            return this.frame.height;
        }

        setSize(sz: Size): this {
            let rc = this.frame;
            if (rc.width == sz.width && rc.height == sz.height)
                return this;
            rc.size = sz;
            this.frame = rc;
            return this;
        }

        setOrigin(pt: Point): this {
            let rc = this.frame;
            if (rc.x == pt.x && rc.y == pt.y)
                return;
            rc.position = pt;
            this.frame = rc;
            return this;
        }

        offsetOrigin(pt: Point): this {
            let rc = this.frame;
            rc.add(pt.x, pt.y);
            this.frame = rc;
            return this;
        }

        setCenter(pt: Point): this {
            let rc = this.frame;
            rc.center = pt;
            this.frame = rc;
            return this;
        }

        setLeftTop(pt: Point): this {
            let rc = this.frame;
            rc.leftTop = pt;
            this.frame = rc;
            return this;
        }

        setLeftCenter(pt: Point): this {
            let rc = this.frame;
            rc.leftCenter = pt;
            this.frame = rc;
            return this;
        }

        setLeftBottom(pt: Point): this {
            let rc = this.frame;
            rc.leftBottom = pt;
            this.frame = rc;
            return this;
        }

        setTopCenter(pt: Point): this {
            let rc = this.frame;
            rc.topCenter = pt;
            this.frame = rc;
            return this;
        }

        setBottomCenter(pt: Point): this {
            let rc = this.frame;
            rc.bottomCenter = pt;
            this.frame = rc;
            return this;
        }

        setRightTop(pt: Point): this {
            let rc = this.frame;
            rc.rightTop = pt;
            this.frame = rc;
            return this;
        }

        setRightCenter(pt: Point): this {
            let rc = this.frame;
            rc.rightCenter = pt;
            this.frame = rc;
            return this;
        }

        setRightBottom(pt: Point): this {
            let rc = this.frame;
            rc.rightBottom = pt;
            this.frame = rc;
            return this;
        }

        setScaleX(v: number) {
            let s = this.scale;
            if (s == null)
                s = new Point(v, 1);
            else
                s = new Point(v, s.y);
            this.scale = s;
        }

        setScaleY(v: number): this {
            let s = this.scale;
            if (s == null)
                s = new Point(1, v);
            else
                s = new Point(s.x, v);
            this.scale = s;
            return this;
        }

        setScale(v: number): this {
            this.scale = new Point(v, v);
            return this;
        }

        setTranslateX(v: number): this {
            let s = this.translate;
            if (s == null)
                s = new Point(v, 0);
            else
                s = new Point(v, s.y);
            this.translate = s;
            return this;
        }

        setTranslateY(v: number): this {
            let s = this.translate;
            if (s == null)
                s = new Point(0, v);
            else
                s = new Point(s.x, v);
            this.translate = s;
            return this;
        }

        /** 提供最佳大小 */
        bestFrame(rc?: Rect): Rect {
            return ObjectClass(this).BestFrame(rc);
        }

        bestPosition(): Point {
            return null;
        }

        static BestFrame(rc?: Rect): Rect {
            return new Rect();
        }

        /** 平移 */
        translate: Point;

        /** 缩放 */
        scale: Point;

        /** 旋转 */
        rotation: Angle;

        /** 透明度 */
        alpha: number;

        /** 内部边界 */
        edgeInsets: EdgeInsets;

        getEdgeInsets(): EdgeInsets {
            if (this.edgeInsets == null)
                this.edgeInsets = new EdgeInsets();
            return this.edgeInsets;
        }

        boundsForLayout(): Rect {
            return this.bounds().applyEdgeInsets(this.edgeInsets);
        }

        /** 显示 */
        visible: boolean;

        /** 当显示改变时 */
        onVisibleChanged() {
            // override
        }

        /** 所有子元素 */
        children: Array<CComponent>;

        /** 是否已经出现在界面上 */
        isAppeared: boolean;

        /** 出现在界面上的回调 */
        onAppeared() {
            if (ISDEBUG) {
                if (this.isAppeared)
                    warn(Classname(this) + ' 重复显示');
            }
            this.isAppeared = true;

            // 暂停当前级别的loop动画
            if (this._playingAnimates) {
                this._playingAnimates.forEach((ani: CAnimate) => {
                    if (ani.count == -1 && ani.isPaused())
                        ani.resume();
                });
            }

            // 传递给子集
            this.children.forEach((c: CComponent) => {
                if (!c.isAppeared)
                    c.onAppeared();
            }, this);
        }

        onDisappeared() {
            if (ISDEBUG) {
                if (!this.isAppeared)
                    warn(Classname(this) + ' 重复消失');
            }
            this.isAppeared = false;

            // 暂停当前级别的loop动画
            if (this._playingAnimates) {
                this._playingAnimates.forEach((ani: CAnimate) => {
                    if (ani.count == -1)
                        ani.pause();
                });
            }

            // 传递给子集
            this.children.forEach((c: CComponent) => {
                if (c.isAppeared)
                    c.onDisappeared();
            }, this);
        }

        /** 请求显示 */
        setNeedsAppear() {
            FramesManager.needsAppear(this);
        }

        /** 从父级移除 */
        removeFromParent() {
            let p = this.parent;
            if (p)
                p.removeChild(this);
        }

        /** 该元素位于的堆栈，向上查找 */
        private _viewStack: IViewStack
        set viewStack(v: IViewStack) {
            this._viewStack = v;
        }

        get viewStack(): IViewStack {
            if (this._viewStack)
                return this._viewStack;
            let p = this.parent;
            if (p)
                return p.viewStack;
            return null;
        }

        /** 动画配置 */
        transitionObject: ITransition;

        /** 多状态 */
        protected _states: States;
        get states(): States {
            if (this._states == null) {
                this._states = new States();
                this._states.cbset = this.onChangeState;
                this._states.cbctx = this;
                this._states.nullobj = null;
            }
            return this._states;
        }

        protected onChangeState(obj: any) {
            State.As(obj).setIn(this);
            this.updateCache();
        }
    }

}
