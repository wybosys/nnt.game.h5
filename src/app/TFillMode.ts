class TFillMode
extends nn.Sprite
{
    constructor() {
        super();

        this._lbl.fontSize = 20;
        this._sp0.backgroundColor = nn.Color.Blue.clone().setAlphaf(0.8);
        this._sp1.backgroundColor = nn.Color.White.clone().setAlphaf(0.8);

        this.addChild(this._sp0);
        this.addChild(this._sp1);
        this.addChild(this._lbl);
    }

    fillMode:nn.FillMode;
    reverse:boolean;

    _sp0 = new nn.Sprite();
    _sp1 = new nn.Sprite();
    _lbl = new nn.Label();

    updateLayout() {
        super.updateLayout();
        let rc0 = this.bounds();
        let rc1 = new nn.Rect(0, 0, 50, 80);        
        if (this.reverse) {            
            this._sp0.bringFront();
            this._sp1.frame = rc1.setCenter(rc0.center);
            this._sp0.frame = rc0.fill(rc1, this.fillMode);
        } else {
            this._sp1.bringFront();
            this._sp0.frame = rc0;
            this._sp1.frame = rc1.fill(rc0, this.fillMode);
        }

        this._lbl.text = nn.FillModeString(this.fillMode);
        new nn.VBox(this)
            .addFlex(1)
            .addPixel(20, this._lbl)
            .apply();
    }
}

class TFillModes
extends nn.Sprite
{
    constructor() {
        super();
        this.edgeInsets = nn.EdgeInsets.All(10);

        this._fm0.fillMode = nn.FillMode.STRETCH;
        this._fm1.fillMode = nn.FillMode.CENTER;
        this._fm2.fillMode = nn.FillMode.ASPECTSTRETCH;
        this._fm3.fillMode = nn.FillMode.ASPECTFILL;
        
        this.addChild(this._fm0);
        this.addChild(this._fm1);
        this.addChild(this._fm2);
        this.addChild(this._fm3);
    }

    _fm0 = new TFillMode();
    _fm1 = new TFillMode();
    _fm2 = new TFillMode();
    _fm3 = new TFillMode();

    updateLayout() {
        super.updateLayout();
        new nn.HBox(this).setSpacing(10)
            .addFlex(1, this._fm0)
            .addFlex(1, this._fm1)
            .addFlex(1, this._fm2)
            .addFlex(1, this._fm3)
            .apply();
    }
}

class TFillModesReverse
extends TFillModes
{
    constructor() {
        super();
        this._fm0.reverse = true;
        this._fm1.reverse = true;
        this._fm2.reverse = true;
        this._fm3.reverse = true;
    }
}