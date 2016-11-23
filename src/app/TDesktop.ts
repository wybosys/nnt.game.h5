
class TDialog
extends nn.Dialog
{
    constructor() {
        super();
        this.backgroundColor = nn.Color.Random();
        this.clickedToClose = true;
    }

    bestFrame():nn.Rect {
        return new nn.Rect(300, 0, 300, 300);
    }
}

class TTextDialog
extends TDialog
{
    constructor() {
        super();
        this.label.textAlign = 'center';
        this.label.fontSize = 100;
        this.addChild(this.label);
    }

    label = new nn.Label();

    set text(s:string) {
        this.label.text = s;
    }

    updateLayout() {
        super.updateLayout();
        this.label.setFrame(this.boundsForLayout());
    }

    bestFrame():nn.Rect {
        return new nn.Rect(0, 0, 300, 300);
    }
}

class TTips
extends nn.Tips
{
    constructor() {
        super();
        this.identifier.imageSource = "gd_aw_u_png";
        this.backgroundImage = "gd_bkg_png";

        this._lblTxt.textAlign = "center";
        this._lblTxt.textColor = 0x000000;
        this._lblTxt.text = "TIPS";
        this.addChild(this._lblTxt);
    }

    _lblTxt = new nn.Label();

    setFrame(rc:nn.Rect) {
        super.setFrame(rc);
    }

    updateLayout() {
        super.updateLayout();
        nn.noti(this.frame.toString());
        this._lblTxt.setFrame(this.bounds());
    }

    bestFrame():nn.Rect {
        return new nn.Rect(0, 0, 400, 200);
    }
}

class TDesktop
extends nn.Sprite
{    
    constructor() {
        super();
        this.backgroundColor = nn.Color.Random();

        this._btnPop.text = "POP";
        this._btnPop.signals.connect(nn.SignalClicked, this._actPop, this);
        this.addChild(this._btnPop);

        this._btnTips.text = "TIPS";
        this._btnTips.signals.connect(nn.SignalClicked, this._actTips, this);
        this.addChild(this._btnTips);

        this._btnTipsP.text = "TIPS-POPUP";
        this._btnTipsP.signals.connect(nn.SignalClicked, this._actTipsP, this);
        this.addChild(this._btnTipsP);
        
        this._btnTips0.text = "TIPSP-0";
        this._btnTips0.signals.connect(nn.SignalClicked, this._actTipsP, this);
        this.addChild(this._btnTips0);

        this._btnTips1.text = "TIPSP-1";
        this._btnTips1.signals.connect(nn.SignalClicked, this._actTipsP, this);
        this.addChild(this._btnTips1);

        this._btnTips2.text = "TIPSP-2";
        this._btnTips2.signals.connect(nn.SignalClicked, this._actTipsP, this);
        this.addChild(this._btnTips2);

        this._btnTips3.text = "TIPSP-3";
        this._btnTips3.signals.connect(nn.SignalClicked, this._actTipsP, this);
        this.addChild(this._btnTips3);

        this._img.fillMode = nn.FillMode.ASPECTSTRETCH;
        this._img.setFrame(new nn.Rect(100, 100, 200, 200));
        //this._img.backgroundColor = nn.Color.Random();
        //this._img.imageSource = "http://design.ubuntu.com/wp-content/uploads/ubuntu-logo32.png";
        this._img.imageSource = "ubuntu-logo32";
        this._img.signals.connect(nn.SignalClicked, ()=> {
            nn.log("Image Clicked");
            nn.Hud.Text("Image Clicked");
        }, this);
        this.addChild(this._img);

        this._lbl.text = "A";
        this._lbl.textAlign = "center";
        this._lbl.fontSize = 80;
        this._lbl.setFrame(new nn.Rect(100, 100, 200, 200));
        this.addChild(this._lbl);

        this._btnDlgs.text = "DIALOGS";
        this._btnDlgs.signals.connect(nn.SignalClicked, this._actDlgs, this);
        this.addChild(this._btnDlgs);
    }

    _btnPop = new TButton();
    _btnTips = new TButton();
    _btnTipsP = new TButton();
    _btnTips0 = new TButton();
    _btnTips1 = new TButton();
    _btnTips2 = new TButton();
    _btnTips3 = new TButton();
    _btnDlgs = new TButton();

    _img = new nn.Bitmap();
    _lbl = new nn.Label();

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this)
            .addFlex(1)
            .addPixelHBox(100, (box:nn.HBox) => {
                box
                    .addFlex(1)
                    .addPixel(200, this._btnPop)
                    .addPixel(200, this._btnTips)
                    .addPixel(200, this._btnTipsP)               
                    .addFlex(1);
            })
            .addPixelHBox(100, (box:nn.HBox) => {
                box
                    .addFlex(1)
                    .addPixel(200, this._btnDlgs)
                    .addFlex(1);
            })
            .addFlex(1)
            .apply();

        new nn.VBox(this)
            .addPixelHBox(100, (box:nn.HBox)=> {
                box.addPixel(200, this._btnTips0)
                    .addFlex(1)
                    .addPixel(200, this._btnTips1);
            })
            .addFlex(1)
            .addPixelHBox(100, (box:nn.HBox)=> {
                box.addPixel(200, this._btnTips2)
                    .addFlex(1)
                    .addPixel(200, this._btnTips3);
            })
            .apply();
    }

    _actPop() {
        nn.log("Pop Clicked");
               
        var dlg = new TDialog();
        dlg.onlyFiltersTouchEnabled = true;
        dlg.addFilter(this._img);
        dlg.open();
    }

    _actTips() {
        nn.log("Tips Clicked");

        var tp = new TTips();
        tp.delayClose = 3;
        tp.showTo(this._btnTips);
    }

    _actTipsP(s:nn.Slot) {
        nn.log("TipsP Clicked");

        var tp = new TTips();
        var desk = tp.popupTo(s.sender, false);
        desk.onlyFiltersTouchEnabled = false;
        desk.open();
    }

    _actDlgs() {
        for (var i = 0; i < 3; ++i) {
            var dlg = new TTextDialog();
            dlg.text = 'No.' + i;
            //dlg.open(false);
            dlg.open();
        }
    }

}
