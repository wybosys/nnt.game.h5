class TGraphics
extends nn.Sprite
{
    constructor() {
        super();

        let g = new nn.Graphics();
        g.pen = new nn.Pen(nn.Color.Red, 5);
        g.brush = new nn.Brush(nn.Color.Blue);

        {
            let e = new nn.GRect();
            e.rect = new nn.Rect(100, 100, 100, 100);
            g.draw(e);

            e = new nn.GRect();
            e.rect = new nn.Rect(130, 130, 50, 50);
            g.draw(e);
        }
        
        this.paint(g);
    }

}
    
