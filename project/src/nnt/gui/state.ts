module nn {

    /** 承载不同状态对应的外观 */
    export class State {
        constructor(props?: {}) {
            this.props = props;
        }

        // 优化为直接使用 prop 来设置，不进行判断
        props: {};

        change(o: {}) {
            if (this.props == null)
                this.props = {};
            nn.ObjectT.Foreach(<any>o, (v, k) => {
                this.props[k] = v;
            });
        }

        static Text(text: string, color?: ColorType, size?: number): State {
            return new State({
                'text': text,
                'textColor': color,
                'fontSize': size
            });
        }

        static Color(textcolor: ColorType, backcolor?: ColorType) {
            return new State({
                'textColor': textcolor,
                'backgroundColor': backcolor
            });
        }

        static Image(image: TextureSource) {
            return new State({'imageSource': image});
        }

        static BackgroundImage(image: TextureSource) {
            return new State({'backgroundImage': image});
        }

        static Button(text?: string, image?: TextureSource, back?: TextureSource) {
            return new State({
                'text': text,
                'imageSource': image,
                'backgroundImage': back
            });
        }

        static As(obj: any): State {
            if (obj instanceof State)
                return obj;

            let t = typeof (obj);
            if (t == 'string')
                return State.Text(obj);

            return new State();
        }

        setIn(ui: any) {
            if (this.props) {
                nn.ObjectT.Foreach(<any>this.props, (v, k) => {
                    if (v !== undefined)
                        ui[k] = v;
                });
            }

            if (this._children) {
                nn.ObjectT.Foreach(this._children, (v, k) => {
                    v.setIn(ui);
                });
            }
        }

        protected _children: KvObject<State>;
        get children(): KvObject<State> {
            if (this._children == null)
                this._children = {};
            return this._children;
        }

        add(idr: any, child: State): State {
            this.children[idr] = child;
            return this;
        }

        remove(idr: any): State {
            delete this.children[idr];
            return this;
        }
    }

    export interface IState {
        // 根据当前状态返回下一个状态
        nextState?(state: any): any;

        // 是否已经选中
        isSelection?(): boolean;

        // 设置选中状态
        setSelection?(sel: boolean);
    }

    export class States extends SObject {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalStateChanged);
        }

        dispose() {
            super.dispose();
            this.nullstate = null;
            this.nullobj = null;
            this._state = null;
            this._states = null;
        }

        // 当前状态
        private _state: any;
        set state(val: any) {
            this.changeState(val);
        }

        get state(): any {
            return this._state;
        }

        // 空状态，如过setState(null) 则会使用该值作为保护
        nullstate: any;
        // 空状态对应的对象，如过传入没有定义过的状态，则使用该值
        nullobj: any;

        /** 修改一个状态 */
        changeState(val: any, sig: boolean = true): boolean {
            if (this.cbset == null) {
                if (this._state == val)
                    return false;
                this._state = val;
                return true;
            }

            if (val == null)
                val = this.nullstate;

            if (val == this._state)
                return false;

            let obj = this._states[val];
            if (obj == null) {
                if (this.nullobj === undefined) {
                    warn("state " + val + " not binded");
                    return false;
                }
                obj = this.nullobj;
            }

            this._state = val;
            this.cbset.call(this.cbctx, obj);
            sig && this.signals.emit(SignalStateChanged, val);
            return true;
        }

        /** 选中基于传入状态的下一个状态 */
        next(state?: any, selection?: boolean, sig?: boolean) {
            let delegate = <IState>this.cbctx;
            if (sig === undefined)
                sig = true;
            if (state === undefined)
                state = this._state;
            if (selection === undefined && delegate.isSelection)
                selection = delegate.isSelection();
            if (delegate.nextState) {
                state = delegate.nextState(state);
                this.changeState(state, sig);
            } else if (delegate.setSelection) {
                if (!sig)
                    this.signals.block(SignalStateChanged);
                delegate.setSelection(!selection);
                if (!sig)
                    this.signals.unblock(SignalStateChanged);
            }
        }

        updateData(skipnull = true) {
            let obj = this._states[this._state];
            if (obj == null) {
                if (skipnull && this.nullobj === undefined)
                    return;
                obj = this.nullobj;
            }

            this.cbset.call(this.cbctx, obj);
        }

        /** 绑定状态 */
        bind(state: any, val: any, isnullstate?: boolean): States {
            let obj = val instanceof State ? val : new State(val);
            this._states[state] = obj;
            if (isnullstate)
                this.nullstate = state;
            return this;
        }

        /** 查询状态 */
        get(state: any) {
            return this._states[state];
        }

        private _states: KvObject<any> = {};

        // 通过回调来设置具体控件怎么应用状态
        cbset: (obj: any) => void;
        cbctx: any;
    }

}
