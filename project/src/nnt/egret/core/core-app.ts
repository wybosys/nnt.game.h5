module nn {

    export class CoreApplication extends EgretApp {
        constructor() {
            super();

            egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        }

        /** 设置根页面 */
        set root(sp: CComponent) {
            this._gameLayer.root = sp;
        }

        get root(): CComponent {
            return this._gameLayer.root;
        }

        static shared: CoreApplication;
    }

}
