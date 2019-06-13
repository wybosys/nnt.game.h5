module nn {

    export interface ICollectionDataSource {
        /** 元素总数目 */
        numberOfItems(): number;

        /** 元素的类型 */
        classForItem(idx: number): any;

        /** 空白元素的类型 */
        classForNullItem(): any;

        /** 更新元素 */
        updateItem(item: CComponent, idx: number);

        /** 更新空元素 */
        updateNullItem(item: CComponent);
    }

    export abstract class CollectionView
        extends Sprite
        implements ICollectionDataSource {
        constructor() {
            super();
            this.dataSource = this;
        }

        /** 数据源 */
        dataSource: ICollectionDataSource;

        /** 元素的默认类型 */
        itemClass: any = Sprite;

        numberOfItems(): number {
            return 0;
        }

        classForItem(idx: number): any {
            return this.itemClass;
        }

        classForNullItem(): any {
            return this.nullItemClass;
        }

        updateItem(item: CComponent, idx: number) {
        }

        updateNullItem(item: CComponent) {
        }

        /** 空余元素 */
        nullItemClass: any = Sprite;

        /** 重新加载数据 */
        abstract reloadData();

        /** 弹出一个元素 */
        protected popUsedItem() {
        }

        /** 拿出一个元素 */
        protected useItem(...p: any[]): CComponent {
            return null;
        }

        /** 放回去一个元素 */
        protected unuseItem(item: CComponent) {
        }

        updateLayout() {
            super.updateLayout();
            this.reloadData();
        }
    }

    /** 类似于iTunes Coverflow的效果 */
    export abstract class CoverFlowView
        extends CollectionView {
        constructor() {
            super();
            this.signals.connect(SignalTouchBegin, this._cv_touch_begin, this);
            this.signals.connect(SignalTouchMove, this._cv_touch_move, this);
            this.signals.connect(SignalTouchEnd, this._cv_touch_end, this);
        }

        dispose() {
            super.dispose();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalSelectionChanged);
        }

        /** 最多屏幕上出现的个数 */
        maxItemsOnScreen: number = -1;

        /** 选中那个 */
        selection: number = 0;

        /** 触发器的尺寸 */
        thresholdSize: Size;

        /** 自动停靠
         @note 交互一办抬起手指后，是否自动对齐
         */
        autoDock: boolean = true;

        reloadData() {
            let self = this;
            self.clear();
            self._allItems = self.numberOfItems();

            // cnt 必须为max和cnt中最小的，初始时，0号应该位于第一个
            let all: number = 0;
            if (self.maxItemsOnScreen == -1) {
                self._nullItems = Math.floor(self._allItems / 2);
                all = self._allItems - self.selection;
            } else {
                self._nullItems = Math.floor(self.maxItemsOnScreen / 2);
                all = self.maxItemsOnScreen;
            }

            // 当前最小的id
            self._minIndex = self.selection - self._nullItems;

            // 初始化，需要处理好几种不同的情况
            let clsnull = self.dataSource.classForNullItem();
            for (let i = 0; i < all; ++i) {
                let idx = self._minIndex + i;
                let cls: any;
                if (idx < 0) {
                    cls = clsnull;
                } else if (idx >= self._allItems) {
                    cls = clsnull;
                } else {
                    cls = self.dataSource.classForItem(idx);
                }

                let item = self.useItem(cls, true);
                item.visible = true;
            }

            // 更新
            self._updateItems(true);

            // 抛出默认的选中信号
            let now = self._usedItems[self._nullItems];
            now.signals.emit(SignalSelected);
            self.signals.emit(SignalSelectionChanged, {now: now});
        }

        protected popUsedItem(idx?: number) {
            let self = this;
            if (self._usedItems.length == 0)
                return;
            if (idx == null)
                idx = self._usedItems.length - 1;
            let item = this._usedItems[idx];
            this.unuseItem(item);
        }

        protected clear() {
            let self = this;
            nn.ArrayT.Clear(self._usedItems, (item: CComponent) => {
                item.visible = false;
                this._reuseItems.unuse(Classname(item), item);
            });
        }

        protected useItem(cls: any, end: boolean): CComponent {
            let idr = Classname(cls);
            let item = this._reuseItems.use(idr, null, [cls]);
            if (end)
                this._usedItems.push(item);
            else
                nn.ArrayT.InsertObjectAtIndex(this._usedItems, item, 0);
            return item;
        }

        protected unuseItem(item: CComponent) {
            this._reuseItems.unuse(Classname(item), item);
            nn.ArrayT.RemoveObject(this._usedItems, item);
        }

        /** 根据位置更新尺寸 */
        updateItemSize(item: CComponent, idx: number, pos: number) {
        }

        /** 一次性刷新所有尺寸 */
        updateItemsSize(items: Array<CComponent>, idx: number) {
        }

        /** 打开下一个 */
        gotoNext(): boolean {
            let self = this;
            let tgtid = self._minIndex + self._usedItems.length;

            // 提供null的支持，所以需要把null参与计算
            if (tgtid >= this._allItems + this._nullItems)
                return false;

            // 踢掉第一个
            self.popUsedItem(0);

            // 加上最后一个
            let cls = tgtid >= this._allItems ? this.dataSource.classForNullItem() : this.dataSource.classForItem(tgtid);
            let item = this.useItem(cls, true);
            item.visible = true;

            // 调整下min序号
            ++self._minIndex;
            self.selection = self._minIndex + self._nullItems;

            // 从当前位置继续滑动，而不是重新开始
            this._startPos.copy(this.touch.currentPosition);
            this.offsetPos.reset();
            this._updateItems(true);

            // 发送信号
            let old = self._usedItems[self._nullItems - 1];
            let now = self._usedItems[self._nullItems];
            self.signals.emit(SignalSelectionChanged, {now: now, old: old});
            now.signals.emit(SignalSelected);
            old.signals.emit(SignalDeselected);
            return true;
        }

        /** 打开上一个 */
        gotoPrevious(): boolean {
            let self = this;
            let tgtid = self._minIndex - 1;

            // 提供对null的支持
            if (tgtid < -self._nullItems)
                return false;

            // 踢掉最后一个
            self.popUsedItem();

            // 加上前一个，如过请求的是null，则取null的类型
            let cls = tgtid < 0 ? this.dataSource.classForNullItem() : this.dataSource.classForItem(tgtid);
            let item = this.useItem(cls, true);
            item.visible = true;

            // 调整下min序号
            --self._minIndex;
            self.selection = self._minIndex + self._nullItems;

            this._startPos.copy(this.touch.currentPosition);
            this.offsetPos.reset();
            this._updateItems(true);

            let old = self._usedItems[self._nullItems + 1];
            let now = self._usedItems[self._nullItems];
            self.signals.emit(SignalSelectionChanged, {now: now, old: old});
            now.signals.emit(SignalSelected);
            old.signals.emit(SignalDeselected);
            return true;
        }

        /** 用来测试能否运行goto，如果是false那么touch将被跳掉 */
        canGoto(): boolean {
            let self = this;
            if (self.thresholdSize) {
                // 如过设置了触发器大小，则在底层自动核算是否需要滚向下一个
                if (self.thresholdSize.width > 0) {
                    // 如果已经是第一个，则不能往前翻页
                    if (self.offsetPos.x > 0) {
                        if (self._minIndex == -self._nullItems)
                            return false;
                        return true;
                    } else if (self.offsetPos.x < 0) {
                        if (self._allItems - 1 == self._minIndex + self._nullItems)
                            return false;
                        return true;
                    }
                } else {
                    if (self.offsetPos.y > 0) {
                        if (self._minIndex == -self._nullItems)
                            return false;
                        return true;
                    } else if (self.offsetPos.y < 0) {
                        if (self._allItems - 1 == self._minIndex + self._nullItems)
                            return false;
                        return true;
                    }
                }
            }
            return true;
        }

        protected _updateItems(updateData: boolean) {
            let self = this;

            // 挨个更新
            self._usedItems.forEach((item: CComponent, i: number) => {
                let idx = self._minIndex + i;

                // 跳过空白的
                if (idx < 0) {
                    if (updateData) {
                        self.updateNullItem(item);
                        item.updateData();
                    }
                    return;
                }

                // 刷新数据
                if (updateData) {
                    self.updateItem(item, idx);
                    item.updateData();
                }

                // 刷新尺寸
                self.updateItemSize(item, idx, i);
            });

            // 一次刷新所有尺寸
            if (self.thresholdSize) {
                // 如过设置了触发器大小，则在底层自动核算是否需要滚向下一个
                if (self.thresholdSize.width > 0) {
                    let thred = self.thresholdSize.width / 2;
                    if (self.offsetPos.x >= thred) {
                        if (this.gotoPrevious())
                            return;
                    } else if (self.offsetPos.x <= -thred) {
                        if (this.gotoNext())
                            return;
                    }
                } else {
                    let thred = self.thresholdSize.height / 2;
                    if (self.offsetPos.y >= thred) {
                        if (this.gotoPrevious())
                            return;
                    } else if (self.offsetPos.y <= -thred) {
                        if (this.gotoNext())
                            return;
                    }
                }
            }
            this.updateItemsSize(this._usedItems, this._minIndex);
        }

        protected instanceItem(cls: any): any {
            let item = new cls();

            // 注册几个动信号
            item.signals.register(SignalSelected);
            item.signals.register(SignalDeselected);

            this.addChild(item);
            return item;
        }

        private _minIndex: number = 0;
        private _allItems: number = 0;
        private _nullItems: number = 0;
        private _usedItems = new Array<CComponent>();
        private _reuseItems = new SimpleReusesPool(this.instanceItem, this);

        // 动态的偏移位置，拖动的交互依赖
        offsetPos = new Point();
        private _startPos = new Point();

        private _cv_touch_begin() {
            this._startPos.copy(this.touch.startPosition);
        }

        private _cv_touch_move() {
            let cur = this.touch.currentPosition;
            this.offsetPos.reset(cur.x - this._startPos.x,
                cur.y - this._startPos.y);
            if (this.canGoto())
                this._updateItems(false);
        }

        private _cv_touch_end() {
            let self = this;
            if (self.offsetPos.x == 0 && self.offsetPos.y == 0)
                return;

            if (self.autoDock) {
                let thrd = 0;
                if (self.thresholdSize) {
                    let done: boolean = false;
                    if (self.thresholdSize.width > 0) {
                        let thd = self.thresholdSize.width / 2;
                        if (self.offsetPos.x > thd) {
                            done = self.gotoPrevious();
                        } else if (self.offsetPos.x < -thd) {
                            done = self.gotoNext();
                        }
                    } else {
                        let thd = self.thresholdSize.height / 2;
                        if (self.offsetPos.y > thd) {
                            done = self.gotoPrevious();
                        } else if (self.offsetPos.y < -thd) {
                            done = self.gotoNext();
                        }
                    }
                    if (done == false) {
                        self.offsetPos.reset();
                        self._updateItems(true);
                        return;
                    }
                }
            }

            self.offsetPos.reset();
        }
    }

}