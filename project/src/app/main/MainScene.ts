module app.main {
    interface IMainScene
        extends nn.ILauncher {
        //slot {
        //slot }
    }

    export class MainScene
        extends eui.SpriteU
        implements IMainScene {
        //skin {
        viewStack: eui.NavigationU;
        //skin }

        onLoaded() {
            nn.Launchers.register(this);

            // 推送根测试页面
            this.viewStack.push(new Sample());

            // 启动新手
            manager.guide.start();
        }

        launchEntry(cls: any, data: nn.EntrySettings) {
            // 如果已经打开，则不处理
            if (this.viewStack.topView() instanceof cls)
                return;

            // 打开新页面
            let p = new cls();
            p.entrySettings = data;

            if (p instanceof eui.DialogU) {
                let dlg = <eui.DialogU>p;
                dlg.open(false);
            } else {
                this.viewStack.pop();
                this.viewStack.push(p);
            }
        }
    }
}
