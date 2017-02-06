module nn {
    export var ApiSession = nn.RestSession;
}

class HudText
extends nn.HudText
{
    constructor() {
        super();
        this.backgroundColor = nn.Color.White;
    }
}

class HudProgress
extends nn.HudProgress
{
    open() {
        super.open();
        nn.noti('HudProgress 正在等待 ........');
    }

    close() {
        super.close();
        nn.noti('HudProgress 等待结束');
    }
}

class Main
extends nn.CoreApplication
{
    constructor() {
        super();
        this.backgroundColor = nn.Color.Black;
        this.resourceGroups = ["scene", "api"];
        this.clazzHudText.type = HudText;
        this.clazzHudProgress.type = HudProgress;

        new nn.XHBServices().setAsDefault();
    }

    onLoaded() {
        super.onLoaded();
        this.root = new MainScene();

        //this.gameLayer.transitionObject = new nn.NavigationTransition();

        // 增加通过手势返回
        var ges = new nn.GestureSwipe();
        ges.signals.connect(nn.SignalDone, (s:nn.Slot)=>{
            if (nn.Mask.isset(nn.Direction.RIGHT, s.data))
                this.viewStack.pop();
        }, this);
        this.viewStack.addGesture(ges);

        var btnBack = new nn.Button();
        btnBack.text = "BACK";
        btnBack.setFrame(new nn.Rect(0, 0, 200, 100));
        btnBack.signals.connect(nn.SignalClicked, this.viewStack.popToRoot, this.viewStack);
        this.addChild(btnBack);

        // 连接服务器
        nn.SocketSession.connector = new nn.WebSocketConnector();
        nn.SocketSession.host = 'ws://localhost:8080/ws';
        //nn.SocketSession.host = 'ws://192.168.3.136:7002/ws';
        nn.SocketSession.open();
    }

    static BestFrame():nn.Rect {
        return new nn.Rect(0, 0, 720, 1280);
    }
    
    static ScreenScale():number {
        return 1;
    }

    static ScreenFillMode():nn.FillMode {
        return nn.FillMode.STRETCH;
    }

    static Features():nn.FrameworkFeature {
        return nn.FrameworkFeature.NOSYNC;
    }
    
}
