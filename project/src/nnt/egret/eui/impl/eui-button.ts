module eui {

    export class ButtonU extends eui.Button implements eui.IItemRenderer {

        public slots: string = null;
        public tag: any = null;

        onPartBinded(name: string, target: any) {
            _EUIExt.onPartBinded(this, name, target);
        }

        goBack() {
            _EUIExt.goBack(this);
        }

        playAnimate(ani: Animate, idr?: any): Animate {
            return _EUIExt.playAnimate(this, ani, idr);
        }

        findAnimate(idr: any): Animate {
            return _EUIExt.findAnimate(this, idr);
        }

        stopAnimate(idr: any) {
            _EUIExt.stopAnimate(this, idr);
        }

        stopAllAnimates() {
            _EUIExt.stopAllAnimates(this);
        }

        set exhibition(b: boolean) {
            _EUIExt.setExhibition(this, b);
        }

        get exhibition(): boolean {
            return _EUIExt.getExhibition(this);
        }

        get effects(): EffectsType {
            return _EUIExt.getEffects(this);
        }

        set effects(effs: EffectsType) {
            _EUIExt.setEffects(this, effs);
        }

        protected _help: any = null;
        get help(): any {
            return this._help;
        }

        set help(h: any) {
            this._help = h;
        }

        belong: any;

        dispose() {
            if (this._signals) {
                this._signals.dispose();
                this._signals = undefined;
            }
            this.belong = null;
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
            this._signals.register(nn.SignalVisibleChanged);
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
            if (sig == nn.SignalClicked) {
                s.eps = this.eps;
                nn.EventHook(this, egret.TouchEvent.TOUCH_TAP, this.__cmp_tap, this);
            }
        }

        /** 点击频度限制 */
        public eps: number = 3;

        private __cmp_tap(e: egret.TouchEvent) {
            this.signals.emit(nn.SignalClicked);
            e.stopPropagation();
        }

        protected _getLabel(): Label {
            return this.labelDisplay instanceof Label ? <any>this.labelDisplay : null;
        }

        childrenCreated() {
            super.childrenCreated();
            if (this._textColor && this._getLabel()) {
                this._getLabel().textColor = this._textColor;
            }
            this.onLoaded();
        }

        onLoaded() {
            // pass
        }

        private _data: any;
        get data(): any {
            return this._data;
        }

        set data(d: any) {
            this._data = d;
            if (this.skin)
                this.updateData();
        }

        get text(): string {
            return this.label;
        }

        set text(s: string) {
            this.label = s;
        }

        private _textColor: number = null;
        public get textColor(): number {
            return this._getLabel() ? this._getLabel().textColor : this._textColor;
        }

        public set textColor(c: number) {
            this._textColor = c;
            if (this._getLabel())
                this._getLabel().textColor = c;
        }

        // 为了满足 IItemRenderer 的需要
        private _itemIndex: number;
        get itemIndex(): number {
            return this._itemIndex;
        }

        set itemIndex(n: number) {
            this._itemIndex = n;
        }

        private _value: any;
        get value(): any {
            return this._value;
        }

        set value(v: any) {
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

        private _format: string = null;
        public get format(): string {
            return this._format;
        }

        public set format(fmt: string) {
            this._format = fmt;
        }

        private _selected: boolean;
        get selected(): boolean {
            return this._selected;
        }

        set selected(s: boolean) {
            if (this._selected == s)
                return;
            this._selected = s;
            this.updateSelection();
            this.invalidateState();
        }

        getCurrentState(): string {
            if (this._selected)
                return "down";
            if (this.enabled == false)
                return 'disabled';
            return super.getCurrentState();
        }

        /** 刷新选中状态 */
        updateSelection() {
            // override
        }

        /** 刷新数据 */
        updateData() {
            // override
        }

        /** 隶属的栈 */
        get viewStack(): IViewStack {
            return _EUIExt.getViewStack(this);
        }

        set viewStack(sck: IViewStack) {
            _EUIExt.setViewStack(this, sck);
        }

        convertPointTo(pt: nn.Point, sp: egret.DisplayObject | nn.CComponent): nn.Point {
            return ConvertPoint(this, pt, sp);
        }

        convertRectTo(rc: nn.Rect, sp: egret.DisplayObject | nn.CComponent): nn.Rect {
            return ConvertRect(this, rc, sp);
        }

        get frame(): nn.Rect {
            return nn.getFrame(this);
        }

        set frame(rc: nn.Rect) {
            nn.setFrame(this, rc);
        }

        onVisibleChanged() {
            if (this._signals)
                this._signals.emit(nn.SignalVisibleChanged);
        }

        $setVisible(b: boolean): boolean {
            if (this.visible != b) {
                super.$setVisible(b);
                this.onVisibleChanged();
                return true;
            }
            return false;
        }

        get source(): string | egret.Texture {
            return this.icon;
        }

        set source(s: string | egret.Texture) {
            this.icon = s;
        }
    }

}
