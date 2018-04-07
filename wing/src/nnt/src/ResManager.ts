module nn {

    // RES为单线程模型，所以可以直接扩展来进行加载的排序控制
    // 增加优先级的定义：普通UI资源 > Clip(Bone) 的加载

    export enum ResPriority {
        NORMAL = 0,
        CLIP = 1
    };

    // 不需要做Stack的模式，因为所有获取资源的地方必须传入priority的定义
    export let ResCurrentPriority = ResPriority.NORMAL;

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

    export let ResPartKey = "::res::part";

    // 资源氛围通过引擎工具整理好的group以及临时拼凑的资源组
    export type ResourceGroup = string;

    export class ResourceEntity {
        constructor(src: UriSource, t: ResType) {
            this.source = src;
            this.type = t;
        }

        source: UriSource;
        type: ResType;

        get hashCode(): number {
            return nn.StringT.Hash(this.source + ":" + this.type);
        }
    }

    // 依赖的资源
    export type ReqResource = ResourceGroup | ResourceEntity;

    // 检查是否属于uri的规范
    let WebUriCheckPattern = /^([\w]+):\/\/(.+)$/i;

    // 资源包
    export abstract class CResCapsule
        extends SObject {
        constructor(reqres: ReqResource[]) {
            super();
            this._reqRes = reqres;
        }

        dispose() {
            this._reqRes = undefined;
            super.dispose();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalDone);
            this._signals.register(SignalFailed);
            this._signals.register(SignalChanged);
        }

        private _isloading: boolean;

        load(cb?: () => void, ctx?: any) {
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
            this._reqRes.forEach((e: ReqResource) => {
                if (e == null)
                    return;
                this.loadOne(e, () => {
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

        protected abstract loadOne(rr: ReqResource,
                                   cb: () => void, ctx: any);

        protected abstract total(): number;

        hashKey(): number {
            return CResCapsule.HashKey(this._reqRes);
        }

        static HashKey(reqres: ReqResource[]): number {
            let a = [];
            reqres.forEach((rr: ReqResource) => {
                if (rr instanceof ResourceEntity)
                    a.push((<ResourceEntity>rr).hashCode);
                else
                    a.push(<ResourceGroup>rr);
            });
            return nn.StringT.Hash(a.join('::'));
        }

        // 进度记录
        protected _total: number;
        protected _idx: number;

        // 包含的资源组
        protected _reqRes: Array<ReqResource>;
    }

    export abstract class CResManager
        extends SObject {
        constructor() {
            super();
        }

        /** 是否支持多分辨率架构 */
        multiRes: boolean;

        /** Manager 依赖的目录名，其他资源目录均通过附加此目录来定位 */
        private _directory: string;
        get directory(): string {
            return this._directory;
        }

        set directory(nm: string) {
            this._directory = nm;

            // 仿照 android，不同尺寸适配不同分辨率的资源
            if (this.multiRes) {
                switch (Device.shared.screenType) {
                    case ScreenType.NORMAL:
                        break;
                    case ScreenType.LOW:
                        this._directory += '_m';
                        break;
                    case ScreenType.EXTRALOW:
                        this._directory += '_l';
                        break;
                    case ScreenType.EXTRAHIGH:
                        this._directory += '_xh';
                        break;
                    case ScreenType.HIGH:
                        this._directory += '_h';
                        break;
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

        /** 加载一个资源配置 */
        abstract loadConfig(file: string, cb: (e: any) => void, ctx: any);

        /** 缓存控制 */
        cacheEnabled: boolean;

        /** 资源包管理 */
        abstract capsules(grps: ReqResource[]): CResCapsule;

        abstract removeCapsule(cp: CResCapsule);

        /** 一组资源是否已经加载 */
        abstract isGroupsArrayLoaded(grps: string[]): boolean;

        /** 尝试加载 */
        abstract tryGetRes(key: string): ICacheRecord;

        /** 异步加载资源，和 getRes 的区别不仅是同步异步，而且异步可以忽略掉 group 的状态直接加载资源*/
        abstract getResAsync(key: string, priority: ResPriority,
                             cb: (rcd: ICacheRecord) => void, ctx?: any);

        /** 获取 key 对应资源 url */
        abstract getResUrl(key: string): string;

        /** 根据 src - type 的对照数组来加载资源数组 */
        getSources(srcs: Array<[string, ResType]>, priority: ResPriority,
                   cb: (ds: [ICacheRecord]) => void, ctx: any) {
            if (length(srcs) == 0) {
                cb.call(ctx, []);
                return;
            }

            let res = [];
            let proc = (src: [string, ResType], idx) => {
                this.getSourceByType(src[0], priority, (ds: ICacheRecord) => {
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
        abstract getResByUrl(src: UriSource, priority: ResPriority,
                             cb: (rcd: ICacheRecord | CacheRecord) => void, ctx: any, type: ResType);

        abstract hasAsyncUri(uri: UriSource): boolean;

        /** 根据类型来获得指定的资源 */
        getSourceByType(src: UriSource, priority: ResPriority,
                        cb: (ds: ICacheRecord) => void, ctx: any, type: ResType) {
            if (src == null) {
                cb.call(ctx, new CacheRecord());
                return;
            }

            // 处理特殊类型
            if (type == ResType.JSREF) {
                Scripts.require(src, () => {
                    cb.call(ctx);
                }, this);
                return;
            }

            // 附加参数
            let part: string;

            // 判断是否有附加控制用 # 来隔开
            let parts = src.split('#');
            src = parts[0];
            part = parts[1];

            // 如果是 uri
            let res = src.match(WebUriCheckPattern);
            if (res != null) {
                let scheme = res[1];
                let path = res[2];
                if (scheme == 'http' || scheme == 'https') {
                    this.getResByUrl(src, priority, (rcd: ICacheRecord) => {
                        rcd.prop(ResPartKey, part);
                        cb.call(ctx, rcd);
                    }, this, type);
                }
                else if (scheme == 'file') {
                    this.getResByUrl(path, priority, (rcd: ICacheRecord) => {
                        rcd.prop(ResPartKey, part);
                        cb.call(ctx, rcd);
                    }, this, type);
                }
                else if (scheme == 'assets') {
                    let url = this.directory + 'assets/' + path;
                    this.getResByUrl(url, priority, (rcd: ICacheRecord) => {
                        rcd.prop(ResPartKey, part);
                        cb.call(ctx, rcd);
                    }, this, type);
                }
            }
            else {
                let rcd = <CacheRecord>ResManager.tryGetRes(src);
                // 如果直接取得了 Res，则直接设定，否则需要通过异步来取得对应的资源
                if (rcd.val != null) {
                    rcd.prop(ResPartKey, part);
                    cb.call(ctx, rcd);
                }
                else {
                    ResManager.getResAsync(src, priority, (rcd: ICacheRecord) => {
                        rcd.prop(ResPartKey, part);
                        cb.call(ctx, rcd);
                    }, this);
                }
            }
        }

        getJson(src: UriSource, priority: ResPriority,
                cb: (obj: ICacheRecord) => void, ctx: any): void {
            this.getSourceByType(<string>src, priority, cb, ctx, ResType.JSON);
        }

        getText(src: UriSource, priority: ResPriority,
                cb: (obj: ICacheRecord) => void, ctx: any): void {
            this.getSourceByType(<string>src, priority, cb, ctx, ResType.TEXT);
        }

        getTexture(src: TextureSource, priority: ResPriority,
                   cb: (tex: ICacheRecord) => void, ctx: any): void {
            if (<any>src instanceof COriginType) {
                let t = new CacheRecord();
                t.val = (<COriginType>src).imp;
                cb.call(ctx, t);
                return;
            }
            this.getSourceByType(<string>src, priority, cb, ctx, ResType.TEXTURE);
        }

        getBitmapFont(src: FontSource, priority: ResPriority,
                      cb: (fnt: ICacheRecord) => void, ctx: any) {
            if (<any>src instanceof COriginType) {
                let t = new CacheRecord();
                t.val = (<COriginType>src).imp;
                cb.call(ctx, t);
                return;
            }
            this.getSourceByType(<string>src, priority, cb, ctx, ResType.FONT);
        }

        getSound(src: SoundSource, priority: ResPriority,
                 cb: (snd: ICacheRecord) => void, ctx: any) {
            if (<any>src instanceof COriginType) {
                let t = new CacheRecord();
                t.val = (<COriginType>src).imp;
                cb.call(ctx, t);
                return;
            }
            this.getSourceByType(<string>src, priority, cb, ctx, ResType.SOUND);
        }

        getBinary(src: UriSource, priority: ResPriority,
                  cb: (snd: ICacheRecord) => void, ctx: any) {
            this.getSourceByType(<string>src, priority, cb, ctx, ResType.BINARY);
        }

    }

    /** 全局唯一的资源管理实体 */
    export let ResManager: CResManager;

    /** 使用约定的方式获取资源名称 */
    export class ResName {
        /** 普通 */
        static normal(name: string): string {
            return name.replace('_hl', '');
        }

        /** 高亮 */
        static hl(name: string): string {
            return this.normal(name) + '_hl';
        }
    }

}
