
class TConvertTest
extends nn.Sprite
{
    constructor() {
        super();
        this.edgeInsets = new nn.EdgeInsets(30, 30, 30, 30);
        this.backgroundColor = nn.Color.Random();
        this.label.text = 'SOURCE';
        this.label.backgroundColor = nn.Color.Random();
        this.addChild(this.label);

        nn.Application.shared.gameLayer.signals.connect(nn.SignalClicked, this._actGlobalClicked, this);
    }

    updateLayout() {
        super.updateLayout();
        this.label.setFrame(this.boundsForLayout());
    }

    label = new nn.Label();

    _actGlobalClicked(s:nn.Slot) {
        var touch = s.data;
        var center = this.bounds().center;
        
        // 增加一个动画view从当前的中心动画到鼠标的位置
        var v = new nn.Sprite();
        v.anchor = new nn.Point(0.5, 0.5);
        v.backgroundColor = nn.Color.Random();
        var rc = new nn.Rect(center.x, center.y, 50, 50);
        rc = this.convertRectTo(rc, this.parent);
        v.setFrame(rc);
        this.parent.addChild(v);

        // 做动画
        var pos = touch.positionInView(this.parent);
        new nn.Animate().bind(v).to(1, null, (ani:nn.Animator)=>{
            ani.moveto(pos);
        }, this).play();
    }
}

class TAnimation
extends nn.Sprite
{
    constructor() {
        super();
        this.transitionObject = new nn.TransitionNavigation();

        this.backgroundColor = nn.Color.White;
        this.edgeInsets = new nn.EdgeInsets(100, 100, 100, 100);

        var btn = new TButton();
        btn.text = "SlideIn";
        btn.tag = 0;
        btn.signals.connect(nn.SignalClicked, (s:nn.Slot) => {
            new nn.Animate().inTo(1, (ani:nn.Animator) => {
                ani.backMode = true;
                ani.moveto(new nn.Point(s.sender.frame.width, 0)).fadeIn();
            }, this).bind(s.sender).play();
        }, this);
        this.addChild(btn);        
        this._btns.push(btn);

        btn = new TButton();
        btn.text = "SlideOut";
        btn.tag = 1;
        btn.signals.connect(nn.SignalClicked, (s:nn.Slot) => {
            new nn.Animate().bind(s.sender).inTo(1, (ani:nn.Animator) => {
                ani.moveto(new nn.Point(s.sender.frame.width, 0)).fadeOut();
            }, this).play();
        }, this);
        this.addChild(btn);        
        this._btns.push(btn);

        btn = new TButton();
        btn.text = "Tremble";
        btn.tag = 2;
        btn.anchor = new nn.Point(0.5, 0.5);
        btn.signals.connect(nn.SignalClicked, (s:nn.Slot) => {
            new nn.Animate().bind(s.sender).tremble().play();
        }, this);
        this.addChild(btn);        
        this._btns.push(btn);

        btn = new TButton();
        btn.text = "SCALE";
        btn.tag = 3;
        btn.anchor = new nn.Point(0.5, 0.5);
        btn.signals.connect(nn.SignalClicked, (s:nn.Slot) => {
            new nn.Animate().bind(s.sender).inTo(1, (ani:nn.Animator) => {
                ani.scale(new nn.Size(0.5, 0.5));
            }, this).play();
        }, this);
        this.addChild(btn);        
        this._btns.push(btn);

        btn = new TButton();
        btn.text = "TWEEN";
        btn.anchor = new nn.Point(0.5, 0.5);
        btn.signals.connect(nn.SignalClicked, (s:nn.Slot) => {
            nn.Tween.Get(s.sender)
                .call(()=>{ nn.noti('0'); })
                .to({'x':500}, 1000)
                .call(()=>{ nn.noti('1'); })
                .wait(1000)
                .call(()=>{ nn.noti('2'); })
            ;
        }, this);
        this.addChild(btn);        
        this._btns.push(btn);

        btn = new TButton();
        btn.text = "GROUP";
        btn.anchor = new nn.Point(0.5, 0.5);
        btn.signals.connect(nn.SignalClicked, (s:nn.Slot) => {
            new nn.AnimateGroup()
                .add(new nn.Animate().bind(nn.findElementsByTag(this, 0)[0]).tremble())
                .next(new nn.Animate().bind(nn.findElementsByTag(this, 1)[0]).tremble())
                .add(new nn.Animate().bind(nn.findElementsByTag(this, 2)[0]).tremble())
                .play();
        }, this);
        this.addChild(btn);        
        this._btns.push(btn);

        btn = new TButton();
        btn.text = "COUNT";
        btn.signals.connect(nn.SignalClicked, (s:nn.Slot) => {
            new nn.Animate().bind(s.sender).repeat(3)
                .to(1, null, (ani:nn.Animator)=>{ani.fadeOut();})
                .to(1, null, (ani:nn.Animator)=>{ani.fadeIn();})
                .play().complete(()=>{alert("动画结束")});
        }, this);
        this.addChild(btn);        
        this._btns.push(btn);

        btn = new TButton();
        btn.text = "TEST";
        btn.signals.connect(nn.SignalClicked, (s:nn.Slot) => {
            new nn.Animate().bind(s.sender)
                .to(0, null, (ani:nn.Animator)=>{
                    ani.movetoy(100);
                })
                .to(1, nn.TimeFunction.Bounce(nn.TimeFunction.OUT), (ani:nn.Animator)=>{
                    ani.movetoy(this.frame.height/2);
                })
                .play();
        }, this);
        this.addChild(btn);        
        this._btns.push(btn);

        this.addChild(this.testConvert);

        // 持续旋转
        btn = new TButton();
        btn.frame = new nn.Rect(500, 300, 100, 100);
        btn.playAnimate(new nn.Animate().repeat(-1).to(3, null, (ani:nn.Animator)=>{
            ani.rotate(nn.Angle.ANGLE(359));
        }));
        this.addChild(btn);
    }

    testConvert = new TConvertTest();

    onAppeared() {
        super.onAppeared();
        nn.noti("TAnimation Appeared");
    }

    onDisappeared() {
        super.onDisappeared();
        nn.noti("TAnimation Disappeared");
    }

    _btns = new Array<TButton>();

    updateLayout() {
        super.updateLayout();
        var box = new nn.VBox(this).useAnchor(true);
        for (var i = 0; i < 8; ++i) {
            box.addFlexHBox(1, (box:nn.HBox, i:any) => {
                for (var j = 0; j < 8; ++j) {
                    if (i == j) {
                        box.addFlex(1, nn.at(this._btns, i));
                    } else {
                        box.addFlex(1);
                    }
                }
            }, this, i);
        }
        box.apply();

        var rc = new nn.Rect(0, 0, 200, 100);
        rc.leftBottom = this.bounds().leftBottom;
        this.testConvert.setFrame(rc);
    }
}
