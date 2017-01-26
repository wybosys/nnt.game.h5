module nn {

    export type SoundSource = UriSource | COriginType | egret.Sound;

    /** 音频播放 */
    export class SoundPlayer
    extends SObject
    {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalStart);
            this._signals.register(SignalPaused);
            this._signals.register(SignalDone);
            this._signals.register(SignalChanged);
        }

        dispose() {
            this.stop();
            this._hdl = null;
            this._cnl = null;
            super.dispose();
        }

        /** 播放次数，-1代表循环 */
        count = 1;

        /** 音频的组名 */
        resourceGroups:string[];

        _enable:boolean = Device.shared.supportAutoSound;
        get enable():boolean {
            return this._enable;
        }
        set enable(b:boolean) {
            if (b == this._enable)
                return;
            
            if (!b) {
                this._prePlayingState = this._playingState;
                // 设置成不可用会自动停掉当前播放
                this.stop();
            }
            
            this._enable = b;

            if (b && this.autoRecovery && this._prePlayingState == WorkState.DOING) {
                this.play();
            }
        }

        /** 自动恢复播放状态 */
        autoRecovery:boolean;
        private _prePlayingState:WorkState;
        
        /** 音频文件的名称, 一个player只能对应一个声音，如过已经设置，则报错 */        
        private _mediaSource:string;
        setMediaSource(ms:string) {
            if (this._mediaSource) {
                warn('不能重复设置player的mediaSource');
                return;
            }
            
            this._mediaSource = ms;
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

        // 暂停或者播放到的位置
        private _position:number = 0;
        get position():number {
            return this._position;
        }

        // 音乐的播放状态
        protected _playingState:WorkState;

        /** 开始播放 */
        play() {
            if (!this._enable) {
                this._prePlayingState = WorkState.DOING;
                return;
            }
            
            if (this._playingState == WorkState.DOING)
                return;
            
            if (this._playingState == WorkState.PAUSED) {
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
                        ResManager.getSound(this._mediaSource, RES.LoadPriority.NORMAL, (snd:ICacheSound)=>{
                            if (snd == null)
                                return;
                            this.setHdl(snd.use());
                            // 如果当前还是位于播放中，则真正去播放
                            if (this._playingState == WorkState.DOING)
                                this.setCnl(this._hdl.play(this._position, this.count));
                        }, this);
                    }, this);
                } else {
                    ResManager.getSound(this._mediaSource, RES.LoadPriority.NORMAL, (snd:ICacheSound)=>{
                        if (snd == null)
                            return;
                        this.setHdl(snd.use());
                        if (this._playingState == WorkState.DOING)
                            this.setCnl(this._hdl.play(this._position, this.count));
                    }, this);
                }                
            }
            else
            {
                this.setCnl(this._hdl.play(this._position, this.count));
            }
        }

        /** 重新播放 */
        replay() {
            this.stop();
            this.play();
        }

        /** 暂停 */
        pause() {
            if (!this._enable) {
                this._prePlayingState = WorkState.PAUSED;
                return;
            }
            
            if (this._playingState == WorkState.DOING) {
                if (this._cnl) {
                    this._position = this._cnl.position;
                    this._cnl.stop();
                }
                this._playingState = WorkState.PAUSED;
                this.__cb_pause();
            }
        }

        /** 恢复 */
        resume() {
            if (!this._enable) {
                this._prePlayingState = WorkState.DOING;
                return;
            }
            
            if (this._playingState == WorkState.PAUSED) {
                this.__cb_play();
                if (this._hdl) {
                    this.setCnl(this._hdl.play(this._position, this.count));
                }
            }
        }

        /** 停止 */
        stop() {
            if (!this._enable) {
                this._prePlayingState = WorkState.DONE;
                return;
            }

            if (this._playingState != WorkState.DONE) {
                if (this._cnl) {
                    this._cnl.stop();
                    this._cnl = undefined;
                    this._position = 0;
                }
                this._playingState = WorkState.DONE;
            }
        }

        /** 打断播放 */
        breakee() {
            this.pause();
        }

        get isPlaying():boolean {
            return this._playingState == WorkState.DOING;
        }

        get isPaused():boolean {
            return this._playingState == WorkState.PAUSED;
        }

        private __cb_end() {
            log("播放 " + this._mediaSource + " 结束");
            this._playingState = WorkState.DONE;
            this._signals && this._signals.emit(SignalDone);
        }

        private __cb_pause() {
            this._signals && this._signals.emit(SignalPaused);
        }

        private __cb_play() {
            this._playingState = WorkState.DOING;
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

    export class SoundTrack
    extends SObject
    {
        constructor() {
            super();
        }

        /** 播放次数，-1代表无限循环 */
        count = 1;

        /** 同时只能有一个在播放 */
        solo:boolean;

        /** 用以实现player的类对象 */
        classForPlayer = SoundPlayer;

        /** 自动恢复 */
        _autoRecovery:boolean;
        get autoRecovery():boolean {
            return this._autoRecovery;
        }
        set autoRecovery(b:boolean) {
            if (b == this._autoRecovery)
                return;
            this._autoRecovery = b;
            nn.MapT.Foreach(this._sounds, (k:string, v:SoundPlayer)=>{
                v.autoRecovery = b;
            }, this);
        }

        /** 资源组 */
        resourceGroups:string[];

        /** 可用状态 */
        _enable:boolean = true;
        get enable():boolean {
            return this._enable;
        }
        set enable(b:boolean) {
            if (b == this._enable)
                return;
            this._enable = b;
            nn.MapT.Foreach(this._sounds, (k:string, v:SoundPlayer)=>{
                v.enable = b;
            }, this);
        }

        /** 获取一个播放器 */
        player(name:string, ...groups:string[]):SoundPlayer {
            var ply = this._sounds[name];
            if (ply == null) {
                ply = new this.classForPlayer();

                ply.enable = this.enable;
                ply.autoRecovery = this.autoRecovery;
                ply.resourceGroups = groups.length ? groups : this.resourceGroups;
                ply.setMediaSource(name);
                ply.count = this.count;
                ply.signals.connect(SignalStart, this.__cb_play, this);
                
                this._sounds[name] = ply;
            }
            return ply;
        }

        /** 实例化一个播放器，播放完成后会自动清掉 */
        acquire(name:string, ...groups:string[]):SoundPlayer {
            var ply = new this.classForPlayer();

            ply.enable = this.enable;
            ply.autoRecovery = this.autoRecovery;
            ply.resourceGroups = groups.length ? groups : this.resourceGroups;
            ply.setMediaSource(name);
            ply.count = this.count;

            if (!ply.enable)
            {
                Defer(ply.drop, ply);
            }
            else
            {
                ply.signals.connect(SignalEnd, (s:nn.Slot)=>{
                    drop(s.sender);
                }, null);
            }

            return ply;
        }

        // 映射文件和播放器
        protected _sounds = new KvObject<string, SoundPlayer>();

        // 当前正在独奏的播放器
        private _soloplayer:SoundPlayer;
        
        private __cb_play(s:Slot) {
            if (this.solo && this._soloplayer != s.sender) {
                if (this._soloplayer)
                    this._soloplayer.breakee();
                this._soloplayer = s.sender;
            }
        }

        /** 播放全部 */
        play() {            
            nn.MapT.Foreach(this._sounds, (k:string, v:SoundPlayer)=>{
                v.play();
            }, this);
        }

        /** 停止全部 */
        stop() {
            nn.MapT.Foreach(this._sounds, (k:string, v:SoundPlayer)=>{
                v.stop();
            }, this);
        }

        // 配置application，业务不需要关心
        private __app_activate_enable:boolean;
        _app_actived() {
            if (this.__app_activate_enable)
                this.enable = true;
        }
        _app_deactived() {
            this.__app_activate_enable = this.enable;
            this.enable = false;
        }
    }

    export interface ISoundManager {
        track(idr:string):SoundTrack;
        background:SoundTrack;
        effect:SoundTrack;
        enable:boolean;
    }

    class _SoundManager
    extends SObject
    implements ISoundManager
    {
        constructor() {
            super();
        }

        protected _tracks = new KvObject<any, SoundTrack>();

        /** 默认资源组 */
        resourceGroups:string[];
        
        /** 获取到指定音轨 */
        track(idr:string):SoundTrack {
            var tk = this._tracks[idr];
            if (tk == null) {
                tk = new SoundTrack();
                this._tracks[idr] = tk;
            }
            return tk;
        }

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

    export var SoundManager:ISoundManager = new _SoundManager();
    
}
