module nn {

    /** 找到所有的父对象 */
    export function getParents(ui:any):Array<any> {
        let r = [];
        let p = ui;
        while (p) {
            r.push(p);
            p = p.parent;
        }
        return r;
    }

    /** 获取每一个 view 的 supers，做两个 arr 的交集，取得第一个返回 */
    export function findAncestorView(l:any, r:any):any {
        let ls = getParents(l);
        let rs = getParents(r);
        let s = nn.ArrayT.ArrayInArray(ls, rs);
        return s.length ? s[0] : null;
    }
    
    /** 根据类型找父对象 */
    export function findParentByType(l:any, cls:any, def?:any):any {
        let p = l.parent;
        while (p) {
            if (p instanceof cls)
                return p;
            p = p.parent;
        }
        return def;
    }

    /** 根据自定义条件查找满足条件的父对象 */
    export function queryParent(l:any, query:(o:any)=>any, ctx?:any):any {
        let p:any = l.parent;
        while (p) {
            let r = query.call(ctx, p);
            if (r)
                return r;
            p = p.parent;
        }
        return null;
    }

    /** 使用tag查找所有子元素 */
    export function findElementsByTag(l:any, tag:any):Array<any> {
        let arr = [];
        l.children.forEach((c:CComponent)=>{
            if (c.tag == tag)
                arr.push(c);
            let sba = findElementsByTag(c, tag);
            nn.ArrayT.Concat(arr, sba);
        }, this);
        return arr;
    }

    /** 判断是否在屏幕上显示 */
    export function isAppearing<T>(obj:T):boolean {
        if (!obj)
            return true;
        if (egret.is(obj, "egret.Stage"))
            return true;
        if (!(<any>obj).visible)
            return false;
        return isAppearing((<any>obj).parent);
    }

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
    
    export abstract class CBitmap
    extends Widget
    {
        constructor(res?:TextureSource) {
            super();
        }

        dispose() {            
            super.dispose();
        }
        
        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalChanged);
        }

        /** 9点 */
        point9:[number, number, number, number];

        /** 素材 */
        imageSource:TextureSource;

        /** 填充模式 */
        fillMode = FillMode.STRETCH;

        /** 期望的大小 */
        preferredFrame:Rect;
    }
   
    export class Font {
        // 计算单行文字大小
        static sizeOfString(str:string, fontSize:number, width:number, height:number):Size {
            let w = 0, h = fontSize;
            w = (str.length ? str.length + 1 : 0) * fontSize;
            if (width) {
                h = Math.ceil(w / width) * fontSize;                
                if (height && h > height)
                    h = height;
                w = Math.min(w, width);
                return new Size(w, h);
            }
            if (height) {
                if (fontSize > height)
                    h = height;
                return new Size(w, h);
            }
            return new Size(w, h);
        }

        // 计算多行文字大小
        static sizeFitString(str:string, fontSize:number, width:number, height:number, lineSpacing:number):Size {
            if (!str || !str.length)
                return new Size();
            let r = new Size();
            let lns = str.split('\n');
            lns.forEach((s:string)=>{
                let sz = Font.sizeOfString(s, fontSize, width, height);
                r.width = Math.max(r.width, sz.width);
                r.height += sz.height;
            });
            r.height += lns.length * lineSpacing;
            return r;
        }        
    }

    export class TextAlign {
        static CENTER = 'center';
        static LEFT = 'left';
        static RIGHT = 'right';
    };

    export abstract class CLabel
    extends Widget
    {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalChanged);
            this._signals.register(SignalAction);
        }
        
        // 默认的字体大小
        static FontSize = 30;
        
        /** 粗体 */
        bold:boolean;

        /** 斜体 */
        italic:boolean;

        /** 描边宽度 */
        stroke:number;

        /** 描边颜色 */
        strokeColor:ColorType;

        /** 行距 */
        lineSpacing:number;

        /** 字体大小 */
        fontSize:number;

        /** 蚊子颜色 */
        textColor:ColorType;

        /** 文字对齐 */
        textAlign:string;

        /** 文字停靠的边缘 */
        textSide:string;

        /** 字体 */
        fontFamily:string;

        /** 行数 */
        numlines:number;

        /** 多行 */
        multilines:boolean;        

        /** 文字 */
        text:string;

        /** override 富文本文字 */
        attributedText:any;

        /** override html文字 */
        htmlText:string;

        /** 缩放字体以适应控件 */
        scaleToFit:boolean;

        /** 增加文字 */
        abstract appendText(s:string);

        /** 如果输入了混合文本，并加入了link，则可以通过直接绑定rex和clouse来处理链接的点击 */
        abstract href(re:RegExp, cb:(url:string)=>void, ctx?:any);
    }

    export interface CTextField
    {
        /** 只读 */
        readonly:boolean;
        
        /** 占位文字 */
        placeholder:string;
        
        /** 占位字体颜色 */
        placeholderTextColor:ColorType;

        /** 多行编辑 */
        multilines:boolean;

        /** 安全编辑 */
        securityInput:boolean;
    }

    export abstract class CBitmapLabel
    extends Widget
    {        
        /** 字体的名称 */
        fontSource:FontSource;

        /** 字体的大小 */
        fontSize:number;

        /** 间距 */
        characterSpacing:number;

        /** 行距 */
        lineSpacing:number;

        /** 文本内容 */
        text:string;

        /** 对齐方式 */
        textAlign:string;

        /** 文字停靠的边缘 */
        textSide:string;
    }

    /** 按钮类
        @note 定义为具有点按状态、文字、图片的元素，可以通过子类化来调整文字、图片的布局方式
     */
    export abstract class CButton
    extends Widget
    implements IState
    {
        constructor() {
            super();
            this.touchEnabled = true;
            this.anchor = Point.AnchorCC;
        }

        static STATE_NORMAL = "::button::state::normal";
        static STATE_DISABLED = "::button::state::disable";
        static STATE_HIGHLIGHT = "::button::state::highlight";
        static STATE_SELECTED = "::button::state::selected";

        /** 是否可用 */
        disabled:boolean;

        /** 字体大小 */
        fontSize:number;

        /** 文字颜色 */
        textColor:ColorType;

        /** 内容 */
        text:string;

        /** 对齐方式 */
        textAlign:string;

        /** 图片 */
        imageSource:TextureSource;

        /** 普通的状态 */
        stateNormal:State;

        /** 禁用的状态 */
        stateDisabled:State;

        /** 高亮的状态 */
        stateHighlight:State;

        /** 选中的状态 */
        stateSelected:State;
        
        /** 点击频度限制 */
        eps:number = 3;

        _signalConnected(sig:string, s?:Slot) {
            super._signalConnected(sig, s);
            if (sig == SignalClicked)
                s.eps = this.eps;
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalClicked);
        }

        isSelection():boolean {
            return this._isSelected;
        }

        protected _isSelected:boolean;
    }

    export abstract class CScrollView
    extends Component
    {
        constructor(cnt?:CComponent) {
            super();
            if (cnt)
                this.contentView = cnt;
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalScrollBegin);
            this._signals.register(SignalScrollEnd);
            this._signals.register(SignalScrolled);
        }
        
        /** 指示条是否嵌入页面中，否则浮在页面上 */
        floatingIdentifier = true;

        /** 内容页面 */
        contentView:CComponent;

        /** 内容大小 */
        contentSize:Point;

        /** 滚动的偏移 */
        protected _contentOffset = new Point();
        get contentOffset():Point {
            return this._contentOffset;
        }
        set contentOffset(pt:Point) {
            this.setContentOffset(pt, 0);
        }

        /** 带动画的偏移
            @note 注意会引起 ScrollEnd 的消息
         */
        setContentOffset(pt:Point, duration:number) {
            this._contentOffset = pt;
        }

        setContentOffsetX(v:number, duration:number) {
            let pt = new Point(v, this._contentOffset.y);
            this.setContentOffset(pt, duration);
        }
        
        setContentOffsetY(v:number, duration:number) {
            let pt = new Point(this._contentOffset.x, v);
            this.setContentOffset(pt, duration);
        }

        /** 显示中的区域 */
        regionBounds:Rect;

        /** 计算内容的大小 */
        abstract boundsForContent():Rect;

        /** 指示条，需要实现 IProgress */
        verticalIdentifier:CComponent;
        horizonIdentifier:CComponent;

        /** 内容的边距 */
        contentEdgeInsets:EdgeInsets;

        /** 当滚动 */
        onPositionChanged() {
            if (this._signals)
                this._signals.emit(SignalScrolled);            
        }

        /** 停止滚动 */
        stopDecelerating() {}

        /** 使用scroll包裹一个空间来滑动 */
        static Wrapper(ui:CComponent):CScrollView {
            let cls = ObjectClass(this);
            let scl:CScrollView = new cls(ui);
            // 内容改变时刷新
            if (ui instanceof CBitmap ||
                ui instanceof CLabel)
            {
                ui.signals.redirect(SignalChanged, SignalConstriantChanged);
            }
            let rc = ui.bestFrame();
            scl.contentSize = rc.size;
            ui.signals.connect(SignalConstriantChanged, ()=>{
                let bst:Rect;
                if (ui instanceof CLabel) {
                    let lbl = <CLabel>ui;
                    let cnt = scl.boundsForContent();
                    if (lbl.multilines)
                        bst = ui.bestFrame(new nn.Rect(0, 0, cnt.width, 0));
                    else
                        bst = ui.bestFrame(new nn.Rect(0, 0, 0, cnt.height));
                } else {
                    bst = ui.bestFrame();
                }
                scl.contentSize = bst.size;
            }, this);
            return scl;
        }
    }

    export abstract class CDom
    extends Component
    {
        /** html源代码 */
        text:string;
    }

    export abstract class CTween
    {
        /** 激活一个对象添加动画 */
        static Get(c:CComponent, props?:any):any {
            return null;
        }

        /** 删除对象的全部动画 */
        static Stop(c:CComponent) {
        }
    }
}
