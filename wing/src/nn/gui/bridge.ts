module nn {

    /** 用来将标准对象包装成业务对象 */
    export class BridgedComponent
    extends Component
    {
        constructor(tgt:any) {
            super();
            if (tgt) {
                this._imp = tgt;
                (<any>this._imp)._fmui = this;
            }
        }

        // 不替换所有关系的桥接(避免同一个对象位于不同功能时需要临时包装的问题)
        static Wrapper(tgt:any):BridgedComponent {
            let r = new BridgedComponent(null);
            r._imp = tgt;
            return r;
        }

        // 从元数据获取包装类型
        static FromImp(tgt:any):BridgedComponent {
            let r = tgt._fmui;
            while (r == null && tgt) {
                tgt = tgt.parent;
                if (tgt)
                    r = tgt._fmui;
            }
            return r;
        }
        
        // 阻止实现类的初始化
        protected createImp() {}

        get signals():Signals {
            return this._imp.signals;
        }
        
        protected _initSignals() {
            this._imp._initSignals();
        }
        
        // 显示在inspector中
        get descriptionName():string {
            return Classname(this._imp);
        }
        
        // 转接最佳大小
        bestFrame():Rect {
            return this._imp.bestFrame ? this._imp.bestFrame() : new Rect();
        }

        bestPosition():Point {
            return this._imp.bestPosition ? this._imp.bestPosition() : null;
        }

        updateCache() {
            if (this._imp.updateCache)
                this._imp.updateCache();
        }

        grab() {
            if (this._imp.grab)
                this._imp.grab();
            super.grab();
        }
        
        drop() {
            if (this._imp.drop)
                this._imp.drop();
            super.drop();
        }

        onAppeared() {
            super.onAppeared();
            this._imp.onAppeared();
        }

        onDisappeared() {
            super.onDisappeared();
            this._imp.onDisappeared();
        }
    }
    
}
