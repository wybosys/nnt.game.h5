module nn {

    export class AbstractFilter
    extends SObject
    {
        constructor() {
            super();
            this._canvas = document.createElement('canvas');
        }

        dispose() {
            super.dispose();
            this._canvas = null;
            this._render = null;
        }
        
        process(tex:egret.Texture):egret.Texture {
            var w = tex.textureWidth, h = tex.textureHeight;

            this._canvas.width = w;
            this._canvas.height = h;
            this._render = this._canvas.getContext('2d');
            this._render.drawImage(tex._bitmapData, 0, 0);

            var rawdata = this._render.getImageData(0, 0, w, h);
            this.processdata(rawdata.data);
            this._render.putImageData(rawdata, 0, 0);

            var img = new Image();
            img.src = this._canvas.toDataURL();
            
            //todo
            //var r = new egret.Texture();
            //r._setBitmapData(img);
            //return r;
            return null;
        }

        processdata(data:number[]) {            
        }

        private _canvas:any;
        private _render:any;
    }

    export class GrayFilter
    extends AbstractFilter
    {
        constructor(color = Color.White) {
            super();
            this.tint = color;
        }
        
        processdata(data:number[]) {
            var sr = this.tint.red;
            var sg = this.tint.green;
            var sb = this.tint.blue;
            var sa = this.tint.alpha;
            
            for (var i = 3; i < data.length; i += 4) {
                var d = data[i - 3] + data[i - 2] + data[i - 1];
                d = d / 3 / 255;
                data[i - 3] = d * sr;
                data[i - 2] = d * sg;
                data[i - 1] = d * sb;
                data[i - 0] = sa;              
            }
        }

        tint:Color;
    }
}
