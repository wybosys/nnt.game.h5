declare class KvObject<K, V> {
}
declare module nn {
    let ECMA6_NATIVE: boolean;
    class CMap<K, V> {
        constructor();
        private _imp;
        private _n_clear();
        private _i_clear();
        clear: () => void;
        private _n_delete(k);
        private _i_delete(k);
        delete: (k: K) => void;
        private _n_foreach(cb, ctx?);
        private _i_foreach(cb, ctx?);
        forEach: (cb: (k: K, v: V) => void, ctx?: any) => void;
        private _n_has(k);
        private _i_has(k);
        has: (k: K) => boolean;
        private _n_length();
        private _i_length();
        readonly length: number;
        private _n_set(k, v);
        private _i_set(k, v);
        set: (k: K, v: V) => void;
        private _n_get(k);
        private _i_get(k);
        get: (k: K) => V;
    }
    class CSet<V> {
        constructor();
        private _imp;
        private _map;
        private _arr;
        private _n_add(o);
        private _i_add(o);
        add: (o: V) => boolean;
        private _n_has(o);
        private _i_has(o);
        has: (o: V) => boolean;
        private _n_delete(o);
        private _i_delete(o);
        delete: (o: V) => boolean;
        private _n_size();
        private _i_size();
        readonly size: number;
        private _n_clear();
        private _i_clear();
        clear: () => void;
        private _n_foreach(cb, ctx?);
        private _i_foreach(cb, ctx?);
        forEach: (cb: (o: V) => void, ctx?: any) => void;
    }
    type MapType<K, V> = KvObject<K, V> | Object;
    type SetType<V> = CSet<V>;
}
/** 三态 bool */
declare type tribool = number;
declare let tritrue: number;
declare let trifalse: number;
declare let trimay: number;
/** 基础数字＋字符串 */
declare type numstr = number | string | any;
/** JSONOBJ+字符串 */
declare type jsonobj = string | Object;
declare module nn {
    type Interval = number;
    let IMP_TIMEPASS: () => number;
    let IMP_CREATE_TIMER: (duration: Interval, count: number) => any;
    let IMP_START_TIMER: (tmr: any, cb: () => void, ctx: any) => void;
    let IMP_STOP_TIMER: (tmr: any, cb: () => void, ctx: any) => void;
    let IMP_STORAGE_GET: (key: string) => string;
    let IMP_STORAGE_SET: (key: string, v: string) => void;
    let IMP_STORAGE_DEL: (key: string) => void;
    let IMP_STORAGE_CLEAR: () => void;
    let Defer: (cb: () => void, ctx: any, ...p: any[]) => void;
    enum FrameworkFeature {
        NOSYNC = 4,
        MULTIRES = 8,
        FULLSCREEN = 16,
        DEFAULT = 0,
    }
    /** 定位方式 */
    enum LocatingType {
        LAYOUT = 0,
        ABSOLUTE = 1,
        RELATIVE = 2,
    }
    /** 全局的设计和实际坐标的转换 */
    let ScaleFactorX: number;
    let ScaleFactorDeX: number;
    let ScaleFactorY: number;
    let ScaleFactorDeY: number;
    let ScaleFactorW: number;
    let ScaleFactorDeW: number;
    let ScaleFactorH: number;
    let ScaleFactorDeH: number;
    let ScaleFactorS: number;
    let ScaleFactorDeS: number;
    let StageScaleFactorX: number;
    let StageScaleFactorY: number;
    let DomScaleFactorX: number;
    let DomScaleFactorY: number;
    let DomOffsetX: number;
    let DomOffsetY: number;
    let MAX_INT: number;
    function Integral(v: number): number;
    /** 基类的接口 */
    interface IObject {
        dispose(): void;
    }
    /** 引用计数的接口 */
    interface IReference {
        drop(): void;
        grab(): void;
    }
    class RefVariable<T extends IReference> {
        get(): T;
        set(o: T, grab?: boolean): void;
        dispose(): void;
        private _val;
    }
    /** 默认的Object接口 */
    interface IRefObject extends IObject, IReference {
    }
    /** 序列化的接口 */
    interface ISerializable {
        /** 序列化对象到流，返回结果 */
        serialize(stream: any): any;
        /** 从流中构建对象 */
        unserialize(stream: any): boolean;
    }
    /** 单件的接口 */
    interface ISingleton {
    }
    /** 全局的不可释放的唯一实例 */
    interface IShared {
    }
    /** 强制转换 */
    function any_cast<T>(obj: any): T;
    interface ISObject {
        signals: Signals;
    }
    /** 带有信号的基类
        @brief 如果不能直接基类，需要实现信号的相关函数 */
    class SObject implements IRefObject, ISObject {
        /** 构造函数 */
        constructor();
        tag: any;
        /** 唯一id */
        static HashCode: number;
        hashCode: number;
        __disposed: boolean;
        /** 析构函数 */
        dispose(): void;
        /** 实现注册信号
            @note 业务通过重载此函数并通过调用 this._signals.register 来注册信号
        */
        protected _initSignals(): void;
        /** 信号 */
        protected _signals: Signals;
        readonly signals: Signals;
        protected _instanceSignals(): void;
        /** 绑定一个生命期 */
        private _attachs;
        attach(o: any): void;
        detach(o: any): void;
        /** 维护一个内部的引用计数器，防止对象的提前析构 */
        protected _refcnt: number;
        /** 释放一次引用，如果到0则析构对象 */
        drop(): void;
        /** 增加一次引用 */
        grab(): void;
        /** 调用自己 */
        callself<implT>(cb: (s: implT) => void, ctx?: any): implT;
        /** 获得自己，为了支持 InstanceType */
        readonly obj: this;
        /** 测试自己是否为空 */
        isnull(): boolean;
        /** 比较函数 */
        isEqual(r: this): boolean;
        /** 获得自己的类定义 */
        readonly clazz: any;
        /** 实例化一个对象 */
        static New<T>(cb: (o: T) => void, ...p: any[]): T;
    }
    interface ISObjectWrapper {
        signals: Signals;
        attach: (obj: any) => void;
        dispose: () => void;
    }
    class SObjectWrapper extends SObject {
        constructor(o: any);
        static _imp_dispose: () => void;
        static _imp_attach: (o: any) => void;
        dispose(): void;
        private _wrpobj;
    }
    let OBJECT_DEFAULT_KEYS: string[];
    function EventHook(obj: any, event: any, fun: any, target?: any, capture?: boolean): void;
    function EventUnhook(obj: any, event: any, fun: any, target?: any, capture?: boolean): void;
    /** 增加引用计数 */
    function grab<T>(o: T): T;
    /** 减计数对象 */
    function drop<T>(o: T): T;
    /** 直接析构一个对象 */
    function dispose<T>(o: T): void;
    /** 错误的类型 */
    class Failed {
        constructor(code: number, msg?: string, lmsg?: string);
        message: string;
        locationMessage: string;
        code: number;
        line: number;
        toString(): string;
    }
    /** 测试用的 closure, 如果当前不是测试模式，则会抛出一个错误 */
    function test(cb: Function, ctx?: any): void;
    /** debug 模式下才执行 */
    function debug(cb: Function, ctx?: any): void;
    module debug {
        let text: {
            'p': string;
            'c': string;
        };
        let obje: {
            'p': string;
            'c': string;
        };
        let info: {
            'p': string;
            'c': string;
        };
        let noti: {
            'p': string;
            'c': string;
        };
        let warn: {
            'p': string;
            'c': string;
        };
        function log(msg: string, face: any): void;
        function obj(o: any): void;
        function group(msg: string, cb: () => void, ctx: any): void;
    }
    /** dump一个变量 */
    function vardump(o: any, depth?: number): string;
    /** 获得调用路径 */
    function callstack(): Array<any>;
    /** 控制台输出日志 */
    function log(msg: string, obj?: any): void;
    /** 控制台打印一个对象 */
    function obj(o: any): void;
    /** 控制台dump一个对象 */
    function dump(o: any, depth?: number): string;
    /** 控制台输出信息 */
    function info(msg: string): void;
    /** 控制台输出提示 */
    function noti(msg: string): void;
    /** 控制台输出警告 */
    function warn(msg: string, title?: string, ...obj: any[]): void;
    /** 控制台打印一个异常 */
    function exception(obj: any, msg?: string): void;
    /** 控制台弹窗 */
    function msgbox(msg: string): void;
    /** 中断程序流程 */
    function assert(exp: boolean, msg?: string): void;
    /** 如果为null，返回另外一个值 */
    function val<T>(inp: T, def: T): T;
    /** 取大于的数值 great-than */
    function gt(inp: number, cmp?: number, def?: number): number;
    /** 取小于的数值 less-than */
    function lt(inp: number, cmp?: number, def?: number): number;
    /** 是否是Chrome */
    let ISCHROME: boolean;
    /** 中断chrome的调试器 */
    function Debugger(): void;
    /** 控制台输出一个错误 */
    function fatal(msg: string): void;
    /** 带保护的取得一个对象的长度 */
    function length(o: any, def?: number): number;
    /** 带保护的取一堆中第一个不是空的值 */
    function nonnull1st<T>(def: T, ...p: T[]): T;
    /** 带保护的根据下标取得列表中的对象 */
    function at<T>(o: T[], idx: number, def?: any): any;
    /** 带保护的判断对象是不是 0 */
    function isZero(o: any): boolean;
    /** 转换到 float */
    function toFloat(o: any, def?: number): number;
    /** 转换到 int */
    function toInt(o: any, def?: number): number;
    /** 转换到数字
        @brief 如果对象不能直接转换，会尝试调用对象的 toNumber 进行转换
    */
    function toNumber(o: any, def?: number): number;
    /** 转换到字符串 */
    function asString(o: any, def?: string): string;
    /** 转换到对象 */
    function toJsonObject(o: jsonobj, def?: any): Object;
    /** 格式化字符串 */
    function formatString(fmt: string, ...p: any[]): string;
    function formatStringV(fmt: string, p: any[]): string;
    /** 格式化字符对象 */
    class FormatString {
        constructor(fmt?: any, ...args: any[]);
        /** fmt 根据业务的实现，可能为int的id，一般情况下为string，所以设置为any兼容业务的复杂性 */
        fmt: any;
        /** 带上的参数 */
        args: any[];
        toString(): string;
    }
    /** json处理，保护防止crash并且打印出数据 */
    function json_encode(obj: Object): string;
    function json_decode(str: string): any;
    /** 带保护的判断对象是不是空 */
    function IsEmpty(o: any): boolean;
    function TRIVALUE<T>(express: boolean, v1: T, v2: T): T;
    function TRIVALUE<T>(v1: T, v2: T): T;
    /** 简单比较 */
    enum CMP {
        EQUAL = 0,
        EQUALQ = 1,
        LESSEQUAL = 2,
        GREATEREQUAL = 3,
        LESS = 4,
        GREATER = 5,
        NOTEQUAL = 6,
        NOTEQUALQ = 7,
    }
    function Cmp(l: any, r: any, cmp: CMP): boolean;
    /** 编解码器 */
    class Codec extends SObject {
        constructor();
        /** 讲一个对象写入流
            @brief 成功会返回新增的节点，失败返回 null
        */
        write(o: any): any;
        /** 从流里面读取一个对象，返回读出的对象
         */
        read(): any;
        /** 转换成字符串 */
        toString(): string;
        /** 从字符串构造 */
        fromString(s: string): void;
    }
    /** JSON 编解码器
        @brief 区分于标准的 JSON 格式化，编解码器会附带额外的类型信息，并且解码时会自动重建对象，所以速度不如格式化快，但是支持自定义对象
    */
    class JsonCodec extends Codec {
        constructor();
        write(o: any): any;
        read(): any;
        toString(): string;
        fromString(s: string): void;
        clear(): void;
        private _d;
        private _sck;
    }
    /** 文本生成器 */
    class StringBuilder {
        /** 行结尾 */
        linebreak: string;
        /** 添加行 */
        line(s?: any, color?: ColorType, size?: number): this;
        /** 添加文字 */
        add(s: any, color?: ColorType, size?: number): this;
        /** 设置一个样式 */
        font(color: ColorType, size?: number): this;
        /** 添加一个链接 */
        href(text: string, addr?: string): this;
        /** 添加一个可以触摸的区域 */
        touch(text: string): this;
        /** 恢复之前的样式 */
        pop(): this;
        concat(r: StringBuilder): this;
        /** 格式化输出 */
        toString(): string;
        private _buf;
    }
    class UnsignedInt {
        constructor(d?: number);
        private _obj;
        private _d;
        obj: number;
        valueOf(): number;
    }
    class SafeSet<T> {
        has(v: T): boolean;
        delete(v: T): void;
        add(v: T): void;
        forEach(p: (o: T) => void, ctx?: any): void;
        readonly size: number;
        clear(): void;
        private _set;
    }
    /** 提供操作基础对象的工具函数 */
    class ObjectT {
        /** 比较两个实例是否相等
            @brief 优先使用比较函数的结果
        */
        static IsEqual<L, R>(l: L, r: R, eqfun?: (l: L, r: R) => boolean, eqctx?: any): boolean;
        /** 面向对象的深度copy
            @highRight 以右面的对象为主
        */
        static Copy<L, R>(l: L, r: R, highRight?: boolean): void;
        /** 根据查询路径获取值 */
        static GetValueByKeyPath(o: any, kp: string, def?: any): any;
        /** 根据查询路径设置值 */
        static SetValueByKeyPath(o: any, kp: string, v: any): void;
    }
    /** 操作 number */
    class NumberT {
        /** 任一数字的科学计数读法
            @return 数字部分和e的部分
        */
        static SciNot(v: number): [number, number];
        /** 方根 */
        static radical(v: number, x: number, n: number): number;
        /** 对数 */
        static log(v: number, n: number): number;
        /** 修正为无符号 */
        static Unsigned(v: number): number;
        /** 映射到以m为底的数 */
        static MapToBase(v: number, base: number): number;
        /** 运算，避免为null时候变成nan */
        static Add(v: number, r: number): number;
        static Sub(v: number, r: number): number;
        static Multiply(v: number, r: number): number;
        static Div(v: number, r: number): number;
        static HANMAPS: string[];
        /** 中文化数字 */
        static Hanlize(v: number): string;
    }
    /** 操作 string */
    class StringT {
        /** 优化显示float
            @param v 输入的数字
            @param dp decimalplace 小数位
            @param term 是否去除末尾的0
        */
        static FormatFloat(v: number, dp: number, term?: boolean): string;
        static TermFloat(str: string): string;
        static Hash(str: string): number;
        static Count(str: string, substr: string): number;
        /** 计算ascii的长度 */
        static AsciiLength(str: string): number;
        /** 拆分，可以选择是否去空 */
        static Split(str: string, sep: string, skipempty?: boolean): Array<string>;
        /** 拉开，如果不足制定长度，根据mode填充
            @param mode 0:中间填充，1:左边填充，2:右边填充
            @param wide 是否需要做宽字符补全，如果str为中文并且sep为单字节才需要打开
         */
        static Stretch(str: string, len: number, mode?: number, sep?: string, wide?: boolean): string;
        static ForeachAsciiCode(s: string, f: (e: number, idx: number) => void): void;
        static Code(s: string): number[];
        static FromCode(c: number[]): string;
    }
    /** 提供了操作 array 的工具函数 */
    class ArrayT {
        /** 初始化数量 */
        static Allocate<T>(count: number, def?: any): T[];
        /** 转换成数组 */
        static ToArray(o: any): any[];
        /** 合并所有的数组 */
        static Merge<T>(...arr: Array<Array<T>>): T[];
        /** 使用比较函数来判断是否包含元素 */
        static Contains<L, R>(arr: L[], o: R, eqfun?: (l: L, o: R) => boolean, eqctx?: any): boolean;
        /** 合并 */
        static Concat<T>(l: T[], r: T[]): T[];
        /** 压入一组数据 */
        static PushObjects<L>(arr: L[], p: L[]): void;
        /** 把 array 当成 stack 取得栈顶 */
        static Top<T>(arr: T[], def?: T): T;
        /** 设置栈顶元素，如果 array.len == 0，则添加该元素 */
        static SetTop<T>(arr: T[], o: T): void;
        /** 弹出栈顶 */
        static PopTop<T>(arr: T[], def?: T): T;
        /** 查询 */
        static QueryObject<T>(arr: T[], fun: (o: T, idx: number) => boolean, ctx?: any, def?: any): T;
        /** 查找所有符合条件的对象 */
        static QueryObjects<T>(arr: T[], fun: (o: T, idx: number) => boolean, ctx?: any): T[];
        /** 查询条件对应的索引 */
        static QueryIndex<T>(arr: T[], fun: (o: T, idx: number) => boolean, ctx?: any, def?: number): number;
        /** 不为指定数据的数组长度 */
        static TrustLength<T>(arr: T[], tgt?: T): number;
        /** 覆盖指定数据到数组 */
        static TrustAddObject<T>(arr: T[], src: T, tgt?: T): boolean;
        /** 移除数据 */
        static TrustRemoveObject<T>(arr: T[], src: T, tgt?: T): void;
        /** 覆盖数组 */
        static TrustSet<T>(arr: T[], tgt: T[], def?: any): void;
        /** 弹出数据 */
        static TrustPop<T>(arr: T[], tgt: T[], def?: any): void;
        /** 清除 */
        static TrustClear<T>(arr: T[], tgt?: T): void;
        /** 插入元素 */
        static InsertObjectAtIndex<T>(arr: T[], o: T, idx: number): void;
        /** 清空数组，并挨个回调 */
        static Clear<T>(arr: T[], cb?: (o: T) => void, ctx?: any): void;
        /** 安全的清空，以避免边加边删的边际效应 */
        static SafeClear<T>(arr: T[], cb?: (o: T) => void, ctx?: any): void;
        /** 安全的增加，如果为null，则推入def，如果def也是null，则不推入 */
        static SafePush<T>(arr: T[], o: T, def?: T): void;
        /** 填充一个数组 */
        static Fill<T>(arr: T[], cnt: number, instance: () => any, ctx?: any): T[];
        /** 使用类型来自动实例化并填充数组 */
        static FillType<T>(arr: T[], cnt: number, cls: any): T[];
        /** 带保护的两两遍历 */
        static ForeachWithArray(arrl: any[], arrr: any[], cb: (l: any, r: any, idx: number) => void, ctx?: any, def?: any): void;
        /** 带 break 的索引遍历 */
        static Foreach<T>(arr: T[], cb: (o: T, idx: number) => boolean, ctx?: any): void;
        /** 按照行来遍历 */
        static ForeachRow<T>(arr: T[], columns: number, cb: (o: T, row: number, col: number, idx?: number, rows?: number) => boolean, ctx?: any): void;
        /** 随机一个 */
        static Random<T>(arr: T[]): T;
        /** 安全的遍历，以避免边删边加的边际效应 */
        static SafeForeach(arr: any[], cb: (o: any, idx: number) => boolean, ctx: any): void;
        /** 迭代数组，提供结束的标识 */
        static Iterate<T>(arr: T[], cb: (o: T, idx: number, end: boolean) => boolean, ctx: any): void;
        /** 使用指定索引全遍历数组，包括索引外的 */
        static FullEach<T>(arr: T[], idx: number, cbin: (o: T, idx: number) => void, cbout: (o: T, idx: number) => void): void;
        /** 带筛选器的统计个数 */
        static LengthQuery(arr: any[], cb: (o: any, idx: number) => boolean, ctx: any): number;
        /** 删除一个对象 */
        static RemoveObject<T>(arr: T[], obj: T): boolean;
        /** 删除指定索引的对象 */
        static RemoveObjectAtIndex<T>(arr: T[], idx: number): T;
        /** 使用筛选器来删除对象 */
        static RemoveObjectByFilter<T>(arr: T[], filter: (o: T, idx: number) => boolean, ctx?: any): T;
        static RemoveObjectsByFilter<T>(arr: T[], filter: (o: T, idx: number) => boolean, ctx?: any): T[];
        /** 移除位于另一个 array 中的所有元素 */
        static RemoveObjectsInArray<T>(arr: T[], r: T[]): void;
        /** 使用位于另一个 array 中对应下标的元素 */
        static RemoveObjectsInIndexArray<T>(arr: T[], r: number[]): T[];
        /** 调整大小 */
        static Resize<T>(arr: T[], size: number, def?: T): void;
        /** 上浮满足需求的对象 */
        static Rise<T>(arr: T[], q: (e: T) => boolean): void;
        /** 下沉满足需求的对象 */
        static Sink<T>(arr: T[], q: (e: T) => boolean): void;
        /** 使用另一个数组来填充当前数组 */
        static Set<T>(arr: T[], r: T[]): void;
        /** 复制 */
        static Clone<T>(arr: T[]): T[];
        /** 转换 */
        static Convert<L, R>(arr: L[], convert: (o: L, idx?: number) => R, ctx?: any): R[];
        /** 安全转换，如果结果为null，则跳过 */
        static SafeConvert<L, R>(arr: L[], convert: (o: L, idx?: number) => R, ctx?: any): R[];
        /** 提取 */
        static Filter<L, R>(arr: L[], filter: (o: L, idx?: number) => R, ctx?: any): R[];
        /** 数组 l 和 r 的共有项目 */
        static ArrayInArray<T>(l: T[], r: T[]): T[];
        /** 合并 */
        static Combine<T>(l: T[], sep: any): any;
        /** 检查两个是否一样 */
        static EqualTo<L, R>(l: L[], r: R[], eqfun?: (l: L, r: R) => boolean, eqctx?: any): boolean;
        /** 严格(包含次序)检查两个是否一样 */
        static StrictEqualTo<L, R>(l: L[], r: R[], eqfun?: (l: L, r: R) => boolean, eqctx?: any): boolean;
        /** 乱序 */
        static Disorder<T>(arr: T[]): void;
        /** 截取尾部的空对象 */
        static Trim<T>(arr: T[], emp?: T): void;
        /** 去重 */
        static HashUnique<T>(arr: T[], hash?: boolean): void;
        static Unique<T>(arr: T[], eqfun?: (l: T, o: T) => boolean, eqctx?: any): void;
        /** 取得一段 */
        static RangeOf<T>(arr: Array<T>, pos: number, len?: number): Array<T>;
        /** 弹出一段 */
        static PopRangeOf<T>(arr: Array<T>, pos: number, len?: number): Array<T>;
        /** 根据长度拆成几个Array */
        static SplitByLength<T>(arr: Array<T>, len: number): Array<Array<T>>;
        /** 快速返回下一个或上一个 */
        static Next<T>(arr: Array<T>, obj: T, def?: T): T;
        static Previous<T>(arr: Array<T>, obj: T, def?: T): T;
    }
    function linq<T>(arr: Array<T>): LINQ<T>;
    /** 模拟linq的类 */
    class LINQ<T> {
        constructor(arr: Array<T>);
        private _ref;
        private _safe();
        forEach(fun: (e: T, idx?: number) => boolean): void;
        where(sel: (e: T, idx?: number) => boolean): this;
        count(sel?: (e: T, idx?: number) => boolean): number;
        add(o: T): void;
        exists(cond?: (e: T, idx?: number) => boolean): boolean;
        first(sel?: (e: T, idx?: number) => boolean): T;
        last(sel?: (e: T, idx?: number) => boolean): T;
        at(idx: number): T;
        union<K>(tgt: Array<T>, getkey: (e: T) => K): this;
        private _arr;
    }
    /** set 的工具类 */
    class SetT {
        /** 删除对象 */
        static RemoveObject<T>(s: SetType<T>, o: T): void;
        /** 复制 */
        static Clone<T>(s: SetType<T>): SetType<T>;
        /** 转换到 array */
        static ToArray<T>(s: SetType<T>): Array<T>;
        /** 清空 */
        static Clear<T>(s: SetType<T>, cb?: (o: T) => void, ctx?: any): void;
        /** 带保护的清空，以避免边际效应 */
        static SafeClear<T>(s: SetType<T>, cb: (o: T) => void, ctx?: any): void;
    }
    /** map 的工具类 */
    class MapT {
        /** 获取 */
        static Get<K, V>(m: MapType<K, V>, k: K): V;
        /** 获取所有的value */
        static GetValues<K, V>(m: MapType<K, V>): Array<V>;
        /** 增加 */
        static Add<K, V>(m: MapType<K, V>, k: K, v: V): void;
        /** 遍历 */
        static Foreach<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => void, ctx?: any): void;
        /** 转换 */
        static ToArray<K, V, T>(m: MapType<K, V>, fun: (k: string, v: V) => T, ctx?: any): Array<T>;
        static SafeToArray<K, V, T>(m: MapType<K, V>, fun: (k: string, v: V) => T, ctx?: any): Array<T>;
        /** 取值 */
        static QueryObject<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => boolean, ctx?: any): [K, V];
        static QueryObjects<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => boolean, ctx?: any): MapType<K, V>;
        /** 获取值 */
        static QueryValue<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => boolean, ctx?: any): V;
        static QueryValues<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => boolean, ctx?: any): V[];
        static QueryKey<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => boolean, ctx?: any): K;
        static QueryKeys<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => boolean, ctx?: any): K[];
        /** 判断是否为空 */
        static IsEmpty<K, V>(m: MapType<K, V>): boolean;
        /** 删除key的元素 */
        static RemoveKey<K, V>(m: MapType<K, V>, k: K): void;
        /** 清空 */
        static Clear<K, V>(m: MapType<K, V>, cb?: (k: K, o: V) => void, ctx?: any): void;
        /** 合并 */
        static Concat(l: MapType<any, any>, r: MapType<any, any>): MapType<any, any>;
        /** 复制 */
        static Clone<K, V>(l: MapType<K, V>): MapType<K, V>;
        /** 获取长度 */
        static Length<T>(m: T): number;
        /** 使用下标获取对象 */
        static ObjectAtIndex<K, V>(m: MapType<K, V>, idx: number, def?: V): V;
        /** 转换成普通Object */
        static Simplify<K, V>(m: MapType<K, V>): Object;
    }
    /** 使用索引的 map，可以按照顺序来获取元素 */
    class IndexedMap<K, T> {
        constructor();
        /** 添加 */
        add(k: K, v: T): void;
        /** 替换 */
        replace(k: K, v: T): void;
        /** 删除 */
        remove(k: K): T;
        /** 获得大小 */
        readonly length: number;
        /** 清空 */
        clear(): void;
        /** 遍历 */
        forEach(cb: (k: K, v: T) => void, ctx?: any): void;
        iterateEach(cb: (k: K, v: T) => boolean, ctx?: any): void;
        /** 是否存在k */
        contains(k: K): boolean;
        /** 取得k的下标 */
        indexOfKey(k: K): number;
        /** 使用下标取得数据 */
        objectForKey(k: K): T;
        objectForIndex(idx: number): T;
        keyForIndex(idx: number): K;
        readonly keys: Array<K>;
        readonly values: Array<T>;
        private _map;
        private _keys;
        private _vals;
    }
    class IndexedMapT {
        static RemoveObjectByFilter<K, T>(map: IndexedMap<K, T>, filter: (k: K, v: T) => boolean, ctx?: any): [K, T];
        static RemoveObjectsByFilter<K, T>(map: IndexedMap<K, T>, filter: (k: K, v: T) => boolean, ctx?: any): Array<[K, T]>;
        static QueryObject<K, T>(map: IndexedMap<K, T>, query: (k: K, v: T) => boolean, ctx?: any): T;
        static Convert<K, T, V>(arr: Array<V>, convert: (v: V) => [K, T], ctx?: any): IndexedMap<K, T>;
    }
    /** 多索引map */
    class MultiMap<K, V> {
        add(k: K, v: V): this;
        replace(k: K, v: Array<V>): void;
        objectForKey(k: K): V[];
        remove(k: K): V[];
        forEach(proc: (k: K, arr: V[]) => void, ctx?: any): void;
        iterateEach(proc: (k: K, arr: V[]) => boolean, ctx?: any): void;
        readonly keys: Array<K>;
        private _map;
    }
    class Sort {
        static NumberAsc(l: number, r: number): number;
        static NumberDsc(l: number, r: number): number;
    }
    interface IListRecord {
        next?: IListRecord;
        previous?: IListRecord;
        value: any;
    }
    /** 链表 */
    class List<T> {
        constructor();
        private _top;
        length: number;
        push(o: T): void;
    }
    /** 颜色类 */
    class Color {
        static _1_255: number;
        constructor(rgb: number, alpha?: number);
        rgb: number;
        alpha: number;
        clone(): Color;
        argb: number;
        rgba: number;
        /** 位于 [0, 1] 的 alpha */
        alphaf: number;
        /** 16进制的颜色 */
        red: number;
        redf: number;
        /** 16进制的颜色 */
        green: number;
        greenf: number;
        /** 16进制的颜色 */
        blue: number;
        bluef: number;
        setAlpha(v: number): this;
        setAlphaf(v: number): this;
        setRed(v: number): this;
        setRedf(v: number): this;
        setGreen(v: number): this;
        setGreenf(v: number): this;
        setBlue(v: number): this;
        setBluef(v: number): this;
        scale(s: number, alpha?: boolean): Color;
        /** 反色 */
        invert(): Color;
        static White: Color;
        static Black: Color;
        static Gray: Color;
        static Red: Color;
        static Green: Color;
        static Blue: Color;
        static Yellow: Color;
        static Transparent: Color;
        static RGBf(r: number, g: number, b: number, a?: number): Color;
        static RGB(r: number, g: number, b: number, a?: number): Color;
        static ARGB(v: number): Color;
        static RGBA(v: number): Color;
        /** 随机一个颜色 */
        static Random(a?: number): Color;
        isEqual(r: Color): boolean;
    }
    type ARGBValue = number;
    type ColorType = Color | ARGBValue | string;
    /** 颜色数值，rgb为24位，alpha规约到0-1的float */
    function GetColorComponent(c: ColorType): number[];
    /** 线段 */
    class Line {
        constructor(color?: ColorType, width?: number);
        /** 颜色 */
        color: ColorType;
        /** 宽度 */
        width: number;
        /** 平滑 */
        smooth: boolean;
        /** 起点 */
        startPoint: Point;
        /** 终点 */
        endPoint: Point;
        readonly length: number;
        readonly lengthSq: number;
        readonly deltaX: number;
        readonly deltaY: number;
        readonly deltaPoint: Point;
        static Segment(spt: Point, ept: Point): Line;
    }
    /** 百分比对象 */
    class Percentage {
        max: number;
        value: number;
        constructor(max?: number, val?: number);
        reset(max?: number, val?: number): Percentage;
        copy(r: Percentage): Percentage;
        percent: number;
        safepercent: number;
        /** 剩余的比率 */
        readonly left: number;
        toString(): string;
        valueOf(): number;
    }
    class Mask {
        static isset<T>(mask: T, value: T): boolean;
        static unset<T>(mask: T, value: T): T;
        static set<T>(mask: T, value: T): T;
    }
    enum Direction {
        UNKNOWN = 0,
        CENTER = 1,
        UP = 16,
        DOWN = 256,
        LEFT = 32,
        RIGHT = 512,
        HOV = 544,
        VEC = 272,
    }
    function DirectionIsPortrait(d: Direction): boolean;
    function DirectionIsLandscape(d: Direction): boolean;
    function DirectionAngle(l: Direction, r: Direction): Angle;
    function DirectionFromSize(w: number, h: number): Direction;
    function DirectionToString(d: Direction): string;
    function DirectionFromString(s: string): Direction;
    class Range {
        location: number;
        length: number;
        constructor(location?: number, length?: number);
        contains(val: number): boolean;
        /** 交叉判定 */
        intersects(r: Range): boolean;
        max(): number;
        static Intersects(loc0: number, len0: number, loc1: number, len1: number): boolean;
    }
    /** 边距 */
    class EdgeInsets {
        top: number;
        bottom: number;
        left: number;
        right: number;
        constructor(t?: number, b?: number, l?: number, r?: number);
        static All(v: number): EdgeInsets;
        add(t: number, b: number, l: number, r: number): EdgeInsets;
        scale(v: number): EdgeInsets;
        addEdgeInsets(r: EdgeInsets): EdgeInsets;
        readonly width: number;
        readonly height: number;
        static Width(o: EdgeInsets): number;
        static Height(o: EdgeInsets): number;
        static Top(o: EdgeInsets): number;
        static Left(o: EdgeInsets): number;
    }
    /** 点 */
    class Point {
        constructor(x?: number, y?: number);
        x: number;
        y: number;
        reset(x?: number, y?: number): this;
        clone(): this;
        copy(r: Point): this;
        addPoint(r: Point): this;
        subPoint(r: Point): this;
        add(x?: number, y?: number): this;
        multiPoint(r: Point): this;
        scale(v: number, vy?: number): this;
        isEqual(r: Point): boolean;
        invert(): this;
        static AnchorCC: Point;
        static AnchorLT: Point;
        static AnchorLC: Point;
        static AnchorLB: Point;
        static AnchorTC: Point;
        static AnchorBC: Point;
        static AnchorRT: Point;
        static AnchorRC: Point;
        static AnchorRB: Point;
        toString(): string;
        fromString(s: string): void;
        applyScaleFactor(): this;
        unapplyScaleFactor(): this;
        static Zero: Point;
    }
    /** 点云 */
    class PointCloud {
        protected _points: Point[];
        protected _minpt: Point;
        protected _maxpt: Point;
        add(pt: Point): void;
        readonly boundingBox: Rect;
    }
    /** 大小 */
    class Size extends Point {
        constructor(w?: number, h?: number);
        width: number;
        height: number;
        toRect(): Rect;
        addSize(r: Size): Size;
        static Zero: Size;
    }
    /** 多边形 */
    class Polygon {
        add(pt: Point): Polygon;
        clear(): Polygon;
        readonly length: number;
        _pts: Point[];
    }
    enum FillMode {
        STRETCH = 4096,
        CENTER = 8192,
        ASPECTSTRETCH = 12288,
        ASPECTFILL = 16384,
        NEARESTSTRETCH = 20480,
        MAPIN = 24576,
        NOBORDER = 1,
        MAXIMUM = 2,
        NEAREST = 4,
        MASK_MAJOR = 61440,
    }
    function FillModeString(fm: FillMode): string;
    type rnumber = number | string;
    /** 相对尺寸 */
    class RRect {
        constructor(p: {
            top?: rnumber;
            bottom?: rnumber;
            left?: rnumber;
            right?: rnumber;
        }, width: rnumber, height: rnumber);
        left: rnumber;
        right: rnumber;
        top: rnumber;
        bottom: rnumber;
        width: rnumber;
        height: rnumber;
        private rvalue(v, p);
        toRect(prc: Rect): Rect;
    }
    enum POSITION {
        LEFT_TOP = 0,
        LEFT_CENTER = 1,
        LEFT_BOTTOM = 2,
        TOP_CENTER = 3,
        CENTER = 4,
        BOTTOM_CENTER = 5,
        RIGHT_TOP = 6,
        RIGHT_CENTER = 7,
        RIGHT_BOTTOM = 8,
    }
    enum EDGE {
        START = 1,
        MIDDLE = 0,
        END = 2,
    }
    /** 尺寸 */
    class Rect {
        constructor(x?: number, y?: number, w?: number, h?: number);
        x: number;
        y: number;
        width: number;
        height: number;
        static Zero: Rect;
        static Max: Rect;
        readonly isnan: boolean;
        position: Point;
        origin(anchor?: Point): Point;
        setOrigin(pt: Point, anchor?: Point): this;
        alignTo(rc: Rect, posto: POSITION, posmy?: POSITION): this;
        edgeTo(rc: Rect, edge: EDGE): this;
        getPosition(pos: POSITION): Point;
        setPosition(pt: Point, pos: POSITION): void;
        size: Size;
        setSize(w: number, h: number): this;
        setX(x: number): this;
        setY(y: number): this;
        setWidth(w: number): this;
        setHeight(h: number): this;
        integral(): this;
        invert(): this;
        clone(): this;
        copy(r: Rect): this;
        applyEdgeInsets(ei: EdgeInsets): this;
        unapplyEdgeInsets(ei: EdgeInsets): this;
        applyAnchor(ax: number, ay: number): this;
        unapplyAnchor(ax: number, ay: number): this;
        containsPoint(pt: Point): boolean;
        static ContainsPoint(x: number, y: number, rx: number, ry: number, rw: number, rh: number): boolean;
        static Area(o: any): number;
        static Swap(l: any, r: any): void;
        maxSize(w?: number, h?: number): this;
        minSize(w?: number, h?: number): this;
        isEqual(r: Rect): boolean;
        add(x: number, y: number, w?: number, h?: number): this;
        union(r: Rect): this;
        deflate(w: number, h: number): this;
        deflateR(rw: number, rh: number): this;
        scale(s: number, anchor?: Point): this;
        readonly outterRadius: number;
        multiRect(x: number, y: number, w: number, h: number): this;
        scaleWidth(w: number): this;
        scaleHeight(h: number): this;
        clipCenter(w?: number, h?: number): this;
        reset(x?: number, y?: number, w?: number, h?: number): this;
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
        readonly minL: number;
        readonly maxL: number;
        toPolygon(): Polygon;
        offset(pt: Point): this;
        center: Point;
        setCenter(pt: Point): this;
        leftTop: Point;
        setLeftTop(pt: Point): this;
        leftBottom: Point;
        setLeftBottom(pt: Point): this;
        rightTop: Point;
        setRightTop(pt: Point): this;
        rightBottom: Point;
        setRightBottom(pt: Point): this;
        topCenter: Point;
        setTopCenter(pt: Point): this;
        bottomCenter: Point;
        setBottomCenter(pt: Point): this;
        leftCenter: Point;
        setLeftCenter(pt: Point): this;
        rightCenter: Point;
        setRightCenter(pt: Point): this;
        toString(): string;
        private _nearest;
        readonly nearest: number;
        /** 将当前的rc映射到目标rc中，默认会居中结果 */
        fill(to: Rect, mode: FillMode): this;
        applyScaleFactor(): this;
        unapplyScaleFactor(): this;
        applyCartesian(tfm: Rect): this;
        unapplyCartesian(tfm: Rect): this;
    }
    class UnionRect extends Rect {
        constructor(x?: number, y?: number, w?: number, h?: number);
        union(r: Rect): this;
    }
    enum WorkState {
        UNKNOWN = 0,
        WAITING = 1,
        DOING = 2,
        PAUSED = 3,
        DONE = 4,
    }
    /** 角度 */
    class Angle {
        static _PI: number;
        static _PI_2: number;
        static _2PI: number;
        static _1_2PI: number;
        static _DEGREE: number;
        static _RAD: number;
        static ToRad(ang: number): number;
        static ToAngle(rad: number): number;
        constructor(rad?: number);
        clone(): Angle;
        static RAD(rad: number): Angle;
        static ANGLE(ang: number): Angle;
        static DIRECTION(d: Direction): Angle;
        private _rad;
        angle: number;
        rad: number;
        add(r: Angle): Angle;
        sub(r: Angle): Angle;
        multiScala(v: number): Angle;
        normalize(): Angle;
        readonly direction: Direction;
        toString(): string;
    }
    /** 射线 */
    class Rayline {
        constructor(pt?: Point, angle?: number);
        pt: Point;
        angle: number;
        atLength(len: number, angle?: number): Point;
    }
    /** 路径
        @note 默认h5-tag-path来实现，所以也原生支持了svg^_^
    */
    class Path implements ISerializable {
        constructor(svg?: string);
        serialize(): string;
        unserialize(stream: any): boolean;
        clear(): void;
        readonly length: number;
        pointAtPos(percent: number): any;
        private _ph;
        private _len;
        private _changed;
    }
    class URL {
        constructor(uri?: string);
        parseString(uri: string): void;
        fields: KvObject<string, string>;
        domain: string;
        toString(): string;
        static MapToField(m: KvObject<any, any>): string;
        static encode(str: string): string;
        static decode(d: string): string;
        /** 字符串打包，encode测试发现在native状态下，如果使用urlloader发送，则放在参数中的例如http://之类的字符串会被恢复编码，导致500错误 */
        static pack(str: string, uri?: boolean): string;
        static unpack(str: string, uri?: boolean): string;
        static htmlEncode(s: string): string;
        static htmlDecode(s: string): string;
    }
    /** 时间日期 */
    class DateTime {
        constructor(ts?: number);
        /** 当前的时间 */
        static Now(): number;
        /** 当前的时间戳 */
        static Timestamp(): number;
        /** 从开始运行时过去的时间 */
        static Pass(): number;
        /** 一段时间 */
        static Interval(ts: number): DateTime;
        /** 从字符串转换 */
        static parse(s: string): DateTime;
        /** 未来 */
        future(ts: number): this;
        /** 过去 */
        past(ts: number): this;
        /** 计算间隔 */
        diff(r: DateTime): DateTime;
        private _changed;
        private _date;
        private _timestamp;
        timestamp: number;
        year: number;
        month: number;
        day: number;
        hyear: number;
        hmonth: number;
        hday: number;
        hour: number;
        minute: number;
        second: number;
        /**
         * 对Date的扩展，将 Date 转化为指定格式的String
         * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
         * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         * eg:
         * ("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
         * ("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
         * ("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
         * ("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
         * ("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
         */
        toString(fmt?: any): string;
        static MINUTE: number;
        static MINUTE_5: number;
        static MINUTE_15: number;
        static MINUTE_30: number;
        static HOUR: number;
        static HOUR_2: number;
        static HOUR_6: number;
        static HOUR_12: number;
        static DAY: number;
        static MONTH: number;
        static YEAR: number;
        static Dyears(ts: number, up?: boolean): number;
        static Dmonths(ts: number, up?: boolean): any;
        static Ddays(ts: number, up?: boolean): any;
        static Dhours(ts: number, up?: boolean): any;
        static Dminutes(ts: number, up?: boolean): any;
        static Dseconds(ts: number, up?: boolean): any;
        /** 计算diff-year，根绝suffix的类型返回对应的类型 */
        dyears(up?: boolean, suffix?: any | string): any;
        /** 计算diff-months */
        dmonths(up?: boolean, suffix?: any | string): any;
        /** 计算diff-days */
        ddays(up?: boolean, suffix?: any | string): any;
        /** 计算diff-hours */
        dhours(up?: boolean, suffix?: any | string): any;
        /** 计算diff-mins */
        dminutes(up?: boolean, suffix?: any | string): any;
        /** 计算diff-secs */
        dseconds(up?: boolean, suffix?: any | string): any;
        isSameDay(r: DateTime): boolean;
    }
    /** 定时器 */
    abstract class CTimer extends SObject {
        constructor(interval: any, count: any);
        dispose(): void;
        static SAFE_TIMER_ENABLED: boolean;
        static SAFE_TIMERS: CSet<CTimer>;
        /** tick 的次数 */
        count: number;
        /** 间隔 s */
        interval: number;
        /** timer 的附加数据 */
        xdata: any;
        /** 当前激发的次数 */
        _firedCount: number;
        firedCount: number;
        /** 每一次激发的增量 */
        _deltaFired: number;
        deltaFired: number;
        protected _initSignals(): void;
        /** 已经过去了的时间 */
        readonly pastTime: number;
        /** 当前的逻辑时间戳 */
        currentTime: number;
        /** 启动定时器 */
        abstract start(): any;
        /** 停止定时器 */
        abstract stop(): any;
        /** 是否正在运行 */
        readonly isRunning: boolean;
        oneTick(delta?: number): void;
    }
    /** 低精度的实际时间定时器
        @brief 使用实际时间来判定每一次的 tick
    */
    class RtTimer extends CTimer {
        constructor(interval?: number, count?: number);
        /** 查询时间 */
        private _tmr;
        start(): void;
        stop(): void;
        readonly isRunning: boolean;
        private __tmr_tick();
    }
    /** 系统定时器 */
    class SysTimer extends CTimer {
        constructor(interval?: number, count?: number);
        dispose(): void;
        private _tmr;
        start(): void;
        stop(): void;
        readonly isRunning: boolean;
        private __tmr_tick();
    }
    /** 定时器
        @brief 可以选择支持不支持在后台运行 */
    class Timer extends CTimer {
        constructor(interval?: number, count?: number);
        private _rtmr;
        private _systmr;
        /** 是否打开后台模式 */
        backgroundMode: boolean;
        start(): void;
        private __act_action(s);
        private __act_done(s);
        stop(): void;
        protected timer(): CTimer;
        readonly isRunning: boolean;
        firedCount: number;
        deltaFired: number;
    }
    /** 延迟运行 */
    function Delay(duration: Interval, cb: () => void, ctx: any, ...p: any[]): Timer;
    /** 时间片对象 */
    class CoTimerItem extends CTimer {
        constructor();
        protected _initSignals(): void;
        dispose(): void;
        _signalConnected(sig: string): void;
        /** 激进的模式
            @brief 当定时器跑在后台时，前端业务需要添加一处反应定时器进度的反馈，如果 radicalMode == false，那么 UI 只能再下一次 tick 的时候得到 SignalAction 的激发，如果这个值为 true，那么当 UI connect 到 Action 时，会自动激发 SignalAction 以达到立即刷新 UI 的目的
        */
        radicalMode: boolean;
        /** tick时间数 */
        times: number;
        /** 当前的 tick */
        now: number;
        /** 正在运行 */
        isRunning: boolean;
        /** 重新设置并启动定时器 */
        reset(inv: number, count?: number, of?: any): CoTimerItem;
        /** 修改一下计时参数, 和 reset 的区别是不影响当前状态 */
        set(inv: number, count?: number): void;
        start(): void;
        stop(): void;
        _timeinterval: number;
        _cotimer: CoTimer;
    }
    /** 统一调度的计时器
        @brief 由 CoTimer 派发出的 TimerItem 将具有统一的调度，默认精度为100ms，如果业务需要准确的计时器，最好传入业务实际的间隔
    */
    class CoTimer extends SObject {
        constructor(interval?: number);
        dispose(): void;
        interval: number;
        backgroundMode: boolean;
        isRunning: boolean;
        start(): CoTimer;
        stop(): CoTimer;
        /** 增加一个分片定时器，时间单位为 s
            @param idr, 重用定时器的标记，如果!=undefined，则尝试重用定时器并设置为新的定时值
            @note 增加会直接添加到时间片列表，由CoTimer的运行情况来决定此时间片是否运行
        */
        add(inv: number, count?: number, idr?: any): CoTimerItem;
        /** 申请一个定时器，和 add 的区别是不会重置参数 */
        acquire(idr: any): CoTimerItem;
        /** 具体参见 CoTimerItem 里面的解释 */
        radicalMode: boolean;
        _addTimer(tmr: CoTimerItem): void;
        _stopTimer(tmr: CoTimerItem): void;
        /** 根据idr查找分片计时器 */
        findItemByIdr(idr: any): CoTimerItem;
        /** 清空所有的分片 */
        clear(): void;
        private __tmr_tick(s);
        private _splices;
        private _tmr;
    }
    /** 延迟器 */
    class Delayer {
        constructor(tm: number, cb: Function, ctx?: any);
        start(): void;
        stop(): void;
        restart(): void;
        private _tm;
        private _cb;
        private _ctx;
        private _tmr;
    }
    /** 重复调用 */
    function Repeat(s: number, cb: (s?: Slot) => void, ctx?: any): CTimer;
    /** 进度接口 */
    interface IProgress {
        progressValue: Percentage;
    }
    /** 随机数 */
    class Random {
        static Rangei(from: number, to: number, close?: boolean): number;
        static Rangef(from: number, to: number): number;
    }
    /** 设备屏幕信息的评级
        @note 根据评级和设置的开关决定使用哪套资源 */
    enum ScreenType {
        NORMAL = 0,
        HIGH = 1,
        EXTRAHIGH = 2,
        LOW = -1,
        EXTRALOW = -2,
    }
    function ScreenTypeIsLow(t: ScreenType): boolean;
    function ScreenTypeIsHigh(t: ScreenType): boolean;
    /** 设备信息 */
    class Device extends SObject implements IShared {
        constructor();
        protected _initSignals(): void;
        detectEnv(): void;
        platform: string;
        agent: string;
        isMac: boolean;
        isWin: boolean;
        isUnix: boolean;
        isLinux: boolean;
        isIOS: boolean;
        isAndroid: boolean;
        isMobile: boolean;
        isPC: boolean;
        isPurePC: boolean;
        /** canvas模式 */
        isCanvas: boolean;
        /** 高性能设备 */
        isHighPerfomance: boolean;
        /** 支持自动播放音效 */
        supportAutoSound: boolean;
        /** 屏幕的尺寸 */
        screenFrame: Rect;
        /** 页面的尺寸 */
        screenBounds: Rect;
        /** 屏幕的方向 */
        screenOrientation: Angle;
        /** 屏幕尺寸的类型，对应于 android 的归类 */
        screenType: ScreenType;
        _updateScreen(): void;
        static shared: Device;
    }
    enum HttpMethod {
        GET = 0,
        POST = 1,
    }
    /** http连接器 */
    class CHttpConnector extends SObject {
        dispose(): void;
        protected _initSignals(): void;
        /** 请求方式 */
        method: HttpMethod;
        /** 全url */
        url: string;
        /** fields */
        fields: KvObject<string, any>;
        /** 获取的数据 */
        data: any;
        /** override 发送请求 */
        start(): void;
        /** override 使用自动授权 */
        useCredentials(): void;
        fullUrl(): string;
    }
    /** socket连接器 */
    abstract class CSocketConnector extends SObject {
        /** 地址 */
        host: string;
        protected _initSignals(): void;
        /** 是否已经打开 */
        abstract isopened(): boolean;
        /** 连接服务器 */
        abstract open(): any;
        /** 断开连接 */
        abstract close(): any;
        /** 发送 */
        abstract write(obj: any): any;
    }
    /** 基本操作 */
    abstract class Operation {
        constructor(idr?: any);
        _queue: OperationQueue;
        /** 标示号，用来查找 */
        idr: any;
        /** 开始动作 */
        abstract start(): any;
        /** 完成自己的处理 */
        done(): void;
    }
    /** 操作队列 */
    class OperationQueue extends SObject {
        constructor();
        protected _initSignals(): void;
        /** 自动开始队列 */
        autoMode: boolean;
        /** 手动的队列 */
        static Manual(): OperationQueue;
        /** 队列中操作的数量 */
        readonly count: number;
        /** 队列中添加一个操作 */
        add(oper: Operation): void;
        /** 移除 */
        remove(oper: Operation): void;
        /** 接上，如果只传一个数据，则代表附加在当前之后
            @param l 目标的队列
            @param r 插入的队列
        */
        follow(l: Operation, r: Operation): void;
        /** 附加到当前 */
        present(oper: Operation): void;
        /** 交换 */
        swap(l: Operation, r: Operation): void;
        /** 使用 r 换掉 l */
        replace(l: Operation, r: Operation): void;
        /** 尝试运行一个工作 */
        tryrun(): void;
        /** 强制运行下一份工作 */
        next(): void;
        /** 查询一个被标记的工作 */
        findOperation(idr: any): Operation;
        /** 暂停工作队列 */
        pause(): void;
        /** 恢复工作队列 */
        resume(): void;
        protected _paused: boolean;
        protected _tryduringpaused: boolean;
        protected _current: Operation;
        protected _opers: Operation[];
        readonly operations: Array<Operation>;
    }
    /** 闭包操作，为了支持Async，所以需要注意当闭包完成时调用done */
    class OperationClosure extends Operation {
        constructor(cb: (oper: Operation) => void, ctx?: any, idr?: any);
        cb: any;
        ctx: any;
        start(): void;
    }
    /** 简单封装一个函数，不附带 Operation，使用时需要手动调用 operationqueue.next，主要用于传统流程改造成队列流程 */
    class OperationCall extends Operation {
        constructor(cb: (...p: any[]) => void, ctx?: any, argus?: any[], idr?: any);
        cb: any;
        ctx: any;
        argus: any[];
        start(): void;
    }
    /** 间隔时间操作 */
    class OperationDelay extends Operation {
        constructor(delay: number, idr?: any);
        delay: number;
        start(): void;
    }
    /** 操作组 */
    class OperationGroup extends Operation {
        constructor(idr?: any);
        dispose(): void;
        private _subqueue;
        start(): void;
        add(q: Operation): void;
        private __subqueue_end();
    }
    /** 顺序操作的接口 */
    interface IOrder {
        /** 完成 */
        done(): any;
        /** 执行下一个操作 */
        next(): any;
    }
    /** 自动重试
        @code
        new Retry(....).process();
    */
    class Retry implements IOrder {
        constructor(times: number, interval: number | Array<number>, cb: (retry: IOrder) => void, ctx?: any);
        /** 运行 */
        process(): void;
        /** 结束 */
        done(): void;
        /** 下一个 */
        next(): void;
        private _times;
        private _currentTime;
        private _interval;
        private _cb;
        private _ctx;
    }
    function retry(times: number, interval: number | Array<number>, cb: (retry: IOrder) => void, ctx?: any): Retry;
    interface IObjectsPool {
        use(): any;
        unuse(o: any): any;
    }
    /** 对象池，自动初始化超过现存可用数量的对象 */
    class ObjectsPool<T> implements IObjectsPool {
        private _arr;
        constructor(ins: () => T, ctx?: any);
        dispose(): void;
        private instance;
        private ctx;
        use(): T;
        unuse(o: T): void;
        readonly length: number;
        clear(): void;
    }
    interface IReusesPool {
        use(k: any, def: any, argus: any[]): any;
        unuse(k: any, o: any): any;
    }
    /** 简单复用池
        @note 业务建议使用 ReusesPool，提供了used和unused的管理
    */
    class SimpleReusesPool<T> implements IReusesPool {
        constructor(ins?: (...p: any[]) => T, ctx?: any);
        dispose(): void;
        use(k: any, def?: T, argus?: any[]): T;
        unuse(k: any, o: T): void;
        clear(): void;
        private _ins;
        private _ctx;
        private _pl;
    }
    class ReusesPool<T> implements IReusesPool {
        constructor(ins: (...p: any[]) => T, use: (k: any, o: T) => void, unuse: (k: any, o: T) => void, ctx?: any);
        use(k: any, def?: T, argus?: any[]): T;
        unuse(k: any, o: T): void;
        readonly useds: Array<T>;
        readonly unuseds: Array<T>;
        private _ins;
        private _use;
        private _unuse;
        private _ctx;
        private _pl;
        private _useds;
        private _unuseds;
    }
    /** 编解码 */
    interface ICodec {
        /** 编码 */
        encode(s: string): string;
        /** 解码 */
        decode(d: any): string;
    }
    /** 包文件系统 */
    interface IArchiver {
        /** 读取包 */
        load(d: any): boolean;
        /** 获取文件内容 */
        file(path: string, type: ResType, cb: (str: any) => void, ctx?: any): any;
    }
    class Storage implements IShared {
        codec: ICodec;
        private _prefix;
        prefix: string;
        domain: any;
        clone(): this;
        protected getKey(key: string): string;
        set(key: string, val: any): void;
        value(key: string, def?: string | Closure): string;
        setBool(key: any, val: boolean): void;
        getBool(key: any, def?: boolean): boolean;
        setNumber(key: any, val: number): void;
        getNumber(key: any, def?: number): number;
        setObject(key: any, val: Object): void;
        getObject(key: any): any;
        clear(): void;
        static shared: Storage;
    }
    class CryptoStorages {
        get(idr: string): Storage;
        set(idr: string, key: string, val: any): void;
        value(idr: string, key: string, def?: string | Closure): string;
        setBool(idr: string, key: any, val: boolean): void;
        getBool(idr: string, key: any, def?: boolean): boolean;
        setNumber(idr: string, key: any, val: number): void;
        getNumber(idr: string, key: any, def?: number): number;
        private _storages;
        static shared: CryptoStorages;
    }
    let number_t: {
        type: string;
        def: number;
    };
    let boolean_t: {
        type: string;
        def: boolean;
    };
    let string_t: {
        type: string;
        def: string;
    };
    /** 可以用来直接在声明时绑定位于storage中带类型的变量 */
    class StorageVariable<T> {
        constructor(key: string, type?: {
            type: string;
            def: string;
        });
        key: string;
        private type;
        value: T;
    }
    /** 缓存策略控制接口 */
    interface ICacheObject {
        cacheFlush: boolean;
        cacheUpdated: boolean;
        cacheTime: number;
        keyForCache(): string;
        valueForCache(): any;
    }
    interface ICacheRecord extends IReference {
        /** 使用缓存的实际数据对象 */
        use(): any;
        /** 设置缓存的实际数据对象的属性，如果isnull跳过 */
        prop(k: any, v: any): any;
        /** 是否为空 */
        isnull: boolean;
    }
    class CacheRecord implements ICacheRecord {
        key: string;
        val: any;
        ts: number;
        count: number;
        fifo: boolean;
        mulo: boolean;
        readonly isnull: boolean;
        use(): any;
        prop(k: any, v: any): void;
        grab(): void;
        drop(): void;
    }
    /** 基础缓存实现 */
    class Memcache implements IShared {
        protected _maps: KvObject<any, CacheRecord>;
        protected _records: CacheRecord[];
        enable: boolean;
        /** 添加一个待缓存的对象 */
        cache<T extends ICacheObject>(obj: T): CacheRecord;
        gc(): void;
        /** 获得缓存对象 */
        query(ks: string): ICacheRecord;
        /** override 回调处理移除一个元素 */
        protected doRemoveObject(rcd: CacheRecord): void;
        static shared: Memcache;
    }
    class _Scripts {
        require(p: string | Array<string>, cb?: () => void, ctx?: any): void;
    }
    let Scripts: _Scripts;
}
/** 当native时，直接用set会出现key为ui时第二次加入时崩溃，所以需要转成安全的set */
declare function NewSet<T>(): nn.SetType<T>;
declare module nn {
    let SignalAddedToStage: string;
    let SignalRequestClose: string;
    /** zPosition的几个预定的层次 */
    enum ZPOSITION {
        DEFAULT = 100,
        FRONT = -999,
        NORMAL = 0,
        BACK = 999,
    }
    interface IReqResources {
        /** 获得依赖的资源 */
        getReqResources(): Array<ReqResource>;
        /** 动态资源组 */
        reqResources?: Array<ReqResource>;
    }
    /** 资源组管理 */
    abstract class ReqResources implements IReqResources {
        static __reqResources: Array<ReqResource>;
        reqResources: Array<ReqResource>;
        /** 对象依赖的动态资源组 */
        getReqResources(): Array<ReqResource>;
        /** 获得依赖的静态资源组 */
        static GetReqResources(): Array<ReqResource>;
        /** 通过该函数回调业务层的静态资源组定义 */
        static ResourcesRequire(res: Array<ReqResource>): void;
        /** 加载静态资源时现实的进度，默认使用 Application 的 classResourceLoadingView */
        static ClazzResourceProgress: any;
        /** 是否显示资源加载的进度
            @note 静态的资源加载一般都需要显示资源进度 */
        static ShowResourceProgress: boolean;
    }
    class COriginType {
        imp: any;
        static shared: COriginType;
    }
    type TextureSource = UriSource | COriginType;
    class SourceVariable<IMPL extends IReference, T> extends RefVariable<IMPL> {
        source: T;
        dispose(): void;
    }
    let StageBounds: Rect;
}
declare module nn {
    interface IComponent {
        _imp: any;
    }
    /** 内部实现的基类 */
    abstract class CComponent extends SObject implements IReqResources {
        constructor();
        protected _imp: any;
        handle(): any;
        protected abstract createImp(): any;
        static FromImp(imp: any): any;
        readonly descriptionName: string;
        protected _instanceSignals(): void;
        protected _initSignals(): void;
        dispose(): void;
        _signalConnected(sig: string, s?: Slot): void;
        protected abstract hitTestChild(x: number, y: number): any;
        protected abstract hitTestClient(x: number, y: number): any;
        protected hitTest(x: number, y: number): any;
        /** 标记 */
        tag: any;
        /** 绘图板 */
        painter: CGraphics;
        protected validate(): boolean;
        abstract addChild(c: CComponent): any;
        abstract addChild(c: CComponent, layout: boolean): any;
        abstract addChildAt(c: CComponent, idx: number): any;
        abstract addChildAt(c: CComponent, idx: number, layout: boolean): any;
        abstract getChildAt(idx: number): CComponent;
        abstract setChildIndex(c: CComponent, idx: number): any;
        abstract getChildIndex(c: CComponent): number;
        abstract swapChildAt(idx0: number, idx1: number): any;
        abstract swapChild(l: CComponent, r: CComponent): any;
        abstract removeChildren(): any;
        abstract removeChild(c: CComponent): any;
        abstract hasChild(c: CComponent): boolean;
        getChildByTag(tag: any): CComponent;
        abstract bringFront(v?: CComponent): any;
        abstract sendBack(v?: CComponent): any;
        abstract hollowOut(c: CComponent): any;
        hasHollowOut: boolean;
        zPosition: number;
        protected onChildAdded(c: CComponent, layout: boolean): void;
        abstract updateZPosition(): any;
        protected onChildRemoved(c: CComponent): void;
        /** 是否已经在舞台中 */
        onStage: boolean;
        /** 父级 */
        parent: CComponent;
        /** 隶属的元素，一般为父级 */
        private _belong;
        belong: CComponent;
        /** 触摸开关 */
        touchEnabled: boolean;
        touchChildren: boolean;
        /** 是否可以触摸 */
        interactiveEnabled: boolean;
        /** 缓存开关 */
        cacheEnabled: boolean;
        /** 裁剪 */
        clipsToBounds: boolean;
        clipsRegion: Rect;
        maskView: CComponent;
        /** 动画变成属性
            @note 只允许设置，不允许get，设计的CAnimate会当结束后自动释放掉自己
         */
        animate: CAnimate;
        /** 播放动画
            @note 有别于直接通过ani播放动画，可以避免loop动画忘记stop引起的内存泄漏，以及如过当页面invisble时，不及时pause动画导致额外消耗计算资源，返回用于动画的实际的实体
        */
        private _playingAnimates;
        playAnimate(ani: CAnimate, idr?: any): CAnimate;
        /** 根据id查找动画 */
        findAnimate(idr: any): CAnimate;
        /** 根据id停止动画 */
        stopAnimate(idr: any): void;
        /** 停止所有的动画 */
        stopAllAnimates(): void;
        private __cb_aniend(s);
        /** 锚点
            @note 约定如下：
            1，不论锚点位置，setframe始终设置的是控件的外沿的范围（保证逻辑和所见一致）
            2，不论锚点位置，getframe 获得的始终为控件外沿的范围
        */
        anchor: Point;
        anchorOffset: Point;
        /** 外沿的尺寸 */
        frame: Rect;
        abstract setFrame(rc: Rect, anchor: boolean): any;
        /** 内部坐标使用浮点 */
        floatCoordinate: boolean;
        protected impSetFrame(rc: Rect, ui: any): void;
        /** 获得内部区域 */
        abstract bounds(): Rect;
        /** 背景 */
        backgroundColor: ColorType;
        backgroundImage: TextureSource;
        backgroundEdgeInsets: EdgeInsets;
        /** 边缘 */
        borderLine: Line;
        /** override 强制刷缓存 */
        abstract flushCache(): any;
        /** 更新缓存 */
        updateCache(): void;
        /** 请求更新缓存 */
        setNeedsCache(): void;
        /** 当加载时的回调
            @note 加载流程 loadScene -> onLoaded */
        protected onLoaded(): void;
        static GetReqResources(): Array<ReqResource>;
        static ResourcesRequire(res: Array<string>): void;
        static ClazzResourceProgress: any;
        static ShowResourceProgress: boolean;
        getReqResources(): Array<ReqResource>;
        /** 当资源准备完成时更新资源 */
        protected updateResource(): void;
        /** 加载需要的资源 */
        loadReqResources(cb: () => void, ctx?: any): void;
        /** 实例化GUI对象
            @note 如果设置了静态的resourceGroups，则需要在回调中使用真正的实例
        */
        static New<T>(cb: (o: T) => void, ...p: any[]): T;
        /** 请求更新布局 */
        setNeedsLayout(): void;
        _islayouting: boolean;
        /** 强制刷新布局 */
        flushLayout(): void;
        /** 更新布局 */
        updateLayout(): void;
        /** 需要刷新z顺序 */
        setNeedsZPosition(): void;
        /** 更新数据 */
        updateData(): void;
        /** 手势 */
        abstract addGesture(ges: IGesture): any;
        abstract clearGestures(): any;
        /** 触摸事件带出的数据 */
        touch: CTouch;
        /** 按键事件带出的数据 */
        keyboard: CKeyboard;
        /** override 位置转换 */
        abstract convertPointTo(pt: Point, des: CComponent): Point;
        abstract convertRectTo(rc: Rect, des: CComponent): Rect;
        /** override 绘制到纹理 */
        abstract renderToTexture(): TextureSource;
        setX(v: number): this;
        getX(): number;
        setY(v: number): this;
        getY(): number;
        setWidth(v: number): this;
        getWidth(): number;
        setHeight(v: number): this;
        getHeight(): number;
        setSize(sz: Size): this;
        setOrigin(pt: Point): this;
        offsetOrigin(pt: Point): this;
        setCenter(pt: Point): this;
        setLeftTop(pt: Point): this;
        setLeftCenter(pt: Point): this;
        setLeftBottom(pt: Point): this;
        setTopCenter(pt: Point): this;
        setBottomCenter(pt: Point): this;
        setRightTop(pt: Point): this;
        setRightCenter(pt: Point): this;
        setRightBottom(pt: Point): this;
        setScaleX(v: number): void;
        setScaleY(v: number): this;
        setScale(v: number): this;
        setTranslateX(v: number): this;
        setTranslateY(v: number): this;
        /** 提供最佳大小 */
        bestFrame(rc?: Rect): Rect;
        bestPosition(): Point;
        static BestFrame(rc?: Rect): Rect;
        /** 平移 */
        translate: Point;
        /** 缩放 */
        scale: Point;
        /** 旋转 */
        rotation: Angle;
        /** 透明度 */
        alpha: number;
        /** 内部边界 */
        edgeInsets: EdgeInsets;
        getEdgeInsets(): EdgeInsets;
        boundsForLayout(): Rect;
        /** 显示 */
        visible: boolean;
        /** 当显示改变时 */
        onVisibleChanged(): void;
        /** 所有子元素 */
        children: Array<CComponent>;
        /** 是否已经出现在界面上 */
        isAppeared: boolean;
        /** 出现在界面上的回调 */
        onAppeared(): void;
        onDisappeared(): void;
        /** 请求显示 */
        setNeedsAppear(): void;
        /** 从父级移除 */
        removeFromParent(): void;
        /** 该元素位于的堆栈，向上查找 */
        private _viewStack;
        viewStack: IViewStack;
        /** 动画配置 */
        transitionObject: ITransition;
        /** 多状态 */
        protected _states: States;
        readonly states: States;
        protected onChangeState(obj: any): void;
    }
}
declare module nn {
    let SignalPreTouch: string;
    let SignalPreClick: string;
    /** 手势的接口 */
    interface IGesture {
    }
    /** 触摸数据 */
    abstract class CTouch {
        startPosition: Point;
        lastPosition: Point;
        currentPosition: Point;
        /** 点中的对象 */
        target: any;
        currentTarget: any;
        /** 当前的增量 */
        readonly delta: Point;
        /** 移动的距离 */
        readonly distance: Point;
        abstract cancel(): any;
        abstract veto(): any;
        abstract positionInView(v: CComponent): Point;
    }
}
declare module nn {
    class Touch extends CTouch {
        readonly target: any;
        readonly currentTarget: any;
        private _e;
        _event: egret.TouchEvent;
        cancel(): void;
        veto(): void;
        positionInView(v: CComponent): Point;
    }
    class ExtBitmap extends egret.Bitmap {
        constructor();
    }
    class Component extends CComponent {
        constructor();
        protected createImp(): void;
        _signalConnected(sig: string, s?: Slot): void;
        dispose(): void;
        protected instance(): void;
        paint(gra: CGraphics): void;
        protected validate(): boolean;
        protected hitTestChild(x: number, y: number): egret.DisplayObject;
        protected hitTestClient(stageX: number, stageY: number): egret.DisplayObject;
        readonly onStage: boolean;
        resourceGroups: Array<string>;
        clazzResourceProgress: any;
        showResourceProgress: boolean;
        /** 加载场景，如果存在设定的资源组，则需要提前加载资源组 */
        loadScene(cb: () => void, ctx: any): void;
        addChild(c: CComponent, layout?: boolean): void;
        addChildAt(c: CComponent, idx: number, layout?: boolean): void;
        removeChild(c: CComponent): void;
        removeChildren(): void;
        getChildAt(idx: number): CComponent;
        setChildIndex(c: CComponent, idx: number): void;
        getChildIndex(c: CComponent): any;
        swapChildAt(idx0: number, idx1: number): void;
        swapChild(l: CComponent, r: CComponent): void;
        hasChild(c: CComponent): boolean;
        bringFront(v?: CComponent): void;
        sendBack(v?: CComponent): void;
        hollowOut(c: CComponent): void;
        readonly numChildren: number;
        zPosition: number;
        static _SortDepth(l: any, r: any): number;
        updateZPosition(): void;
        readonly children: Array<CComponent>;
        readonly parent: CComponent;
        touchEnabled: boolean;
        touchChildren: boolean;
        visible: boolean;
        clipsToBounds: boolean;
        clipsRegion: Rect;
        maskView: CComponent;
        animate: CAnimate;
        private _translate;
        translate: Point;
        private _scale;
        scale: Point;
        private _rotation;
        rotation: Angle;
        alpha: number;
        private _cacheEnabled;
        cacheEnabled: boolean;
        flushCache(): void;
        updateCache(): void;
        setNeedsCache(): void;
        private _anchorPoint;
        anchor: Point;
        private _anchorOffset;
        anchorOffset: Point;
        frame: Rect;
        setFrame(rc: Rect, anchor?: boolean): void;
        getX(): number;
        getY(): number;
        getWidth(): number;
        getHeight(): number;
        protected impSetFrame(rc: Rect, ui: egret.DisplayObject): void;
        bounds(): Rect;
        private _backgroundColor;
        backgroundColor: ColorType;
        private _borderLine;
        borderLine: Line;
        private _backgroundImageSource;
        private _backgroundImageView;
        backgroundImage: TextureSource;
        private _lyrBackground;
        protected _drawBackground(rc: Rect): void;
        private _gestures;
        readonly gestures: Array<Gesture>;
        addGesture(ges: Gesture): void;
        clearGestures(): void;
        updateLayout(): void;
        private _touch;
        readonly touch: Touch;
        private __dsp_touchbegin(e);
        private __dsp_touchend(e);
        private __dsp_touchrelease(e);
        private __dsp_touchmove(e);
        private __dsp_pretouch(e);
        private __dsp_preclick(e);
        private __dsp_addedtostage();
        private __dsp_tap(e);
        convertPointTo(pt: Point, des: CComponent): Point;
        convertRectTo(rc: Rect, des: CComponent): Rect;
        renderToTexture(): TextureSource;
    }
    function impSetTexture(bmp: egret.Bitmap, tex: egret.Texture): void;
}
declare module nn {
    /** 页面过渡的动画 */
    interface ITransition extends IReference {
        play(appear: CComponent, disappear: CComponent): any;
    }
    /** 自定义动画对象 */
    class Animator {
        _preproperties: KvObject<string, any>;
        _properties: KvObject<string, any>;
        /** 类似于 iOS 的反向设置模式 */
        backMode: boolean;
        /** 增量移动 */
        translate(dpt: Point): Animator;
        translatex(x: number): Animator;
        translatey(y: number): Animator;
        /** 倍数移动 */
        stranslate(dpt: Point): Animator;
        /** 移动到点 */
        moveto(dpt: Point): Animator;
        movetox(v: number): Animator;
        movetoy(v: number): Animator;
        /** 增量缩放倍数 */
        scale(dpt: Point): Animator;
        scaleto(dpt: Point): Animator;
        /** 旋转 */
        rotate(ang: Angle): this;
        /** 淡入淡出 */
        fade(to: number, from?: number): Animator;
        fadeIn(alpha?: number): Animator;
        fadeOut(alpha?: number): Animator;
        /** 任意参数做动画 */
        change(key: string, to: any, from?: any): Animator;
    }
    class TimeFunction {
        static IN: number;
        static OUT: number;
        static INOUT: number;
        static Pow: (pow: any, inout?: number) => Function;
        static Quad: (inout?: number) => Function;
        static Bounce: (inout?: number) => Function;
        static Elastic: (amplitude?: any, period?: any, inout?: number) => Function;
        static Circ: (inout?: number) => Function;
        static Back: (amount?: number, inout?: number) => Function;
    }
    abstract class CAnimate extends SObject {
        constructor();
        dispose(): void;
        static Duration: number;
        /** 播放几次 */
        count: number;
        /** 动画的标记 */
        tag: any;
        protected _firedCount: number;
        _initSignals(): void;
        /** 设置重复的次数 */
        repeat(count: number): this;
        /** 清空所有 */
        abstract clear(): any;
        /** 结束所有动画 */
        abstract stop(): any;
        /** 链接对象 */
        abstract bind(tgt: CComponent): this;
        /** 取消对象 */
        abstract unbind(tgt: CComponent): any;
        abstract unbindAll(): any;
        /** 下一步 */
        abstract next(props: any, duration: number, tf: Function): this;
        abstract to(duration: number, tf: Function, ani: (ani: Animator) => void, ctx?: any): this;
        then(ani: (ani: Animator) => void, ctx?: any, duration?: number, tf?: Function): this;
        /** 等待 */
        abstract wait(duration: number, passive?: boolean): this;
        /** 执行函数 */
        abstract invoke(fun: Function, ctx?: any): this;
        /** 结束 */
        complete(cb: (s: Slot) => void, ctx?: any): this;
        /** 播放 */
        abstract play(reverse?: boolean): this;
        /** 暂停 */
        abstract pause(): any;
        /** 恢复 */
        abstract resume(): any;
        /** 暂停的状态 */
        abstract isPaused(): boolean;
        /** 动画结束是否恢复原来的状态 */
        autoReset: boolean;
        /** 动画结束是否自动解除绑定 */
        autoUnbind: boolean;
        /** 动画结束后是否自动释放 */
        autoDrop: boolean;
        /** 复制 */
        clone(): this;
        /** 直接停止对象动画 */
        static Stop(tgt: CComponent): void;
        inTo(duration: number, cb: (animator: Animator) => void, ctx?: any, tf?: Function): this;
        outTo(duration: number, cb: (animator: Animator) => void, ctx?: any, tf?: Function): this;
        tremble(duration?: number, tf?: Function): this;
    }
    abstract class CTween {
        /** 激活一个对象添加动画 */
        static Get(c: CComponent, props?: any): any;
        /** 删除对象的全部动画 */
        static Stop(c: CComponent): void;
    }
}
declare module nn {
    class Animate extends CAnimate {
        constructor();
        dispose(): void;
        bind(tgt: CComponent): this;
        unbind(tgt: CComponent): void;
        unbindAll(): void;
        clear(): this;
        stop(): void;
        next(props: any, duration: number, tf?: Function): this;
        to(duration: number, tf: Function, cb: (animator: Animator) => void, ctx?: any): this;
        wait(duration: number, passive?: boolean): this;
        invoke(fun: Function, ctx?: any): this;
        private __ani_ended;
        protected _doPlay(reverse: boolean): void;
        play(reverse?: boolean): this;
        private _paused;
        pause(): void;
        resume(): void;
        isPaused(): boolean;
        clone(): this;
        private _targets;
        private _steps;
        static Stop(tgt: CComponent): void;
    }
    class Tween extends CTween {
        static Get(c: CComponent, props?: any): egret.Tween;
        static Stop(c: CComponent): void;
    }
    /** 同时播放一堆动画 */
    class Animates extends SObject {
        constructor();
        dispose(): void;
        protected _initSignals(): void;
        add(ani: CAnimate): this;
        play(): this;
        complete(cb: () => void, ctx?: any): this;
        private _counter;
        private _cb_aniend();
        private _list;
    }
    /** 用来接管一组的动画 */
    class AnimateGroup extends SObject {
        constructor();
        dispose(): void;
        protected _initSignals(): void;
        /** 同时播放 */
        add(ani: CAnimate): this;
        /** 之后播放 */
        next(ani: CAnimate): this;
        /** 播放动画组 */
        play(): this;
        complete(cb: () => void, ctx?: any): this;
        clear(): void;
        protected _current(): Animates;
        protected _next(): Animates;
        private __current;
        private _animates;
    }
    /** 多个UI之间的过渡动画
     */
    class Transition extends SObject implements ITransition {
        constructor(a?: CAnimate, d?: CAnimate);
        dispose(): void;
        protected _initSignals(): void;
        /** 反转 */
        reverse: boolean;
        appear: CAnimate;
        disappear: CAnimate;
        play(appear: CComponent, disappear: CComponent): void;
        private _ani_step;
        private _ani_cnt;
        private __cbani_end();
    }
}
declare module nn {
    /** 堆栈类，作为具有层级结构的基类使用
        push/pop 等操作因为业务通常会连着用，避免连续多个引发问题，所以实现放倒队列中进行
    */
    class ViewStack extends Component implements IViewStack {
        constructor();
        protected _initSignals(): void;
        dispose(): void;
        rootPopable: boolean;
        protected _opers: OperationQueue;
        protected _views: InstanceType<CComponent>[];
        protected _topView: StackPageType;
        topView: StackPageType;
        protected setTopView(page: StackPageType, animated?: boolean): CComponent;
        protected swapPages(now: CComponent, old: CComponent, animated: boolean): void;
        protected _emitSelectionChanged(now: CComponent, old: CComponent): void;
        removeChild(c: CComponent): void;
        updateLayout(): void;
        protected setPageFrame(page: CComponent): void;
        protected setViews(arr: Array<StackPageType>): void;
        push(page: StackPageType, animated?: boolean): boolean;
        private _doPush(page, animated?);
        protected _addPage(page: StackPageType, aschild: boolean): void;
        pop(page?: StackPageType, animated?: boolean): boolean;
        private _doPop(page, animated);
        popTo(page: StackPageType | number, animated?: boolean): boolean;
        private _doPopTo(idx, curidx, animated?);
        popToRoot(animated?: boolean): void;
        clear(): void;
        transiting(from: any, to: any, reverse: boolean, cb?: () => void, ctx?: any): any;
    }
}
declare module nn {
    class Widget extends Component {
        constructor();
        protected hitTest(x: number, y: number): any;
    }
    class Sprite extends Component implements IPage {
        constructor();
        pathKey: string;
        private _reuseUis;
        reuse(idr: any, cb: () => any, ctx: any): any;
        reuse(idr: any, cls: any): any;
        reuse(idr: any): any;
    }
    class SpriteWrapper extends Component {
        constructor(cnt?: Component);
        dispose(): void;
        _contentView: Component;
        contentView: Component;
        updateLayout(): void;
    }
}
declare module nn {
    abstract class CBitmap extends Widget {
        constructor(res?: TextureSource);
        dispose(): void;
        protected _initSignals(): void;
        /** 9点 */
        point9: [number, number, number, number];
        /** 素材 */
        imageSource: TextureSource;
        /** 填充模式 */
        fillMode: FillMode;
        /** 期望的大小 */
        preferredFrame: Rect;
    }
}
declare module nn {
    abstract class CScrollView extends Component {
        constructor(cnt?: CComponent);
        protected _initSignals(): void;
        /** 指示条是否嵌入页面中，否则浮在页面上 */
        floatingIdentifier: boolean;
        /** 内容页面 */
        contentView: CComponent;
        /** 内容大小 */
        contentSize: Point;
        /** 滚动的偏移 */
        protected _contentOffset: Point;
        contentOffset: Point;
        /** 带动画的偏移
            @note 注意会引起 ScrollEnd 的消息
         */
        setContentOffset(pt: Point, duration: number): void;
        setContentOffsetX(v: number, duration: number): void;
        setContentOffsetY(v: number, duration: number): void;
        /** 显示中的区域 */
        regionBounds: Rect;
        /** 计算内容的大小 */
        abstract boundsForContent(): Rect;
        /** 指示条，需要实现 IProgress */
        verticalIdentifier: CComponent;
        horizonIdentifier: CComponent;
        /** 内容的边距 */
        contentEdgeInsets: EdgeInsets;
        /** 当滚动 */
        onPositionChanged(): void;
        /** 停止滚动 */
        stopDecelerating(): void;
        /** 使用scroll包裹一个空间来滑动 */
        static Wrapper(ui: CComponent): CScrollView;
    }
}
declare module nn {
    class Navigation extends ViewStack {
        constructor();
        protected _addPage(page: StackPageType, aschild: boolean): void;
        pages: Array<StackPageType>;
    }
    /** 用来进行导航的过渡特效，推进和推出 */
    class TransitionNavigation extends Transition {
        constructor(duration?: number);
    }
    /** 淡入淡出交替的过渡特效 */
    class TransitionFade extends Transition {
        constructor(duration?: number);
    }
}
declare module nn {
    let ERROR_NETWORK_FAILED: number;
    class Model extends SObject implements ISerializable, ICacheObject {
        constructor();
        dispose(): void;
        protected _initSignals(): void;
        cacheFlush: boolean;
        cacheUpdated: boolean;
        cacheTime: number;
        keyForCache(): string;
        paramsForCache(): KvObject<string, string>;
        valueForCache(): any;
        /** 动作 */
        action: string;
        /** 参数 */
        params: KvObject<string, string>;
        /** 域 */
        host: string;
        /** 返回的数据 */
        response: any;
        /** 需要自动带上授权信息 */
        withCredentials: boolean;
        private _modelcallback;
        modelcallback: string;
        static HTTP: string;
        static HTTPS: string;
        /** 获得请求的类型 */
        method: HttpMethod;
        /** 是否跨域 */
        iscross(): boolean;
        /** 是否使用代理 */
        useproxy(): boolean;
        /** 全路径 */
        url(): string;
        /** 可用的参数 */
        fields(): KvObject<string, string>;
        /** 是否获取成功 */
        isSucceed(): boolean;
        /** 保存成功或失败的状态 */
        succeed: boolean;
        /** 调试模式，即使错误也同样激活成功的消息 */
        isDebug: boolean;
        /** 是否显示 wait */
        showWaiting: boolean;
        /** 是否显示错误信息 */
        showError: boolean;
        /** 处理结果数据 */
        serialize(respn: any): boolean;
        unserialize(respn: any): boolean;
        /** 返回的数据 */
        code: number;
        message: string;
        /** 超时 s，默认不使用改特性 */
        timeout: Interval;
        private _tmr_timeout;
        /** 超时当作失败，因为默认的超时有可能是因为这个接口本来就跑的很久，并且通常的超时提示用户也没什么意义，所以先设计为由业务层设置该功能，如果为 true，则当超时时会发送 SignalFailed */
        timeoutAsFailed: boolean;
        /** 用于调试的数据 */
        protected urlForLog(): string;
        protected fieldsForLog(): KvObject<string, string>;
        __mdl_start(): void;
        __mdl_completed(e: any): void;
        __mdl_failed(e: Slot): void;
        __mdl_timeout(): void;
        __mdl_end(): void;
        processResponse(): void;
        protected clear(): void;
        _urlreq: CHttpConnector;
        /** 调用的时间 */
        ts: number;
    }
    /** 支持分页的model */
    class PagedModel<ItemT> {
        constructor();
        add(page: any, items: Array<ItemT>): void;
        changed: boolean;
        page: any;
        private _items;
        readonly items: Array<ItemT>;
        readonly allItems: Array<ItemT>;
        previous(): boolean;
        next(): boolean;
    }
}
declare module nn {
    class ObjectReference {
        object: any;
    }
    function ObjectClass(o: any): any;
    function Classname(cls: any): string;
    function SuperClass(o: any): any;
    function IsInherit(type: Function, parent: Function): boolean;
    /** 带参数的实例化对象 */
    function NewObject(cls: any, p: any[]): any;
    function InstanceNewObject<T>(o: T, ...p: any[]): T;
    function MethodIsOverrided(cls: any, method: string): boolean;
    function HasMethod(cls: any, method: string): boolean;
    function Method(obj: any, method: string): any;
    class Class<T> {
        constructor(type?: any);
        type: any;
        instance(): T;
        isEqual<R>(r: Class<R>): boolean;
    }
    /** 实例的容器
        @note 承载实例好的对象或者延迟实例化的类，但是暴露出去的都是实例
    */
    class Instance<T> {
        constructor(o: T | Function);
        drop(): void;
        readonly obj: T;
        readonly clazz: any;
        isnull(): boolean;
        private _obj;
        private _clazz;
    }
    function New<T>(v: T): Instance<any>;
    type InstanceType<T> = T | Instance<T>;
    class Closure {
        constructor(cb: Function, ctx: any, ...p: any[]);
        dispose(): void;
        protected cb: Function;
        protected ctx: any;
        protected argus: any[];
        payload: any;
        invoke(...p: any[]): any;
        reset(cb: Function, ctx: any, ...p: any[]): void;
    }
    /** 拼装参数，直接发起函数调用 */
    function Invoke1(fun: Function, ctx: any, p: any[], ...prefixarguments: any[]): any;
    function Invoke2(fun: Function, ctx: any, prefixarguments: any[], p: any[]): any;
    /** 直接运行，返回参数 */
    function call(cb: () => void): void;
}
declare module tmp {
    function rtname(): string;
}
declare module nn {
    class ScrollView extends CScrollView {
        constructor(cnt?: Component);
        dispose(): void;
        private _scrollView;
        private _contentEdgeInsets;
        contentEdgeInsets: EdgeInsets;
        updateData(): void;
        stopDecelerating(): void;
        updateLayout(): void;
        boundsForContent(): Rect;
        addChild(c: Component): void;
        removeChild(c: Component): void;
        private _verticalIdentifier;
        verticalIdentifier: Component;
        private _horizonIdentifier;
        horizonIdentifier: Component;
        private _contentSize;
        contentSize: Size;
        protected _scrollContent: SpriteWrapper;
        contentView: Component;
        protected _updateIdentifier(): void;
        onPositionChanged(): void;
        private _scrollTouching;
        _onTouchBegin(e: egret.TouchEvent): void;
        _onTouchEnd(e: egret.TouchEvent): void;
        _onScrollStarted(): void;
        _onScrollFinished(): void;
        regionBounds: Rect;
        setContentOffset(pt: Point, duration: number): void;
    }
}
declare module Js {
    var siteUrl: string;
    var printf: () => string;
    var guid: () => string;
    var uuid: (len: any, radix: any) => string;
    var getBrowserSize: () => {
        width: number;
        height: number;
    };
    var getScreenSize: () => {
        width: number;
        height: number;
    };
    var getBrowserOrientation: () => any;
    var hashKey: (o: any) => any;
    function OverrideGetSet(cls: any, name: any, oset: any, ounset: any): void;
    function OverrideFunction(cls: any, funm: any, of: any): void;
    function enterFullscreen(e: any): void;
    function exitFullscreen(): void;
    function isFullscreen(): boolean;
    function loadScripts(list: any, cb: any, ctx: any): void;
    function loadScript(src: any, cb: any, ctx: any): void;
    function loadStyles(list: any, cb: any, ctx: any): void;
    function loadStyle(src: any, cb: any, ctx: any): void;
    const enum SOURCETYPE {
        JS = 0,
        CSS = 1,
    }
    function loadSources(list: any, cb: any, ctx: any): void;
    function loadSource(src: any, cb: any, ctx: any): void;
    function stacktrace(): string;
}
declare module nn {
    class Bitmap extends CBitmap {
        constructor(res?: TextureSource);
        protected _bmp: ExtBitmap;
        protected onChangeState(obj: any): void;
        bestFrame(inrc?: Rect): Rect;
        protected _getTexture(): egret.Texture;
        /** 按照材质的大小设置显示的大小 */
        autoFit: boolean;
        private _imageSource;
        imageSource: TextureSource;
        protected _setTexture(tex: egret.Texture): void;
        updateLayout(): void;
    }
    class Picture extends Bitmap {
        constructor(res?: TextureSource);
    }
}
declare module nn {
    class TextAlign {
        static CENTER: string;
        static LEFT: string;
        static RIGHT: string;
    }
    abstract class CLabel extends Widget {
        constructor();
        protected _initSignals(): void;
        static FontSize: number;
        /** 粗体 */
        bold: boolean;
        /** 斜体 */
        italic: boolean;
        /** 描边宽度 */
        stroke: number;
        /** 描边颜色 */
        strokeColor: ColorType;
        /** 行距 */
        lineSpacing: number;
        /** 字体大小 */
        fontSize: number;
        /** 蚊子颜色 */
        textColor: ColorType;
        /** 文字对齐 */
        textAlign: string;
        /** 文字停靠的边缘 */
        textSide: string;
        /** 字体 */
        fontFamily: string;
        /** 行数 */
        numlines: number;
        /** 多行 */
        multilines: boolean;
        /** 文字 */
        text: string;
        /** override 富文本文字 */
        attributedText: any;
        /** override html文字 */
        htmlText: string;
        /** 缩放字体以适应控件 */
        scaleToFit: boolean;
        /** 增加文字 */
        abstract appendText(s: string): any;
        /** 如果输入了混合文本，并加入了link，则可以通过直接绑定rex和clouse来处理链接的点击 */
        abstract href(re: RegExp, cb: (url: string) => void, ctx?: any): any;
    }
    abstract class CBitmapLabel extends Widget {
        /** 字体的名称 */
        fontSource: FontSource;
        /** 字体的大小 */
        fontSize: number;
        /** 间距 */
        characterSpacing: number;
        /** 行距 */
        lineSpacing: number;
        /** 文本内容 */
        text: string;
        /** 对齐方式 */
        textAlign: string;
        /** 文字停靠的边缘 */
        textSide: string;
    }
}
declare module nn {
    class _GameLayer extends Navigation {
        root: CComponent;
    }
    class _DesktopLayer extends Sprite {
    }
    /** 资源加载进度和弹出的进度是同一个类 */
    let RESOURCELOADINGISHUD: boolean;
    abstract class CApplication extends Sprite implements IReqResources {
        /** 用来重新定义弹出文字框 */
        clazzHudText: Class<Hud>;
        /** 用来重新定义弹出的等待框 */
        clazzHudProgress: Class<Hud>;
        /** 用来实现实时资源加载进度的类 */
        clazzResourceProgress: Class<Hud>;
        /** 用来实现首页加载进度的类 */
        clazzLoadingScene: Class<LoadingScreen>;
        /** 用来实现alert等标准弹出框的绑定 */
        alert: (title: string, msg: string, data: {
            btn?: string;
            cb?: () => void;
        }) => void;
        /** 确认框，按照顺序，从左往右放入，从右往左显示，所以Yes的按钮会出现在最右端 */
        confirm: (title: string, msg: string, data: [{
            btn?: string;
            cb?: () => void;
        }]) => void;
        /** 预加载的资源 */
        getReqResources(): Array<ReqResource>;
        reqResources: Array<ReqResource>;
        /** 全局唯一的业务实例 */
        static shared: CApplication;
        constructor();
        protected _initSignals(): void;
        /** 打开 app 所使用的地址 */
        url: URL;
        /** 版本号 */
        version: string;
        /** 版本信息 */
        readonly versioninfo: string;
        /** 图标 */
        icon: string;
        /** 默认资源 */
        resourceFile: string;
        /** 默认主题资源 */
        themeFile: string;
        /** 默认数据资源 */
        dataFile: string;
        /** 默认项目配置 */
        configFile: string;
        /** 用来填充白边的图片 */
        backgroundImagePattern: string;
        /** 游戏的代号 */
        private _identifier;
        identifier: string;
        /** 工程的配置文件(configFile)中读取的内容 */
        config: any;
        /** 程序中使用的默认字体 */
        fontFamily: string;
        private _loadingScreen;
        private __app_addedtostage();
        /** 延期加载的capsules */
        capsules(reqs: ReqResource[]): CResCapsule;
        protected _preloadConfig(oper: OperationGroup): void;
        protected onLoadingScreenStart(): void;
        private _cbResLoadChanged(s);
        private _cbResLoadCompleted();
        private _cbLoadingComplete();
        protected onLoaded(): void;
        /** 游戏的元素都画到这一层上 */
        protected _gameLayer: _GameLayer;
        readonly gameLayer: Navigation;
        /** 自定义的桌面弹出都放到这一层上 */
        protected _desktopLayer: _DesktopLayer;
        readonly desktopLayer: Sprite;
        updateLayout(): void;
        viewStack: Navigation;
        /** 应用的唯一标示 */
        protected _uniqueId: string;
        readonly uniqueId: string;
        /** 机器指纹 */
        protected _idfa: string;
        readonly idfa: string;
        /** 基于唯一标示的用户数据 */
        uniqueKey(key: string): string;
        /** 期望的尺寸，返回 null，则代表使用当前屏幕的尺寸 */
        static BestFrame(): Rect;
        /** 是否使用webgl */
        static UseWebGl(): boolean;
        /** 应用的主方向 */
        static Orientation(): number;
        /** 是否使用屏幕尺寸
            4种样式: 使用屏幕尺寸、使用设计尺寸、使用设计尺寸适配屏幕尺寸、使用设计尺寸填充屏幕尺寸，对应于 STRETCH、CENTER、ASSTRETCH、ASFILL
         */
        static ScreenFillMode(): FillMode;
        /** 屏幕的物理缩放比例
            @note 如果业务是根据720*1280来设计，如果发现跑的慢，需要修改一下设计尺寸，但是所有布局已经按照720*1280来编码，此时已经不容重新修改布局代码，通过该参数就可以控制重新按照缩放后的分辨率来布局
        */
        static ScreenScale(): number;
        /** 应用支持的特性 */
        static Features(): FrameworkFeature;
        /** 生成唯一标示 */
        protected generateUniqueId(): string;
        static NeedFullscreen: boolean;
        private __app_preclick(s);
        private __app_pretouch(s);
        /** 进入全屏模式 */
        enterFullscreen(): void;
        /** 推出全屏模式 */
        exitFullscreen(): void;
        readonly isFullscreen: boolean;
        /** 应用是否激活 */
        isActivating: boolean;
        protected onActivated(): void;
        protected onDeactived(): void;
        /** 重新打开应用 */
        private __restarting;
        restart(): void;
        private __app_orientationchanged(e);
        static _OPERATIONS: MultiMap<string, Function>;
        /** 启动过程中执行 */
        static InBoot(fn: Function): void;
        /** 加载过程中执行 */
        static InData(fn: (cb: () => void) => void): void;
    }
}
declare module nn.loader {
    let webloading: () => void;
    let webstart: () => void;
    let nativestart: () => void;
    let runtimestart: () => void;
    function InBoot(fn: () => void): void;
    function InvokeBoot(): void;
}
declare module app.debug {
    let PATH: string;
    let UUID: string;
    let CONFIG: boolean;
    let BUILDDATE: number;
}
declare module nn {
    class EntrySettings {
        /** 独立模式，代表该实体只能同时存在一个对象，默认为true */
        singletone: boolean;
        /** 其他数据 */
        ext: any;
        static Default: EntrySettings;
    }
    interface IEntry {
        /** 模块的配置 */
        entrySettings?: EntrySettings;
    }
    interface ILauncher {
        /** 处理模块的启动
            @param cls 待启动模块的类
            @param data 附加的参数
        */
        launchEntry(cls: any, data?: any): any;
    }
    abstract class Manager extends SObject {
        /** 初始化自己和其它manager或者其它对象之间的关系 */
        abstract onLoaded(): any;
        /** 当整个APP完成配置数据加载试调用，初始化自身的数据 */
        onDataLoaded(): void;
    }
    abstract class Managers extends SObject {
        register<T>(obj: T): T;
        onLoaded(): void;
        onDataLoaded(): void;
        protected _managers: Manager[];
    }
    interface IEntryClass {
        name: string;
        clazz: () => Function;
    }
    type EntryIdrToLauncherIdr = (entryidr: string) => string;
    type EntryLauncherType = ILauncher | string | EntryIdrToLauncherIdr;
    type EntryClassType = Function | IEntryClass;
    class _EntriesManager {
        /** 注册一个模块
            @param entryClass类
        */
        register(entryClass: EntryClassType, data?: EntrySettings): void;
        /** 启动一个模块
            @param entry 类或者标类名
            @param launcher 启动点的标示号或者启动点的实例
            @pram data 附加的参数
        */
        invoke(entry: any | string, launcher: EntryLauncherType, ext?: any): void;
        protected _doInvoke(entry: any | string, launcher: EntryLauncherType, ext?: any): void;
        private _entries;
        private _entriesdata;
        toString(): string;
    }
    let EntryCheckSettings: (cls: any, data: EntrySettings) => boolean;
    let EntriesManager: _EntriesManager;
    class _LaunchersManager extends nn.SObject {
        constructor();
        protected _initSignals(): void;
        /** 注册一个启动器 */
        register(obj: ILauncher): void;
        /** 取消 */
        unregister(obj: ILauncher): void;
        /** 查找一个启动器 */
        find(str: string): ILauncher;
        private _launchers;
        toString(): string;
    }
    let LaunchersManager: _LaunchersManager;
}
declare let document_class: any;
declare let document_orientation: any;
declare module nn {
    class EgretApp extends CApplication {
        constructor();
        fontFamily: string;
    }
    let EUI_MODE: boolean;
}
declare module nn {
    class FrameTimer {
        constructor();
        /** 起始时间 ms */
        start: number;
        /** 点前的时间点 */
        now: number;
        /** 消耗时间 */
        cost: number;
        /** 过去了的时间 */
        past: number;
        /** 次数统计 */
        count: number;
    }
    interface IFrameRender {
        onRender(cost: number): any;
    }
    abstract class CFramesManager {
        private _blayouts;
        private _bzpositions;
        private _bappears;
        private _bcaches;
        private _bmcs;
        static _layoutthreshold: number;
        protected onPrepare(): void;
        protected onRendering(): void;
        RENDERS: CSet<IFrameRender>;
        /** 强制更新下一帧 */
        abstract invalidate(): any;
        /** 布局 */
        needsLayout(c: CComponent): void;
        cancelLayout(c: CComponent): void;
        /** 调整Z顺序 */
        needsZPosition(c: CComponent): void;
        /** 显示 */
        needsAppear(c: CComponent): void;
        /** 刷新图形缓存 */
        needsCache(c: CComponent): void;
        /** 刷新内存缓存 */
        needsGC(mc: Memcache): void;
        abstract launch(c: any): any;
        private _ft;
    }
    let FramesManager: CFramesManager;
}
declare module nn {
    /** Desktop默认依赖的执行队列，业务可以通过替换对来来手动划分不同的Desktop打开层级
        @note 如果Desktop放到队列中，则当上一个dialog关闭时，下一个dialog才打开
    */
    let DesktopOperationQueue: OperationQueue;
    /** 桌面，打开时铺平整个屏幕 */
    class Desktop extends Component {
        static BackgroundColor: Color;
        static BackgroundImage: TextureSource;
        constructor(ui?: CComponent);
        dispose(): void;
        static FromView(c: CComponent): Desktop;
        private __dsk_sizechanged(s);
        _initSignals(): void;
        /** 高亮元素，在元素所在的位置镂空背景 */
        _filters: CComponent[];
        addFilter(ui: CComponent): void;
        /** 是否打开高亮穿透的效果
            @note 如果打开，只有filters的部分可以接受touch的事件
        */
        protected _onlyFiltersTouchEnabled: boolean;
        onlyFiltersTouchEnabled: boolean;
        static _AllNeedFilters: Desktop[];
        hitTestInFilters(pt: Point): any;
        onLoaded(): void;
        private __dsk_addedtostage();
        onAppeared(): void;
        updateFilters(): void;
        protected _contentView: CComponent;
        contentView: CComponent;
        /** 延迟指定时间后关闭
            @note 因为可能open在队列中，如果由业务层处理，则不好把握什么时候当前dialog才打开
        */
        delayClose: number;
        /** 桌面基于的层，默认为 Application.desktopLayer
            @note 业务可以指定desktop是打开在全局，还是打开在指定的ui之内
        */
        desktopLayer: CComponent;
        /** 是否已经打开
            @note 如果open在队列中，则调用open后，当前parent仍然为null，但是逻辑上该dialog算是已经打开，所以需要使用独立的变量来维护打开状态
        */
        protected _isOpened: boolean;
        readonly isOpened: boolean;
        /** 队列控制时依赖的队列组，业务层设置为自己的队列实例来和标准desktop的队列隔离，避免多重desktop等待时造成业务中弹出的类似如tip的页面在业务dialog后等待的问题 */
        queue: OperationQueue;
        protected _oper: Operation;
        /** 当在队列中打开时，需要延迟的时间
            @note 同样因为如果打开在队列中，业务层无法很方便的控制打开前等待的时间
        */
        delayOpenInQueue: number;
        /** 打开
            @param queue, 是否放到队列中打开
        */
        open(queue?: boolean): void;
        /** 接着其他对象打开 */
        follow(otherContent: CComponent): void;
        /** 替换打开 */
        replace(otherContent: CComponent): void;
        /** desktop打开的样式
            @note 默认为弹出在desktopLayer，否则为push进desktopLayer
            弹出不会隐藏后面的内容，push将根据对应的viewStack来决定是否背景的内容隐藏
        */
        popupMode: boolean;
        _addIntoOpening: boolean;
        static _AllOpenings: Desktop[];
        protected doOpen(): void;
        /** 关闭所有正在打开的desktop */
        static CloseAllOpenings(): void;
        /** 正在打开的desktop */
        static Current(): Desktop;
        /** 关闭 */
        close(): void;
        protected doClose(): void;
        /** 点击桌面自动关闭 */
        clickedToClose: boolean;
        private __dsk_clicked();
        /** 使用自适应来布局内容页面 */
        adaptiveContentFrame: boolean;
        updateLayout(): void;
    }
}
declare module nn {
    /** 按钮类
        @note 定义为具有点按状态、文字、图片的元素，可以通过子类化来调整文字、图片的布局方式
     */
    abstract class CButton extends Widget implements IState {
        constructor();
        static STATE_NORMAL: string;
        static STATE_DISABLED: string;
        static STATE_HIGHLIGHT: string;
        static STATE_SELECTED: string;
        /** 是否可用 */
        disabled: boolean;
        /** 字体大小 */
        fontSize: number;
        /** 文字颜色 */
        textColor: ColorType;
        /** 内容 */
        text: string;
        /** 对齐方式 */
        textAlign: string;
        /** 图片 */
        imageSource: TextureSource;
        /** 普通的状态 */
        stateNormal: State;
        /** 禁用的状态 */
        stateDisabled: State;
        /** 高亮的状态 */
        stateHighlight: State;
        /** 选中的状态 */
        stateSelected: State;
        /** 点击频度限制 */
        eps: number;
        _signalConnected(sig: string, s?: Slot): void;
        protected _initSignals(): void;
        isSelection(): boolean;
        protected _isSelected: boolean;
    }
}
declare module nn {
    /** 骨骼的配置信息 */
    class BoneConfig implements IReqResources {
        /**
           @name 骨骼动画的名称，如果设置name而不设置其他，则使用 name 和默认规则来生成缺失的文件
           @character 角色名称，通常和name一致
           @skeleton 动作的配置文件，通常为动作名 skeleton_json 结尾
           @place 材质节点的位置配置文件，通常为 texture_json 结尾
           @texture 图片文件，通常为 texture_png 结尾
        */
        constructor(name?: string, character?: string, skeleton?: string, place?: string, texture?: string);
        resourceGroups: Array<string>;
        protected _skeleton: string;
        protected _place: string;
        protected _texture: string;
        protected _character: string;
        fps: number;
        protected _name: string;
        name: string;
        skeleton: string;
        place: string;
        texture: string;
        character: string;
        getReqResources(): Array<ReqResource>;
    }
    type BoneSource = BoneData | BoneConfig | UriSource;
    /** 业务使用的骨骼显示类 */
    abstract class CBones extends Widget {
        constructor();
        protected _initSignals(): void;
        /** 骨骼的配置 */
        boneSource: BoneSource;
        /** 同一批骨骼的大小可能一直，但有效区域不一致，所以可以通过该参数附加调整 */
        additionScale: number;
        /** 骨骼填充的方式，默认为充满 */
        fillMode: FillMode;
        /** 对齐位置 */
        clipAlign: POSITION;
        /** 具体动作 */
        motion: string;
        abstract pushMotion(val: string): any;
        abstract popMotion(): any;
        /** 当前含有的所有动作 */
        abstract motions(): Array<string>;
        /** 是否含有该动作 */
        abstract hasMotion(val: string): boolean;
        /** 自动开始播放 */
        autoPlay: boolean;
        /** 播放次数控制
            -1: 循环
            0: 使用文件设置的次数
            >0: 次数控制
        */
        count: number;
        /** 播放 */
        abstract play(): any;
        /** 停止播放 */
        abstract stop(): any;
    }
}
declare module egret {
    var VERSION: number;
    function MAKE_VERSION(maj: any, min: any, patch: any): any;
}
declare module eui {
    class ItemInfo {
        /** 对应的数据 */
        data: any;
        /** 表中的索引 */
        index: number;
        /** 渲染用的renderer */
        renderer: eui.IItemRenderer;
        static FromEvent(e: eui.ItemTapEvent): ItemInfo;
    }
    /** 换选时带出业务层判断的对象 */
    class SelectionInfo {
        /** 当前选中 */
        selected: ItemInfo;
        /** 即将选中 */
        selecting: ItemInfo;
        /** 用来取消此次选中 */
        cancel: () => void;
    }
    function _EUIExtFix(cls: any): void;
}
declare module nn {
    function getBounds(e: egret.DisplayObject): nn.Rect;
    function getFrame(e: egret.DisplayObject): nn.Rect;
    function setFrame(e: egret.DisplayObject, rc: nn.Rect): void;
    function setCenter(e: egret.DisplayObject, pt: nn.Point): void;
    function setAnchorPoint(e: egret.DisplayObject, anchor: nn.Point): void;
}
declare module nn {
    type ClipSource = ClipConfig;
    abstract class CMovieClip extends Widget {
        constructor();
        protected _initSignals(): void;
        /** 播放次数，-1代表循环，默认为一次*/
        count: number;
        /** 帧率 */
        fps: number;
        /** 切换clipSource时清空原来的clip */
        clearOnChanging: boolean;
        /** 序列帧资源 */
        clipSource: ClipSource;
        /** 目标序列帧的名称 */
        clip: string;
        /** 序列帧播放的位置 */
        location: number;
        onAppeared(): void;
        private __autopaused;
        onDisappeared(): void;
        /** 是否自动播放 */
        autoPlay: boolean;
        /** 是否正在播放 */
        abstract isPlaying(): boolean;
        /** 暂停动画 */
        abstract stop(): any;
        /** 播放动画 */
        abstract play(): any;
        /** 附加缩放 */
        additionScale: number;
        /** 填充方式 */
        fillMode: FillMode;
        /** 反方向播放 */
        reverseMode: boolean;
        /** 序列帧的对齐位置 */
        clipAlign: POSITION;
        /** flashMode 采用 flash 标记的锚点来显示动画
            @note 这种模式下请设置 fillMode 为 CENTER
        */
        flashMode: boolean;
        /** flashAnchor flash模式下使用的锚点信息 */
        flashAnchorPoint: Point;
    }
    class ClipConfig implements IReqResources {
        /**
           @name 资源名称，资源由 json\bmp 组成，如过传入的时候没有带后缀，则自动加上后缀
           @res 动作文件，通常为 _json
           @tex 素材平成，通常为 _png
        */
        constructor(name?: string, res?: string, tex?: string);
        private _frame;
        private _texture;
        frame: UriSource;
        texture: UriSource;
        /** 名字 */
        private _name;
        name: string;
        /** OPT 帧速 */
        fps: number;
        /** OPT 依赖的资源组 */
        resourceGroups: Array<string>;
        /** OPT 附加缩放 */
        additionScale: number;
        /** OPT 是否为独立数据，否则同一个资源公用一份帧数据 */
        key: string;
        readonly hashCode: number;
        isEqual(r: this): boolean;
        getReqResources(): Array<ReqResource>;
        toString(): string;
    }
}
declare module nn {
    abstract class CParticle extends Widget {
        constructor();
        name: string;
        abstract start(): any;
        abstract stop(): any;
    }
}
declare var eeui: typeof eui;
declare module eui {
    type StackPageType = nn.InstanceType<egret.DisplayObject>;
    type UiType = egret.DisplayObject;
    interface IViewStack {
        push(page: egret.DisplayObject): any;
        pop(): any;
        pages(): egret.DisplayObject[];
    }
    class ComponentU extends eui.Component implements eui.IItemRenderer {
        constructor();
        onLoaded(): void;
        /** 直接配置信号 */
        slots: string;
        /** 灵活的任意配置的数据 */
        tag: any;
        /** 业务中经常会遇到对于该组件的描述，底层提供避免业务重复声明
            @note 不使用public公开的原因是通常业务层需要重载以实现具体的回馈
        */
        protected _help: any;
        help: any;
        /** 隶属于的控件，可以方便业务层的数据穿透 */
        belong: any;
        __disposed: boolean;
        protected _refcnt: number;
        drop(): void;
        grab(): void;
        dispose(): void;
        timer(duration: nn.Interval, count: number, idr?: string): nn.Timer;
        private _timers;
        protected onAppeared(): void;
        protected onDisappeared(): void;
        static _ProcessAppeared(ui: any): void;
        static _ProcessDisppeared(ui: any): void;
        onVisibleChanged(): void;
        $setVisible(b: boolean): boolean;
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        _signalConnected(sig: string, s?: nn.Slot): void;
        private __need_remove_from_launchersmanager;
        private __cmp_tap(e);
        setSkinPart(partName: string, instance: any): void;
        onPartBinded(name: string, tgt: any): void;
        addChild(sp: egret.DisplayObject | nn.CComponent): egret.DisplayObject;
        addChildAt(sp: egret.DisplayObject | nn.CComponent, idx: number): egret.DisplayObject;
        removeChild(sp: egret.DisplayObject | nn.CComponent): egret.DisplayObject;
        removeFromParent(): void;
        playAnimate(ani: Animate, idr?: any): Animate;
        findAnimate(idr: any): Animate;
        stopAnimate(idr: any): void;
        stopAllAnimates(): void;
        goBack(): void;
        protected _data: any;
        data: any;
        protected _itemIndex: number;
        itemIndex: number;
        protected _selected: boolean;
        selected: boolean;
        getCurrentState(): string;
        interactiveEnabled: boolean;
        setLayoutBoundsSize(width: number, height: number): void;
        /** 隶属的栈 */
        viewStack: IViewStack;
        /** 展示与否 */
        exhibition: boolean;
        /** 刷新布局 */
        updateLayout(): void;
        /** 刷新数据 */
        updateData(): void;
        /** 锚点 */
        protected _anchorPointX: number;
        anchorPointX: number;
        protected _anchorPointY: number;
        anchorPointY: number;
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        convertPointTo(pt: nn.Point, sp: egret.DisplayObject | nn.CComponent): nn.Point;
        convertRectTo(rc: nn.Rect, sp: egret.DisplayObject | nn.CComponent): nn.Rect;
        updateCache(): void;
        frame: nn.Rect;
        bounds(): nn.Rect;
    }
    /** 业务非wing重用模块继承该类型 */
    class SpriteU extends eeui.ComponentU {
    }
}
declare module nn {
    class Pen {
        color: Color;
        width: number;
        clone(): this;
        static setIn: (context: any, pen: Pen) => void;
    }
    class Brush {
        color: Color;
        clone(): this;
        static setIn: (context: any, brush: Brush, pre: Brush) => void;
    }
    class GCommand {
        pen: Pen;
        brush: Brush;
        static renderIn: (context: any, cmd: GCommand) => void;
    }
    class GLine extends GCommand {
        start: Point;
        end: Point;
    }
    class GBezier extends GCommand {
        controlA: Point;
        controlB: Point;
        anchor: Point;
    }
    class GCurve extends GCommand {
        control: Point;
        anchor: Point;
    }
    class GArc extends GCommand {
        center: Point;
        radius: number;
        start: Angle;
        end: Angle;
        sweep: Angle;
        ccw: boolean;
    }
    class GCircle extends GCommand {
        center: Point;
        radius: number;
    }
    class GEllipse extends GCommand {
        center: Point;
        width: number;
        height: number;
    }
    class GRect extends GCommand {
        rect: Rect;
        round: number;
        ellipseWidth: number;
        ellipseHeight: number;
    }
    abstract class CGraphics {
        pushState(): void;
        popState(): void;
        draw(c: GCommand): void;
        pen: Pen;
        brush: Brush;
        private _states;
        protected _commands: GCommand[];
        renderIn(context: any): void;
    }
}
declare module nn {
    class ExtHtmlTextParser extends egret.HtmlTextParser {
        constructor();
        parser(htmltext: string): Array<egret.ITextElement>;
    }
    class Label extends CLabel {
        constructor();
        _signalConnected(sig: string, s?: Slot): void;
        protected _lbl: any;
        protected hitTestClient(x: number, y: number): egret.DisplayObject;
        updateLayout(): void;
        bold: boolean;
        italic: boolean;
        stroke: number;
        strokeColor: ColorType;
        private _lineSpacing;
        lineSpacing: number;
        bestFrame(inrc?: Rect): Rect;
        private _tfnsz;
        protected _setFontSize(v: number): void;
        fontSize: number;
        protected _setTextAlign(a: string): void;
        protected _setTextSide(s: string): void;
        textAlign: string;
        textSide: string;
        protected _setText(s: string): boolean;
        text: string;
        attributedText: any;
        private _htmlText;
        htmlText: string;
        protected _setTextFlow(tf: Array<egret.ITextElement>): void;
        textColor: ColorType;
        fontFamily: string;
        numlines: number;
        multilines: boolean;
        textFlow: Array<egret.ITextElement>;
        protected _scaleToFit: boolean;
        scaleToFit: boolean;
        protected doScaleToFit(): void;
        appendText(s: string): void;
        private _links;
        href(re: RegExp, cb: (url: string) => void, ctx?: any): void;
        private __lbl_link(e);
    }
}
declare module nn {
    class HtmlBuilder {
        enter(element: string): this;
        pop(): this;
        style(key: string, value: string | number): this;
        attr(key: string, value: string | number): this;
        text(str: string): this;
        toString(): string;
        private _ele;
        private _text;
        private _style;
        private _buf;
    }
    module dom {
        let ScaleFactorX: number;
        let ScaleFactorDeX: number;
        let ScaleFactorY: number;
        let ScaleFactorDeY: number;
        let ScaleFactorSize: number;
        let ScaleFactorDeSize: number;
        type DomId = string | Element;
        function getElementById(id: DomId): Element;
        class DomObject extends SObject implements SignalsDelegate {
            constructor(id?: DomId);
            dispose(): void;
            static From(id: DomId): DomObject;
            protected _initSignals(): void;
            _signalConnected(sig: string): void;
            event: Event;
            private __dom_clicked();
            updateData(): void;
            css: string;
            _style: any;
            readonly style: any;
            content: string;
            id: any;
            getAttr(k: any, def?: any): any;
            setAttr(k: any, v: any): void;
            private _fontSize;
            fontSize: number;
            private _src;
            src: string;
            readonly width: number;
            readonly height: number;
            add(node: DomObject): DomObject;
            protected preload(cb: () => void, ctx?: any): void;
            protected onLoaded(): void;
            br(): void;
            remove(node: DomObject): void;
            removeFromParent(): void;
            private _visible;
            visible: boolean;
            setFrame(rc: nn.Rect): void;
            private _node;
            protected node: any;
            protected method(mtdname: string): string;
            parent: DomObject;
            nodes: DomObject[];
            /** 维护 listener */
            listener(idr: any): Function;
            bindListener(idr: any, cb: (e: any) => void): Function;
            protected _listeners: KvObject<any, Function>;
            protected readonly listeners: KvObject<any, Function>;
        }
        class Button extends DomObject {
            constructor(id?: DomId);
            _image: string;
            image: string;
        }
        class Label extends DomObject {
            constructor(id?: DomId);
        }
        class Image extends DomObject {
            constructor(id?: DomId);
        }
        class Sprite extends DomObject {
            constructor(id?: DomId);
        }
        class Desktop extends DomObject {
            constructor(dom?: DomObject, id?: DomId);
            clickedToClose: boolean;
            _contentView: DomObject;
            contentView: DomObject;
            open(): void;
            close(): void;
            private __dsk_clicked();
        }
        function x(v: number): number;
        function y(v: number): number;
        function size(v: number): number;
    }
    class _Dom extends dom.DomObject {
        constructor();
        updateBounds(): void;
        protected _initSignals(): void;
        /** 打开新页面 */
        openLink(url: string): void;
        /** 模拟一次点击链接 */
        simulateLink(url: string): void;
        /** 打开页面 */
        openUrl(url: string): void;
        /** 模拟一次点击 */
        private _waitclick;
        simulateClick(cb: () => void, ctx?: any): void;
        private __cb_simulate_click();
    }
    let Dom: _Dom;
}
declare module nn {
    var COPYRIGHT: string;
    var AUTHOR: string;
    var ISHTML5: boolean;
    var ISNATIVE: boolean;
    var ISHTTPS: boolean;
    var APPICON: string;
    var APPNAME: string;
    var ISDEBUG: boolean;
    var VERBOSE: boolean;
    var APPVERSION: string;
    var PUBLISH: boolean;
}
declare module nn {
    enum ResPriority {
        NORMAL = 0,
        CLIP = 1,
    }
    let ResCurrentPriority: ResPriority;
    /** 使用UriSource均代表支持
        1, resdepo 的 key
        2, http/https:// 的远程url
        3, assets:// 直接访问资源目录下的文件
        4, <module>://<资源的key(命名方式和resdepto的默认一致)>
    */
    type UriSource = string;
    enum ResType {
        JSON = 0,
        TEXTURE = 1,
        TEXT = 2,
        FONT = 3,
        SOUND = 4,
        BINARY = 5,
        JSREF = 6,
    }
    let ResPartKey: string;
    type ResourceGroup = string;
    class ResourceEntity {
        constructor(src: UriSource, t: ResType);
        source: UriSource;
        type: ResType;
        readonly hashCode: number;
    }
    type ReqResource = ResourceGroup | ResourceEntity;
    abstract class CResCapsule extends SObject {
        constructor(reqres: ReqResource[]);
        dispose(): void;
        protected _initSignals(): void;
        private _isloading;
        load(cb?: () => void, ctx?: any): void;
        protected abstract loadOne(rr: ReqResource, cb: () => void, ctx: any): any;
        protected abstract total(): number;
        hashKey(): number;
        static HashKey(reqres: ReqResource[]): number;
        protected _total: number;
        protected _idx: number;
        protected _reqRes: Array<ReqResource>;
    }
    abstract class CResManager extends SObject {
        constructor();
        /** 是否支持多分辨率架构 */
        multiRes: boolean;
        /** Manager 依赖的目录名，其他资源目录均通过附加此目录来定位 */
        private _directory;
        directory: string;
        /** 加载一个资源配置 */
        abstract loadConfig(file: string, cb: (e: any) => void, ctx: any): any;
        /** 缓存控制 */
        cacheEnabled: boolean;
        /** 资源包管理 */
        abstract capsules(grps: ReqResource[]): CResCapsule;
        abstract removeCapsule(cp: CResCapsule): any;
        /** 一组资源是否已经加载 */
        abstract isGroupsArrayLoaded(grps: string[]): boolean;
        /** 尝试加载 */
        abstract tryGetRes(key: string): ICacheRecord;
        /** 异步加载资源，和 getRes 的区别不仅是同步异步，而且异步可以忽略掉 group 的状态直接加载资源*/
        abstract getResAsync(key: string, priority: ResPriority, cb: (rcd: ICacheRecord) => void, ctx?: any): any;
        /** 获取 key 对应资源 url */
        abstract getResUrl(key: string): string;
        /** 根据 src - type 的对照数组来加载资源数组 */
        getSources(srcs: [[string, ResType]], priority: ResPriority, cb: (ds: [ICacheRecord]) => void, ctx: any): void;
        /** 异步直接加载远程资源 */
        abstract getResByUrl(src: UriSource, priority: ResPriority, cb: (rcd: ICacheRecord | CacheRecord) => void, ctx: any, type: ResType): any;
        abstract hasAsyncUri(uri: UriSource): boolean;
        /** 根据类型来获得指定的资源 */
        getSourceByType(src: UriSource, priority: ResPriority, cb: (ds: ICacheRecord) => void, ctx: any, type: ResType): void;
        getJson(src: UriSource, priority: ResPriority, cb: (obj: ICacheRecord) => void, ctx: any): void;
        getText(src: UriSource, priority: ResPriority, cb: (obj: ICacheRecord) => void, ctx: any): void;
        getTexture(src: TextureSource, priority: ResPriority, cb: (tex: ICacheRecord) => void, ctx: any): void;
        getBitmapFont(src: FontSource, priority: ResPriority, cb: (fnt: ICacheRecord) => void, ctx: any): void;
        getSound(src: SoundSource, priority: ResPriority, cb: (snd: ICacheRecord) => void, ctx: any): void;
        getBinary(src: UriSource, priority: ResPriority, cb: (snd: ICacheRecord) => void, ctx: any): void;
    }
    /** 全局唯一的资源管理实体 */
    let ResManager: CResManager;
    /** 使用约定的方式获取资源名称 */
    class ResName {
        /** 普通 */
        static normal(name: string): string;
        /** 高亮 */
        static hl(name: string): string;
    }
}
declare module nn.svc {
    enum Feature {
        SHARE = 0,
        PAY = 1,
        LOGIN = 2,
        SWITCHUSER = 3,
        PROFILE = 4,
        AUTH = 5,
        LOGOUT = 6,
        REPORT = 7,
        LOADING = 8,
        GETAPP = 9,
        BIND = 10,
        SUBSCRIBE = 11,
        DESKTOP = 12,
        BBS = 13,
        STATUS = 14,
        CUSTOMER = 15,
        LANZUAN = 16,
    }
    enum Platform {
        XHB = 0,
        WANBA = 1,
        QQGAME = 2,
        QQBROWSER = 3,
        X360 = 4,
        X360ZS = 5,
        MOCK = 6,
    }
    abstract class Content implements ISObjectWrapper {
        signals: Signals;
        attach: (obj: any) => void;
        dispose: () => void;
        data: jsonobj;
        proc: string;
    }
    /** 支付的数据 */
    class PayContent extends Content {
        /** 支付的项目 */
        product: any;
        proc: string;
    }
    /** 分享的数据 */
    class ShareContent extends Content {
        /** 分享出去的链接 */
        url: string;
        /** 分享出去的图片 */
        image: string;
        /** 分享出去的标题 */
        title: string;
        /** 分享出去的内容 */
        detail: string;
        proc: string;
    }
    /** 登陆到sdk, 一些SDK的特殊要求也放在这里面处理 */
    class LoginContent extends Content {
        /** S2S 拿到用户id */
        pid: numstr;
        /** 客服系统缓存历史消息的最大条目 */
        maxCustomerMessages: number;
        proc: string;
    }
    /** 第三方平台上的用户信息 */
    class ProfileContent extends Content {
        /** 是否已经登录 */
        islogin: boolean;
        /** 头像地址 */
        avatar: string;
        /** 昵称 */
        nickname: string;
        proc: string;
    }
    /** 状态 */
    class StatusContent extends Content {
        /** 是否运行在微端中 */
        appmode: boolean;
        /** 已经绑定手机 */
        phone: boolean;
        /** 已经关注 */
        subscribe: boolean;
        /** 当前的货币单位 */
        monetaryName: string;
        /** 当前的货币汇率 */
        monetaryRate: number;
        /** 是否有折扣
            @note 如果是null，则代表没有折扣，!null 则为具体的折扣数值
        */
        monetaryDiscount: number;
        /** 兑换 */
        excharge(v: number): number;
        proc: string;
    }
    /** 登出 */
    class LogoutContent extends Content {
        proc: string;
    }
    /** 切换账号 */
    class SwitchUserContent extends Content {
        proc: string;
    }
    /** 加载进度 */
    class LoadingContent extends Content {
        constructor(t: number, c: number);
        total: number;
        current: number;
        proc: string;
    }
    /** 授权信息 */
    class AuthContent extends Content {
        /** 游戏在渠道的标志 */
        app: string;
        /** 授权的id */
        pid: numstr;
        /** 渠道号 */
        channel: number;
        /** 授权类型 */
        type: number;
        /** 授权key */
        key: string;
        /** 凭据 */
        ticket: string;
        /** 时间戳 */
        timestamp: string;
        /** 随机串 */
        nonce: string;
        /** 授权签名 */
        signature: string;
        /** 授权的平台代号 */
        platform: Platform;
        /** 让sdk可以调用到游戏的通用对话框 */
        alert: (data: {
            msg: string;
            title?: string;
            done: () => void;
        }) => void;
        confirm: (data: {
            msg: string;
            title?: string;
            done: () => void;
            cancel?: () => void;
        }) => void;
        prompt: (data: {
            msg?: string;
            title?: string;
            placeholder?: string;
            done: (val: string) => void;
            cancel?: () => void;
        }) => void;
        proc: string;
    }
    /** 游戏汇报信息 */
    enum ReportType {
        LOGIN = 0,
        ROLE = 1,
        UPGRADE = 2,
        PROGRESS = 3,
        SCORE = 4,
    }
    /** 提交信息 */
    class ReportContent extends Content {
        type: ReportType;
        roleId: numstr;
        nickname: string;
        region: numstr;
        server: numstr;
        level: number;
        viplevel: number;
        score: number;
        newuser: boolean;
        progress: numstr;
        proc: string;
    }
    /** 绑定手机 */
    class BindContent extends Content {
        /** 请求绑定了手机 */
        phone: boolean;
        proc: string;
    }
    /** 打开论坛 */
    class BBSContent extends Content {
        proc: string;
    }
    /** 添加关注 */
    class SubscribeContent extends Content {
        /** 请求关注 */
        subscribe: boolean;
        proc: string;
    }
    /** 下载微端 */
    class GetAppContent extends Content {
        proc: string;
    }
    /** 保存到桌面 */
    class SendToDesktopContent extends Content {
        proc: string;
    }
    class LanZuanContent extends Content {
        proc: string;
    }
    class LanZuanXuFeiContent extends Content {
        notifyUrl: string;
        proc: string;
    }
    let SignalMessagesGot: string;
    let SignalStatusChanged: string;
    class Message {
        id: number;
        /** 内容 */
        message: string;
        /** 发送人的名字 */
        senderName: string;
    }
    /** 打开客服系统 */
    class CustomerContent extends Content {
        /** 拉取所有的 */
        all: boolean;
        proc: string;
    }
    /** 发送客服聊天
        @note 基类的参数就不需要传了
     */
    class SendCustomerContent extends CustomerContent {
        /** 发送的消息 */
        message: string;
        /** 用户等级 */
        level: number;
        viplevel: number;
    }
    abstract class Service extends SObject {
        constructor();
        _initSignals(): void;
        /** 查询是否支持该功能 */
        support(feature: Feature): boolean;
        /** 调用功能 */
        fetch(c: svc.Content): void;
        /** 支付 */
        abstract pay(c: svc.PayContent): any;
        /** 检查支付条件 */
        abstract payable(price: number): boolean;
        /** 分享 */
        abstract share(c: svc.ShareContent): any;
        /** 获得登录的信息 */
        abstract profile(c: svc.ProfileContent): any;
        /** 登录 */
        abstract login(c: svc.LoginContent): any;
        /** 授权动作 */
        abstract auth(c: svc.AuthContent): any;
        /** 汇报 */
        abstract report(c: svc.ReportContent): any;
        /** 加载进度 */
        abstract loading(c: svc.LoadingContent): any;
        /** 下载微端 */
        abstract getapp(c: svc.GetAppContent): any;
        /** 保存到桌面 */
        abstract sendtodesktop(c: svc.SendToDesktopContent): any;
        /** 登出 */
        abstract logout(c: svc.LogoutContent): any;
        /** 切换账号 */
        abstract switchuser(c: svc.SwitchUserContent): any;
        /** 绑定 */
        abstract bind(c: svc.BindContent): any;
        /** 关注 */
        abstract subscribe(c: svc.SubscribeContent): any;
        /** 状态 */
        abstract status(c: svc.StatusContent): any;
        /** 打开论坛 */
        abstract bbs(c: svc.BBSContent): any;
        /** 打开客服系统 */
        abstract customer(c: svc.CustomerContent): any;
        /** 蓝钻*/
        abstract lanzuan(c: svc.LanZuanContent): any;
        /** 蓝钻续费*/
        abstract lanzuanxufei(c: svc.LanZuanXuFeiContent): any;
        /** 服务的唯一标示 */
        static ID: string;
        static QQAPPID: string;
        /** 服务的描述 */
        static DESCRIPTION: {
            NAME: string;
            CONTACT: string;
        };
        /** 通常第三方服务需要异步load各自平台的SDK，所以需要在调用功能前保证SDK已经加载完毕 */
        static prepared: boolean;
        static Prepare(cb: () => void, ctx: any): void;
        toString(): string;
    }
    class Signature {
        /** 需要签名的内容 */
        content: any;
        /** 签名成功
            @data 签名得到的数据
         */
        next(data: string): void;
        cb: (data: any) => void;
        ctx: any;
    }
}
declare module nn {
    abstract class ServicesManager extends SObject {
        constructor();
        protected _initSignals(): void;
        dispose(): void;
        /** 注册可用的service列表
            @note 默认manager会遍历当前可用的第一个service
        */
        static register(cls: any): void;
        static _SERVICES: any[];
        /** 绑定平台的签名接口
            @note 部分平台需要对参数进行加密后再传回去，所以需要提供一个签名函数
        */
        bindSignature(fun: (cnt: svc.Signature) => void, ctx?: any): void;
        /** 调用签名
            @note 和bind配对使用 */
        signature(cnt: any, cb: (data: any) => void, ctx?: any): void;
        protected _sigfun: (cnt: svc.Signature) => void;
        protected _sigctx: any;
        /** 初始化
            @note app需要重载该函数实现不同渠道，不同service
            @return 继承自 AbstractService 的类
        */
        abstract detectService(): any;
        private _service;
        readonly service: svc.Service;
        /** 获得支持的特性 */
        static support(feature: svc.Feature): boolean;
        /** 获取第三方的数据 */
        static fetch(cnt: svc.Content, suc?: (s?: Slot) => void, ctx?: any): any;
        static fetch(cnt: svc.Content, suc?: (s?: Slot) => void, failed?: (s?: Slot) => void, ctx?: any): any;
        protected static doFetch(cnt: svc.Content, suc: (s?: Slot) => void, failed: (s?: Slot) => void, ctx: any): void;
        /** 设置成默认的实现
            @param cls 默认使用的服务类型，如果是null则使用manager选择的服务
        */
        setAsDefault(cls?: any): ServicesManager;
        private static _shared;
        static shared: ServicesManager;
    }
    class AnyServices extends ServicesManager {
        detectService(): any;
    }
}
declare module nn {
    class SlotTunnel {
        /** 是否请求中断了emit过程 */
        veto: boolean;
        /** 附加数据 */
        payload: any;
    }
    class Slot {
        /** 重定向的信号 */
        redirect: string;
        /** 回调 */
        cb: (e: Slot) => void;
        /** 回调的上下文 */
        target: any;
        /** 激发者 */
        sender: any;
        /** 数据 */
        data: any;
        /** 延迟s启动 */
        delay: number;
        /** 穿透用的数据 */
        tunnel: SlotTunnel;
        /** connect 时附加的数据 */
        payload: any;
        /** 信号源 */
        signal: string;
        /** 激发频率限制 (emits per second) */
        eps: number;
        private _epstms;
        /** 是否中断掉信号调用树 */
        private _veto;
        veto: boolean;
        /** 调用几次自动解绑，默认为 null，不使用概设定 */
        count: number;
        emitedCount: number;
        dispose(): void;
        toString(): string;
        /** 激发信号
            @data 附带的数据，激发后自动解除引用 */
        emit(data: any, tunnel: SlotTunnel): void;
        protected doEmit(): void;
        static Data(d: any): Slot;
    }
    class Slots {
        slots: Slot[];
        owner: any;
        signal: string;
        dispose(): void;
        /** 清空连接 */
        clear(): void;
        toString(): string;
        /** 阻塞信号
            @note emit被阻塞的信号将不会有任何作用
        */
        private _block;
        block(): void;
        unblock(): void;
        /** 是否已经阻塞 */
        isblocked(): boolean;
        /** 添加一个插槽 */
        add(s: Slot): void;
        /** 对所有插槽激发信号
            @note 返回被移除的插槽的对象
         */
        emit(data: any, tunnel: SlotTunnel): CSet<any>;
        disconnect(cb: (e: Slot) => void, target: any): boolean;
        find_connected_function(cb: (e: Slot) => void, target: any): Slot;
        find_redirected(sig: string, target: any): Slot;
        is_connected(target: any): boolean;
    }
    interface SignalsDelegate {
        _signalConnected(sig: string, s?: Slot): any;
    }
    class Signals {
        constructor(owner: any);
        private _slots;
        owner: any;
        delegate: SignalsDelegate;
        dispose(): void;
        clear(): void;
        toString(): string;
        /** 注册信号 */
        register(sig: string): void;
        protected avaslots(sig: string): Slots;
        /** 只连接一次 */
        once(sig: string, cb: (...p: any[]) => void, target: any): Slot;
        /** 连接信号插槽 */
        connect(sig: string, cb: (...p: any[]) => void, target: any): Slot;
        /** 该信号是否存在连接上的插槽 */
        isConnected(sig: string): boolean;
        /** 转发一个信号到另一个对象的信号 */
        redirect(sig: string, sig2: string, target: any): Slot;
        redirect(sig: string, target: any): Slot;
        /** 激发信号 */
        emit(sig: string, data?: any, tunnel?: SlotTunnel): void;
        /** 向外抛出信号
            @note 为了解决诸如金币变更、元宝变更等大部分同时发生的事件但是因为set的时候不能把这些的修改函数合并成1个函数处理，造成同一个消息短时间多次激活，所以使用该函数可以在下一帧开始后归并发出唯一的事件。所以该函数出了信号外不支持其他带参
        */
        cast(sig: string): void;
        private _castings;
        private _doCastings();
        /** 断开连接 */
        disconnectOfTarget(target: any, inv?: boolean): void;
        /** 断开连接 */
        disconnect(sig: string, cb?: (e: Slot) => void, target?: any): any;
        isConnectedOfTarget(target: any): boolean;
        /** 阻塞一个信号，将不响应激发 */
        block(sig: string): void;
        unblock(sig: string): void;
        isblocked(sig: string): boolean;
        private __invtargets;
        private __inv_connect(tgt);
        private __inv_disconnect(tgt);
    }
    class EventWeakDispatcher {
        private _slots;
        add<T>(idr: string, cb: (e: T) => void, cbctx: any): void;
        remove(idr: string): void;
        invoke<T>(idr: string, e: T, debug?: boolean): void;
        clear(): void;
    }
    class Reactors {
        private _slots;
        add<T>(cb: (e: T) => void, ctx: any): void;
        invoke<T>(e?: T): void;
        clear(): void;
    }
    function emit(obj: any, sig: string, data?: any): void;
    let SignalException: string;
    let SignalDone: string;
    let SignalSucceed: string;
    let SignalOk: string;
    let SignalTimeout: string;
    let SignalEnd: string;
    let SignalStart: string;
    let SignalExit: string;
    let SignalChanged: string;
    let SignalUpdated: string;
    let SignalPaused: string;
    let SignalResume: string;
    let SignalDataChanged: string;
    let SignalItemChanged: string;
    let SignalCancel: string;
    let SignalFailed: string;
    let SignalAdding: string;
    let SignalAdded: string;
    let SignalRemoving: string;
    let SignalRemoved: string;
    let SignalVisibleChanged: string;
    let SignalNeedRedo: string;
    let SignalNeedReload: string;
    let SignalNeedFlush: string;
    let SignalNewChanged: string;
    let SignalAction: string;
    let SignalSelected: string;
    let SignalDeselected: string;
    interface SelectionData {
        old: any;
        now: any;
    }
    let SignalSelectionChanged: string;
    let SignalSelectionChanging: string;
    let SignalLoaded: string;
    let SignalActivated: string;
    let SignalDeactivated: string;
    let SignalFocusGot: string;
    let SignalFocusLost: string;
    let SignalConstriantChanged: string;
    let SignalClicked: string;
    let SignalItemClicked: string;
    let SignalTouchBegin: string;
    let SignalTouchEnd: string;
    let SignalTouchMove: string;
    let SignalKeyPress: string;
    let SignalEnterKey: string;
    let SignalScrollBegin: string;
    let SignalScrollEnd: string;
    let SignalScrolled: string;
    let SignalHitTest: string;
    let SignalFrameChanged: string;
    let SignalStateChanged: string;
    let SignalOrientationChanged: string;
    let SignalOpening: string;
    let SignalOpen: string;
    let SignalClosing: string;
    let SignalClose: string;
}
declare module nn {
    type SoundSource = UriSource | COriginType;
    /** 音频播放 */
    abstract class CSoundPlayer extends SObject {
        constructor();
        protected _initSignals(): void;
        /** 播放次数，-1代表循环 */
        count: number;
        /** 音频的组名 */
        resourceGroups: string[];
        /** 是否可用 */
        enable: boolean;
        /** 自动恢复播放状态 */
        autoRecovery: boolean;
        /** 音频文件的名称, 一个player只能对应一个声音，如过已经设置，则报错 */
        abstract setMediaSource(ms: string): any;
        /** 暂停或者播放到的位置 */
        position: number;
        playingState: WorkState;
        /** 开始播放 */
        abstract play(): any;
        /** 重新播放 */
        abstract replay(): any;
        /** 暂停 */
        abstract pause(): any;
        /** 恢复 */
        abstract resume(): any;
        /** 停止 */
        abstract stop(): any;
        /** 打断播放 */
        abstract breakee(): any;
        readonly isPlaying: boolean;
        readonly isPaused: boolean;
    }
    class SoundTrack extends SObject {
        constructor();
        /** 播放次数，-1代表无限循环 */
        count: number;
        /** 同时只能有一个在播放 */
        solo: boolean;
        /** 用以实现player的类对象 */
        classForPlayer: typeof SoundPlayer;
        /** 自动恢复 */
        _autoRecovery: boolean;
        autoRecovery: boolean;
        /** 资源组 */
        resourceGroups: string[];
        /** 可用状态 */
        _enable: boolean;
        enable: boolean;
        /** 获取一个播放器 */
        player(name: string, ...groups: string[]): SoundPlayer;
        /** 实例化一个播放器，播放完成后会自动清掉 */
        acquire(name: string, ...groups: string[]): SoundPlayer;
        protected _sounds: KvObject<string, SoundPlayer>;
        private _soloplayer;
        private __cb_play(s);
        /** 播放全部 */
        play(): void;
        /** 停止全部 */
        stop(): void;
        private __app_activate_enable;
        _app_actived(): void;
        _app_deactived(): void;
    }
    abstract class CSoundManager extends SObject {
        constructor();
        protected _tracks: KvObject<any, SoundTrack>;
        /** 默认资源组 */
        resourceGroups: string[];
        /** 获取到指定音轨 */
        track(idr: string): SoundTrack;
        /** 背景音轨　*/
        background: SoundTrack;
        /** 效果音轨 */
        effect: SoundTrack;
        /** 可用 */
        enable: boolean;
    }
    let SoundManager: CSoundManager;
}
declare module nn {
    interface ITableDataSource {
        /** 多少行 */
        numberOfRows(): number;
        /** 对应行的类型 */
        classForRow(row: number): any;
        /** 行高 */
        heightForRow(row: number): number;
        /** 设置该行 */
        updateRow(item: any, cell: TableViewCell, row: number): any;
    }
    /** 对于可以调整高度，或者存在 ui 和 data 重入的问题，通过这个参数来分别判断是 UI 过程还是 DATA 过程
     * @brief 例如在 tableview 中应用时，如果是变高，则 updateData 会重入2次，一次是 UI 过程(粗布局)，一次是 DATA 过程(刷数据显示)，之后就可以拿到实高，但是 updateData 里面会有例如设置图片的操作，而这些操作仅需要在 UI 过程中被调用，所以可以通过该变量区分开
     */
    let DATAUPDATE: boolean;
    class TableViewCell extends Sprite {
        constructor();
        static FromItem(cv: CComponent): TableViewCell;
        _item: any;
        item: any;
        updateData(): void;
        updateLayout(): void;
        _row: number;
        row: number;
    }
    class TableViewContent extends ScrollView {
        constructor();
        protected _initSignals(): void;
        dispose(): void;
        /** 是否支持重用的模式
            @note 关闭重用的好处：固定列表的大小，不需要考虑item重入的问题
        */
        reuseMode: boolean;
        /** 默认的的行显示类型 */
        rowClass: any;
        /** 默认的cell类型 */
        cellClass: typeof TableViewCell;
        /** 默认的行高 */
        rowHeight: number;
        /** 是否横向 */
        horizonMode: boolean;
        /** 数据代理 */
        dataSource: ITableDataSource;
        /** 间距 */
        spacing: number;
        updateLayout(): void;
        _headerEdgeInsets: EdgeInsets;
        headerEdgeInsets: EdgeInsets;
        _footerEdgeInsets: EdgeInsets;
        footerEdgeInsets: EdgeInsets;
        _additionEdgeInsets: EdgeInsets;
        additionEdgeInsets: EdgeInsets;
        _topIdentifierEdgeInsets: EdgeInsets;
        topIdentifierEdgeInsets: EdgeInsets;
        _bottomIdentifierEdgeInsets: EdgeInsets;
        bottomIdentifierEdgeInsets: EdgeInsets;
        protected _updateEdgeInsets(): void;
        clear(): void;
        reloadData(): void;
        protected addOneReuseItem(item: any): void;
        protected getOneReuseItem(type: any): any;
        protected instanceItem(type: any): any;
        /** 查找指定的单元格 */
        findCell(row?: number): TableViewCell;
        /** 滚动到指定单元格 */
        scrollToCell(idx: number, duration?: number, edge?: EDGE): void;
        /** 滚动到指定位置 */
        scrollToPos(pos: number, duration?: number): void;
        /** 获取所有可见的单元格 */
        readonly visibledCells: Array<TableViewCell>;
        protected useCell(row: number): TableViewCell;
        protected unuseCell(cell: TableViewCell): void;
        protected popUsedCell(): void;
        protected updateRow(item: any, cell: TableViewCell, row: number): void;
        protected _updateConstriant(s: Slot): void;
        protected _updateValidCells(update: any): void;
        private _usedCells;
        private _unusedCells;
        private _rowHeights;
        private _reuseItems;
        onPositionChanged(): void;
        /** 表头 */
        protected _headerView: Component;
        headerView: Component;
        /** 表尾 */
        protected _footerView: Component;
        footerView: Component;
        protected _layoutViews(): void;
    }
    class TableView extends Sprite implements ITableDataSource {
        constructor();
        static FromItem(cv: CComponent): TableView;
        protected instanceTable(): TableViewContent;
        protected _table: TableViewContent;
        readonly table: TableViewContent;
        classForRow(row: number): any;
        heightForRow(row: number): number;
        updateRow(item: any, cell: TableViewCell, row: number): void;
        numberOfRows(): number;
        updateLayout(): void;
    }
}
declare module nn {
    abstract class CDom extends Component {
        /** html源代码 */
        text: string;
    }
}
declare module eui {
    class ButtonU extends eui.Button implements eui.IItemRenderer {
        slots: string;
        tag: any;
        onPartBinded(name: string, target: any): void;
        goBack(): void;
        playAnimate(ani: Animate, idr?: any): Animate;
        findAnimate(idr: any): Animate;
        stopAnimate(idr: any): void;
        stopAllAnimates(): void;
        exhibition: boolean;
        protected _help: any;
        help: any;
        belong: any;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        _signalConnected(sig: string, s?: nn.Slot): void;
        /** 点击频度限制 */
        eps: number;
        private __cmp_tap(e);
        protected _getLabel(): Label;
        childrenCreated(): void;
        private _data;
        data: any;
        text: string;
        private _textColor;
        textColor: number;
        private _itemIndex;
        itemIndex: number;
        private _value;
        value: any;
        private _format;
        format: string;
        private _selected;
        selected: boolean;
        getCurrentState(): string;
        /** 刷新选中状态 */
        updateSelection(): void;
        /** 刷新数据 */
        updateData(): void;
        /** 隶属的栈 */
        viewStack: IViewStack;
        convertPointTo(pt: nn.Point, sp: egret.DisplayObject | nn.CComponent): nn.Point;
        convertRectTo(rc: nn.Rect, sp: egret.DisplayObject | nn.CComponent): nn.Rect;
        frame: nn.Rect;
        onAppeared(): void;
        onDisappeared(): void;
        onVisibleChanged(): void;
        $setVisible(b: boolean): boolean;
        source: string | egret.Texture;
    }
}
declare module eui {
    class CheckBoxU extends eui.CheckBox {
        slots: string;
        tag: any;
        onPartBinded(name: string, target: any): void;
        goBack(): void;
        playAnimate(ani: Animate, idr?: any): Animate;
        findAnimate(idr: any): Animate;
        stopAnimate(idr: any): void;
        stopAllAnimates(): void;
        exhibition: boolean;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        _signalConnected(sig: string, s?: nn.Slot): void;
        private __cb_changed();
        text: string;
        private _value;
        value: any;
        private _format;
        format: string;
    }
}
declare module eui {
    class _EUIDataGroupExt {
        static onPartBinded(self: any, name: string, target: any): void;
        private __imp_updateitem;
        static Selecting(tgt: any): ItemInfo;
        static Selected(tgt: any): ItemInfo;
        static GetChanging(tgt: any): SelectionInfo;
    }
}
declare module eui {
    /** 用来提供设置参数 */
    class DesktopU extends eui.ComponentU {
        static IDRKEY: string;
        constructor();
        /** 弹出的形式 */
        popupMode: boolean;
        /** 点击即关闭 */
        clickedToClose: boolean;
        /** 满屏幕显示 */
        fullSize: boolean;
        /** 转换 */
        static FromView(e: egret.DisplayObject): nn.Desktop;
    }
    class DialogU extends eui.SpriteU {
        constructor();
        dispose(): void;
        /** 桌面的颜色 */
        desktopBackgroundColor: nn.Color;
        /** 获得视图隶属的dialog对象 */
        static FromView(cv: egret.DisplayObject): DialogU;
        protected _initSignals(): void;
        childrenCreated(): void;
        onLoaded(): void;
        /** 全局设置所有的弹出特效 */
        static AnimateOpen: Animate;
        static AnimateClose: Animate;
        /** 对象相关的弹出特效, 默认为 undefine，如果设置成null，则为不使用全局特效 */
        private _animateOpen;
        animateOpen: Animate;
        private _animateClose;
        animateClose: Animate;
        /** 弹出的模式
            @note true为弹出对话框，不会隐藏后面的内容；false则push到对应的viewstack中，隐藏之前的页面
        */
        popupMode: boolean;
        /** 点击关闭 */
        clickedToClose: boolean;
        /** 满屏幕 */
        fullSize: boolean;
        /** 依赖的队列 */
        queue: nn.OperationQueue;
        /** 是否可以穿透触摸 */
        onlyFiltersTouchEnabled: boolean;
        protected instanceDesktop(): nn.Desktop;
        _filters: nn.CSet<nn.CComponent>;
        addFilter(ui: UiType): void;
        updateFilters(): void;
        replace(link: Component): nn.Desktop;
        open(queue?: boolean): nn.Desktop;
        follow(link: Component): nn.Desktop;
        goBack(): void;
        close(): void;
        bestFrame(): nn.Rect;
        bestPosition(): nn.Point;
    }
}
declare module eui {
    class DivU extends eui.Group {
        slots: string;
        tag: any;
        onPartBinded(name: string, target: any): void;
        goBack(): void;
        constructor();
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        _signalConnected(sig: string, s?: nn.Slot): void;
        private _div;
        createChildren(): void;
        commitProperties(): void;
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        private _text;
        text: string;
    }
}
declare module eui {
}
declare module eui {
    class GroupU extends eui.Group {
        slots: string;
        tag: any;
        onPartBinded(name: string, target: any): void;
        goBack(): void;
        playAnimate(ani: Animate, idr?: any): Animate;
        findAnimate(idr: any): Animate;
        stopAnimate(idr: any): void;
        stopAllAnimates(): void;
        exhibition: boolean;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        private _touch;
        readonly touch: nn.Touch;
        _signalConnected(sig: string, s?: nn.Slot): void;
        private __dsp_touchbegin(e);
        private __dsp_touchend(e);
        private __dsp_touchrelease(e);
        private __dsp_touchmove(e);
        private __dsp_tap(e);
        selected: boolean;
        enabled: boolean;
        interactiveEnabled: boolean;
        frame: nn.Rect;
        onAppeared(): void;
        onDisappeared(): void;
    }
}
declare module eui {
    class HtmlLabelU extends eui.Label {
        slots: string;
        tag: any;
        onPartBinded(name: string, target: any): void;
        goBack(): void;
        playAnimate(ani: Animate, idr?: any): Animate;
        findAnimate(idr: any): Animate;
        stopAnimate(idr: any): void;
        stopAllAnimates(): void;
        exhibition: boolean;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        _signalConnected(sig: string, s?: nn.Slot): void;
        private _htmlText;
        text: string;
        private _value;
        value: any;
        private _format;
        format: string;
        private _links;
        href(re: RegExp, cb: (url: string) => void, ctx?: any): void;
        private __lbl_link(e);
    }
}
declare module eui {
    class ImageU extends eui.Image {
        slots: string;
        tag: any;
        onPartBinded(name: string, target: any): void;
        goBack(): void;
        playAnimate(ani: Animate, idr?: any): Animate;
        findAnimate(idr: any): Animate;
        stopAnimate(idr: any): void;
        stopAllAnimates(): void;
        exhibition: boolean;
        clipBounds: nn.Rect;
        constructor();
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
        /** 业务有时候会使用image来代替button，所以提供selected设置 */
        selected: boolean;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        _signalConnected(sig: string, s?: nn.Slot): void;
        private __cmp_tap(e);
        source: string;
        private _imageSource;
        imageSource: nn.TextureSource;
        protected _setTexture(tex: egret.Texture): void;
        protected _getTexture(): egret.Texture;
        private _value;
        value: any;
        private _format;
        format: string;
        bestFrame(inrc?: nn.Rect): nn.Rect;
        frame: nn.Rect;
        onAppeared(): void;
        onDisappeared(): void;
        updateCache(): void;
    }
}
declare module eui {
    class ItemRendererU extends eui.ItemRenderer {
        slots: string;
        tag: any;
        onPartBinded(name: string, target: any): void;
        goBack(): void;
        /** 隶属于的控件，可以方便业务层的数据穿透 */
        belong: any;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
    }
}
declare module eui {
    class LabelU extends eui.Label {
        slots: string;
        tag: any;
        onPartBinded(name: string, target: any): void;
        goBack(): void;
        playAnimate(ani: Animate, idr?: any): Animate;
        findAnimate(idr: any): Animate;
        stopAnimate(idr: any): void;
        stopAllAnimates(): void;
        exhibition: boolean;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        _signalConnected(sig: string, s?: nn.Slot): void;
        private _value;
        value: any;
        private _format;
        format: string;
    }
}
declare module eui {
}
declare module eui {
    class ListU extends eui.List {
        belong: any;
        slots: string;
        onPartBinded(name: string, target: any): void;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        _signalConnected(sig: string, s?: nn.Slot): void;
        private __lst_selchanged(e);
        private __lst_selchanging(e);
        private __lst_itemtap(e);
        scrollTo(pt: nn.Point): void;
        scrollToItem(idx: number, edge: nn.EDGE): void;
        protected _data: any;
        data: any;
        updateData(): void;
        reload(): void;
        dataProviderRefreshed(): void;
        private __imp_updateitem;
        updateRenderer(renderer: eui.IItemRenderer, itemIndex: number, data: any): eui.IItemRenderer;
        protected itemAdded(item: any, idx: number): void;
        protected itemRemoved(item: any, idx: number): void;
        /** 可以在这里面判断item的实例
        addChild(c:egret.DisplayObject):egret.DisplayObject {
            let r = super.addChild(c);
            if (r instanceof this.itemRenderer)
                ............
            return r;
        }
        */
        /** 获得指定的元素 */
        getItem(idx: number): eui.IItemRenderer;
    }
}
declare module eui {
    class MovieClipU extends eui.Group {
        slots: string;
        tag: any;
        constructor();
        onPartBinded(name: string, target: any): void;
        goBack(): void;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        _signalConnected(sig: string, s?: nn.Slot): void;
        private __cmp_tap(e);
        private _sourceChanged;
        /** 资源名称 */
        private _clipName;
        clipName: string;
        /** 素材资源 */
        private _textureSource;
        textureSource: string;
        /** 配置资源 */
        private _frameSource;
        frameSource: string;
        /** 播放次数 */
        playCount: number;
        /** 自动播放 */
        autoPlay: boolean;
        /** 是否使用flash中设定的锚点 */
        flashMode: boolean;
        /** 填充模式 */
        fillMode: number;
        /** 调整序列帧的对齐位置 */
        clipAlign: number;
        /** 切换clipSource时清空原来的clip */
        clearOnChanging: boolean;
        private _hmc;
        private mc();
        createChildren(): void;
        commitProperties(): void;
        clipSource: nn.ClipConfig;
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /** 播放 */
        play(): void;
        /** 停止 */
        stop(): void;
    }
}
declare module eui {
    class NavigationU extends eui.ComponentU implements eui.IViewStack {
        constructor();
        readonly signals: nn.Signals;
        private _imp;
        protected createImp(): void;
        rootPopable: boolean;
        updateLayout(): void;
        topView(): ComponentU;
        topIndex(): number;
        push(ui: ComponentU): void;
        goBack(): void;
        pop(): void;
        pages(): ComponentU[];
    }
}
declare module eui {
    class PanelU extends eui.Panel {
        onPartBinded(name: string, target: any): void;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
    }
}
declare module eui {
    class ProgressBarU extends eui.ProgressBar {
        onPartBinded(name: string, target: any): void;
        private _percent;
        percent: nn.Percentage;
        /** 通过设置一个格式化脚本来设置显示的文字格式 */
        private _format;
        format: string;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
        protected _data: any;
        data: any;
        updateData(): void;
    }
}
declare module eui {
    class RadioButtonU extends eui.RadioButton {
        onPartBinded(name: string, target: any): void;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
    }
}
declare module eui {
    class RectU extends eui.Rect {
        paint(gra: nn.CGraphics): void;
        onPartBinded(name: string, target: any): void;
        onAppeared(): void;
        onDisappeared(): void;
        updateCache(): void;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
    }
    class RoundU extends RectU {
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
    }
}
declare module eui {
    class ScrollerU extends eui.Scroller {
        onPartBinded(name: string, target: any): void;
        static FromView(e: egret.DisplayObject): ScrollerU;
        scrollToEdge(e: egret.DisplayObject, edge: nn.EDGE): void;
        contentOffset: nn.Point;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
    }
}
declare module eui {
    class TabBarU extends eui.TabBar {
        slots: string;
        onPartBinded(name: string, target: any): void;
        constructor();
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        _signalConnected(sig: string, s?: nn.Slot): void;
        selectedIndex: number;
        private __lst_selchanged();
        private __lst_selchanging(e);
        private _data;
        data: any;
        reload(): void;
        private __imp_updateitem;
        updateRenderer(renderer: eui.IItemRenderer, itemIndex: number, data: any): eui.IItemRenderer;
        pageStack: PageStackU;
    }
}
declare module nn {
    class CoreApplication extends EgretApp {
        constructor();
        /** 设置根页面 */
        root: CComponent;
    }
}
declare module eui {
    class TextAreaU extends eui.EditableText {
        slots: string;
        tag: any;
        constructor();
        onPartBinded(name: string, target: any): void;
        value: string;
        exhibition: boolean;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        _signalConnected(sig: string, s?: nn.Slot): void;
        private __txt_changed();
        private __txt_focusin();
        private __txt_focusout();
        readonly: boolean;
    }
}
declare module eui {
    class TextInputU extends eui.TextInput {
        slots: string;
        tag: any;
        constructor();
        onPartBinded(name: string, target: any): void;
        value: numstr;
        exhibition: boolean;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        _signalConnected(sig: string, s?: nn.Slot): void;
        private __txt_changed();
        private __txt_focusin();
        private __txt_focusout();
        private __txt_keypress(s);
        private _need_fix_textadapter;
        readonly: boolean;
    }
}
declare module eui {
    class ToggleSwitchU extends eui.ToggleSwitch {
        onPartBinded(name: string, target: any): void;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
    }
}
declare module eui {
    class PageStackU extends eui.ViewStack {
        onPartBinded(name: string, target: any): void;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
    }
}
declare module eui {
    class WrapperU extends eui.ComponentU {
        private _content;
        content: ComponentU;
    }
}
declare class ThemeAdapter implements eui.IThemeAdapter {
    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    getTheme(url: string, compFunc: Function, errorFunc: Function, thisObject: any): void;
}
declare module nn {
    interface ICollectionDataSource {
        /** 元素总数目 */
        numberOfItems(): number;
        /** 元素的类型 */
        classForItem(idx: number): any;
        /** 空白元素的类型 */
        classForNullItem(): any;
        /** 更新元素 */
        updateItem(item: CComponent, idx: number): any;
        /** 更新空元素 */
        updateNullItem(item: CComponent): any;
    }
    abstract class CollectionView extends Sprite implements ICollectionDataSource {
        constructor();
        /** 数据源 */
        dataSource: ICollectionDataSource;
        /** 元素的默认类型 */
        itemClass: any;
        numberOfItems(): number;
        classForItem(idx: number): any;
        classForNullItem(): any;
        updateItem(item: CComponent, idx: number): void;
        updateNullItem(item: CComponent): void;
        /** 空余元素 */
        nullItemClass: any;
        /** 重新加载数据 */
        abstract reloadData(): any;
        /** 弹出一个元素 */
        protected popUsedItem(): void;
        /** 拿出一个元素 */
        protected useItem(...p: any[]): CComponent;
        /** 放回去一个元素 */
        protected unuseItem(item: CComponent): void;
        updateLayout(): void;
    }
    /** 类似于iTunes Coverflow的效果 */
    abstract class CoverFlowView extends CollectionView {
        constructor();
        dispose(): void;
        protected _initSignals(): void;
        /** 最多屏幕上出现的个数 */
        maxItemsOnScreen: number;
        /** 选中那个 */
        selection: number;
        /** 触发器的尺寸 */
        thresholdSize: Size;
        /** 自动停靠
            @note 交互一办抬起手指后，是否自动对齐
         */
        autoDock: boolean;
        reloadData(): void;
        protected popUsedItem(idx?: number): void;
        protected clear(): void;
        protected useItem(cls: any, end: boolean): CComponent;
        protected unuseItem(item: CComponent): void;
        /** 根据位置更新尺寸 */
        updateItemSize(item: CComponent, idx: number, pos: number): void;
        /** 一次性刷新所有尺寸 */
        updateItemsSize(items: Array<CComponent>, idx: number): void;
        /** 打开下一个 */
        gotoNext(): boolean;
        /** 打开上一个 */
        gotoPrevious(): boolean;
        /** 用来测试能否运行goto，如果是false那么touch将被跳掉 */
        canGoto(): boolean;
        protected _updateItems(updateData: boolean): void;
        protected instanceItem(cls: any): any;
        private _minIndex;
        private _allItems;
        private _nullItems;
        private _usedItems;
        private _reuseItems;
        offsetPos: Point;
        private _startPos;
        private _cv_touch_begin();
        private _cv_touch_move();
        private _cv_touch_end();
    }
}
declare module nn {
    let FontFilePattern: RegExp;
    let FontKeyPattern: RegExp;
    class _FontsManager {
        add(name: string, url: string): void;
        protected _doAddH5Font(name: string, url: string): void;
        private _fonts;
        private _dfonts;
        font(name: string): string;
    }
    let FontsManager: _FontsManager;
    class FontConfig {
        /** 字体名称 */
        family: string;
        name: string;
        /** 位图字体的贴图 */
        texture: UriSource;
        /** 位图字体的配置 */
        config: UriSource;
        static Font(family: string): FontConfig;
        static Bitmap(name: string): FontConfig;
        static Bitmap(texture: string, config: string): FontConfig;
    }
    type FontSource = FontConfig | UriSource | COriginType;
}
declare module nn {
    class HttpConnector extends CHttpConnector {
        constructor();
        dispose(): void;
        protected _initSignals(): void;
        _signalConnected(sig: string, s?: Slot): void;
        private _imp;
        start(): void;
        useCredentials(): void;
        private __cnt_completed(e);
        private __cnt_error(e);
        private _prg;
        private __cnt_progress(e);
    }
}
declare module nn {
    class _FramesManager extends CFramesManager {
        launch(c: egret.DisplayObject): void;
        protected onPrepare(): void;
        private __invalidating;
        invalidate(): void;
    }
}
declare module nn {
}
declare module nn {
    /** 用来将标准对象包装成业务对象 */
    class BridgedComponent extends Component {
        constructor(tgt: any);
        static Wrapper(tgt: any): BridgedComponent;
        static FromImp(tgt: any): BridgedComponent;
        protected createImp(): void;
        readonly signals: Signals;
        protected _initSignals(): void;
        readonly descriptionName: string;
        bestFrame(): Rect;
        bestPosition(): Point;
        updateCache(): void;
        grab(): void;
        drop(): void;
        onAppeared(): void;
        onDisappeared(): void;
    }
}
declare module nn {
    /** 连续图片（背景） */
    class ContinuousBitmap extends Widget {
        constructor();
        private _bmpn;
        private _bmpb;
        imageSource: TextureSource;
        updateLayout(): void;
        /** 方向，先默认实现为水平 */
        direction: Direction;
        private _pos;
        /** 偏移的距离 */
        offset(v: number): void;
        /** 直接设置位置 */
        position(v: number): void;
    }
}
declare module nn {
    class Gesture extends SObject implements IGesture {
        constructor();
        dispose(): void;
        protected _initSignals(): void;
        attach(spr: Component): void;
        protected doAttach(): void;
        detach(): void;
        protected doDetach(): void;
        protected _spr: Component;
    }
    class GestureTap extends Gesture {
        constructor();
        protected doAttach(): void;
        protected doDetach(): void;
        private __cb_tap();
        /** 统计次数 */
        count: number;
        /** 多少时间清空一次 */
        interval: number;
        private _tms;
    }
    class GestureLongTap extends Gesture {
        constructor(duration?: number);
        dispose(): void;
        duration: number;
        protected doAttach(): void;
        protected doDetach(): void;
        _tmr: SysTimer;
        private __cb_touchbegin();
        private __cb_touchend(s);
        private __cb_touchmove();
        private __cb_timer();
    }
    class GestureRecognizer extends SObject {
        constructor();
        protected _initSignals(): void;
        /** 上次位置、当前位置 */
        lastPosition: Point;
        currentPosition: Point;
        /** 上次时间、当前时间 */
        lastTime: number;
        currentTime: number;
        /** 增量 */
        deltaPosition: Point;
        deltaTime: number;
        /** 变动次数 */
        stat: number;
        /** 加速度 */
        velocity: Point;
        /** 最小间隔时间 */
        thresholdInterval: number;
        /** 重置 */
        reset(): void;
        /** 移动一次位置 */
        addPosition(x: number, y: number): void;
        protected doPosition(): void;
        /** 主方向 */
        majorDirection(threshold?: Point): Direction;
    }
    class GestureSwipe extends Gesture {
        constructor();
        protected doAttach(): void;
        protected doDetach(): void;
        private __cb_touchbegin(s);
        private __cb_touchend(s);
        _recognizer: GestureRecognizer;
        direction: Direction;
    }
}
declare module nn {
    class BitmapLabel extends CBitmapLabel {
        constructor();
        protected _lbl: any;
        updateLayout(): void;
        private _fontSize;
        private _fontScale;
        fontSize: number;
        characterSpacing: number;
        lineSpacing: number;
        text: string;
        private _fontSource;
        fontSource: FontSource;
    }
}
declare module nn {
    class Font {
        static sizeOfString(str: string, fontSize: number, width: number, height: number): Size;
        static sizeFitString(str: string, fontSize: number, width: number, height: number, lineSpacing: number): Size;
    }
}
declare module nn {
    class _BonesManager extends SObject {
        constructor();
        /** 使用Fast加速骨骼动画 */
        turboMode: boolean;
        /** 默认骨骼的帧速 */
        fps: number;
        protected _factory: dragonBones.EgretFactory;
        instance(cfg: BoneConfig, cb: (bn: BoneData) => void, ctx?: any): void;
        protected instanceOne(character: string, skeleton: string, place: string, texture: string, fps: number, cb: (d: BoneData) => void, ctx?: any): void;
    }
    function BonesManager(): _BonesManager;
    type ArmatureSource = dragonBones.Armature | dragonBones.FastArmature;
    class BoneData {
        constructor(am: ArmatureSource);
        private _armature;
        armature: ArmatureSource;
        addLoop(): void;
        rmLoop(): void;
        calcFrameProgress(mo: string, frame: number): number;
        playMotion(motion: string, times: number, stopAtProgress?: number): void;
        seekToMotion(motion: string, time: number): void;
        hasMotion(val: string): boolean;
        bestFrame(): Rect;
        readonly display: egret.DisplayObject;
    }
    class Bones extends CBones {
        constructor();
        dispose(): void;
        private _playingState;
        private _data;
        protected getBoneData(): BoneData;
        protected setBoneData(d: BoneData): void;
        private _bs;
        boneSource: BoneSource;
        bestFrame(): Rect;
        updateLayout(): void;
        private _motions;
        motion: string;
        pushMotion(val: string): void;
        popMotion(): void;
        motions(): Array<string>;
        hasMotion(val: string): boolean;
        play(): void;
        stop(): void;
        private __db_start();
        private __db_complete();
        private __db_loopcomplete();
    }
}
declare module nn {
    class MovieClip extends CMovieClip {
        constructor();
        _signalConnected(sig: string, s: Slot): void;
        dispose(): void;
        private _fps;
        fps: number;
        private _mc;
        private _cs;
        clipSource: ClipSource;
        _clip: string;
        clip: string;
        _location: number;
        location: number;
        isPlaying(): boolean;
        stop(): void;
        play(): void;
        bestFrame(): Rect;
        private _setMovieClipData(d, f);
        private _reverseMode;
        reverseMode: boolean;
        private __needreverse;
        protected tryReverseMovieClipData(): void;
        private _flashMode;
        flashMode: boolean;
        updateLayout(): void;
        protected _updateAnimation(): void;
        private __cb_end(e);
        private __cb_done(e);
    }
}
declare module nn {
    class Button extends CButton {
        constructor(state?: State);
        dispose(): void;
        fontSize: number;
        textColor: ColorType;
        text: string;
        textAlign: string;
        private _label;
        label: Label;
        protected _getLabel(): Label;
        private _imageView;
        imageView: Bitmap;
        private _getImageView();
        imageSource: TextureSource;
        imageFillMode: FillMode;
        bestFrame(inrc?: Rect): Rect;
        updateLayout(): void;
        stateNormal: State;
        stateDisabled: State;
        stateHighlight: State;
        stateSelected: State;
        protected _slavestates: States;
        protected readonly slavestates: States;
        protected onChangeState(obj: any): void;
        private _disabled;
        disabled: boolean;
        touchEnabled: boolean;
        private __btn_touchdown();
        private __btn_touchup();
        setSelection(sel: boolean): void;
    }
    class RadioButton extends Button implements IState {
        constructor();
        private _selectedState;
        selectedState: State;
        private _unselectedState;
        unselectedState: State;
        _selection: boolean;
        setSelection(val: boolean): void;
        isSelection(): boolean;
        /** 是否支持点击已经选中的来直接反选 */
        allowDeclick: boolean;
        private __radio_clicked();
    }
}
declare module nn {
    class Graphics extends CGraphics {
    }
}
declare module nn {
    /** 弹出的对话框类型
        @note 通过返回 bestFrame 来决定对话框的大小 */
    class Dialog extends Component implements IPage {
        constructor();
        _initSignals(): void;
        dispose(): void;
        /** 获得视图隶属的dialog对象 */
        static FromView(cv: CComponent): Dialog;
        /** 路径标记 */
        pathKey: string;
        _filters: CSet<CComponent>;
        addFilter(ui: CComponent): void;
        onAppeared(): void;
        onDisappeared(): void;
        /** 是否让只有镂空的地方才能触摸 */
        onlyFiltersTouchEnabled: boolean;
        /** 延迟自动关闭 */
        delayClose: number;
        /** 在队列中延迟打开 */
        delayOpenInQueue: number;
        /** 依赖的队列 */
        queue: OperationQueue;
        /** 弹出的模式 */
        popupMode: boolean;
        /** 弹出依赖的层 */
        desktopLayer: CComponent;
        private _clickedToClose;
        clickedToClose: boolean;
        protected instanceDesktop(): Desktop;
        /** 替换掉队列中对应的的dialog */
        replace(link: CComponent): Desktop;
        /** 打开
            @param queue, 是否放到队列中打开，默认为 false
        */
        open(queue?: boolean): Desktop;
        /** 打开在队列中的指定dialog之后 */
        follow(link: CComponent): Desktop;
        /** 关闭 */
        close(): void;
        /** 默认为0尺寸 */
        bestFrame(): Rect;
        /** 默认的位置，返回null代表使用对bestFrame进行偏移 */
        bestPosition(): Point;
    }
}
declare module nn {
    class Div extends CDom {
        constructor();
        private _node;
        dispose(): void;
        private _html;
        text: string;
        onAppeared(): void;
        onDisappeared(): void;
        updateLayout(): void;
    }
}
declare module nn {
    class Hud extends Sprite {
        static BackgroundColor: Color;
        static BackgroundImage: TextureSource;
        constructor();
        onAppeared(): void;
        mode: any;
        protected instanceDesktop(): Desktop;
        protected _desk: Desktop;
        open(): void;
        close(): void;
        static Text(str: any, delay?: number): Hud;
        static Error(str: any, delay?: number): Hud;
        static ShowProgress(): Hud;
        static HideProgress(): void;
    }
    class HudText extends Hud {
        static BackgroundColor: any;
        static BackgroundImage: any;
        constructor();
        protected instanceDesktop(): Desktop;
        labelMessage: Label;
        message: string;
        protected _setMessage(s: any): void;
        open(): void;
        updateLayout(): void;
        bestFrame(inrc?: Rect): Rect;
    }
    /** 用来显示活动状态的接口 */
    interface IActivity {
        /** 开始动画 */
        startAnimation(): void;
        /** 停止动画 */
        stopAnimation(): void;
        /** 动画状态 */
        animating: boolean;
    }
    class HudProgress extends Hud implements IProgress {
        static BackgroundColor: any;
        static BackgroundImage: any;
        constructor();
        private _activity;
        activity: CComponent;
        static Current(): HudProgress;
        private _progressValue;
        progressValue: Percentage;
        open(): void;
        close(): void;
        private __tmropen;
        private __tmrdc;
        delayClose(timeout?: number): void;
        private doDelayClose();
        updateLayout(): void;
        bestFrame(inrc?: Rect): Rect;
        static __hud_progress: HudProgress;
        static __hud_progress_counter: number;
    }
}
declare module nn {
    interface IGridDataSource {
        /** 多少个元素 */
        numberOfItems(): number;
        /** 元素的类型 */
        classForItem(row: number, col: number, idx: number): any;
        /** 更新元素 */
        updateItem(item: any, row: number, col: number, idx: number): any;
    }
    class GridCellsItem extends Sprite {
        constructor(cols: number, cls: any);
        spacing: number;
        updateLayout(): void;
        itemAtIndex(idx: number): CComponent;
        setItemAtIndex(item: CComponent, idx: number): void;
        updateData(): void;
        reuseAll(pool: IReusesPool): void;
        private cells;
    }
    class GridViewCell extends Sprite {
        private _item;
        item: CComponent;
        updateData(): void;
        updateLayout(): void;
    }
    class GridViewContent extends TableViewContent {
        constructor();
        gridDataSource: IGridDataSource;
        /** 默认的元素类型 */
        itemClass: any;
        /** 一行有几个 */
        numberOfColumns: number;
        /** 用来实现gridcell的类型 */
        gridCellClass: typeof GridViewCell;
        protected instanceItem(type: any): GridCellsItem;
        protected instanceGridItem(cls: any): any;
        protected updateRow(item: GridCellsItem, cell: TableViewCell, row: number): void;
        protected addOneReuseItem(item: GridCellsItem): void;
        private _reuseGridItems;
    }
    class GridView extends TableView implements IGridDataSource {
        constructor();
        protected instanceTable(): TableViewContent;
        readonly grid: GridViewContent;
        numberOfItems(): number;
        /** 元素的类型 */
        classForItem(row: number, col: number, idx: number): any;
        /** 更新元素 */
        updateItem(item: any, row: number, col: number, idx: number): void;
        numberOfRows(): number;
    }
}
declare module nn {
    class Slider extends Widget implements IProgress {
        constructor();
        dispose(): void;
        _initSignals(): void;
        _identifierView: CComponent;
        identifierView: CComponent;
        /** 水平模式 */
        horizonMode: boolean;
        _progressValue: Percentage;
        progressValue: Percentage;
        updateLayout(): void;
        private __sld_touchchanged(s);
    }
}
declare module nn {
    class _ParticlesManager {
        instanceParticle(name: string): particle.ParticleSystem;
    }
    let ParticlesManager: _ParticlesManager;
    class Particle extends CParticle {
        constructor();
        dispose(): void;
        _name: string;
        name: string;
        _system: particle.ParticleSystem;
        system: particle.ParticleSystem;
        updateLayout(): void;
        start(): void;
        stop(): void;
    }
}
declare module nn {
    /** tab的页面接口 */
    interface ITabPage {
        /** 用于切换操作的button
            @note 如果tabButton不是由page自己管理（业务手动添加tabButton到某一个view中），则tab自动添加tabButton作为子控件，业务通过控制edgeInsets来布局
        */
        tabButton: CButton;
    }
    interface SelectionTabData extends SelectionData {
        oldTabButton: CButton;
        nowTabButton: CButton;
    }
    class TabStack extends ViewStack {
        constructor();
        /** 也可以在tab中直接定义各个按钮 */
        static TabButton: (page: StackPageType, idx?: number) => CButton;
        tabButtons: Array<Button>;
        clear(): void;
        pages: Array<StackPageType>;
        private _selection;
        selection: number;
        protected _getPageTabButton(page: StackPageType, idx: number): CButton;
        protected setViews(arr: Array<StackPageType>): void;
        protected _addPage(page: StackPageType, aschild: boolean): void;
        push(page: StackPageType, animated?: boolean): boolean;
        protected _selsgrp: SelectionsGroup;
        private __cbSelsChanged(e);
        protected _emitSelectionChanged(now: CComponent, old: CComponent): void;
        protected setPageFrame(page: CComponent): void;
    }
}
declare module nn {
    class Tips extends Sprite {
        constructor();
        dispose(): void;
        protected _initSignals(): void;
        /** 尖头 */
        identifier: Bitmap;
        private _target;
        /** 指向的目标 */
        readonly target: CComponent;
        /** 延迟自动关闭 */
        delayClose: number;
        private _base;
        onAppeared(): void;
        /** 作为子控件来显示 */
        showTo(target: CComponent, parent?: CComponent): void;
        protected instanceDesktop(): Desktop;
        /** 作为弹出来显示 */
        popupTo(target: CComponent, autoopen?: boolean): Desktop;
        close(): void;
        protected _layoutTips(): void;
    }
}
declare var LZString: {
    compressToBase64: (input: any) => string;
    decompressFromBase64: (input: any) => string;
    compressToUTF16: (input: any) => string;
    decompressFromUTF16: (compressed: any) => string;
    compressToUint8Array: (uncompressed: any) => Uint8Array;
    decompressFromUint8Array: (compressed: any) => string;
    compressToEncodedURIComponent: (input: any) => string;
    decompressFromEncodedURIComponent: (input: any) => string;
    compress: (uncompressed: any) => string;
    _compress: (uncompressed: any, bitsPerChar: any, getCharFromInt: any) => string;
    decompress: (compressed: any) => string;
    _decompress: (length: any, resetValue: any, getNextValue: any) => string;
};
declare module nn {
    class CodecString implements ICodec {
        encode(s: string): string;
        decode(d: string): string;
    }
    class CodecUrl implements ICodec {
        encode(s: string): string;
        decode(d: string): string;
    }
    class CrytoString implements ICodec {
        key: string;
        private _iv;
        iv: string;
        encode(s: string): string;
        decode(d: string): string;
    }
    class ZipArchiver implements IArchiver {
        static Unavaliable: boolean;
        load(d: any): boolean;
        file(path: string, type: ResType, cb: (str: any) => void, ctx?: any): void;
        private _hdl;
    }
    class LzmaArchiver implements IArchiver {
        static Unavaliable: boolean;
        load(d: any): boolean;
        plain: string;
        file(path: string, type: ResType, cb: (str: any) => void, ctx?: any): void;
    }
}
declare module nn {
    /** 按键数据 */
    class CKeyboard {
        key: string;
        code: number;
    }
    interface IKeyboard extends ISObject {
        visible: boolean;
    }
    let Keyboard: IKeyboard;
}
declare module nn {
    class SoundPlayer extends CSoundPlayer {
        constructor();
        dispose(): void;
        _enable: boolean;
        enable: boolean;
        private _prePlayingState;
        private _mediaSource;
        setMediaSource(ms: string): void;
        private _position;
        readonly position: number;
        protected _hdl: egret.Sound;
        protected _cnl: egret.SoundChannel;
        protected setHdl(val: egret.Sound): void;
        protected setCnl(cnl: egret.SoundChannel): void;
        play(): void;
        replay(): void;
        pause(): void;
        resume(): void;
        stop(): void;
        breakee(): void;
        private __cb_end();
        private __cb_pause();
        private __cb_play();
    }
    class _SoundManager extends CSoundManager {
        readonly background: SoundTrack;
        readonly effect: SoundTrack;
        protected _enable: boolean;
        enable: boolean;
    }
}
declare module nn {
    class LoadingScreen extends Sprite implements IProgress {
        constructor();
        dispose(): void;
        protected _initSignals(): void;
        labelProgress: Label;
        labelVersion: Label;
        updateLayout(): void;
        _progressValue: Percentage;
        progressValue: Percentage;
        updateData(): void;
        onLoaded(): void;
        /** 完成主界面的加载 override */
        complete(): void;
        /** 关闭当前页面 */
        protected close(): void;
        /** 完成加载前的准备 override */
        prepare(): void;
        protected start(): void;
    }
}
declare module nn {
    class TextField extends Label implements CTextField {
        constructor();
        dispose(): void;
        _initSignals(): void;
        _signalConnected(sig: string, s?: Slot): void;
        protected hitTestClient(x: number, y: number): egret.DisplayObject;
        readonly: boolean;
        securityInput: boolean;
        private _labelPlaceholder;
        labelPlaceholder: Label;
        placeholderTextColor: number;
        placeholder: string;
        protected _setFontSize(v: number): void;
        protected _setTextAlign(a: string): void;
        protected _setText(s: string): boolean;
        multilines: boolean;
        private __inp_focus();
        private __inp_blur();
        private __lbl_changed(e);
        updateLayout(): void;
    }
}
declare module egret.web {
}
declare module nn {
    let stage3d: egret3d.Egret3DCanvas;
}
declare module nn {
    /** 用来管理所有自动生成的位于 resource/assets/~tsc/ 中的数据 */
    class _DatasManager extends nn.SObject {
        constructor();
        _load(): void;
    }
    let DatasManager: _DatasManager;
}
declare module nn {
    class SelectionsGroup extends SObject {
        constructor();
        protected _initSignals(): void;
        dispose(): void;
        add(ui: CComponent & IState): void;
        clear(): void;
        elements(): any[];
        private _cbStateChanged(e);
        selection: number;
        selectionItem: any;
        indexOf(o: any): number;
        readonly previousSelectionItem: any;
        readonly length: number;
        private _old;
        private _store;
    }
}
declare module egret {
    var VERSION_2_5_6: any;
}
declare module nn {
}
declare module nn {
    /** 承载不同状态对应的外观 */
    class State {
        constructor(props?: {});
        props: {};
        change(o: {}): void;
        static Text(text: string, color?: ColorType, size?: number): State;
        static Color(textcolor: ColorType, backcolor?: ColorType): State;
        static Image(image: TextureSource): State;
        static BackgroundImage(image: TextureSource): State;
        static Button(text?: string, image?: TextureSource, back?: TextureSource): State;
        static As(obj: any): State;
        setIn(ui: any): void;
        protected _children: KvObject<any, State>;
        readonly children: KvObject<any, State>;
        add(idr: any, child: State): State;
        remove(idr: any): State;
    }
    interface IState {
        nextState?(state: any): any;
        isSelection?(): boolean;
        setSelection?(sel: boolean): any;
    }
    class States extends SObject {
        constructor();
        protected _initSignals(): void;
        dispose(): void;
        private _state;
        state: any;
        nullstate: any;
        nullobj: any;
        /** 修改一个状态 */
        changeState(val: any, sig?: boolean): boolean;
        /** 选中基于传入状态的下一个状态 */
        next(state?: any, selection?: boolean, sig?: boolean): void;
        updateData(skipnull?: boolean): void;
        /** 绑定状态 */
        bind(state: any, val: any, isnullstate?: boolean): States;
        /** 查询状态 */
        get(state: any): any;
        private _states;
        cbset: (obj: any) => void;
        cbctx: any;
    }
}
declare module nn {
    interface CTextField {
        /** 只读 */
        readonly: boolean;
        /** 占位文字 */
        placeholder: string;
        /** 占位字体颜色 */
        placeholderTextColor: ColorType;
        /** 多行编辑 */
        multilines: boolean;
        /** 安全编辑 */
        securityInput: boolean;
    }
}
declare module RES {
}
declare module nn {
    interface ICacheJson extends ICacheRecord {
        use(): any;
    }
    interface ICacheTexture extends ICacheRecord {
        use(): egret.Texture;
    }
    interface ICacheText extends ICacheRecord {
        use(): string;
    }
    interface ICacheFont extends ICacheRecord {
        use(): egret.BitmapFont;
    }
    interface ICacheSound extends ICacheRecord {
        use(): egret.Sound;
    }
    interface ICacheBinary extends ICacheRecord {
        use(): any;
    }
    class _ResMemcache extends Memcache {
        constructor();
        protected doRemoveObject(rcd: CacheRecord): void;
        private _hashCode;
        static IDR_HASHCODE: string;
        add(source: string, data: any): ICacheRecord;
        query(source: string): ICacheRecord;
        private _sources;
        private _keys;
    }
    class ResCapsule extends CResCapsule {
        constructor(reqres: ReqResource[], ewd: EventWeakDispatcher);
        dispose(): void;
        private _ewd;
        protected loadOne(rr: ReqResource, cb: () => void, ctx: any): void;
        protected total(): number;
    }
    class _ResManager extends CResManager {
        constructor();
        private _ewd;
        cache: _ResMemcache;
        loadConfig(file: string, cb: (e: any) => void, ctx: any): void;
        cacheEnabled: boolean;
        private _cfg_loaded(e);
        private _grp_complete(e);
        private _grp_failed(e);
        private _grp_progress(e);
        isGroupsArrayLoaded(grps: string[]): boolean;
        private _capsules;
        capsules(grps: ReqResource[]): CResCapsule;
        removeCapsule(cp: CResCapsule): void;
        tryGetRes(key: string): ICacheRecord;
        getResAsync(key: string, priority: ResPriority, cb: (rcd: ICacheRecord) => void, ctx?: any): void;
        if(DEBUG: any): void;
        getResUrl(key: string): string;
        getResByUrl(src: UriSource, priority: ResPriority, cb: (rcd: ICacheRecord | CacheRecord) => void, ctx: any, type: ResType): void;
        hasAsyncUri(uri: UriSource): boolean;
        getTexture(src: TextureSource, priority: ResPriority, cb: (tex: ICacheTexture) => void, ctx: any): void;
        getBitmapFont(src: FontSource, priority: ResPriority, cb: (fnt: ICacheFont) => void, ctx: any): void;
        getSound(src: SoundSource, priority: ResPriority, cb: (snd: ICacheSound) => void, ctx: any): void;
    }
}
declare module nn {
    /** 找到所有的父对象 */
    function getParents(ui: any): Array<any>;
    /** 获取每一个 view 的 supers，做两个 arr 的交集，取得第一个返回 */
    function findAncestorView(l: any, r: any): any;
    /** 根据类型找父对象 */
    function findParentByType(l: any, cls: any, def?: any): any;
    /** 根据自定义条件查找满足条件的父对象 */
    function queryParent(l: any, query: (o: any) => any, ctx?: any): any;
    /** 使用tag查找所有子元素 */
    function findElementsByTag(l: any, tag: any): Array<any>;
    /** 判断是否在屏幕上显示 */
    function isAppearing<T>(obj: T): boolean;
}
declare module nn {
    /** 为了支持堆栈控制实体、类 */
    type StackPageType = InstanceType<CComponent>;
    /** page类，为了能自动记录页面切换的路径 */
    interface IPage {
        pathKey: string;
    }
    /** 实现页面堆栈 */
    interface IViewStack {
        /** 推入 */
        push(c: StackPageType, animated: boolean): boolean;
        push(c: StackPageType): boolean;
        /** 弹出 */
        pop(c: StackPageType, animated: boolean): boolean;
        pop(c: StackPageType): any;
        pop(): any;
        popTo(c: StackPageType | number, animated: boolean): boolean;
        popTo(c: StackPageType | number): boolean;
        popToRoot(): any;
    }
}
declare module nn {
    /** 转换标记到本地字符串 */
    function T(str: string): string;
    interface I18N {
    }
    var i18n: I18N;
}
declare module app.dev {
    function main(node: nn.dom.DomObject): any;
}
declare module nn {
    let COLLECT_INSTRUMENT: boolean;
    let COLLECT_FPS: number;
    let COLLECT_COST: number;
    let COLLECT_DRAWS: number;
    let COLLECT_DIRTYR: number;
    class IPLabel extends dom.Label {
        constructor();
    }
    class ProfilerPanel extends dom.Sprite {
        constructor();
        lblDrawed: IPLabel;
        lblCost: IPLabel;
        lblFps: IPLabel;
        lblDirty: IPLabel;
        start(): void;
        stop(): void;
        updateData(): void;
    }
    class SystemInfoPanel extends dom.Sprite {
        constructor();
        lblOrientation: IPLabel;
        lblEnvSize: IPLabel;
        lblNavi: IPLabel;
        updateData(): void;
    }
    class InstrumentPanel extends dom.Sprite {
        constructor();
        protected preload(cb: () => void, ctx?: any): void;
        onLoaded(): void;
        pnlSysinfo: SystemInfoPanel;
        pnlProfiler: ProfilerPanel;
        pnlDebug: DebugPanel;
        open(): void;
        close(): void;
        updateData(): void;
    }
    class DebugPanel extends dom.Sprite {
        constructor();
        onLoaded(): void;
    }
    class Instrument extends SObject {
        constructor();
        button: dom.Button;
        panel: InstrumentPanel;
        static shared: Instrument;
        static run(): Instrument;
        open(): void;
        close(): void;
        updateData(): void;
    }
}
declare module nn {
    interface ISnapshot {
        /** 快照出一个数据 */
        snapshot(): Object;
    }
}
declare module nn.journal {
    interface JournalRecord {
        time: DateTime;
        snapshot: Object;
        reason: string;
        stack: string;
    }
    /** 添加一个日志 */
    function add(reason: string, obj: ISnapshot): void;
    /** 查找满足条件的日志 */
    function query(keypath: string, val: any): Array<JournalRecord>;
    /** 打印日志 */
    function recordsStringify(rcds?: JournalRecord[]): string;
    class ArrayT {
        static RemoveObjectByFilter<T extends ISnapshot>(reason: string, arr: T[], filter: (o: T, idx: number) => boolean, ctx?: any): T;
        static RemoveObjectsByFilter<T extends ISnapshot>(reason: string, arr: T[], filter: (o: T, idx: number) => boolean, ctx?: any): T[];
        static Convert<L, R extends ISnapshot>(reason: string, arr: L[], convert: (o: L, idx?: number) => R, ctx?: any): R[];
    }
    class IndexedMapT {
        static RemoveObjectByFilter<K, T extends ISnapshot>(reason: string, map: IndexedMap<K, T>, filter: (k: K, v: T) => boolean, ctx?: any): [K, T];
        static RemoveObjectsByFilter<K, T extends ISnapshot>(reason: string, map: IndexedMap<K, T>, filter: (k: K, v: T) => boolean, ctx?: any): Array<[K, T]>;
        static Convert<K, T extends ISnapshot, V>(reason: string, arr: Array<V>, convert: (v: V) => [K, T], ctx?: any): IndexedMap<K, T>;
    }
}
declare class AssetAdapter implements eui.IAssetAdapter {
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    getAsset(source: string, compFunc: Function, thisObject: any): void;
}
declare module nn {
    class Vector2d extends Point {
        applyTransform(tfm: Transform2d): this;
    }
    class Rect2d extends Rect {
        applyTransform(tfm: Transform2d): this;
    }
    class Transform2d {
        scale(vec: Vector2d): this;
        rotate(ang: Angle): this;
        translate(vec: Vector2d): this;
        invert(): this;
        identity(): this;
        protected _mat: egret.Matrix;
    }
    class Vector3d {
        constructor(x?: number, y?: number, z?: number, w?: number);
        x: number;
        y: number;
        z: number;
        w: number;
        protected _v: number[];
    }
    class Transform3d {
    }
}
declare module nn {
    abstract class Layout {
        constructor(ctx?: any);
        anchor: boolean;
        useAnchor(b: boolean): this;
        protected _ctx: any;
        protected _rc: Rect;
        protected _orc: Rect;
        protected _offset: number;
        /** 把 layout 放到某一个具有 bounds 函数的对象中， apply 时的 rect 会变成 bounds */
        view: any;
        /** 设置整体大小 */
        setRect(rc: Rect): this;
        /** 获得整体大小 */
        frame: Rect;
        protected _avaRect(): boolean;
        frameForLayout(): Rect;
        edgeInsets: EdgeInsets;
        /** 设置布局的边距 */
        padding(ei: EdgeInsets): this;
        /** 偏移 */
        offset(pt: Point): this;
        /** 应用布局 */
        apply(): void;
        /** 布局结束的回调 */
        protected _cbcomplete: (lyt: Layout) => void;
        protected _ctxcomplete: any;
        complete(cb: (lyt: Layout) => void, ctx?: any): void;
        /** 清空布局 */
        abstract clear(): any;
    }
    type layoutcb_t = ((obj: any, rc: Rect) => void) | ((obj: any, rc: Rect, data: any) => void);
    type hboxcb_t = ((box: HBox) => void) | ((box: HBox, data: any) => void);
    type vboxcb_t = ((box: VBox) => void) | ((box: VBox, data: any) => void);
    class LinearSegment {
        val: number;
        isp: boolean;
        obj: any;
        anchor: boolean;
        cb: layoutcb_t;
        ctx: any;
        data: any;
        dispose(): void;
        setRect(x: number, y: number, w: number, h: number): void;
    }
    abstract class LinearLayout extends Layout {
        /** 获得总长 */
        abstract length(): number;
        /** 获得对边长 */
        abstract against(): number;
        /** 设置每段的长度
            @note 长度、段、第几份，返回具体设置了多长，可以通过修改return来做到附加偏移
         */
        protected abstract setSegmentLength(len: number, seg: LinearSegment, idx: number): number;
        protected _segments: LinearSegment[];
        /** 间距 */
        spacing: number;
        setSpacing(v: number): this;
        clear(): void;
        /** 按照像素划分 */
        addPixel(pixel: number, obj?: any, cb?: layoutcb_t, ctx?: any, data?: any): this;
        /** 按照定比来划分，总比例为各个 flex 之和，每一个 flex 的长度为 (总长 - 固定像素长) / 总 flex */
        addFlex(flex: number, obj?: any, cb?: layoutcb_t, ctx?: any, data?: any): this;
        addPixelHBox(pixel: number, boxcb: hboxcb_t, ctx?: any, data?: any): this;
        addPixelVBox(pixel: number, boxcb: vboxcb_t, ctx?: any, data?: any): this;
        addFlexHBox(flex: number, boxcb: hboxcb_t, ctx?: any, data?: any): this;
        addFlexVBox(flex: number, boxcb: vboxcb_t, ctx?: any, data?: any): this;
        addAspect(w: number, h: number, obj?: any, cb?: layoutcb_t, ctx?: any, data?: any): this;
        addAspectHBox(w: number, h: number, boxcb: hboxcb_t, ctx?: any, data?: any): this;
        addAspectVBox(w: number, h: number, boxcb: vboxcb_t, ctx?: any, data?: any): this;
        apply(): void;
        protected _spacingsLength(): number;
        clipPixel(pix: number, obj: any, lflex?: number, rflex?: number, cb?: layoutcb_t, ctx?: any, data?: any): this;
        clipFlex(flex: number, obj: any, lpix: number, rpix: number, cb?: layoutcb_t, ctx?: any, data?: any): this;
        clipPixelHBox(pix: number, boxcb: hboxcb_t, lflex?: number, rflex?: number, ctx?: any, data?: any): this;
        clipFlexHBox(flex: number, boxcb: hboxcb_t, lpix: number, rpix: number, ctx?: any, data?: any): this;
        clipPixelVBox(pix: number, boxcb: vboxcb_t, lflex?: number, rflex?: number, ctx?: any, data?: any): this;
        clipFlexVBox(flex: number, boxcb: vboxcb_t, lpix: number, rpix: number, ctx?: any, data?: any): this;
    }
    class HBox extends LinearLayout {
        constructor(ctx?: any);
        length(): number;
        against(): number;
        protected setSegmentLength(len: number, seg: LinearSegment, idx: number): number;
    }
    class VBox extends LinearLayout {
        constructor(ctx?: any);
        length(): number;
        against(): number;
        protected setSegmentLength(len: number, seg: LinearSegment, idx: number): number;
    }
    type layoutflowcb_t = (obj: any, rc: Rect, data?: any) => void;
    enum FlowOption {
        Fix = 0,
        Stretch = 1,
    }
    class FlowSegment {
        w: number;
        h: number;
        obj: any;
        anchor: boolean;
        option: FlowOption;
        cb: layoutflowcb_t;
        ctx: any;
        data: any;
        dispose(): void;
        setRect(x: number, y: number, w: number): void;
    }
    class HFlow extends Layout {
        constructor(ctx?: any);
        clear(): void;
        protected _segments: FlowSegment[];
        addSize(w: number, h: number, option?: FlowOption, obj?: any, cb?: layoutflowcb_t, ctx?: any, data?: any): HFlow;
        position: Point;
        apply(): void;
        protected applyRows(rows: Array<FlowSegment>, pos: Point, w: number): void;
    }
}
declare module nn {
    class EuiApplication extends EgretApp {
        constructor();
        protected _preloadConfig(oper: OperationGroup): void;
        /** 设置根页面 */
        root: eui.ComponentU;
    }
}
declare module nn.developer {
    class FileDialog {
        filter: string;
        pathForSave(cb: (ph: string) => void): void;
        pathForOpen(cb: (ph: string) => void): void;
        pathForDir(cb: (ph: string) => void): void;
    }
    class FileSystem {
        /** 创建文件夹
            @param p Create intermediate directories as required
        */
        mkdir(path: string, p: boolean, cb: () => void): void;
    }
    class Image extends SObject {
        open(path: string, cb: (suc: boolean) => void): void;
        save(path: string, cb: (suc: boolean) => void): void;
        scale(x: number, y: number, cb: (img: Image) => void): void;
        subimage(rc: Rect, cb: (sub: Image) => void): void;
        private _hdl;
    }
}
declare module nn {
    class _CrossLoader {
        private static _regID;
        static completeCall: any;
        static process(m: Model): void;
        private static start(m, id);
    }
    interface IRestSession extends ISObject {
        SID: string;
        post(m: Model, cb?: (s?: Slot) => void, cbctx?: any): any;
        fetch(m: Model, cbsuc?: (s?: Slot) => void, cbctx?: any, cbfail?: (s?: Slot) => void, cbend?: () => void): any;
        fetchs(ms: Array<Model>, cbsuc?: (ss?: Array<Slot>) => void, cbctx?: any): any;
    }
    var RestSession: IRestSession;
    /** 基本的通过URL来访问数据的模型对象 */
    class UrlModel extends Model {
        /** 请求的地址 */
        request: string;
        url(): string;
        urlForLog(): string;
    }
}
declare module eui {
    interface IEUIExt {
        onPartBinded(name: string, target: any): any;
    }
    class _EUIExt {
        static onPartBinded(self: any, name: string, target: any): void;
        static Propname(name: string): string;
        static removeFromParent(self: any): void;
        static setViewStack(self: any, sck: IViewStack): void;
        static getViewStack(self: any): IViewStack;
        static goBack(self: any): void;
        static setExhibition(self: any, b: boolean): void;
        static getExhibition(self: any): boolean;
        /** 设置遮罩 */
        static setClipbounds(self: any, rc: nn.Rect): void;
        static getClipbounds(self: any): nn.Rect;
        static playAnimate(self: any, ani: Animate, idr?: any): Animate;
        static findAnimate(self: any, idr: any): Animate;
        static stopAnimate(self: any, idr: any): void;
        static stopAllAnimates(self: any): void;
    }
    function ConvertPoint(fromsp: egret.DisplayObject | nn.CComponent, pt: nn.Point, tosp: egret.DisplayObject | nn.CComponent): nn.Point;
    function ConvertRect(fromsp: egret.DisplayObject | nn.CComponent, rc: nn.Rect, tosp: egret.DisplayObject | nn.CComponent): nn.Rect;
}
declare module nn {
    class ServiceMock extends svc.Service {
        constructor();
        static Prepare(cb: () => void, ctx: any): void;
        support(feature: svc.Feature): boolean;
        pay(c: svc.PayContent): void;
        payable(price: number): boolean;
        share(c: svc.ShareContent): void;
        profile(c: svc.ProfileContent): void;
        status(c: svc.StatusContent): void;
        auth(c: svc.AuthContent): void;
        login(c: svc.LoginContent): void;
        switchuser(c: svc.SwitchUserContent): void;
        logout(c: svc.LogoutContent): void;
        loading(c: svc.LoadingContent): void;
        bind(c: svc.BindContent): void;
        subscribe(c: svc.SubscribeContent): void;
        bbs(c: svc.BBSContent): void;
        report(c: svc.ReportContent): void;
        getapp(c: svc.GetAppContent): void;
        sendtodesktop(c: svc.SendToDesktopContent): void;
        lanzuan(c: svc.LanZuanContent): void;
        lanzuanxufei(c: svc.LanZuanXuFeiContent): void;
        private _oldmessages;
        customer(c: svc.CustomerContent): void;
        static IsCurrent(): boolean;
    }
    class MockServices extends ServicesManager {
        detectService(): any;
    }
}
declare let hGame: any;
declare let hGameHdl: any;
declare module nn {
    class ServiceXHB extends svc.Service {
        constructor();
        /** 小伙伴支付需要 gamekey 作为参数 */
        static GameKey: string;
        static ID: string;
        static DESCRIPTION: {
            NAME: string;
            CONTACT: string;
        };
        static PLATFORM: string;
        static PLATFORMID: svc.Platform;
        static PAYUNIT: string;
        static PAYRATE: number;
        static Prepare(cb: () => void, ctx: any): void;
        protected _doResult(result: any, c: svc.Content, suc: (data: any) => void, failed?: (err: Failed) => void): void;
        private _dataStatus;
        support(feature: svc.Feature): boolean;
        pay(c: svc.PayContent): void;
        payable(price: number): boolean;
        share(c: svc.ShareContent): void;
        profile(c: svc.ProfileContent): void;
        status(c: svc.StatusContent): void;
        auth(c: svc.AuthContent): void;
        private _pid;
        login(c: svc.LoginContent): void;
        switchuser(c: svc.SwitchUserContent): void;
        logout(c: svc.LogoutContent): void;
        loading(c: svc.LoadingContent): void;
        private _setStatus(key, v);
        bind(c: svc.BindContent): void;
        subscribe(c: svc.SubscribeContent): void;
        bbs(c: svc.BBSContent): void;
        report(c: svc.ReportContent): void;
        getapp(c: svc.GetAppContent): void;
        sendtodesktop(c: svc.SendToDesktopContent): void;
        lanzuan(c: svc.LanZuanContent): void;
        lanzuanxufei(c: svc.LanZuanXuFeiContent): void;
        private _maxmessages;
        private _oldmessages;
        private _customer_running;
        customer(c: svc.CustomerContent): void;
        static IsCurrent(): boolean;
    }
    class XHBServices extends ServicesManager {
        detectService(): any;
    }
}
declare module nn {
    class SocketModel extends SObject {
        constructor();
        protected _initSignals(): void;
        fields(): KvObject<string, any>;
        /** 请求的时间戳 */
        ts: number;
        /** 显示等待 */
        showWaiting: boolean;
        /** 配置文件 */
        cfg: string;
        /** 请求和返回的类名 */
        name: string;
        dname: string;
        /** 命令的标记 */
        static Command: any;
        /** 参数 */
        params: KvObject<string, any>;
        /** 反解析 */
        protected unserialize(rsp: any): boolean;
        __mdl_start(): void;
        __mdl_completed(rsp: any): void;
        __mdl_failed(): void;
        __mdl_end(): void;
    }
    class WebSocketConnector extends CSocketConnector {
        open(): void;
        close(): void;
        isopened(): boolean;
        write(d: any): void;
        protected _hdl: WebSocket;
    }
    interface ISocketSession extends ISObject {
        connector: CSocketConnector;
        watch(mdl: SocketModel, cb?: (s?: Slot) => void, cbctx?: any): any;
        unwatch(mdl: SocketModel): any;
        fetch(mdl: SocketModel, cb?: (s?: Slot) => void, cbctx?: any, cbfail?: (s?: Slot) => void, cbend?: () => void): any;
        host: string;
        open(): any;
    }
    var SocketSession: ISocketSession;
}
declare module eui {
    class Animate {
        bind(ui: egret.DisplayObject): this;
        clone(): this;
        tag: any;
        readonly hashCode: number;
        private _ani;
        next(props: any, duration: number, tf: Function): this;
        to(duration: number, tf: Function, ani: (ani: nn.Animator) => void, ctx?: any): this;
        then(ani: (ani: nn.Animator) => void, ctx?: any, duration?: number, tf?: Function): this;
        stop(): void;
        complete(cb: (s: nn.Slot) => void, ctx?: any): this;
        repeat(count: number): this;
        play(): this;
        pause(): void;
        resume(): void;
    }
}
declare module eui {
    class BitmapLabelU extends eui.BitmapLabel {
        onPartBinded(name: string, target: any): void;
        exhibition: boolean;
        private _value;
        value: any;
        private _format;
        format: string;
        dispose(): void;
        drop(): void;
        $onRemoveFromStage(): void;
    }
}
declare module nn {
    type TiledSource = string;
    class TiledMap extends Sprite {
        constructor();
        dispose(): void;
        protected _map: tiled.TMXTilemap;
        private _data;
        private _url;
        private _tiledSource;
        tiledSource: TiledSource;
        updateLayout(): void;
    }
}
declare module eui {
    class BoneU extends eui.Group {
        slots: string;
        tag: any;
        constructor();
        dispose(): void;
        drop(): void;
        onPartBinded(name: string, target: any): void;
        goBack(): void;
        $onRemoveFromStage(): void;
        protected _initSignals(): void;
        protected _signals: nn.Signals;
        readonly signals: nn.Signals;
        protected _instanceSignals(): void;
        _signalConnected(sig: string, s?: nn.Slot): void;
        private __cmp_tap(e);
        private _sourceChanged;
        /** 骨骼动画的名字 */
        private _boneName;
        boneName: string;
        /** 角色名字 */
        private _boneCharacter;
        boneCharacter: string;
        /** 骨骼资源名 */
        private _boneSkeleton;
        boneSkeleton: string;
        /** 骨骼定义资源名 */
        private _bonePlace;
        bonePlace: string;
        /** 骨骼材质资源名 */
        private _boneTexture;
        boneTexture: string;
        /** 播放的速度 */
        private _boneFps;
        boneFps: number;
        /** 附加缩放系数 */
        additionScale: number;
        /** 填充模式 */
        fillMode: number;
        /** 序列帧的对齐位置 */
        clipAlign: number;
        /** 动作名称 */
        motion: string;
        /** 播放次数 */
        playCount: number;
        /** 自动播放 */
        autoPlay: boolean;
        private _hbone;
        private bone();
        createChildren(): void;
        commitProperties(): void;
        boneSource: nn.BoneSource;
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /** 播放 */
        play(): void;
        stop(): void;
    }
}
declare module eui {
    class TabStackU extends eui.ComponentU implements eui.IViewStack {
        constructor();
        private _imp;
        protected createImp(): void;
        updateLayout(): void;
        /** 通过类查找对应的页面 */
        findPage(cls: any): egret.DisplayObject;
        push(ui: egret.DisplayObject): void;
        pop(): void;
        pages(): egret.DisplayObject[];
    }
}
