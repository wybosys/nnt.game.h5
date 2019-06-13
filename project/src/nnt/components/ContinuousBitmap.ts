module nn {

    /** 连续图片（背景） */
    export class ContinuousBitmap
        extends Widget {
        constructor() {
            super();
            this.addChild(this._bmpb);
            this.addChild(this._bmpn);
        }

        private _bmpn = new Bitmap(); // bitmap now
        private _bmpb = new Bitmap(); // bitmap back

        get imageSource(): TextureSource {
            return this._bmpn.imageSource;
        }

        set imageSource(ds: TextureSource) {
            this._bmpn.imageSource = ds;
            this._bmpb.imageSource = ds;
        }

        updateLayout() {
            super.updateLayout();
            let rc = this.boundsForLayout();
            this._bmpn.setSize(rc.size);
            this._bmpb.setSize(rc.size);
        }

        /** 方向，先默认实现为水平 */
        direction: Direction = Direction.HOV;

        private _pos = 0;

        /** 偏移的距离 */
        offset(v: number) {
            this._pos += v;
            this.position(this._pos);
        }

        /** 直接设置位置 */
        position(v: number) {
            let rc = this._bmpn.frame;
            if (this.direction == Direction.HOV)
                rc.x = v % rc.width;
            else
                rc.y = v % rc.height;
            this._bmpn.frame = rc;

            let rcb = this._bmpb.frame;
            if (this.direction == Direction.HOV) {
                if (rc.x >= 0) {
                    rcb.rightTop = rc.leftTop;
                } else {
                    rcb.leftTop = rc.rightTop;
                }
            } else {
                if (rc.y >= 0) {
                    rcb.leftBottom = rc.leftTop;
                } else {
                    rcb.leftTop = rc.leftBottom;
                }
            }
            this._bmpb.frame = rcb;
        }
    }

}