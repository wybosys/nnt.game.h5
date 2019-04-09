module nn {

    export class FrameTimer {
        constructor() {
            this.start = this.now = DateTime.Pass();
        }

        /** 起始时间 ms */
        start: number;

        /** 点前的时间点 */
        now: number;

        /** 消耗时间 */
        cost: number = 0;

        /** 过去了的时间 */
        past: number = 0;

        /** 次数统计 */
        count: number = 0;
    }

    export interface IFrameRender {
        onRender(cost: number);
    }

    interface ILayoutableComponent {
        __disposed: boolean;
        __islayouting: boolean;
    }

    export abstract class CFramesManager {

        // 保存每一帧中需要处理的对象
        private _blayouts = NewSet<CComponent>();
        private _bzpositions = NewSet<CComponent>();
        private _bappears = NewSet<CComponent>();
        private _bcaches = NewSet<CComponent>();
        private _bmcs = NewSet<Memcache>();

        // 避免重复布局
        static _layoutthreshold = 0;

        protected onPrepare() {
            if (ISDEBUG) {
                ++this._ft.count;
            }

            // 刷新一下布局
            ++CFramesManager._layoutthreshold;
            nn.SetT.SafeClear(this._blayouts, (c: CComponent) => {
                let ref = <ILayoutableComponent><any>c;
                if (!ref.__disposed) {
                    ref.__islayouting = true;
                    c.updateLayout();
                    ref.__islayouting = false;
                }
            });
            --CFramesManager._layoutthreshold;

            // 调整z顺序
            nn.SetT.SafeClear(this._bzpositions, (c: CComponent) => {
                let ref = <ILayoutableComponent><any>c;
                if (!ref.__disposed) {
                    c.updateZPosition();
                }
            });

            // 当布局结束才激发已显示
            nn.SetT.SafeClear(this._bappears, (c: CComponent) => {
                let ref = <ILayoutableComponent><any>c;
                if (!ref.__disposed && !c.isAppeared) {
                    c.onAppeared();
                }
            });

            // 更新图形缓存
            nn.SetT.Clear(<any>this._bcaches, (c: CComponent) => {
                let ref = <ILayoutableComponent><any>c;
                if (!ref.__disposed) {
                    c.flushCache();
                }
            });

            // 更新内存缓存
            nn.SetT.Clear(<any>this._bmcs, (mc: Memcache) => {
                mc.gc();
            });
        }

        protected onRendering() {
            let now = DateTime.Pass();
            this._ft.past = now - this._ft.start;
            if (this.needResetFrameTimer) {
                this._ft.cost = 0;
                this._ft.now = now;
                this.needResetFrameTimer = false;
            } else {
                this._ft.cost = now - this._ft.now;
                this._ft.now = now;
            }
            let cost = this._ft.cost;

            // 标准set的foreach需要传入3个参数，但是后两个我们都不会去使用
            (<any>this.RENDERS).forEach((each: IFrameRender) => {
                each.onRender(cost);
            }, this);
        }

        RENDERS = NewSet<IFrameRender>();

        /** 强制更新下一帧 */
        abstract invalidate();

        /** 布局 */
        needsLayout(c: CComponent) {
            if (CFramesManager._layoutthreshold == 0) {
                this._blayouts.add(c);
                this.invalidate();
            } else {
                c.updateLayout();
            }
        }

        cancelLayout(c: CComponent) {
            this._blayouts.delete(c);
        }

        /** 调整Z顺序 */
        needsZPosition(c: CComponent) {
            this._bzpositions.add(c);
            this.invalidate();
        }

        /** 显示 */
        needsAppear(c: CComponent) {
            this._bappears.add(c);
            this.invalidate();
        }

        /** 刷新图形缓存 */
        needsCache(c: CComponent) {
            this._bcaches.add(c);
            this.invalidate();
        }

        /** 刷新内存缓存 */
        needsGC(mc: Memcache) {
            this._bmcs.add(mc);
            this.invalidate();
        }

        // 具体的引擎实现application时调用该函数绑定帧渲染管理器
        abstract launch(c: any);

        // 帧计时器
        private _ft = new FrameTimer();

        // 重置帧计时器的标记
        needResetFrameTimer: boolean;
    }

    export let FramesManager: CFramesManager;

}
