
class TBones
extends nn.Sprite
{
    constructor() {
        super();
        this.resourceGroups = ['bone', 'mc'];

        this.addChild(this.bone);        
        this.addChild(this.mc);
        this.addChild(this.mc1);
        
        //this.mc.fps = 5;
        this.mc.backgroundColor = nn.Color.Random();
        this.mc.signals.connect(nn.SignalStart, ()=>{
            nn.noti("mc start");
        }, this);
        this.mc.signals.connect(nn.SignalEnd, ()=>{
            nn.noti("mc end");
        }, this);
        this.mc.signals.connect(nn.SignalDone, ()=>{
            nn.noti("mc done");
        }, this);

        let btn = new nn.Button();
        btn.text = "CLEAN";
        btn.frame = new nn.Rect(100, 100, 200, 100);
        btn.signals.connect(nn.SignalClicked, ()=>{
            if (this.mc.clipSource) {
                this.mc.clipSource = null;
            } else {
                this.mc.clipSource = new nn.ClipConfig('main',
                                                       'assets://mc/out.json',
                                                       'assets://mc/out.png');
            }
        }, this);
        this.addChild(btn);
    }    

    mc = new nn.MovieClip();
    bone = new nn.Bones();
    mc1 = new nn.MovieClip();

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this)
            .addFlex(1, this.bone)
            .addFlex(1, this.mc)
            .addFlex(1, this.mc1)
            .apply();
    }

    updateResource() {
        super.updateResource();

        this.bone.count = -1;
        this.bone.motion = 'stand';
        this.bone.fillMode = nn.FillMode.CENTER;
        this.bone.boneSource = new nn.BoneConfig('ruizi',
                                                 'ruizi',
                                                 'ruizi_skeleton',
                                                 'ruizi_texture_json',
                                                 'ruizi_texture_png');
        
        this.mc.count = -1;
        this.mc.location = 0;
        this.mc.fillMode = nn.FillMode.CENTER;
        this.mc.clipAlign = nn.POSITION.BOTTOM_CENTER;
        this.mc.clipSource = new nn.ClipConfig('main',
                                               'assets://mc/out.json',
                                               'assets://mc/out.png');
        
        this.mc1.count = -1;
        this.mc1.location = 0;
        this.mc1.fillMode = nn.FillMode.CENTER;
        this.mc1.clipAlign = nn.POSITION.CENTER;
        this.mc1.clipSource = new nn.ClipConfig('main',
                                                'assets://mc.d/num.json',
                                                'assets://mc.d/num.png');
    }
}
