module nn {
    
    /** 使用UriSource均代表支持
        1, resdepo 的 key
        2, http/https:// 的远程url
        3, assets:// 直接访问资源目录下的文件
        4, <module>://<资源的key(命名方式和resdepto的默认一致)>
    */
    export type UriSource = string;

    export enum ResType {
        JSON, //jsobj对象
        TEXTURE, //贴图对象
        TEXT, //字符串
        FONT, //字体
        SOUND, //声音
        BINARY, //2进制原始数据
        JSREF, //引用的其它js文件，会影响到加载方式
    };
    
    export interface ICacheJson
    extends ICacheRecord
    {
        use():any;
    }
    
    export interface ICacheTexture
    extends ICacheRecord
    {
        use():egret.Texture;
    }
    
    export interface ICacheText
    extends ICacheRecord
    {
        use():string;
    }
    
    export interface ICacheFont
    extends ICacheRecord
    {
        use():egret.BitmapFont;
    }
    
    export interface ICacheSound
    extends ICacheRecord
    {
        use():egret.Sound;
    }

    export interface ICacheBinary
    extends ICacheRecord
    {
        use():any;
    }

    export let ResPartKey = "::res::part";
    
    // 资源氛围通过引擎工具整理好的group以及临时拼凑的资源组
    export type ResourceGroup = string;
    export class ResourceEntity
    {
        constructor(src:UriSource, t:ResType) {
            this.source = src;
            this.type = t;
        }
        
        source:UriSource;
        type:ResType;
        
        get hashCode():number {
            return nn.StringT.Hash(this.source + ":" + this.type);
        }
    }

    // 依赖的资源
    export type ReqResource = ResourceGroup | ResourceEntity;

    // 检查是否属于uri的规范
    let WebUriCheckPattern = /^([\w]+):\/\/(.+)$/i;

    // 资源池
    class _ResMemcache
    extends Memcache
    {
        constructor() {
            super();
            this.enable = true;
        }        
        
        protected doRemoveObject(rcd:CacheRecord) {
            super.doRemoveObject(rcd);
            let srcs = this._sources[rcd.key];
            srcs.forEach((e:string)=>{
                RES.destroyRes(e);
                if (VERBOSE)
                    log("释放资源 " + e);
                delete this._keys[e];
            });
            delete this._sources[rcd.key];
        }

        // 自定义个hashCode
        private _hashCode:number = 0;
        static IDR_HASHCODE = '::mc::hashCode';

        // 根据source添加data
        add(source:string, data:any):ICacheRecord {
            // 根据data的不同计算对应的key
            let key:any;
            if (data == null)
            {
                key = "::mc::null";
            }
            else if ('hashCode' in data)
            {
                key = data.hashCode;
            }
            else if (typeof(data) == 'object')
            {
                key = data[_ResMemcache.IDR_HASHCODE];
                if (key == null) {
                    key = '::mc::' + this._hashCode++;
                    data[_ResMemcache.IDR_HASHCODE] = key;
                }
            }
            else
            {                
                let rcd = new CacheRecord();
                rcd.val = data;
                return rcd;
            }

            let srcs = this._sources[key];
            if (srcs == null) {
                srcs = [source];
                this._sources[key] = srcs;
            } else {
                srcs.push(source);
            }
            this._keys[source] = key;                

            // 添加到缓存中
            let obj = new _ResCacheObject();
            obj.key = key;
            obj.data = data;
            return this.cache(obj);
        }

        query(source:string):ICacheRecord {
            let key = this._keys[source];
            return super.query(key);
        }
        
        // cache-key 和 sources 的对照表
        private _sources = new KvObject<any, Array<string> >();
        private _keys = new KvObject<string, any>();
    }
    
    class _ResCacheObject
    implements ICacheObject
    {
        constructor() {}
        
        cacheFlush:boolean = true;
        cacheUpdated:boolean = true;
        cacheTime:number = -1;

        keyForCache():string {
            return this.key;
        }
        
        valueForCache():any {
            return this.data;
        }
        
        data:any;
        key:any;        
    }

    // 资源包
    export class ResCapsule
    extends SObject
    {
        constructor(reqres:ReqResource[], ewd:EventWeakDispatcher) {
            super();
            this._reqRes = reqres;
            this._ewd = ewd;
        }
        
        dispose() {
            this._ewd = undefined;
            this._reqRes = undefined;
            super.dispose();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalDone);
            this._signals.register(SignalFailed);
            this._signals.register(SignalChanged);
        }

        private _isloading:boolean;
        
        load(cb?:()=>void, ctx?:any) {
            // 如果为空，直接回调
            if (IsEmpty(this._reqRes)) {
                if (cb)
                    cb.call(ctx);
                return;
            }

            // 监听结束的消息
            if (cb)
                this.signals.connect(SignalDone, cb, ctx);

            // 如果正在加载，则直接返回等待
            if (this._isloading)
                return;

            this._isloading = true;
            this._total = this.total();
            this._idx = 0;

            // 直接一次性加载所有的资源
            let reqid = 0;
            this._reqRes.forEach((e:ReqResource)=>{
                if (e == null)
                    return;
                this.loadOne(e, ()=>{
                    if (this._reqRes.length != ++reqid)
                        return;

                    // 加载完成
                    // 移除时会自动析构，需要保护生命期
                    this.grab();
                    // 从管理器中移除
                    ResManager.removeCapsule(this);
                    // 完成加载
                    this._isloading = false;
                    // 回调结束的事件
                    this.signals.emit(SignalDone);
                    this.drop();
                }, this);
            });            
        }
        
        protected loadOne(rr:ReqResource,
                          cb:()=>void, ctx:any)
        {
            let curidx = 0;
            // 判断是加载资源组，还是直接加载资源
            if (rr instanceof ResourceEntity)
            {
                let re = <ResourceEntity>rr;
                ResManager.getSourceByType(re.source, RES.LoadPriority.NORMAL, (rcd:ICacheRecord)=>{
                    if (this.signals.isConnected(SignalChanged)) {
                        curidx = 1;
                        this._idx += 1;
                        // 发出消息
                        this.signals.emit(SignalChanged, new Percentage(this._total, this._idx));
                    }
                    cb.call(ctx);
                }, this, re.type);
            }
            else
            {
                let grp = <ResourceGroup>rr;
                if (RES.isGroupLoaded(grp)) {
                    if (this.signals.isConnected(SignalChanged)) {
                        let len = RES.getGroupByName(grp).length;
                        curidx = len;
                        this._idx += len;
                        this.signals.emit(SignalChanged, new Percentage(this._total, this._idx));
                    }
                    cb.call(ctx);
                } else {
                    this._ewd.add("::res::group::" + grp, cb, ctx);
                    if (this.signals.isConnected(SignalChanged)) {
                        this._ewd.add("::res::group::progress::" + grp, (e:RES.ResourceEvent)=>{
                            // 计算进度
                            let delta = e.itemsLoaded - curidx;
                            curidx = e.itemsLoaded;
                            this._idx += delta;
                            // 发出消息
                            this.signals.emit(SignalChanged, new Percentage(this._total, this._idx));
                        }, this);
                    }
                    RES.loadGroup(grp);
                }
            }
        }

        protected total():number {
            let r = 0;
            this._reqRes.forEach((rr:ReqResource)=>{
                if (rr instanceof ResourceEntity)
                    r += 1;
                else
                    r += RES.getGroupByName(<ResourceGroup>rr).length;
            });
            return r;
        }

        hashKey():number {
            return ResCapsule.HashKey(this._reqRes);
        }

        static HashKey(reqres:ReqResource[]):number {
            let a = [];
            reqres.forEach((rr:ReqResource)=>{
                if (rr instanceof ResourceEntity)
                    a.push((<ResourceEntity>rr).hashCode);
                else
                    a.push(<ResourceGroup>rr);
            });
            return nn.StringT.Hash(a.join('::'));
        }
        
        // 进度记录
        private _total:number;
        private _idx:number;

        // 包含的资源组
        protected _reqRes:Array<ReqResource>;

        // 用来从 ResManager 里拿到消息
        private _ewd:EventWeakDispatcher;        
    }

    let EgretItemTypeMap = {};
    EgretItemTypeMap[ResType.JSON] = RES.ResourceItem.TYPE_JSON;
    EgretItemTypeMap[ResType.TEXTURE] = RES.ResourceItem.TYPE_IMAGE;
    EgretItemTypeMap[ResType.TEXT] = RES.ResourceItem.TYPE_TEXT;
    EgretItemTypeMap[ResType.FONT] = RES.ResourceItem.TYPE_FONT;
    EgretItemTypeMap[ResType.SOUND] = RES.ResourceItem.TYPE_SOUND;
    EgretItemTypeMap[ResType.BINARY] = RES.ResourceItem.TYPE_BIN;

    class _ResManager
    extends SObject
    {
        constructor() {
            super();

            // config 只在manager中处理，其他事件转到包中处理
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,
                                 this._cfg_loaded, this);
            
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,
                                 this._grp_complete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,
                                 this._grp_failed, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,
                                 this._grp_progress, this);

            // 切换为4线程下载资源
            RES.setMaxLoadingThread(4);
        }

        /** 是否支持多分辨率架构 */
        multiRes:boolean;

        /** Manager 依赖的目录名，其他资源目录均通过附加此目录来定位 */
        private _directory:string;
        get directory():string {
            return this._directory;
        }
        set directory(nm:string) {
            this._directory = nm;

            // 仿照 android，不同尺寸适配不同分辨率的资源
            if (this.multiRes) {
                switch (Device.shared.screenType) {
                case ScreenType.NORMAL: break;
                case ScreenType.LOW: this._directory += '_m'; break;
                case ScreenType.EXTRALOW: this._directory += '_l'; break;
                case ScreenType.EXTRAHIGH: this._directory += '_xh'; break;
                case ScreenType.HIGH: this._directory += '_h'; break;
                }
            }

            // 如果是发布模式，则使用发布图片
            if (PUBLISH) {
                // RELEASE模式下才需要拼装资源目录
                if (!ISDEBUG)
                    this._directory = this._directory + '_' + APPVERSION;
            }

            // 保护一下路径末尾
            this._directory += '/';
        }

        // 正在加载的资源包
        private _capsules = new KvObject<number, ResCapsule>();

        // 用来转发事件
        private _ewd = new EventWeakDispatcher();

        /** 加载一个资源配置 */
        loadConfig<T>(file:string, cb:(e:T)=>void, ctx:any) {
            this._ewd.add("::res::config", cb, ctx);
            // 如过file是绝对地址，则不添加directory
            if (file.indexOf('://') == -1)
                file = this.directory + file;
            RES.loadConfig(file,
                           this.directory);
        }

        private _cfg_loaded(e:RES.ResourceEvent) {
            let idr = "::res::config";
            this._ewd.invoke(idr, e, false);
            this._ewd.remove(idr);
        }

        private _grp_complete(e:RES.ResourceEvent) {            
            let idr0 = "::res::group::" + e.groupName;
            let idr1 = "::res::group::progress::" + e.groupName;
            this._ewd.invoke(idr0, e, false);
            this._ewd.remove(idr0);
            this._ewd.remove(idr1);
        }

        private _grp_failed(e:RES.ResourceEvent) {
            this._grp_complete(e);
        }

        private _grp_progress(e:RES.ResourceEvent) {
            let item = e.resItem;

            // 增加其他数据文件
            if (item.type == RES.ResourceItem.TYPE_BIN) {
                // 增加字体
                if (FontFilePattern.test(item.url)) {
                    FontsManager.add(item.name, item.url);
                }
            }
            
            let idr = "::res::group::progress::" + e.groupName;            
            this._ewd.invoke(idr, e, false);
        }

        capsules(grps:ReqResource[]):ResCapsule {
            let k = ResCapsule.HashKey(grps);
            let cp:ResCapsule = this._capsules[k];
            if (cp == null) {
                cp = new ResCapsule(grps, this._ewd);
                this._capsules[k] = cp;
            }
            return cp;
        }

        removeCapsule(cp:ResCapsule) {
            let k = cp.hashKey();
            cp.drop();
            delete this._capsules[k];
        }

        isGroupsArrayLoaded(grps:string[]):boolean {
            if (grps) {
                for (let i = 0; i < grps.length; ++i) {
                    if (RES.isGroupLoaded(grps[i]) == false)
                        return false;
                }
            }
            return true;
        }
        
        /** 尝试加载 */
        protected tryGetRes(key:string):ICacheRecord {
            let rcd = this.cache.query(key);
            if (rcd == null) {
                let d = RES.getRes(key);
                if (d) {
                    rcd = this.cache.add(key, d);
                } else {
                    return new CacheRecord();
                }
            }
            return rcd;
        }

        /** 异步加载资源，和 getRes 的区别不仅是同步异步，而且异步可以忽略掉 group 的状态直接加载资源*/
        getResAsync(key:string, priority:RES.LoadPriority,
                    cb:(rcd:ICacheRecord)=>void, ctx?:any)
        {
            if (length(key) == 0) {
                cb.call(ctx, new CacheRecord());
                return;
            }
            let rcd = this.cache.query(key);
            if (rcd == null) {
                RES.CurrentPriority = priority;
                RES.getResAsync(key, (d:any)=>{
                    if (d) {
                        rcd = this.cache.add(key, d);
                    } else {
                        rcd = new CacheRecord();
                        warn("res " + key + " not found");
                    }
                    cb.call(ctx, rcd);
                }, this);
            } else {
                cb.call(ctx, rcd);
            }
        }

        if (DEBUG) {
            if ((<any>RES).configInstance == undefined)
                fatal('ResManager 存在兼容问题');
        }

        /** 获取 key 对应资源 url */
        getResUrl(key:string):string {
            let obj = (<any>RES).configInstance.keyMap[key];
            if (obj == null) {
                warn("res " + key + " not found");
                return null;
            }
            return obj.url;
        }

        /** 根据 src - type 的对照数组来加载资源数组 */
        getSources(srcs:[[string, ResType]], priority:RES.LoadPriority,
                   cb:(ds:[ICacheRecord])=>void, ctx:any)
        {
            if (length(srcs) == 0) {
                cb.call(ctx, []);
                return;
            }
            
            let res = [];
            let proc = (src:[string, ResType], idx)=>{
                this.getSourceByType(src[0], priority, (ds:ICacheRecord)=>{
                    res.push(ds);
                    if (++idx == srcs.length) {
                        cb.call(ctx, res);
                    } else {
                        proc(srcs[idx], idx);
                    }
                }, this, src[1]);
            };
            proc(srcs[0], 0);
        }

        /** 异步直接加载远程资源 */
        getResByUrl(src:UriSource, priority:RES.LoadPriority,
                    cb:(rcd:ICacheRecord|CacheRecord)=>void, ctx:any, type:ResType)
        {            
            // 如果位于缓存中，则直接返回
            let rcd = this.cache.query(src);
            if (rcd != null) {
                cb.call(ctx, rcd);
                return;
            }

            // 不在缓存中，需要直接获得
            RES.CurrentPriority = priority;
            RES.getResByUrl(src, (d:any)=>{
                // 添加到缓存
                rcd = this.cache.add(src, d);
                // 回调
                cb.call(ctx, rcd);
            }, this, EgretItemTypeMap[type]);
        }
        
        hasAsyncUri(uri:UriSource):boolean {
            return this.cache.query(uri) != null;
        }
        
        /** 根据类型来获得指定的资源 */
        getSourceByType(src:UriSource, priority:RES.LoadPriority,
                        cb:(ds:ICacheRecord)=>void, ctx:any, type:ResType)
        {
            if (src == null) {
                cb.call(ctx, new CacheRecord());
                return;
            }

            // 处理特殊类型
            if (type == ResType.JSREF)
            {
                Scripts.require(src, ()=>{
                    cb.call(ctx);
                }, this);
                return;
            }

            // 附加参数
            let part:string;
            
            // 判断是否有附加控制用 # 来隔开
            let parts = src.split('#');
            src = parts[0];
            part = parts[1];
            
            // 如果是 uri
            let res = src.match(WebUriCheckPattern);
            if (res != null)
            {
                let scheme = res[1];
                let path = res[2];
                if (scheme == 'http' || scheme == 'https')
                {
                    this.getResByUrl(src, priority, (rcd:ICacheRecord)=> {
                        rcd.prop(ResPartKey, part);
                        cb.call(ctx, rcd);
                    }, this, type);
                }
                else if (scheme == 'file')
                {
                    this.getResByUrl(path, priority, (rcd:ICacheRecord)=> {
                        rcd.prop(ResPartKey, part);
                        cb.call(ctx, rcd);
                    }, this, type);
                }
                else if (scheme == 'assets')
                {
                    let url = this.directory + 'assets/' + path;
                    this.getResByUrl(url, priority, (rcd:ICacheRecord)=> {
                        rcd.prop(ResPartKey, part);
                        cb.call(ctx, rcd);
                    }, this, type);
                }
            }
            else
            {
                let rcd = <CacheRecord>ResManager.tryGetRes(src);
                // 如果直接取得了 Res，则直接设定，否则需要通过异步来取得对应的资源
                if (rcd.val != null)
                {
                    rcd.prop(ResPartKey, part);
                    cb.call(ctx, rcd);
                }
                else
                {
                    ResManager.getResAsync(src, priority, (rcd:ICacheRecord)=>{
                        rcd.prop(ResPartKey, part);
                        cb.call(ctx, rcd);
                    }, this);
                }
            }
        }

        getJson(src:UriSource, priority:RES.LoadPriority,
                cb:(obj:ICacheJson)=>void, ctx:any)
        {
            this.getSourceByType(<string>src, priority, cb, ctx, ResType.JSON);
        }
        
        getText(src:UriSource, priority:RES.LoadPriority,
                cb:(obj:ICacheText)=>void, ctx:any)
        {
            this.getSourceByType(<string>src, priority, cb, ctx, ResType.TEXT);
        }

        getTexture(src:TextureSource, priority:RES.LoadPriority,
                   cb:(tex:ICacheTexture)=>void, ctx:any)
        {
            if (<any>src instanceof COriginType) {
                let t = new CacheRecord();
                t.val = (<COriginType>src).imp;
                cb.call(ctx, t);
                return;
            }
            if (<any>src instanceof egret.Texture) {
                let t = new CacheRecord();
                t.val = src;
                cb.call(ctx, t);
                return;
            }
            this.getSourceByType(<string>src, priority, cb, ctx, ResType.TEXTURE);
        }

        getBitmapFont(src:FontSource, priority:RES.LoadPriority,
                      cb:(fnt:ICacheFont)=>void, ctx:any)
        {
            if (<any>src instanceof COriginType) {
                let t = new CacheRecord();
                t.val = (<COriginType>src).imp;
                cb.call(ctx, t);
                return;
            }
            if (<any>src instanceof egret.BitmapFont) {
                let t = new CacheRecord();
                t.val = src;
                cb.call(ctx, t);
                return;
            }
            // 通过配置来获得
            if (<any>src instanceof FontConfig) {
                let cfg = <FontConfig>src;
                if (cfg.name) {
                    this.getSourceByType(cfg.name, priority, cb, ctx, ResType.FONT);
                } else {
                    // 通过两个配置文件来获得
                    this.getSources([[cfg.texture, ResType.TEXTURE],
                                     [cfg.config, ResType.JSON]],
                                    priority, 
                                    (ds:ICacheRecord[])=>{
                                        let tex:ICacheTexture = ds[0];
                                        let cfg:ICacheJson = ds[1];
                                        // todo 现在为简化font缓存处理(直接调用use逻辑避免tex和cfg被释放)
                                        let t = new CacheRecord();
                                        t.val = new egret.BitmapFont(tex.use(), cfg.use());
                                        cb.call(ctx, t);
                                    }, this);
                }
                return;
            }
            // 通过key来获得
            this.getSourceByType(<string>src, priority, cb, ctx, ResType.FONT);
        }
        
        getSound(src:SoundSource, priority:RES.LoadPriority,
                 cb:(snd:ICacheSound)=>void, ctx:any)
        {
            if (<any>src instanceof COriginType) {
                let t = new CacheRecord();
                t.val = (<COriginType>src).imp;
                cb.call(ctx, t);
                return;
            }
            if (<any>src instanceof egret.Sound) {
                let t = new CacheRecord();
                t.val = src;
                cb.call(ctx, t);
                return;
            }
            this.getSourceByType(<string>src, priority, cb, ctx, ResType.SOUND);
        }

        getBinary(src:UriSource, priority:RES.LoadPriority,
                  cb:(snd:ICacheBinary)=>void, ctx:any)
        {
            this.getSourceByType(<string>src, priority, cb, ctx, ResType.BINARY);
        }
        
        // 资源的缓存管理
        cache = new _ResMemcache();
    }

    /** 全局唯一的资源管理实体 */
    export let ResManager = new _ResManager();

    /** 使用约定的方式获取资源名称 */
    export class ResName
    {
        /** 普通 */
        static normal(name:string):string {
            return name.replace('_hl', '');
        }

        /** 高亮 */
        static hl(name:string):string {
            return this.normal(name) + '_hl';
        }
    }
    
}
