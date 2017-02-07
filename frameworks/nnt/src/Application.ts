module nn {
    
    export class _GameLayer
    extends Navigation
    {
        set root(spr:CComponent) {
            this.push(spr);
        }
        get root():CComponent {
            return this.topView.obj;
        }
    }

    export class _DesktopLayer
    extends Sprite
    {        
    }

    /** 资源加载进度和弹出的进度是同一个类 */
    export let RESOURCELOADINGISHUD:boolean;
    
    export abstract class CApplication
    extends Sprite
    implements IReqResources
    {
        /** 用来重新定义弹出文字框 */
        clazzHudText = new Class<Hud>(HudText);
        
        /** 用来重新定义弹出的等待框 */
        clazzHudProgress = new Class<Hud>(HudProgress);
        
        /** 用来实现实时资源加载进度的类 */
        clazzResourceProgress = new Class<Hud>();
        
        /** 用来实现首页加载进度的类 */
        clazzLoadingScene = new Class<LoadingScreen>(LoadingScreen);

        /** 用来实现alert等标准弹出框的绑定 */
        alert:(title:string, msg:string, data:{btn?:string, cb?:()=>void})=>void;
        /** 确认框，按照顺序，从左往右放入，从右往左显示，所以Yes的按钮会出现在最右端 */
        confirm:(title:string, msg:string, data:[{btn?:string, cb?:()=>void}])=>void;
        
        /** 预加载的资源 */
        getReqResources():Array<ReqResource> {
            return this.reqResources;
        }
        reqResources:Array<ReqResource> = [];
        
        /** 全局唯一的业务实例 */
        static shared:CApplication;
        
        constructor() {
            super();
                        
            // 当加入到场景中后开始加载资源、页面
            this.signals.connect(SignalAddedToStage, this.__app_addedtostage, this);

            // 控制全局的点击
            this.signals.connect(SignalPreTouch, this.__app_pretouch, this);
            this.signals.connect(SignalPreClick, this.__app_preclick, this);

            // 屏幕方向变化
            Device.shared.signals.connect(SignalOrientationChanged, this.__app_orientationchanged, this);

            // 设置资源的根目录
            ResManager.directory = "resource";
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalLoaded);
            this._signals.register(SignalActivated);
            this._signals.register(SignalDeactivated);
            this._signals.register(SignalFrameChanged);
            this._signals.register(SignalException);
        }

        /** 打开 app 所使用的地址 */
        url = new URL(Js.siteUrl);

        /** 版本号 */
        version:string = APPVERSION;

        /** 版本信息 */
        get versioninfo():string {
            let r = [this.version];
            if (ISDEBUG && app.debug) {
                r.push(new DateTime(app.debug.BUILDDATE).toString('yyyy/M/d HH:mm:ss'));
            }
            return r.join(' ');
        }

        /** 图标 */
        icon:string = APPICON;

        /** 默认资源 */
        resourceFile:string = "default.res.json";

        /** 默认主题资源 */
        themeFile:string = "default.thm.json";

        /** 默认数据资源 */
        dataFile:string = "default.data.js";

        /** 默认项目配置 */
        configFile:string = "app.json";
        
        /** 用来填充白边的图片 */
        backgroundImagePattern:string;

        /** 游戏的代号 */
        private _identifier:string = '::n2';
        get identifier():string {
            return this._identifier;
        }
        set identifier(v:string) {
            if (this._identifier == v)
                return;
            this._identifier = v;
            Storage.shared.prefix = v;
        }

        /** 工程的配置文件(configFile)中读取的内容 */
        config:any;

        /** 程序中使用的默认字体 */
        fontFamily:string = FontsManager.font("黑体");
        
        // 加载进度
        private _loadingScreen:LoadingScreen;

        // 当app添加到舞台后开始默认资源的加载
        private __app_addedtostage() {
            // 是否是同一个类
            RESOURCELOADINGISHUD = this.clazzResourceProgress.isEqual(this.clazzHudProgress);

            // 初始化默认的游戏层
            this._gameLayer = new _GameLayer();
            this._desktopLayer = new _DesktopLayer();
            this.addChild(this._gameLayer);
            this.addChild(this._desktopLayer);

            // 预加载流程
            let queue = new OperationQueue();
            queue.autoMode = false;
            let queuegrp = new OperationGroup();
            this._preloadConfig(queuegrp);
            queue.add(queuegrp);
            queue.add(new OperationClosure(()=>{
                // 绑定app的句柄
                CApplication.shared = this;

                // 读取预定义
                ResManager.cacheEnabled = val(this.config['resource.gc'], true);

                // 需要启动预启动的定时器
                if (CTimer.SAFE_TIMER_ENABLED) {
                    CTimer.SAFE_TIMER_ENABLED = false;
                    SetT.Clear(CTimer.SAFE_TIMERS, (tmr:CTimer)=>{
                        tmr.start();
                    });
                }                                

                // 模拟一次初始化的切到前台的操作
                this.onActivated();

                // 设置背景填充
                if (this.backgroundImagePattern)
                    Dom.style.backgroundImage = "url(" + ResManager.getResUrl(this.backgroundImagePattern) + ")";
                
                // 启动处理
                let opers = CApplication._OPERATIONS.remove('boot');
                opers && opers.forEach((fn:Function)=>{
                    fn();
                });

                // 隐藏接入平台的loading
                let cnt = new svc.LoadingContent(100, 100);
                ServicesManager.fetch(cnt, ()=>{});
                
                // 如果当前显示着 launch 页面，则需要移除
                let launchdiv = document.getElementById('launchDiv');
                if (launchdiv)
                    launchdiv.parentElement.removeChild(launchdiv);

                // 加载 loading 页面
                this._loadingScreen = this.clazzLoadingScene.instance();
                // 该信号负责加载起主业务界面
                this._loadingScreen.signals.connect(SignalDone, this._cbLoadingComplete, this);
                // 该信号用来加载默认依赖资源组
                this._loadingScreen.signals.connect(SignalStart, this.onLoadingScreenStart, this);
                // 显示加载页面
                this.addChild(this._loadingScreen);
            }, this));
            // 开始启动队列
            queue.tryrun();
        }

        /** 延期加载的capsules */
        capsules(reqs:ReqResource[]):CResCapsule {
            let c:Array<ReqResource> = [new ResourceEntity(ResManager.directory + this.dataFile + '?v=' + this.version, ResType.JSREF)];            
            let r = ResManager.capsules(reqs.concat(c));
            // 加载成功后，激发dataloaded的处理
            r.signals.connect(SignalDone, ()=>{
                let opers = CApplication._OPERATIONS.remove('data');
                opers && opers.forEach((fn:Function)=>{
                    fn();
                });
            }, this);
            return r;
        }
            
        // 预加载队列
        protected _preloadConfig(oper:OperationGroup) {
            // 加载资源文件
            oper.add(new OperationClosure((oper:Operation)=>{
                let res = this.resourceFile + '?v=' + this.version;
                ResManager.loadConfig(res, ()=>{
                    oper.done();
                }, this);
            }, this));
            // 加载配置文件
            oper.add(new OperationClosure((oper:Operation)=>{
                let cfg = this.configFile + '?v=' + this.version;
                ResManager.getResByUrl(cfg, ResPriority.NORMAL, (obj:CacheRecord)=>{
                    this.config = obj.val;
                    // 如果需要处理debug的config文件
                    if (app.debug.CONFIG) {
                        ResManager.getResByUrl('~debug.json', ResPriority.NORMAL, (obj:CacheRecord)=>{
                            let cfg = obj.val;
                            Object.keys(cfg).forEach((e:any)=>{
                                this.config[e] = cfg[e];
                            });
                            oper.done();
                        }, this, ResType.JSON);
                    } else {
                        oper.done();
                    }
                }, this, ResType.JSON);
            }, this));
        }

        // 开始加载资源
        protected onLoadingScreenStart() {
            // 加载默认的资源组
            let grp = ResManager.capsules(this.getReqResources());
            grp.signals.connect(SignalChanged, this._cbResLoadChanged, this);
            grp.load(this._cbResLoadCompleted, this);            
        }

        // 资源加载的进度变化
        private _cbResLoadChanged(s:Slot) {
            this._loadingScreen.progressValue = s.data;
        }

        // 资源加载成功
        private _cbResLoadCompleted() {
            if (this._loadingScreen) {
                this._loadingScreen.complete();                
            } else {
                this._cbLoadingComplete();
            }
        }

        // 所有资源加载完成，开始加载主场景
        private _cbLoadingComplete() {
            // 初始化场景
            this.onLoaded();
            
            // 移除 loading 页面
            this._loadingScreen.removeFromParent();
            this._loadingScreen = null;                
        }

        protected onLoaded() {
            log("加载应用业务");
            this.signals.emit(SignalLoaded);
        }
        
        /** 游戏的元素都画到这一层上 */
        protected _gameLayer:_GameLayer;
        get gameLayer():Navigation {
            return this._gameLayer;
        }

        /** 自定义的桌面弹出都放到这一层上 */
        protected _desktopLayer:_DesktopLayer;
        get desktopLayer():Sprite {
            return this._desktopLayer;
        }

        updateLayout() {
            super.updateLayout();            
            let rc = this.bounds();
            this._gameLayer.setFrame(rc);
            this._desktopLayer.setFrame(rc);
            if (this._loadingScreen)
                this._loadingScreen.setFrame(rc);
        }

        get viewStack():Navigation {
            return <Navigation>this._gameLayer;
        }
        set viewStack(v:Navigation) {
            fatal('不能设置 Application 的 viewStack');
        }

        /** 应用的唯一标示 */
        protected _uniqueId:string;
        get uniqueId():string {
            if (this._uniqueId)
                return this._uniqueId;
            let id = Storage.shared.value("::n2::app::uid");
            if (id == null) {
                id = this.generateUniqueId();
                Storage.shared.set("::n2::app::uid", id);
                this._uniqueId = id;
            } else {
                this._uniqueId = id;
            }
            return this._uniqueId;
        }
        
        /** 机器指纹 */
        protected _idfa:string;
        get idfa():string {
            if (this._idfa)
                return this._idfa;
            let ds = [navigator.appName, navigator.vendor, navigator.platform, navigator.product, ];
            this._idfa = StringT.Hash(ds.join("#")).toString();
            return this._idfa;
        }

        /** 基于唯一标示的用户数据 */
        uniqueKey(key:string):string {
            return this.uniqueId + '/' + key;
        }

        /** 期望的尺寸，返回 null，则代表使用当前屏幕的尺寸 */
        static BestFrame():Rect {
            return null;
        }

        /** 是否使用webgl */
        static UseWebGl():boolean {
            return false;
        }

        /** 应用的主方向 */
        static Orientation():number {
            if (typeof(document_orientation) == 'undefined')
                document_orientation = 0;
            return document_orientation;
        }

        /** 是否使用屏幕尺寸 
            4种样式: 使用屏幕尺寸、使用设计尺寸、使用设计尺寸适配屏幕尺寸、使用设计尺寸填充屏幕尺寸，对应于 STRETCH、CENTER、ASSTRETCH、ASFILL
         */
        static ScreenFillMode():FillMode {
            return FillMode.CENTER;
        }

        /** 屏幕的物理缩放比例
            @note 如果业务是根据720*1280来设计，如果发现跑的慢，需要修改一下设计尺寸，但是所有布局已经按照720*1280来编码，此时已经不容重新修改布局代码，通过该参数就可以控制重新按照缩放后的分辨率来布局
        */
        static ScreenScale():number {
            return 1;
        }

        /** 应用支持的特性 */
        static Features():FrameworkFeature {
            return FrameworkFeature.DEFAULT;
        }

        /** 生成唯一标示 */
        protected generateUniqueId():string {
            return Js.uuid(16, 16);
        }

        // 打开全屏模式需要运行在touch事件中，所以需要设置一个开关，当touch事件发生时自动激活全屏幕时
        static NeedFullscreen:boolean;

        private __app_preclick(s:Slot) {
            // 检查是否需要激活全屏模式
            if (CApplication.NeedFullscreen) {
                CApplication.NeedFullscreen = false;
                this.enterFullscreen();
            }

            let t:CTouch = s.data;

            // 处理被镂空的desktop
            let dsk = ArrayT.Top(Desktop._AllNeedFilters);
            if (dsk) {
                // 如果 desk 位于最上方，则需要处理
                let top = ArrayT.Top(Desktop._AllOpenings);
                if (dsk == top) {
                    let pt = t.positionInView(dsk);
                    let ht = dsk.hitTestInFilters(pt);
                    if (ht == null)
                        t.cancel();
                    else
                        dsk.signals.emit(SignalHitTest, ht);
                }
            }
        }

        private __app_pretouch(s:Slot) {
            let t:CTouch = s.data;
            // 处理被镂空的desktop
            let dsk = ArrayT.Top(Desktop._AllNeedFilters);
            if (dsk) {
                let top = ArrayT.Top(Desktop._AllOpenings);
                if (dsk == top) {
                    let pt = t.positionInView(dsk);
                    let ht = dsk.hitTestInFilters(pt);
                    if (ht == null)
                        t.cancel();
                }
            }
        }

        /** 进入全屏模式 */
        enterFullscreen() {
            if (ISNATIVE || this.isFullscreen)
                return;
            Js.enterFullscreen(document.body);
        }

        /** 推出全屏模式 */
        exitFullscreen() {
            if (ISNATIVE || !this.isFullscreen)
                return;
            Js.exitFullscreen();
        }

        get isFullscreen():boolean {
            if (ISNATIVE)
                return true;
            return Js.isFullscreen();
        }

        /** 应用是否激活 */
        isActivating:boolean;

        protected onActivated() {
            log("应用激活");
            
            // 恢复切换到后台时暂停的声音
            SoundManager.background._app_actived();
            
            this.isActivating = true;
            this.signals.emit(SignalActivated);
        }
        
        protected onDeactived() {
            log("应用切换到后台");

            // 暂停背景声音
            SoundManager.background._app_deactived();

            this.isActivating = false;
            this.signals.emit(SignalDeactivated);
        }

        /** 重新打开应用 */
        private __restarting:boolean;
        restart() {
            if (this.__restarting)
                return;
            this.__restarting = true;
            // 使用平台的重新加载
            ServicesManager.fetch(new svc.LogoutContent());
        }

        private __app_orientationchanged(e:any) {
            log("方向变化");
        }

        static _OPERATIONS = new MultiMap<string, Function>();
        
        /** 启动过程中执行 */
        static InBoot(fn:Function) {
            this._OPERATIONS.add('boot', fn);
        }
        
        /** 加载过程中执行 */
        static InData(fn:(cb:()=>void)=>void) {
            this._OPERATIONS.add('data', fn);
        }
    }
}

module nn.loader {

    // 绑定异常处理
    let doException = function(msg, url, line) {
        // 判断是不是自己的js引起的
        if (url.indexOf(location.host + location.pathname) == -1)
            return;
        
        // 只有debug模式才提示异常
        let content = ["遇到一个未处理的错误:", msg, url, 'L' + line].join('\n');
        if (ISDEBUG)
            alert(content);
        else
            console.warn(content);

        // 发出信号，可以用来监听
        if (CApplication.shared) {
            CApplication.shared.signals.emit(SignalException, new Failed(-1, msg, url));
        }
    };
    
    // 默认只让测试版会监控未知错误
    window.onerror = doException;

    // 不同环境下的启动程序
    export let webloading:()=>void; // 应用加载时调用
    export let webstart:()=>void; // 应用启动时调用
    export let nativestart:()=>void; // 本地化应用启动时
    export let runtimestart:()=>void; // RUNTIME化应用启动时

    // 为了保证框架的实例化不依赖于生成的js加载顺序，提供当框架所有js都加载后才运行的函数
    let _LOADED_OPERATIONS = new Array<()=>void>();
    export function InBoot(fn:()=>void) {
        _LOADED_OPERATIONS.push(fn);
    }

    // 执行加载的动作
    export function InvokeBoot() {
        _LOADED_OPERATIONS.forEach((e:()=>void)=>{
            e();
        });
        _LOADED_OPERATIONS.length = 0;
    }
    
}

// 底层维护的debug状态都放到这个ns里面，避免每次用的时候都需要判断exist
module app.debug {
    export declare let PATH:string;
    export declare let UUID:string;
    export declare let CONFIG:boolean;
    export declare let BUILDDATE:number;
}
