module eui {

    export class TextInputU
    extends eui.TextInput
    {
        protected onPartBinded = _EUIExtPROTO.onPartBinded;
        public slots:string = null;
        public tag:any = null;

        constructor() {
            super();
            nn.EventHook(this, egret.FocusEvent.FOCUS_IN, this.__txt_focusin, this);
            nn.EventHook(this, egret.FocusEvent.FOCUS_OUT, this.__txt_focusout, this);
        }

        get value():numstr {
            return this.text;
        }

        set value(v:numstr) {
            this.text = v;
        }

        set exhibition(b:boolean) {
            _EUIBaseExtPROTO.setExhibition.call(this, b);
        }
        get exhibition():boolean {
            return _EUIBaseExtPROTO.getExhibition.call(this);
        }

        dispose() {
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
            this._signals.register(nn.SignalChanged);
            this._signals.register(nn.SignalFocusGot);
            this._signals.register(nn.SignalFocusLost);
            this._signals.register(nn.SignalKeyPress);
            this._signals.register(nn.SignalEnterKey);
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
            case nn.SignalChanged:
                nn.EventHook(this, egret.Event.CHANGE, this.__txt_changed, this); break;
            case nn.SignalEnterKey:
                this.signals.connect(nn.SignalKeyPress, this.__txt_keypress, this); break;
            }
        }

        private __txt_changed() {
            this._signals.emit(nn.SignalChanged);
        }

        private __txt_focusin() {
            nn.Keyboard.visible = true;
            if (this._signals)
                this._signals.emit(nn.SignalFocusGot);
        }

        private __txt_focusout() {
            nn.Keyboard.visible = false;
            if (this._signals)
                this._signals.emit(nn.SignalFocusLost);
        }

        private __txt_keypress(s:hd.Slot) {
            let d:hd.CKeyboard = s.data;
            if (d.code == 13)
                this._signals.emit(nn.SignalEnterKey);
        }

        private _need_fix_textadapter = true;

        get readonly():boolean {
            return !this.touchEnabled;
        }
        set readonly(b:boolean) {
            this.touchEnabled = !b;
        }
    }
    
}