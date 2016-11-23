module eui {

    export class GroupU
    extends eui.Group
    {
        protected onPartBinded = _EUIExtPROTO.onPartBinded;
        public slots:string = null;
        public tag:any = null;
        goBack = _EUIBaseExtPROTO.goBack;
        playAnimate = _EUIBaseExtPROTO.playAnimate;
        findAnimate = _EUIBaseExtPROTO.findAnimate;
        stopAnimate = _EUIBaseExtPROTO.stopAnimate;
        stopAllAnimates = _EUIBaseExtPROTO.stopAllAnimates;

        set exhibition(b:boolean) {
            _EUIBaseExtPROTO.setExhibition.call(this, b);
        }
        get exhibition():boolean {
            return _EUIBaseExtPROTO.getExhibition.call(this);
        }

        dispose() {
            this.stopAllAnimates();
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
            this._signals.delegate = this;
            this._signals.register(nn.SignalClicked);
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
            if (sig == nn.SignalClicked) {
                nn.EventHook(this, egret.TouchEvent.TOUCH_TAP, this.__cmp_tap, this);
            }
        }
        
        private __cmp_tap(e:egret.TouchEvent) {
            this.signals.emit(nn.SignalClicked);
            e.stopPropagation();
        }

        // 让group表现和button类似
        selected:boolean;

        // group的enable状态表现为是否能触摸
        public get enabled():boolean {
            return this.touchEnabled;
        }
        public set enabled(v:boolean) {
            this.touchEnabled = v;
        }

        public get interactiveEnabled():boolean {
            return this.touchEnabled;
        }
        public set interactiveEnabled(v:boolean) {
            this.touchEnabled = v;
            this.touchChildren = v;
        }

        get frame():hd.Rect {
            return nn.getFrame(this);
        }        
        set frame(rc:hd.Rect) {
            nn.setFrame(this, rc);
        }

        onAppeared() {
        }

        onDisappeared() {
        }
    }   
    
}