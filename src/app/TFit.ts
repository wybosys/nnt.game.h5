class TFit
extends nn.Sprite
{
    constructor() {
        super();

        this.img0.imageSource = "btn";
        this.addChild(this.img0);
    }

    img0 = new nn.Bitmap();

    updateLayout() {
        super.updateLayout();
        this.img0.frame = this.bounds();
    }
}
