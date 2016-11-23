class TUnitTest
extends nn.Sprite
{
    constructor() {
        super();
        this.edgeInsets = new nn.EdgeInsets(100, 100, 50, 50);
        this.addChild(this.lblAppId);
    }    

    lblAppId = new nn.Label();

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this)
            .addPixel(100, this.lblAppId)
            .apply();
    }

    updateData() {
        super.updateData();
        this.lblAppId.text = nn.Application.shared.uniqueId;
    }
}
