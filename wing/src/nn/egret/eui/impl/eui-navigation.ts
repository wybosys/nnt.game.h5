module eui {

    class _NaviViewStack
    extends nn.ViewStack
    {
        getViews():Array<nn.StackPageType> {
            return this._views;
        }
    }
    
    export class NavigationU
    extends eui.ComponentU
    implements eui.IViewStack
    {
        constructor() {
            super();
            this.createImp();
            this.addChild(this._imp);
        }

        get signals() {
            return this._imp.signals;
        }
        
        private _imp:_NaviViewStack;
        protected createImp() {
            this._imp = new _NaviViewStack();
        }

        public get rootPopable():boolean {
            return this._imp.rootPopable;
        }
        public set rootPopable(b:boolean) {
            this._imp.rootPopable = b;
        }

        updateLayout() {
            if (this._imp) {
                this._imp.frame = nn.getFrame(this);
                this._imp.flushLayout();
            }
        }

        topView():ComponentU {
            return this._imp.topView.obj.handle();
        }

        topIndex():number {
            return this._imp.getViews().indexOf(this._imp.topView);
        }

        push(ui:ComponentU) {
            let bc = new nn.BridgedComponent(ui);
            _EUIBaseExt.prototype.setViewStack.call(ui, this);
            this._imp.push(bc);
        }

        goBack() {
            this.pop();
        }

        pop() {
            this._imp.pop();
            this._imp.setNeedsLayout();
        }

        pages():ComponentU[] {
            return nn.ArrayT.Convert(this._imp.getViews(), (page:nn.StackPageType):ComponentU=>{
                return page.obj.handle();
            });
        }
    }
    
}