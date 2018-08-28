module nn {

    /** 堆栈类，作为具有层级结构的基类使用
        push/pop 等操作因为业务通常会连着用，避免连续多个引发问题，所以实现放倒队列中进行
    */
    export class ViewStack
    extends Component
    implements IViewStack
    {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalSelectionChanged);
        }

        dispose() {
            // 清除页面
            ArrayT.Clear(this._views, (p:StackPageType)=>{
                if (p.isnull() == false && p.obj.parent == null) {
                    p.drop();
                }
            }, this);
            this._topView = null;
            
            super.dispose();
        }

        // 是否可以弹出根页面
        rootPopable:boolean = false;

        // viewstack的很多动作不能无序操作，所以需要通过队列管理起来
        protected _opers = new OperationQueue();
        
        // 每一个子页面，有可能是实体，有可能是通过Instance提供的类
        protected _views = new Array<StackPageType>();

        // 顶级页面，以为支持了复用同一个实体，所以不能直接通过实体来设置当前页面
        protected _topView:StackPageType;
        get topView():StackPageType {
            return this._topView;
        }
        set topView(page:StackPageType) {
            fatal("请使用index来设置当前页面");
        }

        // 为了支持复用实体，所以去除掉topview ＝＝ page 的判断
        protected setTopView(page:StackPageType, animated = true):CComponent {
            if (page == null)
                return null;
            
            if (ISDEBUG && this._views.indexOf(page) == -1) {
                fatal("不能设置一个不属于当前Stack的页面为 Top");
                return null;
            }                
            
            let now:CComponent;
            let old = this._topView ? this._topView.obj : null;

            // 判断page是不是还没有实例化
            if (page.isnull()) {
                // 使用 Instance 初始化
                now = page.obj;
                this._addPage(page, true);
            } else {
                now = page.obj;
                if (now.parent == null)
                    this.addChild(now);
                else
                    now.setNeedsAppear();
            }            
            this._topView = page;
            
            // 切换两个页面
            this.swapPages(now, old, animated);
            
            return old;
        }

        protected swapPages(now:CComponent, old:CComponent, animated:boolean) {
            // 需要刷新一下数据
            now.updateData();
            this.setPageFrame(now);            
            now.visible = true;

            if (old)
            {
                // 先抛出事件
                this._emitSelectionChanged(now, old);
                now.signals.emit(SignalSelected);

                // 制作动画
                let anicomp:()=>void;
                if (old == now) {
                    anicomp = ()=>{                    
                        // 下一步
                        this._opers.next();                        
                    };
                } else {
                    anicomp = ()=>{                        
                        // 隐藏掉老的
                        old.visible = false;
                        old.onDisappeared();
                        old.signals.emit(SignalDeselected);
                        
                        // 下一步
                        this._opers.next();                        
                    };
                }                
                
                if (animated) {
                    if (old == now) {
                        this.transiting(null, now, false, anicomp);
                    } else {
                        this.transiting(old, now, false, anicomp);
                    }
                } else {
                    anicomp();
                }
            }
            else
            { // 如果不存在旧的，则新的一般是不需要做动画，直接显示好了
                // 外抛事件
                this._emitSelectionChanged(now, old);
                now.signals.emit(SignalSelected);
                
                // 下一步
                this._opers.next();
            }
        }

        // 发送选中变化的信号，因为viewstack通常需要被继承实现更复杂的功能，所以导致选中的信号除了now\old外还要附加其他数据，所以开放供子类修改
        protected _emitSelectionChanged(now:CComponent, old:CComponent) {
            if (this._signals)
                this._signals.emit(SignalSelectionChanged, {now:now, old:old});
        }

        removeChild(c:CComponent) {
            if (c == this._topView) {
                if (this._views.length > 1)
                    warn("直接移除 topView 会对 ViewStack 产生风险");
                this._topView = undefined;
            }
            super.removeChild(c);   
        }

        updateLayout() {
            super.updateLayout();
            
            if (this._topView)
                this.setPageFrame(this._topView.obj);
        }

        // 设置页面的大小
        protected setPageFrame(page:CComponent) {
            let rc = this.bounds();
            page.frame = rc;
        }

        protected setViews(arr:Array<StackPageType>) {
            if (arr == this._views)
                return;
            this.clear();
            
            arr.forEach((page:StackPageType)=>{
                // 添加到页面数组中
                this._views.push(page);

                // 默认都不显示
                if (page.isnull() == false) {
                    let p = page.obj;
                    p.visible = false;
                    this._addPage(page, false);
                }
            }, this);
        }

        push(page:StackPageType, animated = true):boolean {
            if (page == null) {
                warn("不能推入一个null页面");
                return false;
            }
            
            if (ArrayT.Contains(this._views, page)) {
                warn("不能重复推入页面");
                return false;
            }
            
            this._opers.add(new OperationCall(this._doPush, this, [page, animated]));
            return true;
        }
        
        private _doPush(page:StackPageType, animated = true) {
            this._views.push(page);
            
            // 直接推入的页面不能位于views之中，所以也就不存在已经是child的问题
            let now:CComponent = page.obj;
            let old = this._topView ? this._topView.obj : null;
            this._addPage(page, true);
            this._topView = page;

            // 切换两个页面
            this.swapPages(now, old, animated);
        }

        protected _addPage(page:StackPageType, aschild:boolean) {
            let p = page.obj;
            p.viewStack = this;
            p.signals.register(SignalSelected);
            p.signals.register(SignalDeselected);
            if (aschild)
                this.addChild(p);
        }
        
        pop(page:StackPageType = null, animated:boolean = true):boolean {
            if (this._views.length == 0)
                return false;
            if (!this.rootPopable && this._views.length == 1)
                return false;
            
            if (page == null)
                page = this.topView;

            let idx = this._views.indexOf(page);
            if (idx == -1) {
                fatal("不能弹出不属于Stack的页面");
                return false;
            }

            this._opers.add(new OperationCall(this._doPop, this, [page, animated]));
            return true;
        }

        private _doPop(page:StackPageType, animated:boolean) {
            let idx = this._views.indexOf(page);
            let prev = page.obj;

            // 如过相等，则直接移除，但是因为是top的改变，需要加上动画处理
            if (this.topView == page)
            {
                this._topView = this._views[idx - 1];

                let now:CComponent;
                if (this._topView) {
                    now = this._topView.obj;
                    now.visible = true;
                    now.setNeedsAppear();                    
                    
                    // 发送事件
                    this._emitSelectionChanged(now, null);
                    now.signals.emit(SignalSelected);
                }
                
                let fun = ()=>{
                    // 隐藏之前
                    prev.onDisappeared();
                    prev.signals.emit(SignalDeselected);

                    // 直接移除
                    this.removeChild(prev);

                    // 下一步
                    this._opers.next();
                };                
                if (animated) {                    
                    this.transiting(prev, now, true, fun);
                } else {
                    fun();
                }
            }
            else
            { // 移除中间的就不需要做动画和通知
                this.removeChild(prev);

                // 下一步
                this._opers.next();
            }
            
            ArrayT.RemoveObjectAtIndex(this._views, idx);
        }

        popTo(page:StackPageType|number, animated = true):boolean {
            let idx:number; // 跳转到指定序号            
            let to:StackPageType; // 跳转到指定页面
            if (typeof(page) == 'number') {
                idx = <number>page;
                to = this._views[idx];
            } else {
                to = <StackPageType>page;
                idx = this._views.indexOf(to);
            }
            
            let curidx = this._views.indexOf(this._topView);
            if (idx < 0 || idx >= curidx || to == null)
                return false;

            this._opers.add(new OperationCall(this._doPopTo, this, [idx, curidx, animated]));
            return true;
        }

        private _doPopTo(idx:number, curidx:number, animated = true) {
            ArrayT.RemoveObjectsByFilter(this._views, (o:StackPageType, i:number):boolean=>{
                if (i > idx && i < curidx) {
                    // 移除不显示的
                    let pop = o.obj;
                    pop.onDisappeared();
                    pop.signals.emit(SignalDeselected);
                    this.removeChild(pop);
                    return true;
                }
                return false;
            }, this);

            this._doPop(this._topView, animated);
        }
        
        popToRoot(animated = true) {
            this.popTo(0, animated);            
        }

        clear() {
            ArrayT.Clear(this._views, (p:StackPageType)=>{
                if (p.isnull() == false) {
                    if (p.obj.parent == null)
                        p.drop();
                    else
                        this.removeChild(p.obj);
                }
            }, this);
            this._topView = null;
        }

        transiting(from:any, to:any, reverse:boolean, cb?:()=>void, ctx?:any):any {
            let ts:Transition = <Transition>this.transitionObject;

            let tsapr = ts ? ts.appear : null;
            let tsdis = ts ? ts.disappear : null;
            let tsfrom = from ? from.transitionObject : null;
            if (tsfrom)
                tsdis = tsfrom.disappear;
            let tsto = to ? to.transitionObject : null;
            if (tsto)
                tsapr = tsto.appear;

            let t:Transition = new Transition(tsapr, tsdis);
            t.reverse = reverse;

            let oldte = this.touchChildren;
            this.touchChildren = false;
            
            t.signals.connect(SignalDone, ()=>{
                this.touchChildren = oldte;
                if (cb)
                    cb.call(ctx ? ctx : this);
            }, this);

            t.play(to, from);
            return t;
        }
    }
    
}