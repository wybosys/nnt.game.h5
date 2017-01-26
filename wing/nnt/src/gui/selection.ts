module nn {

    export class SelectionsGroup
    extends SObject
    {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalSelectionChanged);
        }

        dispose() {
            this.clear();
            super.dispose();
        }
        
        add(ui:CComponent & IState) {
            if (ui.states == undefined) {
                fatal("push a non state object");
                return;
            }

            ui.states.signals.connect(SignalStateChanged, this._cbStateChanged, this);
            this._store.push(ui);
        }        

        clear() {
            this._old = undefined;
            nn.ArrayT.Clear(this._store, (e:SObject)=>{
                e.signals.disconnectOfTarget(this);
            }, this);
        }

        elements():any[] {
            return this._store;
        }

        private _cbStateChanged(e:Slot) {
            let ui = e.sender.cbctx;
            // 如过是自身在变化，则跳过
            if (ui == this._old)
                return;

            this._store.forEach((o)=>{
                if (o == ui)
                    return;                
                o.states.next(e.data, true, false);
            }, this);

            this.signals.emit(SignalSelectionChanged, {now:ui, old:this._old});
            this._old = ui;
        }

        get selection():number {
            return nn.ArrayT.QueryIndex(this._store, (o):boolean=>{
                return o.isSelection && o.isSelection();
            }, this, -1);
        }
        set selection(idx:number) {
            let o = this._store[idx];
            if (o.setSelection)
                o.setSelection(true);
            else
                warn("该对象不支持 setSelection 操作");
        }

        get selectionItem():any {
            return nn.ArrayT.QueryObject(this._store, (o):boolean=>{
                return o.isSelection && o.isSelection();
            }, this);
        }
        set selectionItem(o:any) {
            if (o.setSelection)
                o.setSelection(true);
            else
                warn("该对象不支持 setSelection 操作");
        }

        indexOf(o:any):number {
            return this._store.indexOf(o);
        }

        get previousSelectionItem():any {
            return this._old;
        }

        get length():number {
            return this._store.length;
        }

        private _old:any;
        private _store = new Array<any>();
    }

}
