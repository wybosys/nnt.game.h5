module eui {

    export class TabBarU
    extends eui.TabBar
    {        
        public slots:string = null;
        protected onPartBinded(name:string, target:any) {
            _EUIDataGroupExtPROTO.onPartBinded.call(this, name, target);
        }

        constructor() {
            super();
            nn.EventHook(this, egret.Event.CHANGE, this.__lst_selchanged, this);
        }

        dispose() {
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
            this._signals.register(nn.SignalSelectionChanged);
            this._signals.register(nn.SignalSelectionChanging);
        }
        
        protected _signals:hd.Signals;
        get signals():hd.Signals {
            if (this._signals)
                return this._signals;
            this._instanceSignals();
            return this._signals;
        }
        
        protected _instanceSignals() {
            this._signals = new nn.Signals(this);            
            this._initSignals();
        }
        
        _signalConnected(sig:string, s?:hd.Slot) {
            if (sig == nn.SignalSelectionChanged) {
            } else if (sig == nn.SignalSelectionChanging) {
                nn.EventHook(this, egret.Event.CHANGING, this.__lst_selchanging, this);
            }
        }

        get selectedIndex():number {
            return egret.superGetter(TabBarU, this, 'selectedIndex');
        }
        set selectedIndex(v:number) {
            egret.superSetter(TabBarU, this, 'selectedIndex', v);
            if (this.pageStack) {
                this.pageStack.selectedIndex = this.selectedIndex;
            }
        }
        
        private __lst_selchanged() {
            if (this._signals) // 修改为构造函数的时候绑定，所以signals会还没有初始化
                this._signals.emit(nn.SignalSelectionChanged);
            // 动作page
            if (this.pageStack) {
                this.pageStack.selectedIndex = this.selectedIndex;
            }
        }

        private __lst_selchanging(e:egret.Event) {
            // egret的一个bug
            e.$cancelable = true;
            
            // 传透
            let tun = new nn.SlotTunnel();
            
            // 封装changing的对象
            let info = _EUIDataGroupExt.GetChanging(this);
            this._signals.emit(nn.SignalSelectionChanging, info, tun);
            
            if (tun.veto)
                e.preventDefault();
        }

        private _data:any;
        set data(data:any) {
            if (data == null)
                this.dataProvider = null;
            else
                this.dataProvider = new eui.ArrayCollection(data);
            this._data = data;
        }
        get data():any {
            return this._data;
        }        

        reload() {
            this.dataProviderRefreshed();
        }

        private __imp_updateitem:any;

        updateRenderer(renderer:eui.IItemRenderer, itemIndex:number, data:any):eui.IItemRenderer {
            let r = super.updateRenderer(renderer, itemIndex, data);
            if (this.__imp_updateitem)
                this.__imp_updateitem(r, itemIndex, data);
            return r;
        }

        // 绑定到对应的pagestack简化动作
        pageStack:PageStackU;
    }
    
}