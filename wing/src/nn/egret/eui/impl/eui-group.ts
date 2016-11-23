module eui {

    export class GroupU
    extends eui.Group
    {
        public slots:string = null;
        public tag:any = null;

        onPartBinded(name:string, target:any) {
            _EUIExt.onPartBinded(this, name, target);
        }

        goBack() {
            _EUIExt.goBack(this);
        }

        playAnimate(ani:Animate, idr?:any):Animate {
            return _EUIExt.playAnimate(this, ani, idr);
        }

        findAnimate(idr:any):Animate {
            return _EUIExt.findAnimate(this, idr);
        }

        stopAnimate(idr:any) {
            _EUIExt.stopAnimate(this, idr);
        }

        stopAllAnimates() {
            _EUIExt.stopAllAnimates(this);
        }

        set exhibition(b:boolean) {
            _EUIExt.setExhibition(this, b);
        }
        
        get exhibition():boolean {
            return _EUIExt.getExhibition(this);
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

        get frame():nn.Rect {
            return nn.getFrame(this);
        }        
        set frame(rc:nn.Rect) {
            nn.setFrame(this, rc);
        }

        onAppeared() {
        }

        onDisappeared() {
        }
    }   
    
}
