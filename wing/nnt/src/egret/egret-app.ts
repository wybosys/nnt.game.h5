declare let document_class;
declare let document_orientation;
if (typeof(document_class) == 'undefined')
    document_class = 'Main';

module nn {
    
    export class EgretApp
    extends CApplication
    {
        constructor() {
            super();
          
            // 通用的app事件
            egret.MainContext.instance.stage.addEventListener(egret.Event.ACTIVATE, this.onActivated, this);
            egret.MainContext.instance.stage.addEventListener(egret.Event.DEACTIVATE, this.onDeactived, this);
        }

        set fontFamily(f:string) {
            egret.TextField.default_fontFamily = f;
        }
        get fontFamily():string {
            return egret.TextField.default_fontFamily;
        }
    }

    export let EUI_MODE:boolean = false;
    
    // ------------------实现egret需要的加载过程 ------------------------
    
    // 保护Main入口类    
    let CLAZZ_MAIN: any;
    
    // 伪main类，为了支持library(用来支持wing项目)和framework两种模式下的切换
    class _CloakMain
	extends CApplication
    {
    }

    // 替换掉egret原始调试信息窗
    class _InstrumentObject
	extends egret.DisplayObject
    {
        // 次数、脏比率、时间、为了统计消耗的时间
        update(drawCalls: number, dirtyRatio: number, cost: number, statcost: number) {
            let current = egret.getTimer();
            this.totalTime += current - this.lastTime;
            this.lastTime = current;
            this.totalTick++;
            this.drawCalls = Math.max(drawCalls, this.drawCalls);
            if (this.totalTime > 500) {
                COLLECT_FPS = Math.round(this.totalTick * 1000 / this.totalTime);
                COLLECT_COST = cost;
                COLLECT_DRAWS = drawCalls;
                COLLECT_DIRTYR = dirtyRatio;
                Instrument.shared.updateData();
                
                this.totalTick = 0;
                this.totalTime = 0;
                this.drawCalls = 0;
            }
        }

        totalTime: number = 0;
        lastTime: number = 0;
        totalTick: number = 0;
        drawCalls: number = 0;
    }

    class _Player
	extends egret.sys.Player
    {
        start() {
            super.start();
            if (DEBUG && this['fpsDisplay'] == null) {
                let io = new _InstrumentObject();
                this['fpsDisplay'] = io;
            }
        }

        $render(triggerByFrame:boolean, costTicker:number) {
            if (DEBUG) {
                // 打开fps的统计
                this['showFPS'] = COLLECT_INSTRUMENT;
            }
            super.$render(triggerByFrame, costTicker);
        }
    }    
    egret.sys.Player = _Player;

    // 需要控制一下 stage 的一些功能
    class _AppStage
	extends egret.Sprite
    {
        static shared:_AppStage;
        
        constructor() {
            super();
            _AppStage.shared = this;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.__stage_added, this);

            // 开启帧监听，负责自动刷新布局、显示状态等功能
            FramesManager.launch(this);
        }

        private __stage_added() {
            // 创建 APP 首页面的实例
            let app = new CLAZZ_MAIN();
            this.appMain = app;
            this.addChild(app.handle());
            
            // 更新大小
            egret.MainContext.instance.stage.setContentSize(_AppStage.StageBounds.width, _AppStage.StageBounds.height);

            // 计算dom的缩放
            let p:any = document.querySelector('.egret-player');
            if (p) {
                let canvas = p.children[0];
                DomScaleFactorX = canvas.clientWidth / toInt(canvas.getAttribute('width'));
                DomScaleFactorY = canvas.clientHeight / toInt(canvas.getAttribute('height'));
                DomOffsetX = canvas.offsetLeft;
                DomOffsetY = canvas.offsetTop;
            }

            // 直接刷新主布局
            this.updateLayout();
        }
        
        // 首页面的实例
        appMain:CApplication;
        
        // 设置的 fps
        static Fps:number;

        // 初始化 Stage 架构
        static Init() {
            // 设置主业务入口类
            CLAZZ_MAIN = eval("Main");

            // 判断支持的特性
            let features = CLAZZ_MAIN.Features();
            if (Mask.isset(FrameworkFeature.MULTIRES, features))
                ResManager.multiRes = true;
            if (Device.shared.isAndroid &&
                Mask.isset(FrameworkFeature.NOSYNC, features))
                _AppStage.Fps = 0; // 0使用egret默认的帧速
            else
                _AppStage.Fps = 30;
            if (Mask.isset(FrameworkFeature.FULLSCREEN, features))
                CApplication.NeedFullscreen = true;

            // 计算初始的尺寸
            this.UpdateBounds();
        }

        // 界面发生变化
        static UpdateBounds() {
            // 取得app预定的方向，如果时HTML则取meta中的设置，或者和native一样，取的APP重载的设置
            document_orientation = CLAZZ_MAIN.Orientation();

            // 刷新当前屏幕的尺寸
            Device.shared._updateScreen();
            Dom.updateBounds();

            // 设置大小            
            this.ScreenBounds = Device.shared.screenBounds;
            this.DesignBounds = CLAZZ_MAIN.BestFrame();
            if (this.DesignBounds == null)
                this.DesignBounds = this.ScreenBounds.clone();
            
            // 计算 app 的尺寸
            let stageBounds = this.DesignBounds.clone();
            let fillMode = CLAZZ_MAIN.ScreenFillMode();
            this.ScreenScale = ISHTML5 ? CLAZZ_MAIN.ScreenScale() : 1;
            
            // 如果是纯PC，则使用原始分辨率居中
            if (Device.shared.isPurePC) {
                fillMode = FillMode.CENTER;
                this.ScreenScale = 1;
            }

            // 映射设计分辨率到实际分辨率中
            stageBounds.fill(this.ScreenBounds, fillMode);
            
            // 如果宽度小于800，高度小于480，则需要映射到800*480中
            if (stageBounds.width > stageBounds.height) {
                let r = stageBounds.width / stageBounds.height;
                if (Mask.isset(FillMode.MAXIMUM, fillMode) ?
                    stageBounds.width > 800 :
                    stageBounds.width < 800) {
                    stageBounds.height *= 800 / stageBounds.width;
                    stageBounds.width = 800;
                }
            } else {
                let r = stageBounds.height / stageBounds.width;
                if (Mask.isset(FillMode.MAXIMUM, fillMode) ?
                    stageBounds.height > 800 :
                    stageBounds.height < 800) {
                    stageBounds.width *= 800 / stageBounds.height;
                    stageBounds.height = 800;
                }
            }

            // 大小需要规整
            stageBounds.scale(this.ScreenScale).integral();
            this.StageBounds = new Rect(0, 0, stageBounds.width, stageBounds.height);

            // 计算屏幕的类型
            let scrFactor = Rect.Area(stageBounds) / Rect.Area(this.DesignBounds);
            if (scrFactor >= 3)
                Device.shared.screenType = ScreenType.EXTRAHIGH;
            else if (scrFactor >= 1.5)
                Device.shared.screenType = ScreenType.HIGH;
            else if (scrFactor <= 0.3)
                Device.shared.screenType = ScreenType.EXTRALOW;
            else if (scrFactor <= 0.75)
                Device.shared.screenType = ScreenType.LOW;
            else
                Device.shared.screenType = ScreenType.NORMAL;        

            // 计算缩放系数，如果是PUREPC，则不进行缩放控制
            if ((fillMode & FillMode.MASK_MAJOR) == FillMode.CENTER) {
                ScaleFactorX = ScaleFactorY = this.ScreenScale;
                ScaleFactorW = ScaleFactorH = this.ScreenScale;
                if (Mask.isset(FillMode.NOBORDER, fillMode)) {
                    StageScaleFactorX = stageBounds.width / this.DesignBounds.width / this.ScreenScale;
                    StageScaleFactorY = stageBounds.height / this.DesignBounds.height / this.ScreenScale;
                } else {
                    StageScaleFactorX = this.ScreenScale;
                    StageScaleFactorY = this.ScreenScale;
                }
            } else {
                ScaleFactorX = stageBounds.width / this.DesignBounds.width;
                ScaleFactorY = stageBounds.height / this.DesignBounds.height;
                if (Mask.isset(FillMode.STRETCH, fillMode)) {
                    ScaleFactorW = ScaleFactorX;
                    ScaleFactorH = ScaleFactorY;
                } else {
                    ScaleFactorW = ScaleFactorH = Math.min(ScaleFactorX, ScaleFactorY);
                }
                StageScaleFactorX = this.ScreenScale;
                StageScaleFactorY = this.ScreenScale;
            }
            ScaleFactorDeX = 1 / ScaleFactorX;
            ScaleFactorDeY = 1 / ScaleFactorY;
            ScaleFactorDeW = 1 / ScaleFactorW;
            ScaleFactorDeH = 1 / ScaleFactorH;
            ScaleFactorS = Math.min(ScaleFactorW, ScaleFactorH);
            ScaleFactorDeS = 1 / ScaleFactorS;

            // 打印日志
            /*
            log(`ScaleFactor:
                x:${ScaleFactorX}, y:${ScaleFactorY}
                w:${ScaleFactorW}, h:${ScaleFactorH}, s:${ScaleFactorS}
                sx:${StageScaleFactorX}, sy:${StageScaleFactorY}`);
            */

            // 设置到全局变量，用以其他界面初始化的时候使用
            StageBounds.reset(0, 0,
				              stageBounds.width * ScaleFactorDeW,
				              stageBounds.height * ScaleFactorDeH)
                .integral();
            
            // 设置egret内部的舞台大小
            if (egret.MainContext.instance.stage) {
                egret.MainContext.instance.stage.setContentSize(this.StageBounds.width, this.StageBounds.height);
            }
        }

        updateLayout() {
            this.appMain.setFrame(StageBounds);
        }        

        static ScreenScale:number;
        static ScreenBounds:Rect;
        static DesignBounds:Rect;
        static StageBounds:Rect;
    }

    Js.OverrideFunction(egret, 'updateAllScreens', function(orifn:()=>void) {
        if (CLAZZ_MAIN == null)
            return;
        
        // 如果键盘弹出，则认定为因为弹出键盘导致的尺寸修改
        if (Keyboard.visible)
            return;
        log("尺寸改变");            
        
        // 重新计算一下舞台的大小
        _AppStage.UpdateBounds();
        
        // 刷新首页的尺寸        
        _AppStage.shared.updateLayout();        

        // 激活信号            
        emit(CApplication.shared, SignalFrameChanged);

        // 调用原始的实现
        orifn.call(this);
    });

    // 需要替换查找入口类的函数，使得我们可以插入非业务类作为主入口
    Js.OverrideFunction(egret, 'getDefinitionByName', (orifn:(name:string)=>any, name:string):any=>{
        if (name == 'Main')
            return _AppStage;
        return orifn(name);
    });

    // 替换掉默认的屏幕适配        
    class ExtScreenAdapter
    extends egret.sys.DefaultScreenAdapter
    {
        calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number): egret.sys.StageDisplaySize {
            // 如果是标准PC浏览器，使用设计尺寸直接计算
            if (Device.shared.isPurePC)
                return super.calculateStageSize(scaleMode, screenWidth, screenHeight, contentWidth, contentHeight);
            // 否则手机上使用实时适配出来的舞台大小计算
            return super.calculateStageSize(scaleMode, screenWidth, screenHeight, StageBounds.width, StageBounds.height);
        }
    }
    // 替换掉系统的adapter
    egret.sys.screenAdapter = new ExtScreenAdapter();
    
    loader.webstart = ()=>{
        // 执行加载动作
        loader.InvokeBoot();
        
        // 创建舞台
        _AppStage.Init();
        
        // 约定是否使用webgl
        let glmode = false;
        if (location.href.indexOf('nowebgl=1') != -1)
            glmode = false;
        else if (location.href.indexOf('webgl=1') != -1)
            glmode = true;
        if (glmode) {
            // 如果是UC，则关闭webgl
            let agent = navigator.userAgent;
            if (agent.indexOf('UCBrowser') != -1)
                glmode = false;
        }
        
        // 默认使用webgl渲染
        if (glmode) 
            egret.runEgret({renderMode:"webgl"});
        else
            egret.runEgret();
        
        // 如过是webgl模式，根据egret官方文档因为dirtyRegion已经起不到多大作用，所以关闭
        if (egret.Capabilities.renderMode == "webgl") {
            egret.MainContext.instance.stage.dirtyRegionPolicy = egret.DirtyRegionPolicy.OFF;
            Device.shared.isCanvas = false;
        }
    };
    
    // 启动原生程序
    loader.nativestart = ()=>{
        // 创建舞台
        _AppStage.Init();
        
        // 运行原始的入口
        egret.runEgret();
    };

    // 启动runtime版本
    loader.runtimestart = ()=>{
        // 创建舞台
        _AppStage.Init();
        
        // 运行原始的入口
        egret.runEgret();        
    };
}
