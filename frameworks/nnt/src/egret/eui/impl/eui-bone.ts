module eui {

    class BoneConfig
    extends nn.BoneConfig
    {
        get skeleton():string {
            let src = this._skeleton;
            if (src) {
                if (src.indexOf('://') == -1)
                    if (src.indexOf('_skeleton') == -1)
                        src += '_skeleton'; // 和hd中的区别是wing的项目一般使用自动管理资源，此时生成resjson中对于name_skeleton.json的命名将是name_skeleton而不是期望的name_skeleton_json
            }
            return src;
        }
    }

    export class BoneU
    extends eui.Group
    {
        public slots:string = null;
        public tag:any = null;

        constructor() {
            super();
        }

        dispose() {
            if (this._signals) {
                this._signals.dispose();
                this._signals = undefined;
            }

            if (this._hbone)
                this._hbone.drop();
        }

        drop() {
            this.dispose();
        }

        onPartBinded(name:string, target:any) {
            _EUIExt.onPartBinded(this, name, target);
        }

        goBack() {
            _EUIExt.goBack(this);
        }

        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.drop();
        }

        protected _initSignals() {
            // 基础相关
            this._signals.delegate = this;
            this._signals.register(nn.SignalClicked);
            // 骨骼相关
            this._signals.register(nn.SignalStart);
            this._signals.register(nn.SignalChanged);
            this._signals.register(nn.SignalUpdated);
            this._signals.register(nn.SignalEnd);
            this._signals.register(nn.SignalDone);
        }

        protected _signals:nn.Signals;
        get signals():nn.Signals {
            if (this._signals)
                return this._signals;
            this._instanceSignals();
            return this._signals;
        }

        protected _instanceSignals() {
            this._signals = new nn.Signals(this);            
            this._initSignals();
        }
        
        _signalConnected(sig:string, s?:nn.Slot) {
            let bone = this.bone();
            switch (sig) {
            case nn.SignalClicked:
                nn.EventHook(this, egret.TouchEvent.TOUCH_TAP, this.__cmp_tap, this);
                break;
            case nn.SignalChanged:
                bone.signals.redirect(nn.SignalChanged, this);
                break;
            case nn.SignalUpdated:
                bone.signals.redirect(nn.SignalUpdated, this);
                break;
            case nn.SignalStart:
                bone.signals.redirect(nn.SignalStart, this);
                break;
            case nn.SignalEnd:
                bone.signals.redirect(nn.SignalEnd, this);
                break;
            case nn.SignalDone:
                bone.signals.redirect(nn.SignalDone, this);
                break;
            }
        }
        
        private __cmp_tap(e:egret.TouchEvent) {
            this.signals.emit(nn.SignalClicked);
            e.stopPropagation();
        }

        private _sourceChanged = false;

        /** 骨骼动画的名字 */
        private _boneName:string = null;
        public get boneName():string {
            return this._boneName;
        }
        public set boneName(s:string) {
            this._boneName = s;
            this._sourceChanged = true;
            this.invalidateProperties();
        }

        /** 角色名字 */
        private _boneCharacter:string = null;
        public get boneCharacter():string {
            return this._boneCharacter;
        }
        public set boneCharacter(s:string) {
            this._boneCharacter = s;
            this._sourceChanged = true;
            this.invalidateProperties();
        }

        /** 骨骼资源名 */
        private _boneSkeleton:string = null;
        public get boneSkeleton():string {
            return this._boneSkeleton;
        }
        public set boneSkeleton(s:string) {
            this._boneSkeleton = s;
            this._sourceChanged = true;
            this.invalidateProperties();
        }

        /** 骨骼定义资源名 */
        private _bonePlace:string = null;
        public get bonePlace():string {
            return this._bonePlace;
        }
        public set bonePlace(s:string) {
            this._bonePlace = s;
            this._sourceChanged = true;
            this.invalidateProperties();
        }

        /** 骨骼材质资源名 */
        private _boneTexture:string = null;
        public get boneTexture():string {
            return this._boneTexture;
        }
        public set boneTexture(s:string) {
            this._boneTexture = s;
            this._sourceChanged = true;
            this.invalidateProperties();
        }

        /** 播放的速度 */
        private _boneFps:number = 30;
        public get boneFps():number {
            return this._boneFps;
        }
        public set boneFps(v:number) {
            this._boneFps = v;
            this._sourceChanged = true;
            this.invalidateProperties();
        }

        /** 附加缩放系数 */
        public additionScale:number = 1;
        
        /** 填充模式 */
        public fillMode:number = 0x3000;//nn.FillMode.ASPECTSTRETCH;
        
        /** 序列帧的对齐位置 */
        public clipAlign:number = 4;//nn.POSITION.CENTER;

        /** 动作名称 */
        public motion:string = null;

        /** 播放次数 */
        public playCount:number = 1;

        /** 自动播放 */
        public autoPlay:boolean = true;
        
        private _hbone:nn.Bones;
        private bone():nn.Bones {
            if (this._hbone)
                return this._hbone;
            this._hbone = new nn.Bones();
            return this._hbone;
        }

        createChildren() {
            super.createChildren();

            let bone = this.bone();
            bone.autoPlay = this.autoPlay;
            bone.count = this.playCount;
            bone.additionScale = this.additionScale;
            bone.fillMode = this.fillMode;
            bone.clipAlign = this.clipAlign;
            bone.motion = this.motion;

            this.addChild(bone.handle());
        }

        commitProperties() {
            super.commitProperties();
            if (this._sourceChanged) {
                this._sourceChanged = false;

                // 重新设置资源
                let cfg = new BoneConfig(this._boneName, this._boneCharacter, this._boneSkeleton, this._bonePlace, this._boneTexture);
                cfg.fps = this._boneFps;
                this.boneSource = cfg;
            }
        }

        get boneSource():nn.BoneSource {
            let bone = this.bone();
            return bone.boneSource;
        }
        set boneSource(cfg:nn.BoneSource) {
            let bone = this.bone();
            bone.boneSource = cfg;
        }

        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number) {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            
            let bone = this.bone();
            // 设置bone和当前的容器大小一致
            bone.frame = new nn.Rect(0, 0, unscaledWidth, unscaledHeight);
            bone.flushLayout();
        }

        /** 播放 */
        play() {
            this.bone().play();
        }

        stop() {
            this.bone().stop();
        }
    }

    _EUIExtFix(BoneU);
    
}
