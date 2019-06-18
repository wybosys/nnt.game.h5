module nn {

    export class Bitmap extends CBitmap {
        constructor(res?: TextureSource) {
            super();

            this._bmp.width = this._bmp.height = 0;
            this._imp.addChild(this._bmp);

            if (res) {
                this.imageSource = res;
                this.setFrame(this.bestFrame());
            }
        }

        protected _bmp = new ExtBitmap();

        protected onChangeState(obj: any) {
            if (obj == null) {
                this.imageSource = null;
                return;
            }
            super.onChangeState(obj);
        }

        bestFrame(inrc?: Rect): Rect {
            if (this.preferredFrame)
                return this.preferredFrame.clone();
            var tex = this._getTexture();
            if (tex == null)
                return new Rect();
            return new Rect(0, 0, tex.textureWidth, tex.textureHeight);
        }

        protected _getTexture(): egret.Texture {
            if (<any>this._bmp.texture instanceof egret.Texture)
                return <any>this._bmp.texture;
            return null;
        }

        /** 按照材质的大小设置显示的大小 */
        autoFit: boolean;

        private _imageSource: TextureSource = null;
        get imageSource(): TextureSource {
            var tex = this._getTexture();
            if (tex == null)
                return this._imageSource;
            COriginType.shared.imp = tex;
            return COriginType.shared;
        }

        set imageSource(ds: TextureSource) {
            if (this._imageSource == ds)
                return;
            this._imageSource = ds;
            ResManager.getTexture(ds, ResPriority.NORMAL, (tex: ICacheTexture) => {
                if (ds != this._imageSource)
                    return;
                this._setTexture(tex.use());
            }, this);
        }

        private _point9: Point9;

        get point9(): Point9 {
            return this._point9;
        }

        set point9(p: Point9) {
            this._point9 = p;
            if (p)
                this._bmp.scale9Grid = new egret.Rectangle(p[0], p[1], p[2], p[3]);
            else
                this._bmp.scale9Grid = null;
        }

        protected _setTexture(tex: egret.Texture) {
            impSetTexture(this._bmp, tex);

            let p9rc = this._bmp.scale9Grid;
            if (p9rc) {
                this._point9 = [p9rc.x, p9rc.y, p9rc.width, p9rc.height];
            }

            if (this._signals)
                this._signals.emit(SignalChanged, tex);

            // 材质的变化有可能会引起布局的改变，所以需要刷新一下
            this.setNeedsLayout();
        }

        updateLayout() {
            super.updateLayout();
            let self = this;
            let rc = self.boundsForLayout();
            if (rc.width == 0 && rc.height == 0) {
                let bmp = self._bmp;
                bmp.width = bmp.height = 0;
                self.updateCache();
                return;
            }

            let bst = self.bestFrame();
            if (bst.width == 0 || bst.height == 0) {
                self.impSetFrame(rc, self._bmp);
                self.updateCache();
                return;
            }

            bst.fill(rc, self.fillMode);
            let pt = rc.center;
            if (self.preferredFrame) {
                pt.x += self.preferredFrame.x;
                pt.y += self.preferredFrame.y;
            }
            bst.center = pt;

            self.impSetFrame(bst, self._bmp);
            self.updateCache();
        }
    }

    export class Picture extends Bitmap {
        constructor(res?: TextureSource) {
            super(res);
            this.fillMode = FillMode.CENTER;
        }
    }
}
