module nn {

    export class Slider
    extends Widget
    implements IProgress
    {
        constructor() {
            super();
            this.clipsToBounds = true;
            
            this.signals.connect(SignalTouchBegin, this.__sld_touchchanged, this);
            this.signals.connect(SignalTouchEnd, this.__sld_touchchanged, this);
            this.signals.connect(SignalTouchMove, this.__sld_touchchanged, this);
        }
        
        dispose() {
            this._progressValue = undefined;
            super.dispose();
        }

        _initSignals() {
            super._initSignals();
            this._signals.register(SignalChanged);
        }

        _identifierView:CComponent;
        set identifierView(s:CComponent) {
            if (this._identifierView == s)
                return;
            if (this._identifierView)
                this.removeChild(this._identifierView);
            this._identifierView = s;
            if (s)
                this.addChild(s)
        }
        get identifierView():CComponent {
            return this._identifierView;
        }

        /** 水平模式 */
        horizonMode:boolean = true;
        
        _progressValue:Percentage = new Percentage(1, 0);
        get progressValue():Percentage {
            return this._progressValue;
        }
        set progressValue(val:Percentage) {
            this._progressValue = val;
            this.updateLayout();
        }

        updateLayout() {
            super.updateLayout();
            if (this._identifierView == null)
                return;

            let rc = this.boundsForLayout();
            let trc = this._identifierView.frame;
            if (this.horizonMode) {
                trc.x = this._progressValue.safepercent * (rc.width - trc.width);
                trc.y = rc.y + (rc.height - trc.height) * 0.5;
            } else {
                trc.y = this._progressValue.safepercent * (rc.height - trc.height);
                trc.x = rc.x + (rc.width - trc.width) * 0.5;
            }
            this._identifierView.frame = trc;
        }

        private __sld_touchchanged(s:Slot) {
            let t:CTouch = s.data;
            if (this._identifierView) {
                let rc = this.boundsForLayout();
                let idrc = this._identifierView.frame;
                idrc.x += t.delta.x;
                
                let pt = idrc.center;
                if (pt.x > rc.width) {
                    pt = rc.rightCenter;
                    idrc.center = pt;
                }
                else if (pt.x < 0) {
                    pt = rc.leftCenter;
                    idrc.center = pt;
                }
                this._identifierView.frame = idrc;
                
                let p = pt.x / rc.width;
                if (p != this.progressValue.percent) {
                    this.progressValue.percent = p;
                    this.signals.emit(SignalChanged, this.progressValue);
                }
            }
        }
    }
    
}