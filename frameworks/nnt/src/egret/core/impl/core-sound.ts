module nn {

    export class SoundPlayer
    extends CSoundPlayer
    {
        constructor() {
            super();
        }

        dispose() {
            this.stop();
            this._hdl = null;
            this._cnl = null;
            super.dispose();
        }

        _enable:boolean = Device.shared.supportAutoSound;
        get enable():boolean {
            return this._enable;
        }
        set enable(b:boolean) {
            if (b == this._enable)
                return;
            
            if (!b) {
                this._prePlayingState = this.playingState;
                // 设置成不可用会自动停掉当前播放
                this.stop();
            }
            
            this._enable = b;

            if (b && this.autoRecovery && this._prePlayingState == WorkState.DOING) {
                this.play();
            }
        }
        
        private _prePlayingState:WorkState;

        private _mediaSource:string;
        setMediaSource(ms:string) {
            if (this._mediaSource) {
                warn('不能重复设置player的mediaSource');
                return;
            }
            
            this._mediaSource = ms;
        }

        private _position:number = 0;
        get position():number {
            return this._position;
        }        

        // egret的实现
        protected _hdl:egret.Sound;
        protected _cnl:egret.SoundChannel;

        // 只能设置一次
        protected setHdl(val:egret.Sound) {
            if (this._hdl) {
                if (this._hdl.hashCode == val.hashCode)
                    return;
                warn('不能覆盖已经设置了的声音对象');
                return;
            }
            
            this._hdl = val;
        }

        protected setCnl(cnl:egret.SoundChannel) {
            if (this._cnl == cnl)
                return;
            if (this._cnl)
                EventUnhook(this._cnl, egret.Event.SOUND_COMPLETE, this.__cb_end, this);
            this._cnl = cnl;
            if (cnl)
                EventHook(cnl, egret.Event.SOUND_COMPLETE, this.__cb_end, this);
        }

        play() {
            if (!this._enable) {
                this._prePlayingState = WorkState.DOING;
                return;
            }
            
            if (this.playingState == WorkState.DOING)
                return;
            
            if (this.playingState == WorkState.PAUSED) {
                this.resume();
                return;
            }

            // cbplay放倒play之前是为了确保其他依赖于本对象play信号的动作能先执行，以避免h5浏览器当只能播放一个音频时冲突
            this.__cb_play();

            // 如果播放的媒体有变化，则需要重新加载，否则直接播放
            if (this._hdl == null)
            {
                if (this.resourceGroups) {
                    ResManager.capsules(this.resourceGroups).load(()=>{
                        ResManager.getSound(this._mediaSource, ResPriority.NORMAL, (snd:ICacheSound)=>{
                            if (snd.isnull)
                                return;
                            this.setHdl(snd.use());
                            // 如果当前还是位于播放中，则真正去播放
                            if (this.playingState == WorkState.DOING)
                                this.setCnl(this._hdl.play(this._position, this.count));
                        }, this);
                    }, this);
                } else {
                    ResManager.getSound(this._mediaSource, ResPriority.NORMAL, (snd:ICacheSound)=>{
                        if (snd.isnull)
                            return;
                        this.setHdl(snd.use());
                        if (this.playingState == WorkState.DOING)
                            this.setCnl(this._hdl.play(this._position, this.count));
                    }, this);
                }                
            }
            else
            {
                this.setCnl(this._hdl.play(this._position, this.count));
            }
        }

        replay() {
            this.stop();
            this.play();
        }

        pause() {
            if (!this._enable) {
                this._prePlayingState = WorkState.PAUSED;
                return;
            }
            
            if (this.playingState == WorkState.DOING) {
                if (this._cnl) {
                    this._position = this._cnl.position;
                    this._cnl.stop();
                }
                this.playingState = WorkState.PAUSED;
                this.__cb_pause();
            }
        }

        resume() {
            if (!this._enable) {
                this._prePlayingState = WorkState.DOING;
                return;
            }
            
            if (this.playingState == WorkState.PAUSED) {
                this.__cb_play();
                if (this._hdl) {
                    this.setCnl(this._hdl.play(this._position, this.count));
                }
            }
        }

        stop() {
            if (!this._enable) {
                this._prePlayingState = WorkState.DONE;
                return;
            }

            if (this.playingState != WorkState.DONE) {
                if (this._cnl) {
                    this._cnl.stop();
                    this._cnl = undefined;
                    this._position = 0;
                }
                this.playingState = WorkState.DONE;
            }
        }

        breakee() {
            this.pause();
        }

        private __cb_end() {
            log("播放 " + this._mediaSource + " 结束");
            this.playingState = WorkState.DONE;
            this._signals && this._signals.emit(SignalDone);
        }

        private __cb_pause() {
            this._signals && this._signals.emit(SignalPaused);
        }

        private __cb_play() {
            this.playingState = WorkState.DOING;
            this._signals && this._signals.emit(SignalStart);
        }               
    }

    class EffectSoundPlayer
    extends SoundPlayer
    {
        protected setHdl(val:egret.Sound) {
            if (val)
                val.type = egret.Sound.EFFECT;
            super.setHdl(val);
        }

        breakee() {
            this.stop();
        }
    }

    class BackgroundSourdPlayer
    extends SoundPlayer
    {
        protected setHdl(val:egret.Sound) {
            if (val)
                val.type = egret.Sound.MUSIC;
            super.setHdl(val);
        }

        breakee() {
            this.stop();
        }
    }   

    export class _SoundManager
    extends CSoundManager
    {
        get background():SoundTrack {
            var tk = this._tracks["background"];
            if (tk == null) {
                tk = new SoundTrack();
                tk.classForPlayer = BackgroundSourdPlayer;
                tk.count = -1;
                tk.solo = true;
                tk.autoRecovery = true;
                tk.resourceGroups = this.resourceGroups;                
                this._tracks["background"] = tk;                
            }
            return tk;
        }

        get effect():SoundTrack {
            var tk = this._tracks["effect"];
            if (tk == null) {
                tk = new SoundTrack();
                tk.classForPlayer = EffectSoundPlayer;
                tk.count = 1;
                tk.resourceGroups = this.resourceGroups;
                this._tracks["effect"] = tk;
            }
            return tk;
        }

        protected _enable:boolean = Device.shared.supportAutoSound;
        get enable():boolean {
            return this._enable;
        }
        set enable(b:boolean) {
            if (b == this._enable)
                return;
            nn.MapT.Foreach(this._tracks, (k:any, v:SoundTrack)=>{
                v.enable = b;
            }, this);
        }        
    }

    SoundManager = new _SoundManager();
}