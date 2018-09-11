module nn {

    export class TextAlign {
        static CENTER = 'center';
        static LEFT = 'left';
        static RIGHT = 'right';
    };

    export abstract class CLabel extends Widget {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalChanged);
            this._signals.register(SignalAction);
        }

        // 默认的字体大小
        static FontSize = 30;

        /** 粗体 */
        bold: boolean;

        /** 斜体 */
        italic: boolean;

        /** 描边宽度 */
        stroke: number;

        /** 描边颜色 */
        strokeColor: ColorType;

        /** 行距 */
        lineSpacing: number;

        /** 字体大小 */
        fontSize: number;

        /** 蚊子颜色 */
        textColor: ColorType;

        /** 文字对齐 */
        textAlign: string;

        /** 文字停靠的边缘 */
        textSide: string;

        /** 字体 */
        fontFamily: string;

        /** 行数 */
        numlines: number;

        /** 多行 */
        multilines: boolean;

        /** 文字 */
        text: string;

        /** override 富文本文字 */
        attributedText: any;

        /** override html文字 */
        htmlText: string;

        /** 缩放字体以适应控件 */
        scaleToFit: boolean;

        /** 增加文字 */
        abstract appendText(s: string);

        /** 如果输入了混合文本，并加入了link，则可以通过直接绑定rex和clouse来处理链接的点击 */
        abstract href(re: RegExp, cb: (url: string) => void, ctx?: any);
    }

    export abstract class CBitmapLabel extends Widget {
        /** 字体的名称 */
        fontSource: FontSource;

        /** 字体的大小 */
        fontSize: number;

        /** 间距 */
        characterSpacing: number;

        /** 行距 */
        lineSpacing: number;

        /** 文本内容 */
        text: string;

        /** 对齐方式 */
        textAlign: string;

        /** 文字停靠的边缘 */
        textSide: string;
    }

}
