module app {
    
    class ItemRenderer
    extends eui.ItemRendererU
    {
        protected dataChanged() {
            super.dataChanged();
        }
    }

    interface IMainScene
    {
        //slot {
        _actEnter(s?:hd.Slot);
        _actOpenLink(s?:hd.Slot);
        //slot }
    }

    export class MainScene
    extends eui.SpriteU
    implements IMainScene
    {
        constructor() {
            super();
        }

        //skin {
        btn0:eui.ButtonU;
        btn1:eui.ButtonU;
        btnXXX:eui.ButtonU;
        img0:eui.ImageU;
        lblHtml:eui.HtmlLabelU;
        list0:eui.ListU;
        list1:eui.ListU;
        tabbar0:eui.TabBarU;
        //skin }

        list0ItemRenderer = ItemRenderer;

        onLoaded() {
            super.onLoaded();

            this.lblHtml.href(/HAHA/, ()=>{
                alert("HAHA");
            });

            let sb = new nn.StringBuilder();
            sb.font(0xff0000);
            sb.href("BAIDU", "http://www.baidu.com");
            sb.pop().touch("HAHA");
            this.lblHtml.value = sb;

            this.list1.data = [0,1,2,3,4,5,6,7,8];
        }

        protected createChildren() {
            super.createChildren();
        }
        
        protected childrenCreated() {
            super.childrenCreated();
            
            var u = new nn.Sprite();
            u.frame = new nn.Rect(0, 0, 100, 50);
            u.backgroundColor = nn.Color.Random();
            u.signals.connect(nn.SignalClicked, this._on_remove, this);
            this.addChild(u);
        }

        private _onBtn0Clicked() {
            var panel = new eui.Panel();
            panel.title = "Title";
            panel.horizontalCenter = 0;
            panel.verticalCenter = 0;
            this.addChild(panel);
        }

        private _onBtn1Clicked() {
            let hud = new HudText();
            hud.open();
        }

        private _onList0ItemClicked(item:eui.ItemInfo) {
            nn.noti("点击 " + item.data.label);
        }

        private _onTabbar0SelectionChanging(info:eui.SelectionInfo) {
            if (info.selecting.index == 2) {
                nn.noti("取消选中");
                info.cancel();
            }
        }

        private _on_remove(s:hd.Slot) {
            this.removeChild(s.sender);
        }

        _actKeyPress(s?:hd.Slot) {
            let d:hd.CKeyboard = s.data;
            nn.noti("按下 " + d.key + " " + d.code);
        }

        _actEnter(s?:hd.Slot) {
            let inp:eui.TextInputU = s.sender;
            this.lblHtml.value = inp.value;
        }

        _actOpenLink(s?:hd.Slot) {
            nn.noti(s.data);
        }

        list1ItemForData(d:number):any {
            if (d%2)
                return item.TestButton;
            return item.TestButton1;
        }
            
    }
    
}