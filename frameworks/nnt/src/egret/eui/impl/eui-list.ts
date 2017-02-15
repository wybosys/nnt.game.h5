module eui {
    
    export class ListU
    extends eui.List
    {
        belong:any;        
        public slots:string = null;
        
        onPartBinded(name:string, target:any) {
            this.belong = target;
            _EUIDataGroupExt.onPartBinded(this, name, target);
        }
        
        dispose() {
            this.belong = null;
            if (this._signals) {
                this._signals.dispose();
                this._signals = undefined;
            }
        }

        drop() {
            this.dispose();
        }

        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.drop();
        }

        protected _initSignals() {
            this._signals.delegate = this;
            this._signals.register(nn.SignalItemClicked);
            this._signals.register(nn.SignalSelectionChanged);
            this._signals.register(nn.SignalSelectionChanging);
        }
        
        protected _signals:nn.Signals;
        get signals():nn.Signals {
            if (this._signals)
                return this._signals;
            this._instanceSignals();
            return this._signals;
        }
        
        protected _instanceSignals() {
            this._signals = new nn.Signals(this);            
            this._initSignals();
        }
        
        _signalConnected(sig:string, s?:nn.Slot) {
            if (sig == nn.SignalSelectionChanged) {
                nn.EventHook(this, egret.Event.CHANGE, this.__lst_selchanged, this);
            } else if (sig == nn.SignalSelectionChanging) {
                nn.EventHook(this, egret.Event.CHANGING, this.__lst_selchanging, this);
            } else if (sig == nn.SignalItemClicked) {
                nn.EventHook(this, eui.ItemTapEvent.ITEM_TAP, this.__lst_itemtap, this);
            }
        }
        
        private __lst_selchanged(e:egret.Event) {
            this._signals.emit(nn.SignalSelectionChanged);
        }

        private __lst_selchanging(e:egret.Event) {
            // egret的一个bug
            e.$cancelable = true;
            // 传透
            let tun = new nn.SlotTunnel();
            this._signals.emit(nn.SignalSelectionChanging, null, tun);
            if (tun.veto)
                e.preventDefault();
        }
        
        private __lst_itemtap(e:eui.ItemTapEvent) {
            this._signals.emit(nn.SignalItemClicked, ItemInfo.FromEvent(e));
        }

        scrollTo(pt:nn.Point) {
            let scl:eui.Scroller = nn.findParentByType(this, eui.Scroller);
            if (scl) {
                scl.viewport.scrollH = pt.x;
                scl.viewport.scrollV = pt.y;
            }
        }

        scrollToItem(idx:number, edge:nn.EDGE) {
            // 额外保护一下
            if (idx < 0 || idx == null)
                return;
            let ui:egret.DisplayObject;
            if (this.useVirtualLayout)
                ui = this.getVirtualElementAt(idx);
            else
                ui = this.getElementAt(idx);
            if (ui == null)
                return;
            let y:number;
            switch (edge) {
            case nn.EDGE.START: y = ui.y; break;
            case nn.EDGE.MIDDLE: y = ui.y + ui.height/2; break;
            case nn.EDGE.END: y = ui.y + ui.height; break;
            }
            let scl:eui.Scroller = nn.findParentByType(this, eui.Scroller);
            if (scl) {
                scl.viewport.scrollH = 0;
                scl.viewport.scrollV = y;
            }
        }

        // 设置一下数据
        protected _data:any;
        set data(data:any) {
            this._data = data;
            this.updateData();
        }
        get data():any {
            return this._data;
        }

        updateData() {
            if (this._data == null) {
                this.dataProvider = null;
            } else {
                this.dataProvider = new eui.ArrayCollection(this._data);
                if (this.requireSelection && this.selectedIndex == -1)
                    this.selectedIndex = 0;
            }
        }

        reload() {
            this.dataProviderRefreshed();
        }

        dataProviderRefreshed() {
            super.dataProviderRefreshed();
        }

        private __imp_updateitem:any;
        
        updateRenderer(renderer:eui.IItemRenderer, itemIndex:number, data:any):eui.IItemRenderer {            
            // 绑定render的belong，为了业务层可以方便的从item直接拿到list所在的父实体
            (<any>renderer).belong = this.belong;
            
            let r = super.updateRenderer(renderer, itemIndex, data);
            // 回调业务层的更新
            if (this.__imp_updateitem)
                this.__imp_updateitem.call(this.belong, r, itemIndex, data);
            return r;
        }        

        protected itemAdded(item:any, idx:number) {
            super.itemAdded(item, idx);
        }

        protected itemRemoved(item:any, idx:number) {
            super.itemRemoved(item, idx);
        }

        /** 可以在这里面判断item的实例
        addChild(c:egret.DisplayObject):egret.DisplayObject {
            let r = super.addChild(c);
            if (r instanceof this.itemRenderer)
                ............
            return r;
        }
        */

        /** 获得指定的元素 */
        getItem(idx:number):eui.IItemRenderer {
            if (this.useVirtualLayout)
                return <any>this.getVirtualElementAt(idx);
            return <any>this.getElementAt(idx);
        }
    }

}
