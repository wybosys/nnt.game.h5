module nn {

    export class ExtBitmapText
    extends egret.BitmapText
    {
        constructor() {
            super();
            this.width = 0;
            this.height = 0;
        }
    }

    export class BitmapLabel
    extends CBitmapLabel
    {
        constructor() {
            super();
            this._imp.addChild(this._lbl);
            this.fontSize = CLabel.FontSize;
        }
        
        protected _lbl = new ExtBitmapText();

        updateLayout() {
            super.updateLayout();

            // 虽然 2.5.6 版本以后实现了align，但是因为不支持字体缩放，所以不用系统的来实现
            if (this._lbl.font == null)
                return;
            
            var rc = this.boundsForLayout();

            // 需要计算被fontSize影响下的大小和缩放
            rc.width /= this._fontScale;
            rc.height /= this._fontScale;
            this.impSetFrame(rc, this._lbl);

            // 需要计算真实的大小，达到垂直居中
            if (this.textAlign == 'center') {
                var trcw = this._lbl.measuredWidth * ScaleFactorDeW;
                rc.x = (rc.width - trcw) * this._lbl.scaleX * 0.5;
            } else if (this.textAlign == 'right') {
                var trcw = this._lbl.measuredWidth * ScaleFactorDeW;
                rc.x = (rc.width - trcw) * this._lbl.scaleX;
            }

            var trch = this._lbl.measuredHeight * ScaleFactorDeH;            
            rc.y = (rc.height - trch) * this._lbl.scaleY * 0.5;

            this.impSetFrame(rc, this._lbl);
        }

        private _fontSize:number;
        private _fontScale = 1;
        get fontSize():number {
            return this._fontSize * ScaleFactorDeS;
        }
        set fontSize(fs:number) {
            var self = this;
            if (self._fontSize == fs)
                return;            
            var oldcs = self.characterSpacing;
            var oldls = self.lineSpacing;
            // 获得之前的尺寸
            fs *= ScaleFactorS;
            self._fontSize = fs;
            self._fontScale = fs / CLabel.FontSize;
            // 应用尺寸
            self._lbl.scaleX = self._fontScale;
            self._lbl.scaleY = self._fontScale;
            self.characterSpacing = oldcs;
            self.lineSpacing = oldls;
            // 刷新尺寸
            self.setNeedsLayout();
        }

        get characterSpacing():number {
            return this._lbl.letterSpacing * this._fontScale;
        }
        set characterSpacing(v:number) {
            this._lbl.letterSpacing = v / this._fontScale;
        }

        get lineSpacing():number {
            return this._lbl.lineSpacing * this._fontScale;
        }
        set lineSpacing(v:number) {
            this._lbl.lineSpacing = v / this._fontScale;
        }

        get text():string {
            return this._lbl.text;
        }
        set text(s:string) {
            this._lbl.text = s;
            this.setNeedsLayout();
        }

        private _fontSource:FontSource = null;
        get fontSource():FontSource {
            var fnt = this._lbl.font;
            if (fnt == null)
                return this._fontSource;
            COriginType.shared.imp = fnt;
            return COriginType.shared;
        }
        set fontSource(fs:FontSource) {
            if (this._fontSource == fs)
                return;
            this._fontSource = fs;
            ResManager.getBitmapFont(fs, RES.LoadPriority.NORMAL, (font:ICacheFont)=>{
                if (fs != this._fontSource)
                    return;
                this._lbl.font = font.use();
                this.setNeedsLayout();
            }, this);
        }
    }
    
}
