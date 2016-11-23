module eui {

    export class CheckBoxU
    extends eui.CheckBox
    {
        protected onPartBinded = _EUIExtPROTO.onPartBinded;
        public slots:string = null;
        public tag:any = null;
        goBack = _EUIBaseExtPROTO.goBack;

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
            if (sig == nn.SignalChanged) {
                nn.EventHook(this, eui.UIEvent.CHANGE, this.__cb_changed, this);
            }
        }
        
        private __cb_changed() {
            this.signals.emit(nn.SignalChanged);
        }
        
        get text():string {
            return this.label;
        }
        set text(str:string) {
            this.label = str;
        }
        
        private _value:any;
        get value():any {
            return this._value;
        }
        set value(v:any) {
            this._value = v;
            if (v == null) {
                this.text = '';
                return;
            }
            if (this._format) {
                let args = nn.ArrayT.Concat([this._format], nn.ArrayT.ToArray(v));
                this.text = nn.formatString.apply(null, args);
            } else {
                this.text = nn.asString(v);
            }
        }
        
        private _format:string = null;
        public get format():string {
            return this._format;
        }
        public set format(fmt:string) {
            this._format = fmt;
        }
    }
    
}