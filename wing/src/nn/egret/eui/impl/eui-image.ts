module eui {

    export class ImageU
    extends eui.Image
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

        set clipBounds(rc:nn.Rect) {
            _EUIExt.setClipbounds(this, rc);
        }
        
        get clipBounds():nn.Rect {
            return _EUIExt.getClipbounds(this);
        }

        constructor() {
            super();
            //this.touchEnabled = false; 注释掉的原因，标准的egret实现必须要求内部元素可点击，否则hitTest会丢失
        }

        dispose() {
            this._imageSource.dispose();
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

        /** 业务有时候会使用image来代替button，所以提供selected设置 */
        selected:boolean;

        protected _initSignals() {
            this._signals.delegate = this;
            this._signals.register(nn.SignalClicked);
            this._signals.register(nn.SignalChanged);
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
            if (sig == nn.SignalClicked) {
                this.touchEnabled = true;
                nn.EventHook(this, egret.TouchEvent.TOUCH_TAP, this.__cmp_tap, this);
            }
        }
        
        private __cmp_tap(e:egret.TouchEvent) {
            this.signals.emit(nn.SignalClicked);
            e.stopPropagation();
        }
        
        public get source():string {
            return this['_source'];
        }
        public set source(src:string) {
            this['_source'] = src;
            this.imageSource = src;
        }

        private _imageSource = new nn.SourceVariable<nn.ICacheTexture, nn.TextureSource>();
        get imageSource():nn.TextureSource {
            let tex = this._getTexture();
            if (tex == null)
                return this._imageSource.source;
            nn.COriginType.shared.imp = tex;
            return nn.COriginType.shared;
        }
        set imageSource(ds:nn.TextureSource) {
            if (ds == this._imageSource.source)
                return;
            this._imageSource.source = ds;
            nn.ResManager.getTexture(ds, RES.LoadPriority.NORMAL, (tex:nn.ICacheTexture)=>{
                if (ds != this._imageSource.source)
                    return;
                this._setTexture(tex.use());
                this._imageSource.set(tex, false);
            }, this);
        }
        
        protected _setTexture(tex:egret.Texture) {            
            // this.scale9Grid = tex ? tex['scale9Grid'] : null; eui使用wing直接设置9grid，所以下tex的9g必然是null，这一句会把wing设置好的9g冲掉
            this.texture = tex;
            
            if (this._signals)
                this._signals.emit(nn.SignalChanged, tex);
        }

        protected _getTexture():egret.Texture {
            if (<any>this.texture instanceof egret.Texture)
                return <any>this.texture;
            return null;
        }

        // 和label的value类似，区别在最终设置的是source属性
        private _value:any;
        get value():any {
            return this._value;
        }
        set value(v:any) {
            this._value = v;
            if (v == null) {
                this.source = null;
                return;
            }
            if (this._format) {
                let args = nn.ArrayT.Concat([this._format], nn.ArrayT.ToArray(v));
                this.source = nn.formatString.apply(null, args);
            } else {
                this.source = nn.asString(v);
            }
        }
        
        private _format:string = null;
        public get format():string {
            return this._format;
        }
        public set format(fmt:string) {
            this._format = fmt;
        }

        bestFrame(inrc?:nn.Rect):nn.Rect {
            let tex = this._getTexture();
            if (tex == null)
                return new nn.Rect();
            return new nn.Rect(0, 0, tex.textureWidth, tex.textureHeight);
        }

        get frame():nn.Rect {
            return nn.getFrame(this);
        }        
        set frame(rc:nn.Rect) {
            nn.setFrame(this, rc);
        }

        onAppeared() {
        }

        onDisappeared() {
        }

        updateCache() {
        }
    }
    
}
