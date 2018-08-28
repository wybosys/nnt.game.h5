module nn {

    /** 弹出的对话框类型
     @note 通过返回 bestFrame 来决定对话框的大小 */
    export class Dialog
        extends Component
        implements IPage {
        constructor() {
            super();
            this.anchor = new Point(0.5, 0.5);
        }

        _initSignals() {
            super._initSignals();
            // 请求关闭
            this._signals.register(SignalRequestClose);
            // 其他状态
            this._signals.register(SignalOpening);
            this._signals.register(SignalClosing);
            this._signals.register(SignalOpen);
            this._signals.register(SignalClose);
        }

        dispose() {
            super.dispose();
            SetT.Clear(this._filters);
        }

        /** 获得视图隶属的dialog对象 */
        static FromView(cv: CComponent): Dialog {
            return <any>findParentByType(cv, Dialog);
        }

        /** 路径标记 */
        pathKey: string;

        // 最终转由desktop处理
        _filters = new CSet<CComponent>();

        addFilter(ui: CComponent) {
            this._filters.add(ui);
        }

        onAppeared() {
            super.onAppeared();
            if (ISDEBUG)
                info(Classname(this) + ' 显示');
        }

        onDisappeared() {
            super.onDisappeared();
            if (ISDEBUG)
                info(Classname(this) + ' 消失');
        }

        /** 是否让只有镂空的地方才能触摸 */
        onlyFiltersTouchEnabled: boolean;

        /** 延迟自动关闭 */
        delayClose: number;

        /** 在队列中延迟打开 */
        delayOpenInQueue: number;

        /** 依赖的队列 */
        queue: OperationQueue;

        /** 弹出的模式 */
        popupMode: boolean = true;

        /** 弹出依赖的层 */
        desktopLayer: CComponent;

        private _clickedToClose: boolean = false;
        get clickedToClose(): boolean {
            return this._clickedToClose;
        }

        set clickedToClose(b: boolean) {
            if (this._clickedToClose == b)
                return;
            let dsk = Desktop.FromView(this);
            if (dsk)
                dsk.clickedToClose = b;
            this._clickedToClose = b;
        }

        protected instanceDesktop(): Desktop {
            let dsk = new Desktop(this);
            dsk.onlyFiltersTouchEnabled = this.onlyFiltersTouchEnabled;
            dsk.delayClose = this.delayClose;
            dsk.delayOpenInQueue = this.delayOpenInQueue;
            dsk.clickedToClose = this.clickedToClose;
            dsk.popupMode = this.popupMode;
            dsk.desktopLayer = this.desktopLayer;
            if (this.queue)
                dsk.queue = this.queue;
            this.signals.connect(SignalRequestClose, dsk.close, dsk);
            this._filters.forEach((o: any) => {
                dsk.addFilter(o);
            });
            return dsk;
        }

        /** 替换掉队列中对应的的dialog */
        replace(link: CComponent): Desktop {
            let dsk = this.instanceDesktop();
            dsk.replace(link);
            return dsk;
        }

        /** 打开
         @param queue, 是否放到队列中打开，默认为 false
         */
        open(queue: boolean = false): Desktop {
            let dsk = this.instanceDesktop();
            dsk.open(queue);
            return dsk;
        }

        /** 打开在队列中的指定dialog之后 */
        follow(link: CComponent): Desktop {
            let dsk = this.instanceDesktop();
            dsk.follow(link);
            return dsk;
        }

        /** 关闭 */
        close() {
            this.signals.emit(SignalRequestClose);
        }

        /** 默认为0尺寸 */
        bestFrame(): Rect {
            return new Rect();
        }

        /** 默认的位置，返回null代表使用对bestFrame进行偏移 */
        bestPosition(): Point {
            return null;
        }
    }

}
