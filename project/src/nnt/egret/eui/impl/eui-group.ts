module eui {

    export class GroupU extends eui.Group {
        public slots: string = null;
        public tag: any = null;

        onPartBinded(name: string, target: any) {
            _EUIExt.onPartBinded(this, name, target);
        }

        goBack() {
            _EUIExt.goBack(this);
        }

        playAnimate(ani: Animate, idr?: any): Animate {
            return _EUIExt.playAnimate(this, ani, idr);
        }

        findAnimate(idr: any): Animate {
            return _EUIExt.findAnimate(this, idr);
        }

        stopAnimate(idr: any) {
            _EUIExt.stopAnimate(this, idr);
        }

        stopAllAnimates() {
            _EUIExt.stopAllAnimates(this);
        }

        set exhibition(b: boolean) {
            _EUIExt.setExhibition(this, b);
        }

        get exhibition(): boolean {
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
            this._signals.register(nn.SignalClicked);
            this._signals.register(nn.SignalTouchBegin);
            this._signals.register(nn.SignalTouchEnd);
            this._signals.register(nn.SignalTouchMove);
            this._signals.register(nn.SignalTouchReleased);
        }

        protected _signals: nn.Signals;
        get signals(): nn.Signals {
            if (this._signals)
                return this._signals;
            this._instanceSignals();
            return this._signals;
        }

        protected _instanceSignals() {
            this._signals = new nn.Signals(this);
            this._initSignals();
        }

        private _touch: nn.Touch;
        get touch(): nn.Touch {
            if (this._touch == null)
                this._touch = new nn.Touch();
            return this._touch;
        }

        _signalConnected(sig: string, s?: nn.Slot) {
            switch (sig) {
                case nn.SignalTouchBegin: {
                    this.touchEnabled = true;
                    nn.EventHook(this, egret.TouchEvent.TOUCH_BEGIN, this.__dsp_touchbegin, this);
                }
                    break;
                case nn.SignalTouchEnd: {
                    this.touchEnabled = true;
                    nn.EventHook(this, egret.TouchEvent.TOUCH_END, this.__dsp_touchend, this);
                }
                    break;
                case nn.SignalTouchMove: {
                    this.touchEnabled = true;
                    nn.EventHook(this, egret.TouchEvent.TOUCH_MOVE, this.__dsp_touchmove, this);
                }
                    break;
                case nn.SignalTouchReleased: {
                    this.touchEnabled = true;
                    nn.EventHook(this, egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.__dsp_touchrelease, this);
                }
                    break;
                case nn.SignalClicked: {
                    this.touchEnabled = true;
                    nn.EventHook(this, egret.TouchEvent.TOUCH_TAP, this.__dsp_tap, this);
                }
                    break;
            }
        }

        private __dsp_touchbegin(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalTouchBegin, t);
        }

        private __dsp_touchend(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalTouchEnd, t);
        }

        private __dsp_touchrelease(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalTouchEnd, t);
        }

        private __dsp_touchmove(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalTouchMove, t);
            t.lastPosition.copy(t.currentPosition);
        }

        private __dsp_tap(e: egret.TouchEvent) {
            let t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalClicked, t);
            // 防止之后的被点击
            e.stopPropagation();
        }

        /*
        $hitTest(stageX: number, stageY: number): egret.DisplayObject {
            if (!this.touchChildren)
                return null;
            return super.$hitTest(stageX, stageY);
        }
        */

        // 让group表现和button类似
        selected: boolean;

        // group的enable状态表现为是否能触摸
        public get enabled(): boolean {
            return this.touchEnabled;
        }

        public set enabled(v: boolean) {
            this.touchEnabled = v;
        }

        public get interactiveEnabled(): boolean {
            return this.touchEnabled;
        }

        public set interactiveEnabled(v: boolean) {
            this.touchEnabled = v;
            this.touchChildren = v;
        }

        get frame(): nn.Rect {
            return nn.getFrame(this);
        }

        set frame(rc: nn.Rect) {
            nn.setFrame(this, rc);
        }

        onAppeared() {
            ComponentU.ProcessAppeared(this);
        }

        onDisappeared() {
            ComponentU.ProcessDisppeared(this);
        }
    }

}
