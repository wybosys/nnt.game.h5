module nn {
    
    export class CoreApplication
    extends EgretApp
    {
        constructor() {
            super();
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
