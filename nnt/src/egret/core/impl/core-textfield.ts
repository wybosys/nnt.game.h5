/// <reference path="./core-label.ts" />

module nn {

    export class TextField
    extends Label
    implements CTextField
    {
        constructor() {
            super();
            this.touchEnabled = true;
            
            this._lbl.type = egret.TextFieldType.INPUT;
            EventHook(this._lbl, egret.FocusEvent.FOCUS_IN, this.__inp_focus, this);
            EventHook(this._lbl, egret.FocusEvent.FOCUS_OUT, this.__inp_blur, this);
        }
        
        dispose() {
            super.dispose();
        }

        _initSignals() {
            super._initSignals();
            this._signals.register(SignalFocusGot);
            this._signals.register(SignalFocusLost);
        }
        
        _signalConnected(sig:string, s?:Slot) {
            super._signalConnected(sig, s);
            if (sig == SignalChanged)
                EventHook(this._lbl, egret.Event.CHANGE, this.__lbl_changed, this);
        }

        // 文本框的实现比其它空间特殊，因为会输入或者直接点击，所以需要返回的是实现的实体
        protected hitTestClient(x:number, y:number):egret.DisplayObject {
            return super.hitTestClient(x, y) ? this._lbl : null;
        }
        
        set readonly(v:boolean) {
            this._lbl.touchEnabled = !v;
        }
        get readonly():boolean {
            return !this._lbl.touchEnabled;
        }

        set securityInput(v:boolean) {
            this._lbl.displayAsPassword = v;
        }
        get securityInput():boolean {
            return this._lbl.displayAsPassword;
        }
        
        private _labelPlaceholder:Label;
        get labelPlaceholder():Label {
            return this._labelPlaceholder;
        }
        set labelPlaceholder(lbl:Label) {
            if (lbl == this._labelPlaceholder)
                return;
            if (this._labelPlaceholder)
                this.removeChild(this._labelPlaceholder);
            this._labelPlaceholder = lbl;
            if (lbl)
                this.addChild(lbl);
        }

        placeholderTextColor = 0x7d7d7d;
        
        get placeholder():string {
            return this._labelPlaceholder ? this._labelPlaceholder.text : '';
        }
        set placeholder(s:string) {
            if (this._labelPlaceholder == null) {
                var lbl = new Label();
                lbl.textAlign = this.textAlign;
                lbl.fontSize = this.fontSize;
                lbl.textColor = this.placeholderTextColor;
                lbl.visible = this.text.length == 0;
                lbl.multilines = this.multilines;
                this.labelPlaceholder = lbl;
            }
            this._labelPlaceholder.text = s;
        }

        protected _setFontSize(v:number) {
            super._setFontSize(v);
            if (this._labelPlaceholder)
                this._labelPlaceholder.fontSize = v;
        }

        protected _setTextAlign(a:string) {
            super._setTextAlign(a);
            if (this._labelPlaceholder)
                this._labelPlaceholder.textAlign = a;
        }

        protected _setText(s:string):boolean {
            if (!super._setText(s))
                return false;
            if (this._labelPlaceholder)
                this._labelPlaceholder.visible = s.length == 0;
            return true;
        }

        get multilines():boolean {
            return this._lbl.multiline;
        }
        set multilines(b:boolean) {
            this._lbl.multiline = b;
            if (this._labelPlaceholder)
                this._labelPlaceholder.multilines = b;
        }
        
        private __inp_focus() {
            Keyboard.visible = true;
            if (this._labelPlaceholder)
                this._labelPlaceholder.visible = false;
            if (this._signals)
                this._signals.emit(SignalFocusGot);
        }
        
        private __inp_blur() {
            Keyboard.visible = false;
            if (this._labelPlaceholder && this.text.length == 0)
                this._labelPlaceholder.visible = true;
            if (this._signals)
                this._signals.emit(SignalFocusLost);
        }
        
        private __lbl_changed(e:any) {
            this._scaleToFit && this.doScaleToFit();
            this._signals.emit(SignalChanged, this.text);
        }

        updateLayout() {
            super.updateLayout();
            if (this._labelPlaceholder)
                this._labelPlaceholder.setFrame(this.boundsForLayout());
        }
    }    
    
}

// 解决textfield没有按键通知的问题
if (nn.ISHTML5) {        
    let FUNC_TEXTHOOK = egret.web['$cacheTextAdapter'];
    egret.web['$cacheTextAdapter'] = function(adapter, stage, container, canvas) {
        FUNC_TEXTHOOK(adapter, stage, container, canvas);
        let s = adapter._simpleElement;
        let m = adapter._multiElement;
        function FUNC_TEXTONPRESS(e) {
            let textfield = adapter._stageText.$textfield;
            if (textfield) {
                let ui = textfield.parent;
                if (ui._need_fix_textadapter && ui._signals) {
                    if (ui.keyboard == null)
                        ui.keyboard = new nn.CKeyboard();
                    ui.keyboard.key = e.key;
                    ui.keyboard.code = e.keyCode;
                    ui._signals.emit(nn.SignalKeyPress, ui.keyboard);
                }
            }
        };
        if (s && s.onkeypress != FUNC_TEXTHOOK)
            s.onkeypress = FUNC_TEXTONPRESS;
        if (m && m.onkeypress != FUNC_TEXTHOOK)
            m.onkeypress = FUNC_TEXTONPRESS;
    };            
}        

