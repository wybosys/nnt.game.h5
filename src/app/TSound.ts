class TSound
extends nn.Sprite
{
    constructor() {
        super();
        this.edgeInsets = new nn.EdgeInsets(50, 50, 50, 50);

        this._btnPlay.text = "PLAY";
        this._btnPlay.signals.connect(nn.SignalClicked, this._actPlay, this);
        this.addChild(this._btnPlay);
        
        this._btnPause.text = "PAUSE";
        this._btnPause.signals.connect(nn.SignalClicked, this._actPause, this);
        this.addChild(this._btnPause);

        this._btnResume.text = "RESUME";
        this._btnResume.signals.connect(nn.SignalClicked, this._actResume, this);
        this.addChild(this._btnResume);

        this._btnStop.text = "STOP";
        this._btnStop.signals.connect(nn.SignalClicked, this._actStop, this);
        this.addChild(this._btnStop);
    }

    onAppeared() {
        super.onAppeared();
        nn.SoundManager.background.player("assets://sound/king.mp3").play();
    }
    
    _btnPlay = new TButton();
    _btnPause = new TButton();
    _btnResume = new TButton();
    _btnStop = new TButton();

    updateLayout() {
        super.updateLayout();
        new nn.VBox(this)
            .addFlex(1)
            .addPixelHBox(100, (box:nn.HBox)=>{
                box
                    .addFlex(1, this._btnPlay)
                    .addFlex(1, this._btnPause)
                    .addFlex(1, this._btnResume)
                    .addFlex(1, this._btnStop);
            })
            .addFlex(1)
            .apply();
    }

    _actPlay() {
        nn.SoundManager.effect.player("victory_mp3").play();
    }

    _actPause() {
        nn.SoundManager.effect.player("victory_mp3").pause();
    }

    _actResume() {
        nn.SoundManager.effect.player("victory_mp3").resume();
    }

    _actStop() {
        nn.SoundManager.effect.player("victory_mp3").stop();
    }
    
}
