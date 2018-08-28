module nn {

    export interface ITableDataSource
    {
        /** 多少行 */
        numberOfRows():number;

        /** 对应行的类型 */
        classForRow(row:number):any;

        /** 行高 */
        heightForRow(row:number):number;

        /** 设置该行 */
        updateRow(item:any, cell:TableViewCell, row:number);
    }

    /** 对于可以调整高度，或者存在 ui 和 data 重入的问题，通过这个参数来分别判断是 UI 过程还是 DATA 过程
     * @brief 例如在 tableview 中应用时，如果是变高，则 updateData 会重入2次，一次是 UI 过程(粗布局)，一次是 DATA 过程(刷数据显示)，之后就可以拿到实高，但是 updateData 里面会有例如设置图片的操作，而这些操作仅需要在 UI 过程中被调用，所以可以通过该变量区分开
     */
    export let DATAUPDATE:boolean = true;

    export class TableViewCell
    extends Sprite
    {
        constructor() {
            super();
        }

        static FromItem(cv:CComponent):TableViewCell {
            return <any>findParentByType(cv, TableViewCell);
        }

        _item:any;
        set item(item:any) {
            if (this._item == item)
                return;
            if (this._item)
                this.removeChild(this._item);
            this._item = item;
            if (this._item)
                this.addChild(this._item);
        }
        get item():any {
            return this._item;
        }
        
        updateData() {
            super.updateData();
            if (this._item && this._item.updateData)
                this._item.updateData();
        }

        updateLayout() {
            super.updateLayout();
            if (this._item)
                this._item.frame = this.boundsForLayout();
        }

        _row:number;
        get row():number {
            return this._row;
        }
        set row(v:number) {
            warn("不能直接设置cell的行号");
        }
    }    

    export class TableViewContent
    extends ScrollView
    {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalItemChanged);
        }

        dispose() {
            this.dataSource = undefined;
            nn.ArrayT.Clear(this._unusedCells, (o:TableViewCell)=>{
                drop(o);
            }, this);
            nn.MapT.Clear(this._reuseItems, (k:any, o:any[])=>{
                // 位于待复用的 item 的销毁
                nn.ArrayT.Clear(o, (o:any)=>{
                    drop(o);
                }, this);
            }, this);
            super.dispose();
        }

        /** 是否支持重用的模式 
            @note 关闭重用的好处：固定列表的大小，不需要考虑item重入的问题
        */
        reuseMode:boolean = true;

        /** 默认的的行显示类型 */
        rowClass:any;

        /** 默认的cell类型 */
        cellClass = TableViewCell;

        /** 默认的行高 */
        rowHeight:number;

        /** 是否横向 */
        horizonMode:boolean;

        /** 数据代理 */
        dataSource:ITableDataSource;

        /** 间距 */
        spacing:number = 0;

        // 如果尺寸有变化，需要调整单元格的位置
        updateLayout() {
            super.updateLayout();
            // 尺寸变化会导致变高情况下单元格高度变化
            // 如果添加了辅助控件，也需要重新刷一下当前布局
            this.reloadData();
        }

        _headerEdgeInsets:EdgeInsets;
        get headerEdgeInsets():EdgeInsets {
            return this._headerEdgeInsets;
        }
        set headerEdgeInsets(ei:EdgeInsets) {
            this._headerEdgeInsets = ei;
            this._updateEdgeInsets();
        }
        
        _footerEdgeInsets:EdgeInsets;
        get footerEdgeInsets():EdgeInsets {
            return this._footerEdgeInsets;
        }
        set footerEdgeInsets(ei:EdgeInsets) {
            this._footerEdgeInsets = ei;
            this._updateEdgeInsets();
        }
        
        _additionEdgeInsets:EdgeInsets;
        get additionEdgeInsets():EdgeInsets {
            return this._additionEdgeInsets;
        }
        set additionEdgeInsets(ei:EdgeInsets) {
            this._additionEdgeInsets = ei;
            this._updateEdgeInsets();
        }
        
        _topIdentifierEdgeInsets:EdgeInsets;
        get topIdentifierEdgeInsets():EdgeInsets {
            return this._topIdentifierEdgeInsets;
        }
        set topIdentifierEdgeInsets(ei:EdgeInsets) {
            this._topIdentifierEdgeInsets = ei;
            this._updateEdgeInsets();
        }
        
        _bottomIdentifierEdgeInsets:EdgeInsets;
        get bottomIdentifierEdgeInsets():EdgeInsets {
            return this._bottomIdentifierEdgeInsets;
        }
        set bottomIdentifierEdgeInsets(ei:EdgeInsets) {
            this._bottomIdentifierEdgeInsets = ei;
            this._updateEdgeInsets();
        }

        protected _updateEdgeInsets() {
            let ei = new EdgeInsets();
            ei.addEdgeInsets(this._headerEdgeInsets);
            ei.addEdgeInsets(this._footerEdgeInsets);
            ei.addEdgeInsets(this._additionEdgeInsets);
            ei.addEdgeInsets(this._topIdentifierEdgeInsets);
            ei.addEdgeInsets(this._bottomIdentifierEdgeInsets);
            this.contentEdgeInsets = ei;
        }

        clear() {
            // 滚动到最前面
            this.stopDecelerating();
            if (this.horizonMode)
                this.setContentOffsetX(0, 0);
            else
                this.setContentOffsetY(0, 0);

            // 去除掉所有cell
            if (this.reuseMode == false) {
                nn.ArrayT.Clear(this._usedCells, (cell:TableViewCell)=>{
                    this.removeChild(cell);
                }, this);
                return;
            }

            nn.ArrayT.Clear(this._usedCells, (cell:TableViewCell)=>{
                let cv = cell.item;
                this.addOneReuseItem(cv);
                cell.item = null;
                cell.visible = false;
                cell._row = undefined;
                this._unusedCells.push(cell);
            }, this);
        }
        
        // 重新加载单元格
        reloadData() {
            // 所有的行数，如果是固定高度，则直接结算处总高，否则需要计算合计的高度
            let rows:number = this.dataSource.numberOfRows();
            // 如果当前的行数比之前的小，所以需要pop掉不用的
            if (rows < this._usedCells.length) {
                for (let i = this._usedCells.length - rows; i > 0; --i)
                    this.popUsedCell();
            }
            
            // 刷新每一行的高度
            // 取得每一行的高度和总高
            let height = 0;

            DATAUPDATE = false;
            // 初始化一个用来计算高度的 cell
            let cell = this.useCell(undefined);

            // 设置每一个最初的大小
            let cntrc = this.boundsForContent();
            if (this.horizonMode)
                cell.frame = new Rect(0, 0, 0, cntrc.height);
            else
                cell.frame = new Rect(0, 0, cntrc.width, 0);

            // 统计总高
            for (let i = 0; i < rows; ++i) {
                // 取得内部元素的类型
                let cls = this.dataSource.classForRow(i);

                // 如果支持变高，则从 best 里面取值
                let h = 0;
                if (MethodIsOverrided(cls, 'bestFrame'))
                {
                    // 需要使用业务对象来计算真实高度
                    let item = this.getOneReuseItem(cls);
                    
                    // 绑定到 cell->更新大小，使用_item的原因是不是真正的加入渲染书，只是为了让布局、数据刷新生效，才可以计算出期望的大小
                    cell._item = item;
                    
                    // 刷新下数据
                    this.updateRow(item, cell, i);
                    // 直接布局基础控件
                    cell.updateLayout();
                    
                    // 基于基础布局估计总高
                    let rc = item.bestFrame();
                    if (this.horizonMode)
                        h = rc.width;
                    else
                        h = rc.height;

                    // 放回去临时用的item
                    cell._item = null;
                    this.addOneReuseItem(item);
                }
                else
                {
                    h = this.dataSource.heightForRow(i);
                }
                h += this.spacing;

                // 缓存一下，以后就不重新计算
                this._rowHeights[i] = h;
                height += h;
            }
            // 完成计算任务，临时的cell变成等待重用
            this.unuseCell(cell);
            DATAUPDATE = true;

            // 设置table的总高度
            let cntSz = this.contentSize;
            if (this.horizonMode) {
                cntSz.width = height;
                cntSz.height = cntrc.height;
            } else {
                cntSz.height = height;
                cntSz.width = cntrc.width;
            }
            this.contentSize = cntSz;

            // 刷新当前位置对应的表格组
            this._updateValidCells(true);

            // 刷新辅助的视图(例如表头)
            this._layoutViews();
        }

        // 增加一个重用的内部元素
        protected addOneReuseItem(item:any) {
            let idr = Classname(item);
            let items = this._reuseItems[idr];
            if (items == null) {
                items = new Array<any>();
                this._reuseItems[idr] = items;
            }
            items.push(item);

            // 存在复用关系，一般addOneReuseItem的下一步就是把cell.item = null，所以需要保护一下item，避免当从cell中remove后被析构
            grab(item);
        }

        // 获得一个重用的内部元素
        protected getOneReuseItem(type:any):any {
            let idr = Classname(type);
            let items = this._reuseItems[idr];
            if (!items || items.length == 0) {
                return this.instanceItem(type);
            }
            return items.pop();
        }

        protected instanceItem(type:any):any {
            let item = new type();
            item.signals.connect(SignalConstriantChanged, this._updateConstriant, this);
            return item;
        }

        /** 查找指定的单元格 */
        findCell(row?:number):TableViewCell {
            return nn.ArrayT.QueryObject(this._usedCells, (c):boolean=>{
                if (row !== undefined && row != c._row)
                    return false;
                return true;
            }, this, null);
        }

        /** 滚动到指定单元格 */
        scrollToCell(idx:number, duration:number = CAnimate.Duration, edge:EDGE = EDGE.START) {
            let pos = 0;
            let atid = Math.min(this._rowHeights.length, idx);
            for (let i = 0; i < atid; ++i) {
                pos += this._rowHeights[i];
            }
            // 偏移edge
            if (edge == EDGE.MIDDLE) {
                let add = this._rowHeights[idx + 1];
                if (add != null)
                    pos += add / 2;
            } else if (edge == EDGE.END) {
                let add = this._rowHeights[idx + 1];
                if (add != null)
                    pos += add;
            }
            this.scrollToPos(pos, duration);
        }

        /** 滚动到指定位置 */
        scrollToPos(pos:number, duration:number = CAnimate.Duration) {
            if (this.contentEdgeInsets)
                pos += this.contentEdgeInsets.top;
            if (this.horizonMode)
                this.setContentOffsetX(pos, duration);
            else
                this.setContentOffsetY(pos, duration);
        }

        /** 获取所有可见的单元格 */
        get visibledCells():Array<TableViewCell> {
            // 按照row排序
            return this._usedCells.sort((l:TableViewCell, r:TableViewCell):number=>{
                return l.row - r.row;
            });
        }

        // 获取一个 cell
        protected useCell(row:number):TableViewCell {
            let cell:TableViewCell;
            if (this._unusedCells.length)
            {
                cell = this._unusedCells.pop();
            }
            else
            {
                cell = new this.cellClass();
                if (this.spacing) {
                    cell.getEdgeInsets().bottom = this.spacing;
                }
                this.addChild(cell);
            }
            this._usedCells.push(cell);
            cell._row = row;
            cell.visible = row != undefined;
            return cell;
        }

        // 压出一个 cell
        protected unuseCell(cell:TableViewCell) {
            if (this.reuseMode == false) {
                nn.ArrayT.RemoveObject(this._usedCells, cell);
                this.removeChild(cell);
                return;
            }
            
            let cv = cell.item;
            if (cv) {
                this.addOneReuseItem(cv);
                cell.item = null;
            }                
            cell.visible = false;
            cell._row = undefined;

            nn.ArrayT.RemoveObject(this._usedCells, cell);
            this._unusedCells.push(cell);
        }

        protected popUsedCell() {
            let cell = this._usedCells.pop();
            if (this.reuseMode == false) {
                nn.ArrayT.RemoveObject(this._usedCells, cell);
                this.removeChild(cell);
                return;
            }
            
            let cv = cell.item;
            if (cv) {
                this.addOneReuseItem(cv);
                cell.item = null;
            }                
            cell.visible = false;
            cell._row = undefined;
            
            this._unusedCells.push(cell);            
        }

        protected updateRow(item:any, cell:TableViewCell, row:number) {
            if (DEBUG) {
                try {
                    this.dataSource.updateRow(item, cell, row);
                    cell.updateData();
                } catch (ex) {
                    exception(ex);
                }
                return;
            }

            this.dataSource.updateRow(item, cell, row);
            cell.updateData();
        }

        protected _updateConstriant(s:Slot) {
            let item = s.sender;
            let cell = TableViewCell.FromItem(item);
            if (cell == null) {
                // 第一步先实现只调整已经显示的单元格大小
                return;
            }

            let row = cell.row;
            let rc = item.bestFrame();
            let h:number;
            if (this.horizonMode)
                h = rc.width;
            else
                h = rc.height;
            // 记录差值，需要修改一下contentSize
            let dh = h - this._rowHeights[row];
            if (dh == 0)
                return;
            
            let cntSz = this.contentSize;
            if (this.horizonMode)
                cntSz.width += dh;
            else
                cntSz.height += dh;
            this.contentSize = cntSz;

            // 刷新下单元格的位置
            this._rowHeights[row] = h;
            this._updateValidCells(false);
            // updateValidCells不会尝试修改已经显示的cell的大小，所以需要手动调整
            cell.setHeight(h);

            // 更新辅助元素位置
            this._layoutViews();
        }

        protected _updateValidCells(update) {
            let cntrc = this.boundsForContent();
            let rows:number = this.dataSource.numberOfRows();
            let regrc = this.regionBounds;

            let pos = 0;
            let itemchanged = 0;
            for (let i = 0; i < rows; ++i) {
                let h:number = this._rowHeights[i];
                if (h == undefined)
                    return;
                
                let cell = this.findCell(i);                
                if (this.horizonMode) {
                    if (Range.Intersects(regrc.x, regrc.width, pos, h) == false) {
                        if (cell) {
                            ++itemchanged;
                            this.unuseCell(cell);
                        }
                        pos += h;
                        continue;
                    }
                } else {
                    if (Range.Intersects(regrc.y, regrc.height, pos, h) == false) {
                        if (cell) {
                            ++itemchanged;
                            this.unuseCell(cell);
                        }
                        pos += h;
                        continue;
                    }
                }

                // 已经位于显示的状态
                if (cell) {
                    if (this.horizonMode)
                        cell.setX(pos);
                    else
                        cell.setY(pos);
                    pos += h;
                    
                    // 已经显示的cell要更新下长度
                    if (this.horizonMode)
                        cell.setHeight(cntrc.height);
                    else
                        cell.setWidth(cntrc.width);

                    if (update) {
                        // 刷新行数据                    
                        this.updateRow(cell.item, cell, i);
                    }
                    
                    continue;
                }

                // 新建一个单元格
                cell = this.useCell(i);
                let cls = this.dataSource.classForRow(i);
                let item = this.getOneReuseItem(cls);
                cell.item = item;
                ++itemchanged;

                // 刷新行数据
                this.updateRow(cell.item, cell, i);

                // 调整 cell 的大小
                item.frame = Rect.Zero;
                cell.frame = Rect.Zero;
                if (this.horizonMode)
                    cell.frame = new Rect(pos, 0, h, cntrc.height);
                else
                    cell.frame = new Rect(0, pos, cntrc.width, h);
                
                pos += h;
            }
            
            if (itemchanged)
                this._signals && this._signals.emit(SignalItemChanged);
        }

        // 所有正在使用的和在缓存队列中的单元格
        private _usedCells = new Array<TableViewCell>();
        private _unusedCells = new Array<TableViewCell>();
        // 单元格高度的查找表, index => height
        private _rowHeights = new Array<number>();
        // 重用的元素列表, idr => [ItemView]
        private _reuseItems = new KvObject<any, Array<any> >();
        
        // 移动后需要计算一下当前需要显示的单元格
        onPositionChanged() {
            super.onPositionChanged();
            this._updateValidCells(false);
        }

        /** 表头 */
        protected _headerView:Component;
        get headerView():Component {
            return this._headerView;
        }
        set headerView(v:Component) {
            if (v == this._headerView)
                return;
            if (this._headerView)
                this._scrollContent.removeChild(this._headerView);
            this._headerView = v;
            if (v)
            {
                let vrc = v.frame;
                if (this.horizonMode)
                {
                    if (vrc.width == 0 && (<any>v).bestFrame) {
                        vrc = (<any>v).bestFrame();                    
                    }                    
                    this.headerEdgeInsets = new EdgeInsets(0, 0, vrc.width, 0);
                }
                else
                {
                    if (vrc.height == 0 && (<any>v).bestFrame) {
                        vrc = (<any>v).bestFrame();                    
                    }
                    this.headerEdgeInsets = new EdgeInsets(vrc.height, 0, 0, 0);
                }
                this._scrollContent.addChild(v);
            }
            else
            {
                this.headerEdgeInsets = null;
            }
        }

        /** 表尾 */
        protected _footerView:Component;
        get footerView():Component {
            return this._footerView;
        }
        set footerView(v:Component) {
            if (v == this._footerView)
                return;
            if (this._footerView)
                this._scrollContent.removeChild(this._footerView);
            this._footerView = v;
            if (v)
            {
                let vrc = v.frame;
                if (this.horizonMode)
                {
                    if (vrc.width == 0 && (<any>v).bestFrame) {
                        vrc = (<any>v).bestFrame();                    
                    }                    
                    this.footerEdgeInsets = new EdgeInsets(0, 0, 0, vrc.width);
                }
                else
                {
                    if (vrc.height == 0 && (<any>v).bestFrame) {
                        vrc = (<any>v).bestFrame();                    
                    }
                    this.footerEdgeInsets = new EdgeInsets(0, vrc.height, 0, 0);
                }
                this._scrollContent.addChild(v);
            }
            else
            {
                this.footerEdgeInsets = null;
            }            
        }

        protected _layoutViews() {
            let cntrc = this.boundsForContent();
            // 排列表头等其他 ui 元素
            if (this._headerView) {
                let rc:Rect;
                if (this.horizonMode)
                {
                    rc = new Rect(0, 0, this._headerEdgeInsets.left, cntrc.height);
                }
                else
                {                    
                    rc = new Rect(0, 0, cntrc.width, this._headerEdgeInsets.top);
                }
                this._headerView.frame = rc;
            }

            if (this._footerView) {
                let rc:Rect;
                if (this.horizonMode)
                {
                    rc = new Rect(0, 0, this._footerEdgeInsets.right, cntrc.height);
                    rc.rightTop = this._scrollContent.frame.rightTop;
                }
                else
                {
                    rc = new Rect(0, 0, cntrc.width, this._footerEdgeInsets.bottom);
                    rc.leftBottom = this._scrollContent.frame.leftBottom;
                }
                this._footerView.frame = rc;
            }
        }
    }

    export class TableView
    extends Sprite
    implements ITableDataSource
    {
        constructor() {
            super();
            this._table = this.instanceTable();
            this._table.dataSource = this;
            this.addChild(this._table);
        }

        static FromItem(cv:CComponent):TableView {
            return <any>findParentByType(cv, TableView);
        }

        protected instanceTable():TableViewContent {
            return new TableViewContent();
        }

        protected _table:TableViewContent;
        get table():TableViewContent {
            return this._table;
        }

        classForRow(row:number):any {
            return this._table.rowClass;
        }

        heightForRow(row:number):number {
            return this._table.rowHeight;
        }

        updateRow(item:any, cell:TableViewCell, row:number) {
            /* 更新内部元素的数据   
               可以通过 if (DATAUPDATE) 来区分刷新数据还是只是为了计算高度
               如果只是为了计算高度，只需要在 updateData 中赋值和高度相关的数据
            */
        }

        numberOfRows():number {
            return 0;
        }

        updateLayout() {
            super.updateLayout();
            this._table.frame = this.boundsForLayout();
        }
    }
    
}
