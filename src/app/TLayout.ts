class TLayout
extends nn.ScrollView
{
    constructor() {
        super();

        for (var i = 0; i < 50; ++i) {
            var btn = new TButton();
            btn.text = i.toString();
            this.addChild(btn);
            this._btns.push(btn);
        }
    }

    _btns = new Array<TButton>();

    updateLayout() {
        super.updateLayout();
        var box = new nn.HFlow(this);
        for (var i = 0; i < 50; ++i) {
            /*
            box.addSize(nn.Random.Rangei(100, 500), 100,
                        nn.FlowOption.Stretch, this._btns[i]);
            */
            box.addSize(400, 100,
                        nn.FlowOption.Fix, this._btns[i]);
        }
        box.apply();

        this.contentSize = new nn.Size(0, box.position.y);
    }
}
