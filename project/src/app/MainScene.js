var app;
(function (app) {
    class ItemRenderer extends eui.ItemRendererU {
        dataChanged() {
            super.dataChanged();
        }
    }
    class MainScene extends eui.SpriteU {
        constructor() {
            super();
            //skin }
            this.list0ItemRenderer = ItemRenderer;
            this._mmo = new nn.SocketSession();
        }
        onLoaded() {
            super.onLoaded();
            this.lblHtml.href(/HAHA/, () => {
                alert("HAHA");
            });
            let sb = new nn.StringBuilder();
            sb.font(0xff0000);
            sb.href("BAIDU", "http://www.baidu.com");
            sb.pop().touch("HAHA");
            this.lblHtml.value = sb;
            this.list1.data = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            let ges = new nn.GestureSwipe();
            ges.signals.connect(nn.SignalDone, () => {
                if (ges.direction == nn.Direction.LEFT)
                    nn.Hud.Text("手势激活");
            }, this);
            this.addGesture(ges);
            this._testMmo();
        }
        createChildren() {
            super.createChildren();
        }
        childrenCreated() {
            super.childrenCreated();
            var u = new nn.Sprite();
            u.frame = new nn.Rect(0, 0, 100, 50);
            u.backgroundColor = nn.Color.Random();
            u.signals.connect(nn.SignalClicked, this._on_remove, this);
            this.addChild(u);
        }
        _onBtn0Clicked() {
            alert(" ");
        }
        _onBtn1Clicked() {
            let hud = new HudText();
            hud.open();
        }
        _onList0ItemClicked(item) {
            nn.noti("点击 " + item.data.label);
        }
        _onTabbar0SelectionChanging(info) {
            if (info.selecting.index == 2) {
                nn.noti("取消选中");
                info.cancel();
            }
        }
        _on_remove(s) {
            this.removeChild(s.sender);
        }
        _actKeyPress(s) {
            let d = s.data;
            nn.noti("按下 " + d.key + " " + d.code);
        }
        _actEnter(s) {
            let inp = s.sender;
            this.lblHtml.value = inp.value;
        }
        _actOpenLink(s) {
            nn.noti(s.data);
        }
        list1ItemForData(d) {
            if (d % 2)
                return item.TestButton;
            return item.TestButton1;
        }
        _actTouchMoved(s) {
            nn.info(s.data.currentPosition);
        }
        _actEcho() {
            let m = api.SampleEcho();
            m.input = this.lblInp.text;
            nn.RestSession.fetch(m, () => {
                alert(m.output);
            });
        }
        _testMmo() {
            let m = api.SampleLogin();
            m.uid = "chell";
            nn.RestSession.fetch(m, () => {
                this._mmo.connector = new nn.logic.SocketConnector();
                this._mmo.host = "ws://localhost:8090/json";
                this._mmo.SID = m.sid;
                this._mmo.open();
                // 建立短信轰炸的监听
                this._mmo.watch(api.SampleMessage(), s => {
                    let data = s.data;
                    console.log(data.content);
                });
            });
        }
        _actTestParticle(s) {
            alert();
        }
    }
    app.MainScene = MainScene;
})(app || (app = {}));
//# sourceMappingURL=MainScene.js.map