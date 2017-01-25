module nn {

    /** 按键数据 */
    export class CKeyboard {
        key:string;
        code:number;
    }

    export class _Keyboard
    extends SObject
    {
        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalActivated);
            this._signals.register(SignalDeactivated);
        }
        
        _visible:boolean = false;
        get visible():boolean {
            return this._visible;
        }
        set visible(b:boolean) {
            if (this._visible == b)
                return;
            this._visible = b;
            this.signals.emit(b ? SignalActivated : SignalDeactivated);
        }
    }
    
    export let Keyboard = new _Keyboard();
    
}
