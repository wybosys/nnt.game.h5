module nn {
    
    export class Application
    extends EgretApp
    {
        onActivated() {
            super.onActivated();
            Application.shared = CApplication.shared;
        }
        
        /** 设置根页面 */
        set root(sp:CComponent) {
            this._gameLayer.root = sp;
        }
        get root():CComponent {
            return this._gameLayer.root;
        }
    }
    
}