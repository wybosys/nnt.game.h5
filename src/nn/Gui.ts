/// <reference path="ResManager.ts" />

module nn {

    // 当元素添加到舞台上
    export let SignalAddedToStage = "::ui::addedtostage";

    // 请求关闭页面
    export let SignalRequestClose = "::nn::request::close";

    // 触摸前处理
    export let SignalPreTouch = "::nn::pretouch";

    // 点击前处理
    export let SignalPreClick = "::nn::preclick";

    // 材质的类型
    export class COriginType {
        imp:any;
        static shared = new COriginType();
    }
    export type TextureSource = UriSource | COriginType;

    // 直接用于源类型的对象
    export class SourceVariable <IMPL extends IReference, T>
    extends RefVariable<IMPL>
    {
        source:T;

        dispose() {
            super.dispose();
            this.source = undefined;
        }
    }

    // 舞台的大小
    export let StageBounds = new Rect();

    /** 手势的接口 */
    export interface IGesture {
    }

    /** 为了支持堆栈控制实体、类 */
    export type StackPageType = InstanceType<CComponent>;

    /** 实现页面堆栈 */
    export interface IViewStack {
        /** 推入 */
        push(c:StackPageType, animated:boolean):boolean;
        push(c:StackPageType):boolean;

        /** 弹出 */
        pop(c:StackPageType, animated:boolean):boolean;
        pop(c:StackPageType);
        pop();
        
        popTo(c:StackPageType|number, animated:boolean):boolean;
        popTo(c:StackPageType|number):boolean;
        popToRoot();
    }

    /** 页面过渡的动画 */
    export interface ITransition
    extends IReference
    {
        play(appear:CComponent, disappear:CComponent);
    }

    /** page类，为了能自动记录页面切换的路径 */
    export interface IPage {
        // 页面的路径标记
        pathKey:string;
    }

    /** 触摸数据 */
    export abstract class CTouch
    {
        startPosition = new Point();
        lastPosition = new Point();
        currentPosition = new Point();

        /** 点中的对象 */
        target:any;
        currentTarget:any;

        /** 当前的增量 */
        get delta():Point {
            let pt = this.currentPosition.clone();
            return pt.add(-this.lastPosition.x, -this.lastPosition.y);
        }

        /** 移动的距离 */
        get distance():Point {
            return new Point(this.currentPosition.x - this.startPosition.x,
                             this.currentPosition.y - this.startPosition.y);
        }

        // 取消点击
        abstract cancel();

        // 暂停点击
        abstract veto();

        // 获得位于指定view中的位置
        abstract positionInView(v:CComponent):Point;
    }

    /** 按键数据 */
    export class CKeyboard {
        key:string;
        code:number;
    }

    /** zPosition的几个预定的层次 */
    export enum ZPOSITION {
    DEFAULT = 100, // 默认和undefine都代表100
        FRONT = -999,
        NORMAL = 0,
        BACK = 999,        
    };
    
    // 自动资源组加载规范
    export interface IReqResources {
        /** 获得依赖的资源 */
        getReqResources():Array<ReqResource>;

        /** 动态资源组 */
        reqResources?:Array<ReqResource>;
    }

    /** 资源组管理 */
    export abstract class ReqResources
    implements IReqResources
    {
        static __reqResources:Array<ReqResource>;
        reqResources:Array<ReqResource>;

        /** 对象依赖的动态资源组 */
        getReqResources():Array<ReqResource> {
            return this.reqResources;
        }

        /** 获得依赖的静态资源组 */
        static GetReqResources():Array<ReqResource> {
            let self = this;
            if (self.__reqResources)
                return self.__reqResources;
            self.__reqResources = [];
            self.ResourcesRequire(self.__reqResources);
            return self.__reqResources;
        }
        
        /** 通过该函数回调业务层的静态资源组定义 */
        static ResourcesRequire(res:Array<ReqResource>) {}        
        
        /** 加载静态资源时现实的进度，默认使用 Application 的 classResourceLoadingView */
        static ClazzResourceProgress:any;
        
        /** 是否显示资源加载的进度 
            @note 静态的资源加载一般都需要显示资源进度 */
        static ShowResourceProgress:boolean = true;
    }
    
    // 中间层定义
    export interface IComponent {
        _imp:any;
    }

    /** 内部实现的基类 */
    export abstract class CComponent
    extends SObject
    implements IReqResources
    {
        constructor() {
            super();
            // 绑定内部控件双方
            this.createImp();
            if (this._imp)
                (<any>this._imp)._fmui = this;
        }
        
        // 获取内部实现的控件的实体
        protected _imp:any;
        handle():any {
            return this._imp;
        }

        // 创建实现类的实例
        protected abstract createImp();

        // 获得内部控件对应的UI对象
        static FromImp(imp:any):any {
            return imp._fmui;
        }

        // debugClassname
        get descriptionName():string {
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
        _signalConnected(sig:string, s?:Slot) {}
        
        // override 计算点击到哪个子元素
        protected abstract hitTestChild(x:number, y:number):any;

        // override 计算点击到自身
        protected abstract hitTestClient(x:number, y:number):any;

        // 计算点击
        protected hitTest(x:number, y:number):any {
            if (this.touchChildren == false)
                return this.hitTestClient(x, y);
            let r = this.hitTestChild(x, y);
            if (r == null)
                r = this.hitTestClient(x, y);
            return r;
        }

        /** 标记 */
        tag:any;

        protected validate():boolean {
            return true;
        }

        // override 加子控件
        // 注意如果add一个已经有parent的元素，则自动切换到新的parent
        abstract addChild(c:CComponent);
        abstract addChild(c:CComponent, layout:boolean);
        
        // override 加子控件
        abstract addChildAt(c:CComponent, idx:number);
        abstract addChildAt(c:CComponent, idx:number, layout:boolean);

        // override 获得子控件
        abstract getChildAt(idx:number):CComponent;

        // override 子控件的index
        abstract setChildIndex(c:CComponent, idx:number);
        abstract getChildIndex(c:CComponent):number;

        // override 交换两个子控件
        abstract swapChildAt(idx0:number, idx1:number);
        abstract swapChild(l:CComponent, r:CComponent);

        // override 删除所有子控件
        abstract removeChildren();
        
        // override 移除子控件
        abstract removeChild(c:CComponent);

        // override 判断是否含有子控件
        abstract hasChild(c:CComponent):boolean;

        // 通过tag来查找控件
        getChildByTag(tag:any):CComponent {
            let chds = this.children;
            for (let i = 0; i < chds.length; ++i) {
                if (chds[i].tag == tag)
                    return chds[i];
            }
            return null;
        }
        
        // override 提到最前
        abstract bringFront(v?:CComponent);

        // override 放到最后
        abstract sendBack(v?:CComponent);

        // override 镂空子控件
        abstract hollowOut(c:CComponent);        

        // 是否含有镂空的控件
        hasHollowOut:boolean;

        // override 直接调整z位置
        zPosition:number;
        
        // 当子级加入时业务级调用
        protected onChildAdded(c:CComponent, layout:boolean) {
            // 子元素的加入需要更新一下自身的布局
            if (layout && !this._islayouting && this.validate())
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
        protected onChildRemoved(c:CComponent) {
            c.drop();
        }

        /** 是否已经在舞台中 */
        onStage:boolean;

        /** 父级 */
        parent:CComponent;

        /** 隶属的元素，一般为父级 */
        private _belong:CComponent;
        get belong():CComponent {
            return this._belong ? this._belong : this.parent;
        }
        set belong(c:CComponent) {
            this._belong = c;
        }

        /** 触摸开关 */
        touchEnabled:boolean;
        touchChildren:boolean;

        /** 是否可以触摸 */
        get interactiveEnabled():boolean {
            return this.touchEnabled || this.touchChildren;
        }
        set interactiveEnabled(b:boolean) {
            this.touchEnabled = b;
            this.touchChildren = b;
        }

        /** 缓存开关 */
        cacheEnabled:boolean;

        /** 裁剪 */
        clipsToBounds:boolean;
        clipsRegion:Rect;
        maskView:CComponent;

        /** 动画变成属性
            @note 只允许设置，不允许get，设计的CAnimate会当结束后自动释放掉自己
         */
        set animate(ani:CAnimate) {}

        /** 播放动画
            @note 有别于直接通过ani播放动画，可以避免loop动画忘记stop引起的内存泄漏，以及如过当页面invisble时，不及时pause动画导致额外消耗计算资源，返回用于动画的实际的实体
        */
        private _playingAnimates:Array<CAnimate>;
        playAnimate(ani:CAnimate, idr?:any):CAnimate {
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
        findAnimate(idr:any):CAnimate {
            if (this._playingAnimates)
                return nn.ArrayT.QueryObject(this._playingAnimates, (ani:CAnimate):boolean=>{
                    return ani.tag == idr;
                });
            return null;
        }

        /** 根据id停止动画 */
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

        /** 停止所有的动画 */
        stopAllAnimates() {
            if (this._playingAnimates) {
                nn.ArrayT.Clear(this._playingAnimates, (ani:CAnimate)=>{
                    ani.stop();
                });
            }
        }
        
        private __cb_aniend(s:Slot) {
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
        anchor:Point;
        anchorOffset:Point;

        /** 外沿的尺寸 */
        frame:Rect;

        /** 内部坐标使用浮点 */
        floatCoordinate:boolean;
        
        // 设置内部实现类的大小
        protected impSetFrame(rc:Rect, ui:any) {}

        /** 获得内部区域 */
        abstract bounds():Rect;

        /** 背景 */
        backgroundColor:ColorType;
        backgroundImage:TextureSource;
        backgroundEdgeInsets:EdgeInsets;

        /** 边缘 */
        borderLine:Line;

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
        static GetReqResources():Array<ReqResource> {
            return ReqResources.GetReqResources.call(this);
        }
        static ResourcesRequire(res:Array<string>) {
            ReqResources.ResourcesRequire.call(this, res);
        }
        static ClazzResourceProgress = ReqResources.ClazzResourceProgress;
        static ShowResourceProgress = ReqResources.ShowResourceProgress;
        getReqResources():Array<ReqResource> {
            return ReqResources.prototype.getReqResources.call(this);
        }

        /** 当资源准备完成时更新资源 */
        protected updateResource() {}

        /** 加载需要的资源 */
        loadReqResources(cb:()=>void, ctx?:any) {
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
                        clsloading = Application.shared.clazzResourceProgress.type;
                    let loading = new clsloading();
                    res.signals.connect(SignalChanged, (s:Slot)=>{
                        (<IProgress>loading).progressValue = s.data;
                    }, null);
                    loading.open(false);
                    res.load(()=>{                            
                        loading.close();
                        cb.call(ctx);
                    });
                } else if (RESOURCELOADINGISHUD) {
                    Hud.ShowProgress();
                    res.load(()=>{
                        Hud.HideProgress();
                        cb.call(ctx);
                    });
                }
            } else {
                res.load(()=>{
                    cb.call(ctx);
                });
            }
        }
        
        /** 实例化GUI对象 
            @note 如果设置了静态的resourceGroups，则需要在回调中使用真正的实例
        */
        static New<T>(cb:(o:T)=>void, ...p:any[]):T {
            let cls = ObjectClass(this);
            let reqRes = cls.GetReqResources();
            if (length(reqRes) == 0)
            {
                let obj = NewObject(cls, p);
                cb.call(this, obj);
                return obj;
            }
            let res = ResManager.capsules(reqRes);
            if (cls.ShowResourceProgress) {
                if (cls.ClazzResourceProgress) {
                    let clsloading = cls.ClazzResourceProgress;
                    if (clsloading == null)
                        clsloading = Application.shared.clazzResourceProgress.type;
                    let loading = new clsloading();
                    res.signals.connect(SignalChanged, (s:Slot)=>{
                        (<IProgress>loading).progressValue = s.data;
                    }, null);
                    loading.open(false);
                    res.load(()=>{                            
                        loading.close();
                        let obj = NewObject(cls, p);
                        cb.call(this, obj);
                    });
                } else if (RESOURCELOADINGISHUD) {
                    Hud.ShowProgress();
                    res.load(()=>{
                        Hud.HideProgress();
                        let obj = NewObject(cls, p);
                        cb.call(this, obj);
                    });
                }
            } else {
                res.load(()=>{
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
        _islayouting:boolean;
        
        /** 强制刷新布局 */
        flushLayout() {
            FramesManager.cancelLayout(this);
            this.updateLayout();
        }

        /** 更新布局 */
        updateLayout() {}

        /** 需要刷新z顺序 */
        setNeedsZPosition() {
            FramesManager.needsZPosition(this);
        }

        /** 更新数据 */
        updateData() {}
        
        /** 手势 */
        abstract addGesture(ges:IGesture);
        abstract clearGestures();

        /** 触摸事件带出的数据 */
        touch:CTouch;

        /** 按键事件带出的数据 */
        keyboard:CKeyboard;

        /** override 位置转换 */
        abstract convertPointTo(pt:Point, des:CComponent):Point;
        abstract convertRectTo(rc:Rect, des:CComponent):Rect;
        
        /** override 绘制到纹理 */
        abstract renderToTexture():TextureSource;
        
        // 设置大小的工具函数
        setX(v:number):this {
            let rc = this.frame;
            rc.x = v;
            this.frame = rc;
            return this;
        }

        getX():number {
            return this.frame.x;
        }

        setY(v:number):this {
            let rc = this.frame;
            rc.y = v;
            this.frame = rc;
            return this;
        }

        getY():number {
            return this.frame.y;
        }

        setWidth(v:number):this {
            let rc = this.frame;
            if (rc.width == v)
                return this;
            rc.width = v;
            this.frame = rc;
            return this;
        }

        getWidth():number {
            return this.frame.width;
        }

        setHeight(v:number):this {
            let rc = this.frame;
            if (rc.height == v)
                return this;
            rc.height = v;
            this.frame = rc;
            return this;
        }

        getHeight():number {
            return this.frame.height;
        }
        
        setSize(sz:Size):this {
            let rc = this.frame;
            if (rc.width == sz.width && rc.height == sz.height)
                return this;
            rc.size = sz;
            this.frame = rc;
            return this;
        }

        setOrigin(pt:Point):this {
            let rc = this.frame;
            if (rc.x == pt.x && rc.y == pt.y)
                return;
            rc.position = pt;
            this.frame = rc;
            return this;
        }

        offsetOrigin(pt:Point):this {
            let rc = this.frame;
            rc.add(pt.x, pt.y);
            this.frame = rc;
            return this;
        }

        setCenter(pt:Point):this {
            let rc = this.frame;
            rc.center = pt;
            this.frame = rc;
            return this;
        }

        setLeftTop(pt:Point):this {
            let rc = this.frame;
            rc.leftTop = pt;
            this.frame = rc;
            return this;
        }

        setLeftCenter(pt:Point):this {
            let rc = this.frame;
            rc.leftCenter = pt;
            this.frame = rc;
            return this;
        }

        setLeftBottom(pt:Point):this {
            let rc = this.frame;
            rc.leftBottom = pt;
            this.frame = rc;
            return this;
        }

        setTopCenter(pt:Point):this {
            let rc = this.frame;
            rc.topCenter = pt;
            this.frame = rc;
            return this;
        }

        setBottomCenter(pt:Point):this {
            let rc = this.frame;
            rc.bottomCenter = pt;
            this.frame = rc;
            return this;
        }

        setRightTop(pt:Point):this {
            let rc = this.frame;
            rc.rightTop = pt;
            this.frame = rc;
            return this;
        }

        setRightCenter(pt:Point):this {
            let rc = this.frame;
            rc.rightCenter = pt;
            this.frame = rc;
            return this;
        }

        setRightBottom(pt:Point):this {
            let rc = this.frame;
            rc.rightBottom = pt;
            this.frame = rc;
            return this;
        }

        setScaleX(v:number) {
            let s = this.scale;
            if (s == null)
                s = new Point(v, 1);
            else
                s = new Point(v, s.y);
            this.scale = s;
        }

        setScaleY(v:number):this {
            let s = this.scale;
            if (s == null)
                s = new Point(1, v);
            else
                s = new Point(s.x, v);
            this.scale = s;
            return this;
        }

        setScale(v:number):this {
            this.scale = new Point(v, v);
            return this;
        }

        setTranslateX(v:number):this {
            let s = this.translate;
            if (s == null)
                s = new Point(v, 0);
            else
                s = new Point(v, s.y);
            this.translate = s;
            return this;
        }

        setTranslateY(v:number):this {
            let s = this.translate;
            if (s == null)
                s = new Point(0, v);
            else
                s = new Point(s.x, v);
            this.translate = s;
            return this;
        }

        /** 提供最佳大小 */
        bestFrame(rc?:Rect):Rect {
            return ObjectClass(this).BestFrame(rc);
        }

        bestPosition():Point {
            return null;
        }

        static BestFrame(rc?:Rect):Rect {
            return new Rect();
        }

        /** 平移 */
        translate:Point;

        /** 缩放 */
        scale:Point;

        /** 旋转 */
        rotation:Angle;

        /** 透明度 */
        alpha:number;

        /** 内部边界 */
        edgeInsets:EdgeInsets;
        getEdgeInsets():EdgeInsets {
            if (this.edgeInsets == null)
                this.edgeInsets = new EdgeInsets();
            return this.edgeInsets;
        }
       
        boundsForLayout():Rect {
            return this.bounds().applyEdgeInsets(this.edgeInsets);
        }

        /** 显示 */
        visible:boolean;

        /** 当显示改变时 */
        onVisibleChanged() {
        }

        /** 所有子元素 */
        children:Array<CComponent>;
        
        /** 是否已经出现在界面上 */
        isAppeared:boolean;

        /** 出现在界面上的回调 */
        onAppeared() {
            if (ISDEBUG) {
                if (this.isAppeared)
                    warn(Classname(this) + ' 重复显示');
            }
            this.isAppeared = true;

            // 暂停当前级别的loop动画
            if (this._playingAnimates) {
                this._playingAnimates.forEach((ani:CAnimate)=>{
                    if (ani.count == -1 && ani.isPaused())
                        ani.resume();
                });
            }
            
            // 传递给子集
            this.children.forEach((c:CComponent)=>{
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
                this._playingAnimates.forEach((ani:CAnimate)=>{
                    if (ani.count == -1)
                        ani.pause();
                });
            }
            
            // 传递给子集
            this.children.forEach((c:CComponent)=>{
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
        private _viewStack:IViewStack
        set viewStack(v:IViewStack) {
            this._viewStack = v;
        }
        get viewStack():IViewStack {
            if (this._viewStack)
                return this._viewStack;
            let p = this.parent;
            if (p)
                return p.viewStack;
            return null;
        }

        /** 动画配置 */
        transitionObject:ITransition;

        /** 多状态 */
        protected _states:States;
        get states():States {
            if (this._states == null) {
                this._states = new States();
                this._states.cbset = this.onChangeState;
                this._states.cbctx = this;
                this._states.nullobj = null;
            }
            return this._states;
        }

        protected onChangeState(obj:any) {
            State.As(obj).setIn(this);
            this.updateCache();
        }
    }

    /** 承载不同状态对应的外观 */
    export class State
    {
        constructor(props?:{}) {
            this.props = props;
        }
        
        // 优化为直接使用 prop 来设置，不进行判断
        props:{};
        
        change(o:{}) {
            if (this.props == null)
                this.props = {};
            nn.MapT.Foreach(<any>o, (k:any, v:any)=>{
                this.props[k] = v;
            }, this);
        }
        
        static Text(text:string, color?:ColorType, size?:number):State {
            return new State({'text':text,
                              'textColor':color,
                              'fontSize':size
                             });
        }        
        
        static Color(textcolor:ColorType, backcolor?:ColorType) {
            return new State({'textColor':textcolor,
                              'backgroundColor':backcolor
                             });
        }

        static Image(image:TextureSource) {
            return new State({'imageSource':image});
        }

        static BackgroundImage(image:TextureSource) {
            return new State({'backgroundImage':image});
        }

        static Button(text?:string, image?:TextureSource, back?:TextureSource) {
            return new State({'text':text,
                              'imageSource':image,
                              'backgroundImage':back});
        }

        static As(obj:any):State {
            if (obj instanceof State)
                return obj;
            
            let t = typeof(obj);
            if (t == 'string')
                return State.Text(obj);
            
            return new State();
        }

        setIn(ui:any) {
            if (this.props) {
                nn.MapT.Foreach(<any>this.props, (k:string, v:any)=>{
                    if (v !== undefined)
                        ui[k] = v;
                }, this);
            }
            
            if (this._children) {
                nn.MapT.Foreach(this._children, (k:any, v:State)=>{
                    v.setIn(ui);
                }, this);
            }
        }

        protected _children:Map<any, State>;
        get children():Map<any, State> {
            if (this._children == null)
                this._children = new Map<any, State>();
            return this._children;
        }

        add(idr:any, child:State):State {
            this.children[idr] = child;
            return this;
        }

        remove(idr:any):State {
            delete this.children[idr];
            return this;
        }
    }

    export interface IState {
        // 根据当前状态返回下一个状态
        nextState?(state:any):any;

        // 是否已经选中
        isSelection?():boolean;
        
        // 设置选中状态
        setSelection?(sel:boolean);
    }

    export class States
    extends SObject
    {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalStateChanged);
        }        

        dispose() {
            super.dispose();
            this.nullstate = undefined;
            this.nullobj = undefined;
            this._state = undefined;
            nn.MapT.Clear(this._states);
        }

        // 当前状态
        private _state:any;
        set state(val:any) {            
            this.changeState(val);
        }
        get state():any {
            return this._state;
        }

        // 空状态，如过setState(null) 则会使用该值作为保护
        nullstate:any;
        // 空状态对应的对象，如过传入没有定义过的状态，则使用该值
        nullobj:any;

        /** 修改一个状态 */
        changeState(val:any, sig:boolean = true):boolean {
            if (this.cbset == null) {
                if (this._state == val)
                    return false;
                this._state = val;
                return true;
            }
            
            if (val == null)
                val = this.nullstate;

            if (val == this._state)
                return false;
            
            let obj = this._states[val];
            if (obj == null) {
                if (this.nullobj === undefined) {
                    warn("state " + val + " not binded");
                    return false;
                }
                obj = this.nullobj;
            }
            
            this._state = val;            
            this.cbset.call(this.cbctx, obj);
            sig && this.signals.emit(SignalStateChanged, val);
            return true;
        }

        /** 选中基于传入状态的下一个状态 */
        next(state?:any, selection?:boolean, sig?:boolean) {
            let delegate = <IState>this.cbctx;
            if (sig === undefined)
                sig = true;
            if (state === undefined)
                state = this._state;
            if (selection === undefined && delegate.isSelection)
                selection = delegate.isSelection();
            if (delegate.nextState) {
                state = delegate.nextState(state);
                this.changeState(state, sig);
            } else if (delegate.setSelection) {                
                if (!sig)
                    this.signals.block(SignalStateChanged);
                delegate.setSelection(!selection);
                if (!sig)
                    this.signals.unblock(SignalStateChanged);
            }
        }

        updateData(skipnull = true) {
            let obj = this._states[this._state];
            if (obj == null) {
                if (skipnull && this.nullobj === undefined)
                    return;
                obj = this.nullobj;
            }
            
            this.cbset.call(this.cbctx, obj);
        }
        
        /** 绑定状态 */
        bind(state:any, val:any, isnullstate?:boolean):States {
            let obj = val instanceof State ? val : new State(val);
            this._states[state] = obj;
            if (isnullstate)
                this.nullstate = state;
            return this;
        }

        /** 查询状态 */
        get(state:any) {
            return this._states[state];
        }
        
        private _states = new Map<any, any>();

        // 通过回调来设置具体控件怎么应用状态
        cbset:(obj:any) => void;
        cbctx:any;
    }

    export class SelectionsGroup
    extends SObject
    {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalSelectionChanged);
        }

        dispose() {
            this.clear();
            super.dispose();
        }
        
        add(ui:CComponent & IState) {
            if (ui.states == undefined) {
                fatal("push a non state object");
                return;
            }

            ui.states.signals.connect(SignalStateChanged, this._cbStateChanged, this);
            this._store.push(ui);
        }        

        clear() {
            this._old = undefined;
            nn.ArrayT.Clear(this._store, (e:SObject)=>{
                e.signals.disconnectOfTarget(this);
            }, this);
        }

        elements():any[] {
            return this._store;
        }

        private _cbStateChanged(e:Slot) {
            let ui = e.sender.cbctx;
            // 如过是自身在变化，则跳过
            if (ui == this._old)
                return;

            this._store.forEach((o)=>{
                if (o == ui)
                    return;                
                o.states.next(e.data, true, false);
            }, this);

            this.signals.emit(SignalSelectionChanged, {now:ui, old:this._old});
            this._old = ui;
        }

        get selection():number {
            return nn.ArrayT.QueryIndex(this._store, (o):boolean=>{
                return o.isSelection && o.isSelection();
            }, this, -1);
        }
        set selection(idx:number) {
            let o = this._store[idx];
            if (o.setSelection)
                o.setSelection(true);
            else
                warn("该对象不支持 setSelection 操作");
        }

        get selectionItem():any {
            return nn.ArrayT.QueryObject(this._store, (o):boolean=>{
                return o.isSelection && o.isSelection();
            }, this);
        }
        set selectionItem(o:any) {
            if (o.setSelection)
                o.setSelection(true);
            else
                warn("该对象不支持 setSelection 操作");
        }

        indexOf(o:any):number {
            return this._store.indexOf(o);
        }

        get previousSelectionItem():any {
            return this._old;
        }

        get length():number {
            return this._store.length;
        }

        private _old:any;
        private _store = new Array<any>();
    }

    class _Keyboard
    extends SObject
    {
        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalActivated);
            this._signals.register(SignalDeactivated);
        }
        
        _visible:boolean = false;
        get visible():boolean {
            return this._visible;
        }
        set visible(b:boolean) {
            if (this._visible == b)
                return;
            this._visible = b;
            this.signals.emit(b ? SignalActivated : SignalDeactivated);
        }
    }
    export let Keyboard = new _Keyboard();

    /** 自定义动画对象 */
    export class Animator
    {
        _preproperties = new Map<string, any>();
        _properties = new Map<string, any>();

        /** 类似于 iOS 的反向设置模式 */
        backMode:boolean;

        /** 增量移动 */
        translate(dpt:Point):Animator {
            if (this.backMode) {
                this._preproperties['dx'] = -dpt.x;
                this._preproperties['dy'] = -dpt.y;
                this._properties['dx'] = 0;
                this._properties['dy'] = 0;
            } else {
                this._properties['dx'] = dpt.x;
                this._properties['dy'] = dpt.y;
            }
            return this;
        }

        translatex(x:number):Animator {
            if (this.backMode) {
                this._preproperties['dx'] = -x;
                this._properties['dx'] = 0;
            } else {
                this._properties['dx'] = x;
            }
            return this;
        }

        translatey(y:number):Animator {
            if (this.backMode) {
                this._preproperties['dy'] = -y;
                this._properties['dy'] = 0;
            } else {
                this._properties['dy'] = y;
            }
            return this;
        }

        /** 倍数移动 */
        stranslate(dpt:Point):Animator {
            if (this.backMode) {
                this._preproperties['dxs'] = -dpt.x;
                this._preproperties['dys'] = -dpt.y;
                this._properties['dxs'] = 0;
                this._properties['dys'] = 0;
            } else {
                this._properties['dxs'] = dpt.x;
                this._properties['dys'] = dpt.y;
            }
            return this;
        }

        /** 移动到点 */
        moveto(dpt:Point):Animator {
            this._properties['x'] = dpt.x;
            this._properties['y'] = dpt.y;
            return this;
        }

        movetox(v:number):Animator {
            this._properties['x'] = v;
            return this;
        }

        movetoy(v:number):Animator {
            this._properties['y'] = v;
            return this;
        }

        /** 增量缩放倍数 */
        scale(dpt:Point):Animator {
            if (this.backMode) {
                this._preproperties['dsx'] = -dpt.x;
                this._preproperties['dsy'] = -dpt.y;
                this._properties['dsx'] = 0;
                this._properties['dsy'] = 0;
            } else {
                this._properties['dsx'] = dpt.x;
                this._properties['dsy'] = dpt.y;
            }
            return this;
        }

        scaleto(dpt:Point):Animator {
            this._properties['scaleX'] = dpt.x;
            this._properties['scaleY'] = dpt.y;
            return this;
        }

        /** 旋转 */
        rotate(ang:Angle) {
            if (this.backMode)
                this._preproperties['dangle'] = -ang.angle;                
            this._properties['dangle'] = ang.angle;
            return this;
        }

        /** 淡入淡出 */
        fade(to:number, from?:number):Animator {
            if (from != null)
                this._preproperties['alpha'] = from;
            if (to != null)
                this._properties['alpha'] = to;
            return this;
        }

        fadeIn(alpha:number = 1):Animator {
            return this.fade(alpha, 0);
        }
        
        fadeOut(alpha:number = 0):Animator {
            return this.fade(alpha);
        }

        /** 任意参数做动画 */
        change(key:string, to:any, from?:any):Animator {
            if (from != null)
                this._preproperties[key] = from;
            if (to != null)
                this._properties[key] = to;
            return this;
        }
    }
    
    export class TimeFunction {
        // inout 的设置属性，配合下面的函数使用
        static IN = 1;
        static OUT = 2;
        static INOUT = 3;
        
        static Pow:(pow:any, inout?:number)=>Function;
        static Quad:(inout?:number)=>Function;
        static Bounce:(inout?:number)=>Function;
        static Elastic:(amplitude?:any, period?:any, inout?:number)=>Function;
        static Circ:(inout?:number)=>Function;
        static Back:(amount?:number, inout?:number)=>Function;
    };    

    export abstract class CAnimate
    extends SObject
    {
        constructor() {
            super();
        }

        dispose() {
            this.clear();
            super.dispose();
        }

        // 系统默认的动画时间
        static Duration = 0.33;

        /** 播放几次 */
        count:number = 1;

        /** 动画的标记 */
        tag:any;

        // 当前第几次
        protected _firedCount = 0;
        
        _initSignals() {
            super._initSignals();
            this._signals.register(SignalStart);
            this._signals.register(SignalEnd);
            this._signals.register(SignalDone);
        }

        /** 设置重复的次数 */
        repeat(count:number):this {
            this.count = count;
            return this;
        }

        /** 清空所有 */
        abstract clear();

        /** 结束所有动画 */
        abstract stop();

        /** 链接对象 */
        abstract bind(tgt:CComponent):this;

        /** 取消对象 */
        abstract unbind(tgt:CComponent);
        abstract unbindAll();

        /** 下一步 */        
        abstract next(props:any, duration:number, tf:Function):this;        
        abstract to(duration:number, tf:Function, ani:(ani:Animator)=>void, ctx?:any):this;
        then(ani:(ani:Animator)=>void, ctx = null, duration = CAnimate.Duration, tf:Function = null):this {
            return this.to(duration, tf, ani, ctx);
        }

        /** 等待 */
        abstract wait(duration:number, passive?:boolean):this;

        /** 执行函数 */
        abstract invoke(fun:Function, ctx?:any):this;
        
        /** 结束 */
        complete(cb:(s:Slot)=>void, ctx?:any):this {
            this.signals.connect(SignalDone, cb, ctx);
            return this;
        }

        /** 播放 */
        abstract play(reverse?:boolean):this;
        
        /** 暂停 */
        abstract pause();
        
        /** 恢复 */
        abstract resume();

        /** 暂停的状态 */
        abstract isPaused():boolean;

        /** 动画结束是否恢复原来的状态 */
        autoReset:boolean;

        /** 动画结束是否自动解除绑定 */
        autoUnbind:boolean = true;

        /** 动画结束后是否自动释放 */
        autoDrop:boolean = true;

        /** 复制 */
        clone():this {
            let obj = InstanceNewObject(this);
            obj.autoReset = this.autoReset;
            obj.autoUnbind = this.autoUnbind;
            obj.autoDrop = this.autoDrop;
            obj.count = this.count;
            obj.tag = this.tag;
            return obj;
        }

        /** 直接停止对象动画 */
        static Stop(tgt:CComponent) {            
        }

        inTo(duration:number, cb:(animator:Animator)=>void, ctx?:any,
             tf = TimeFunction.Quad(TimeFunction.OUT)):this
        {
            return this.to(duration, tf, cb, ctx);
        }
        
        outTo(duration:number, cb:(animator:Animator)=>void, ctx?:any,
              tf = TimeFunction.Quad(TimeFunction.IN)):this
        {
            return this.to(duration, tf, cb, ctx);
        }
        
        tremble(duration:number = CAnimate.Duration, tf?:Function):this {
            return this
                .next({'scaleX':1.3, 'scaleY':1.3}, duration * 0.2, tf)
                .next({'scaleX':0.8, 'scaleY':0.8}, duration * 0.2, tf)
                .next({'scaleX':1.1, 'scaleY':1.1}, duration * 0.2, tf)
                .next({'scaleX':0.9, 'scaleY':0.9}, duration * 0.2, tf)
                .next({'scaleX':1, 'scaleY':1}, duration * 0.2, tf);
        }        
    }

    export class FrameTimer {
        constructor() {
            this.start = this.now = DateTime.Pass();
        }
        
        /** 起始时间 ms */
        start:number;
        
        /** 点前的时间点 */
        now:number;
        
        /** 消耗时间 */
        cost:number = 0;
        
        /** 过去了的时间 */
        past:number = 0;

        /** 次数统计 */
        count:number = 0;        
    }

    export interface IFrameRender {
        onRender(cost:number);
    }

    export abstract class CFramesManager
    {
        private _blayouts = NewSet<CComponent>();
        private _bzpositions = NewSet<CComponent>();
        private _bappears = NewSet<CComponent>();
        private _bcaches = NewSet<CComponent>();
        private _bmcs = NewSet<Memcache>();

        static _layoutthreshold = 0;
        protected onPrepare() {
            if (ISDEBUG) {
                ++this._ft.count;
            }
            
            // 刷新一下布局
            ++CFramesManager._layoutthreshold;            
            nn.SetT.SafeClear(this._blayouts, (c:CComponent)=>{
                if (!c.__disposed) {
                    c._islayouting = true;           
                    c.updateLayout();
                    c._islayouting = false;
                }
            });
            --CFramesManager._layoutthreshold;

            // 调整z顺序
            nn.SetT.SafeClear(this._bzpositions, (c:CComponent)=>{
                if (!c.__disposed)
                    c.updateZPosition();
            });
            
            // 当布局结束才激发已显示
            nn.SetT.SafeClear(this._bappears, (c:CComponent)=>{
                if (!c.__disposed && !c.isAppeared)
                    c.onAppeared();
            });
            
            // 更新图形缓存
            nn.SetT.Clear(<any>this._bcaches, (c:CComponent)=>{
                if (!c.__disposed)
                    c.flushCache();
            });

            // 更新内存缓存
            nn.SetT.Clear(<any>this._bmcs, (mc:Memcache)=>{
                mc.gc();
            });
        }

        protected onRendering() {
            let now = DateTime.Pass();
            this._ft.cost = now - this._ft.now;
            this._ft.past = now - this._ft.start;
            this._ft.now = now;

            let cost = this._ft.cost;
            this.RENDERS.forEach((each:IFrameRender)=>{
                each.onRender(cost);
            }, this);
        }

        RENDERS = NewSet<IFrameRender>();

        /** 强制更新下一帧 */
        abstract invalidate();

        /** 布局 */
        needsLayout(c:CComponent) {
            if (CFramesManager._layoutthreshold == 0) {
                this._blayouts.add(c);
                this.invalidate();
            } else {
                c.updateLayout();
            }
        }

        cancelLayout(c:CComponent) {
            this._blayouts.delete(c);
        }

        /** 调整Z顺序 */
        needsZPosition(c:CComponent) {
            this._bzpositions.add(c);
            this.invalidate();
        }

        /** 显示 */
        needsAppear(c:CComponent) {
            this._bappears.add(c);
            this.invalidate();
        }

        /** 刷新图形缓存 */
        needsCache(c:CComponent) {
            this._bcaches.add(c);
            this.invalidate();
        }

        /** 刷新内存缓存 */
        needsGC(mc:Memcache) {
            this._bmcs.add(mc);
            this.invalidate();
        }

        abstract launch(c:any);
     
        private _ft = new FrameTimer();
    }

    export let FramesManager:CFramesManager;
}
