module nn {

    export type SoundSource = UriSource | COriginType;

    /** 音频播放 */
    export abstract class CSoundPlayer
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

        /** 播放次数，-1代表循环 */
        count = 1;

        /** 音频的组名 */
        resourceGroups:string[];

        /** 是否可用 */
        enable:boolean;

        /** 自动恢复播放状态 */
        autoRecovery:boolean;
        
        /** 音频文件的名称, 一个player只能对应一个声音，如过已经设置，则报错 */
        abstract setMediaSource(ms:string);

        /** 暂停或者播放到的位置 */
        position:number;

        // 音乐的播放状态
        playingState:WorkState;

        /** 开始播放 */
        abstract play();

        /** 重新播放 */
        abstract replay();

        /** 暂停 */
        abstract pause();

        /** 恢复 */
        abstract resume();

        /** 停止 */
        abstract stop();

        /** 打断播放 */
        abstract breakee();

        get isPlaying():boolean {
            return this.playingState == WorkState.DOING;
        }

        get isPaused():boolean {
            return this.playingState == WorkState.PAUSED;
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

    export abstract class CSoundManager
    extends SObject
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

        /** 背景音轨　*/
        background:SoundTrack;

        /** 效果音轨 */
        effect:SoundTrack;

        /** 可用 */
        enable:boolean;
    }

    export let SoundManager:CSoundManager;
    
}
