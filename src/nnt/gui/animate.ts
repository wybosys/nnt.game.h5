module nn {

    /** 页面过渡的动画 */
    export interface ITransition extends IReference {
        play(appear: CComponent, disappear: CComponent);
    }

    /** 自定义动画对象 */
    export class Animator {
        _preproperties = new KvObject<string, any>();
        _properties = new KvObject<string, any>();

        /** 类似于 iOS 的反向设置模式 */
        backMode: boolean;

        /** 增量移动 */
        translate(dpt: Point): Animator {
            if (this.backMode) {
                this._preproperties['dx'] = -dpt.x;
                this._preproperties['dy'] = -dpt.y;
                this._properties['dx'] = 0;
                this._properties['dy'] = 0;
            } else {
                this._properties['dx'] = dpt.x;
                this._properties['dy'] = dpt.y;
            }
            return this;
        }

        translatex(x: number): Animator {
            if (this.backMode) {
                this._preproperties['dx'] = -x;
                this._properties['dx'] = 0;
            } else {
                this._properties['dx'] = x;
            }
            return this;
        }

        translatey(y: number): Animator {
            if (this.backMode) {
                this._preproperties['dy'] = -y;
                this._properties['dy'] = 0;
            } else {
                this._properties['dy'] = y;
            }
            return this;
        }

        /** 倍数移动 */
        stranslate(dpt: Point): Animator {
            if (this.backMode) {
                this._preproperties['dxs'] = -dpt.x;
                this._preproperties['dys'] = -dpt.y;
                this._properties['dxs'] = 0;
                this._properties['dys'] = 0;
            } else {
                this._properties['dxs'] = dpt.x;
                this._properties['dys'] = dpt.y;
            }
            return this;
        }

        /** 移动到点 */
        moveto(dpt: Point): Animator {
            this._properties['x'] = dpt.x;
            this._properties['y'] = dpt.y;
            return this;
        }

        movetox(v: number): Animator {
            this._properties['x'] = v;
            return this;
        }

        movetoy(v: number): Animator {
            this._properties['y'] = v;
            return this;
        }

        /** 增量缩放倍数 */
        scale(dpt: Point): Animator {
            if (this.backMode) {
                this._preproperties['dsx'] = -dpt.x;
                this._preproperties['dsy'] = -dpt.y;
                this._properties['dsx'] = 0;
                this._properties['dsy'] = 0;
            } else {
                this._properties['dsx'] = dpt.x;
                this._properties['dsy'] = dpt.y;
            }
            return this;
        }

        scaleto(dpt: Point): Animator {
            this._properties['scaleX'] = dpt.x;
            this._properties['scaleY'] = dpt.y;
            return this;
        }

        /** 旋转 */
        rotate(ang: Angle) {
            if (this.backMode)
                this._preproperties['dangle'] = -ang.angle;
            this._properties['dangle'] = ang.angle;
            return this;
        }

        /** 淡入淡出 */
        fade(to: number, from?: number): Animator {
            if (from != null)
                this._preproperties['alpha'] = from;
            if (to != null)
                this._properties['alpha'] = to;
            return this;
        }

        fadeIn(alpha: number = 1): Animator {
            return this.fade(alpha, 0);
        }

        fadeOut(alpha: number = 0): Animator {
            return this.fade(alpha);
        }

        /** 任意参数做动画 */
        change(key: string, to: any, from?: any): Animator {
            if (from != null)
                this._preproperties[key] = from;
            if (to != null)
                this._properties[key] = to;
            return this;
        }
    }

    export class TimeFunction {
        // inout 的设置属性，配合下面的函数使用
        static IN = 1;
        static OUT = 2;
        static INOUT = 3;

        static Pow: (pow: any, inout?: number) => Function;
        static Quad: (inout?: number) => Function;
        static Bounce: (inout?: number) => Function;
        static Elastic: (amplitude?: any, period?: any, inout?: number) => Function;
        static Circ: (inout?: number) => Function;
        static Back: (amount?: number, inout?: number) => Function;
    };

    export abstract class CAnimate extends SObject {
        constructor() {
            super();
        }

        dispose() {
            this.clear();
            super.dispose();
        }

        // 系统默认的动画时间
        static Duration = 0.33;

        /** 播放几次 */
        count: number = 1;

        /** 动画的标记 */
        tag: any;

        // 当前第几次
        protected _firedCount = 0;

        _initSignals() {
            super._initSignals();
            this._signals.register(SignalStart);
            this._signals.register(SignalEnd);
            this._signals.register(SignalDone);
        }

        /** 设置重复的次数 */
        repeat(count: number): this {
            this.count = count;
            return this;
        }

        /** 清空所有 */
        abstract clear();

        /** 结束所有动画 */
        abstract stop();

        /** 链接对象 */
        abstract bind(tgt: CComponent): this;

        /** 取消对象 */
        abstract unbind(tgt: CComponent);

        abstract unbindAll();

        /** 下一步 */
        abstract next(props: any, duration: number, tf: Function): this;

        abstract to(duration: number, tf: Function, ani: (ani: Animator) => void, ctx?: any): this;

        then(ani: (ani: Animator) => void, ctx = null, duration = CAnimate.Duration, tf: Function = null): this {
            return this.to(duration, tf, ani, ctx);
        }

        /** 等待 */
        abstract wait(duration: number, passive?: boolean): this;

        /** 执行函数 */
        abstract invoke(fun: Function, ctx?: any): this;

        /** 结束 */
        complete(cb: (s: Slot) => void, ctx?: any): this {
            this.signals.connect(SignalDone, cb, ctx);
            return this;
        }

        /** 播放 */
        abstract play(reverse?: boolean): this;

        /** 暂停 */
        abstract pause();

        /** 恢复 */
        abstract resume();

        /** 暂停的状态 */
        abstract isPaused(): boolean;

        /** 动画结束是否恢复原来的状态 */
        autoReset: boolean;

        /** 动画结束是否自动解除绑定 */
        autoUnbind: boolean = true;

        /** 动画结束后是否自动释放 */
        autoDrop: boolean = true;

        /** 复制 */
        clone(): this {
            let obj = InstanceNewObject(this);
            obj.autoReset = this.autoReset;
            obj.autoUnbind = this.autoUnbind;
            obj.autoDrop = this.autoDrop;
            obj.count = this.count;
            obj.tag = this.tag;
            return obj;
        }

        /** 直接停止对象动画 */
        static Stop(tgt: CComponent) {
        }

        inTo(duration: number, cb: (animator: Animator) => void, ctx?: any,
             tf = TimeFunction.Quad(TimeFunction.OUT)): this {
            return this.to(duration, tf, cb, ctx);
        }

        outTo(duration: number, cb: (animator: Animator) => void, ctx?: any,
              tf = TimeFunction.Quad(TimeFunction.IN)): this {
            return this.to(duration, tf, cb, ctx);
        }

        tremble(duration: number = CAnimate.Duration, tf?: Function): this {
            return this
                .next({'scaleX': 1.3, 'scaleY': 1.3}, duration * 0.2, tf)
                .next({'scaleX': 0.8, 'scaleY': 0.8}, duration * 0.2, tf)
                .next({'scaleX': 1.1, 'scaleY': 1.1}, duration * 0.2, tf)
                .next({'scaleX': 0.9, 'scaleY': 0.9}, duration * 0.2, tf)
                .next({'scaleX': 1, 'scaleY': 1}, duration * 0.2, tf);
        }
    }

    export abstract class CTween {
        /** 激活一个对象添加动画 */
        static Get(c: CComponent, props?: any): any {
            return null;
        }

        /** 删除对象的全部动画 */
        static Stop(c: CComponent) {
        }
    }

}
