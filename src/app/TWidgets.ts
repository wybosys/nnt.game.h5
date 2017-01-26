class TSlider
extends nn.Slider
{
    constructor() {
        super();
        this.backgroundColor = nn.Color.White;

        var sp = new nn.Sprite();
        sp.setFrame(new nn.Rect(0, 0, 30, 30));
        sp.backgroundColor = nn.Color.Random();
        this.identifierView = sp;
    }

    dispose() {
        super.dispose();
    }

    bestFrame():nn.Rect {
        return new nn.Rect(0, 0, 50, 50);
    }
}

class TGesButton
extends TButton
{
    dispose() {
        super.dispose();
    }
}

class TTabButton
extends TButton
{
    constructor() {
        super();
        this.stateHighlight = null;

        this.stateNormal = new nn.State({
            backgroundColor:nn.Color.Gray,
            textColor:0,
            scale:new nn.Point(1, 1),
            translate:new nn.Point(0, -20)
        });
        
        var tc = nn.Color.Random();
        var bc = tc.clone().invert();
        this.stateSelected = new nn.State({
            backgroundColor:bc,
            textColor:tc,
            scale:new nn.Point(1.2, 1.2),
            translate:new nn.Point(0, 0)
        });

        this.signals.connect(nn.SignalClicked, this._actClicked, this);
    }

    dispose() {
        super.dispose();
    }

    private _actClicked() {
        if (this.isSelection() == false)
            this.setSelection(true);
    }
}

class TTab
extends nn.TabStack
{
    constructor() {
        super();
        this.edgeInsets = new nn.EdgeInsets(0, 100, 0, 0);
        this.signals.connect(nn.SignalSelectionChanged, this._actSelectionChange, this);
        this.transitionObject = new nn.TransitionFade();

        let r = new TTabPageReuse();
        this.pages = [
            new TTabPageSimple(),
            nn.New(TTabPageScroll),
            new TTabPageHtmlText(),
            new TTabPageDelay(),
            r, r
        ];
    }

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this).setRect(this.bounds())
            .addFlex(1)
            .addPixelHBox(100, (box:nn.HBox)=>{
                this.tabButtons.forEach((btn:nn.Button)=>{
                    box.addFlex(1, btn);
                });
            })
            .apply();
    }

    _actSelectionChange(s:nn.Slot) {
        var pages:nn.SelectionTabData = s.data;
        if (pages.oldTabButton)
            pages.oldTabButton.sendBack(pages.now);
        pages.nowTabButton.bringFront();
    }

    static TabButton(page:nn.StackPageType):nn.Button {
        var btn = new TTabButton();
        btn.text = nn.Classname(page.clazz);
        return btn;
    }
}

class TTabPage
extends nn.Sprite
implements nn.ITabPage
{
    constructor() {
        super();
        this.backgroundColor = nn.Color.Random();
    }

    onLoaded() {
        super.onLoaded();
    }

    tabButton:nn.Button;
    /*
    static TabButton(page:nn.StackPageType):nn.Button {
        var btn = new TTabButton();
        btn.text = nn.Classname(page.clazz);
        return btn;
    }
    */
}

class TTabPageReuse
extends TTabPage
{
    constructor() {
        super();
        this._lbl.textColor = nn.Color.White;
        this._lbl.textAlign = "center";
        this._lbl.fontSize = 100;
        this.addChild(this._lbl);
    }

    onLoaded() {
        super.onLoaded();
        this.signals.connect(nn.SignalSelected, this._cbSelected, this);
    }

    _lbl = new nn.Label();

    updateLayout() {
        super.updateLayout();
        this._lbl.frame = this.boundsForLayout();
    }

    _cbSelected() {
        this._lbl.text = (<nn.TabStack>this.viewStack).selection + '';
    }
}

class TTabPageSimple
extends TTabPage
{
    constructor() {
        super();
        this.resourceGroups = ['font'];

        this.addChild(this._slider);
        this._slider.signals.connect(nn.SignalChanged, (s:nn.Slot) => {
            nn.log(s.data.percent);
        }, this);

        this._lblCustom.textColor = 0xff00ff;
        this._lblCustom.fontSize = 40;
        this._lblCustom.text = "-1234+5678-90";
        //this._lblCustom.fontFamily = "sample";
        this.addChild(this._lblCustom);

        this._lblBtext.textAlign = nn.TextAlign.CENTER;
        this._lblBtext.fontSize = 33;
        this._lblBtext.backgroundColor = nn.Color.White;
        //this._lblBtext.fontSource = 'chlg_lv_fnt';
        //this._lblBtext.fontSource = nn.FontConfig.Bitmap("assets://font/chlg_lv.png", "assets://font/chlg_lv.fnt");
        this._lblBtext.text = '一二级';
        this.addChild(this._lblBtext);

        this._btnLongTap.text = "LONG TAP";
        this._btnLongTap.signals.connect(nn.SignalClicked, ()=>{
            nn.noti('短按');
        }, this);
        var geslt = new nn.GestureLongTap();
        geslt.signals.connect(nn.SignalDone, ()=>{
            nn.noti('长按');
        }, this);
        this._btnLongTap.addGesture(geslt);
        this.addChild(this._btnLongTap);

        this._lblSwipe.text = "SWIPE GESTURE";
        var gessw = new nn.GestureSwipe();
        gessw.signals.connect(nn.SignalDone, (s:nn.Slot)=>{
            var str = '';
            if (nn.Mask.isset(nn.Direction.DOWN, s.data))
                str += 'DOWN ';
            if (nn.Mask.isset(nn.Direction.UP, s.data))
                str += 'UP ';
            if (nn.Mask.isset(nn.Direction.LEFT, s.data))
                str += 'LEFT ';
            if (nn.Mask.isset(nn.Direction.RIGHT, s.data))
                str += 'RIGHT ';
            this._lblSwipe.text = str;
        }, this);
        this._lblSwipe.addGesture(gessw);
        this.addChild(this._lblSwipe);

        this._lblTxt.text = "一二三四ABCD";
        this._lblTxt.fontSize = 30;
        this._lblTxt.backgroundColor = nn.Color.White;
        this._lblTxt.textColor = 0;
        this.addChild(this._lblTxt);
        
        this._inpPh.textColor = 0;
        this._inpPh.placeholder = "输入字体";
        this._inpPh.backgroundColor = nn.Color.White;
        this._inpPh.signals.connect(nn.SignalFocusLost, ()=>{
            this._lblTxt.fontFamily = this._inpPh.text;
        }, this);
        this._inpPh.signals.connect(nn.SignalChanged, (s:nn.Slot)=>{
            nn.log(s.data);
        }, this);
        this.addChild(this._inpPh);

        this._btnFull.text = "FULLSCREEN";
        this._btnFull.backgroundImage = "btn_png";
        this._btnFull.signals.connect(nn.SignalClicked, ()=>{
            if (nn.CApplication.shared.isFullscreen)
                nn.CApplication.shared.exitFullscreen();
            else
                nn.CApplication.shared.enterFullscreen();
        }, this);
        this.addChild(this._btnFull);

        this._btnTrans.text = "TRANS";
        this._btnTrans.signals.connect(nn.SignalClicked, ()=>{
            if (this._btnTrans.tag == undefined) {
                this._btnTrans.setTranslateY(-10);
                this._btnTrans.tag = 'trans';
            } else {
                this._btnTrans.setTranslateY(0);
                this._btnTrans.tag = undefined;
            }
        }, this);
        this.addChild(this._btnTrans);

        this.addChild(this._spFillModes);
        this.addChild(this._spFillModesR);

        let hb = new nn.HtmlBuilder();
        hb.enter('div').style('background', 'red').pop();
        this._spDiv.text = hb.toString();
        this.addChild(this._spDiv);
    }

    _slider = new nn.Slider();
    _lblCustom = new nn.Label();
    _lblBtext = new nn.BitmapLabel();
    _btnLongTap = new TButton();
    _lblSwipe = new TGesButton();
    _lblTxt = new nn.Label();
    _inpPh = new nn.TextField();
    _btnFull = new TButton();
    _btnTrans = new TButton();
    _spDiv = new nn.Div();

    _spFillModes = new TFillModes();
    _spFillModesR = new TFillModesReverse();

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this)
            .addPixel(100, this._slider)
            .addPixelHBox(100, (box:nn.HBox)=>{
                box.addFlex(1, this._lblCustom);
                box.addFlex(1, this._lblBtext);
            })
            .addPixelHBox(100, (box:nn.HBox)=>{
                box.addFlex(1, this._btnLongTap);
                box.addFlex(2, this._lblSwipe);
            })
            .addPixelHBox(100, (box:nn.HBox)=>{
                box.addFlex(1, this._lblTxt);
                box.addPixel(5);
                box.addFlex(1, this._inpPh);
            })
            .addPixelHBox(100, (box:nn.HBox)=>{
                box.addFlex(1, this._btnFull);
                box.addFlex(1, this._btnTrans);
            })
            .addPixel(200, this._spFillModes)
            .addPixel(200, this._spFillModesR)
            .addPixel(100, this._spDiv)
            .apply();
    }
}

class TTabPageScroll
extends TTabPage
{
    constructor() {
        super();

        this._imgUrl.imageSource = "http://image.tianjimedia.com/uploadImages/2013/057/8996E2SKE74Q.jpg";
        this._imgUrl.fillMode = nn.FillMode.CENTER;
        this.addChild(nn.ScrollView.Wrapper(this._imgUrl).callself((s:nn.ScrollView)=>{
            s.verticalIdentifier = new TSlider().callself((s:TSlider)=>{
                s.horizonMode = false;
            });
            s.horizonIdentifier = new TSlider();
            s.floatingIdentifier = false;
        }));
    }

    _imgUrl = new nn.Bitmap();

    updateLayout() {
        super.updateLayout();
        this._imgUrl.belong.frame = this.boundsForLayout();
    }
}

class TTabPageHtmlText
extends TTabPage
{
    constructor() {
        super();

        this._inpHtml.edgeInsets = nn.EdgeInsets.All(10);
        this._lblHtml.edgeInsets = nn.EdgeInsets.All(10);
        this._inpHtml.textColor = 0;
        this._inpHtml.multilines = true;
        this._inpHtml.textSide = 'top';
        this._inpHtml.backgroundColor = nn.Color.White;
        this._lblHtml.textColor = 0;
        this._lblHtml.textSide = 'top';
        this._lblHtml.multilines = true;
        this._lblHtml.backgroundColor = nn.Color.White;
        this._lblHtml.href(/http:\/\//i, (url:string)=>{
            nn.Dom.simulateLink(url);
        });
        this.addChild(this._inpHtml);        
        this.addChild(this._lblHtml);
        this._inpHtml.signals.connect(nn.SignalChanged, (s:nn.Slot)=>{
            this._lblHtml.htmlText = s.data;
        }, this);

        // 初始化
        this._inpHtml.text = "<font size=50>妈妈再也不用担心我的多样式</font>";
    }
    
    _inpHtml = new nn.TextField();
    _lblHtml = new nn.Label();

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this)
            .addFlex(1, this._inpHtml)
            .addPixel(5)
            .addFlex(1, this._lblHtml)
            .apply();
    }
}

class TTabPageDelay
extends TTabPage
{
    constructor() {
        super();
        this.tabButton.signals.disconnect(nn.SignalClicked);
        this.tabButton.signals.connect(nn.SignalClicked, this._actTabButtonClicked, this);
    }
    
    tabButton = TTab.TabButton(nn.New(TTabPageDelay));

    _actTabButtonClicked() {
        if (this.tabButton.isSelection())
            return;
        nn.Delay(2, ()=>{
            this.tabButton.setSelection(true);
        }, this);
    }
}

class TWidgets
extends nn.Sprite
{
    constructor() {
        super();
        this.edgeInsets = new nn.EdgeInsets(100, 50, 50, 50);
        this.backgroundColor = nn.Color.Transparent;
        this.addChild(this._tab);
    }

    _tab = new TTab();

    updateLayout() {
        super.updateLayout();
        this._tab.frame = this.boundsForLayout();
    }

    onAppeared() {
        super.onAppeared();
    }

    onDisappeared() {
        super.onDisappeared();
    }

}
