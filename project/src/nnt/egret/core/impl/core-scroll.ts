module nn {

    class ExtScrollView extends egret.ScrollView {
        constructor(ui: Component) {
            super();
            this.setContent(ui.handle());
        }

        _fmui: any;

        dispose() {
            this._fmui = undefined;
        }

        _updateContentPosition() {
            // 当滚动的时候回调
            super._updateContentPosition();
            if (this._fmui)
                this._fmui.onPositionChanged();
        }

        setScrollPosition(top: number, left: number, isOffset: boolean) {
            super.setScrollPosition(top, left, isOffset);
        }

        // 直接覆盖基类的函数
        _onTouchBegin(e: egret.TouchEvent) {
            super._onTouchBegin(e);
            if (this._fmui)
                this._fmui._onTouchBegin(e);
        }

        _onTouchMove(e: egret.TouchEvent) {
            super._onTouchMove(e);
            if (this._fmui)
                this._fmui.onPositionChanged();
        }

        _onTouchEnd(e: egret.TouchEvent) {
            super._onTouchEnd(e);
            if (this._fmui)
                this._fmui._onTouchEnd(e);
        }

        _onScrollStarted() {
            super._onScrollStarted();
            if (this._fmui)
                this._fmui._onScrollStarted();
        }

        _onScrollFinished() {
            super._onScrollFinished();
            if (this._fmui)
                this._fmui._onScrollFinished();
        }
    }

    export class ScrollView extends CScrollView {
        constructor(cnt?: Component) {
            super(null);

            this._scrollContent = new SpriteWrapper();

            this._scrollView = new ExtScrollView(this._scrollContent);
            this._scrollView._fmui = this;
            this._imp.addChild(this._scrollView);

            if (cnt)
                this.contentView = cnt;
        }

        dispose() {
            this._scrollView.dispose();
            super.dispose();
        }

        private _scrollView: ExtScrollView;

        private _contentEdgeInsets: EdgeInsets;
        get contentEdgeInsets(): EdgeInsets {
            return this._scrollContent.edgeInsets;
        }

        set contentEdgeInsets(v: EdgeInsets) {
            this._scrollContent.edgeInsets = v;
        }

        updateData() {
            super.updateData();
            this.contentView.updateData();
        }

        stopDecelerating() {
            let scl: any = this._scrollView;
            if (scl._ScrV_Props_._isHTweenPlaying) {
                egret.ScrollTween.removeTweens(scl);
                scl._ScrV_Props_._isHTweenPlaying = false;
                scl._ScrV_Props_._hScrollTween = null;
            }
            if (scl._ScrV_Props_._isVTweenPlaying) {
                egret.ScrollTween.removeTweens(scl);
                scl._ScrV_Props_._isVTweenPlaying = false;
                scl._ScrV_Props_._vScrollTween = null;
            }
        }

        updateLayout() {
            super.updateLayout();
            var rc = this.bounds();

            if (this.floatingIdentifier == false) {
                if (this._verticalIdentifier) {
                    var bst = this._verticalIdentifier.bestFrame();
                    rc.width -= Math.abs(bst.x) + bst.width;
                }
                if (this._horizonIdentifier) {
                    var bst = this._horizonIdentifier.bestFrame();
                    rc.height -= Math.abs(bst.y) + bst.height;
                }
            }

            var box = new HBox(this).setRect(this.bounds());
            box.addFlexVBox(1, (box: VBox) => {
                if (this._horizonIdentifier) {
                    var bst = this._horizonIdentifier.bestFrame();
                    box.addFlex(1);
                    box.addPixel(bst.height, this._horizonIdentifier);
                }
            });
            if (this._verticalIdentifier) {
                var bst = this._verticalIdentifier.bestFrame();
                box.addPixel(bst.width, this._verticalIdentifier);
            }
            box.apply();

            // 计算到抛去指示条后的大小
            rc.applyEdgeInsets(this.edgeInsets);

            // 可视区域大小
            this.regionBounds.setSize(rc.width, rc.height);

            // 引用到egret的scroll
            this.impSetFrame(rc, this._scrollView);
            this._scrollView.mask = new egret.Rectangle(0, 0, 200, 200);
        }

        boundsForContent(): Rect {
            return this.bounds().applyEdgeInsets(this.contentEdgeInsets);
        }

        addChild(c: Component) {
            return this.contentView.addChild(c);
        }

        removeChild(c: Component) {
            this.contentView.removeChild(c);
        }

        private _verticalIdentifier: Component;
        get verticalIdentifier(): Component {
            return this._verticalIdentifier;
        }

        set verticalIdentifier(v: Component) {
            if (v == this._verticalIdentifier)
                return;
            if (this._verticalIdentifier)
                super.removeChild(this._verticalIdentifier);
            this._verticalIdentifier = v;
            if (v) {
                v.touchEnabled = false;
                super.addChild(v);
            }
        }

        private _horizonIdentifier: Component;
        get horizonIdentifier(): Component {
            return this._horizonIdentifier;
        }

        set horizonIdentifier(v: Component) {
            if (v == this._horizonIdentifier)
                return;
            if (this._horizonIdentifier)
                super.removeChild(this._horizonIdentifier);
            this._horizonIdentifier = v;
            if (v) {
                v.touchEnabled = false;
                super.addChild(v);
            }
        }

        private _contentSize = new Size();
        get contentSize(): Size {
            return this._contentSize.clone();
        }

        set contentSize(sz: Size) {
            // 保存
            this._contentSize.copy(sz);

            // 增加边缘
            sz.add(EdgeInsets.Width(this.contentEdgeInsets),
                EdgeInsets.Height(this.contentEdgeInsets));

            // 刷新后需要设置回之前的位置
            var pos = this.contentOffset;
            var d = sz.width - this._contentSize.width;
            if (d < 0 && pos.x + d >= 0) {
                pos.x += d;
                this.regionBounds.x = pos.x - EdgeInsets.Left(this.contentEdgeInsets);
            }
            var d = sz.height - this._contentSize.height;
            if (d < 0 && pos.y + d >= 0) {
                pos.y += d;
                this.regionBounds.y = pos.y - EdgeInsets.Top(this.contentEdgeInsets);
            }
            this.contentOffset = pos;

            // 刷新指示的位置
            this._scrollContent.setSize(new Size(sz.width, sz.height));
            this._updateIdentifier();

            if (this._signals)
                this._signals.emit(SignalConstriantChanged);
        }

        protected _scrollContent: SpriteWrapper;

        set contentView(ui: Component) {
            if (this._scrollContent.contentView)
                this._scrollContent.contentView.belong = null;
            this._scrollContent.contentView = ui;
            if (ui)
                ui.belong = <any>this;
        }

        get contentView(): Component {
            var r = this._scrollContent.contentView;
            if (r == null) {
                r = new Sprite();
                this._scrollContent.contentView = r;
            }
            return r;
        }

        protected _updateIdentifier() {
            if (this._verticalIdentifier == null &&
                this._horizonIdentifier == null)
                return;

            var cntsz = this.contentSize;
            var rg = this.regionBounds;
            if (this._verticalIdentifier) {
                var per = new Percentage(cntsz.height - rg.height, rg.y);
                (<IProgress><any>this._verticalIdentifier).progressValue = per;
            }
            if (this._horizonIdentifier) {
                var per = new Percentage(cntsz.width - rg.width, rg.x);
                (<IProgress><any>this._horizonIdentifier).progressValue = per;
            }
        }

        onPositionChanged() {
            // 更新偏移
            this._contentOffset.x = this._scrollView.scrollLeft * ScaleFactorDeX;
            this._contentOffset.y = this._scrollView.scrollTop * ScaleFactorDeY;

            // 更新可视区域
            this.regionBounds.x = this._contentOffset.x - EdgeInsets.Left(this.contentEdgeInsets);
            this.regionBounds.y = this._contentOffset.y - EdgeInsets.Top(this.contentEdgeInsets);

            // 更新指示器的位置
            this._updateIdentifier();

            super.onPositionChanged();
        }

        private _scrollTouching: boolean = false;

        _onTouchBegin(e: egret.TouchEvent) {
            this._scrollTouching = true;
            this._signals && this._signals.emit(SignalScrollBegin);
        }

        _onTouchEnd(e: egret.TouchEvent) {
        }

        _onScrollStarted() {
        }

        _onScrollFinished() {
            if (this._scrollTouching == false)
                return;
            this._scrollTouching = false;
            this._signals && this._signals.emit(SignalScrollEnd);
        }

        regionBounds = new Rect();

        setContentOffset(pt: Point, duration: number) {
            super.setContentOffset(pt, duration);
            if (duration == 0) {
                this._scrollView.scrollLeft = pt.x * ScaleFactorX;
                this._scrollView.scrollTop = pt.y * ScaleFactorY;
            } else {
                this._scrollView.setScrollLeft(pt.x * ScaleFactorX, duration * 1000);
                this._scrollView.setScrollTop(pt.y * ScaleFactorY, duration * 1000);
            }
        }
    }

}