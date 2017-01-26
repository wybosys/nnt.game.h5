module nn {

    export class EuiApplication
    extends EgretApp
    {
        constructor() {
            super();
            EUI_MODE = true;
        }

        protected _preloadConfig(oper:OperationGroup) {
            super._preloadConfig(oper);
            
            let stage = this._imp.stage;
            stage.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
            stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

            oper.add(new OperationClosure((oper:Operation)=>{
                let fn = ResManager.directory + this.themeFile + '?v=' + this.version;
                let theme = new eeui.Theme(fn, stage);
                theme.addEventListener(egret.Event.COMPLETE, ()=>{
                    oper.done();
                }, this);
            }, this));
        }
        
        protected onLoaded() {
            super.onLoaded();
        }
        
        onActivated() {
            super.onActivated();
            Application.shared = CApplication.shared;
        }

        /** 设置根页面 */
        set root(sp:eui.ComponentU) {
            sp.width = StageBounds.width;
            sp.height = StageBounds.height;
            this._gameLayer.root = new BridgedComponent(sp);
        }
        get root():eui.ComponentU {
            let r:CComponent = this._gameLayer.root;
            return r.handle();
        }
    }
    
}
