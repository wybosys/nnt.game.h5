module nn {

    // 支持手势的对象需要实现
    export interface IGesturable {
        gestures:Gesture[];    
        signals:Signals;
    }

    export class Gesture
    extends SObject
    implements IGesture
    {
        constructor() {
            super();
        }
        
        dispose() {            
            super.dispose();
            this.detach();
        }
        
        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalStart);
            this._signals.register(SignalChanged);
            this._signals.register(SignalCancel);
            this._signals.register(SignalEnd);
            this._signals.register(SignalDone);
        }

        attach(spr:IGesturable) {
            if (spr == null) {
                this.detach();
                return;
            }
            
            this._spr = spr;
            this._spr.gestures.push(this);
            this.doAttach();
        }

        protected doAttach() {}

        detach() {
            if (this._spr == null)
                return;
            this.doDetach();
            nn.ArrayT.RemoveObject(this._spr.gestures, this);
            this._spr = null;
        }

        protected doDetach() {}

        protected _spr:IGesturable;
    }

    export class GestureTap
    extends Gesture
    {
        constructor() {
            super();
        }

        protected doAttach() {
            this._spr.signals.connect(SignalClicked, this.__cb_tap, this);
        }

        protected doDetach() {
            this._spr.signals.disconnectOfTarget(this);
        }

        private __cb_tap() {
            let tms = DateTime.Now();
            if (tms - this._tms > this.interval) {
                this.count = 0;
                this._tms = tms;
            }
            
            this.count++;            
            this.signals.emit(SignalDone);
        }

        /** 统计次数 */
        count = 0;

        /** 多少时间清空一次 */
        interval:number;
        private _tms:number = 0;
    }

    export class GestureLongTap
    extends Gesture
    {
        constructor(duration = 1.3) {
            super();
            this.duration = duration;
        }

        dispose() {
            super.dispose();
            drop(this._tmr);
        }
        
        duration:number;

        protected doAttach() {
            this._spr.signals.connect(SignalTouchBegin, this.__cb_touchbegin, this);
            this._spr.signals.connect(SignalTouchEnd, this.__cb_touchend, this);
            this._spr.signals.connect(SignalTouchMove, this.__cb_touchmove, this);
        }

        protected doDetach() {
            this._spr.signals.disconnectOfTarget(this);
        }

        _tmr:SysTimer;

        private __cb_touchbegin() {
            // 启动计时器
            if (this._tmr != null) {
                warn("长按的定时器应该当触摸开始时为 null");
            }

            this._tmr = new SysTimer(this.duration, 1);
            this._tmr.signals.connect(SignalDone, this.__cb_timer, this);
            this._tmr.start();
        }

        private __cb_touchend(s:Slot) {
            if (this._tmr) {
                this._tmr = drop(this._tmr);
                this.signals.emit(SignalCancel);
            }
            else {
                // 如果 tmr 已经为 null，然而该函数仍然进了，则代表是系统原先的事件，需要终止，否则仍然会激活 SignalClicked
                this._spr.signals.block(SignalClicked);
                Defer(()=>{
                    this._spr.signals.unblock(SignalClicked);
                }, this);
                //s.data.veto();
                //因为 egret 的 TouchContext ln:120 的实现问题
            }
        }

        private __cb_touchmove() {
            if (this._tmr) {
                this._tmr = drop(this._tmr);
                this.signals.emit(SignalCancel);
            }
        }

        private __cb_timer() {
            this._tmr = drop(this._tmr);
            this.signals.emit(SignalDone);
        }
    }

    export class GestureRecognizer
    extends SObject
    {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalDone);
        }
        
        /** 上次位置、当前位置 */
        lastPosition = new Point();
        currentPosition = new Point();

        /** 上次时间、当前时间 */
        lastTime:number;
        currentTime:number;

        /** 增量 */
        deltaPosition = new Point();
        deltaTime:number;

        /** 变动次数 */
        stat:number = 0;

        /** 加速度 */
        velocity = new Point();

        /** 最小间隔时间 */
        thresholdInterval:number = 0.3;

        /** 重置 */
        reset() {
            this.stat = 0;
            this.velocity.reset(0, 0);
        }

        /** 移动一次位置 */
        addPosition(x:number, y:number) {
            // 第一次移动，直接设置
            if (this.stat == 0) {
                this.lastPosition.reset(x, y);
                this.currentPosition.reset(x, y);
                this.lastTime = this.currentTime = DateTime.Now();
                ++this.stat;
                return;
            }

            // 其他时候的移动，更新手势
            this.lastTime = this.currentTime;
            this.currentTime = DateTime.Now();
            this.deltaTime = this.currentTime - this.lastTime;

            this.lastPosition.copy(this.currentPosition);
            this.currentPosition.reset(x, y);
            this.deltaPosition.reset(this.currentPosition.x - this.lastPosition.x,
                                     this.currentPosition.y - this.lastPosition.y);

            this.velocity.reset(0, 0);
            if (this.deltaTime) {
                this.velocity.reset(this.deltaPosition.x / this.deltaTime,
                                    this.deltaPosition.y / this.deltaTime);
            }

            if (this.deltaTime <= this.thresholdInterval)
                this.doPosition();

            ++this.stat;
        }

        protected doPosition() {}

        /** 主方向 */
        majorDirection(threshold = new Point(30, 30)):Direction {
            let r = Direction.UNKNOWN;
            let d = this.deltaPosition;
            if (d.x > threshold.x)
                r |= Direction.RIGHT;
            else if (d.x < -threshold.x)
                r |= Direction.LEFT;
            if (d.y > threshold.y)
                r |= Direction.DOWN;
            else if (d.y < -threshold.y)
                r |= Direction.UP;
            return r;
        }
    }

    export class GestureSwipe
    extends Gesture
    {
        constructor() {
            super();            
        }

        protected doAttach() {
            this._spr.signals.connect(SignalTouchBegin, this.__cb_touchbegin, this);
            this._spr.signals.connect(SignalTouchEnd, this.__cb_touchend, this);
        }

        protected doDetach() {
            this._spr.signals.disconnectOfTarget(this);
        }

        private __cb_touchbegin(s:Slot) {
            this._recognizer.reset();
            let th:CTouch = s.data;
            this._recognizer.addPosition(th.currentPosition.x, th.currentPosition.y);
        }
        
        private __cb_touchend(s:Slot) {
            let th:CTouch = s.data;
            this._recognizer.addPosition(th.currentPosition.x, th.currentPosition.y);
            if (this._recognizer.deltaTime <= 0.3) {
                this.direction = this._recognizer.majorDirection();
                this.signals.emit(SignalDone, this.direction);
            }
        }

        _recognizer = new GestureRecognizer();
        direction:Direction;
    }    
    
}