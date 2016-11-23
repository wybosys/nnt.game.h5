class TButton
extends nn.Button
{
    constructor() {
        super();
        //this.backgroundEdgeInsets = new nn.EdgeInsets(20, 0, 20, 0);
        this.eps = 1;

        let tc = nn.Color.Random();
        let bc = tc.clone().invert();
        this.stateNormal = nn.State.Color(tc, bc);
        this.stateHighlight = nn.State.Color(bc, tc);
        this.stateDisabled = nn.State.Color(nn.Color.White, nn.Color.Gray);

        this.signals.connect(nn.SignalClicked, ()=>{
            nn.noti("点击 TButton");
        }, this);
    }    
}

let FEATURES = [
    {text:'TABLE'},
    {text:'HOVTABLE'},
    {text:'GRAPHICS'},
    {text:'ANIMATION'},
    {text:'DESKTOP'},
    {text:'API'},
    {text:'BONES'},
    {text:'PARTICLE'},
    {text:'DYNAMIC'},
    {text:'WIDGET'},
    {text:'IMGFILTER'},
    {text:'UNIT-TEST'},
    {text:'MEDIA'},
    {text:'SERVICE'},
    {text:'LAYOUT'},
    {text:'TILEDMAP'},
    {text:'COLLECTION'},
    {text:'TRANSFORM'},
    {text:'TBENCHMARK'},
    {text:'LAPACK'},
    {text:'CODEC'}
];

class TSignalObject
extends nn.SObject
{
    constructor() {
        super();
        this.signals.register("echo");
    }
    msg:string;
    echo() {
        nn.info(this.msg);
    }
}

class MainScene
extends nn.Sprite
{
    constructor() {
        super();
        //this.cacheEnabled = true;
        this.backgroundColor = nn.Color.White;
    }

    setFrame(rc:nn.Rect) {
        super.setFrame(rc);
    }

    private _rows = 3;
    private _cols = 8;

    onAppeared() {
        super.onAppeared();
        nn.noti("MainScene Appeared");
    }

    onDisappeared() {
        super.onDisappeared();
        nn.noti("MainScene Disappeared");
    }

    onLoaded() {
        super.onLoaded();
        for (let i = 0; i < this._rows; i++) {
            for (let j = 0; j < this._cols; j++) {
                let idx = i * this._cols + j;                
                this.reuse(idx, function():any {
                    let btn = new TButton();
                    btn.tag = idx;
                    let fea = FEATURES[idx];
                    if (fea) {
                        btn.text = fea.text;
                        if (nn.HasMethod(this, '_cb' + idx)) {
                            btn.signals.connect(nn.SignalClicked, nn.Method(this, '_cb' + idx), this);
                        }
                    }
                    return btn;
                }, this);
            }
        }

        //  test signals
        let a = new TSignalObject();
        a.msg = "A";
        let b = new TSignalObject();
        b.msg = "B";
        a.signals.connect("echo", b.echo, b).count = 2;
        b.signals.connect("echo", a.echo, a);
        //a.signals.disconnect("echo", b.echo, b);
        //b.dispose();
        for (let i = 0; i < 3; ++i)
            a.signals.emit("echo");     

        let tmrrt = new nn.RtTimer(5, 2);
        let tmrst = new nn.SysTimer(5, 2);
        tmrrt.signals.connect(nn.SignalAction, ()=>{nn.noti("REAL TIMER NOW");}, this);
        tmrst.signals.connect(nn.SignalAction, ()=>{nn.noti("SYS TIMER NOW");}, this);
        tmrrt.signals.connect(nn.SignalDone, ()=>{nn.noti("REAL TIMER DONE");}, this);
        tmrst.signals.connect(nn.SignalDone, ()=>{nn.noti("SYS TIMER DONE");}, this);
        //tmrrt.start();
        //tmrst.start();

        let cotmr = new nn.CoTimer();
        cotmr.backgroundMode = true;
        let tmritem = cotmr.add(5, 2);
        tmritem.signals.connect(nn.SignalAction, ()=>{nn.noti("CO TIMER NOW");}, this);
        tmritem.signals.connect(nn.SignalDone, ()=>{nn.noti("CO TIMER DONE");}, this);
        //cotmr.start();

        let rstmr = cotmr.add(10, 1);
        rstmr.signals.connect(nn.SignalDone, (s:nn.Slot)=>{
            nn.noti("RS TIMER DONE");
            rstmr.reset(10, 1, s.data);
        }, this);
        //rstmr.start();

        /*
        let btn = new nn.Bitmap();
        btn.imageSource = "btn_png";
        btn.setFrame(new nn.Rect(100, 300, 200, 100));
        this.addChild(btn);

        // 调试缩放
        let bmp0 = new nn.Bitmap();
        bmp0.backgroundColor = nn.Color.White;
        bmp0.setFrame(new nn.Rect(100, 300, 800, 54));
        bmp0.imageSource = "loading_png";
        this.addChild(bmp0);

        let bmp1 = new nn.Bitmap();
        bmp1.setFrame(new nn.Rect(100, 300, 800, 54).clipCenter(0, 22).add(20, -5, -105, 0));
        bmp1.imageSource = "loadingval_png";
        this.addChild(bmp1);

        let lblp = new nn.Label();
        let rc = new nn.Rect(0, 0, 70, 30);
        rc.rightCenter = bmp0.frame().rightCenter.add(-23, -6);
        lblp.setFrame(rc);
        lblp.bold = true;
        lblp.fontSize = 20;            
        lblp.textColor = 0x7BAF5E;
        lblp.text = "100%";
        lblp.textAlign = "right";
        this.addChild(lblp);
        */
    }
    
    updateLayout() {
        super.updateLayout();

        let box = new nn.VBox(this);
        for (let i = 0; i < this._rows; i++) {
            box.addFlexHBox(1, (box:nn.HBox, i:any) => {
                for (let j = 0; j < this._cols; j++) {
                    let idx = i * this._cols + j;
                    box.addFlex(1, this.reuse(idx));
                }
            }, null, i);
        }
        box.apply();
    }

    _cb0() {
        let v = new TTableNormal();
        nn.Application.shared.viewStack.push(v);
    }

    _cb1() {
        let v = new TTableHov();
        nn.Application.shared.viewStack.push(v);
    }

    _cb2() {
        let v = new TGraphics();
        nn.Application.shared.viewStack.push(v);
    }

    _cb3() {
        let v = new TAnimation();
        nn.Application.shared.viewStack.push(v);
    }

    _cb4() {
        let v = new TDesktop();
        nn.Application.shared.viewStack.push(v);
    }

    _cb5() {
        let v = new TApi();
        nn.Application.shared.viewStack.push(v);
    }

    _cb6() {
        let v = new TBones();
        nn.Application.shared.viewStack.push(v);
    }

    _cb7() {
        let v = new TParticle();
        nn.Application.shared.viewStack.push(v);
    }

    _cb8() {
        //let v = new TDynamic();
        //nn.Application.shared.viewStack.push(v);
    }

    _cb9() {
        let v = new TWidgets();
        nn.Application.shared.viewStack.push(v);
    }

    _cb10() {
        let v = new TImageFilter();
        nn.Application.shared.viewStack.push(v);        
    }

    _cb11() {
        let v = new TUnitTest();
        nn.Application.shared.viewStack.push(v);
    }

    _cb12() {
        let v = new TSound();
        nn.Application.shared.viewStack.push(v);
    }

    _cb13() {
        let v = new TServices();
        nn.Application.shared.viewStack.push(v);
    }

    _cb14() {
        let v = new TLayout();
        nn.Application.shared.viewStack.push(v);
    }

    _cb15() {
        let v = new TTiledMap();
        nn.Application.shared.viewStack.push(v);
    }

    _cb16() {
        let v = new TCollection();
        nn.Application.shared.viewStack.push(v);
    }

    _cb17() {
        let v = new TTransform();
        nn.Application.shared.viewStack.push(v);
    }

    _cb18() {
        let v = new TBenchmark();
        nn.Application.shared.viewStack.push(v);
    }

    _cb19() {
        let v = new TLapack();
        nn.Application.shared.viewStack.push(v);
    }

    _cb20() {
        let v = new TCodec();
        nn.Application.shared.viewStack.push(v);
    }
}
