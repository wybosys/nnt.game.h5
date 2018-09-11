module nn {

    class _BonesRender implements IFrameRender {
        onRender(cost: number) {
            dragonBones.WorldClock.clock.advanceTime(cost);
        }
    }

    export class _BonesManager extends SObject {
        constructor() {
            super();
            FramesManager.RENDERS.add(new _BonesRender());
        }

        /** 使用Fast加速骨骼动画 */
        turboMode: boolean = true;

        /** 默认骨骼的帧速 */
        fps: number = 30;

        protected _factory = new dragonBones.EgretFactory();

        instance(cfg: BoneConfig, cb: (bn: BoneData) => void, ctx?: any) {
            if (length(cfg.resourceGroups)) {
                ResManager.capsules(cfg.resourceGroups).load(() => {
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

        protected instanceOne(character: string,
                              skeleton: string, place: string, texture: string,
                              fps: number,
                              cb: (d: BoneData) => void, ctx?: any) {
            ResManager.getSources([
                [skeleton, ResType.JSON],
                [place, ResType.JSON],
                [texture, ResType.TEXTURE]
            ], ResPriority.CLIP, (ds: [ICacheRecord]) => {
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
                    let arm: any = this._factory.buildFastArmature(character);
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

                let arm: any = this._factory.buildArmature(character);
                if (arm == null)
                    warn("创建普通骨骼 " + character + " 失败 [" + character + "]");

                let bn = new BoneData(arm);
                cb.call(ctx, bn);
            }, this);
        }
    }

    let _bonesManager: _BonesManager;

    export function BonesManager(): _BonesManager {
        if (_bonesManager)
            return _bonesManager;
        _bonesManager = new _BonesManager();
        return _bonesManager;
    }

    export type ArmatureSource = dragonBones.Armature | dragonBones.FastArmature;

    export class BoneData {
        constructor(am: ArmatureSource) {
            this._armature = am;
        }

        private _armature: ArmatureSource;
        get armature(): ArmatureSource {
            return this._armature;
        }

        set armature(a: ArmatureSource) {
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
        calcFrameProgress(mo: string, frame: number): number {
            let ani = (<any>this._armature).animation;
            let data = ArrayT.QueryObject(ani.animationDataList, (o: dragonBones.AnimationData): boolean => {
                return o.name == mo;
            });
            if (data == null)
                return 0;
            fatal("没有实现");
            let frametm = 0;
            //let frametm = 1000/data.frameRate;
            let frameslen = Math.ceil(data.duration / frametm);
            let pos = frame < 0 ? frameslen + frame : frame;
            return pos / frameslen;
        }

        /* 播放动画
           @motion 动作名
           @times 次数
           @stopAtProgress OPT 停止位置
        */
        playMotion(motion: string, times: number, stopAtProgress?: number) {
            let ani = (<any>this._armature).animation;
            let state: any = ani.gotoAndPlay(motion, 0, -1, times);
            state.__stopAtProgress = stopAtProgress;
        }

        seekToMotion(motion: string, time: number) {
            let ani = (<any>this._armature).animation;
            ani.gotoAndStop(motion, time);
        }

        hasMotion(val: string): boolean {
            let ani = (<any>this._armature).animation;
            return ani.hasAnimation(val);
        }

        bestFrame(): Rect {
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

        get display(): egret.DisplayObject {
            return this._armature.display;
        }
    }

    export class Bones
        extends CBones {
        constructor() {
            super();
        }

        dispose() {
            if (this._data) {
                this._data.rmLoop();
                this._data = undefined;
            }
            super.dispose();
        }

        // 运行状态
        private _playingState: WorkState;

        private _data: BoneData;

        protected getBoneData(): BoneData {
            return this._data;
        }

        protected setBoneData(d: BoneData) {
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
                    self.autoPlay) {
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

        private _bs: BoneSource = null;

        get boneSource(): BoneSource {
            return this._bs;
        }

        set boneSource(bs: BoneSource) {
            if (this._bs == bs)
                return;
            this._bs = bs;

            if (<any>bs instanceof BoneConfig) {
                let cfg = <BoneConfig>bs;
                BonesManager().instance(cfg, (bn: BoneData) => {
                    if (this._bs != bs)
                        return;
                    this.setBoneData(bn);
                }, this);
            } else {
                let tp = typeof(<any>bs);
                if (tp == 'string') {
                    let cfg = new BoneConfig(<string>bs);
                    BonesManager().instance(cfg, (bn: BoneData) => {
                        if (this._bs != bs)
                            return;
                        this.setBoneData(bn);
                    }, this);
                } else {
                    warn('设置了错误的骨骼数据');
                }
            }
        }

        bestFrame(): Rect {
            if (this._data)
                return this._data.bestFrame();
            return new Rect();
        }

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

        private _motions = new Array<string>();

        get motion(): string {
            return ArrayT.Top(this._motions);
        }

        set motion(val: string) {
            if (val == this.motion)
                return;
            ArrayT.SetTop(this._motions, val);
            if (this._playingState == WorkState.DOING || this.autoPlay) {
                this._playingState = WorkState.DONE;
                this.play();
            }
        }

        pushMotion(val: string) {
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

        motions(): Array<string> {
            return this._data ? this._data.armature.animation.animationList : [];
        }

        hasMotion(val: string): boolean {
            return this._data && this._data.hasMotion(val);
        }

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

            if (self.count <= -1) {
                self._data.playMotion(mo, 0);
            }
            else if (self.count > 0) {
                self._data.playMotion(mo, self.count);
            }
            else {
                self._data.playMotion(mo, NaN);
            }

            self._playingState = WorkState.DOING;
            this._data.addLoop();
        }

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
        extends dragonBones.AnimationState {
        get progress(): number {
            let self: any = this;
            let v = self._progress;
            let f = self.__stopAtProgress;
            if (f && v >= f)
                return f;
            return self._progress;
        }
    }

    dragonBones.AnimationState = FastAnimationState;

}