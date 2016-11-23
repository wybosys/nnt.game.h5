class TDynamic
extends nn.Sprite//nn.GGround
{
    constructor() {
        super();
        this.signals.connect(nn.SignalClicked, this._cbclicked, this);
    }

    _cbclicked() {
        /*
        var touch = this.touch;
        var sp = new nn.GSprite();
        sp.anchorPoint = new nn.Point(0.5, 0.5);
        sp.backgroundColor = nn.Color.Random();        
        sp.setFrame(new nn.Rect(touch.currentPosition.x, touch.currentPosition.y, 100, 100));
        this.addChild(sp, false);
        */
    }
}
