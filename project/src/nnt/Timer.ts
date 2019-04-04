module nn {

    /** 定时器 */
    export abstract class CTimer extends SObject {
        constructor(interval, count) {
            super();
            this.interval = interval;
            this.count = count;
        }

        dispose() {
            this.stop();
            super.dispose();
        }

        // 例如egret，timer不能通过全局静态变量启动，所以如过是被静态对象启动，则需要把timer延迟到application加载成功后启动
        static SAFE_TIMER_ENABLED = true;
        static SAFE_TIMERS = new Set<CTimer>();

        /** tick 的次数 */
        count: number = -1;

        /** 间隔 s */
        interval: number = 1; // 间隔 s

        /** timer 的附加数据 */
        xdata: any = {};

        /** 当前激发的次数 */
        _firedCount: number = 0;
        get firedCount(): number {
            return this._firedCount;
        }

        set firedCount(v: number) {
            fatal("不允许设置 firedCount");
        }

        /** 每一次激发的增量 */
        _deltaFired = 1;
        get deltaFired(): number {
            return this._deltaFired;
        }

        set deltaFired(v: number) {
            this._deltaFired = v;
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalAction);
            this._signals.register(SignalDone);
        }

        /** 已经过去了的时间 */
        get pastTime(): number {
            return this._firedCount / this.interval;
        }

        /** 当前的逻辑时间戳 */
        currentTime: number;

        /** 启动定时器 */
        abstract start();

        /** 停止定时器 */
        abstract stop();

        /** 是否正在运行 */
        get isRunning(): boolean {
            return false;
        }

        oneTick(delta: number = 0) {
            this._deltaFired = 0;
            this.signals.emit(SignalAction);
        }
    }

    /** 低精度的实际时间定时器
     @brief 使用实际时间来判定每一次的 tick
     */
    export class RtTimer extends CTimer {
        constructor(interval = 1, count = -1) {
            super(interval, count);
        }

        /** 查询时间 */
        private _tmr: any;

        start() {
            this.stop();
            this._firedCount = 0;

            this._tmr = IMP_CREATE_TIMER(this.interval, 0);
            if (CTimer.SAFE_TIMER_ENABLED) {
                CTimer.SAFE_TIMERS.add(this);
            } else {
                IMP_START_TIMER(this._tmr, this.__tmr_tick, this);

                // 记录一下启动的时间
                this.currentTime = DateTime.Pass();
            }
        }

        stop() {
            if (this.isRunning == false)
                return;

            IMP_STOP_TIMER(this._tmr, this.__tmr_tick, this);
            this._tmr = null;
        }

        get isRunning(): boolean {
            return this._tmr != null;
        }

        private __tmr_tick() {
            // 过去了的时间
            let nowed = DateTime.Pass();
            let elpased = nowed - this.currentTime;
            this.currentTime = nowed;

            // 已经超过了间隔时间，可以算作一次 tick
            if (elpased >= this.interval) {
                // 计算 tick 的次数
                this.deltaFired = Math.floor(elpased / this.interval);
                this._firedCount += this.deltaFired;

                // 额外计算一下多余跑的时间
                this.xdata.overflow = elpased - this.deltaFired * this.interval;

                // 判定
                if (this.count != -1) {
                    if (this._firedCount >= this.count) {
                        this._firedCount = this.count;
                        this.signals.emit(SignalAction);
                        this.signals.emit(SignalDone);
                        this.stop();
                    } else {
                        this.signals.emit(SignalAction);
                    }
                } else {
                    this.signals.emit(SignalAction);
                }

                // 扣除已经用过的
                this.currentTime -= this.xdata.overflow;

                // 恢复增量
                this.deltaFired = 1;
            }
        }
    }

    /** 系统定时器 */
    export class SysTimer extends CTimer {
        constructor(interval = 1, count = -1) {
            super(interval, count);
        }

        dispose() {
            super.dispose();
            this._tmr = undefined;
        }

        private _tmr: any;

        start() {
            // 先暂停
            this.stop();
            this._firedCount = 0;

            this._tmr = IMP_CREATE_TIMER(this.interval, this.count == -1 ? 0 : this.count);
            if (CTimer.SAFE_TIMER_ENABLED) {
                CTimer.SAFE_TIMERS.add(this);
            } else {
                IMP_START_TIMER(this._tmr, this.__tmr_tick, this);
            }
        }

        stop() {
            if (this.isRunning == false)
                return;

            IMP_STOP_TIMER(this._tmr, this.__tmr_tick, this);
            this._tmr = null;
        }

        get isRunning(): boolean {
            return this._tmr != null;
        }

        private __tmr_tick() {
            this.currentTime = DateTime.Pass();
            this._firedCount += this.deltaFired;
            if (this.count != -1) {
                if (this._firedCount >= this.count) {
                    this._firedCount = this.count;
                    this.signals.emit(SignalAction);
                    this.signals.emit(SignalDone);
                    this.stop();
                } else {
                    this.signals.emit(SignalAction);
                }
            } else {
                this.signals.emit(SignalAction);
            }
        }
    }

    /** 定时器
     @brief 可以选择支持不支持在后台运行 */
    export class Timer extends CTimer {
        constructor(interval = 1, count = -1) {
            super(interval, count);
        }

        private _rtmr: RtTimer;
        private _systmr: SysTimer;

        /** 是否打开后台模式 */
        backgroundMode: boolean;

        start() {
            this.stop();
            if (this.backgroundMode) {
                this._rtmr = new RtTimer(this.interval, this.count);
                this._rtmr.signals.connect(SignalAction, this.__act_action, this);
                this._rtmr.signals.connect(SignalDone, this.__act_done, this);
            } else {
                this._systmr = new SysTimer(this.interval, this.count);
                this._systmr.signals.connect(SignalAction, this.__act_action, this);
                this._systmr.signals.connect(SignalDone, this.__act_done, this);
            }

            if (this._rtmr)
                this._rtmr.start();
            else
                this._systmr.start();
        }

        private __act_action(s: Slot) {
            this.xdata = s.sender.xdata;
            this.signals.emit(SignalAction);
        }

        private __act_done(s: Slot) {
            this.xdata = s.sender.xdata;
            this.signals.emit(SignalDone);
        }

        stop() {
            if (this.isRunning == false)
                return;
            if (this._rtmr) {
                this._rtmr.drop();
                this._rtmr = undefined;
            }
            if (this._systmr) {
                this._systmr.drop();
                this._systmr = undefined;
            }
        }

        protected timer(): CTimer {
            if (this._rtmr)
                return this._rtmr;
            if (this._systmr)
                return this._systmr;
            return null;
        }

        get isRunning(): boolean {
            let tmr = this.timer();
            return tmr && tmr.isRunning;
        }

        get firedCount(): number {
            let tmr = this.timer();
            return tmr && tmr.firedCount;
        }

        set firedCount(v: number) {
            warn("不允许直接设置 firedCount");
        }

        get deltaFired(): number {
            let tmr = this.timer();
            return tmr && tmr.deltaFired;
        }

        set deltaFired(v: number) {
            warn("不允许直接设置 deltaFired");
        }
    }

    /** 延迟运行 */
    export function Delay(duration: Interval, cb: () => void): Timer {
        if (duration <= 0) {
            cb();
            return null;
        }

        let tmr = new Timer(duration, 1);
        tmr.signals.connect(SignalDone, () => {
            cb();
            tmr.stop(); //不用dispose，一般业务层会做这个事情或者自动就gc掉了
        }, null);

        // 直接开始，不能用defer避免出现外部先stop然后才到start的问题
        tmr.start();

        return tmr;
    }

    export function Sleep(duration: Interval): Promise<void> {
        return new Promise<void>(resolve => {
            Delay(duration, resolve);
        });
    }

    /** 时间片对象 */
    export class CoTimerItem extends CTimer {
        constructor() {
            super(1, -1);
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.delegate = this;
        }

        dispose() {
            super.dispose();
            this._cotimer = null;
        }

        // 当连接新的信号时，自动激活一次信号以即时刷新数值
        _signalConnected(sig: string) {
            if (this.radicalMode && this.isRunning && sig == SignalAction)
                this._signals.emit(SignalAction);
        }

        /** 激进的模式
         @brief 当定时器跑在后台时，前端业务需要添加一处反应定时器进度的反馈，如果 radicalMode == false，那么 UI 只能再下一次 tick 的时候得到 SignalAction 的激发，如果这个值为 true，那么当 UI connect 到 Action 时，会自动激发 SignalAction 以达到立即刷新 UI 的目的
         */
        radicalMode: boolean;

        /** tick时间数 */
        times: number = 0;

        /** 当前的 tick */
        now: number = 0;

        /** 正在运行 */
        get isRunning(): boolean {
            return this._cotimer && this._cotimer.isRunning;
        }

        set isRunning(v: boolean) {
            fatal('不允许设置运行状态');
        }

        /** 重新设置并启动定时器 */
        reset(inv: number, count: number = -1, of?: any): CoTimerItem {
            this.interval = inv;
            this.times = inv / this._timeinterval;
            this.count = count;

            if (of == null) {
                this.now = 0;
                this._firedCount = 0;
            } else {
                if (of.overflow) {
                    let dt = of.overflow / this._timeinterval;
                    this.now = dt % this.times;
                    this._firedCount = Math.floor(dt / this.times);
                } else {
                    this.now = 0;
                    this._firedCount = 0;
                }
            }

            // 延迟启动，为了让业务层有机会设置相关参数
            Defer(this.start, this);
            return this;
        }

        /** 修改一下计时参数, 和 reset 的区别是不影响当前状态 */
        set(inv: number, count: number = -1) {
            this.interval = inv;
            this.times = inv / this._timeinterval;
            this.count = count;
        }

        start() {
            if (this._cotimer == null) {
                warn("没有加入过 timer，不能启动");
                return;
            }

            this._cotimer._addTimer(this);
            if (this.radicalMode && this.isRunning)
                this.signals.emit(SignalAction);
        }

        stop() {
            if (this._cotimer == null) {
                warn("CoTimerItem 已经停止");
                return;
            }

            this._cotimer._stopTimer(this);
        }

        _timeinterval: number;
        _cotimer: CoTimer;
    }

    /** 统一调度的计时器
     @brief 由 CoTimer 派发出的 TimerItem 将具有统一的调度，默认精度为100ms，如果业务需要准确的计时器，最好传入业务实际的间隔
     */
    export class CoTimer extends SObject {
        constructor(interval = 0.1) {
            super();
            this._tmr.interval = interval;
            this._tmr.signals.connect(SignalAction, this.__tmr_tick, this);
        }

        dispose() {
            super.dispose();
            this.stop();
            if (this._tmr) {
                this._tmr.drop();
                this._tmr = undefined;
            }
            this.clear();
        }

        get interval(): number {
            return this._tmr.interval;
        }

        set interval(val: number) {
            this._tmr.interval = val;
        }

        set backgroundMode(v: boolean) {
            this._tmr.backgroundMode = v;
        }

        get backgroundMode(): boolean {
            return this._tmr.backgroundMode;
        }

        get isRunning(): boolean {
            return this._tmr.isRunning;
        }

        set isRunning(v: boolean) {
            fatal("不能设置 timer 的状态");
        }

        start(): CoTimer {
            if (this.isRunning) {
                warn("CoTimer 定时器已经在运行");
                return this;
            }

            this._tmr.start();
            return this;
        }

        stop(): CoTimer {
            if (!this.isRunning) {
                warn("CoTimer 定时器已经停止");
                return;
            }

            this._tmr.stop();
            return this;
        }

        /** 增加一个分片定时器，时间单位为 s
         @param idr, 重用定时器的标记，如果!=undefined，则尝试重用定时器并设置为新的定时值
         @note 增加会直接添加到时间片列表，由CoTimer的运行情况来决定此时间片是否运行
         */
        add(inv: number, count: number = -1, idr?: any): CoTimerItem {
            let r = this.acquire(idr);
            r.reset(inv, count);
            return r;
        }

        /** 申请一个定时器，和 add 的区别是不会重置参数 */
        acquire(idr: any): CoTimerItem {
            let r = this.findItemByIdr(idr);
            if (r)
                return r;

            r = new CoTimerItem();
            r._cotimer = this;
            r._timeinterval = this._tmr.interval;
            r.radicalMode = this.radicalMode;
            r.tag = idr;

            return r;
        }

        /** 具体参见 CoTimerItem 里面的解释 */
        radicalMode: boolean = false;

        // 添加一个分片计时器
        _addTimer(tmr: CoTimerItem) {
            if (ArrayT.Contains(this._splices, tmr))
                return;
            this._splices.push(tmr);
        }

        // 停止一个分片计时器
        _stopTimer(tmr: CoTimerItem) {
            ArrayT.RemoveObject(this._splices, tmr);
        }

        /** 根据idr查找分片计时器 */
        findItemByIdr(idr: any): CoTimerItem {
            if (idr == null)
                return null;
            return ArrayT.QueryObject(this._splices, (o: CoTimerItem): boolean => {
                return o.tag && o.tag == idr;
            }, this);
        }

        /** 清空所有的分片 */
        clear() {
            ArrayT.Clear(this._splices, (o: CoTimerItem) => {
                dispose(o);
            }, this);
        }

        private __tmr_tick(s: Slot) {
            this._splices.forEach((item: CoTimerItem) => {
                let dfired = this._tmr.deltaFired;

                // 判断是否一次完整的激发
                item.now += dfired;
                if (item.now < item.times)
                    return;
                // 如果中间间隔了很久，则需要保存余数为下一次的激发判断
                item.now = item.now % item.times;

                // 遇到一次激发
                item.deltaFired = dfired > item.times ?
                    Math.floor(dfired / item.times) : 1;
                item._firedCount += item.deltaFired;

                // 遇到激发的最大数目
                if (item.count != -1) {
                    if (item._firedCount >= item.count) {
                        item._firedCount = item.count;

                        // 移除
                        this._stopTimer(item);

                        // 抛出事件
                        item.signals.emit(SignalAction, s.sender.xdata);
                        item.signals.emit(SignalDone, s.sender.xdata);

                        // 恢复激发计数
                        item._firedCount = 0;
                    } else {
                        item.signals.emit(SignalAction, s.sender.xdata);
                    }
                } else {
                    item.signals.emit(SignalAction, s.sender.xdata);
                }
            }, this);
        }

        private _splices = new Array<CoTimerItem>();
        private _tmr = new Timer();
    }

    /** 延迟器 */
    export class Delayer {

        constructor(tm: number, cb: Function, ctx?: any) {
            this._tm = tm;
            this._cb = cb;
            this._ctx = ctx;
        }

        start() {
            if (this._tmr) {
                warn("Delayer已经开始");
                return;
            }

            this._tmr = new SysTimer(this._tm, 1);
            this._tmr.signals.connect(SignalDone, <any>this._cb, this._ctx);
            this._tmr.start();
        }

        stop() {
            if (this._tmr == null)
                return;
            this._tmr.drop();
            this._tmr = null;
        }

        restart() {
            this.stop();
            this.start();
        }

        private _tm: number;
        private _cb: Function;
        private _ctx: any;
        private _tmr: SysTimer;
    }

    /** 重复调用 */
    export function Repeat(s: number, cb: (s?: Slot) => void, ctx?: any): CTimer {
        let tmr = new SysTimer(s);
        tmr.signals.connect(SignalAction, cb, ctx);
        tmr.start();
        return tmr;
    }
}
