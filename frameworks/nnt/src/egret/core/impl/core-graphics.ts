module nn {

    export class Graphics
    extends CGraphics
    {        
    }

    Pen.setIn = (context:egret.Graphics, pen:Pen)=>{
        context.lineStyle(pen.width, pen.color.rgb, pen.color.alphaf);
    };

    Brush.setIn = (context:egret.Graphics, br:Brush, old:Brush)=>{
        if (old)
            context.endFill();
        if (br)
            context.beginFill(br.color.rgb, br.color.alphaf);
    };

    GLine.renderIn = (context:egret.Graphics, cmd:GLine)=>{
        context.moveTo(cmd.start.x, cmd.start.y);
        context.lineTo(cmd.end.x, cmd.end.y);
    };

    GBezier.renderIn = (context:egret.Graphics, cmd:GBezier)=>{
        context.cubicCurveTo(cmd.controlA.x, cmd.controlA.y, cmd.controlB.x, cmd.controlB.y, cmd.anchor.x, cmd.anchor.y);
    };

    GCurve.renderIn = (context:egret.Graphics, cmd:GCurve)=>{
        context.curveTo(cmd.control.x, cmd.control.y, cmd.anchor.x, cmd.anchor.y);
    };

    GArc.renderIn = (context:egret.Graphics, cmd:GArc)=>{
        let enda = cmd.end ? cmd.end.angle : (cmd.start.angle + cmd.sweep.angle);
        context.drawArc(cmd.center.x, cmd.center.y, cmd.radius, cmd.start.angle, enda, cmd.ccw);
    };

    GCircle.renderIn = (context:egret.Graphics, cmd:GCircle)=>{
        context.drawCircle(cmd.center.x, cmd.center.y, cmd.radius);
    };

    GEllipse.renderIn = (context:egret.Graphics, cmd:GEllipse)=>{
        context.drawEllipse(cmd.center.x, cmd.center.y, cmd.width, cmd.height);
    };

    GRect.renderIn = (context:egret.Graphics, cmd:GRect)=>{
        if (cmd.round || cmd.ellipseWidth || cmd.ellipseHeight) {
            let w = cmd.ellipseWidth, h = cmd.ellipseHeight;
            if (cmd.round)
                w = h = cmd.round;
            context.drawRoundRect(cmd.rect.x, cmd.rect.y, cmd.rect.width, cmd.rect.height, w, h);
        }
        else {
            context.drawRect(cmd.rect.x, cmd.rect.y, cmd.rect.width, cmd.rect.height);
        }
    };
    
}