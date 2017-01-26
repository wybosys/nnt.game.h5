module eui {

    export class HtmlLabelU
    extends eui.Label
    {
        public slots:string = null;
        public tag:any = null;

        onPartBinded(name:string, target:any) {
            _EUIExt.onPartBinded(this, name, target);
        }

        goBack() {
            _EUIExt.goBack(this);
        }

        playAnimate(ani:Animate, idr?:any):Animate {
            return _EUIExt.playAnimate(this, ani, idr);
        }

        findAnimate(idr:any):Animate {
            return _EUIExt.findAnimate(this, idr);
        }

        stopAnimate(idr:any) {
            _EUIExt.stopAnimate(this, idr);
        }

        stopAllAnimates() {
            _EUIExt.stopAllAnimates(this);
        }

        set exhibition(b:boolean) {
            _EUIExt.setExhibition(this, b);
        }
        
        get exhibition():boolean {
            return _EUIExt.getExhibition(this);
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

        protected _signals:nn.Signals;
        get signals():nn.Signals {
            if (this._signals)
                return this._signals;
            this._instanceSignals();
            return this._signals;
        }

        protected _instanceSignals() {
            this._signals = new nn.Signals(this);            
            this._initSignals();
        }
        
        _signalConnected(sig:string, s?:nn.Slot) {
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
        
        private _links:Array<nn.Closure>;
        href(re:RegExp, cb:(url:string)=>void, ctx?:any) {
            if (this._links == null) {
                this._links = new Array<nn.Closure>();
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
                this._links.forEach((c:nn.Closure)=>{
                    let r = c.payload;
                    if (link.match(r))
                        c.invoke(link);
                });
            }
        }
    }
    
}
