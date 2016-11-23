class TableHovItem
extends nn.Sprite
{
    constructor() {
        super();
        this.edgeInsets = new nn.EdgeInsets(10, 10, 10, 10);
        this.backgroundColor = nn.Color.Random();
        this.anchor = new nn.Point(0.5, 0.5);

        this._label.textAlign = "center";
        this.addChild(this._label);
    }

    dispose() {
        nn.noti("析构 TableHovItem");
        super.dispose();
    }

    _label = new nn.Label();

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this)
            .addAspect(1, 1, this._label)
            .apply();
    }

    updateData() {
        super.updateData();
        if (nn.DATAUPDATE) {
            this._label.text = 'No.' + this.tag;
        }
    }
}

class THovTableCell
extends nn.TableViewCell
{
    constructor() {
        super();
        this.anchor = new nn.Point(0.5, 0.5);
    }
}

class THovTable
extends nn.TableView
{
    constructor() {
        super();
        this.table.horizonMode = true;
        this.table.rowHeight = 200;
        this.table.rowClass = TableHovItem;

        for (var i = 0; i < 100; ++i)
            this._datas.push(i);

        // 页面元素变动后显示当前页面中的序号，并居中中间的
        this.table.signals.connect(nn.SignalScrollEnd, this._cbShowCells, this);
    }

    _datas = new Array<number>();

    numberOfRows():number {
        return this._datas.length;
    }

    updateRow(item:TableHovItem, cell:nn.TableViewCell, row:number) {
        if (cell.edgeInsets == null)
            cell.edgeInsets = new nn.EdgeInsets(5, 5, 10, 10);
        item.tag = this._datas[row];
    }

    _cbShowCells() {
        var cells = this.table.visibledCells;
        cells.forEach((cell:nn.TableViewCell)=>{
            nn.noti("cell row: " + cell.row);
        });

        // 取得中间的
        var cell = cells[Math.ceil(cells.length / 2)];
        nn.noti("mid cell row: " + cell.row);

        // 滚动到中间的cell
        var pos = this.table.contentOffset;
        pos.x += cell.frame.center.x - (pos.x + this.table.frame.width / 2);
        this.table.setContentOffset(pos, 0.3);
    }
}

class CoverItem
extends nn.Sprite
{
    constructor() {
        super();
        this.edgeInsets = new nn.EdgeInsets(10, 10, 10, 10);
        this.backgroundColor = nn.Color.White;
        this.anchor = new nn.Point(0.5, 0.5);
        this.borderLine = new nn.Line();

        this._label.textColor = 0;
        this._label.textAlign = "center";
        this.addChild(this._label);
    }

    _label = new nn.Label();

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this)
            .addAspect(1, 1, this._label)
            .apply();
    }

    updateData() {
        super.updateData();
        if (this.tag != null)
            this._label.text = 'No.' + this.tag;
        else
            this._label.text = "";
    }
}

class THovCollect
extends nn.CoverFlowView
{
    constructor() {
        super();
        this.itemClass = CoverItem;
        this.nullItemClass = CoverItem;
        this.thresholdSize = new nn.Size(200, 0);
        this.selection = 1;
        this.maxItemsOnScreen = 7;
        for (var i = 0; i < 5; ++i)
            this._datas.push(i);

        this.signals.connect(nn.SignalSelectionChanged, this._cbSelectionChanged, this);
    }

    _datas = new Array<number>();

    numberOfItems():number {
        return this._datas.length;
    }

    updateItem(item:CoverItem, idx:number) {
        item.tag = this._datas[idx];
    }

    updateNullItem(item:CoverItem) {
        item.tag = null;
    }

    updateItemsSize(items:nn.Sprite[]) {
        var rc = this.boundsForLayout();
        var off = this.offsetPos;        
        items.forEach((item:CoverItem, idx:number)=>{
            var irc = new nn.Rect(0, 0, 200, 400);
            var dis = idx - 3;
            var sc = 1 - Math.abs(dis * 0.1 + off.x / rc.width);
            irc.center = rc.center.add(dis * 100, 0).add(off.x, 0)
            item.frame = irc;
            item.zPosition = Math.abs(dis);
            item.setScale(sc);
        });
    }

    private _cbSelectionChanged(s:nn.Slot) {
        var d:nn.SelectionData = s.data;
        var old = d.old ? d.old.tag : '';
        nn.noti(`coverflow selected: now:${d.now.tag} old:${old}`);
    }
}

class TTableHov
extends nn.Sprite
{
    constructor() {
        super();
        this.addChild(this._table);
        this.addChild(this._coll);
    }

    _table = new THovTable();
    _coll = new THovCollect();

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this)
            .addFlex(1, this._table)
            .addFlex(1, this._coll)
            .apply();
    }
}
