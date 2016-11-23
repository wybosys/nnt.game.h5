class TLapack
extends nn.Sprite
{
    constructor() {
        super();
        this.backgroundColor = nn.Color.White;
        
        //this.cartesianEnabled = true;
        //this.transformChildren = new nn.Transform2d().rotate(nn.Angle.ANGLE(45));
        
        nn.ArrayT.FillType(this.blocks, 15, TButton).forEach((btn:TButton, idx:number)=>{
            // 默认坐标系统会自动规整，造成变换后失真，所以浮点化
            btn.floatCoordinate = true;
            btn.frame = new nn.Rect(0, 0, 100, 100);
            btn.text = idx + '';
            this.addChild(btn);
        }, this);

        this.signals.connect(nn.SignalTouchMove, this._cbTouchChanged, this);
    }

    blocks = new Array<TButton>();
    
    updateLayout() {
        super.updateLayout();
        var rc = this.boundsForLayout();
        for (let r = 0; r < 5; ++r) {
            for (let c = 0; c < 3; ++c) {
                let btn = this.blocks[r * 3 + c];
                btn.translate = rc.center;
                btn.setCenter(new nn.Point(200*(c-1), 200*(r-2)));
            }
        }
    }

    /*
      boundsForCartesian():hd.Rect {
      let rc = this.frame;
        rc.position = rc.center;
        return rc;
    }
    */

    private _ang = new nn.Angle();
    private _cbTouchChanged() {
        var ang = nn.Angle.ANGLE(this.touch.delta.x);
        this._ang.add(ang);
        nn.noti("角度 " + this._ang);
        
        var mat = new nn.Transform2d().rotate(ang);
        this.blocks.forEach((btn:TButton)=>{            
            let pt = new nn.Vector2d().copy(btn.frame.center).subPoint(btn.translate);
            btn.setCenter(pt.applyTransform(mat));
        });        
    }
}