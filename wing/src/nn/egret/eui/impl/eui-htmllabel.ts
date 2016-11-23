module eui {

    export class HtmlLabelU
    extends eui.Label
    {
        protected onPartBinded = _EUIExtPROTO.onPartBinded;
        public slots:string = null;
        public tag:any = null;
        goBack = _EUIBaseExtPROTO.goBack;
        playAnimate = _EUIBaseExtPROTO.playAnimate;
        findAnimate = _EUIBaseExtPROTO.findAnimate;
        stopAnimate = _EUIBaseExtPROTO.stopAnimate;
        stopAllAnimates = _EUIBaseExtPROTO.stopAllAnimates;

        set exhibition(b:boolean) {
            _EUIBaseExtPROTO.setExhibition.call(this, b);
        }
        get exhibition():boolean {
            return _EUIBaseExtPROTO.getExhibition.call(this);
        }

        dispose() {
            this.stopAllAnimates();
            if (this._signals) {
                this._signals.dispose();
                this._signals = undefined;
            }
        }

        drop() {
            this.dispose();
        }

        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.drop();
        }

        protected _initSignals() {
            this._signals.delegate = this;
            this._signals.register(nn.SignalAction);
        }

        protected _signals:hd.Signals;
        get signals():hd.Signals {
            if (this._signals)
                return this._signals;
            this._instanceSignals();
            return this._signals;
        }

        protected _instanceSignals() {
            this._signals = new nn.Signals(this);            
            this._initSignals();
        }
        
        _signalConnected(sig:string, s?:hd.Slot) {
            if (sig == nn.SignalAction) {
                this.touchEnabled = true;
                nn.EventHook(this, egret.TextEvent.LINK, this.__lbl_link, this);
            }
        }        

        private _htmlText:string = null;
        public get text():string {            
            return this._htmlText;
        }
        public set text(html:string) {
            if (this._htmlText == html)
                return;
            this._htmlText = html;
            if (html == null) {
                this.textFlow = null;
                return;
            }
            let data = new nn.ExtHtmlTextParser().parser(html);
            this.textFlow = data;            
        }

        private _value:any;
        get value():any {
            return this._value;
        }
        set value(v:any) {
            this._value = v;
            if (v == null) {
                this.text = '';
                return;
            }
            if (this._format) {
                let args = nn.ArrayT.Concat([this._format], nn.ArrayT.ToArray(v));
                this.text = nn.formatString.apply(null, args);
            } else {
                this.text = nn.asString(v);
            }
        }

        private _format:string = null;
        public get format():string {
            return this._format;
        }
        public set format(fmt:string) {
            this._format = fmt;
        }
        
        private _links:Array<hd.Closure>;
        href(re:RegExp, cb:(url:string)=>void, ctx?:any) {
            if (this._links == null) {
                this._links = new Array<hd.Closure>();
                this.touchEnabled = true;
                nn.EventHook(this, egret.TextEvent.LINK, this.__lbl_link, this);
            }
            let c = new nn.Closure(cb, ctx);
            c.payload = re;
            this._links.push(c);
        }

        private __lbl_link(e:egret.TextEvent) {
            let link = e.text;
            nn.noti("点击链接 " + link);            
            this.signals.emit(nn.SignalAction, link);
            if (this._links) {
                this._links.forEach((c:hd.Closure)=>{
                    let r = c.payload;
                    if (link.match(r))
                        c.invoke(link);
                });
            }
        }
    }
    
}