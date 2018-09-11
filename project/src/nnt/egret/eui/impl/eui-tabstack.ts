module eui {

    class ImpViewStack extends nn.ViewStack {
        getViews(): Array<nn.StackPageType> {
            return this._views;
        }
    }

    export class TabStackU extends eui.ComponentU implements eui.IViewStack {
        constructor() {
            super();
            this.createImp();
            this.addChild(this._imp);
        }

        private _imp: ImpViewStack;

        protected createImp() {
            this._imp = new ImpViewStack();
        }

        updateLayout() {
            if (this._imp)
                this._imp.frame = nn.getFrame(this);
        }

        /** 通过类查找对应的页面 */
        findPage(cls: any): egret.DisplayObject {
            let views = this._imp.getViews();
            let page = nn.ArrayT.QueryObject(views, (p: nn.StackPageType): boolean => {
                let obj = p.obj;
                return obj instanceof cls;
            });
            return page.obj.handle();
        }

        push(ui: egret.DisplayObject) {
            let bc = new nn.BridgedComponent(ui);
            _EUIExt.setViewStack(ui, this);
            this._imp.push(bc);
        }

        pop() {
        }

        pages(): egret.DisplayObject[] {
            return nn.ArrayT.Convert(this._imp.getViews(), (page: nn.StackPageType): egret.DisplayObject => {
                return page.obj.handle();
            });
        }
    }

}
