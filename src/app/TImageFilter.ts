class TImageFilter
extends nn.Sprite
{
    constructor() {
        super();
        this.addChild(this._bmp);
        this.addChild(this._mask);

        this._bmp.maskView = this._mask;

        this.signals.connect(nn.SignalTouchMove, ()=>{
            let pt = this.touch.currentPosition;
            this._mask.setCenter(pt);
        }, this);
    }

    _bmp = new nn.Bitmap();
    _mask = new nn.Bitmap();

    updateResource() {
        super.updateResource();
        this._bmp.imageSource = 'assets://data/house.jpg';
        this._mask.imageSource = 'assets://data/mask.png';
    }

    updateLayout() {
        super.updateLayout();
        let rc = this.boundsForLayout();
        this._bmp.frame = rc;
        this._mask.frame = new nn.Rect(0, 0, 200, 200).setCenter(rc.center);
    }
}
