module nn {

    export interface IGridDataSource
    {
        /** 多少个元素 */
        numberOfItems():number;

        /** 元素的类型 */
        classForItem(row:number, col:number, idx:number):any;

        /** 更新元素 */
        updateItem(item:any, row:number, col:number, idx:number);
    }

    export class GridCellsItem
    extends Sprite
    {
        constructor(cols:number, cls:any) {
            super();
            for (let i = 0; i < cols; ++i) {
                let cell = new cls();
                this.addChild(cell);
                this.cells.push(cell);
            }
        }

        spacing:number = 0;

        updateLayout() {
            super.updateLayout();
            let box = new HBox(this);
            box.spacing = this.spacing;
            this.cells.forEach((c:GridViewCell)=>{
                box.addFlex(1, c);
            });
            box.apply();
        }

        itemAtIndex(idx:number):CComponent {
            return this.cells[idx].item;
        }

        setItemAtIndex(item:CComponent, idx:number) {
            this.cells[idx].item = item;
        }

        updateData() {
            super.updateData();
            this.cells.forEach((c:GridViewCell)=>{
                c.updateData();
            });
        }

        reuseAll(pool:IReusesPool) {
            this.cells.forEach((c:GridViewCell)=>{
                let item = c.item;
                if (item == null)
                    return;
                
                // 重用为了避免释放
                grab(item);
                c.item = null;
                
                pool.unuse(Classname(item), item);
            });
        }

        private cells = new Array<GridViewCell>();
    }

    export class GridViewCell
    extends Sprite
    {
        private _item:CComponent;
        get item():CComponent {
            return this._item;
        }
        set item(item:CComponent) {
            if (this._item == item)
                return;
            if (this._item)
                this.removeChild(this._item);
            this._item = item;
            if (item)
                this.addChild(item);
        }

        updateData() {
            super.updateData();
            if (this._item)
                this._item.updateData();
        }

        updateLayout() {
            super.updateLayout();
            if (this._item)
                this._item.frame = this.boundsForLayout();
        }
    }

    export class GridViewContent
    extends TableViewContent
    {
        constructor() {
            super();
            this.rowClass = GridCellsItem;
        }

        get gridDataSource():IGridDataSource {
            return <any>this.dataSource;
        }
        set gridDataSource(ds:IGridDataSource) {
            this.dataSource = <any>ds;
        }
        
        /** 默认的元素类型 */
        itemClass:any;

        /** 一行有几个 */
        numberOfColumns:number;

        /** 用来实现gridcell的类型 */
        gridCellClass = GridViewCell;

        // 实例化rowitem
        protected instanceItem(type:any):GridCellsItem {
            let r:GridCellsItem = new type(this.numberOfColumns, this.gridCellClass);
            r.spacing = this.spacing;
            return r;
        }

        // 实例化griditem
        protected instanceGridItem(cls:any):any {
            return new cls();
        }

        // 设置item
        protected updateRow(item:GridCellsItem, cell:TableViewCell, row:number) {
            let colscnt = this.numberOfColumns;
            let cnt = this.gridDataSource.numberOfItems();
            // 逐个
            for (let col = 0; col < colscnt; ++col) {
                let idx = row * colscnt + col;
                if (idx >= cnt)
                {
                    // 越界
                    item.setItemAtIndex(null, col);
                }
                else
                {
                    let cls = this.gridDataSource.classForItem(row, col, idx);
                    let idr = Classname(cls);                
                    let ci = this._reuseGridItems.use(idr, null, [cls]);
                    item.setItemAtIndex(ci, col);
                    
                    // 刷新格子
                    this.gridDataSource.updateItem(ci, row, col, idx);
                }
            }

            super.updateRow(item, cell, row);
        }

        // 如果cellsitem被重用，则需要把内部的items也重用
        protected addOneReuseItem(item:GridCellsItem) {
            item.reuseAll(this._reuseGridItems);
            super.addOneReuseItem(item);
        }

        // 重用griditems
        private _reuseGridItems = new SimpleReusesPool(this.instanceGridItem, this);
    }

    export class GridView
    extends TableView
    implements IGridDataSource
    {
        constructor() {
            super();
        }

        protected instanceTable():TableViewContent {
            return new GridViewContent();
        }

        get grid():GridViewContent {
            return <GridViewContent>this._table;
        }

        numberOfItems():number {
            return 0;
        }

        /** 元素的类型 */
        classForItem(row:number, col:number, idx:number):any {
            return (<GridViewContent>this._table).itemClass;
        }

        /** 更新元素 */
        updateItem(item:any, row:number, col:number, idx:number) {            
        }
        
        numberOfRows():number {
            let cnt = this.numberOfItems();
            let cols = (<GridViewContent>this._table).numberOfColumns;
            return Math.ceil(cnt / cols);
        }
    }
    
}