module nn {

    function _bindDesktop(c: any, dsk: Desktop) {
        c.__desktop = dsk;
    }

    function _bindedDesktop(c: any): Desktop {
        return c ? c.__desktop : null;
    }

    class DisabledAutolayoutSprite
        extends Sprite {
        setNeedsLayout() {
        }
    }

    class DisabledAutolayoutBitmap extends Bitmap {
        setNeedsLayout() {
        }
    }

    /** Desktop默认依赖的执行队列，业务可以通过替换对来来手动划分不同的Desktop打开层级
     @note 如果Desktop放到队列中，则当上一个dialog关闭时，下一个dialog才打开
     */
    export let DesktopOperationQueue = new OperationQueue();

    /** 桌面，打开时铺平整个屏幕 */
    export class Desktop extends Component {
        static BackgroundColor = Color.RGBf(0, 0, 0, 0.61);
        static BackgroundImage: TextureSource;

        constructor(ui?: CComponent) {
            super();

            if (ObjectClass(this).BackgroundColor)
                this.backgroundColor = ObjectClass(this).BackgroundColor;
            if (ObjectClass(this).BackgroundImage)
                this.backgroundImage = ObjectClass(this).BackgroundImage;

            this.touchEnabled = true;
            this.contentView = ui;
            this.frame = StageBounds;

            this.signals.connect(SignalClicked, this.__dsk_clicked, this);
            this.signals.connect(SignalHitTest, this.__dsk_clicked, this);
            this.signals.connect(SignalAddedToStage, this.__dsk_addedtostage, this);

            // 保证一直是满屏大小
            CApplication.shared.signals.connect(SignalFrameChanged, this.__dsk_sizechanged, this);
        }

        dispose() {
            ArrayT.Clear(this._filters);
            super.dispose();
        }

        static FromView(c: CComponent): Desktop {
            let r = _bindedDesktop(c);
            let t = c;
            while (r == null && c) {
                c = c.parent;
                r = _bindedDesktop(c);
            }
            return r;
        }

        // 屏幕大小变化时需要及时更新desktop大小，不然周边会出现空白
        private __dsk_sizechanged(s: Slot) {
            this.frame = StageBounds;
        }

        _initSignals() {
            super._initSignals();
            this._signals.register(SignalHitTest);
            this._signals.register(SignalOpening);
            this._signals.register(SignalClosing);
            this._signals.register(SignalOpen);
            this._signals.register(SignalClose);
        }

        /** 高亮元素，在元素所在的位置镂空背景 */
        _filters = new Array<CComponent>();

        addFilter(ui: CComponent) {
            this._filters.push(ui);
        }

        /** 是否打开高亮穿透的效果
         @note 如果打开，只有filters的部分可以接受touch的事件
         */
        protected _onlyFiltersTouchEnabled: boolean;
        get onlyFiltersTouchEnabled(): boolean {
            return this._onlyFiltersTouchEnabled;
        }

        set onlyFiltersTouchEnabled(val: boolean) {
            this._onlyFiltersTouchEnabled = val;
            this.touchEnabled = !val;
            this.touchChildren = !val;
        }

        // 所有需要被镂空的desktop，用来在点击是过滤掉touch事件
        static _AllNeedFilters = new Array<Desktop>();

        hitTestInFilters(pt: Point): any {
            return ArrayT.QueryObject(this._filters, (ui: CComponent): boolean => {
                let rc = ui.convertRectTo(ui.bounds(), this);
                return rc.containsPoint(pt);
            }, this, null);
        }

        onLoaded() {
            super.onLoaded();
            if (this._contentView)
                this._contentView.updateData();
        }

        private __dsk_addedtostage() {
            // 显示内容页面
            if (this._contentView)
                this.addChild(this._contentView);
        }

        onAppeared() {
            super.onAppeared();

            // 延迟关闭
            if (isZero(this.delayClose) == false) {
                Delay(this.delayClose, () => {
                    this.close();
                });
            }

            this.updateFilters();
        }

        updateFilters() {
            if (this._filters.length == 0)
                return;

            let bkcr = this.backgroundColor;
            let bkimg = this.backgroundImage;
            this.backgroundColor = null;
            this.backgroundImage = null;

            let sp = new DisabledAutolayoutSprite();
            sp.hasHollowOut = true;
            sp.backgroundColor = bkcr;
            sp.backgroundImage = bkimg;
            sp.frame = this.bounds();
            sp.updateLayout();

            this._filters.forEach((ui: CComponent) => {
                let bmp = new DisabledAutolayoutBitmap();
                bmp.frame = ui.convertRectTo(ui.bounds(), this);
                bmp.imageSource = ui.renderToTexture();
                bmp.updateLayout();
                sp.hollowOut(bmp);
            }, this);

            this.backgroundImage = sp.renderToTexture();
        }

        protected _contentView: CComponent;
        get contentView(): CComponent {
            return this._contentView;
        }

        set contentView(val: CComponent) {
            if (this._contentView == val)
                return;
            if (this._contentView) {
                this.removeChild(this._contentView);
                _bindDesktop(this._contentView, null);
            }
            this._contentView = val;
            if (val) {
                _bindDesktop(val, this);

                if (this.onStage)
                    this.__dsk_addedtostage();

                val.signals.register(SignalOpening);
                val.signals.register(SignalClosing);
                val.signals.register(SignalOpen);
                val.signals.register(SignalClose);
            }
        }

        /** 延迟指定时间后关闭
         @note 因为可能open在队列中，如果由业务层处理，则不好把握什么时候当前dialog才打开
         */
        delayClose: number;

        /** 桌面基于的层，默认为 Application.desktopLayer
         @note 业务可以指定desktop是打开在全局，还是打开在指定的ui之内
         */
        desktopLayer: CComponent;

        /** 是否已经打开
         @note 如果open在队列中，则调用open后，当前parent仍然为null，但是逻辑上该dialog算是已经打开，所以需要使用独立的变量来维护打开状态
         */
        protected _isOpened = false;
        get isOpened(): boolean {
            return this._isOpened;
        }

        /** 队列控制时依赖的队列组，业务层设置为自己的队列实例来和标准desktop的队列隔离，避免多重desktop等待时造成业务中弹出的类似如tip的页面在业务dialog后等待的问题 */
        queue = DesktopOperationQueue;
        protected _oper: Operation;

        /** 当在队列中打开时，需要延迟的时间
         @note 同样因为如果打开在队列中，业务层无法很方便的控制打开前等待的时间
         */
        delayOpenInQueue: number;

        /** 打开
         @param queue, 是否放到队列中打开
         */
        open(queue: boolean = false) {
            if (this._isOpened)
                return;
            this._isOpened = true;

            if (queue) {
                this._oper = new DesktopOperation(this);
                this.queue.add(this._oper);
            } else {
                this.doOpen();
            }
        }

        /** 接着其他对象打开 */
        follow(otherContent: CComponent) {
            if (this._isOpened)
                return;
            this._isOpened = true;

            this._oper = new DesktopOperation(this);
            let dsk = _bindedDesktop(otherContent);
            if (dsk._oper == null) {
                this.queue.add(this._oper);
            } else {
                this.queue.follow(dsk._oper, this._oper);
            }
        }

        /** 替换打开 */
        replace(otherContent: CComponent) {
            if (this._isOpened)
                return;
            this._isOpened = true;

            let dsk = _bindedDesktop(otherContent);
            if (dsk._oper == null) {
                dsk.close();
                this.open();
            } else {
                if (dsk.desktopLayer == null)
                    dsk.desktopLayer = this.desktopLayer;
                this._oper = new DesktopOperation(this);
                this.queue.replace(dsk._oper, this._oper);
                dsk.close();
            }
        }

        /** desktop打开的样式
         @note 默认为弹出在desktopLayer，否则为push进desktopLayer
         弹出不会隐藏后面的内容，push将根据对应的viewStack来决定是否背景的内容隐藏
         */
        popupMode: boolean = true;

        // 需要被添加到已经打开的对战中
        _addIntoOpening = true;

        // 当前已经打开的所有desktop的数组
        static _AllOpenings = new Array<Desktop>();

        protected doOpen() {
            if (this.desktopLayer == null)
                this.desktopLayer = CApplication.shared.gameLayer;

            if (this._onlyFiltersTouchEnabled)
                Desktop._AllNeedFilters.push(this);
            if (this._addIntoOpening)
                Desktop._AllOpenings.push(this);

            this.signals.emit(SignalOpening);
            if (this._contentView)
                this._contentView.signals.emit(SignalOpening);

            if (this.popupMode)
                this.desktopLayer.addChild(this);
            else
                (<any>this.desktopLayer).push(this);

            if (this._contentView)
                this._contentView.signals.emit(SignalOpen);
            this.signals.emit(SignalOpen);
        }

        /** 关闭所有正在打开的desktop */
        static CloseAllOpenings() {
            ArrayT.SafeClear(this._AllOpenings, (e: Desktop) => {
                e.close();
            });
        }

        /** 正在打开的desktop */
        static Current(): Desktop {
            return ArrayT.Top(this._AllOpenings);
        }

        /** 关闭 */
        close() {
            if (!this._isOpened)
                return;
            this._isOpened = false;

            // 如过还在等待队列中，需要保护一下状态
            if (this.parent == null) {
                if (this._oper) {
                    this.queue.remove(this._oper);
                    this._oper = null;
                }
                return;
            }

            this.doClose();

            if (this._oper) {
                this._oper.done();
                this._oper = null;
            }
        }

        protected doClose() {
            if (this._onlyFiltersTouchEnabled)
                ArrayT.RemoveObject(Desktop._AllNeedFilters, this);
            if (this._addIntoOpening)
                ArrayT.RemoveObject(Desktop._AllOpenings, this);

            this.signals.emit(SignalClosing);
            if (this._contentView)
                this._contentView.signals.emit(SignalClosing);

            // 保护生命期
            this.grab();
            if (this._contentView)
                this._contentView.grab();

            // popup弹出模式直接作为deskLayer子控件
            if (this.popupMode) {
                this.onDisappeared();
                this.desktopLayer.removeChild(this);
            } else {
                (<any>this.desktopLayer).pop(this);
            }

            if (this._contentView)
                this._contentView.signals.emit(SignalClose);
            this.signals.emit(SignalClose);

            // 释放
            if (this._contentView)
                this._contentView.drop();
            this.drop();
        }

        /** 点击桌面自动关闭 */
        clickedToClose = false;

        private __dsk_clicked() {
            if (!this.clickedToClose)
                return;
            this.close();
        }

        /** 使用自适应来布局内容页面 */
        adaptiveContentFrame = true;

        updateLayout() {
            super.updateLayout();
            if (this._contentView) {
                if (this.adaptiveContentFrame) {
                    let crc = this._contentView.bestFrame();
                    if (crc) {
                        crc.center = this.bounds().center.add(crc.x, crc.y);
                        let cpos = this._contentView.bestPosition();
                        if (cpos)
                            crc.position = cpos;
                        this._contentView.frame = crc;
                    }
                }
            }
        }
    }

    class DesktopOperation extends Operation {
        constructor(desk: Desktop) {
            super();
            this._desktop = desk;
        }

        _desktop: Desktop;

        start() {
            let dsk = <any>this._desktop;
            let d = dsk.delayOpenInQueue;
            if (d) {
                Delay(d, () => {
                    dsk.doOpen();
                });
            } else {
                dsk.doOpen();
            }
        }
    }


}
