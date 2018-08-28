module nn {

    export abstract class CBitmap
    extends Widget
    {
        constructor(res?:TextureSource) {
            super();
        }

        dispose() {            
            super.dispose();
        }
        
        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalChanged);
        }

        /** 9点 */
        point9:[number, number, number, number];

        /** 素材 */
        imageSource:TextureSource;

        /** 填充模式 */
        fillMode = FillMode.STRETCH;

        /** 期望的大小 */
        preferredFrame:Rect;
    }

}
