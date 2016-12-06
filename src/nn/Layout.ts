module nn {
    
    export abstract class Layout
    {
        constructor(ctx?:any) {
            this._ctx = ctx;
        }

        // 是否使用 anchor，默认为 false
        anchor:boolean;
        useAnchor(b:boolean):this {
            this.anchor = b;
            return this;
        }

        protected _ctx:any;        
        protected _rc:Rect;
        protected _orc:Rect;
        protected _offset:number;

        /** 把 layout 放到某一个具有 bounds 函数的对象中， apply 时的 rect 会变成 bounds */
        view:any;

        /** 设置整体大小 */
        setRect(rc:Rect):this {
            if (this._orc == null) {
                this._orc = rc;
            } else {
                this._orc.x = rc.x;
                this._orc.y = rc.y;
                this._orc.width = rc.width;
                this._orc.height = rc.height;
            }
            this._rc = this._orc.clone().applyEdgeInsets(this.edgeInsets);
            return this;
        }

        /** 获得整体大小 */
        get frame():Rect {
            this._avaRect();
            return this._orc.clone();
        }
        set frame(rc:Rect) {
            this.setRect(rc);
        }
        
        // 初始化 rect
        protected _avaRect():boolean {
            if (this._orc)
                return false;
            
            if (this._ctx) {
                this._orc = this._ctx.boundsForLayout();
            } else {
                this._orc = new Rect();
                nn.warn("没有设置 Box 的 Rect");
            }
            this._rc = this._orc.clone().applyEdgeInsets(this.edgeInsets);
            return true;
        }

        frameForLayout():Rect {
            this._avaRect();
            return this._rc.clone();
        }

        edgeInsets:EdgeInsets;
        
        /** 设置布局的边距 */
        padding(ei:EdgeInsets):this {
            this.edgeInsets = ei;
            if (this._avaRect() == false)
                this._rc = this._orc.clone().applyEdgeInsets(this.edgeInsets);
            return this;
        }

        /** 偏移 */
        offset(pt:Point):this {
            this._avaRect();
            this._orc.offset(pt);
            this._rc.offset(pt);
            return this;
        }

        /** 应用布局 */
        apply() {
            // 确保 rect 不是 null
            this._avaRect();
            this._offset = 0;
            
            // 如果有依赖的 view，则之后的布局均按照在 view 内部布局来处理
            if (this.view) {
                this.view.setFrame(this._rc);
                this.setRect(this.view.boundsForLayout());
            }

            // 不能在此处理结束，由子类负责
        }

        /** 布局结束的回调 */
        protected _cbcomplete:(lyt:Layout)=>void;
        protected _ctxcomplete:any;
        complete(cb:(lyt:Layout)=>void, ctx?:any) {
            this._cbcomplete = cb;
            this._ctxcomplete = ctx;
        }

        /** 清空布局 */
        abstract clear();
    }

    type layoutcb_t = ((obj:any, rc:Rect) => void)|((obj:any, rc:Rect, data:any) => void);
    type hboxcb_t = ((box:HBox) => void) | ((box:HBox, data:any) => void);
    type vboxcb_t = ((box:VBox) => void) | ((box:VBox, data:any) => void);

    class LinearSegment {
        val:number;
        isp:boolean;
        obj:any;
        anchor:boolean;
        
        cb:layoutcb_t;
        ctx:any;
        data:any;

        dispose() {
            this.obj = undefined;
            this.cb = undefined;
            this.ctx = undefined;
            this.data = undefined;
        }

        setRect(x:number, y:number, w:number, h:number) {
            if (this.cb)
            {
                this.cb.call(this.ctx, this.obj, new Rect(x, y, w, h), this.data);
            }
            else if (this.obj &&
                     this.obj instanceof CComponent)
            {
                this.obj.setFrame(new Rect(x, y, w, h), this.anchor);
            }
        }
    }

    export abstract class LinearLayout
    extends Layout
    {
        /** 获得总长 */
        abstract length():number;

        /** 获得对边长 */
        abstract against():number;

        /** 设置每段的长度
            @note 长度、段、第几份，返回具体设置了多长，可以通过修改return来做到附加偏移
         */
        protected abstract setSegmentLength(len:number, seg:LinearSegment, idx:number):number;
        protected _segments = new Array<LinearSegment>();

        /** 间距 */
        spacing:number = 0;

        setSpacing(v:number):this {
            this.spacing = v;
            return this;
        }

        clear() {
            nn.ArrayT.Clear(this._segments, (o:LinearSegment)=>{
                o.dispose();
            });
        }

        /** 按照像素划分 */
        addPixel(pixel:number, obj?:any, cb?:layoutcb_t, ctx?:any, data?:any):this {
            var seg = new LinearSegment();
            seg.val = pixel;
            seg.isp = true;
            seg.obj = obj;
            seg.cb = cb;
            seg.ctx = ctx ? ctx : this._ctx;
            seg.data = data;
            seg.anchor = this.anchor;
            this._segments.push(seg);
            return this;
        }

        /** 按照定比来划分，总比例为各个 flex 之和，每一个 flex 的长度为 (总长 - 固定像素长) / 总 flex */
        addFlex(flex:number, obj?:any, cb?:layoutcb_t, ctx?:any, data?:any):this {
            var seg = new LinearSegment();
            seg.val = flex;
            seg.isp = false;
            seg.obj = obj;
            seg.cb = cb;
            seg.ctx = ctx ? ctx : this._ctx;
            seg.data = data;
            seg.anchor = this.anchor;
            this._segments.push(seg);
            return this;
        }

        addPixelHBox(pixel:number, boxcb:hboxcb_t, ctx?:any, data?:any):this {
            this.addPixel(pixel, null, <any>function(obj:any, rc:Rect, data:any) {
                var box = new HBox(this).setRect(rc);
                boxcb.call(this, box, data);
                box.apply();
            }, ctx, data);
            return this;
        }

        addPixelVBox(pixel:number, boxcb:vboxcb_t, ctx?:any, data?:any):this {
            this.addPixel(pixel, null, <any>function(obj:any, rc:Rect, data:any) {
                var box = new VBox(this).setRect(rc);
                boxcb.call(this, box, data);
                box.apply();
            }, ctx, data);
            return this;
        }

        addFlexHBox(flex:number, boxcb:hboxcb_t, ctx?:any, data?:any):this {
            this.addFlex(flex, null, <any>function(obj:any, rc:Rect, data:any) {
                var box = new HBox(this).setRect(rc);
                boxcb.call(this, box, data);
                box.apply();
            }, ctx, data);
            return this;
        }

        addFlexVBox(flex:number, boxcb:vboxcb_t, ctx?:any, data?:any):this {
            this.addFlex(flex, null, <any>function(obj:any, rc:Rect, data:any) {
                var box = new VBox(this).setRect(rc);
                boxcb.call(this, box, data);
                box.apply();
            }, ctx, data);
            return this;
        }

        addAspect(w:number, h:number, obj?:any, cb?:layoutcb_t, ctx?:any, data?:any):this {
            return this.addPixel(w/h*this.against(), obj, cb, ctx, data);
        }

        addAspectHBox(w:number, h:number, boxcb:hboxcb_t, ctx?:any, data?:any):this {
            return this.addPixelHBox(w/h*this.against(), boxcb, ctx, data);
        }

        addAspectVBox(w:number, h:number, boxcb:vboxcb_t, ctx?:any, data?:any):this {
            return this.addPixelVBox(w/h*this.against(), boxcb, ctx, data);
        }

        apply() {
            super.apply();
            
            // 计算所有的定长度，扣除后，计算所有的占比和单份占比
            var sumpixel = 0, sumflex = 0;
            this._segments.forEach((seg)=>{
                if (seg.isp)
                    sumpixel += seg.val;
                else
                    sumflex += seg.val;
            }, this);
            var lftlen = this.length() - sumpixel;
            var seglen = sumflex ? lftlen / sumflex : 0;
            // 应用长度
            this._segments.forEach((seg:LinearSegment, idx:number)=>{
                var val = 0;
                if (seg.isp)
                    val = seg.val;
                else
                    val = seg.val * seglen;
                this._offset += this.setSegmentLength(val, seg, idx);
            }, this);

            // 处理结束
            if (this._cbcomplete)
                this._cbcomplete.call(this._ctxcomplete ? this._ctxcomplete : this._ctx);
            
            // 清空
            this.clear();
        }

        // 获得间距占的长度
        protected _spacingsLength():number {
            let self = this;
            if (self.spacing == 0)
                return 0;
            let cnt = self._segments.length;
            if (cnt > 1)
                return self.spacing * (cnt - 1);
            return 0;
        }

        // 一些工具函数
        
        // 按照比例来从中间拿出固定大小
        clipPixel(pix:number, obj:any, lflex = 1, rflex = 1,
                  cb?:layoutcb_t, ctx?:any, data?:any):this
        {
            if (lflex != 0)
                this.addFlex(lflex);            
            this.addPixel(pix, obj, cb, ctx, data);
            if (rflex != 0)
                this.addFlex(rflex);
            return this;
        }

        clipFlex(flex:number, obj:any, lpix:number, rpix:number,
                 cb?:layoutcb_t, ctx?:any, data?:any):this
        {
            if (lpix != 0)
                this.addPixel(lpix)
            this.addFlex(flex, obj, cb, ctx, data);
            if (rpix != 0)
                this.addPixel(rpix);
            return this;
        }

        clipPixelHBox(pix:number, boxcb:hboxcb_t, lflex = 1, rflex = 1,
                      ctx?:any, data?:any):this
        {
            if (lflex != 0)
                this.addFlex(lflex);
            this.addPixelHBox(pix, boxcb, ctx, data);
            if (rflex != 0)
                this.addFlex(rflex);
            return this;
        }

        clipFlexHBox(flex:number, boxcb:hboxcb_t, lpix:number, rpix:number,
                     ctx?:any, data?:any):this
        {
            if (lpix != 0)
                this.addPixel(lpix);            
            this.addFlexHBox(flex, boxcb, ctx, data);
            if (rpix != 0)
                this.addPixel(rpix);
            return this;
        }

        clipPixelVBox(pix:number, boxcb:vboxcb_t, lflex = 1, rflex = 1,
                      ctx?:any, data?:any):this
        {
            if (lflex != 0)
                this.addFlex(lflex);            
            this.addPixelVBox(pix, boxcb, ctx, data);
            if (rflex != 0)
                this.addFlex(rflex);
            return this;
        }

        clipFlexVBox(flex:number, boxcb:vboxcb_t, lpix:number, rpix:number,
                     ctx?:any, data?:any):this
        {
            if (lpix != 0)
                this.addPixel(lpix);
            this.addFlexVBox(flex, boxcb, ctx, data);
            if (rpix != 0)
                this.addPixel(rpix);
            return this;
        }
    }

    export class HBox
    extends LinearLayout
    {
        constructor(ctx?:any) {
            super(ctx);
        }
        
        length():number {
            return this._rc.width - this._spacingsLength();
        }

        against():number {
            this._avaRect();
            return this._rc.height;
        }
        
        protected setSegmentLength(len:number, seg:LinearSegment, idx:number):number {
            let self = this;
            seg.setRect(self._offset + self._rc.x, self._rc.y,
                        len, self._rc.height);
            if (self.spacing && (idx + 1) < self._segments.length)
                len += self.spacing;
            return len;
        }        
    }

    export class VBox
    extends LinearLayout
    {
        constructor(ctx?:any) {
            super(ctx);
        }
        
        length():number {
            return this._rc.height - this._spacingsLength();
        }

        against():number {
            this._avaRect();
            return this._rc.width;
        }

        protected setSegmentLength(len:number, seg:LinearSegment, idx:number):number {
            var self = this;
            seg.setRect(self._rc.x, self._offset + self._rc.y,
                        self._rc.width, len);
            if (self.spacing && (idx + 1) < self._segments.length)
                len += self.spacing;
            return len;
        }
    }
    
    type layoutflowcb_t = (obj:any, rc:Rect, data?:any) => void;
    
    export enum FlowOption {
        Fix = 0,
        Stretch = 1,
    };

    class FlowSegment {

        w:number;
        h:number;
        obj:any;
        anchor:boolean;
        option:FlowOption;
        
        cb:layoutflowcb_t;
        ctx:any;
        data:any;
        
        dispose() {
            this.obj = undefined;
            this.cb = undefined;
            this.ctx = undefined;
            this.data = undefined;
        }

        setRect(x:number, y:number, w:number) {
            if (this.cb)
            {
                this.cb.call(this.ctx, this.obj, new Rect(x, y, w, this.h), this.data);
            }
            else if (this.obj &&
                     this.obj instanceof CComponent)
            {
                this.obj.setFrame(new Rect(x, y, w, this.h), this.anchor);
            }
        }
    }
    
    export class HFlow
    extends Layout
    {
        constructor(ctx?:any) {
            super(ctx);
        }

        clear() {
            nn.ArrayT.Clear(this._segments, (o:FlowSegment)=>{
                o.dispose();
            });
        }
        
        protected _segments = new Array<FlowSegment>();
        
        addSize(w:number, h:number, option:FlowOption = 0,
                obj?:any, cb?:layoutflowcb_t, ctx?:any, data?:any):HFlow
        {
            var seg = new FlowSegment();
            seg.w = w;
            seg.h = h;
            seg.option = option;
            seg.obj = obj;
            seg.cb = cb;
            seg.ctx = ctx ? ctx : this._ctx;
            seg.data = data;
            seg.anchor = this.anchor;
            this._segments.push(seg);
            return this;
        }

        position:Point;        

        apply() {
            super.apply();
            this._avaRect();
            
            this.position = this._rc.leftTop;
            var w = this._rc.width;
            var h = this._rc.height;
            
            // 按照行划分格子
            var sw = 0, sh = 0;
            var rows = new Array<FlowSegment>();
            this._segments.forEach((seg)=>{
                if (sw + seg.w <= w)
                {
                    sw += seg.w;
                    if (sh < seg.h)
                        sh = seg.h;
                    rows.push(seg);
                }
                else
                {                    
                    // 超出了当前行的宽度，需要换行并应用掉
                    this.applyRows(rows, this.position, w);
                    nn.ArrayT.Clear(rows);
                    
                    // 开始下一行
                    this.position.y += sh;
                    sw = seg.w;
                    sh = seg.h;
                    rows.push(seg);
                }
            }, this);
            
            // 如果最后一行没有遇到换行，则需要附加计算一次
            if (rows.length)
            {
                this.applyRows(rows, this.position, w);
                nn.ArrayT.Clear(rows);
                this.position.y += sh;
            }

            // 处理结束
            if (this._cbcomplete)
                this._cbcomplete.call(this._ctxcomplete ? this._ctxcomplete : this._ctx);

            // 清理
            this.clear();
        }

        protected applyRows(rows:Array<FlowSegment>, pos:Point, w:number) {
            this._offset = 0;
            
            // 和 linear 的 flex 算法类似
            var flex = 0, pix = 0;
            rows.forEach((seg)=>{
                if (seg.option == FlowOption.Stretch)
                    flex += 1;                  
                pix += seg.w;
            }, this);
            
            // 计算可以拉伸的控件需要拉大多少
            flex = flex ? ((w - pix) / flex) : 0;
            // 布局
            rows.forEach((seg)=>{
                var w = seg.w;
                if (seg.option == FlowOption.Stretch)
                    w += flex;
                seg.setRect(this._offset + pos.x, pos.y,
                            w);
                this._offset += w;
            });
        }
    }    
}
