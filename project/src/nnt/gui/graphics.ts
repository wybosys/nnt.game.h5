module nn {

    export class CPen {

        constructor(width = 1, color = Color.Black) {
            this.width = width;
            this.color = color;
        }

        width: number;
        color: Color;
    }

    export class CBrush {

        constructor(color = Color.Black) {
            this.color = color;
        }

        color: Color;
    }

    export class CPainter {

        pen: CPen;
        brush: CBrush;
    }

    export abstract class CGraphics extends Widget {

        constructor() {
            super();
            this.pen = new CPen();
        }

        // 清空画布
        abstract clear();

        // 当前填充的刷子
        protected _br: CBrush;

        get brush(): CBrush {
            return this._br;
        }

        set brush(br: CBrush) {
            this._br = br;
        }

        // 当前画笔
        protected _pen: CPen;

        get pen(): CPen {
            return this._pen;
        }

        set pen(pen: CPen) {
            this._pen = pen;
        }

        // 填充模式
        fill: boolean;

        abstract moveto(pt: Point): this;

        abstract lineto(pt: Point): this;

        abstract rect(rc: Rect, rounded?: Size): this;

        abstract circle(center: Point, radius: number): this;
    }
}
