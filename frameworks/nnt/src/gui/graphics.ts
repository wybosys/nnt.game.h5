module nn {

    export class Pen {
        
        constructor(c:Color, width = 1) {
            this.color = c;
            this.width = width;
        }
        
        color:Color;
        width:number;

        clone():this {
            let r = InstanceNewObject(this);
            r.color = this.color;
            r.width = this.width;
            return r;
        }

        static setIn:(context:any, pen:Pen)=>void;
    }

    export class Brush {
        
        constructor(c:Color) {
            this.color = c;
        }
        
        color:Color;

        clone():this {
            let r = InstanceNewObject(this);
            r.color = this.color;
            return r;
        }

        static setIn:(context:any, brush:Brush, pre:Brush)=>void;
    }

    class _GState {
        pen:Pen;
        brush:Brush;
    }

    export class GCommand {
        pen:Pen;
        brush:Brush;
        static renderIn:(context:any, cmd:GCommand)=>void;
    }

    export class GLine extends GCommand {
        start:Point;
        end:Point;
    }

    export class GBezier extends GCommand {
        controlA:Point;
        controlB:Point;
        anchor:Point;
    }

    export class GCurve extends GCommand {
        control:Point;
        anchor:Point;
    }

    export class GArc extends GCommand {
        center:Point;
        radius:number;
        start:Angle;
        end:Angle;
        sweep:Angle;
        ccw:boolean;
    }

    export class GCircle extends GCommand {
        center:Point;
        radius:number;
    }

    export class GEllipse extends GCommand {
        center:Point;
        width:number;
        height:number;
    }

    export class GRect extends GCommand {
        rect:Rect;
        round:number;
        ellipseWidth:number;
        ellipseHeight:number;
    }

    export abstract class CGraphics
    {           
        pushState() {
            let s = new _GState();
            s.pen = this.pen.clone();
            s.brush = this.brush.clone();
            this._states.push(s);
        }

        popState() {
            let s = ArrayT.RemoveObjectAtIndex(this._states, this._states.length - 1);
            this.pen = s ? s.pen : null;
            this.brush = s ? s.brush : null;
        }
        
        draw(c:GCommand) {
            if (!c.pen)
                c.pen = this.pen;
            if (!c.brush)
                c.brush = this.brush;
            this._commands.push(c);
        }

        pen:Pen;
        brush:Brush;

        private _states = new Array<_GState>();
        protected _commands = new Array<GCommand>();

        renderIn(context:any) {
            let p:Pen;
            let b:Brush;
            this._commands.forEach((c:GCommand)=>{
                if (p != c.pen) {
                    Pen.setIn(context, c.pen);
                    p = c.pen;
                }
                if (b != c.brush) {
                    Brush.setIn(context, c.brush, b);
                    b = c.brush;
                }
                ObjectClass(c).renderIn(context, c);
            });
            if (b != null)
                Brush.setIn(context, null, b);
        }
    }
    
}