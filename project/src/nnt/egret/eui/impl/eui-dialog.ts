module eui {

    import Delay = nn.Delay;

    /** 用来提供设置参数 */
    export class DesktopU extends eui.ComponentU {
        static IDRKEY = "::nneui::idrkey::desktop";

        constructor() {
            super();
            this.name = DesktopU.IDRKEY;
        }

        /** 弹出的形式 */
        public popupMode: boolean = true;

        /** 点击即关闭 */
        public clickedToClose: boolean = false;

        /** 满屏幕显示 */
        public fullSize: boolean = false;

        /** 转换 */
        static FromView(e: egret.DisplayObject): nn.Desktop {
            return nn.Desktop.FromView(nn.BridgedComponent.FromImp(e));
        }
    }

    class _ExtDesktop
        extends nn.Desktop {
        protected doOpen() {
            //super.doOpen();
            //this.flushLayout();
            let cnt = this.contentView.handle();
            cnt.$stage = egret.MainContext.instance.stage;
            cnt.$onAddToStage(cnt.$stage, 0);
        }

        _doOpen2() {
            super.doOpen();
        }
    }

    export class DialogU
        extends eui.SpriteU {
        constructor() {
            super();
            this._anchorPointX = 0.5;
            this._anchorPointY = 0.5;
        }

        dispose() {
            super.dispose();
        }

        /** 桌面的颜色 */
        desktopBackgroundColor = nn.Desktop.BackgroundColor;

        /** 获得视图隶属的dialog对象 */
        static FromView(cv: egret.DisplayObject): DialogU {
            return <any>nn.findParentByType(cv, DialogU);
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(nn.SignalRequestClose);
            this._signals.register(nn.SignalOpening);
            this._signals.register(nn.SignalClosing);
            this._signals.register(nn.SignalOpen);
            this._signals.register(nn.SignalClose);
        }

        // 检查一下是否具有desktop控件，用来更新下数据绑定
        childrenCreated() {
            super.childrenCreated();
            let dsk = <_ExtDesktop>nn.Desktop.FromView(nn.CComponent.FromImp(this));
            let dlg = <DesktopU>this.getChildByName(DesktopU.IDRKEY);
            if (dlg) {
                this.popupMode = dsk.popupMode = dlg.popupMode;
                this.clickedToClose = dsk.clickedToClose = dlg.clickedToClose;
                this.fullSize = dlg.fullSize;
            }
        }

        onLoaded() {
            super.onLoaded();
            let dsk = <_ExtDesktop>nn.Desktop.FromView(nn.CComponent.FromImp(this));
            dsk._doOpen2();

            // 打开的动画
            let ani = this.animateOpen;
            if (ani) {
                ani.clone().bind(this).play();
            }
        }

        /** 全局设置所有的弹出特效 */
        static AnimateOpen: Animate;
        static AnimateClose: Animate;

        /** 对象相关的弹出特效, 默认为 undefine，如果设置成null，则为不使用全局特效 */
        private _animateOpen: Animate;
        get animateOpen(): Animate {
            if (this._animateOpen === undefined)
                return DialogU.AnimateOpen;
            return this._animateOpen;
        }

        set animateOpen(ani: Animate) {
            if (ani === this._animateOpen)
                return;
            this._animateOpen = ani;
        }

        private _animateClose: Animate;
        get animateClose(): Animate {
            if (this._animateClose === undefined)
                return DialogU.AnimateClose;
            return this._animateClose;
        }

        set animateClose(ani: Animate) {
            if (ani === this._animateOpen)
                return;
            this._animateClose = ani;
        }

        /** 弹出的模式
         @note true为弹出对话框，不会隐藏后面的内容；false则push到对应的viewstack中，隐藏之前的页面
         */
        popupMode: boolean = true;

        /** 点击关闭 */
        clickedToClose: boolean = false;

        /** 满屏幕 */
        fullSize: boolean = false;

        /** 依赖的队列 */
        queue: nn.OperationQueue;

        /** 是否可以穿透触摸 */
        onlyFiltersTouchEnabled: boolean;

        protected instanceDesktop(): nn.Desktop {
            var dsk = new _ExtDesktop(new nn.BridgedComponent(this));
            dsk.onlyFiltersTouchEnabled = this.onlyFiltersTouchEnabled;
            dsk.popupMode = this.popupMode;
            dsk.clickedToClose = this.clickedToClose;
            dsk.backgroundColor = this.desktopBackgroundColor;
            if (this.queue)
                dsk.queue = this.queue;
            this.signals.connect(nn.SignalRequestClose, dsk.close, dsk);
            this._filters.forEach((o: any) => {
                dsk.addFilter(o);
            });
            return dsk;
        }

        // 参照core-dialog
        _filters = new nn.CSet<nn.CComponent>();

        addFilter(ui: UiType) {
            let c = nn.BridgedComponent.Wrapper(ui);
            this._filters.add(c);
            let dsk = <_ExtDesktop>nn.Desktop.FromView(nn.CComponent.FromImp(this));
            if (dsk)
                dsk.addFilter(c);
        }

        updateFilters() {
            let dsk = <_ExtDesktop>nn.Desktop.FromView(nn.CComponent.FromImp(this));
            if (dsk)
                dsk.updateFilters();
        }

        replace(link: Component): nn.Desktop {
            var dsk = this.instanceDesktop();
            dsk.replace(nn.CComponent.FromImp(link));
            return dsk;
        }

        open(queue: boolean = true): nn.Desktop {
            var dsk = this.instanceDesktop();
            dsk.open(queue);
            return dsk;
        }

        follow(link: Component): nn.Desktop {
            var dsk = this.instanceDesktop();
            dsk.follow(nn.CComponent.FromImp(link));
            return dsk;
        }

        goBack() {
            this.close();
        }

        close() {
            this.signals.emit(nn.SignalRequestClose);
        }

        delayClose(timeout?: number) {
            if (timeout) {
                Delay(timeout, () => {
                    this.close();
                });
            } else {
                this.close();
            }
        }

        bestFrame(): nn.Rect {
            if (this.fullSize) {
                let rc = nn.StageBounds.clone();
                rc.x = rc.width * this._anchorPointX;
                rc.y = rc.height * this._anchorPointY;
                return rc;
            }
            let rc = new nn.Rect(0, 0, this.width, this.height);
            if (rc.width && rc.height) {
                rc.x = rc.width * this._anchorPointX;
                rc.y = rc.height * this._anchorPointY;
                return rc;
            }
            if (this.skin) {
                rc.width = this.skin.width;
                rc.height = this.skin.height;
                rc.x = rc.width * this._anchorPointX;
                rc.y = rc.height * this._anchorPointY;
                return rc.isnan ? null : rc;
            }
            return null;
        }

        bestPosition(): nn.Point {
            return null;
        }
    }

}
