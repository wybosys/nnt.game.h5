module nn {

    export class Graphics
    extends CGraphics
    {
        constructor(gra:egret.Graphics) {
            super();
            this._gra = gra;
        }

        private _gra:egret.Grahpics;

        clear():void {
            _gra.clear();
        }
    }
    
}