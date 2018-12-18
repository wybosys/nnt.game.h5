module nn {

    export class Pen extends CPen {

    }

    export class Brush extends CBrush {

    }

    export class Painter extends CPainter {

        constructor(ctx: egret.Graphics) {
            super();
            this._ctx = ctx;
        }

        private _ctx: egret.Graphics;
    }
}
