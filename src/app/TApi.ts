module app.model {

    export class Base
    extends nn.Model
    {
        constructor() {
            super();
            this.host = "http://gameapi.wyb.u1.hgame.com/web/index.php?r=";
        }

        iscross():boolean {
            if (nn.ISDEBUG) {
                // 使用服务器设置来解决跨域的问题
                return false;
            }

            return super.iscross();
        }

        useproxy():boolean {
            return true;
        }

        fields():Map<string, string> {
            if (this.useproxy() && this.method == nn.HttpMethod.POST) {
                var r = new Map<string, string>();
                var p = {};
                p['url'] = this.host + this.action;
                p['method'] = this.method == nn.HttpMethod.POST ? 'post' : 'get';
                p['uid'] = nn.Application.shared.uniqueId;
                p['fields'] = nn.URL.MapToField(super.fields());
                r['data'] = JSON.stringify(p);
                return r;
            }

            return super.fields();
        }

        url():string {
            if (this.useproxy())
            {
                if (this.method == nn.HttpMethod.POST)
                    return 'http://gameapi.wyb.u1.hgame.com/web/index.php?r=redirect/redirect';
                
                var ret = 'http://gameapi.wyb.u1.hgame.com/web/index.php?r=redirect/redirect';
                var p = {};
                p['url'] = this.host + this.action;
                p['method'] = this.method == nn.HttpMethod.POST ? 'post' : 'get';
                p['fields'] = '&' + nn.URL.MapToField(this.fields());
                p['uid'] = nn.Application.shared.uniqueId;
                
                ret += '&pack=base64&data=';
                ret += nn.URL.pack(JSON.stringify(p));
                return ret;
            }

            var ret = this.host + this.action;
            if (this.method != nn.HttpMethod.POST) {
                if (nn.MapT.IsEmpty(this.fields()) == false)
                    ret += '&' + nn.URL.MapToField(this.fields());
            }
            return ret;
        }

        urlForLog():string {
            if (nn.ISDEBUG)
                return this.host + this.action;
            return super.urlForLog();
        }

        fieldsForLog():Map<string, string> {
            if (nn.ISDEBUG)
                return this.params;
            return super.fieldsForLog();
        }        
    }

    export class ApiGet
    extends Base
    {
        constructor() {
            super();
            this.method = nn.HttpMethod.GET;
            this.action = 'site/echo';
        }

        _msg:string;
        set msg(str:string) {
            this._msg = str;
            this.params['message'] = str;
        }
        get msg():string {
            return this._msg;
        }
    }

    export class ApiPost
    extends ApiGet
    {
        constructor() {
            super();
            this.method = nn.HttpMethod.POST;
        }
    }

    export class ApiTimeout
    extends Base
    {
        constructor() {
            super();
            this.action = 'site/delay';
        }

        _delay:number;
        set delay(v:number) {
            this._delay = v;
            this.params['delay'] = v;
        }
        get delay():number {
            return this._delay;
        }
    }
}

class TApi
extends nn.Sprite
{
    constructor() {
        super();
        this.edgeInsets = new nn.EdgeInsets(100, 100, 100, 100);

        this._inpMsg.text = nn.Storage.shared.value('::test::msg', 'HELLO');
        this._inpMsg.signals.connect(nn.SignalChanged, (s:hd.Slot)=>{
            nn.Storage.shared.set('::test::msg', s.data);
        }, this);
        this._btnGet.text = 'GET';
        this._btnPost.text = 'POST';
        this._btnTimeout.text = 'TIMEOUT';
        this._btnSocket.text = 'SOCKET';
        this._btnGet.signals.connect(nn.SignalClicked, this._actGet, this);
        this._btnPost.signals.connect(nn.SignalClicked, this._actPost, this);
        this._btnTimeout.signals.connect(nn.SignalClicked, this._actTimeout, this);
        this._btnSocket.signals.connect(nn.SignalClicked, this._actSocket, this);

        this.addChild(this._inpMsg);
        this.addChild(this._btnGet);
        this.addChild(this._btnPost);
        this.addChild(this._btnTimeout);
        this.addChild(this._btnSocket);

        /*
        // 等待消息
        var m = new app.api.TestNtf();
        nn.SocketSession.watch(m, ()=>{
            nn.noti('收到服务端的调用 ' + m.text);
        }, this);
        */
    }

    _inpMsg = new nn.TextField();

    // 普通的API
    _btnGet = new TButton();
    _btnPost = new TButton();
    _btnTimeout = new TButton();

    // 使用socket的API
    _btnSocket = new TButton();

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this)
            .addFlex(1, this._inpMsg)
            .addFlexHBox(1, (box:hd.HBox)=>{
                box
                    .addFlex(1, this._btnGet)
                    .addFlex(1, this._btnPost)
                    .addFlex(1, this._btnTimeout);
            })
            .addFlexHBox(1, (box:hd.HBox)=>{
                box
                    .addFlex(1, this._btnSocket);
            })
            .apply();
    }

    _actGet() {
        var m = new app.model.ApiGet();
        m.showWaiting = true;
        m.msg = this._inpMsg.text;
        nn.RestSession.fetch(m, this._cbApi, this);
    }

    _actPost() {
        var m = new app.model.ApiPost();
        m.showWaiting = true;
        m.msg = this._inpMsg.text;
        nn.RestSession.fetch(m, this._cbApi, this);
    }

    _actTimeout() {
        var m = new app.model.ApiTimeout();
        m.showWaiting = true;
        m.delay = 20;
        nn.RestSession.fetch(m);
    }

    _actSocket() {
        /*
        var m = new app.api.MessageReq();
        m.showWaiting = true;
        m.text = this._inpMsg.text;
        nn.SocketSession.fetch(m, ()=>{
            nn.Hud.Text(m.data.text);
        }, this);        
        */
    }

    _cbApi(s:hd.Slot) {
        nn.Hud.Text(s.sender.message);
    }
}
