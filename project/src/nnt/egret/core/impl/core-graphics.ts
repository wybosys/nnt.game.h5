module nn {

    export class Graphics extends nn.CGraphics {

        constructor() {
            super();

            this._imp.addChild(this._spe);
        }

        protected _spe = new egret.Shape();

        updateLayout() {
            super.updateLayout();

            this.impSetFrame(this.boundsForLayout(), this._spe);

            this.updateCache();
        }

        clear() {
            this._spe.graphics.clear();
        }

        get pen(): CPen {
            return this._pen;
        }

        set pen(pen: CPen) {
            this._pen = pen;
            this._spe.graphics.lineStyle(pen.width, pen.color.rgb, pen.color.alphaf, true);
        }

        private _fill: boolean;

        get fill(): boolean {
            return this._fill;
        }

        set fill(f: boolean) {
            this._fill = f;
            if (f) {
                if (this._br) {
                    this._spe.graphics.beginFill(this._br.color.rgb, this._br.color.alphaf);
                } else {
                    this._spe.graphics.beginFill(0, 1);
                }
            } else {
                this._spe.graphics.endFill();
            }
        }

        moveto(pt: Point): this {
            this._spe.graphics.moveTo(pt.x, pt.y);
            return this;
        }

        lineto(pt: Point): this {
            this._spe.graphics.lineTo(pt.x, pt.y);
            return this;
        }

        rect(rc: Rect, rounded?: Size): this {
            if (rounded)
                this._spe.graphics.drawRoundRect(rc.x, rc.y, rc.width, rc.height, rounded.width, rounded.height);
            else
                this._spe.graphics.drawRect(rc.x, rc.y, rc.width, rc.height);
            return this;
        }

        circle(center: Point, radius: number): this {
            this._spe.graphics.drawCircle(center.x, center.y, radius);
            return this;
        }
    }
}
