module eui {

    export class DivU extends eui.Component {
        public slots: string = null;
        public tag: any = null;

        onPartBinded(name: string, target: any) {
            _EUIExt.onPartBinded(this, name, target);
        }

        goBack() {
            _EUIExt.goBack(this);
        }

        constructor() {
            super();
        }

        dispose() {
            this._div.drop();
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

        _signalConnected(sig: string, s?: nn.Slot) {
        }

        private _div = new nn.Div();

        createChildren() {
            super.createChildren();
            this.addChild(this._div.handle());
        }

        commitProperties() {
            super.commitProperties();
            this._div.text = this._text;
        }

        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number) {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            this._div.frame = new nn.Rect(0, 0, unscaledWidth, unscaledHeight);
            this._div.flushLayout();
        }

        private _text: string = null;
        public get text(): string {
            return this._text;
        }

        public set text(s: string) {
            this._text = s;
            this.invalidateProperties();
        }
    }

    _EUIExtFix(DivU);
}
