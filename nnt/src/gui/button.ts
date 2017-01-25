module nn {

    /** 按钮类
        @note 定义为具有点按状态、文字、图片的元素，可以通过子类化来调整文字、图片的布局方式
     */
    export abstract class CButton
    extends Widget
    implements IState
    {
        constructor() {
            super();
            this.touchEnabled = true;
            this.anchor = Point.AnchorCC;
        }

        static STATE_NORMAL = "::button::state::normal";
        static STATE_DISABLED = "::button::state::disable";
        static STATE_HIGHLIGHT = "::button::state::highlight";
        static STATE_SELECTED = "::button::state::selected";

        /** 是否可用 */
        disabled:boolean;

        /** 字体大小 */
        fontSize:number;

        /** 文字颜色 */
        textColor:ColorType;

        /** 内容 */
        text:string;

        /** 对齐方式 */
        textAlign:string;

        /** 图片 */
        imageSource:TextureSource;

        /** 普通的状态 */
        stateNormal:State;

        /** 禁用的状态 */
        stateDisabled:State;

        /** 高亮的状态 */
        stateHighlight:State;

        /** 选中的状态 */
        stateSelected:State;
        
        /** 点击频度限制 */
        eps:number = 3;

        _signalConnected(sig:string, s?:Slot) {
            super._signalConnected(sig, s);
            if (sig == SignalClicked)
                s.eps = this.eps;
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalClicked);
        }

        isSelection():boolean {
            return this._isSelected;
        }

        protected _isSelected:boolean;
    }

}
