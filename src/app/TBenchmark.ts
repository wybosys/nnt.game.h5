class TBenchmark
extends nn.Sprite
{
    constructor() {
        super();

        this._btnRes.text = '10wRect';
        this._btnRes.frame = new nn.Rect(100, 100, 200, 100);
        this._btnRes.signals.connect(nn.SignalClicked, ()=>{
            for (var i = 0; i < 100000; ++i) {
                var r = new nn.Rect();
            }
        }, this);
        this.addChild(this._btnRes);
    }

    _btnRes = new TButton();
}