module nn {

    export abstract class CScrollView
    extends Component
    {
        constructor(cnt?:CComponent) {
            super();
            if (cnt)
                this.contentView = cnt;
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalScrollBegin);
            this._signals.register(SignalScrollEnd);
            this._signals.register(SignalScrolled);
        }
        
        /** 指示条是否嵌入页面中，否则浮在页面上 */
        floatingIdentifier = true;

        /** 内容页面 */
        contentView:CComponent;

        /** 内容大小 */
        contentSize:Point;

        /** 滚动的偏移 */
        protected _contentOffset = new Point();
        get contentOffset():Point {
            return this._contentOffset;
        }
        set contentOffset(pt:Point) {
            this.setContentOffset(pt, 0);
        }

        /** 带动画的偏移
            @note 注意会引起 ScrollEnd 的消息
         */
        setContentOffset(pt:Point, duration:number) {
            this._contentOffset = pt;
        }

        setContentOffsetX(v:number, duration:number) {
            let pt = new Point(v, this._contentOffset.y);
            this.setContentOffset(pt, duration);
        }
        
        setContentOffsetY(v:number, duration:number) {
            let pt = new Point(this._contentOffset.x, v);
            this.setContentOffset(pt, duration);
        }

        /** 显示中的区域 */
        regionBounds:Rect;

        /** 计算内容的大小 */
        abstract boundsForContent():Rect;

        /** 指示条，需要实现 IProgress */
        verticalIdentifier:CComponent;
        horizonIdentifier:CComponent;

        /** 内容的边距 */
        contentEdgeInsets:EdgeInsets;

        /** 当滚动 */
        onPositionChanged() {
            if (this._signals)
                this._signals.emit(SignalScrolled);            
        }

        /** 停止滚动 */
        stopDecelerating() {}

        /** 使用scroll包裹一个空间来滑动 */
        static Wrapper(ui:CComponent):CScrollView {
            let cls = ObjectClass(this);
            let scl:CScrollView = new cls(ui);
            // 内容改变时刷新
            if (ui instanceof CBitmap ||
                ui instanceof CLabel)
            {
                ui.signals.redirect(SignalChanged, SignalConstriantChanged);
            }
            let rc = ui.bestFrame();
            scl.contentSize = rc.size;
            ui.signals.connect(SignalConstriantChanged, ()=>{
                let bst:Rect;
                if (ui instanceof CLabel) {
                    let lbl = <CLabel>ui;
                    let cnt = scl.boundsForContent();
                    if (lbl.multilines)
                        bst = ui.bestFrame(new nn.Rect(0, 0, cnt.width, 0));
                    else
                        bst = ui.bestFrame(new nn.Rect(0, 0, 0, cnt.height));
                } else {
                    bst = ui.bestFrame();
                }
                scl.contentSize = bst.size;
            }, this);
            return scl;
        }
    }

}
