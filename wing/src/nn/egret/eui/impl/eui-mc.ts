/// <reference path="../eui-impl.ts" />

module eui {
    
    export class MovieClipU
    extends eui.Group
    {
        protected onPartBinded = _EUIExtPROTO.onPartBinded;
        public slots:string = null;
        public tag:any = null;
        goBack = _EUIBaseExtPROTO.goBack;

        constructor() {
            super();
        }

        dispose() {
            this._mc.drop();
            if (this._signals) {
                this._signals.dispose();
                this._signals = undefined;
            }            
        }

        drop() {
            this.dispose();
        }

        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.drop();
        }
        
        protected _initSignals() {
            // 基础相关
            this._signals.delegate = this;
            this._signals.register(nn.SignalClicked);
            // mc相关
            this._signals.register(nn.SignalStart);
            this._signals.register(nn.SignalChanged);
            this._signals.register(nn.SignalUpdated);
            this._signals.register(nn.SignalEnd);
            this._signals.register(nn.SignalDone);
        }

        protected _signals:hd.Signals;
        get signals():hd.Signals {
            if (this._signals)
                return this._signals;
            this._instanceSignals();
            return this._signals;
        }

        protected _instanceSignals() {
            this._signals = new nn.Signals(this);            
            this._initSignals();
        }
        
        _signalConnected(sig:string, s?:hd.Slot) {
            switch (sig) {
            case nn.SignalClicked:
                nn.EventHook(this, egret.TouchEvent.TOUCH_TAP, this.__cmp_tap, this);
                break;
            case nn.SignalChanged:
                this._mc.signals.redirect(nn.SignalChanged, this);
                break;
            case nn.SignalUpdated:
                this._mc.signals.redirect(nn.SignalUpdated, this);
                break;
            case nn.SignalStart:
                this._mc.signals.redirect(nn.SignalStart, this);
                break;
            case nn.SignalEnd:
                this._mc.signals.redirect(nn.SignalEnd, this);
                break;
            case nn.SignalDone:
                this._mc.signals.redirect(nn.SignalDone, this);
                break;
            }
        }
        
        private __cmp_tap(e:egret.TouchEvent) {
            this.signals.emit(nn.SignalClicked);
            e.stopPropagation();
        }

        private _sourceChanged = false;

        /** 资源名称 */
        private _clipName:string = null;
        public get clipName():string {
            return this._clipName;
        }
        public set clipName(s:string) {
            this._clipName = s;
            this._sourceChanged = true;
            this.invalidateProperties();
        }
        
        /** 素材资源 */
        private _textureSource:string = null;
        public get textureSource():string {
            return this._textureSource;
        }
        public set textureSource(s:string) {
            this._textureSource = s;
            this._sourceChanged = true;
            this.invalidateProperties();
        }
        
        /** 配置资源 */
        private _frameSource:string = null;
        public get frameSource():string {
            return this._frameSource;
        }
        public set frameSource(s:string) {
            this._frameSource = s;
            this._sourceChanged = true;
            this.invalidateProperties();
        }

        /** 播放次数 */
        public playCount:number = 1;

        /** 自动播放 */
        public autoPlay:boolean = true;

        /** 是否使用flash中设定的锚点 */
        public flashMode:boolean = false;
        
        /** 填充模式 */
        public fillMode:number = nn.FillMode.ASPECTSTRETCH;

        /** 调整序列帧的对齐位置 */
        public clipAlign:number = nn.POSITION.CENTER;

        /** 切换clipSource时清空原来的clip */
        clearOnChanging:boolean = true;

        private _mc = new nn.MovieClip();
        
        createChildren() {
            super.createChildren();
            
            this._mc.count = this.playCount;
            this._mc.autoPlay = this.autoPlay;
            this._mc.location = 0;
            this._mc.flashMode = this.flashMode;
            this._mc.fillMode = this.fillMode;
            this._mc.clipAlign = this.clipAlign;
            this._mc.clearOnChanging = this.clearOnChanging;
            
            this.addChild(this._mc.handle());
        }

        commitProperties() {
            super.commitProperties();
            if (this._sourceChanged) {
                this._sourceChanged = false;

                // 重置资源
                let cfg = new nn.ClipConfig(this.clipName, this.frameSource, this.textureSource);
                this.clipSource = cfg;
            }
        }

        get clipSource():hd.ClipConfig {
            return this._mc.clipSource;
        }
        set clipSource(cfg:hd.ClipConfig) {
            this._mc.clipSource = cfg;
        }

        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number) {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            // 设置mc和当前的容器大小一致
            this._mc.frame = new nn.Rect(0, 0, unscaledWidth, unscaledHeight);
            this._mc.flushLayout();
        }

        /** 播放 */
        play() {
            this._mc.play();
        }

        /** 停止 */
        stop() {
            this._mc.stop();
        }        
    }

    _EUIExtFix(MovieClipU);    
}