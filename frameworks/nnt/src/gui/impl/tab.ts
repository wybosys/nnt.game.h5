module nn {

    /** tab的页面接口 */
    export interface ITabPage {
        /** 用于切换操作的button 
            @note 如果tabButton不是由page自己管理（业务手动添加tabButton到某一个view中），则tab自动添加tabButton作为子控件，业务通过控制edgeInsets来布局
        */
        tabButton:CButton;

        /** 也可用静态的形式，因为typescript不支持interface里面描述静态类，所以只能有业务自己处理 */
        // static TabButton(page:StackPageType, idx?:number):CButton;
    }

    export interface SelectionTabData
    extends SelectionData {
        oldTabButton:CButton,
        nowTabButton:CButton
    }
    
    export class TabStack
    extends ViewStack
    {
        constructor() {
            super();
            this._selsgrp.signals.connect(SignalSelectionChanged, this.__cbSelsChanged, this);
        }

        /** 也可以在tab中直接定义各个按钮 */
        static TabButton:(page:StackPageType, idx?:number)=>CButton;

        get tabButtons():Array<Button> {
            return this._selsgrp.elements();
        }
        set tabButtons(arr) {
            fatal("不能直接设置tabButtons");
        }

        clear() {
            this._selsgrp.elements().forEach((p:Button)=>{
                p.removeFromParent();
            });
            this._selsgrp.clear();
            super.clear();
        }

        get pages():Array<StackPageType> {
            return this._views;
        }
        set pages(arr:Array<StackPageType>) {
            this.clear();
            this.setViews(arr);
        }

        private _selection:number = 0;
        get selection():number {
            return this._selection;
        }
        set selection(idx:number) {
            if (this._selection == idx)
                return;
            this._selection = idx;
            if (this._selsgrp.length)
                this._selsgrp.selection = idx;
        }

        protected _getPageTabButton(page:StackPageType, idx:number):CButton {
            if (page.isnull() == false) {
                let btn:any = (<ITabPage><any>page.obj).tabButton;
                // 如果btn已经加入到statesgroup中，则判定为复用page
                // 复用page则需要生成一个新的tabbutton
                if (btn && this._selsgrp.indexOf(btn) != -1)
                    btn = null;
                if (btn == null) {
                    let fun = ObjectClass(page.obj).TabButton;
                    if (fun == null)
                        fun = ObjectClass(this).TabButton;
                    if (fun == null)
                        fatal('没有提供 TabStack 用来实例化 TabButton 的方法');
                    
                    btn = fun(page, idx);
                    (<ITabPage><any>page.obj).tabButton = btn;
                    return btn;
                }
                return btn;
            }

            let fun = page.clazz.TabButton;
            if (fun == null)
                fun = ObjectClass(this).TabButton;
            if (fun == null)
                fatal('没有提供 TabStack 用来实例化 TabButton 的方法');

            let btn = fun(page, idx);            
            (<any>page).__tabbutton = btn;
            return btn;
        }

        protected setViews(arr:Array<StackPageType>) {
            if (arr == this._views)
                return;
            this.clear();

            arr.forEach((page:StackPageType)=>{
                this._views.push(page);

                let tabbtn = this._getPageTabButton(page, this._views.length - 1);
                if (tabbtn) {
                    this._selsgrp.add(tabbtn);                
                    if (tabbtn.parent == null)
                        this.addChild(tabbtn);
                }

                if (page.isnull() == false) {
                    let p = page.obj;
                    p.visible = false;
                    // 取保绑定好了tabbutton
                    if ((<ITabPage><any>page).tabButton == null)
                        (<ITabPage><any>page).tabButton = tabbtn;
                    this._addPage(page, false);
                }
            }, this);

            this._selsgrp.selection = this._selection;
        }

        protected _addPage(page:StackPageType, aschild:boolean) {
            super._addPage(page, aschild);
            // 绑定一下提前初始化的tabButton
            let p = page.obj;
            if ((<ITabPage><any>p).tabButton == null)
                (<ITabPage><any>p).tabButton = (<any>page).__tabbutton;
        }
        
        push(page:StackPageType, animated = true):boolean {
            let r = super.push(page, animated);
            if (r == null)
                return null;
            
            let tabbtn = this._getPageTabButton(page, this._views.length - 1);
            if (tabbtn) {
                this._selsgrp.add(tabbtn);                
                if (tabbtn.parent == null)
                    this.addChild(tabbtn);                    
            }
            
            return r;
        }

        protected _selsgrp = new SelectionsGroup();

        private __cbSelsChanged(e:Slot) {
            this._selection = this._selsgrp.selection;
            this.setTopView(this._views[this._selection]);
        }

        protected _emitSelectionChanged(now:CComponent, old:CComponent) {
            if (this._signals)
                this._signals.emit(SignalSelectionChanged, {now:now, old:old,
                                                            nowTabButton:this._selsgrp.selectionItem,
                                                            oldTabButton:this._selsgrp.previousSelectionItem});
        }        
        
        protected setPageFrame(page:CComponent) {
            let rc = this.boundsForLayout();            
            page.frame = rc;
        }
    }
    
}