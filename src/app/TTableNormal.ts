class TableSimpleItem
extends nn.Sprite
{
    constructor() {
        super();
        this.edgeInsets = new nn.EdgeInsets(10, 10, 10, 10);
        this.backgroundColor = nn.Color.Random();
        this.addChild(this._label);

        this.btnAdd.text = "ADD";
        this.addChild(this.btnAdd);

        this.btnDel.text = "DEL";
        this.addChild(this.btnDel);

        this.btnExpand.text = "EXPAND";
        this.addChild(this.btnExpand);

        this.signals.connect(nn.SignalClicked, ()=>{
            var cell = nn.TableViewCell.FromItem(this);
            nn.noti("click " + cell.row);
        }, this);

        this.btnExpand.signals.connect(nn.SignalClicked, ()=>{
            var d = this.tag;
            d.expand = !d.expand;
            this.signals.emit(nn.SignalConstriantChanged);
        }, this);
    }

    _label = new nn.Label();
    btnAdd = new TButton();
    btnDel = new TButton();
    btnExpand = new TButton();

    updateLayout() {
        super.updateLayout();
        new nn.HBox(this)
            .setSpacing(10)
            .addAspect(4, 1, this._label)
            .addFlex(1)
            .addPixel(200, this.btnAdd)
            .addPixel(200, this.btnDel)
            .addPixel(200, this.btnExpand)
            .apply();
    }

    updateData() {
        super.updateData();
        if (nn.DATAUPDATE) {
            var d = this.tag;
            this._label.text = 'No.' + d.value;
        }
    }

    bestFrame():hd.Rect {
        var d = this.tag;
        if (d.expand)
            return new nn.Rect(0, 0, 0, 200);
        return new nn.Rect(0, 0, 0, 100);
    }
}

class GridSimpleItem
extends nn.Sprite
{
    constructor() {
        super();
        this.backgroundColor = nn.Color.Random();

        this._label.textAlign = "center";
        this.addChild(this._label);
    }

    _label = new nn.Label();

    updateLayout() {
        super.updateLayout();
        this._label.frame = this.boundsForLayout();
    }

    updateData() {
        super.updateData();
        this._label.text = 'No.' + this.tag;
    }
}

class TTableSimple
extends nn.TableView
{
    constructor() {
        super();
        //this.table.additionEdgeInsets = new nn.EdgeInsets(100, 100, 0, 0);
        this.table.rowHeight = 100;
        //this.table.rowHeight = 108;
        this.table.rowClass = TableSimpleItem;
        //this.table.contentEdgeInsets = new nn.EdgeInsets(100, 100, 100, 100);
        
        for (var i = 0; i < 30; ++i) {
            this._datas.push({value:this._max++, expand:false});
        }
    }

    onLoaded() {
        super.onLoaded();
        var lbl:any = new nn.Button();
        lbl.backgroundColor = nn.Color.Random();
        lbl.text = "HEAD VIEW";
        lbl.setFrame(new nn.Rect(0, 0, 0, 50));
        this.table.headerView = lbl;

        lbl = new nn.Label();
        lbl.backgroundColor = nn.Color.Random();
        lbl.text = "FOOTER VIEW";
        lbl.textAlign = "center";
        lbl.setFrame(new nn.Rect(0, 0, 0, 50));
        this.table.footerView = lbl;
    }

    _max = 0;
    _datas = new Array<any>();        

    numberOfRows():number {
        return this._datas.length;
    }

    updateRow(item:TableSimpleItem, cell:hd.TableViewCell, row:number) {
        //if (cell.edgeInsets == null)
        //    cell.edgeInsets = new nn.EdgeInsets(5, 5, 10, 10);
        item.tag = this._datas[row];
        item.btnAdd.signals.connect(nn.SignalClicked, this._actAdd, this);
        item.btnDel.signals.connect(nn.SignalClicked, this._actDel, this);
    }

    _actAdd(s:hd.Slot) {
        var cell = nn.TableViewCell.FromItem(s.sender.parent);
        nn.ArrayT.InsertObjectAtIndex(this._datas, {value:this._max++, expand:false}, cell.row);
        this.table.reloadData();
    }

    _actDel(s:hd.Slot) {
        var cell = nn.TableViewCell.FromItem(s.sender.parent);
        nn.ArrayT.RemoveObjectAtIndex(this._datas, cell.row);
        this.table.reloadData();
    }
}

class TGridSimple
extends nn.GridView
{
    constructor() {
        super();

        this.grid.spacing = 10;
        this.grid.rowHeight = 200;
        this.grid.numberOfColumns = 4;
        this.grid.itemClass = GridSimpleItem;
                
        for (var i = 0; i < 30; ++i) {
            this._datas.push(this._max++);
        }
    }

    onLoaded() {
        super.onLoaded();
    }

    _max = 0;
    _datas = new Array<number>();        

    numberOfItems():number {
        return this._datas.length;
    }

    updateItem(item:GridSimpleItem, row:number, col:number, idx:number) {
        item.tag = this._datas[idx];
    }
}

class TTableNormal
extends nn.Sprite
{
    constructor() {
        super();
        this.addChild(this._simple);
        this.addChild(this._grid);

        this._btnNext.text = "NEXT";
        this._btnPre.text = "PREV";
        this._btnClear.text = "CLEAR";
        this.addChild(this._btnNext);        
        this.addChild(this._btnPre);
        this.addChild(this._btnClear);

        this._btnNext.signals.connect(nn.SignalClicked, this._actNext, this);
        this._btnPre.signals.connect(nn.SignalClicked, this._actPrev, this);
        this._btnClear.signals.connect(nn.SignalClicked, this._actClear, this);
    }

    _simple = new TTableSimple();
    _grid = new TGridSimple();
    
    _btnNext = new TButton();
    _btnPre = new TButton();
    _btnClear = new TButton();

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this)
            .addFlex(1, this._simple)
        //.addFlex(1, this._grid)
            .addPixelHBox(100, (box:hd.HBox)=>{
                box.addFlex(1, this._btnNext)
                    .addFlex(1, this._btnPre)
                    .addFlex(1, this._btnClear);
            })
            .apply();
    }

    _sid = 0;
    _actNext() {
        this._simple.table.scrollToCell(++this._sid);
    }

    _actPrev() {
        this._simple.table.scrollToCell(--this._sid);
    }

    _actClear() {
        this._simple.table.clear();
    }
}