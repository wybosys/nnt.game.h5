module eui {

    export class ParticleU extends eui.Component {
        public slots: string = null;
        public tag: any = null;

        constructor() {
            super();
        }

        onPartBinded(name: string, target: any) {
            _EUIExt.onPartBinded(this, name, target);
        }

        goBack() {
            _EUIExt.goBack(this);
        }

        dispose() {
            if (this._hpc)
                this._hpc.drop();
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

        /** 自动播放 */
        public autoPlay: boolean = true;

        private _hpc: nn.Particle;

        private pc(): nn.Particle {
            if (this._hpc)
                return this._hpc;
            this._hpc = new nn.Particle();
            return this._hpc;
        }

        _signalConnected(sig: string, s?: nn.Slot) {
            switch (sig) {
                case nn.SignalClicked:
                    nn.EventHook(this, egret.TouchEvent.TOUCH_TAP, this.__cmp_tap, this);
                    break;
                case nn.SignalChanged:
                    this.pc().signals.redirect(nn.SignalChanged, this);
                    break;
                case nn.SignalUpdated:
                    this.pc().signals.redirect(nn.SignalUpdated, this);
                    break;
                case nn.SignalStart:
                    this.pc().signals.redirect(nn.SignalStart, this);
                    break;
                case nn.SignalEnd:
                    this.pc().signals.redirect(nn.SignalEnd, this);
                    break;
                case nn.SignalDone:
                    this.pc().signals.redirect(nn.SignalDone, this);
                    break;
            }
        }

        private __cmp_tap(e: egret.TouchEvent) {
            this.signals.emit(nn.SignalClicked);
            e.stopPropagation();
        }

        private _sourceChanged = false;

        private _particleName: string = null;
        public get particleName(): string {
            return this._particleName;
        }

        public set particleName(s: string) {
            this._particleName = s;
            this._sourceChanged = true;
            this.invalidateProperties();
        }

        private _textureSource: string = null;
        public get textureSource(): string {
            return this._textureSource;
        }

        public set textureSource(s: string) {
            this._textureSource = s;
            this._sourceChanged = true;
            this.invalidateProperties();
        }

        private _configSource: string = null;
        public get configSource(): string {
            return this._configSource;
        }

        public set configSource(s: string) {
            this._configSource = s;
            this._sourceChanged = true;
            this.invalidateProperties();
        }

        createChildren() {
            super.createChildren();

            let pc = this.pc();
            pc.autoPlay = this.autoPlay;

            this.addChild(pc.handle());
        }

        commitProperties() {
            super.commitProperties();
            if (this._sourceChanged) {
                this._sourceChanged = false;

                let source = new nn.ParticleSource(this.particleName, this.configSource, this.textureSource);
                this.particleSource = source;
            }
        }

        get particleSource(): nn.ParticleSource {
            return this.pc().particleSource;
        }

        set particleSource(ps: nn.ParticleSource) {
            this.pc().particleSource = ps;
        }

        start() {
            this.pc().start();
        }

        stop() {
            this.pc().stop();
        }

        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number) {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            // 设置mc和当前的容器大小一致
            let pc = this.pc();
            pc.frame = new nn.Rect(0, 0, unscaledWidth, unscaledHeight);
            pc.flushLayout();
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

    _EUIExtFix(ParticleU);
}
