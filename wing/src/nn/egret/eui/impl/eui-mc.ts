module eui {
    
    export class MovieClipU
    extends eui.Group
    {
        public slots:string = null;
        public tag:any = null;

        constructor() {
            super();
        }

        onPartBinded(name:string, target:any) {
            _EUIExt.onPartBinded(this, name, target);
        }

        goBack() {
            _EUIExt.goBack(this);
        }

        dispose() {
            if (this._hmc)
                this._hmc.drop();
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
            switch (sig) {
            case nn.SignalClicked:
                nn.EventHook(this, egret.TouchEvent.TOUCH_TAP, this.__cmp_tap, this);
                break;
            case nn.SignalChanged:
                this.mc().signals.redirect(nn.SignalChanged, this);
                break;
            case nn.SignalUpdated:
                this.mc().signals.redirect(nn.SignalUpdated, this);
                break;
            case nn.SignalStart:
                this.mc().signals.redirect(nn.SignalStart, this);
                break;
            case nn.SignalEnd:
                this.mc().signals.redirect(nn.SignalEnd, this);
                break;
            case nn.SignalDone:
                this.mc().signals.redirect(nn.SignalDone, this);
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
        public fillMode:number = 0x3000;//nn.FillMode.ASPECTSTRETCH;

        /** 调整序列帧的对齐位置 */
        public clipAlign:number = 4;//nn.POSITION.CENTER;

        /** 切换clipSource时清空原来的clip */
        clearOnChanging:boolean = true;

        private _hmc:nn.MovieClip;
        private mc():nn.MovieClip {
            if (this._hmc)
                return this._hmc;
            this._hmc = new nn.MovieClip();
            return this._hmc;
        }
        
        createChildren() {
            super.createChildren();

            let mc = this.mc();
            mc.count = this.playCount;
            mc.autoPlay = this.autoPlay;
            mc.location = 0;
            mc.flashMode = this.flashMode;
            mc.fillMode = this.fillMode;
            mc.clipAlign = this.clipAlign;
            mc.clearOnChanging = this.clearOnChanging;
            
            this.addChild(mc.handle());
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

        get clipSource():nn.ClipConfig {
            return this.mc().clipSource;
        }
        set clipSource(cfg:nn.ClipConfig) {
            this.mc().clipSource = cfg;
        }

        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number) {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            // 设置mc和当前的容器大小一致
            let mc = this.mc();
            mc.frame = new nn.Rect(0, 0, unscaledWidth, unscaledHeight);
            mc.flushLayout();
        }

        /** 播放 */
        play() {
            this.mc().play();
        }

        /** 停止 */
        stop() {
            this.mc().stop();
        }        
    }

    _EUIExtFix(MovieClipU);    
}
