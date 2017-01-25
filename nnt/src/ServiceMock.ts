module nn {

    export class ServiceMock
    extends svc.Service
    {
        constructor() {
            super();
        }

        static Prepare(cb:()=>void, ctx:any) {
            cb.call(ctx);
        }

        support(feature:svc.Feature):boolean {
            return true;
        }

        pay(c:svc.PayContent) {
            let err = new Failed(-1, "模拟的服务不支持购买\n请通过平台入口运行游戏");
            Hud.Text(err.message);
            c.signals.emit(SignalFailed, err);
            c.dispose();
        }

        payable(price:number):boolean {
            return true;
        }

        share(c:svc.ShareContent) {
            c.signals.emit(SignalSucceed);
            c.dispose();
        }

        profile(c:svc.ProfileContent) {
            c.avatar = "";
            c.islogin = true;
            c.nickname = "::mock::";
            c.signals.emit(SignalSucceed);
            c.dispose();
        }

        status(c:svc.StatusContent) {
            c.appmode = false;
            c.phone = false;
            c.subscribe = false;
            c.monetaryName = "元";
            c.monetaryRate = 1;
            c.monetaryDiscount = null;
            c.signals.emit(SignalSucceed);
            c.dispose();
        }

        auth(c:svc.AuthContent) {
            let fs = Application.shared.url.fields;
            let oid = fs['openid'];
            if (oid == null)
                oid = Application.shared.uniqueId;
            c.pid = oid;

            c.app = "";
            c.platform = svc.Platform.MOCK;
            c.channel = 0;
            c.signals.emit(SignalSucceed);
            c.dispose();
        }
        
        login(c:svc.LoginContent) {
            c.signals.emit(SignalSucceed);
            c.dispose();
        }
        
        switchuser(c:svc.SwitchUserContent) {
            let err = new Failed(-1, "模拟的服务不支持切换用户\n请通过平台入口运行游戏");
            Hud.Text(err.message);
            c.signals.emit(SignalFailed, err);
            c.dispose();
        }

        logout(c:svc.LogoutContent) {
            location.reload();
        }

        loading(c:svc.LoadingContent) {
            c.signals.emit(SignalSucceed);
            c.dispose();
        }

        bind(c:svc.BindContent) {
            let err = new Failed(-1, "模拟的服务不支持绑定\n请通过平台入口运行游戏");
            Hud.Text(err.message);
            c.signals.emit(SignalFailed, err);
            c.dispose();
        }

        subscribe(c:svc.SubscribeContent) {
            let err = new Failed(-1, "模拟的服务不支持关注\n请通过平台入口运行游戏");
            Hud.Text(err.message);
            c.signals.emit(SignalFailed, err);
            c.dispose();
        }

        bbs(c:svc.BBSContent) {
            let err = new Failed(-1, "模拟的服务不支持论坛\n请通过平台入口运行游戏");
            Hud.Text(err.message);
            c.signals.emit(SignalFailed, err);
            c.dispose();
        }

        report(c:svc.ReportContent) {
            c.signals.emit(SignalSucceed);
            c.dispose();
        }

        getapp(c:svc.GetAppContent) {
            let err = new Failed(-1, "模拟的服务不支持微端\n请通过平台入口运行游戏");
            Hud.Text(err.message);
            c.signals.emit(SignalFailed, err);
            c.dispose();
        }

        sendtodesktop(c:svc.SendToDesktopContent) {
            let err = new Failed(-1, "模拟的服务不支持桌面\n请通过平台入口运行游戏");
            Hud.Text(err.message);
            c.signals.emit(SignalFailed, err);
            c.dispose();
        }

        lanzuan(c:svc.LanZuanContent) {
            let err = new Failed(-1, "模拟的服务不支持蓝钻开通");
            Hud.Text(err.message);
            c.signals.emit(SignalFailed, err);
            c.dispose();
        }

        lanzuanxufei(c:svc.LanZuanXuFeiContent) {
            let err = new Failed(-1, "模拟的服务不支持蓝钻续费开通");
            Hud.Text(err.message);
            c.signals.emit(SignalFailed, err);
            c.dispose();
        }

        private _oldmessages = new Array<svc.Message>();
        customer(c:svc.CustomerContent) {
            if (c instanceof svc.SendCustomerContent)
            {
                let cnt = <svc.SendCustomerContent>c;
                c.signals.emit(SignalSucceed);
                c.dispose();
                
                let msg = new svc.Message();
                msg.id = this._oldmessages.length;
                msg.message = cnt.message;
                msg.senderName = '我';
                this._oldmessages.push(msg);
                this.signals.emit(svc.SignalMessagesGot, this._oldmessages);
            }
            else
            {
                if (c.all)
                    this.signals.emit(svc.SignalMessagesGot, this._oldmessages);
                c.signals.emit(SignalSucceed);
                c.dispose();
            }
        }

        static IsCurrent():boolean {
            return false;
        }
    }

    // 不注册模拟服务
    //ServicesManager.register(ServiceMock);

    export class MockServices
    extends ServicesManager
    {
        detectService():any {
            return ServiceMock;
        }
    }
    
}
