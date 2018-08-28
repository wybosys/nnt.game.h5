module nn {

    export class Button
        extends CButton {
        constructor(state?: State) {
            super();
            this.touchEnabled = true;
            if (state)
                this.onChangeState(state);
        }

        dispose() {
            super.dispose();
            if (this._slavestates)
                this._slavestates.dispose();
        }

        set fontSize(val: number) {
            this._getLabel().fontSize = val;
        }

        get fontSize(): number {
            if (this._label)
                return this._label.fontSize;
            return 0;
        }

        set textColor(val: ColorType) {
            this._getLabel().textColor = GetColorComponent(val)[0];
        }

        get textColor(): ColorType {
            if (this._label)
                return this._label.textColor;
            return 0;
        }

        set text(val: string) {
            this._getLabel().text = val;
        }

        get text(): string {
            if (this._label)
                return this._label.text;
            return "";
        }

        set textAlign(val: string) {
            this._getLabel().textAlign = val;
        }

        get textAlign(): string {
            if (this._label)
                return this._label.textAlign;
            return "center";
        }

        private _label: Label;
        get label(): Label {
            return this._label;
        }

        set label(lbl: Label) {
            warn("不能直接设置button的title类");
        }

        protected _getLabel(): Label {
            if (this._label == null) {
                this._label = new Label();
                this._label.textAlign = "center";
                this.addChild(this._label);
            }
            return this._label;
        }

        private _imageView: Bitmap;
        get imageView(): Bitmap {
            return this._imageView;
        }

        set imageView(bmp: Bitmap) {
            warn("不能直接设置button的image");
        }

        private _getImageView(): Bitmap {
            if (this._imageView == null) {
                this._imageView = new Bitmap();
                this._imageView.fillMode = FillMode.ASPECTSTRETCH;
                this.addChild(this._imageView);
            }
            return this._imageView;
        }

        set imageSource(tex: TextureSource) {
            this._getImageView().imageSource = tex;
        }

        get imageSource(): TextureSource {
            if (this._imageView)
                return this._imageView.imageSource;
            return null;
        }

        set imageFillMode(mode: FillMode) {
            this._getImageView().fillMode = mode;
        }

        get imageFillMode(): FillMode {
            if (this._imageView)
                return this._imageView.fillMode;
            return FillMode.ASPECTSTRETCH;
        }

        bestFrame(inrc?: Rect): Rect {
            var brc = new Rect();
            if (this._label)
                brc.union(this._label.bestFrame());
            return brc.unapplyEdgeInsets(this.edgeInsets);
        }

        updateLayout() {
            super.updateLayout();
            var rc = this.boundsForLayout();
            if (this._label)
                this._label.frame = rc;
            if (this._imageView)
                this._imageView.frame = rc;
        }

        set stateNormal(st: State) {
            this.slavestates.bind(Button.STATE_NORMAL, st);
            if (!this.disabled) {
                if (this._slavestates.state == undefined)
                    this._slavestates.state = Button.STATE_NORMAL;
                this.states.updateData(false);
            }
        }

        get stateNormal(): State {
            if (this._slavestates)
                return this._slavestates.get(Button.STATE_NORMAL);
            return null;
        }

        set stateDisabled(st: State) {
            this.slavestates.bind(Button.STATE_DISABLED, st);
            if (this.disabled) {
                if (this._slavestates.state == undefined)
                    this._slavestates.state = Button.STATE_DISABLED;
                this.states.updateData(false);
            }
        }

        get stateDisabled(): State {
            if (this._slavestates)
                return this._slavestates.get(Button.STATE_DISABLED);
            return null;
        }

        set stateHighlight(st: State) {
            this.slavestates.bind(Button.STATE_HIGHLIGHT, st);
            this.states.updateData(false);
        }

        get stateHighlight(): State {
            if (this._slavestates)
                return this._slavestates.get(Button.STATE_HIGHLIGHT);
            return null;
        }

        set stateSelected(st: State) {
            this.slavestates.bind(Button.STATE_SELECTED, st);
            this.states.updateData(false);
        }

        get stateSelected(): State {
            if (this._slavestates)
                return this._slavestates.get(Button.STATE_SELECTED);
            return null;
        }

        protected _slavestates: States;
        protected get slavestates(): States {
            if (this._slavestates == null) {
                this._slavestates = new States();
                this.signals.connect(SignalTouchBegin, this.__btn_touchdown, this);
                this.signals.connect(SignalTouchEnd, this.__btn_touchup, this);
            }
            return this._slavestates;
        }

        protected onChangeState(obj: any) {
            var state = State.As(obj);
            if (this._slavestates) {
                var slvst = this._slavestates.state;
                if (slvst == Button.STATE_NORMAL) {
                    var st = this._slavestates.get(Button.STATE_NORMAL);
                    st && state.add('normal', st);
                }
                else if (slvst == Button.STATE_DISABLED) {
                    var st = this._slavestates.get(Button.STATE_DISABLED);
                    st && state.add('disabled', st);
                }
                else if (slvst == Button.STATE_SELECTED) {
                    var st = this._slavestates.get(Button.STATE_SELECTED);
                    st && state.add('selected', st);
                }
                else if (slvst == Button.STATE_HIGHLIGHT) {
                    var st = this._slavestates.get(Button.STATE_HIGHLIGHT);
                    st && state.add('highlight', st);
                }
            }
            state.setIn(this);
        }

        private _disabled: boolean;
        get disabled(): boolean {
            return this._disabled == true;
        }

        set disabled(b: boolean) {
            if (b == this._disabled)
                return;
            this._disabled = b;
            if (this._slavestates.changeState(this._disabled ? Button.STATE_DISABLED : Button.STATE_NORMAL))
                this.states.updateData(false);
            this.touchEnabled = !b;
        }

        get touchEnabled(): boolean {
            return this._imp.touchEnabled;
        }

        set touchEnabled(b: boolean) {
            this._imp.touchEnabled = !this._disabled && b;
        }

        private __btn_touchdown() {
            if (this._slavestates == null)
                return;
            if (this._slavestates.changeState(Button.STATE_HIGHLIGHT))
                this.states.updateData(false);
        }

        private __btn_touchup() {
            if (this._slavestates == null)
                return;
            if (this._isSelected && this._slavestates.get(Button.STATE_SELECTED)) {
                if (this._slavestates.changeState(Button.STATE_SELECTED))
                    this.states.updateData(false);
            } else {
                if (this._slavestates.changeState(this.disabled ? Button.STATE_DISABLED : Button.STATE_NORMAL))
                    this.states.updateData(false);
            }
        }

        setSelection(sel: boolean) {
            if (sel == this._isSelected)
                return;
            this._isSelected = sel;

            if (this._isSelected && this._slavestates.get(Button.STATE_SELECTED))
                this._slavestates.state = Button.STATE_SELECTED;
            else
                this._slavestates.state = this.disabled ? Button.STATE_DISABLED : Button.STATE_NORMAL;
            this.states.updateData(false);

            // 抛出状态变化
            this.states.signals.emit(SignalStateChanged);
        }
    }

    export class RadioButton
        extends Button
        implements IState {
        constructor() {
            super();
            this.signals.connect(SignalClicked, this.__radio_clicked, this);
        }

        private _selectedState: State;
        set selectedState(val: State) {
            if (this._selectedState == val)
                return;
            this._selectedState = val;
            this.states.bind("selected", val);
        }

        get selectedState(): State {
            return this._selectedState;
        }

        private _unselectedState: State;
        set unselectedState(val: State) {
            if (this._unselectedState == val)
                return;
            this._unselectedState = val;
            this.states.bind("unselected", val);
            if (this.states.state == undefined) {
                this.states.state = "unselected";
            }
        }

        get unselectedState(): State {
            return this._unselectedState;
        }

        _selection: boolean;

        setSelection(val: boolean) {
            if (this._selection == val)
                return;
            this._selection = val;
            this.states.state = val ? "selected" : "unselected";
        }

        isSelection(): boolean {
            return this._selection;
        }

        /** 是否支持点击已经选中的来直接反选 */
        allowDeclick = true;

        private __radio_clicked() {
            if (!this.allowDeclick && this.isSelection())
                return;
            this.setSelection(!this.isSelection());
        }
    }

}