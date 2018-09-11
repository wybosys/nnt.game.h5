module nn {

    export class ExtHtmlTextParser extends egret.HtmlTextParser {
        constructor() {
            super();
            this['replaceArr'].push([/\\n/g, "\n"]);
            this['replaceArr'].push([/\\t/g, "\t"]);
        }

        parser(htmltext: string): Array<egret.ITextElement> {
            let r = null;
            try {
                r = super.parser(htmltext);
            } catch (e) {
                exception(e, 'HtmlTextParser出错');
            }
            return r;
        }
    }

    class ExtTextField extends egret.TextField {
        constructor() {
            super();
            this.width = 0;
            this.height = 0;
        }
    }

    // 用来计算富文本格式尺寸
    var __gs_label4calc = new egret.TextField();

    export class Label extends CLabel {
        constructor() {
            super();

            this.fontSize = CLabel.FontSize;
            this._lbl.touchEnabled = true;
            this._lbl.verticalAlign = egret.VerticalAlign.MIDDLE;
            this._imp.addChild(this._lbl);
        }

        _signalConnected(sig: string, s?: Slot) {
            super._signalConnected(sig, s);
            if (sig == SignalAction) {
                this.touchEnabled = true;
                EventHook(this._lbl, egret.TextEvent.LINK, this.__lbl_link, this);
            }
        }

        protected _lbl: any = new ExtTextField();

        // 文本框的实现比其它空间特殊，因为会输入或者直接点击，所以需要返回的是实现的实体
        protected hitTestClient(x: number, y: number): egret.DisplayObject {
            return super.hitTestClient(x, y) ? this._imp : null;
        }

        updateLayout() {
            super.updateLayout();

            this.impSetFrame(this.boundsForLayout(), this._lbl);

            this._scaleToFit && this.doScaleToFit();
            this.updateCache();
        }

        set bold(b: boolean) {
            this._lbl.bold = b;
            this.updateCache();
        }

        get bold(): boolean {
            return this._lbl.bold;
        }

        set italic(b: boolean) {
            this._lbl.italic = b;
            this.updateCache();
        }

        get italic(): boolean {
            return this._lbl.italic;
        }

        set stroke(width: number) {
            this._lbl.stroke = width;
            this.updateCache();
        }

        get stroke(): number {
            return this._lbl.stroke;
        }

        set strokeColor(color: ColorType) {
            this._lbl.strokeColor = GetColorComponent(color)[0];
            this.updateCache();
        }

        get strokeColor(): ColorType {
            return this._lbl.strokeColor;
        }

        private _lineSpacing = 0;
        get lineSpacing(): number {
            return this._lineSpacing * ScaleFactorDeS;
        }

        set lineSpacing(v: number) {
            this._lineSpacing = v * ScaleFactorS;
            this._lbl.lineSpacing = this._lineSpacing;
            this.updateCache();
        }

        bestFrame(inrc?: Rect): Rect {
            var w = inrc ? inrc.width : 0;
            var h = inrc ? inrc.height : 0;
            var rc: Rect;
            if (this._lbl.textFlow) {
                __gs_label4calc.multiline = this._lbl.multiline;
                __gs_label4calc.size = this._lbl.size;
                __gs_label4calc.fontFamily = this._lbl.fontFamily;
                __gs_label4calc.lineSpacing = this._lbl.lineSpacing;
                __gs_label4calc.width = w * ScaleFactorW;
                __gs_label4calc.height = h * ScaleFactorH;
                __gs_label4calc.textFlow = this._lbl.textFlow;
                rc = new Rect(0, 0,
                    __gs_label4calc.textWidth + 1, //避免integral时产生的舍入误差
                    __gs_label4calc.textHeight + 1)
                    .unapplyScaleFactor();
            } else {
                rc = Font.sizeFitString(this.text,
                    this.fontSize,
                    w, h,
                    this.lineSpacing).toRect();
            }
            if (this.edgeInsets)
                return rc.unapplyEdgeInsets(this.edgeInsets);
            return rc;
        }

        private _tfnsz: number;

        protected _setFontSize(v: number) {
            if (this._tfnsz == v)
                return;
            this._tfnsz = v * ScaleFactorS;
            this._lbl.size = this._tfnsz;
            this.updateCache();
        }

        set fontSize(v: number) {
            this._setFontSize(v);
        }

        get fontSize(): number {
            return this._lbl.size * ScaleFactorDeS;
        }

        protected _setTextAlign(a: string) {
            this._lbl.textAlign = a;
            this.updateCache();
        }

        protected _setTextSide(s: string) {
            this._lbl.verticalAlign = s;
            this.updateCache();
        }

        set textAlign(a: string) {
            this._setTextAlign(a);
        }

        get textAlign(): string {
            return this._lbl.textAlign;
        }

        set textSide(s: string) {
            this._setTextSide(s);
        }

        get textSide(): string {
            return this._lbl.verticalAlign;
        }

        protected _setText(s: string): boolean {
            if (this._lbl.text == s)
                return false;
            if (this._htmlText)
                this._htmlText = undefined;
            this._lbl.text = s;
            this._scaleToFit && this.doScaleToFit();
            this.updateCache();
            return true;
        }

        set text(s: string) {
            this._setText(s);
            if (this._signals)
                this._signals.emit(SignalChanged, s);
        }

        get text(): string {
            return this._lbl.text;
        }

        set attributedText(arr: any) {
            this._htmlText = undefined;
            this._lbl.textFlow = arr;
        }

        get attributedText(): any {
            return this._lbl.textFlow;
        }

        private _htmlText: string;
        get htmlText(): string {
            return this._htmlText;
        }

        set htmlText(html: string) {
            if (this._htmlText == html)
                return;
            // 为了解决egret的html不能<>不匹配的bug
            if (nn.StringT.Count(html, '<') != nn.StringT.Count(html, '>'))
                return;
            let data = new ExtHtmlTextParser().parser(html);
            this._setTextFlow(data);
            if (this._signals)
                this._signals.emit(SignalChanged, html);
        }

        protected _setTextFlow(tf: Array<egret.ITextElement>) {
            // 调整一下字体缩放            
            tf && tf.forEach((te: egret.ITextElement) => {
                let s = te.style;
                if (s && s.size != null) {
                    s.size *= ScaleFactorS;
                }
            });
            this._lbl.textFlow = tf;
        }

        set textColor(v: ColorType) {
            this._lbl.textColor = GetColorComponent(v)[0];
            this.updateCache();
        }

        get textColor(): ColorType {
            return this._lbl.textColor;
        }

        set fontFamily(s: string) {
            this._lbl.fontFamily = s;
            this.updateCache();
        }

        get fontFamily(): string {
            return this._lbl.fontFamily;
        }

        set numlines(v: number) {
            if (v == -1 || v > 1) {
                if (this._scaleToFit)
                    return;
                this._lbl.multiline = true;
            } else {
                this._lbl.multiline = false;
            }
            this.updateCache();
        }

        get numlines(): number {
            return this._lbl.numLines;
        }

        set multilines(b: boolean) {
            if (this._lbl.multiline == b)
                return;
            this._lbl.multiline = b;
            this.updateCache();
        }

        get multilines(): boolean {
            return this._lbl.multiline;
        }

        set textFlow(arr: Array<egret.ITextElement>) {
            this._lbl.textFlow = arr;
            this.updateCache();
        }

        get textFlow(): Array<egret.ITextElement> {
            return this._lbl.textFlow;
        }

        protected _scaleToFit: boolean;
        get scaleToFit(): boolean {
            return this._scaleToFit;
        }

        set scaleToFit(v: boolean) {
            if (v == this._scaleToFit)
                return;
            if (v && this._lbl.multiline) {
                return;
            }
            this._scaleToFit = v;
            v && this.doScaleToFit();
        }

        protected doScaleToFit() {
            var str = this.text;
            if (str.length == 0)
                return;
            var rc = this.boundsForLayout();
            var w = rc.width / str.length * ScaleFactorS;
            if (w > this._lbl.size) {
                if (this._lbl.size != this._tfnsz) {
                    this._lbl.size = this._tfnsz;
                    this.updateCache();
                }
            } else {
                this._lbl.size = w;
                this.updateCache();
            }
        }

        appendText(s: string) {
            this._lbl.appendText(s);
            this.updateCache();
        }

        private _links: Array<Closure>;

        href(re: RegExp, cb: (url: string) => void, ctx?: any) {
            if (this._links == null) {
                this._links = new Array<Closure>();
                // 打开link点击的监听
                this.touchEnabled = true;
                EventHook(this._lbl, egret.TextEvent.LINK, this.__lbl_link, this);
            }
            let c = new Closure(cb, ctx);
            c.payload = re;
            this._links.push(c);
        }

        private __lbl_link(e: egret.TextEvent) {
            let link = e.text;
            noti("点击链接 " + link);
            this.signals.emit(SignalAction, link);
            // 直接回调
            if (this._links) {
                this._links.forEach((c: Closure) => {
                    let r = c.payload;
                    if (link.match(r))
                        r.invoke(link);
                });
            }
        }
    }

}
