// 标准APP架构

module nn {

    export class EntrySettings {
        /** 独立模式，代表该实体只能同时存在一个对象，默认为true */
        singletone: boolean = true;

        /** 其他数据 */
        ext: any;

        static Default = new EntrySettings();
    }

    export interface IEntry {
        /** 模块的配置 */
        entrySettings?: EntrySettings;
    }

    export interface ILauncher {
        /** 处理模块的启动
         @param cls 待启动模块的类
         @param data 附加的参数
         */
        launchEntry(cls: any, data?: any);
    }

    export abstract class Manager extends SObject {
        /** 初始化自己和其它manager或者其它对象之间的关系 */
        abstract onLoaded();

        /** 当整个APP完成配置数据加载试调用，初始化自身的数据 */
        onDataLoaded() {
        }
    }

    export abstract class Managers extends SObject {
        register<T>(obj: T): T {
            this._managers.push(<any>obj);
            return obj;
        }

        onLoaded() {
            this._managers.forEach((e: Manager) => {
                e.onLoaded && e.onLoaded();
            });
        }

        onDataLoaded() {
            this._managers.forEach((e: Manager) => {
                e.onDataLoaded && e.onDataLoaded();
            });
        }

        protected _managers = new Array<Manager>();
    }

    export interface IEntryClass {
        name: string;
        clazz: () => Function;
    }

    export type EntryIdrToLauncherIdr = (entryidr: string) => string;
    export type EntryLauncherType = ILauncher | string | EntryIdrToLauncherIdr;
    export type EntryClassType = Function | IEntryClass;

    export class _EntriesManager {
        /** 注册一个模块
         @param entryClass类
         */
        register(entryClass: EntryClassType, data: EntrySettings = EntrySettings.Default) {
            let idr: string;
            if (typeof(entryClass) == 'object') {
                let o = <IEntryClass>entryClass;
                idr = o.name;
            } else {
                idr = nn.Classname(entryClass);
            }
            this._entries[idr] = entryClass;
            this._entriesdata[idr] = data;
        }

        /** 启动一个模块
         @param entry 类或者标类名
         @param launcher 启动点的标示号或者启动点的实例
         @pram data 附加的参数
         */
        invoke(entry: any | string, launcher: EntryLauncherType, ext?: any) {
            this._doInvoke(entry, launcher, ext);
        }

        protected _doInvoke(entry: any | string, launcher: EntryLauncherType, ext?: any) {
            if (entry == null) {
                nn.warn("不能打开空的实例");
                return;
            }
            let idr = typeof(entry) == 'string' ? entry : nn.Classname(entry);
            let cls: any = this._entries[idr];
            if (typeof(cls) == 'object') {
                // 复杂定义一个类型，为了支持动态入口逻辑
                let o = <IEntryClass>cls;
                cls = o.clazz();
            }
            if (cls == null) {
                nn.fatal("找不到实体类型 " + idr + "，请检查是否没有注册到EntriesManager");
                return;
            }
            // 在launchers中查启动点
            let ler: ILauncher;
            if (typeof(launcher) == 'string')
                ler = LaunchersManager.find(<string>launcher);
            if (ler == null && typeof(launcher) == 'function') {
                let leridr = (<EntryIdrToLauncherIdr>launcher)(idr);
                ler = LaunchersManager.find(leridr);
                // 如果ler为null，则代表目标模块还没有加载，需要先加载目标模块，待之准备好后，再加载当前模块
                if (ler == null) {
                    let wait = (s: nn.Slot) => {
                        if (s.data != leridr)
                            return;
                        LaunchersManager.signals.disconnect(nn.SignalChanged, wait);
                        let data = this._entriesdata[idr];
                        // 重新查找，此次不可能查不到
                        ler = LaunchersManager.find(leridr);
                        ler.launchEntry(cls, data);
                    };
                    LaunchersManager.signals.connect(nn.SignalChanged, wait, null);
                    this._doInvoke(leridr, launcher);
                    return;
                }
            }
            if (ler == null && typeof(launcher) == 'object')
                ler = <ILauncher>launcher;
            if (ler == null) {
                nn.fatal("没有找到停靠点" + <any>launcher);
                return;
            }
            // 加载最终的模块
            let data: EntrySettings = this._entriesdata[idr];
            if (!EntryCheckSettings(cls, data))
                return;
            // 检查是否可以打开
            if (data == null)
                data = new EntrySettings();
            data.ext = ext;
            ler.launchEntry(cls, data);
        }

        private _entries = new KvObject<string, EntryClassType>();
        private _entriesdata = new KvObject<string, EntrySettings>();

        toString(): string {
            let t = [];
            nn.MapT.Foreach(this._entries, (k: string) => {
                t.push(k);
            });
            return t.join(';');
        }
    }

    export let EntryCheckSettings: (cls: any, data: EntrySettings) => boolean;

    // 应用实例管理器
    export let EntriesManager = new _EntriesManager();

    export class _LaunchersManager extends nn.SObject {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(nn.SignalChanged);
        }

        /** 注册一个启动器 */
        register(obj: ILauncher) {
            let idr = nn.Classname(obj);
            let fnd = this._launchers[idr];
            if (fnd) {
                nn.warn('LaunchersManager 已经注册过 ' + idr);
                return;
            }
            this._launchers[idr] = obj;
            // 直接设置UI对象中的对应标记，用来当UI关闭时释放该停靠点
            (<any>obj).__need_remove_from_launchersmanager = true;
            this.signals.emit(nn.SignalChanged, idr);
        }

        /** 取消 */
        unregister(obj: ILauncher) {
            let idr = nn.Classname(obj);
            nn.MapT.RemoveKey(this._launchers, idr);
        }

        /** 查找一个启动器 */
        find(str: string): ILauncher {
            return this._launchers[str];
        }

        private _launchers = new KvObject<string, ILauncher>();

        toString(): string {
            let t = [];
            nn.MapT.Foreach(this._launchers, (k: string) => {
                t.push(k);
            });
            return t.join(';');
        }
    }

    // 应用入口管理器
    export let LaunchersManager = new _LaunchersManager();
}
