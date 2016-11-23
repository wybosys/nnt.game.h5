class TCodec
extends nn.Sprite
{
    constructor() {
        super();
        this.backgroundColor = nn.Color.White;

        this.inpUrl.textColor = nn.Color.Black;
        this.inpUrl.placeholder = "INPUT URL";
        this.inpUrl.text = "data1";
        this.addChild(this.inpUrl);

        this.btnUnzip.textColor = nn.Color.Black;
        this.btnUnzip.text = "UNZIP";
        this.btnUnzip.signals.connect(nn.SignalClicked, this._actUnzip, this);
        this.addChild(this.btnUnzip);

        this.lblContent.textColor = nn.Color.Black;
        this.lblContent.multilines = true;
        this.addChild(this.lblContent);
    }
    
    inpUrl = new nn.TextField();
    lblContent = new nn.Label();
    btnUnzip = new nn.Button();

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this)
            .padding(new nn.EdgeInsets(100, 100, 100, 100))
            .addPixel(30, this.inpUrl)
            .addPixel(30, this.btnUnzip)
            .addFlex(1, this.lblContent)
            .apply();
    }

    _actUnzip() {
        nn.ResManager.getBinary(this.inpUrl.text, RES.LoadPriority.NORMAL, (rcd:nn.ICacheBinary)=>{
            //let zip = new nn.ZipArchiver();
            let zip = new nn.LzmaArchiver();
            zip.load(rcd.use());
            zip.file("default.res.json", nn.ResType.TEXT, (plain:string)=>{
                this.lblContent.text = plain;
            });
            rcd.drop();
        }, this);
    }
}
    