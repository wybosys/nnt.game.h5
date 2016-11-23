class TServices
extends nn.Sprite
{
    constructor() {
        super();
        this.edgeInsets = new nn.EdgeInsets(50, 50, 50, 50);

        this._btnOpen.text = "OPEN";
        this._btnOpen.signals.connect(nn.SignalClicked, ()=>{
            nn.Dom.openLink(this.url);
        }, this);
        this.addChild(this._btnOpen);

        this._btnSimulate.text = "SIMULATE";
        this._btnSimulate.signals.connect(nn.SignalClicked, ()=>{
            nn.Dom.simulateLink(this.url);
        }, this);
        this.addChild(this._btnSimulate);

        // 第三方平台测试
        this._btnLogin.text = "LOGIN";
        this._btnLogin.signals.connect(nn.SignalClicked, ()=>{
            if (nn.ServicesManager.shared.service.support(nn.svc.Feature.LOGIN)) {
                var cnt = new nn.svc.LoginContent();
                nn.ServicesManager.fetch(cnt, ()=>{
                    nn.dump(cnt, 1);
                }, this);
            } else {
                nn.Hud.Text("不支持账号系统");
            }
        }, this);
        this.addChild(this._btnLogin);
        
        this._btnAuth.text = "AUTH";
        this._btnAuth.signals.connect(nn.SignalClicked, ()=>{
            if (nn.ServicesManager.shared.service.support(nn.svc.Feature.AUTH)) {
                var cnt = new nn.svc.AuthContent();
                nn.ServicesManager.fetch(cnt, ()=>{
                    nn.dump(cnt, 1);
                }, this);
            } else {
                nn.Hud.Text("不支持授权");
            }
        }, this);
        this.addChild(this._btnAuth);

        this._btnPost.text = "POST";
        this._btnPost.signals.connect(nn.SignalClicked, ()=>{
            if (nn.ServicesManager.shared.service.support(nn.svc.Feature.SHARE)) {
                var cnt = new nn.svc.ShareContent();
                cnt.url = nn.Application.shared.url.toString();
                cnt.title = "测试分享";
                cnt.image = nn.Application.shared.icon;
                nn.ServicesManager.fetch(cnt, ()=>{
                    nn.dump(cnt, 1);
                }, this);
            } else {
                nn.Hud.Text("不支持分享");
            }
        }, this);
        this.addChild(this._btnPost);

        this._btnProfile.text = "PROFILE";
        this._btnProfile.signals.connect(nn.SignalClicked, ()=>{
            if (nn.ServicesManager.shared.service.support(nn.svc.Feature.PROFILE)) {
                var cnt = new nn.svc.ProfileContent();
                nn.ServicesManager.fetch(cnt, ()=>{
                    nn.dump(cnt, 1);
                }, this);
            } else {
                nn.Hud.Text("不支持账号系统");
            }
        }, this);
        this.addChild(this._btnProfile);

        this._btnPay.text = "PAY";
        this._btnPay.signals.connect(nn.SignalClicked, ()=>{
            if (nn.ServicesManager.shared.service.support(nn.svc.Feature.PAY)) {
                var cnt = new nn.svc.PayContent();
                nn.ServicesManager.fetch(cnt, ()=>{
                    nn.dump(cnt, 1);
                }, this);
            } else {
                nn.Hud.Text("不支持支付");
            }
        }, this);
        this.addChild(this._btnPay);        
    }

    url = "http://www.baidu.com";
    _btnOpen = new TButton();
    _btnSimulate = new TButton();

    // 测试第三方服务
    _btnAuth = new TButton();
    _btnPost = new TButton();
    _btnLogin = new TButton();
    _btnProfile = new TButton();
    _btnPay = new TButton();

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this)
            .addPixelHBox(100, (box:nn.HBox)=>{
                box.addFlex(1, this._btnOpen)
                    .addFlex(1, this._btnSimulate);
            })
            .addPixel(100, this._btnLogin)
            .addPixel(100, this._btnAuth)
            .addPixel(100, this._btnPost)
            .addPixel(100, this._btnProfile)
            .addPixel(100, this._btnPay)
            .apply();
    }
}
