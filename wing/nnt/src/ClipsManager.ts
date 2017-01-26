module nn {

    export type ClipSource = ClipConfig;
    
    class ExtMovieClip
    extends egret.MovieClip
    {
        constructor() {
            super();
        }
        
        bestFrame():Rect {
            // 此时不需要进行缩放因子调整，每一个序列帧需要用实际大小来计算上层的缩放系数
            return this.originBoundingBox.clone();
        }
        
        factory:_ClipFactory;
        
        bindMovieClipData(d:egret.MovieClipData, f:_ClipFactory) {
            this.movieClipData = d;
            this.factory = f;
            if (d) {
                this.originBoundingBox = (<any>d).boundingBox;
                this.originFrameRate = (<any>d).__fileFrameRate;
                this.visible = true;
            } else {
                this.originBoundingBox = new Rect();
                this.originFrameRate = 30;
                this.visible = false;
            }
        }
        
        // 标准的包围盒
        originBoundingBox = new Rect();
        
        // 标准速率
        originFrameRate:number;       
    }
    
    export class MovieClip
    extends Widget
    {
        constructor() {
            super();
            //this.backgroundColor = Color.Red;
            this._imp.addChild(this._mc);
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalStart);
            this._signals.register(SignalChanged);
            this._signals.register(SignalUpdated);
            this._signals.register(SignalEnd);
            this._signals.register(SignalDone);
        }

        _signalConnected(sig:string, s:Slot) {
            super._signalConnected(sig, s);
            switch (sig) {
            case SignalEnd: {
                EventHook(this._mc, egret.Event.LOOP_COMPLETE, this.__cb_end, this);
            } break;
            case SignalDone: {
                EventHook(this._mc, egret.Event.COMPLETE, this.__cb_done, this);
            } break;
            }
        }

        dispose() {
            // 反向模式中如过已经调整过方向，则需要当析构时恢复方向，不然下一次打开就已经是反方向的
            if (this.reverseMode && !this.__needreverse) {
                this.__needreverse = true;
                this.tryReverseMovieClipData();
            }
            
            super.dispose();
        }

        /** 播放次数，-1代表循环，默认为一次*/
        count = 1;

        /** 帧率 */
        private _fps:number;
        get fps():number {
            return this._mc.frameRate;
        }
        set fps(fps:number) {
            this._fps = fps;
            this._mc.frameRate = fps;
        }

        /** 切换clipSource时清空原来的clip */
        clearOnChanging:boolean = true;
        
        private _mc = new ExtMovieClip();
        
        private _cs:ClipSource = null;
        set clipSource(cs:ClipSource) {
            let self = this;
            if (ObjectT.IsEqual(cs, self._cs)) {
                if (self._signals)
                    self._signals.emit(SignalUpdated);
                return;
            }
            
            // 如果是null则直接清空
            // 否则当加载成功新的时再清空
            if (cs == null && self._cs) {
                self._mc.bindMovieClipData(null, null);
                self._cs = null;
                return;
            }
            
            if (self.clearOnChanging)
                self._mc.bindMovieClipData(null, null);
            
            // 设置新的数据
            let pcs = self._cs;
            self._cs = cs;
            
            // 加载新的资源数据
            ClipsManager().instance(cs,
                                    (mc:egret.MovieClipData, f:_ClipFactory)=>{
                                        if (self.__disposed || false == ObjectT.IsEqual(cs, self._cs))
                                            return;
                                        if (cs.additionScale != null)
                                            self.additionScale = cs.additionScale;
                                        if (cs.fps)
                                            self.fps = cs.fps;
                                        // 释放当前的
                                        if (pcs) {
                                            self.stop();
                                        }
                                        // 设置期望的
                                        self._setMovieClipData(mc, f);
                                    }, self);
        }
        get clipSource():ClipSource {
            return this._cs;
        }

        /** 目标序列帧的名称 */
        _clip:string;
        get clip():string {
            return this._clip;
        }
        set clip(c:string) {
            if (c == this._clip)
                return;
            this._location = undefined;
            this._clip = c;
            if (this.autoPlay && !this.isPlaying)
                this.play();
        }

        /** 序列帧播放的位置 */
        _location:number;
        get location():number {
            return this._location;
        }
        set location(l:number) {
            if (l == this._location)
                return;
            this._clip = undefined;
            this._location = l;
            if (this.autoPlay && !this.isPlaying)
                this.play();
        }
        
        // 需要在disap的时候暂停count＝－1的动画
        onAppeared() {
            super.onAppeared();
            if (this.__autopaused == true) {
                this.__autopaused = false;
                this.play();
            }
        }
        
        private __autopaused:boolean;
        onDisappeared() {
            super.onDisappeared();
            if (this.isPlaying && this.count == -1) {
                this.__autopaused = true;
                this.stop();
            }
        }

        /** 是否自动播放 */
        autoPlay:boolean = true;

        get isPlaying():boolean {
            return this._mc.isPlaying;
        }
        
        /** 暂停动画 */
        stop() {
            if (this.isPlaying)
                this._mc.stop();
        }

        /** 播放动画 */
        play() {
            if (this.isPlaying)
                return;
            this._updateAnimation();
        }

        bestFrame():Rect {
            let rc = this._mc.bestFrame();
            rc.x = rc.y = 0;
            return rc;
        }

        /** 附加缩放 */
        additionScale:number = 1;
        
        /** 填充方式 */
        fillMode:FillMode = FillMode.ASPECTSTRETCH;

        private _setMovieClipData(d:egret.MovieClipData, f:_ClipFactory) {
            if (d)
            {
                this._mc.bindMovieClipData(d, f);
                if (this._fps) {
                    this._mc.frameRate = this._fps;
                } else {
                    this._mc.frameRate = this._mc.originFrameRate;
                }
                
                // 需要重新布局以调整位置
                //this.setNeedsLayout();
                this.updateLayout(); // 飞天项目汇报如果用setNeedsLayout会引起重影
            }
            else
            {
                this._mc.bindMovieClipData(d, f);
            }
            
            // 刷新动画
            if (this._signals) {
                this._signals.emit(SignalUpdated);
                this._signals.emit(SignalChanged);
            }
            
            if (this.autoPlay && !this.isPlaying)
                this.play();
        }

        /** 反方向播放 */
        private _reverseMode:boolean;
        get reverseMode():boolean {
            return this._reverseMode;
        }
        set reverseMode(b:boolean) {
            if (this._reverseMode == b)
                return;
            this._reverseMode = b;
            this.__needreverse = true;
        }
        private __needreverse:boolean;

        protected tryReverseMovieClipData() {
            if (!this.reverseMode && !this.__needreverse)
                return;

            let d = this._mc.movieClipData;
            d.frames.reverse(); // 反向序列帧
            
            this.__needreverse = undefined;
        }

        /** 序列帧的对齐位置 */
        clipAlign:POSITION = POSITION.CENTER;

        /** flashMode 采用 flash 标记的锚点来显示动画 
            @note 这种模式下请设置 fillMode 为 CENTER
        */
        private _flashMode:boolean;
        get flashMode():boolean {
            return this._flashMode;
        }
        set flashMode(b:boolean) {
            this._flashMode = b;
            if (b && this.flashAnchorPoint == null) {
                this.flashAnchorPoint = new Point(0.5, 0.5);
            }
        }

        /** flashAnchor flash模式下使用的锚点信息 */
        flashAnchorPoint:Point;
        
        updateLayout() {
            super.updateLayout();

            let rc = this.bounds();
            let arc = this._mc.bestFrame();
            
            // 计算一下以中心点为基准的目标 mc 大小
            let frm = arc.clone()
                .fill(rc, this.fillMode)
                .scale(this.additionScale);
            
            // 计算填充的缩放比例
            let sw = frm.width / arc.width;
            let sh = frm.height / arc.height;
            let s = Math.min(sw, sh);
            this._mc.scaleX = this._mc.scaleY = s * ScaleFactorS;

            // 计算缩放后应该放置的位置
            frm.alignTo(rc, this.clipAlign);
            frm.add(-arc.x * s, -arc.y * s);
            if (this.flashMode) {
                frm.add((arc.x + arc.width * this.flashAnchorPoint.x) * s,
                        (arc.y + arc.height * this.flashAnchorPoint.y) * s);
            }
            
            this.impSetFrame(frm.integral(), this._mc);
        }
        
        protected _updateAnimation() {
            // 跳过不存在的和正在播放的
            if (this._mc.movieClipData == null ||
                this._mc.isPlaying)
                return;
            // 跳过不设置动画定义的情况
            if (this._clip == null && this._location == null)
                return;

            // 不知道是不是bug，需要判断下mcd里面的帧数
            if (DEBUG && this._mc.movieClipData.frames.length == 0) {
                warn("mc尝试启动一个空帧"); // 需要在factory::instance中把空帧转换为null处理
                return;
            }
            
            // 是否需要处理反向
            this.tryReverseMovieClipData();
            
            // 开始播放动画
            if (this._signals)
                this._signals.emit(SignalStart);
            if (this._clip)
                this._mc.gotoAndPlay(this._clip, this.count);
            else if (this._location != null)
                this._mc.gotoAndPlay(this._location, this.count);
        }
        
        private __cb_end(e:any) {
            if (this.__disposed)
                return;
            this._signals.emit(SignalEnd);
        }

        private __cb_done(e:any) {
            if (this.__disposed)
                return;
            this._signals.emit(SignalDone);
        }
    }

    export class ClipConfig
    implements IReqResources
    {
        /**
           @name 资源名称，资源由 json\bmp 组成，如过传入的时候没有带后缀，则自动加上后缀
           @res 动作文件，通常为 _json
           @tex 素材平成，通常为 _png
        */
        constructor(name?:string, res?:string, tex?:string) {
            this._name = name;
            this._frame = nonnull1st(null, res, name);
            this._texture = nonnull1st(null, tex, res, name, res);
        }
        
        private _frame:UriSource; // 帧配置文件
        private _texture:UriSource; // 素材配置文件

        set frame(frm:UriSource) {
            this._frame = frm;
        }
        get frame():UriSource {
            let src = this._frame;
            if (src) {
                // 如过是普通key，则需要判断有没有加后缀，不存在需要自动补全
                if (src.indexOf('://') == -1) {
                    if (src.indexOf('_json') == -1)
                        src += '_json';
                }
            }
            return src;
        }
        
        set texture(tex:UriSource) {
            this._texture = tex;
        }
        get texture():UriSource {
            let src = this._texture;
            if (src) {
                if (src.indexOf('://') == -1) {
                    if (src.indexOf('_png') == -1)
                        src += '_png';
                }
            }
            return src;
        }
        
        /** 名字 */
        private _name:string;
        get name():string {
            return this._name;
        }
        set name(n:string) {
            this._name = n;
            if (this._frame == null)
                this._frame = n;
            if (this._texture == null)
                this._texture = n;
        }

        /** OPT 帧速 */
        fps:number;
        
        /** OPT 依赖的资源组 */
        resourceGroups:Array<string>;

        /** OPT 附加缩放 */
        additionScale:number;

        /** OPT 是否为独立数据，否则同一个资源公用一份帧数据 */
        key:string = '';

        get hashCode():number {
            return StringT.Hash(this.name + "::" + this._frame + "::" + this._texture + '::' + this.key);
        }
        
        isEqual(r:this):boolean {
            return this.name == r.name &&
                this._frame == r._frame &&
                this._texture == r._texture &&
                this.fps == r.fps &&                
                this.additionScale == r.additionScale &&
                this.key == r.key;
        }
        
        getReqResources():Array<ReqResource> {
            let r = [];
            r.push(new ResourceEntity(this.frame, ResType.JSON));
            r.push(new ResourceEntity(this.texture, ResType.TEXTURE));
            return r;
        }
        
        toString():string {
            return [this.name, this._frame, this._texture, this.key].join("\n");
        }
    }

    interface _ClipFactory
    {
        factory:egret.MovieClipDataFactory;
        cfg:ClipConfig;
    }
    
    class _ClipsManager
    {
        // 如果是同一种config，则只生成一份factorydata
        private _factorys = new KvObject<number, _ClipFactory>();
        
        // 根据配置实例化序列帧
        instance(cfg:ClipConfig,
                 cb:(mc:egret.MovieClipData, factory:_ClipFactory)=>void, ctx?:any)
        {
            if (length(cfg.resourceGroups))
            {
                ResManager.capsules(cfg.resourceGroups).load(()=>{
                    this.instanceOne(cfg,
                                     cb, ctx);
                }, this);
            }
            else
            {
                this.instanceOne(cfg,
                                 cb, ctx);
            }
        }
        
        protected instanceOne(cfg:ClipConfig,
                              cb:(mc:egret.MovieClipData, factory:_ClipFactory)=>void, ctx?:any)
        {
            let name = cfg.name;
            let frame = cfg.frame;
            let tex = cfg.texture;
            let key = cfg.hashCode;
            
            let factory:_ClipFactory = this._factorys[key];            
            if (factory)
            {                
                let d = this.instanceFromFactory(factory, name, false);
                if (d.frames.length == 0) {
                    warn('MovieClip为空帧，清检查资源文件和配置是否一致\n' + cfg);
                    d = null;
                }

                cb.call(ctx, d, factory);
            }
            else
            {
                ResManager.getSources([
                    [frame, ResType.JSON],
                    [tex, ResType.TEXTURE]
                ], RES.LoadPriority.CLIP, (ds:ICacheRecord[])=>{
                    let djson = ds[0].use();
                    let dtex = ds[1].use();
                    
                    if (djson == null) {
                        warn("mc-cfg " + frame + " not found");
                        cb.call(ctx, null, null);
                        return;
                    }
                    if (dtex == null) {
                        warn("mc-tex " + tex + " not found");
                        cb.call(ctx, null, null);
                        return;
                    }
                    
                    // 如果是全异步的情况，会同时实例化多个相同的factory，引用技术使用
                    let factory:_ClipFactory = this._factorys[key];
                    if (!factory) {
                        // 创建factory之后再创建数据
                        factory = {
                            cfg:cfg,
                            factory:new egret.MovieClipDataFactory(djson, dtex)
                        };
                        this._factorys[key] = factory;
                    }
                    
                    // 创建数据
                    let d = this.instanceFromFactory(factory, name, true);
                    if (d.frames.length == 0) {
                        warn('MovieClip为空帧，请检查资源文件和配置是否一致\n' + cfg);
                        d = null;
                    }
                    
                    cb.call(ctx, d, factory);
                }, this);
            }
        }

        protected instanceFromFactory(factory:_ClipFactory, name:string, newdata:boolean):egret.MovieClipData
        {
            let r = factory.factory.generateMovieClipData(name);
            if (r == null)
            {
                warn("生成序列帧 " + name + " 失败");
            }
            else
            {
                // 保存最原始的真帧速度
                if (newdata)
                    (<any>r).__fileFrameRate = r.frameRate;

                // 计算帧包围盒
                let rc = new Rect();
                
                // 计算帧的位置
                let pts = new PointCloud();
                ArrayT.Foreach(r.frames, (f:any):boolean=>{
                    if (f.hasOwnProperty('frame'))
                        return true;
                    let tex = r.textureData[f.res];
                    if (tex == null)
                        return true;
                    pts.add(new Point(f.x, f.y));
                    // 合并包围盒
                    rc.union(new Rect(0, 0, tex.w, tex.h));
                    return true;
                }, this);
                
                rc.position = pts.boundingBox.position;
                
                // 绑定包围盒到mc数据，用来在控件里计算位置、大小
                (<any>r).boundingBox = rc;
            }
            return r;
        }        
    }

    let _clipsManager:_ClipsManager;
    function ClipsManager():_ClipsManager {
        if (_clipsManager)
            return _clipsManager;
        _clipsManager = new _ClipsManager();
        return _clipsManager;
    }
    
}
