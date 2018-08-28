module nn {

    export class Tips extends Sprite {
        constructor() {
            super();
            this.identifier.anchor = Point.AnchorCC;
            this.identifier.frame = new Rect(0, 0, 50, 50);
            this.addChild(this.identifier);
        }

        dispose() {
            super.dispose();
            this._target = undefined;
            this._base = undefined;
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalRequestClose);
        }

        /** 尖头 */
        identifier = new Bitmap();

        private _target: CComponent;
        /** 指向的目标 */
        get target(): CComponent {
            return this._target;
        }

        /** 延迟自动关闭 */
        delayClose: number;

        private _base: CComponent;

        onAppeared() {
            super.onAppeared();
            this._layoutTips();
        }

        /** 作为子控件来显示 */
        showTo(target: CComponent, parent?: CComponent) {
            this._target = target;
            if (parent == null)
                parent = target.parent;
            this._base = parent;
            this.signals.connect(SignalRequestClose, this.removeFromParent, this);
            parent.addChild(this, false);

            if (isZero(this.delayClose) == false)
                Delay(this.delayClose, () => {
                    this._base = null;
                    this.removeFromParent();
                }, this);
        }

        protected instanceDesktop(): Desktop {
            let dsk = new Desktop();
            dsk.adaptiveContentFrame = false;
            dsk.clickedToClose = true;
            dsk.onlyFiltersTouchEnabled = true;
            dsk.delayClose = this.delayClose;
            return dsk;
        }

        /** 作为弹出来显示 */
        popupTo(target: CComponent, autoopen = true): Desktop {
            this._target = target;
            let dsk = this.instanceDesktop();
            dsk.contentView = this;
            dsk.addFilter(target);
            this.signals.connect(SignalRequestClose, dsk.close, dsk);
            this._base = dsk;
            if (autoopen)
                dsk.open();
            return dsk;
        }

        close() {
            this.signals.emit(SignalRequestClose);
        }

        protected _layoutTips() {
            let rc = this._base.bounds();
            let bst = this.bestFrame();
            let trc = this._target.convertRectTo(this._target.bounds(), this._base);
            let idrc = this.identifier.frame;

            let d: Direction;
            if (trc.maxX + idrc.width + bst.width < rc.maxX) {
                d = Direction.RIGHT;
                this.identifier.rotation = Angle.ANGLE(-90);
                this.identifier.scale = new Point(-1, 1);

                let pt = trc.rightCenter;

                bst.x = trc.maxX + idrc.width;
                bst.y = pt.y - bst.height / 2;
                if (bst.maxX > rc.maxX)
                    bst.maxX = rc.maxX;
                else if (bst.minX < rc.minX)
                    bst.minX = rc.minX;
                if (bst.maxY > rc.maxY)
                    bst.maxY = rc.maxY;
                else if (bst.minY < rc.minY)
                    bst.minY = rc.minY;

                idrc.x = -idrc.width;
                idrc.y = (bst.height - idrc.height) / 2;

                let tarc = new Rect(trc.x - bst.x, trc.y - bst.y, trc.width, trc.height);
                if (idrc.maxY > tarc.maxY)
                    idrc.maxY = tarc.maxY;
                else if (idrc.minY < tarc.minY)
                    idrc.minY = tarc.minY;
            }
            else if (trc.y - idrc.height - bst.height > rc.y) {
                d = Direction.UP;
                this.identifier.rotation = Angle.ANGLE(180);

                let pt = trc.topCenter;

                bst.x = pt.x - bst.width / 2;
                bst.y = trc.y - idrc.height - bst.height;
                if (bst.maxX > rc.maxX)
                    bst.maxX = rc.maxX;
                else if (bst.minX < rc.minX)
                    bst.minX = rc.minX;
                if (bst.maxY > rc.maxY)
                    bst.maxY = rc.maxY;
                else if (bst.minY < rc.minY)
                    bst.minY = rc.minY;

                idrc.x = (bst.width - idrc.width) / 2;
                idrc.y = bst.height;

                let tarc = new Rect(trc.x - bst.x, trc.y - bst.y, trc.width, trc.height);
                if (idrc.maxX > tarc.maxX)
                    idrc.maxX = tarc.maxX;
                else if (idrc.minX < tarc.minX)
                    idrc.minX = tarc.minX;
            }
            else if (trc.x - idrc.width - bst.width > rc.x) {
                d = Direction.LEFT;
                this.identifier.rotation = Angle.ANGLE(90);

                let pt = trc.leftCenter;

                bst.x = trc.x - idrc.width - bst.width;
                bst.y = pt.y - bst.height / 2;
                if (bst.maxX > rc.maxX)
                    bst.maxX = rc.maxX;
                else if (bst.minX < rc.minX)
                    bst.minX = rc.minX;
                if (bst.maxY > rc.maxY)
                    bst.maxY = rc.maxY;
                else if (bst.minY < rc.minY)
                    bst.minY = rc.minY;

                idrc.x = bst.width;
                idrc.y = (bst.height - idrc.height) / 2;

                let tarc = new Rect(trc.x - bst.x, trc.y - bst.y, trc.width, trc.height);
                if (idrc.maxY > tarc.maxY)
                    idrc.maxY = tarc.maxY;
                else if (idrc.minY < tarc.minY)
                    idrc.minY = tarc.minY;
            }
            else {
                d = Direction.DOWN;
                this.identifier.rotation = Angle.ANGLE(0);

                let pt = trc.topCenter;

                bst.x = pt.x - bst.width / 2;
                bst.y = trc.y + idrc.height;
                if (bst.maxX > rc.maxX)
                    bst.maxX = rc.maxX;
                else if (bst.minX < rc.minX)
                    bst.minX = rc.minX;
                if (bst.maxY > rc.maxY)
                    bst.maxY = rc.maxY;
                else if (bst.minY < rc.minY)
                    bst.minY = rc.minY;

                idrc.x = (bst.width - idrc.width) / 2;
                idrc.y = -idrc.height;

                let tarc = new Rect(trc.x - bst.x, trc.y - bst.y, trc.width, trc.height);
                if (idrc.maxX > tarc.maxX)
                    idrc.maxX = tarc.maxX;
                else if (idrc.minX < tarc.minX)
                    idrc.minX = tarc.minX;
            }

            this.frame = bst;
            this.identifier.frame = idrc;
        }
    }

}