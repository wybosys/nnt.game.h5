module nn {

    export class EuiApplication extends EgretApp {
        constructor() {
            super();
            EUI_MODE = true;

            egret.lifecycle.addLifecycleListener(() => {
                // pass
            });

            egret.lifecycle.onPause = () => {
                egret.ticker.pause();
            };

            egret.lifecycle.onResume = () => {
                egret.ticker.resume();
            };

            egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
            egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        }

        protected _asyncPreloadConfig(group: OperationGroup) {
            super._asyncPreloadConfig(group);

            // 加载皮肤文件
            let stage = this._imp.stage;
            group.add(new OperationClosure((oper: Operation) => {
                let fn = ResManager.directory + this.themeFile + '?v=' + this.version;
                let theme = new eeui.Theme(fn, stage);
                theme.addEventListener(egret.Event.COMPLETE, () => {
                    oper.done();
                }, this);
            }, this));
        }

        /** 设置根页面 */
        set root(sp: eui.ComponentU) {
            sp.width = StageBounds.width;
            sp.height = StageBounds.height;
            this._gameLayer.root = new BridgedComponent(sp);
        }

        get root(): eui.ComponentU {
            let r: CComponent = this._gameLayer.root;
            return r.handle();
        }
    }

}
