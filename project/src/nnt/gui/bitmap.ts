module nn {

    // 和使用textmerge划分的数据保持一致
    export type Point9 = [number, number, number, number];

    export abstract class CBitmap extends Widget {
        constructor(res?: TextureSource) {
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
        point9: Point9;

        /** 素材 */
        imageSource: TextureSource;

        /** 填充模式 */
        fillMode = FillMode.STRETCH;

        /** 期望的大小 */
        preferredFrame: Rect;
    }

}
