module eui {

    export class ScrollerU
    extends eui.Scroller
    {
        onPartBinded(name:string, target:any) {
            _EUIExt.onPartBinded(this, name, target);
        }

        static FromView(e:egret.DisplayObject):ScrollerU {
            return <any>nn.findParentByType(e, ScrollerU);
        }

        scrollToEdge(e:egret.DisplayObject, edge:nn.EDGE) {
            let dst = nn.getBounds(e);
            let src = nn.getBounds(this);
            src.edgeTo(dst, edge);
            let pt = src.position;
            if (pt.x < 0)
                pt.x = 0;
            if (pt.y < 0)
                pt.y = 0;
            this.contentOffset = pt;
        }

        get contentOffset():nn.Point {
            let vp = this.viewport;
            if (vp == null)
                return new nn.Point();
            return new nn.Point(vp.scrollH, vp.scrollV);
        }

        set contentOffset(pt:nn.Point) {
            let vp = this.viewport;
            vp.scrollH = pt.x;
            vp.scrollV = pt.y;
        }

        dispose() {
        }

        drop() {
            this.dispose();
        }

        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.drop();
        }
    }
    
}
