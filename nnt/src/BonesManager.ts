module nn {

    class _BonesRender
    implements IFrameRender
    {
        onRender(cost:number) {
            dragonBones.WorldClock.clock.advanceTime(cost);
        }
    }

    export interface IBonesManager {
        turboMode:boolean;
        fps:number;
        instance(cfg:BoneConfig, cb:(bn:BoneData)=>void, ctx?:any);
    }

    class _BonesManager
    extends SObject
    implements IBonesManager
    {
        constructor() {
            super();
            FramesManager.RENDERS.add(new _BonesRender());
        }

        /** 使用Fast加速骨骼动画 */
        turboMode:boolean = true;

        /** 默认骨骼的帧速 */
        fps:number = 30;

        protected _factory = new dragonBones.EgretFactory();

        instance(cfg:BoneConfig, cb:(bn:BoneData)=>void, ctx?:any) {
            if (length(cfg.resourceGroups)) {
                ResManager.capsules(cfg.resourceGroups).load(()=>{
                    this.instanceOne(cfg.character,
                                     cfg.skeleton,
                                     cfg.place,
                                     cfg.texture,
                                     cfg.fps,
                                     cb, ctx);
                }, this);
            } else {
                this.instanceOne(cfg.character,
                                 cfg.skeleton,
                                 cfg.place,
                                 cfg.texture,
                                 cfg.fps,
                                 cb, ctx);
            }
        }
        
        protected instanceOne(character:string,
                              skeleton:string, place:string, texture:string,
                              fps:number,
                              cb:(d:BoneData)=>void, ctx?:any)
        {
            ResManager.getSources([
                [skeleton, ResType.JSON],
                [place, ResType.JSON],
                [texture, ResType.TEXTURE]
            ], RES.LoadPriority.CLIP, (ds:[ICacheRecord])=>{
                let sd = ds[0].use();
                if (sd == null) {
                    warn("bone-skcfg " + skeleton + " not found");
                    cb.call(ctx, null);
                    return;
                }
                
                let td = ds[1].use();
                if (td == null) {
                    warn("bone-tcfg " + place + " not found");
                    cb.call(ctx, null);
                    return;
                }
                
                let t = ds[2].use();
                if (t == null) {
                    warn("bone-tex " + texture + " not found");
                    cb.call(ctx, null);
                    return;
                }
                
                let bd = dragonBones.DataParser.parseDragonBonesData(sd);
                if (bd == null) {
                    warn("解析骨骼数据 " + character + " 失败");
                    cb.call(ctx, null);
                    return;
                }
                this._factory.addSkeletonData(bd);

                let ta = new dragonBones.EgretTextureAtlas(t, td);
                if (ta == null) {
                    warn("构造骨骼贴图 " + character + " 失败");
                    cb.call(ctx, null);
                    return;
                }
                this._factory.addTextureAtlas(ta);

                if (this.turboMode) {
                    let arm:any = this._factory.buildFastArmature(character);
                    if (arm == null) {
                        warn("创建加速骨骼 " + character + " 失败 [" + character + "]");
                    } else {
                        let v = arm._armatureData.frameRate;
                        if (!v)
                            v = this.fps;
                        arm.enableAnimationCache(v);
                    }
                    let bn = new BoneData(arm);
                    cb.call(ctx, bn);
                    return;
                }
                
                let arm:any = this._factory.buildArmature(character);
                if (arm == null)
                    warn("创建普通骨骼 " + character + " 失败 [" + character + "]");
                
                let bn = new BoneData(arm);
                cb.call(ctx, bn);
            }, this);
        }
    }

    let _bonesManager:_BonesManager;
    function BonesManager():IBonesManager {
        if (_bonesManager)
            return _bonesManager;
        _bonesManager = new _BonesManager();
        return _bonesManager;
    }

    export type ArmatureSource = dragonBones.Armature | dragonBones.FastArmature;

    /** 骨骼动画 */
    export class BoneData
    {
        constructor(am:ArmatureSource) {
            this._armature = am;
        }

        private _armature:ArmatureSource;
        get armature():ArmatureSource {
            return this._armature;
        }
        set armature(a:ArmatureSource) {
            warn("不能直接设置 BoneData");
        }
        
        addLoop() {
            if (this._armature)
                dragonBones.WorldClock.clock.add(this._armature);
        }

        rmLoop() {
            if (this._armature)
                dragonBones.WorldClock.clock.remove(this._armature);
        }

        // 计算指定帧数的进度
        calcFrameProgress(mo:string, frame:number):number {
            let ani = (<any>this._armature).animation;
            let data = ArrayT.QueryObject(ani.animationDataList, (o:dragonBones.AnimationData):boolean=>{
                return o.name == mo;
            });
            if (data == null)
                return 0;
            fatal("没有实现");
            let frametm = 0;
            //let frametm = 1000/data.frameRate;
            let frameslen = Math.ceil(data.duration/frametm);
            let pos = frame < 0 ? frameslen + frame : frame;
            return pos / frameslen;
        }

        /* 播放动画
           @motion 动作名
           @times 次数
           @stopAtProgress OPT 停止位置
        */
        playMotion(motion:string, times:number, stopAtProgress?:number) {
            let ani = (<any>this._armature).animation;
            let state:any = ani.gotoAndPlay(motion, 0, -1, times);
            state.__stopAtProgress = stopAtProgress;
        }

        seekToMotion(motion:string, time:number) {
            let ani = (<any>this._armature).animation;
            ani.gotoAndStop(motion, time);
        }        
        
        hasMotion(val:string):boolean {
            let ani = (<any>this._armature).animation;
            return ani.hasAnimation(val);
        }
        
        bestFrame():Rect {
            let r = new Rect();
            if (this._armature) {
                let rc = this._armature.display.getBounds();
                // 去掉制作bone时的锚点偏移
                r.x = -rc.x;
                r.y = -rc.y;
                r.width = rc.width;
                r.height = rc.height;
            }
            return r.unapplyScaleFactor();
        }

        get display():egret.DisplayObject {
            return this._armature.display;
        }
    }

    /** 骨骼的配置信息 */
    export class BoneConfig
    implements IReqResources
    {
        /**
           @name 骨骼动画的名称，如果设置name而不设置其他，则使用 name 和默认规则来生成缺失的文件
           @character 角色名称，通常和name一致
           @skeleton 动作的配置文件，通常为动作名 skeleton_json 结尾
           @place 材质节点的位置配置文件，通常为 texture_json 结尾
           @texture 图片文件，通常为 texture_png 结尾
        */
        constructor(name?:string, character?:string,
                    skeleton?:string, place?:string, texture?:string)
        {
            this._name = name;
            if (!character)
                this._character = name;
            else
                this._character = character;
            if (!skeleton)
                this._skeleton = name + '_skeleton_json';
            else
                this._skeleton = skeleton;
            if (!place)
                this._place = name + '_texture_json';
            else
                this._place = place;
            if (!texture)
                this._texture = name + '_png';
            else
                this._texture = texture;
        }

        // 预加载资源组
        resourceGroups:Array<string>;
        
        protected _skeleton:string; 
        protected _place:string;
        protected _texture:string;         
        protected _character:string; 
        fps:number; // 骨骼的速度
        
        protected _name:string; 
        get name():string {
            return this._name;
        }
        set name(v:string) {
            this._name = v;
            if (!this._character)
                this._character = name;
            if (!this._skeleton)
                this._skeleton = name + '_skeleton_json';
            if (!this._place)
                this._place = name + '_texture_json';
            if (!this._texture)
                this._texture = name + '_png';
        }

        set skeleton(v:string) {
            this._skeleton = v;
        }
        get skeleton():string {
            return this._skeleton;
        }
        
        set place(v:string) {
            this._place = v;
        }
        get place():string {
            return this._place;
        }

        set texture(v:string) {
            this._texture = v;
        }
        get texture():string {
            return this._texture;
        }

        set character(v:string) {
            this._character = v;
        }
        get character():string {
            return this._character;
        }

        getReqResources():Array<ReqResource> {
            let r = [];
            r.push(new ResourceEntity(this.skeleton, ResType.JSON));
            r.push(new ResourceEntity(this.place, ResType.JSON));
            r.push(new ResourceEntity(this.texture, ResType.TEXTURE));
            return r;
        }
    };
    
    export type BoneSource = BoneData | BoneConfig | UriSource;

    /** 业务使用的骨骼显示类 */
    export class Bones
    extends Widget
    {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            // 骨骼开始播放
            this._signals.register(SignalStart);
            // 一次 motion 结束
            this._signals.register(SignalEnd);
            // 所有循环的结束
            this._signals.register(SignalDone);
            // 骨骼改变，当骨骼资源变更时激发
            this._signals.register(SignalChanged);
            // 骨骼更新，和change的区别在update每一次设置source都会激发
            this._signals.register(SignalUpdated);
        }

        dispose() {
            if (this._data) {
                this._data.rmLoop();
                this._data = undefined;
            }
            super.dispose();
        }

        // 运行状态
        private _playingState:WorkState;

        private _data:BoneData;
        protected getBoneData():BoneData {
            return this._data;
        }
        protected setBoneData(d:BoneData) {
            let self = this;
            if (self._data == d) {
                if (self._signals)
                    self._signals.emit(SignalUpdated);
                return;
            }
            
            // 清除老的
            if (self._data) {
                self._data.rmLoop();
                self._imp.removeChild(self._data.display);
            }
            
            // 设置新的
            self._data = d;
            if (d) {
                self._imp.addChild(self._data.display);

                // 绑定事件
                let am = d.armature;
                EventHook(am, dragonBones.AnimationEvent.START, self.__db_start, self);
                EventHook(am, dragonBones.AnimationEvent.LOOP_COMPLETE, self.__db_loopcomplete, self);
                EventHook(am, dragonBones.AnimationEvent.COMPLETE, self.__db_complete, self);
                
                // 更新大小
                self.updateLayout();

                // 是否需要直接开始动画
                if (self._playingState == WorkState.DOING ||
                    self.autoPlay)
                {
                    self._playingState = WorkState.DONE;
                    self.play();
                }
            }
            
            // 抛出改变的事件
            if (self._signals) {
                self._signals.emit(SignalUpdated);
                self._signals.emit(SignalChanged);
            }
        }
        
        private _bs:BoneSource = null;
        get boneSource():BoneSource {
            return this._bs;
        }
        set boneSource(bs:BoneSource) {
            if (this._bs == bs)
                return;
            this._bs = bs;
            
            if (<any>bs instanceof BoneConfig) {
                let cfg = <BoneConfig>bs;
                BonesManager().instance(cfg, (bn:BoneData)=>{
                    if (this._bs != bs)
                        return;
                    this.setBoneData(bn);
                }, this);
            } else {
                let tp = typeof(<any>bs);
                if (tp == 'string') {
                    let cfg = new BoneConfig(<string>bs);
                    BonesManager().instance(cfg, (bn:BoneData)=>{
                        if (this._bs != bs)
                            return;
                        this.setBoneData(bn);
                    }, this);
                } else {
                    warn('设置了错误的骨骼数据');
                }
            }
        }
        
        bestFrame():Rect {
            if (this._data)
                return this._data.bestFrame();
            return new Rect();
        }

        /** 同一批骨骼的大小可能一直，但有效区域不一致，所以可以通过该参数附加调整 */
        additionScale:number = 1;

        /** 骨骼填充的方式，默认为充满 */
        fillMode:FillMode = FillMode.ASPECTSTRETCH;

        /** 对齐位置 */
        clipAlign:POSITION = POSITION.BOTTOM_CENTER;
        
        updateLayout() {
            super.updateLayout();
            let bd = this._data;
            if (bd == null)
                return;

            // 计算bone的实际显示位置
            let rc = this.boundsForLayout();
            let bst = bd.bestFrame();
            if (bst.width == 0 || bst.height == 0)
                return;
            
            let bst2 = bst.clone().fill(rc, this.fillMode);
            // 计算缩放的尺寸
            let sw = bst2.width / bst.width;
            let sh = bst2.height / bst.height;            
            let scale = Math.min(sw, sh) * this.additionScale;

            // 定位位置
            bst.x *= scale;
            bst.y *= scale;
            bst2.alignTo(rc, this.clipAlign);
            bst.x += bst2.x;
            bst.y += bst2.y;
            
            let dsp = this._data.display;
            dsp.scaleX = dsp.scaleY = scale;
            this.impSetFrame(bst, dsp);
        }

        /** 具体动作 */
        private _motions = new Array<string>();
        get motion():string {
            return ArrayT.Top(this._motions);
        }
        set motion(val:string) {
            if (val == this.motion)
                return;            
            ArrayT.SetTop(this._motions, val);
            if (this._playingState == WorkState.DOING || this.autoPlay) {
                this._playingState = WorkState.DONE;
                this.play();
            }
        }
        
        pushMotion(val:string) {
            this._motions.push(val);
            if (this._playingState == WorkState.DOING || this.autoPlay) {
                this._playingState = WorkState.DONE;
                this.play();
            }
        }

        popMotion() {
            this._motions.pop();
            if (this._playingState == WorkState.DOING || this.autoPlay) {
                this._playingState = WorkState.DONE;
                this.play();
            }
        }

        /** 当前含有的所有动作 */
        motions():Array<string> {
            return this._data ? this._data.armature.animation.animationList : [];
        }

        /** 是否含有该动作 */
        hasMotion(val:string):boolean {
            return this._data && this._data.hasMotion(val);
        }

        /** 自动开始播放 */
        autoPlay = true;

        /** 播放次数控制 
            -1: 循环
            0: 使用文件设置的次数
            >0: 次数控制
        */
        count:number = -1;
        
        /** 播放 */
        play() {
            let self = this;
            if (self._data == null ||
                self._motions.length == 0 ||
                self._playingState == WorkState.DOING)
                return;
            
            let mo = self.motion;
            if (self.hasMotion(mo) == false) {
                warn("bone-motion " + mo + " not found, avaliable motions:" + this.motions.toString());
                return;
            }

            if (self.count <= -1)
            {
                self._data.playMotion(mo, 0);
            }
            else if (self.count > 0)
            {
                self._data.playMotion(mo, self.count);
            }
            else
            {
                self._data.playMotion(mo, NaN);
            }
            
            self._playingState = WorkState.DOING;
            this._data.addLoop();
        }

        /** 停止播放 */
        stop() {
            let self = this;
            if (self._data == null ||
                self._playingState != WorkState.DOING)
                return;
            
            self._playingState = WorkState.DONE;
            //let ani = self._data.animation();
            self._data.rmLoop();
        }

        private __db_start() {
            if (this._signals) {
                this._signals.emit(SignalStart);
            }
        }
        
        private __db_complete() {
            this._data.rmLoop();
            this._playingState = WorkState.DONE;
            
            if (this._signals) {
                this._signals.emit(SignalEnd);
                this._signals.emit(SignalDone);
            }
        }
        
        private __db_loopcomplete() {
            if (this._signals) {
                this._signals.emit(SignalEnd);
            }
        }
    }

    // hack-db
    class FastAnimationState
    extends dragonBones.AnimationState
    {
        get progress():number {
            let self:any = this;
            let v = self._progress;
            let f = self.__stopAtProgress;
            if (f && v >= f)
                return f;
            return self._progress;
        }
    }
    dragonBones.AnimationState = FastAnimationState;    
}
