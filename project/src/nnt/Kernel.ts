module nn {

    // 初始化ECMA兼容层
    Ecma();

    /** 三态 bool */
    export type tribool = number;
    export const tritrue = 1; // 类同于 true
    export const trifalse = 0; // 类同于 false
    export const trimay = 2; // 第三个中间状态

    /** 基础数字＋字符串 */
    export type numstr = number | string | any;

    /** JSONOBJ+字符串 */
    export type jsonobj = string | Object;

    export type KvObject<V> = { [key: string]: V };
    export type IndexedObject = KvObject<any>;

    // 默认的时间单位，秒
    export type Interval = number;

    // 获得当前渲染的进度
    export let IMP_TIMEPASS: () => number;

    // 定时器
    export let IMP_CREATE_TIMER: (duration: Interval, count: number) => any;
    export let IMP_START_TIMER: (tmr: any, cb: () => void, ctx: any) => void;
    export let IMP_STOP_TIMER: (tmr: any, cb: () => void, ctx: any) => void;

    // 存储
    export let IMP_STORAGE_GET: (key: string) => string;
    export let IMP_STORAGE_SET: (key: string, v: string) => void;
    export let IMP_STORAGE_DEL: (key: string) => void;
    export let IMP_STORAGE_CLEAR: () => void;

    // 推迟
    export let Defer: (cb: () => void, ctx: any, ...p: any[]) => void;

    export enum FrameworkFeature {
        // GL 硬件加速
        // GL = 1 << 1,

        // 不同步屏幕刷新
        NOSYNC = 1 << 2,

        // 多分辨率素材支持
        MULTIRES = 1 << 3,

        // 全屏幕
        FULLSCREEN = 1 << 4,

        // 横竖屏自适应
        //MULTIDIRECTION = 1 << 5,

        // 默认没有属性
        DEFAULT = 0,
    }

    /** 定位方式 */
    export enum LocatingType {
        LAYOUT = 0, // 默认，使用LayoutBox来布局，只使用FactorSize来调整缩放后的尺寸

        SCALE_FACTOR_X = 0x11, // 使用scalefactor缩放x
        SCALE_FACTOR_Y = 0x12, // 使用scalefactor缩放y
        SCALE_FACTOR_WIDTH = 0x14, // 使用scalefactor缩放宽度
        SCALE_FACTOR_HEIGHT = 0x18, // 使用scalefactor缩放高度

        ABSOLUTE = SCALE_FACTOR_X | SCALE_FACTOR_Y,
        RELATIVE = ABSOLUTE | SCALE_FACTOR_WIDTH | SCALE_FACTOR_HEIGHT,

        FIXED = 3, // 仅确定位置, 不使用ScaleFactor
    }

    /** 全局的设计和实际坐标的转换 */
    export let ScaleFactorX = 1;
    export let ScaleFactorDeX = 1;
    export let ScaleFactorY = 1;
    export let ScaleFactorDeY = 1;
    export let ScaleFactorW = 1;
    export let ScaleFactorDeW = 1;
    export let ScaleFactorH = 1;
    export let ScaleFactorDeH = 1;
    export let ScaleFactorS = 1;
    export let ScaleFactorDeS = 1;
    export let StageScaleFactorX = 1;
    export let StageScaleFactorY = 1;
    export let DomScaleFactorX = 1;
    export let DomScaleFactorY = 1;
    export let DomOffsetX = 0;
    export let DomOffsetY = 0;

    export let MAX_INT = 9007199254740991;

    export function Integral(v: number): number {
        return (v + 0.5) >> 0;
    }

    /** 基类的接口 */
    export interface IObject {
        dispose(): void;
    }

    /** 引用计数的接口 */
    export interface IReference {
        drop(): void;

        grab(): void;
    }

    export class RefVariable<T extends IReference> {
        // 获取当前值
        get(): T {
            return this._val;
        }

        // 设置当前值
        set(o: T, grab: boolean = true) {
            if (this._val)
                this._val.drop();
            this._val = o;
            if (o && grab)
                o.grab();
        }

        dispose() {
            if (this._val) {
                this._val.drop();
                this._val = undefined;
            }
        }

        private _val: T;
    }

    /** 默认的Object接口 */
    export interface IRefObject extends IObject, IReference {
    }

    /** 序列化的接口 */
    export interface ISerializable {
        /** 序列化对象到流，返回结果 */
        serialize(stream: any): any;

        /** 从流中构建对象 */
        unserialize(stream: any): boolean;
    }

    /** 单件的接口 */
    export interface ISingleton {
        /** 获得实体 */
        // static getInstance():any;

        /** 释放实体 */
        // static freeInstance();
    }

    /** 全局的不可释放的唯一实例 */
    export interface IShared {
        // 约定该实例名称为shared
        // static shared = new IMPL_TYPE();
    }

    /** 强制转换 */
    export function any_cast<T>(obj: any): T {
        return obj;
    }

    export interface ISObject {
        signals: Signals;
    }

    /** 带有信号的基类
     @brief 如果不能直接基类，需要实现信号的相关函数 */
    export class SObject implements IRefObject, ISObject {
        /** 构造函数 */
        constructor() {
            // pass
        }

        /** 业务可以根据需要随意绑定到该变量 */
        tag: any;

        /** 唯一id */
        static HashCode = 0;
        hashCode: number = ++SObject.HashCode;

        // 已经析构掉，用来 debug 模式下防止多次析构
        protected __disposed = false;

        /** 析构函数 */
        dispose() {
            if (ISDEBUG && this.__disposed) {
                warn("对象 " + Classname(this) + " 已经析构");
            }
            this.__disposed = true;

            if (this._attachs) {
                ArrayT.Clear(this._attachs, (o: any) => {
                    drop(o);
                });
            }

            if (this._signals) {
                this._signals.dispose();
                this._signals = undefined;
            }
        }

        /** 实现注册信号
         @note 业务通过重载此函数并通过调用 this._signals.register 来注册信号
         */
        protected _initSignals() {
        }

        /** 信号 */
        protected _signals: Signals;
        get signals(): Signals {
            if (this._signals)
                return this._signals;
            this._instanceSignals();
            return this._signals;
        }

        protected _instanceSignals() {
            this._signals = new Signals(this);
            this._initSignals();
        }

        /** 绑定一个生命期 */
        private _attachs: Array<any>;

        attach(o: any) {
            // 如果不存在生命期维护，则直接放弃
            if (o.grab == undefined)
                return;
            if (this._attachs == null)
                this._attachs = new Array<any>();
            o.grab();
            this._attachs.push(o);
        }

        detach(o: any) {
            if (o.drop == undefined)
                return;
            if (this._attachs == null)
                return;
            if (ISDEBUG && !ArrayT.Contains(this._attachs, o)) {
                warn("尝试从 attachs 中移除一个本来没有加入的对象");
                return;
            }
            o.drop();
            ArrayT.RemoveObject(this._attachs, o);
        }

        /** 维护一个内部的引用计数器，防止对象的提前析构 */
        protected _refcnt = 1;

        /** 释放一次引用，如果到0则析构对象 */
        drop() {
            if (ISDEBUG && this.__disposed) {
                warn("对象 " + Classname(this) + " 已经析构");
            }

            if (--this._refcnt == 0)
                this.dispose();
        }

        /** 增加一次引用 */
        grab() {
            ++this._refcnt;
        }

        /** 调用自己 */
        callself<implT>(cb: (s: implT) => void, ctx?: any): implT {
            cb.call(ctx ? ctx : this, this);
            return <any>this;
        }

        /** 获得自己，为了支持 InstanceType */
        get obj(): this {
            return this;
        }

        /** 测试自己是否为空 */
        isnull(): boolean {
            if (this.__disposed)
                return true;
            return false;
        }

        /** 比较函数 */
        isEqual(r: this): boolean {
            return this == r;
        }

        /** 获得自己的类定义 */
        get clazz(): any {
            return ObjectClass(this);
        }

        /** 实例化一个对象 */
        static New<T>(cb: (o: T) => void, ...p: any[]): T {
            let obj: any = InstanceNewObject(this, p);
            if (cb)
                cb.call(this, obj);
            return obj;
        }
    }

    export interface ISObjectWrapper {
        signals: Signals;
        attach: (obj: any) => void;
        dispose: () => void;
    }

    // 包裹一个普通对象为signals对象
    export class SObjectWrapper
        extends SObject {
        constructor(o: any) {
            super();
            this._wrpobj = o;
            let tgt = this._wrpobj;
            tgt.signals = this.signals;
            tgt.attach = SObjectWrapper._imp_attach;
            tgt.dispose = SObjectWrapper._imp_dispose;
            tgt.__sobj_wrapper = this;
        }

        static _imp_dispose = function () {
            let tgt = <any>this;
            tgt.__sobj_wrapper.dispose();
        }

        static _imp_attach = function (o: any) {
            let tgt = <any>this;
            tgt.__sobj_wrapper.attach(o);
        }

        dispose() {
            let tgt = this._wrpobj;
            tgt.signals = null;
            tgt.dispose = null;
            tgt.__sobj_wrapper = null;
            this._wrpobj = null;
            super.dispose();
        }

        private _wrpobj: any;
    }

    // 默认对象的名称需要跳过名字
    export let OBJECT_DEFAULT_KEYS = ["hashCode"];

    // egret等实现框架会重叠listener，所以保护一下addEventListener，防止被多次添加
    export function EventHook(obj: any, event: any, fun: any, target?: any, capture?: boolean) {
        if (target == null)
            target = obj;
        if (obj.hasEventListener(event, fun, target, capture) == false)
            obj.addEventListener(event, fun, target, capture);
    }

    export function EventUnhook(obj: any, event: any, fun: any, target?: any, capture?: boolean) {
        if (target == null)
            target = obj;
        obj.removeEventListener(event, fun, target, capture);
    }

    /** 增加引用计数 */
    export function grab<T>(o: T): T {
        if (o == null)
            return undefined;
        (<any>o).grab();
        return o;
    }

    /** 减计数对象 */
    export function drop<T>(o: T): T {
        if (o == null)
            return undefined;
        return (<any>o).drop();
    }

    /** 直接析构一个对象 */
    export function dispose<T>(o: T) {
        if (o == null)
            return;
        (<any>o).dispose();
    }

    /** 错误的类型 */
    export class Failed {
        constructor(code: number, msg?: string, lmsg?: string) {
            this.code = code;
            this.message = msg;
            if (lmsg == null)
                lmsg = msg;
            this.locationMessage = lmsg;
        }

        message: string;
        locationMessage: string;
        code: number;
        line: number;

        toString(): string {
            return this.code + ': ' + this.locationMessage;
        }
    }

    /** 测试用的 closure, 如果当前不是测试模式，则会抛出一个错误 */
    export function test(cb: Function, ctx?: any) {
        if (ISDEBUG)
            cb.call(ctx);
        else
            fatal("must remove this test");
    }

    /** debug 模式下才执行 */
    export function debug(cb: Function, ctx?: any) {
        VERBOSE && cb.call(ctx);
    }

    export module debug {

        export let text = {'p': '%c', 'c': 'color:#b0b0b0'};
        export let obje = {'p': '%c', 'c': 'color:#f8881a'};
        export let info = {'p': '', 'c': ''};
        export let noti = {'p': '%c', 'c': 'color:blue'};
        export let warn = {'p': '%c', 'c': 'color:red'};

        export function log(msg: string, face: any) {
            if (ISHTML5)
                console.log(face.p + msg, face.c);
            else
                console.log(msg);
        }

        export function obj(o: any) {
            console.log('%o', o);
        }

        let FEATURE_GROUP = console.groupCollapsed != null;

        export function group(msg: string, cb: () => void, ctx: any) {
            FEATURE_GROUP && console.groupCollapsed(msg);
            cb.call(ctx);
            FEATURE_GROUP && console.groupEnd();
        }
    }

    /** dump一个变量 */
    export function vardump(o: any, depth = 2): string {
        let buf = '{';
        for (let k in o) {
            buf += '"' + k + '":';
            let v = o[k];
            if (v == null) {
                buf += 'null';
            } else {
                let tp = typeof (v);
                switch (tp) {
                    case 'string': {
                        buf += '"' + v + '"';
                    }
                        break;
                    case 'boolean': {
                        buf += v ? 'true' : 'false';
                    }
                        break;
                    case 'number': {
                        buf += v;
                    }
                        break;
                    case 'function': {
                        buf += v.name + '(#' + v.length + ')';
                    }
                        break;
                    default: {
                        if (depth)
                            buf += vardump(v, depth - 1);
                        else
                            buf += '<truncated>';
                    }
                        break;
                }
            }
            buf += ',';
        }
        buf += '}';
        return buf;
    }

    /** 获得调用路径 */
    export function callstack(): Array<any> {
        let r = [];
        let o = arguments.callee.caller;
        while (o) {
            r.push(o);
            ;
            o = o.caller;
        }
        return r;
    }

    /** 控制台输出日志 */
    export function log(msg: string, obj?: any) {
        VERBOSE && debug.log(msg, debug.text);
    }

    /** 控制台打印一个对象 */
    export function obj(o: any) {
        VERBOSE && debug.obj(o);
    }

    /** 控制台dump一个对象 */
    export function dump(o: any, depth?: number): string {
        if (VERBOSE) {
            let s = vardump(o, depth);
            debug.log(s, debug.obje);
            return s;
        }
        return '';
    }

    /** 控制台输出信息 */
    export function info(msg: string) {
        VERBOSE && debug.log(msg, debug.info);
    }

    /** 控制台输出提示 */
    export function noti(msg: string) {
        VERBOSE && debug.log(msg, debug.noti);
    }

    /** 控制台输出警告 */
    export function warn(msg: string, title?: string, ...obj: any[]) {
        if (VERBOSE) {
            debug.log(msg, debug.warn);
            obj.length && debug.group(title, function () {
                obj.forEach((o: any) => {
                    debug.obj(o);
                });
            }, this);
        }
    }

    /** 控制台打印一个异常 */
    export function exception(obj: any, msg?: string) {
        if (VERBOSE) {
            let s = '';
            if (msg && msg.length)
                s += msg + ': ';
            s += obj.message;
            warn(s, obj.name, obj.stack);
            console.log(console.trace());
        }
        //Debugger();
    }

    /** 控制台弹窗 */
    export function msgbox(msg: string) {
        noti(msg);
        VERBOSE && alert(msg);
    }

    /** 中断程序流程 */
    export function assert(exp: boolean, msg?: string) {
        if (!exp) {
            warn(msg);
            //Debugger();
        }
    }

    /** 如果为null，返回另外一个值 */
    export function val<T>(inp: T, def: T): T {
        return inp == null ? def : inp;
    }

    /** 取大于的数值 great-than */
    export function gt(inp: number, cmp: number = 0, def: number = 0): number {
        return inp > cmp ? inp : def;
    }

    /** 取小于的数值 less-than */
    export function lt(inp: number, cmp: number = 0, def: number = 0): number {
        return inp < cmp ? inp : def;
    }

    /** 是否是Chrome */
    export let ISCHROME = window['chrome'] != null;

    /** 中断chrome的调试器 */
    export function Debugger() {
        if (ISCHROME)
            debugger;
    }

    /** 控制台输出一个错误 */
    export function fatal(msg: string) {
        warn(msg);
        alert(msg);
        //Debugger();
    }

    /** 带保护的取得一个对象的长度 */
    export function length(o: any, def = 0): number {
        if (o == null)
            return def;
        return o.length;
    }

    /** 带保护的取一堆中第一个不是空的值 */
    export function nonnull1st<T>(def: T, ...p: T[]) {
        for (let i = 0; i < p.length; ++i) {
            let v = p[i];
            if (v != null)
                return v;
        }
        return def;
    }

    /** 带保护的根据下标取得列表中的对象 */
    export function at<T>(arr: T[], idx: number, def?: T): T {
        if (arr == null)
            return def;
        if (arr.length <= idx)
            return def;
        return arr[idx];
    }

    export function modat<T>(arr: T[], idx: number, def?: T): T {
        if (!arr || !arr.length)
            return def;
        return arr[idx % arr.length];
    }

    /** 带保护的判断对象是不是 0 */
    export function isZero(o: any): boolean {
        if (o == null || o == 0)
            return true;
        if (o.length)
            return o.length == 0;
        return false;
    }

    function SafeNumber(o: number, def = 0): number {
        return isNaN(o) ? def : o;
    }

    /** 转换到 float */
    export function toDouble(o: any, def = 0): number {
        if (o == null)
            return def;
        let tp = typeof (o);
        if (tp == 'number')
            return SafeNumber(o, def);
        if (tp == 'string') {
            let v = parseFloat(o);
            return SafeNumber(v, def);
        }
        if (o.toNumber)
            return o.toNumber();
        return def;
    }

    /** 转换到 int */
    export function toInt(o: any, def = 0): number {
        if (o == null)
            return def;
        let tp = typeof (o);
        if (tp == 'number' || tp == 'string') {
            let v = parseInt(o);
            return SafeNumber(v, def);
        }
        if (o.toNumber)
            return o.toNumber() >> 0;
        return def;
    }

    /** 转换到数字
     @brief 如果对象不能直接转换，会尝试调用对象的 toNumber 进行转换
     */
    export function toNumber(o: any, def = 0): number {
        if (o == null)
            return def;
        let tp = typeof (o);
        if (tp == 'number')
            return SafeNumber(o, def);
        if (tp == 'string') {
            let v = Number(<string>o);
            return SafeNumber(v, def);
        }
        if (o.toNumber)
            return o.toNumber();
        return def;
    }

    /** 转换到字符串 */
    export function asString(o: any, def = ''): string {
        if (o == null)
            return def;
        let tp = typeof (o);
        if (tp == 'string')
            return <string>o;
        if (tp == 'number')
            return SafeNumber(o).toString();
        if (o.toString) {
            let t = o.toString();
            if (t != "[object Object]")
                return t;
        }
        // 转换成json
        let r: string;
        try {
            r = JSON.stringify(o);
        } catch (err) {
            r = def;
        }
        return r;
    }

    /** 转换到json字串 */
    export function toJson(o: any, def = null): string {
        let t = typeof (o);
        if (t == 'string')
            return o;
        let r = null;
        try {
            r = JSON.stringify(o);
        } catch (ex) {
            r = def;
        }
        return r;
    }

    /** 转换到对象 */
    export function toJsonObject(o: jsonobj, def = null): Object {
        let t = typeof (o);
        if (t == 'string') {
            try {
                return JSON.parse(<string>o);
            } catch (ex) {
                return def;
            }
        } else if (t == 'object') {
            return o;
        }
        return def;
    }

    /** 格式化字符串 */
    export function formatString(fmt: string, ...p: any[]): string {
        try {
            return Invoke1(js.printf, this, p, fmt);
        } catch (err) {
            exception(new Error('format: ' + fmt + '\nargus: ' + dump(p) + '\n' + err));
        }
        return '';
    }

    export function formatStringV(fmt: string, p: any[]): string {
        try {
            return Invoke1(js.printf, this, p, fmt);
        } catch (err) {
            exception(new Error('format: ' + fmt + '\nargus: ' + dump(p) + '\n' + err));
        }
        return '';
    }

    /** 格式化字符对象 */
    export class FormatString {
        constructor(fmt?: any, ...args: any[]) {
            this.fmt = fmt;
            this.args = args;
        }

        /** fmt 根据业务的实现，可能为int的id，一般情况下为string，所以设置为any兼容业务的复杂性 */
        fmt: any;

        /** 带上的参数 */
        args: any[];

        toString(): string {
            return formatStringV(this.fmt, this.args);
        }
    }

    /** json处理，保护防止crash并且打印出数据 */
    export function json_encode(obj: Object): string {
        return JSON.stringify(obj);
    }

    export function json_decode(str: string): any {
        let r;
        try {
            r = JSON.parse(str);
        } catch (err) {
            exception(err);
        }
        return r;
    }

    /** 带保护的判断对象是不是空 */
    export function IsEmpty(o: any): boolean {
        if (o == null)
            return true;
        let tp = typeof (o);
        if (tp == 'string') {
            if (tp.length == 0)
                return true;
            return o.match(/^\s*$/) != null;
        }
        if (o instanceof Array) {
            return (<any>o).length == 0;
        }
        if (o instanceof Map) {
            return (<Map<any, any>>o).size != 0;
        }
        if (o instanceof Set) {
            return (<Set<any>>o).size != 0;
        }
        return Object.keys(o).length == 0;
    }

    export function TRIVALUE<T>(express: boolean, v1: T, v2: T): T;
    export function TRIVALUE<T>(v1: T, v2: T): T;
    export function TRIVALUE(...p: any[]): any {
        if (p.length == 3)
            return p[0] ? p[1] : p[2];
        return p[0] ? p[0] : p[1];
    }

    /** 简单比较 */
    export enum CMP {
        EQUAL, // ==
        EQUALQ, // ===
        LESSEQUAL, // <=
        GREATEREQUAL, // >=
        LESS, // <
        GREATER, // >
        NOTEQUAL, // !=
        NOTEQUALQ, // !==
    }

    export function Cmp(l: any, r: any, cmp: CMP): boolean {
        switch (cmp) {
            case CMP.EQUAL:
                return l == r;
            case CMP.EQUALQ:
                return l === r;
            case CMP.LESSEQUAL:
                return l <= r;
            case CMP.GREATEREQUAL:
                return l >= r;
            case CMP.LESS:
                return l < r;
            case CMP.GREATER:
                return l > r;
            case CMP.NOTEQUAL:
                return l != r;
            case CMP.NOTEQUALQ:
                return l !== r;
        }
    }

    /** 编解码器 */
    export class Codec extends SObject {
        constructor() {
            super();
        }

        /** 讲一个对象写入流
         @brief 成功会返回新增的节点，失败返回 null
         */
        write(o: any): any {
            return null;
        }

        /** 从流里面读取一个对象，返回读出的对象
         */
        read(): any {
            return null;
        }

        /** 转换成字符串 */
        toString(): string {
            return null;
        }

        /** 从字符串构造 */
        fromString(s: string) {
        }
    }

    /** JSON 编解码器
     @brief 区分于标准的 JSON 格式化，编解码器会附带额外的类型信息，并且解码时会自动重建对象，所以速度不如格式化快，但是支持自定义对象
     */
    export class JsonCodec extends Codec {
        constructor() {
            super();
            this._sck.push(this._d);
        }

        write(o: any): any {
            if (o == null)
                return null;
            let top = ArrayT.Top(this._sck);
            let tp = typeof (o);
            if (tp == 'number' || tp == 'string') {
                top.push(o);
            } else if (tp == 'object') {
                if (o instanceof Array) {
                    let t: any = {'__': 'Array', '--': []};
                    top.push(t);
                    this._sck.push(t['--']);
                    o.forEach((o: any) => {
                        this.write(o);
                    }, this);
                    this._sck.pop();
                } else if (o instanceof Map) {
                    let t: any = {'__': 'Map', '--': [[], []]};
                    top.push(t);

                    // Map 分为使用 foreach 的原生以及按照{}使用的 Kernel实现，所以得分别遍历
                    this._sck.push(t['--'][0]);
                    o.forEach((v: any, k: any) => {
                        if (this.write(k))
                            this.write(v);
                    }, this);
                    this._sck.pop();

                    this._sck.push(t['--'][1]);
                    ObjectT.Foreach(o, (v: any, k: any) => {
                        if (this.write(k))
                            this.write(v);
                    });
                    this._sck.pop();
                } else if (typeof (o.serialize) == 'function') {
                    let t: any = {'__': Classname(o), '--': []};
                    top.push(t);

                    this._sck.push(t['--']);
                    o.serialize(this);
                    this._sck.pop();
                } else {
                    let t: any = {'__': 'Object', '--': []};
                    top.push(t);

                    this._sck.push(t['--']);
                    ObjectT.Foreach(o, (v: any, k: any) => {
                        if (this.write(k))
                            this.write(v);
                    });
                    this._sck.pop();
                }
            } else {
                return null;
            }
            return top;
        }

        read(): any {
            let top = ArrayT.Top(this._sck);

            let o = top[0];
            let tp = typeof (o);
            if (tp == 'number' || tp == 'string') {
                return o;
            }

            let objcls = o['__'];
            let objdata = o['--'];

            let obj = eval("new " + objcls + '()');
            if (objcls == 'Array') {
                objdata.forEach((o: any) => {
                    this._sck.push([o]);
                    let v = this.read();
                    this._sck.pop();

                    obj.push(v);
                }, this);
            } else if (objcls == 'Map') {
                let o0 = objdata[0];
                let o1 = objdata[1];

                for (let i = 0; i < o0.length; ++i) {
                    let k: any = o0[i];
                    let v: any = o0[++i];

                    this._sck.push([k]);
                    k = this.read();
                    this._sck.pop();

                    this._sck.push([v]);
                    v = this.read();
                    this._sck.pop();

                    obj.set(k, v);
                }

                for (let i = 0; i < o1.length; ++i) {
                    let k: any = o1[i];
                    let v: any = o1[++i];

                    this._sck.push([k]);
                    k = this.read();
                    this._sck.pop();

                    this._sck.push([v]);
                    v = this.read();
                    this._sck.pop();

                    obj[k] = v;
                }
            } else if (objcls == 'Object') {
                for (let i = 0; i < objdata.length; ++i) {
                    let k: any = objdata[i];
                    let v: any = objdata[++i];

                    this._sck.push([k]);
                    k = this.read();
                    this._sck.pop();

                    this._sck.push([v]);
                    v = this.read();
                    this._sck.pop();

                    obj[k] = v;
                }
            } else if (typeof (obj.unserialize) == 'function') {
                this._sck.push(objdata);
                obj.unserialize(this);
                this._sck.pop();
            }
            return obj;
        }

        toString(): string {
            return JSON.stringify(this._d);
        }

        fromString(s: string) {
            this.clear();

            let o = JSON.parse(s);
            ArrayT.Set(this._d, o);
            this.read();
        }

        clear() {
            this._d.length = 0;
            this._sck.length = 0;
            this._sck.push(this._d);
        }

        private _d = [];
        private _sck = [];
    }

    /** 文本生成器 */
    export class StringBuilder {
        /** 行结尾 */
        linebreak = '\n';

        /** 添加行 */
        line(s?: any, color?: ColorType, size?: number): this {
            if (s == null)
                s = '';
            if (color != null || size != null)
                this.font(color, size);
            this._buf += s + this.linebreak;
            return this;
        }

        /** 添加文字 */
        add(s: any, color?: ColorType, size?: number): this {
            if (s == null)
                s = '';
            if (color != null || size != null)
                this.font(color, size);
            this._buf += s;
            return this;
        }

        /** 设置一个样式 */
        font(color: ColorType, size?: number): this {
            let st = '';
            if (color != null) {
                st += ' color=' + GetColorComponent(color)[0];
            }
            if (size != null) {
                st += ' size=' + size;
            }
            if (st.length) {
                this._buf += '<font' + st + '>';
            }
            return this;
        }

        /** 添加一个链接 */
        href(text: string, addr?: string): this {
            if (addr == null)
                addr = text;
            this._buf += '<font u=true href=event:' + addr + '>' + text;
            return this;
        }

        /** 添加一个可以触摸的区域 */
        touch(text: string): this {
            this._buf += '<font href=event:' + text + '>' + text;
            return this;
        }

        /** 恢复之前的样式 */
        pop(): this {
            this._buf += '</font>';
            return this;
        }

        concat(r: StringBuilder): this {
            this._buf += r._buf;
            return this;
        }

        /** 格式化输出 */
        toString(): string {
            return this._buf;
        }

        private _buf: string = '';
    }

    export class UnsignedInt {
        constructor(d: number = 0) {
            this.obj = d;
        }

        private _obj: number;
        private _d: number;

        get obj(): number {
            return this._obj;
        }

        set obj(d: number) {
            if (d < 0)
                this._d = MAX_INT + d;
            else
                this._d = d;
            this._obj = d;
        }

        valueOf(): number {
            return this._d;
        }
    }

    export class SafeSet<T> {
        has(v: T): boolean {
            return this._set.has(v);
        }

        delete(v: T) {
            if (this._set.has(v))
                this._set.delete(v);
        }

        add(v: T) {
            if (this._set.has(v) == false)
                this._set.add(v);
        }

        forEach(p: (o: T) => void, ctx?: any) {
            this._set.forEach(p, ctx);
        }

        get size(): number {
            return this._set.size;
        }

        clear() {
            this._set.clear();
        }

        private _set = new Set<T>();
    }

    export enum COMPARERESULT {
        EQUAL = 0,
        GREATER = 1,
        LESS = -1,
    }

    /** 操作 number */
    export class NumberT {
        /** 任一数字的科学计数读法
         @return 数字部分和e的部分
         */
        static SciNot(v: number): [number, number] {
            let n = NumberT.log(v, 10);
            let l = v / Math.pow(10, n);
            return [l, n];
        }

        /** 方根 */
        static radical(v: number, x: number, n: number) {
            return Math.exp(1 / n * Math.log(x));
        }

        /** 对数 */
        static log(v: number, n: number): number {
            let r = Math.log(v) / Math.log(n) + 0.0000001;
            return r >> 0;
        }

        /** 修正为无符号 */
        static Unsigned(v: number): number {
            if (v < 0)
                return 0xFFFFFFFF + v + 1;
            return v;
        }

        /** 映射到以m为底的数 */
        static MapToBase(v: number, base: number): number {
            if (v % base == 0)
                return base;
            return v % base;
        }

        /** 运算，避免为null时候变成nan */
        static Add(v: number, r: number): number {
            if (v == null)
                v = 0;
            if (r == null)
                r = 0;
            return v + r;
        }

        static Sub(v: number, r: number): number {
            if (v == null)
                v = 0;
            if (r == null)
                r = 0;
            return v - r;
        }

        static Multiply(v: number, r: number): number {
            if (v == null)
                v = 0;
            if (r == null)
                r = 0;
            return v * r;
        }

        static Div(v: number, r: number): number {
            if (v == null)
                v = 0;
            if (r == null || r == 0)
                return MAX_INT;
            return v / r;
        }

        static HANMAPS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

        /** 中文化数字 */
        static Hanlize(v: number): string {
            let neg;
            if (v < 0) {
                neg = true;
                v = -v;
            }
            let r = neg ? '负' : '';
            if (v <= 10)
                r += this.HANMAPS[v];
            // TODO: 其他数字算法等用到的时候再实现
            return r;
        }
    }

    /** 操作 string */
    export class StringT {
        /** 优化显示float
         @param v 输入的数字
         @param dp decimalplace 小数位
         @param term 是否去除末尾的0
         */
        static FormatFloat(v: number, dp: number, term: boolean = true): string {
            let s = formatString('%.' + dp + 'f', v);
            if (term)
                s = this.TermFloat(s);
            return s;
        }

        // 去除掉float后面的0
        static TermFloat(str: string): string {
            let lr = str.split('.');
            if (lr.length != 2) {
                warn("传入的 stirng 格式错误");
                return str;
            }

            let ro = lr[1], m = false, rs = '';
            for (let i = ro.length; i > 0; --i) {
                let c = ro[i - 1];
                if (!m && c != '0')
                    m = true;
                if (m)
                    rs = c + rs;
            }
            if (rs.length == 0)
                return lr[0];
            return lr[0] + '.' + rs;
        }

        static Hash(str: string): number {
            let hash = 0;
            if (str.length == 0)
                return hash;
            for (let i = 0; i < str.length; ++i) {
                hash = (((hash << 5) - hash) + str.charCodeAt(i)) & 0xffffffff;
            }
            return hash;
        }

        static Count(str: string, substr: string): number {
            let pos = str.indexOf(substr);
            if (pos == -1)
                return 0;
            let r = 1;
            r += this.Count(str.substr(pos + substr.length), substr);
            return r;
        }

        /** 计算ascii的长度 */
        static AsciiLength(str: string): number {
            let r = 0;
            for (let i = 0; i < str.length; ++i) {
                let c = str.charCodeAt(i);
                r += c > 128 ? 2 : 1;
            }
            return r;
        }

        /** 拆分，可以选择是否去空 */
        static Split(str: string, sep: string, skipempty: boolean = true): Array<string> {
            let r = str.split(sep);
            let r0 = [];
            r.forEach((e: string) => {
                if (e.length)
                    r0.push(e);
            });
            return r0;
        }

        /** 拉开，如果不足制定长度，根据mode填充
         @param mode 0:中间填充，1:左边填充，2:右边填充
         @param wide 是否需要做宽字符补全，如果str为中文并且sep为单字节才需要打开
         */
        static Stretch(str: string, len: number, mode: number = 0, sep: string = ' ', wide = true): string {
            if (str.length >= len)
                return str;
            if (str.length == 0) {
                let r = '';
                while (len--)
                    r += sep;
                return r;
            }
            let n = len - str.length;
            let r = '';
            switch (mode) {
                case 0: {
                    let c = (len - str.length) / (str.length - 1);
                    if (wide)
                        c *= 2;
                    if (c >= 1) {
                        // 每个字符后面加sep
                        for (let i = 0; i < str.length - 1; ++i) {
                            r += str[i];
                            for (let j = 0; j < c; ++j)
                                r += sep;
                        }
                        r += str[str.length - 1];
                    } else {
                        r = str;
                    }
                    // 如果不匹配，则补全
                    if (r.length < len) {
                        n = len - str.length;
                        if (wide)
                            n *= 2;
                        while (n--)
                            r += sep;
                    }
                }
                    break;
                case 1: {
                    while (n--)
                        r = sep + r;
                    r += str;
                }
                    break;
                case 2: {
                    r = str;
                    while (n--)
                        r += sep;
                }
                    break;
            }
            return r;
        }

        static Code(s: string): number[] {
            let r = [];
            let l = s.length;
            for (let i = 0; i < l; ++i)
                r.push(s.charCodeAt(i));
            return r;
        }

        static FromCode(c: number[]): string {
            return String.fromCharCode.apply(null, c);
        }

        // 小写化
        static Lowercase(str: string, def = ""): string {
            return str ? str.toLowerCase() : def;
        }

        static Uppercase(str: string, def = ""): string {
            return str ? str.toUpperCase() : def;
        }

        static UpcaseFirst(str: string): string {
            if (!str || !str.length)
                return "";
            return str[0].toUpperCase() + str.substr(1);
        }

        static FromArrayBuffer(buf: ArrayBuffer): string {
            let bytes = new Uint8Array(buf);
            let out, i, len, c;
            let char2, char3;
            out = "";
            len = bytes.length;
            i = 0;
            while (i < len) {
                c = bytes[i++];
                switch (c >> 4) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        // 0xxxxxxx
                        out += String.fromCharCode(c);
                        break;
                    case 12:
                    case 13:
                        // 110x xxxx   10xx xxxx
                        char2 = bytes[i++];
                        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                        break;
                    case 14:
                        // 1110 xxxx  10xx xxxx  10xx xxxx
                        char2 = bytes[i++];
                        char3 = bytes[i++];
                        out += String.fromCharCode(((c & 0x0F) << 12) |
                            ((char2 & 0x3F) << 6) |
                            ((char3 & 0x3F) << 0));
                        break;
                }
            }
            return out;
        }

        // 标准的substr只支持正向，这里实现的支持两个方向比如，substr(1, -2)
        static SubStr(str: string, pos: number, len?: number): string {
            if (len == null || len >= 0)
                return str.substr(pos, len);
            if (pos < 0)
                pos = str.length + pos;
            pos += len;
            let of = 0;
            if (pos < 0) {
                of = pos;
                pos = 0;
            }
            return str.substr(pos, -len + of);
        }

        static Repeat(str: string, count: number = 1): string {
            let r = "";
            while (count--) {
                r += str;
            }
            return r;
        }
    }

    /** 提供了操作 array 的工具函数 */
    export class ArrayT {

        static Max<T, V>(arr: T[], proc: (e: T, idx: number) => V = (e: any) => e): T {
            let cur: V;
            let obj: T;
            arr.forEach((e, idx) => {
                if (idx == 0) {
                    cur = proc(e, idx);
                    obj = e;
                    return;
                }
                let t = proc(e, idx);
                if (ObjectT.Compare(cur, t) == COMPARERESULT.LESS) {
                    cur = t;
                    obj = e;
                }
            });
            return obj;
        }

        static Min<T, V>(arr: T[], proc: (e: T, idx: number) => V = (e: any) => e): T {
            let cur: V;
            let obj: T;
            arr.forEach((e, idx) => {
                if (idx == 0) {
                    cur = proc(e, idx);
                    obj = e;
                    return;
                }
                let t = proc(e, idx);
                if (ObjectT.Compare(t, cur) == COMPARERESULT.LESS) {
                    cur = t;
                    obj = e;
                }
            });
            return obj;
        }

        /** 初始化数量 */
        static Allocate<T>(count: number, def?: any): T[] {
            let isfun = typeof (def) == 'function';
            let f = <any>def;
            let r = [];
            for (let i = 0; i < count; ++i) {
                let o = isfun ? f(i) : def;
                r.push(o);
            }
            return r;
        }

        /** 转换成数组 */
        static ToArray(o: any): any[] {
            if (o == null)
                return [];
            if (o instanceof Array)
                return o;
            return [o];
        }

        /** 合并所有的数组 */
        static Merge<T>(...arr: Array<Array<T>>): T[] {
            let r = [];
            arr.forEach((arr: Array<T>) => {
                r = r.concat(arr);
            });
            return r;
        }

        /** 使用比较函数来判断是否包含元素 */
        static Contains<L, R>(arr: L[], o: R, eqfun?: (l: L, o: R) => boolean, eqctx?: any): boolean {
            return arr.some((each: any): boolean => {
                return ObjectT.IsEqual(each, o, eqfun, eqctx);
            }, this);
        }

        /** 合并 */
        static Concat<T>(l: T[], r: T[]): T[] {
            if (l == null)
                return r;
            if (r == null)
                return l;
            return l.concat(r);
        }

        /** 压入一组数据 */
        static PushObjects<L>(arr: L[], p: L[]) {
            p && p.forEach((e: L) => {
                arr.push(e);
            });
        }

        /** 把 array 当成 stack 取得栈顶 */
        static Top<T>(arr: T[], def?: T): T {
            return at(arr, arr.length - 1, def);
        }

        /** 设置栈顶元素，如果 array.len == 0，则添加该元素 */
        static SetTop<T>(arr: T[], o: T) {
            if (arr.length == 0)
                arr.push(o);
            else
                arr[arr.length - 1] = o;
        }

        /** 弹出栈顶 */
        static PopTop<T>(arr: T[], def?: T): T {
            if (arr.length == 0)
                return def;
            return arr.pop();
        }

        /** 查询 */
        static QueryObject<T>(arr: T[], fun: (o: T, idx: number) => boolean, ctx?: any, def?: any): T {
            let r = def;
            arr.some((o: T, idx: number): boolean => {
                if (fun.call(ctx, o, idx)) {
                    r = o;
                    return true;
                }
                return false;
            }, this);
            return r;
        }

        /** 查找所有符合条件的对象 */
        static QueryObjects<T>(arr: T[], fun: (o: T, idx: number) => boolean, ctx?: any): T[] {
            let r = [];
            arr.forEach((o: T, idx: number) => {
                if (fun.call(ctx, o, idx))
                    r.push(o);
            });
            return r;
        }

        /** 查询条件对应的索引 */
        static QueryIndex<T>(arr: T[], fun: (o: T, idx: number) => boolean, ctx?: any, def?: number): number {
            let r = def;
            arr.some((o: T, idx: number): boolean => {
                if (fun.call(ctx, o, idx)) {
                    r = idx;
                    return true;
                }
                return false;
            }, this);
            return r;
        }

        /** 不为指定数据的数组长度 */
        static TrustLength<T>(arr: T[], tgt: T = null): number {
            let r = 0;
            arr.forEach((e) => {
                if (e != tgt)
                    ++r;
            });
            return r;
        }

        /** 覆盖指定数据到数组 */
        static TrustAddObject<T>(arr: T[], src: T, tgt: T = null): boolean {
            for (let i = 0; i < arr.length; ++i) {
                if (arr[i] == tgt) {
                    arr[i] = src;
                    return true;
                }
            }
            return false;
        }

        /** 移除数据 */
        static TrustRemoveObject<T>(arr: T[], src: T, tgt: T = null) {
            let idx = arr.indexOf(src);
            if (idx == -1)
                return;
            arr[idx] = tgt;
        }

        /** 覆盖数组 */
        static TrustSet<T>(arr: T[], tgt: T[], def = null) {
            for (let i = 0; i < arr.length; ++i) {
                let o = tgt[i];
                arr[i] = o ? o : def;
            }
        }

        /** 弹出数据 */
        static TrustPop<T>(arr: T[], tgt: T[], def = null) {
            for (let i = 0; i < arr.length; ++i) {
                let o = this.RemoveObjectAtIndex(tgt, 0);
                arr[i] = o ? o : def;
            }
        }

        /** 清除 */
        static TrustClear<T>(arr: T[], tgt: T = null) {
            for (let i = 0; i < arr.length; ++i)
                arr[i] = tgt;
        }

        /** 插入元素 */
        static InsertObjectAtIndex<T>(arr: T[], o: T, idx: number) {
            arr.splice(idx, 0, o);
        }

        /** 清空数组，并挨个回调 */
        static Clear<T>(arr: T[], cb?: (o: T) => void, ctx?: any) {
            if (cb)
                arr.forEach(cb, ctx);
            arr.length = 0;
        }

        /** 安全的清空，以避免边加边删的边际效应 */
        static SafeClear<T>(arr: T[], cb?: (o: T) => void, ctx?: any) {
            ArrayT.Clear(ArrayT.Clone(arr), cb, ctx);
            arr.length = 0;
        }

        /** 安全的增加，如果为null，则推入def，如果def也是null，则不推入 */
        static SafePush<T>(arr: T[], o: T, def?: T) {
            let obj = o ? o : def;
            if (obj)
                arr.push(obj);
        }

        /** 填充一个数组 */
        static Fill<T>(arr: T[], cnt: number, instance: () => any, ctx?: any): T[] {
            if (arr == null)
                arr = [];
            while (cnt--) {
                arr.push(instance.call(ctx));
            }
            return arr;
        }

        /** 使用类型来自动实例化并填充数组 */
        static FillType<T>(arr: T[], cnt: number, cls: any): T[] {
            if (arr == null)
                arr = [];
            while (cnt--) {
                arr.push(new cls());
            }
            return arr;
        }

        /** 带保护的两两遍历 */
        static ForeachWithArray(arrl: any[], arrr: any[], cb: (l: any, r: any, idx: number) => void, ctx?: any, def?: any) {
            let cntl = arrl.length, cntr = arrr.length;
            let cnt = Math.max(cntl, cntr);
            for (let i = 0; i < cnt; ++i) {
                let ol = i < cntl ? arrl[i] : def;
                let or = i < cntr ? arrr[i] : def;
                cb.call(ctx, ol, or, i);
            }
        }

        /** 带 break 的索引遍历 */
        static Foreach<T>(arr: T[], cb: (o: T, idx: number) => boolean, ctx?: any) {
            arr.every((each: any, idx: number): boolean => {
                return cb.call(ctx, each, idx);
            }, this);
        }

        /** 按照行来遍历 */
        static ForeachRow<T>(arr: T[], columns: number, cb: (o: T, row: number, col: number, idx?: number, rows?: number) => boolean, ctx?: any) {
            let rows = Math.ceil(arr.length / columns);
            for (let r = 0; r < rows; ++r) {
                for (let c = 0; c < columns; ++c) {
                    let i = r * columns + c;
                    if (cb.call(ctx, arr[i], r, c, i, rows) == false)
                        return;
                }
            }
        }

        /** 随机一个 */
        static Random<T>(arr: T[]): T {
            if (arr.length == 0)
                return null;
            return arr[Random.Rangei(0, arr.length)];
        }

        /** 安全的遍历，以避免边删边加的边际效应 */
        static SafeForeach(arr: any[], cb: (o: any, idx: number) => boolean, ctx: any) {
            ArrayT.Foreach(ArrayT.Clone(arr), cb, ctx);
        }

        /** 迭代数组，提供结束的标识 */
        static Iterate<T>(arr: T[], cb: (o: T, idx: number, end: boolean) => boolean, ctx: any) {
            if (arr.length == 0)
                return;
            let len = arr.length - 1;
            ArrayT.Foreach(arr, function (o: any, idx: number): boolean {
                return cb.call(ctx, o, idx, idx == len);
            }, ctx);
        }

        /** 使用指定索引全遍历数组，包括索引外的 */
        static FullEach<T>(arr: T[], idx: number, cbin: (o: T, idx: number) => void, cbout: (o: T, idx: number) => void) {
            let len = Math.min(arr.length, idx);
            for (let i = 0; i < len; ++i) {
                cbin(arr[i], i);
            }
            if (len >= idx) {
                len = arr.length;
                for (let i = idx; i < len; ++i) {
                    cbout(arr[i], i);
                }
            }
        }

        /** 带筛选器的统计个数 */
        static LengthQuery(arr: any[], cb: (o: any, idx: number) => boolean, ctx: any): number {
            let ret: number = 0;
            arr.forEach((each: any, idx: number) => {
                if (cb.call(ctx, each, idx))
                    ret += 1;
            }, this);
            return ret;
        }

        /** 删除一个对象 */
        static RemoveObject<T>(arr: T[], obj: T): boolean {
            if (obj == null || arr == null)
                return false;
            let idx = arr.indexOf(obj);
            if (ISDEBUG && idx == -1) {
                warn("obj 不属于 array 的元素");
                return false;
            }
            arr.splice(idx, 1);
            return true;
        }

        /** 删除指定索引的对象 */
        static RemoveObjectAtIndex<T>(arr: T[], idx: number): T {
            let r = arr.splice(idx, 1);
            return r[0];
        }

        /** 使用筛选器来删除对象 */
        static RemoveObjectByFilter<T>(arr: T[], filter: (o: T, idx: number) => boolean, ctx?: any): T {
            for (let i = 0; i < arr.length; ++i) {
                let e = arr[i];
                if (filter.call(ctx, e, i)) {
                    arr.splice(i, 1);
                    return e;
                }
            }
            return null;
        }

        static RemoveObjectsByFilter<T>(arr: T[], filter: (o: T, idx: number) => boolean, ctx?: any): T[] {
            let r = [];
            let res = arr.filter((o, idx): boolean => {
                if (filter.call(ctx, o, idx)) {
                    r.push(o);
                    return false
                }
                return true;
            }, this);
            if (arr.length == res.length)
                return r;
            ArrayT.Set(arr, res);
            return r;
        }

        /** 移除位于另一个 array 中的所有元素 */
        static RemoveObjectsInArray<T>(arr: T[], r: T[]) {
            let res = arr.filter((each: any, idx: number): boolean => {
                return !ArrayT.Contains(r, each);
            }, this);
            ArrayT.Set(arr, res);
        }

        /** 使用位于另一个 array 中对应下标的元素 */
        static RemoveObjectsInIndexArray<T>(arr: T[], r: number[]): T[] {
            let rm = [];
            let res = arr.filter((each: T, idx: number): boolean => {
                if (ArrayT.Contains(r, idx) == true) {
                    rm.push(each);
                    return false;
                }
                return true;
            }, this);
            ArrayT.Set(arr, res);
            return rm;
        }

        /** 调整大小 */
        static Resize<T>(arr: T[], size: number, def?: T) {
            if (arr.length < size) {
                let cnt = size - arr.length;
                let base = arr.length;
                for (let i = 0; i < cnt; ++i) {
                    arr.push(def);
                }
            } else if (arr.length > size) {
                arr.length = size;
            }
        }

        /** 上浮满足需求的对象 */
        static Rise<T>(arr: T[], q: (e: T) => boolean) {
            let r = [];
            let n = [];
            arr.forEach((e: T) => {
                if (q(e))
                    r.push(e);
                else
                    n.push(e);
            });
            this.Set(arr, r.concat(n));
        }

        /** 下沉满足需求的对象 */
        static Sink<T>(arr: T[], q: (e: T) => boolean) {
            let r = [];
            let n = [];
            arr.forEach((e: T) => {
                if (q(e))
                    r.push(e);
                else
                    n.push(e);
            });
            this.Set(arr, n.concat(r));
        }

        /** 使用另一个数组来填充当前数组 */
        static Set<T>(arr: T[], r: T[]) {
            arr.length = 0;
            r.forEach((o) => {
                arr.push(o);
            }, this);
        }

        /** 复制 */
        static Clone<T>(arr: T[]): T[] {
            return arr.concat();
        }

        /** 转换 */
        static Convert<L, R>(arr: L[], convert: (o: L, idx?: number) => R, ctx?: any): R[] {
            let r = [];
            arr.forEach((o: L, idx: number) => {
                r.push(convert.call(ctx, o, idx));
            });
            return r;
        }

        /** 安全转换，如果结果为null，则跳过 */
        static SafeConvert<L, R>(arr: L[], convert: (o: L, idx?: number) => R, ctx?: any): R[] {
            let r = [];
            arr.forEach((o: L, idx: number) => {
                let t = convert.call(ctx, o, idx);
                if (t)
                    r.push(t);
            });
            return r;
        }

        /** 提取 */
        static Filter<L, R>(arr: L[], filter: (o: L, idx?: number) => R, ctx?: any): R[] {
            let r = [];
            arr.forEach((o: L, idx: number) => {
                let r = filter.call(ctx, o, idx);
                if (r)
                    r.push(r);
            });
            return r;
        }

        /** 数组 l 和 r 的共有项目 */
        static ArrayInArray<T>(l: T[], r: T[]): T[] {
            return l.filter((o): boolean => {
                return ArrayT.Contains(r, o);
            }, this);
        }

        /** 合并 */
        static Combine<T>(l: T[], sep: any): any {
            let r = l[0];
            for (let i = 1; i < l.length; i++) {
                r += sep + l[i];
            }
            return r;
        }

        /** 检查两个是否一样 */
        static EqualTo<L, R>(l: L[], r: R[], eqfun?: (l: L, r: R) => boolean, eqctx?: any): boolean {
            if (l.length != r.length)
                return false;
            return r.every((o: any): boolean => {
                return ArrayT.Contains(l, o, eqfun, eqctx);
            }, this);
        }

        /** 严格(包含次序)检查两个是否一样 */
        static StrictEqualTo<L, R>(l: L[], r: R[], eqfun?: (l: L, r: R) => boolean, eqctx?: any): boolean {
            if (l.length != r.length)
                return false;
            return r.every((o: any, idx: number): boolean => {
                return ObjectT.IsEqual(o, r[idx], eqfun, eqctx);
            }, this);
        }

        /** 乱序 */
        static Disorder<T>(arr: T[]) {
            arr.sort((): number => {
                return Math.random();
            });
        }

        /** 截取尾部的空对象 */
        static Trim<T>(arr: T[], emp: T = null) {
            let t = [];
            for (let i = arr.length; i != 0; --i) {
                let o = arr[i - 1];
                if (t.length == 0 && o == emp)
                    continue;
                t.push(o);
            }
            ArrayT.Set(arr, t.reverse());
        }

        /** 去重 */
        static HashUnique<T>(arr: T[], hash: boolean = true) {
            let t = [];
            if (hash) {
                let h = {};
                arr.forEach((o: any) => {
                    let k = o.hashCode;
                    if (h[k])
                        return;
                    t.push(o);
                    h[k] = true;
                });
            } else {
                arr.forEach((o: any) => {
                    if (t.indexOf(o) == -1)
                        t.push(o);
                });
            }
            this.Set(arr, t);
        }

        static Unique<T>(arr: T[], eqfun?: (l: T, o: T) => boolean, eqctx?: any) {
            let t = [];
            arr.forEach((o: any) => {
                if (this.Contains(t, o, eqfun, eqctx) == false)
                    t.push(o);
            });
            this.Set(arr, t);
        }

        /** 取得一段 */
        static RangeOf<T>(arr: Array<T>, pos: number, len?: number): Array<T> {
            let n = arr.length;
            if (pos < 0) {
                pos = n + pos;
                if (pos < 0)
                    return arr;
            }
            if (pos >= n)
                return [];
            let c = len == null ? n : pos + len;
            return arr.slice(pos, c);
        }

        /** 弹出一段 */
        static PopRangeOf<T>(arr: Array<T>, pos: number, len?: number): Array<T> {
            let n = arr.length;
            if (pos < 0) {
                pos = n + pos;
                if (pos < 0) {
                    let r = arr.concat();
                    arr.length = 0;
                    return r;
                }
            }
            if (pos >= n)
                return [];
            let c = len == null ? n - pos : len;
            return arr.splice(pos, c);
        }

        /** 根据长度拆成几个Array */
        static SplitByLength<T>(arr: Array<T>, len: number): Array<Array<T>> {
            let r = [];
            let n = Math.ceil(arr.length / len);
            for (let i = 0; i < n; ++i) {
                r.push(this.RangeOf(arr, i * len, len));
            }
            return r;
        }

        /** 快速返回下一个或上一个 */
        static Next<T>(arr: Array<T>, obj: T, def?: T): T {
            let idx = arr.indexOf(obj);
            if (idx == -1)
                return def;
            if (idx + 1 == arr.length)
                return def;
            return arr[idx + 1];
        }

        static Previous<T>(arr: Array<T>, obj: T, def?: T): T {
            let idx = arr.indexOf(obj);
            if (idx == -1)
                return def;
            if (idx == 0)
                return def;
            return arr[idx - 1];
        }
    }

    export function linq<T>(arr: Array<T>): LINQ<T> {
        return new LINQ<T>(arr);
    }

    /** 模拟linq的类 */
    export class LINQ<T> {
        constructor(arr: Array<T>) {
            if (arr) {
                this._arr = arr;
            } else {
                this._arr = new Array<T>();
                this._ref = false;
            }
        }

        // 为了加速查询，默认的arr一开时使用引用的模式，当修改时再进行copy
        private _ref = true;

        private _safe() {
            if (this._ref) {
                this._arr = this._arr.concat();
                this._ref = false;
            }
        }

        forEach(fun: (e: T, idx?: number) => boolean) {
            for (let i = 0, n = this._arr.length; i < n; ++i) {
                if (fun(this._arr[i], i) == false)
                    return;
            }
        }

        where(sel: (e: T, idx?: number) => boolean): this {
            let r = [];
            this._arr.forEach((e: T, idx: number) => {
                if (sel(e, idx))
                    r.push(e);
            });
            return InstanceNewObject(this, r);
        }

        count(sel?: (e: T, idx?: number) => boolean): number {
            if (sel)
                return this.where(sel).count();
            return this._arr.length;
        }

        add(o: T) {
            this._safe();
            this._arr.push(o);
        }

        exists(cond?: (e: T, idx?: number) => boolean): boolean {
            return ArrayT.QueryObject(this._arr, cond) != null;
        }

        first(sel?: (e: T, idx?: number) => boolean): T {
            if (this._arr.length == 0)
                return null;
            if (!sel)
                return this._arr[0];
            let res = this.where(sel);
            if (res.count() == 0)
                return null;
            return res.at(0);
        }

        last(sel?: (e: T, idx?: number) => boolean): T {
            if (this._arr.length == 0)
                return null;
            if (!sel)
                return this._arr[this._arr.length - 1];
            let res = this.where(sel);
            if (res.count() == 0)
                return null;
            return res.last();
        }

        at(idx: number): T {
            if (idx < 0 || idx > this._arr.length)
                return null;
            return this._arr[idx];
        }

        union<K>(tgt: Array<T>, getkey: (e: T) => K): this {
            let r = [];
            let map = {};
            this._arr.forEach((e: T) => {
                let h = js.hashKey(getkey(e));
                if (!map[h]) {
                    map[h] = e;
                    r.push(e);
                }
            });
            tgt.forEach((e: T) => {
                let h = js.hashKey(getkey(e));
                if (!map[h]) {
                    map[h] = e;
                    r.push(e);
                }
            });
            return InstanceNewObject(this, r);
        }

        private _arr: Array<T>;
    }

    export class ObjectT {

        static IsEmpty(tgt: any): boolean {
            if (!tgt)
                return true;
            return Object.keys(tgt).length == 0;
        }

        static RemoveKey(tgt: any, k: any) {
            delete tgt[k];
        }

        // 任意对象的比较
        static Compare(l: any, r: any): COMPARERESULT {
            if (l > r)
                return COMPARERESULT.GREATER;
            if (l < r)
                return COMPARERESULT.LESS;
            return COMPARERESULT.EQUAL;
        }

        static Minus(l: any, r: any): number {
            return l - r;
        }

        static Max<T>(l: T, r: T): T {
            return ObjectT.Compare(l, r) == COMPARERESULT.GREATER ? l : r;
        }

        static Min<T>(l: T, r: T): T {
            return ObjectT.Compare(l, r) == COMPARERESULT.LESS ? l : r;
        }

        static QueryObject(tgt: any, filter: (e: any, k: string) => boolean): any {
            for (let k in tgt) {
                let v = tgt[k];
                if (filter(v, k))
                    return v;
            }
            return null;
        }

        static QueryKey(tgt: any, filter: (e: any, k: string) => boolean): any {
            for (let k in tgt) {
                let v = tgt[k];
                if (filter(v, k))
                    return k;
            }
            return null;
        }

        static Foreach(tgt: any, proc: (e: any, k: string) => void) {
            for (let k in tgt) {
                proc(tgt[k], k);
            }
        }

        static Clear(tgt: any, proc: (e: any, k: string) => void) {
            for (let k in tgt) {
                proc(tgt[k], k);
                delete tgt[k];
            }
        }

        // 第一层的赋值，如果左边存在，则不覆盖左边的
        static LightMerge(l: any, r: any) {
            for (let k in r) {
                if (k in l)
                    continue;
                l[k] = r[k];
            }
        }

        // from r copy to l
        static LightCopy(l: any, r: any) {
            for (let k in r) {
                l[k] = r[k];
            }
        }

        // 只copy第一层
        static LightClone(tgt: any): any {
            let r: IndexedObject = {};
            for (let k in tgt) {
                r[k] = tgt[k];
            }
            return r;
        }

        static DeepClone(tgt: any): any {
            let r: IndexedObject = {};
            for (let k in tgt) {
                let v = tgt[k];
                if (v == null) {
                    r[k] = v;
                } else if (v instanceof Array) {
                    let t = new Array();
                    v.forEach(e => {
                        t.push(ObjectT.DeepClone(e));
                    });
                    r[k] = t;
                } else {
                    let typ = typeof (v);
                    if (typ == "string" || typ == "number" || typ == "boolean") {
                        r[k] = v;
                    } else {
                        r[k] = ObjectT.DeepClone(v);
                    }
                }
            }
            return r;
        }

        /** 比较两个实例是否相等
         @brief 优先使用比较函数的结果
         */
        static IsEqual<L, R>(l: L, r: R, eqfun?: (l: L, r: R) => boolean, eqctx?: any): boolean {
            if (l == null || r == null)
                return false;
            if (eqfun)
                return eqfun.call(eqctx, l, r);
            if (l && (<any>l).isEqual)
                return (<any>l).isEqual(r);
            if (r && (<any>r).isEqual)
                return (<any>r).isEqual(l);
            return <any>l == <any>r;
        }

        /** 根据查询路径获取值 */
        static GetValueByKeyPath(o: any, kp: string, def?: any): any {
            if (o == null)
                return def;
            let ks = kp.split('.');
            for (let i = 0; i < ks.length; ++i) {
                o = o[ks[i]];
                if (o == null)
                    return def;
            }
            return o;
        }

        static GetValueByKeyPaths(o: any, def: any, ...ks: any[]): any {
            if (o == null)
                return def;
            for (let i = 0; i < ks.length; ++i) {
                o = o[ks[i]];
                if (o == null)
                    return def;
            }
            return o;
        }

        /** 根据查询路径设置值 */
        static SetValueByKeyPath(o: any, kp: string, v: any): boolean {
            if (o == null) {
                console.warn("不能对null进行keypath的设置操作");
                return false;
            }
            let ks = kp.split('.');
            let l = ks.length - 1;
            for (let i = 0; i < l; ++i) {
                let k = ks[i];
                let t = o[k];
                if (t == null) {
                    t = {};
                    o[k] = t;
                }
                o = t;
            }
            o[ks[l]] = v;
            return true;
        }

        static SetValueByKeyPaths(o: any, v: any, ...ks: any[]): boolean {
            if (o == null) {
                console.warn("不能对null进行keypath的设置操作");
                return false;
            }
            let l = ks.length - 1;
            for (let i = 0; i < l; ++i) {
                let k = ks[i];
                let t = o[k];
                if (t == null) {
                    t = {};
                    o[k] = t;
                }
                o = t;
            }
            o[ks[l]] = v;
            return true;
        }

        // 展开成keypath的结构
        static KeyPathExpand(o: any): IndexedObject {
            let r: IndexedObject = {};
            this._KeyPathExpandAt(o, r, []);
            return r;
        }

        private static _KeyPathExpandAt(o: any, r: IndexedObject, p: string[]) {
            const typ = typeof o;
            if (typ == "number" || typ == "string" || typ == "boolean") {
                r[p.join('.')] = o;
                return;
            }

            if (o instanceof Array) {
                o.forEach((e, i) => {
                    let np = p.concat();
                    np.push(i.toString());
                    this._KeyPathExpandAt(e, r, np);
                });
            } else if (o instanceof Map) {
                o.forEach((e, k) => {
                    let np = p.concat();
                    np.push(k);
                    this._KeyPathExpandAt(e, r, np)
                });
            } else {
                for (let k in o) {
                    let np = p.concat();
                    np.push(k);
                    this._KeyPathExpandAt(o[k], r, np);
                }
            }
        }

        static SeqForin<T, R>(obj: { [key: string]: T }, proc: (e: T, key: string, next: (ret?: R) => void) => void, complete: (ret?: R) => void) {
            let keys = Object.keys(obj);
            let iter = keys.entries();

            function next(ret?: R) {
                let val = iter.next();
                if (!val.done) {
                    proc(obj[val.value[1]], keys[val.value[0]], next);
                } else {
                    complete(ret);
                }
            }

            next();
        }

        static HasKey(m: any, key: string): boolean {
            if (!m)
                return false;
            return key in m;
        }

        static Get(m: any, key: string): any {
            return m[key];
        }

        static Set(m: any, key: string, value: any) {
            m[key] = value;
        }

        // @sort 是否打开字典序
        static ToMap(obj: IndexedObject, sort = true): Map<string, any> {
            let r = new Map<string, any>();
            let keys = Object.keys(obj);
            if (sort)
                keys.sort();
            keys.forEach(e => {
                r.set(e, obj[e]);
            });
            return r;
        }

        static Length(obj: any): number {
            return Object.keys(obj).length;
        }

        static RemoveKeyByFilter(obj: IndexedObject, filter: (val: any, key: any) => boolean): IndexedObject {
            let keys = Object.keys(obj);
            for (let i = 0, l = keys.length; i < l; ++i) {
                let key = keys[i];
                let val = obj[key];
                if (filter(val, key)) {
                    delete obj[key];
                    let r = Object.create(null);
                    r[key] = val;
                    return r;
                }
            }
            return null;
        }
    }

    /** set 的工具类 */
    export class SetT {
        /** 删除对象 */
        static RemoveObject<T>(s: Set<T>, o: T) {
            s.delete(o);
        }

        /** 复制 */
        static Clone<T>(s: Set<T>): Set<T> {
            let r = new Set<T>();
            (<any>s).forEach((o: T) => {
                r.add(o);
            }, this);
            return r;
        }

        /** 转换到 array */
        static ToArray<T>(s: Set<T>): Array<T> {
            let r = new Array<T>();
            (<any>s).forEach((o: T) => {
                r.push(o);
            }, this);
            return r;
        }

        /** 清空 */
        static Clear<T>(s: Set<T>, cb?: (o: T) => void, ctx?: any) {
            if (s.size == 0)
                return;
            if (cb)
                (<any>s).forEach(cb, ctx);
            s.clear();
        }

        /** 带保护的清空，以避免边际效应 */
        static SafeClear<T>(s: Set<T>, cb: (o: T) => void, ctx?: any) {
            if (s.size == 0)
                return;
            let ns: any = SetT.Clone(s);
            s.clear();
            ns.forEach(cb, ctx);
        }
    }

    /** map 的工具类 */
    export class MapT {

        static At<K, V>(m: Map<K, V>, idx: number, def = null): V {
            if (idx >= m.size || idx < 0)
                return def;
            let iter = m.values();
            let cur = iter.next();
            while (!cur.done && idx--) {
                cur = iter.next();
            }
            return cur.value;
        }

        static Get<K, V>(m: Map<K, V>, k: K, def?: V): V {
            if (m.has(k))
                return m.get(k);
            return def;
        }

        static ToObject<K, V>(m: Map<K, V>): IndexedObject {
            let r: IndexedObject = {};
            m.forEach((v, k: any) => {
                r[k] = v;
            });
            return r;
        }

        // 对某个key
        static Inc<K, V>(m: Map<K, V>, key: K, v: V): V {
            if (m.has(key)) {
                let cur = <any>m.get(key);
                cur += v;
                m.set(key, cur);
                return cur;
            }
            m.set(key, v);
            return v;
        }

        static Sum<K, V, R>(m: Map<K, V>, proc: (v: V, k: K) => R): R {
            let r: any = null;
            let idx = 0;
            m.forEach((v, k) => {
                if (idx++ == 0)
                    r = proc(v, k);
                else
                    r += proc(v, k);
            });
            return r;
        }

        static Max<K, V>(m: Map<K, V>, proc: (v: V, k: K) => V): V {
            let cur: V;
            let obj: V;
            let idx = 0;
            m.forEach((v, k) => {
                if (idx++ == 0) {
                    cur = proc(v, k);
                    obj = v;
                    return;
                }
                let t = proc(v, k);
                if (ObjectT.Compare(cur, t) == COMPARERESULT.LESS) {
                    cur = t;
                    obj = v;
                }
            });
            return obj;
        }

        static Min<K, V>(m: Map<K, V>, proc: (v: V, k: K) => V): V {
            let cur: V;
            let obj: V;
            let idx = 0;
            m.forEach((v, k) => {
                if (idx++ == 0) {
                    cur = proc(v, k);
                    obj = v;
                    return;
                }
                let t = proc(v, k);
                if (ObjectT.Compare(t, cur) == COMPARERESULT.LESS) {
                    cur = t;
                    obj = v;
                }
            });
            return obj;
        }

        static Foreach<K, V>(m: Map<K, V>, proc: (v: V, k: K) => boolean): boolean {
            let iter = m.entries();
            let each = iter.next();
            while (!each.done) {
                if (!proc(each.value[1], each.value[0]))
                    return false;
                each = iter.next();
            }
            return true;
        }

        static SeqForeach<K, V, R>(m: Map<K, V>, proc: (v: V, k: K, next: (ret?: R) => void) => void, complete: (ret?: R) => void) {
            let iter = m.entries();

            function next(ret?: R) {
                let val = iter.next();
                if (!val.done) {
                    proc(val.value[1], val.value[0], next);
                } else {
                    complete(ret);
                }
            }

            next();
        }

        static QueryObjects<K, V>(m: Map<K, V>, proc: (v: V, k: K) => boolean): Array<V> {
            let r = new Array();
            m.forEach((v, k) => {
                if (proc(v, k))
                    r.push(v);
            });
            return r;
        }

        static Keys<K, V>(m: Map<K, V>): K[] {
            let r = new Array<K>();
            m.forEach((v, k) => {
                r.push(k);
            });
            return r;
        }

        static Values<K, V, R>(m: Map<K, V>, proc?: (v: V, k: K) => R, skipnull = false): R[] {
            let r = new Array<R>();
            if (proc) {
                m.forEach((v, k) => {
                    let t = proc(v, k);
                    if (skipnull && !t)
                        return;
                    r.push(t);
                });
            } else {
                m.forEach((v) => {
                    r.push(<any>v);
                });
            }
            return r;
        }

        static ValueAtIndex<K, V>(m: Map<K, V>, idx: number, def?: V): V {
            let iter = m.values();
            let cur = iter.next();
            while (!cur.done && idx--) {
                cur = iter.next();
            }
            return (idx > 0 || cur.done) ? def : cur.value;
        }

        static FromArray<K, V, R>(arr: R[], proc: (map: Map<K, V>, obj: R, idx?: number) => void, inm?: Map<K, V>): Map<K, V> {
            if (!inm)
                inm = new Map<K, V>();
            arr.forEach((e, idx) => {
                proc(inm, e, idx);
            });
            return inm;
        }
    }

    export class Sort {
        static NumberAsc(l: number, r: number): number {
            return l - r;
        }

        static NumberDsc(l: number, r: number): number {
            return r - l;
        }
    }

    export interface IListRecord {
        next?: IListRecord;
        previous?: IListRecord;
        value: any;
    }

    /** 链表 */
    export class List<T> {
        constructor() {
        }

        private _top: IListRecord;
        length: number = 0;

        push(o: T) {
            this.length += 1;
            if (!this._top) {
                this._top = {value: o};
                return;
            }
            let cur = {value: o, previous: this._top};
            this._top.next = cur;
            this._top = cur;
        }
    }

    /** 颜色类 */
    export class Color {
        static _1_255 = 0.00392156862745098;

        constructor(rgb: number, alpha: number = 0xff) {
            if (alpha > 0 && alpha < 1)
                alpha *= 0xff;
            this.rgb = rgb & 0xffffff;
            this.alpha = alpha & 0xff;
        }

        rgb: number = 0;
        alpha: number = 0xff;

        clone(): Color {
            return new Color(this.rgb, this.alpha);
        }

        get argb(): number {
            return this.rgb | (this.alpha << 24);
        }

        set argb(v: number) {
            this.rgb = v & 0xffffff;
            this.alpha = (v >> 24) & 0xff;
        }

        get rgba(): number {
            return (this.rgb << 8) | this.alpha;
        }

        set rgba(v: number) {
            this.rgb = (v >> 8) & 0xffffff;
            this.alpha = v & 0xff;
        }

        /** 位于 [0, 1] 的 alpha */
        get alphaf(): number {
            return this.alpha * Color._1_255;
        }

        set alphaf(val: number) {
            this.alpha = (val * 255) >> 0;
        }

        /** 16进制的颜色 */
        set red(val: number) {
            this.rgb &= 0x00ffff;
            this.rgb |= (val & 0xff) << 16;
        }

        get red(): number {
            return this.rgb >> 16;
        }

        set redf(val: number) {
            this.red = val * 255;
        }

        get redf(): number {
            return this.red * Color._1_255;
        }

        /** 16进制的颜色 */
        set green(val: number) {
            this.rgb &= 0xff00ff;
            this.rgb |= (val & 0xff) << 8;
        }

        get green(): number {
            return (this.rgb >> 8) & 0xff;
        }

        set greenf(val: number) {
            this.green = val * 255;
        }

        get greenf(): number {
            return this.green * Color._1_255;
        }

        /** 16进制的颜色 */
        set blue(val: number) {
            this.rgb &= 0xffff00;
            this.rgb |= val & 0xff;
        }

        get blue(): number {
            return this.rgb & 0xff;
        }

        set bluef(val: number) {
            this.blue = val * 255;
        }

        get bluef(): number {
            return this.blue * Color._1_255;
        }

        setAlpha(v: number): this {
            this.alpha = v;
            return this;
        }

        setAlphaf(v: number): this {
            this.alphaf = v;
            return this;
        }

        setRed(v: number): this {
            this.red = v;
            return this;
        }

        setRedf(v: number): this {
            this.redf = v;
            return this;
        }

        setGreen(v: number): this {
            this.green = v;
            return this;
        }

        setGreenf(v: number): this {
            this.greenf = v;
            return this;
        }

        setBlue(v: number): this {
            this.blue = v;
            return this;
        }

        setBluef(v: number): this {
            this.bluef = v;
            return this;
        }

        scale(s: number, alpha = false): Color {
            this.red *= s;
            this.green *= s;
            this.blue *= s;
            if (alpha)
                this.alpha *= s;
            return this;
        }

        /** 反色 */
        invert(): Color {
            this.rgb = 0xffffff - this.rgb;
            return this;
        }

        // 与定义的颜色，注意不要在业务中修改数值，如果要修改请使用clone先复制一份
        static White = new Color(0xffffff);
        static Black = new Color(0);
        static Gray = new Color(0x3f3f3f);
        static Red = new Color(0xff0000);
        static Green = new Color(0x00ff00);
        static Blue = new Color(0x0000ff);
        static Yellow = new Color(0xffff00);
        static Transparent = new Color(0, 0);

        static RGBf(r: number, g: number, b: number, a: number = 1): Color {
            return new Color((r * 255) << 16 |
                (g * 255) << 8 |
                (b * 255) << 0,
                (a * 255) << 0);
        }

        static RGB(r: number, g: number, b: number, a: number = 1): Color {
            return new Color((r & 255) << 16 |
                (g & 255) << 8 |
                (b & 255) << 0,
                (a * 255) << 0);
        }

        static ARGB(v: number): Color {
            return new Color(v, v >> 24);
        }

        static RGBA(v: number): Color {
            return new Color(v >> 8, v);
        }

        /** 随机一个颜色 */
        static Random(a: number = 0xff): Color {
            return new Color(Random.Rangei(0, 0xffffff), a);
        }

        isEqual(r: Color): boolean {
            return this.rgb == r.rgb &&
                this.alpha == r.alpha;
        }
    }

    // 第一位如果是0，为了兼容性，则代表alpha是1，而不是0，如果需要设定alpha，请直接使用 Color 对象
    export type ARGBValue = number;
    export type ColorType = Color | ARGBValue | string;

    /** 颜色数值，rgb为24位，alpha规约到0-1的float */
    export function GetColorComponent(c: ColorType): number[] {
        switch (typeof (c)) {
            case 'number': {
                let rgb = (<number>c) & 0xffffff;
                let a = (((<number>c) >> 24) & 0xff) * Color._1_255;
                return [rgb, a > 0 ? a : 1];
            }
            case 'string': {
                let s = (<string>c).toLowerCase();
                switch (s) {
                    case 'red':
                        return [0xff0000, 1];
                    case 'green':
                        return [0x00ff00, 1];
                    case 'blue':
                        return [0x0000ff, 1];
                    case 'white':
                        return [0xffffff, 1];
                    case 'black':
                        return [0, 1];
                    default: {
                        s = s.replace('#', '0x');
                        let v = toInt(s);
                        let rgb = v & 0xffffff;
                        let a = ((v >> 24) & 0xff) * Color._1_255;
                        return [rgb, a > 0 ? a : 1];
                    }
                }
            }
            default: {
                return [(<Color>c).rgb, (<Color>c).alphaf];
            }
        }
    }

    /** 线段 */
    export class Line {
        constructor(color: ColorType = 0, width: number = 1) {
            this.color = color;
            this.width = width;
        }

        /** 颜色 */
        color: ColorType;

        /** 宽度 */
        width: number;

        /** 平滑 */
        smooth: boolean = true;

        /** 起点 */
        startPoint: Point;

        /** 终点 */
        endPoint: Point;

        get length(): number {
            return Math.sqrt(this.lengthSq);
        }

        get lengthSq(): number {
            let self = this;
            let xsq = self.endPoint.x - self.startPoint.x;
            xsq *= xsq;
            let ysq = self.endPoint.y - self.startPoint.y;
            ysq *= ysq;
            return xsq + ysq;
        }

        get deltaX(): number {
            return this.endPoint.x - this.startPoint.x;
        }

        get deltaY(): number {
            return this.endPoint.y - this.startPoint.y;
        }

        get deltaPoint(): Point {
            return new Point(this.endPoint.x - this.startPoint.x,
                this.endPoint.y - this.startPoint.y);
        }

        // 实例化线段
        static Segment(spt: Point, ept: Point): Line {
            let r = new Line();
            r.startPoint = spt;
            r.endPoint = ept;
            return r;
        }
    }

    /** 百分比对象 */
    export class Percentage {
        max: number;
        value: number;

        constructor(max: number = 1, val: number = 0) {
            this.max = max;
            this.value = val;
        }

        reset(max: number = 1, val: number = 0): Percentage {
            this.max = max;
            this.value = val;
            return this;
        }

        copy(r: Percentage): Percentage {
            this.max = r.max;
            this.value = r.value;
            return this;
        }

        get percent(): number {
            if (this.max == 0)
                return 1;
            let r = this.value / this.max;
            if (isNaN(r))
                return 0;
            return r;
        }

        set percent(v: number) {
            this.value = this.max * v;
        }

        get safepercent(): number {
            let p = this.percent;
            if (p < 0)
                return 0;
            if (p > 1)
                return 1;
            return p;
        }

        set safepercent(v: number) {
            if (v < 0)
                v = 0;
            if (v > 1)
                v = 1;
            this.percent = this.max * v;
        }

        /** 剩余的比率 */
        get left(): number {
            return 1 - this.safepercent;
        }

        toString(): string {
            return formatString('%f/%f = %f%%', this.value, this.max, this.percent * 100);
        }

        valueOf(): number {
            return this.percent;
        }
    }

    export class Mask {
        static isset<T>(mask: T, value: T): boolean {
            return (<any>value & <any>mask) == <any>mask;
        }

        static unset<T>(mask: T, value: T): T {
            if (this.isset(mask, value))
                return <any>((<any>value) & (~<any>mask));
            return value;
        }

        static set<T>(mask: T, value: T): T {
            if (this.isset(mask, value))
                return value;
            return <any>(<any>value | <any>mask);
        }
    }

    export enum Direction {
        UNKNOWN = 0,

        CENTER = 0x1, // 居中
        UP = 0x10, // 向上
        DOWN = 0x100, // 向下
        LEFT = 0x20, // 向左
        RIGHT = 0x200, // 向右

        HOV = 0x220, // 水平
        VEC = 0x110, // 垂直
    };

    export function DirectionIsPortrait(d: Direction) {
        return d == Direction.UP || d == Direction.DOWN;
    }

    export function DirectionIsLandscape(d: Direction) {
        return d == Direction.LEFT || d == Direction.RIGHT;
    }

    export function DirectionAngle(l: Direction, r: Direction): Angle {
        return Angle.DIRECTION(r).sub(Angle.DIRECTION(l));
    }

    export function DirectionFromSize(w: number, h: number): Direction {
        return w > h ? Direction.LEFT : Direction.UP;
    }

    export function DirectionToString(d: Direction): string {
        let c = [];
        if (nn.Mask.isset(Direction.UP, d))
            c.push('up');
        if (nn.Mask.isset(Direction.DOWN, d))
            c.push('down');
        if (nn.Mask.isset(Direction.LEFT, d))
            c.push('left');
        if (nn.Mask.isset(Direction.RIGHT, d))
            c.push('right');
        return c.join(',');
    }

    export function DirectionFromString(s: string): Direction {
        if (!s)
            return 0;
        let c = s.toLowerCase().split(',');
        let r = 0;
        if (ArrayT.Contains(c, 'up'))
            r |= Direction.UP;
        if (ArrayT.Contains(c, 'down'))
            r |= Direction.DOWN;
        if (ArrayT.Contains(c, 'left'))
            r |= Direction.LEFT;
        if (ArrayT.Contains(c, 'right'))
            r |= Direction.RIGHT;
        return r;
    }

    export class Range {
        location: number;
        length: number;

        constructor(location?: number, length?: number) {
            this.location = location;
            this.length = length;
        }

        contains(val: number): boolean {
            return val >= this.location && val <= this.max();
        }

        /** 交叉判定 */
        intersects(r: Range): boolean {
            return (Math.max(this.max(), r.max()) - Math.min(this.location, r.location))
                < (this.length + r.length);
        }

        max(): number {
            return this.location + this.length;
        }

        static Intersects(loc0: number, len0: number, loc1: number, len1: number) {
            return (Math.max(loc0 + len0, loc1 + len1) - Math.min(loc0, loc1))
                < (len0 + len1);
        }
    }

    /** 边距 */
    export class EdgeInsets {
        top: number;
        bottom: number;
        left: number;
        right: number;

        constructor(t = 0, b = 0, l = 0, r = 0) {
            this.top = t;
            this.bottom = b;
            this.left = l;
            this.right = r;
        }

        static All(v: number): EdgeInsets {
            return new EdgeInsets(v, v, v, v);
        }

        add(t: number, b: number, l: number, r: number): EdgeInsets {
            this.top += t;
            this.bottom += b;
            this.left += l;
            this.right += r;
            return this;
        }

        scale(v: number): EdgeInsets {
            this.top *= v;
            this.bottom *= v;
            this.left *= v;
            this.right *= v;
            return this;
        }

        addEdgeInsets(r: EdgeInsets): EdgeInsets {
            if (r == null)
                return this;
            this.top += r.top;
            this.bottom += r.bottom;
            this.left += r.left;
            this.right += r.right;
            return this;
        }

        get width(): number {
            return this.left + this.right;
        }

        get height(): number {
            return this.top + this.bottom;
        }

        static Width(o: EdgeInsets): number {
            if (o == null)
                return 0;
            return o.width;
        }

        static Height(o: EdgeInsets): number {
            if (o == null)
                return 0;
            return o.height;
        }

        static Top(o: EdgeInsets): number {
            return o ? o.top : 0;
        }

        static Left(o: EdgeInsets): number {
            return o ? o.left : 0;
        }
    }

    /** 点 */
    export class Point {
        constructor(x: number = 0, y: number = 0) {
            this.x = x;
            this.y = y;
        }

        x: number;
        y: number;

        reset(x: number = 0, y: number = 0): this {
            this.x = x;
            this.y = y;
            return this;
        }

        clone(): this {
            let r = InstanceNewObject(this);
            r.x = this.x;
            r.y = this.y;
            return r;
        }

        copy(r: Point): this {
            this.x = r.x;
            this.y = r.y;
            return this;
        }

        addPoint(r: Point): this {
            this.x += r.x;
            this.y += r.y;
            return this;
        }

        subPoint(r: Point): this {
            this.x -= r.x;
            this.y -= r.y;
            return this;
        }

        add(x?: number, y?: number): this {
            if (x)
                this.x += x;
            if (y)
                this.y += y;
            return this;
        }

        multiPoint(r: Point): this {
            this.x *= r.x;
            this.y *= r.y;
            return this;
        }

        scale(v: number, vy?: number): this {
            if (vy == null)
                vy = v;
            this.x *= v;
            this.y *= vy;
            return this;
        }

        isEqual(r: Point): boolean {
            return this.x == r.x &&
                this.y == r.y;
        }

        invert(): this {
            let t = this.x;
            this.x = this.y;
            this.y = t;
            return this;
        }

        static AnchorCC = new Point(0.5, 0.5);
        static AnchorLT = new Point(0, 0);
        static AnchorLC = new Point(0, 0.5);
        static AnchorLB = new Point(0, 1);
        static AnchorTC = new Point(0.5, 0);
        static AnchorBC = new Point(0.5, 1);
        static AnchorRT = new Point(1, 0);
        static AnchorRC = new Point(1, 0.5);
        static AnchorRB = new Point(1, 1);

        toString(): string {
            return this.x + ',' + this.y;
        }

        fromString(s: string) {
            if (s == null) {
                this.x = this.y = 0;
                return;
            }
            let c = s.split(',');
            this.x = toNumber(c[0]);
            this.y = toNumber(c[1]);
        }

        applyScaleFactor(): this {
            this.x *= ScaleFactorX;
            this.y *= ScaleFactorY;
            return this;
        }

        unapplyScaleFactor(): this {
            this.x *= ScaleFactorDeX;
            this.y *= ScaleFactorDeY;
            return this;
        }

        static Zero = new Point();
    }

    /** 点云 */
    export class PointCloud {
        protected _points = new Array<Point>();
        protected _minpt = new Point();
        protected _maxpt = new Point();

        add(pt: Point) {
            if (this._points.length == 0) {
                this._minpt.reset(MAX_INT, MAX_INT);
                this._maxpt.reset();
            }

            if (this._minpt.x > pt.x)
                this._minpt.x = pt.x;
            if (this._minpt.y > pt.y)
                this._minpt.y = pt.y;
            if (this._maxpt.x < pt.x)
                this._maxpt.x = pt.x;
            if (this._maxpt.y < pt.y)
                this._maxpt.y = pt.y;

            this._points.push(pt);
        }

        get boundingBox(): Rect {
            return new Rect(this._minpt.x, this._minpt.y,
                this._maxpt.x - this._minpt.x, this._maxpt.y - this._minpt.y);
        }
    }

    /** 大小 */
    export class Size extends Point {
        constructor(w: number = 0, h: number = 0) {
            super(w, h);
        }

        get width(): number {
            return this.x;
        }

        set width(w: number) {
            this.x = w;
        }

        get height(): number {
            return this.y;
        }

        set height(h: number) {
            this.y = h;
        }

        toRect(): Rect {
            return new Rect(0, 0, this.width, this.height);
        }

        addSize(r: Size): Size {
            this.x += r.x;
            this.y += r.y;
            return this;
        }

        static Zero = new Size();
    }

    /** 多边形 */
    export class Polygon {
        add(pt: Point): Polygon {
            this._pts.push(pt);
            return this;
        }

        clear(): Polygon {
            this._pts.length = 0;
            return this;
        }

        get length(): number {
            return this._pts.length;
        }

        _pts = new Array<Point>();
    }

    export enum FillMode {
        // 几何拉伸
        STRETCH = 0x1000,

        // 居中
        CENTER = 0x2000,

        // 不变形拉伸(留黑边)
        ASPECTSTRETCH = 0x3000,

        // 不变形填充(无黑边，有裁剪)
        ASPECTFILL = 0x4000,

        // 不变形近似拉伸(无黑边使用阈值拉伸)
        NEARESTSTRETCH = 0x5000,

        // 置于区域中
        MAPIN = 0x6000,

        // 附加参数
        NOBORDER = 0x1, // 没有黑边，只在CENTER时起作用
        MAXIMUM = 0x2, // 控制最大尺寸, 不设置代表控制最小尺寸
        NEAREST = 0x4, // 近似调整

        MASK_MAJOR = 0xf000,
    };

    export function FillModeString(fm: FillMode) {
        let v = [];
        switch (fm & FillMode.MASK_MAJOR) {
            case FillMode.STRETCH:
                v.push("STRETCH");
                break;
            case FillMode.CENTER:
                v.push("CENTER");
                break;
            case FillMode.ASPECTSTRETCH:
                v.push("ASPECTSTRETCH");
                break;
            case FillMode.NEARESTSTRETCH:
                v.push("NEARESTSTRETCH");
                break;
            case FillMode.ASPECTFILL:
                v.push("ASPECTFILL");
                break;
        }
        if (Mask.isset(FillMode.NOBORDER, fm))
            v.push("NOBORDER");
        if (Mask.isset(FillMode.MAXIMUM, fm))
            v.push("MAXIMUM");
        if (Mask.isset(FillMode.NEAREST, fm))
            v.push("NEAREST");
        return v.join("|");
    }

    // 相对坐标使用数值类型
    export type rnumber = number | string;

    /** 相对尺寸 */
    export class RRect {
        constructor(p: { top?: rnumber; bottom?: rnumber; left?: rnumber; right?: rnumber; },
                    width: rnumber, height: rnumber) {
            this.left = p.left;
            this.right = p.right;
            this.top = p.top;
            this.bottom = p.bottom;
            this.width = width;
            this.height = height;
        }

        left: rnumber;
        right: rnumber;
        top: rnumber;
        bottom: rnumber;
        width: rnumber;
        height: rnumber;

        private rvalue(v: rnumber, p: number): number {
            if (v == null)
                return null;
            return typeof (<any>v) == 'number' ?
                <number>v :
                <any>v * p;
        }

        toRect(prc: Rect): Rect {
            if (ISDEBUG) {
                if ((this.top && this.bottom) ||
                    (this.left && this.right))
                    warn("不能同时设置同类属性");
            }
            let rc = new Rect(prc.x, prc.y,
                this.rvalue(this.width, prc.width),
                this.rvalue(this.height, prc.height));
            if (this.top != null)
                rc.y += this.rvalue(this.top, prc.height);
            else if (this.bottom != null)
                rc.y = prc.maxY - this.rvalue(this.bottom, prc.height);
            if (this.left != null)
                rc.x += this.rvalue(this.left, prc.width);
            else if (this.right != null)
                rc.x = prc.maxX - this.rvalue(this.right, prc.width);
            return rc;
        }
    }

    export enum POSITION {
        LEFT_TOP = 0,
        LEFT_CENTER = 1,
        LEFT_BOTTOM = 2,
        TOP_CENTER = 3,
        CENTER = 4,
        BOTTOM_CENTER = 5,
        RIGHT_TOP = 6,
        RIGHT_CENTER = 7,
        RIGHT_BOTTOM = 8,
    };

    export enum EDGE {
        START = 1,
        MIDDLE = 0,
        END = 2
    };

    /** 尺寸 */
    export class Rect {
        constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        }

        x: number;
        y: number;
        width: number;
        height: number;

        static Zero = new Rect();
        static Max = new Rect(-999999, -999999, 999999, 999999);

        get isnan(): boolean {
            return isNaN(this.x) || isNaN(this.y) || isNaN(this.width) || isNaN(this.height);
        }

        get position(): Point {
            return new Point(this.x, this.y);
        }

        set position(p: Point) {
            this.x = p.x;
            this.y = p.y;
        }

        origin(anchor?: Point): Point {
            if (anchor)
                return new Point(this.x + this.width * anchor.x,
                    this.y + this.height * anchor.y);
            return new Point(this.x, this.y);
        }

        setOrigin(pt: Point, anchor?: Point): this {
            if (anchor) {
                this.x = pt.x - this.width * anchor.x;
                this.y = pt.y - this.height * anchor.y;
            } else {
                this.x = pt.x;
                this.y = pt.y;
            }
            return this;
        }

        alignTo(rc: Rect, posto: POSITION, posmy?: POSITION): this {
            if (posmy == null)
                posmy = posto;
            this.setPosition(rc.getPosition(posto), posmy);
            return this;
        }

        edgeTo(rc: Rect, edge: EDGE): this {
            switch (edge) {
                case EDGE.START: {
                    this.setLeftTop(rc.leftTop);
                }
                    break;
                case EDGE.MIDDLE: {
                    this.setCenter(rc.center);
                }
                    break;
                case EDGE.END: {
                    this.setRightBottom(rc.rightBottom);
                }
                    break;
            }
            return this;
        }

        getPosition(pos: POSITION): Point {
            switch (pos) {
                case POSITION.LEFT_TOP:
                    return this.leftTop;
                case POSITION.LEFT_CENTER:
                    return this.leftCenter;
                case POSITION.LEFT_BOTTOM:
                    return this.leftBottom;
                case POSITION.CENTER:
                    return this.center;
                case POSITION.TOP_CENTER:
                    return this.topCenter;
                case POSITION.BOTTOM_CENTER:
                    return this.bottomCenter;
                case POSITION.RIGHT_TOP:
                    return this.rightTop;
                case POSITION.RIGHT_CENTER:
                    return this.rightCenter;
                case POSITION.RIGHT_BOTTOM:
                    return this.rightBottom;
            }
        }

        setPosition(pt: Point, pos: POSITION) {
            switch (pos) {
                case POSITION.LEFT_TOP:
                    this.leftTop = pt;
                    break;
                case POSITION.LEFT_CENTER:
                    this.leftCenter = pt;
                    break;
                case POSITION.LEFT_BOTTOM:
                    this.leftBottom = pt;
                    break;
                case POSITION.CENTER:
                    this.center = pt;
                    break;
                case POSITION.TOP_CENTER:
                    this.topCenter = pt;
                    break;
                case POSITION.BOTTOM_CENTER:
                    this.bottomCenter = pt;
                    break;
                case POSITION.RIGHT_TOP:
                    this.rightTop = pt;
                    break;
                case POSITION.RIGHT_CENTER:
                    this.rightCenter = pt;
                    break;
                case POSITION.RIGHT_BOTTOM:
                    this.rightBottom = pt;
                    break;
            }
        }

        get size(): Size {
            return new Size(this.width, this.height);
        }

        set size(v: Size) {
            this.width = v.width;
            this.height = v.height;
        }

        setSize(w: number, h: number): this {
            this.width = w;
            this.height = h;
            return this;
        }

        setX(x: number): this {
            this.x = x;
            return this;
        }

        setY(y: number): this {
            this.y = y;
            return this;
        }

        setWidth(w: number): this {
            this.width = w;
            return this;
        }

        setHeight(h: number): this {
            this.height = h;
            return this;
        }

        integral(): this {
            this.x = Integral(this.x);
            this.y = Integral(this.y);
            this.width = Integral(this.width);
            this.height = Integral(this.height);
            return this;
        }

        invert(): this {
            let self = this;
            let t = self.x;
            self.x = self.y;
            self.y = t;
            t = self.width;
            self.width = self.height;
            self.height = t;
            return self;
        }

        clone(): this {
            let self = this;
            let ret = InstanceNewObject(self);
            ret.x = self.x;
            ret.y = self.y;
            ret.width = self.width;
            ret.height = self.height;
            return ret;
        }

        copy(r: Rect): this {
            let self = this;
            self.x = r.x;
            self.y = r.y;
            self.width = r.width;
            self.height = r.height;
            return self;
        }

        applyEdgeInsets(ei: EdgeInsets): this {
            if (ei == null)
                return this;
            this.x += ei.left;
            this.y += ei.top;
            this.width -= ei.left + ei.right;
            this.height -= ei.top + ei.bottom;
            return this;
        }

        unapplyEdgeInsets(ei: EdgeInsets): this {
            if (ei == null)
                return this;
            this.x -= ei.left;
            this.y -= ei.top;
            this.width += ei.left + ei.right;
            this.height += ei.top + ei.bottom;
            return this;
        }

        applyAnchor(ax: number, ay: number): this {
            this.x -= this.width * ax;
            this.y -= this.height * ay;
            return this;
        }

        unapplyAnchor(ax: number, ay: number): this {
            this.x += this.width * ax;
            this.y += this.height * ay;
            return this;
        }

        containsPoint(pt: Point): boolean {
            return pt.x >= this.x && pt.x <= this.x + this.width &&
                pt.y >= this.y && pt.y <= this.y + this.height;
        }

        static ContainsPoint(x: number, y: number, rx: number, ry: number, rw: number, rh: number) {
            return x >= rx && x <= rx + rw &&
                y >= ry && y <= ry + rh;
        }

        static Area(o: any): number {
            return o.width * o.height;
        }

        static Swap(l: any, r: any) {
            let x = l.x, y = l.y, w = l.width, h = l.height;
            l.x = r.x;
            l.y = r.y;
            l.width = r.width;
            l.height = r.height;
            r.x = x;
            r.y = y;
            r.width = w;
            r.height = h;
        }

        maxSize(w?: number, h?: number): this {
            if (w != undefined && this.width > w)
                this.width = w;
            if (h != undefined && this.height > h)
                this.height = h;
            return this;
        }

        minSize(w?: number, h?: number): this {
            if (w != undefined && this.width < w)
                this.width = w;
            if (h != undefined && this.height < h)
                this.height = h;
            return this;
        }

        isEqual(r: Rect): boolean {
            return this.x == r.x && this.y == r.y &&
                this.width == r.width && this.height == r.height;
        }

        add(x: number, y: number, w?: number, h?: number): this {
            this.x += x;
            this.y += y;
            if (w)
                this.width += w;
            if (h)
                this.height += h;
            return this;
        }

        union(r: Rect): this {
            let maxX = this.maxX;
            let maxY = this.maxY;
            if (this.x > r.x)
                this.x = r.x;
            if (this.y > r.y)
                this.y = r.y;
            if (maxX < r.maxX)
                this.width += r.maxX - maxX;
            if (maxY < r.maxY)
                this.height += r.maxY - maxY;
            return this;
        }

        deflate(w: number, h: number): this {
            return this.add(w * 0.5, h * 0.5,
                -w, -h);
        }

        deflateR(rw: number, rh: number): this {
            return this.deflate(this.width * rw, this.height * rh);
        }

        scale(s: number, anchor?: Point): this {
            if (anchor == undefined) {
                this.x *= s;
                this.y *= s;
            } else {
                this.x -= (this.width * s - this.width) * anchor.x;
                this.y -= (this.height * s - this.height) * anchor.y;
            }
            this.width *= s;
            this.height *= s;
            return this;
        }

        // 外接圆的半径
        get outterRadius(): number {
            let len = Math.max(this.width, this.height);
            return Math.sqrt(len * len * 2) / 2;
        }

        multiRect(x: number, y: number, w: number, h: number): this {
            if (x != null)
                this.x *= x;
            if (y != null)
                this.y *= y;
            if (w != null)
                this.width *= w;
            if (h != null)
                this.height *= h;
            return this;
        }

        scaleWidth(w: number): this {
            this.width *= w;
            return this;
        }

        scaleHeight(h: number): this {
            this.height *= h;
            return this;
        }

        clipCenter(w?: number, h?: number): this {
            if (w) {
                let d = this.width - w;
                this.x += d * 0.5;
                this.width -= d;
            }
            if (h) {
                let d = this.height - h;
                this.y += d * 0.5;
                this.height -= d;
            }
            return this;
        }

        reset(x: number = 0, y: number = 0, w: number = 0, h: number = 0): this {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            return this;
        }

        get minX(): number {
            return this.x;
        }

        set minX(v: number) {
            this.x = v;
        }

        get maxX(): number {
            return this.x + this.width;
        }

        set maxX(v: number) {
            this.x = v - this.width;
        }

        get minY(): number {
            return this.y;
        }

        set minY(v: number) {
            this.y = v;
        }

        get maxY(): number {
            return this.y + this.height;
        }

        set maxY(v: number) {
            this.y = v - this.height;
        }

        get minL(): number {
            return Math.min(this.width, this.height);
        }

        get maxL(): number {
            return Math.max(this.width, this.height);
        }

        toPolygon(): Polygon {
            return new Polygon()
                .add(new Point(this.x, this.y))
                .add(new Point(this.x, this.y + this.height))
                .add(new Point(this.x + this.width, this.y + this.height))
                .add(new Point(this.x + this.width, this.y));
        }

        offset(pt: Point): this {
            this.x += pt.x;
            this.y += pt.y;
            return this;
        }

        get center(): Point {
            return new Point(this.x + this.width * 0.5,
                this.y + this.height * 0.5);
        }

        set center(pt: Point) {
            this.x = pt.x - this.width * 0.5;
            this.y = pt.y - this.height * 0.5;
        }

        setCenter(pt: Point): this {
            this.center = pt;
            return this;
        }

        get leftTop(): Point {
            return new Point(this.x, this.y);
        }

        set leftTop(pt: Point) {
            this.x = pt.x;
            this.y = pt.y;
        }

        setLeftTop(pt: Point): this {
            this.leftTop = pt;
            return this;
        }

        get leftBottom(): Point {
            return new Point(this.x, this.y + this.height);
        }

        set leftBottom(pt: Point) {
            this.x = pt.x;
            this.y = pt.y - this.height;
        }

        setLeftBottom(pt: Point): this {
            this.leftBottom = pt;
            return this;
        }

        get rightTop(): Point {
            return new Point(this.x + this.width, this.y);
        }

        set rightTop(pt: Point) {
            this.x = pt.x - this.width;
            this.y = pt.y;
        }

        setRightTop(pt: Point): this {
            this.rightTop = pt;
            return this;
        }

        get rightBottom(): Point {
            return new Point(this.x + this.width, this.y + this.height);
        }

        set rightBottom(pt: Point) {
            this.x = pt.x - this.width;
            this.y = pt.y - this.height;
        }

        setRightBottom(pt: Point): this {
            this.rightBottom = pt;
            return this;
        }

        get topCenter(): Point {
            return new Point(this.x + this.width * 0.5, this.y);
        }

        set topCenter(pt: Point) {
            this.x = pt.x - this.width * 0.5;
            this.y = pt.y;
        }

        setTopCenter(pt: Point): this {
            this.topCenter = pt;
            return this;
        }

        get bottomCenter(): Point {
            return new Point(this.x + this.width * 0.5, this.y + this.height);
        }

        set bottomCenter(pt: Point) {
            this.x = pt.x - this.width * 0.5;
            this.y = pt.y - this.height;
        }

        setBottomCenter(pt: Point): this {
            this.bottomCenter = pt;
            return this;
        }

        get leftCenter(): Point {
            return new Point(this.x, this.y + this.height * 0.5);
        }

        set leftCenter(pt: Point) {
            this.x = pt.x;
            this.y = pt.y - this.height * 0.5;
        }

        setLeftCenter(pt: Point): this {
            this.leftCenter = pt;
            return this;
        }

        get rightCenter(): Point {
            return new Point(this.x + this.width, this.y + this.height * 0.5);
        }

        set rightCenter(pt: Point) {
            this.x = pt.x - this.width;
            this.y = pt.y - this.height * 0.5;
        }

        setRightCenter(pt: Point): this {
            this.rightCenter = pt;
            return this;
        }

        toString(): string {
            return this.x + "," + this.y + "," + this.width + "," + this.height;
        }

        // 近似填充时采用的阈值
        private _nearest: number;
        get nearest(): number {
            return this._nearest == null ? 0.1 : this._nearest;
        }

        /** 将当前的rc映射到目标rc中，默认会居中结果 */
        fill(to: Rect, mode: FillMode): this {
            let self = this;
            if (self.width == 0 || self.height == 0)
                return self;

            let needcenter = true;

            switch (mode & FillMode.MASK_MAJOR) {
                case FillMode.STRETCH: {
                    self.copy(to);
                }
                    break;
                case FillMode.MAPIN: {
                    if (this.maxX > to.maxX)
                        this.maxX = to.maxX;
                    if (this.maxY > to.maxY)
                        this.maxY = to.maxY;
                    if (this.minX < to.minX)
                        this.minX = to.minX;
                    if (this.minY < to.minY)
                        this.minY = to.minY;
                    needcenter = false;
                }
                    break;
                case FillMode.NEARESTSTRETCH: {
                    // 先做 as，如果接近，则拉伸
                    let rw = self.width / to.width;
                    let rh = self.height / to.height;
                    if (rw < rh) {
                        self.width /= rh;
                        self.height = to.height;
                    } else {
                        self.height /= rw;
                        self.width = to.width;
                    }
                    rw = self.width / to.width;
                    rh = self.height / to.height;
                    if (Math.abs(rw - rh) < self.nearest) {
                        self.copy(to);
                    }
                }
                    break;
                case FillMode.ASPECTSTRETCH: {
                    let rw = self.width / to.width;
                    let rh = self.height / to.height;
                    if (rw < rh) {
                        self.width /= rh;
                        self.height = to.height;
                    } else {
                        self.height /= rw;
                        self.width = to.width;
                    }
                }
                    break;
                case FillMode.ASPECTFILL: {
                    let rw = self.width / to.width;
                    let rh = self.height / to.height;
                    if (rw < rh) {
                        self.height /= rw;
                        self.width = to.width;
                    } else {
                        self.width /= rh;
                        self.height = to.height;
                    }
                }
                    break;
            }

            if (Mask.isset(FillMode.NOBORDER, mode)) {
                let r1 = to.width / to.height;
                if (self.width / to.width < self.height / to.height) {
                    self.width = self.height * r1;
                } else {
                    self.height = self.width / r1;
                }
            }

            if (Mask.isset(FillMode.NEAREST, mode)) {
                let rw = self.width / to.width;
                let rh = self.height / to.height;
                if (Math.abs(rw - rh) < self.nearest) {
                    if (rw < rh) {
                        self.width /= rw;
                    } else {
                        self.height /= rh;
                    }
                }
            }

            if (needcenter)
                self.center = to.center;
            return self;
        }

        applyScaleFactor(): this {
            this.x *= ScaleFactorX;
            this.y *= ScaleFactorY;
            this.width *= ScaleFactorW;
            this.height *= ScaleFactorH;
            return this;
        }

        unapplyScaleFactor(): this {
            this.x *= ScaleFactorDeX;
            this.y *= ScaleFactorDeY;
            this.width *= ScaleFactorDeW;
            this.height *= ScaleFactorDeH;
            return this;
        }

        // 转换到笛卡尔坐标系
        applyCartesian(tfm: Rect): this {
            let self = this;
            self.y = tfm.height - self.y - self.height - tfm.y;
            self.x += tfm.x;
            return self;
        }

        unapplyCartesian(tfm: Rect): this {
            let self = this;
            self.y = tfm.height - self.y - tfm.y;
            self.x -= tfm.x;
            return self;
        }
    }

    export class UnionRect extends Rect {
        constructor(x?: number, y?: number, w?: number, h?: number) {
            super();
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        }

        union(r: Rect): this {
            let self = this;
            if (self.x == null || self.y == null || self.width == null || self.height == null) {
                self.x = r.x;
                self.y = r.y;
                self.width = r.width;
                self.height = r.height;
                return self;
            }
            return <any>super.union(r);
        }
    }

    export enum WorkState {
        UNKNOWN,
        WAITING,
        DOING,
        PAUSED,
        DONE
    };

    /** 角度 */
    export class Angle {
        static _PI = Math.PI;
        static _PI_2 = Math.PI / 2;
        static _2PI = Math.PI * 2;
        static _1_2PI = 1 / Math.PI / 2;
        static _DEGREE = Math.PI / 180;
        static _RAD = 180 / Math.PI;

        static ToRad(ang: number): number {
            return ang * Angle._DEGREE;
        }

        static ToAngle(rad: number): number {
            return rad * Angle._RAD;
        }

        constructor(rad: number = 0) {
            this._rad = rad;
        }

        clone(): Angle {
            return new Angle(this._rad);
        }

        static RAD(rad: number): Angle {
            let r = new Angle(rad);
            return r;
        }

        static ANGLE(ang: number): Angle {
            let r = new Angle(Angle.ToRad(ang));
            return r;
        }

        static DIRECTION(d: Direction): Angle {
            let r = new Angle();
            switch (d) {
                case Direction.UP:
                    r._rad = 0;
                    break;
                case Direction.LEFT:
                    r._rad = Angle._PI_2;
                    break;
                case Direction.DOWN:
                    r._rad = Angle._PI;
                    break;
                case Direction.RIGHT:
                    r._rad = Angle._PI + Angle._PI_2;
                    break;
            }
            return r;
        }

        private _rad: number;

        get angle(): number {
            return this._rad * Angle._RAD;
        }

        set angle(v: number) {
            this._rad = v * Angle._DEGREE;
        }

        get rad(): number {
            return this._rad;
        }

        set rad(v: number) {
            this._rad = v;
        }

        add(r: Angle): Angle {
            this._rad += r._rad;
            return this;
        }

        sub(r: Angle): Angle {
            this._rad -= r._rad;
            return this;
        }

        multiScala(v: number): Angle {
            this._rad *= v;
            return this;
        }

        normalize(): Angle {
            if (this._rad < 0)
                this._rad += Angle._2PI;
            this._rad %= Angle._2PI;
            return this;
        }

        get direction(): Direction {
            let ang = this.clone().normalize().angle;
            if (ang <= 45 || ang >= 315)
                return Direction.UP;
            if (45 <= ang && ang <= 135)
                return Direction.LEFT;
            if (135 <= ang && ang <= 225)
                return Direction.DOWN;
            return Direction.RIGHT;
        }

        toString(): string {
            return "角度:" + this.angle + ", 弧度:" + this.rad;
        }
    }

    /** 射线 */
    export class Rayline {
        constructor(pt?: Point, angle?: number) {
            this.pt = pt;
            this.angle = angle;
        }

        pt: Point;
        angle: number;

        atLength(len: number, angle?: number): Point {
            if (angle == undefined)
                angle = this.angle;
            return new Point(len * Math.cos(angle), len * Math.sin(angle))
                .addPoint(this.pt);
        }
    }

    /** 路径
     @note 默认h5-tag-path来实现，所以也原生支持了svg^_^
     */
    export class Path implements ISerializable {
        constructor(svg?: string) {
            this._ph = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            if (this._ph == null)
                fatal("当前环境不支持 H5-PATH-SVG");
            if (svg)
                this.unserialize(svg);
        }

        serialize(): string {
            return this._ph.getAttribute("d");
        }

        unserialize(stream: any): boolean {
            let suc: boolean;
            try {
                this._ph.setAttribute("d", stream);
                this._changed = suc = true;
            } catch (err) {
                suc = false;
            }
            return suc;
        }

        clear() {
            this._ph.setAttribute("d", "");
        }

        get length(): number {
            if (this._changed) {
                this._len = this._ph.getTotalLength();
                this._changed = false;
            }
            return this._len;
        }

        pointAtPos(percent: number): any {
            let len = this.length;
            return this._ph.getPointAtLength(len * percent);
        }

        private _ph: any;
        private _len: number;
        private _changed: boolean;
    }

    export class URL {
        constructor(uri?: string) {
            if (uri)
                this.parseString(uri);
        }

        parseString(uri: string) {
            if (isZero(uri)) {
                warn("不能解析传入的 URI 信息");
                return;
            }

            let s = uri.split('?');
            if (s.length == 1)
                s = ['', s[0]];
            this.domain = s[0];
            let fs = s[1];
            if (length(fs)) {
                fs.split('&').forEach((s) => {
                    if (length(s) == 0)
                        return;
                    let fs = s.split('=');
                    this.fields[fs[0]] = fs[1] ? fs[1] : null;
                });
            }
        }

        fields: KvObject<string> = {};
        domain = '';

        toString(): string {
            let r = '';
            if (this.domain.length) {
                if (/\:\/\//i.test(this.domain) == false)
                    r += 'http://';
                r += this.domain;
                if (this.domain.indexOf('?') == -1 &&
                    !ObjectT.IsEmpty(this.fields))
                    r += '?';
            }
            r += URL.MapToField(this.fields);
            return r;
        }

        static MapToField(m: KvObject<any>): string {
            let arr = [];
            ObjectT.Foreach(m, (v, k) => {
                arr.push(k + "=" + this.encode(v));
            });
            return arr.join('&');
        }

        static encode(str: string): string {
            return encodeURIComponent(str);
        }

        static decode(d: string): string {
            return decodeURIComponent(d);
        }

        static htmlEncode(s: string): string {
            if (s.length == 0)
                return "";
            s = s.replace(/&/g, "&amp;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            return s;
        }

        static htmlDecode(s: string): string {
            if (s.length == 0)
                return "";
            s = s.replace(/&amp;/g, "&");
            s = s.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39;/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            return s;
        }
    }

    /** 进度接口 */
    export interface IProgress {
        progressValue: Percentage;
    }

    /** 随机数 */
    export class Random {
        // 半开区间 [from, to)
        static Rangei(from: number, to: number, close = false): number {
            if (close)
                return Math.round(Random.Rangef(from, to));
            return Math.floor(Random.Rangef(from, to));
        }

        static Rangef(from: number, to: number): number {
            return Math.random() * (to - from) + from;
        }
    }

    /** 设备屏幕信息的评级
     @note 根据评级和设置的开关决定使用哪套资源 */
    export enum ScreenType {
        NORMAL = 0,
        HIGH = 1, // area >= 1.5
        EXTRAHIGH = 2, // >= 3
        LOW = -1, // <= 0.75
        EXTRALOW = -2, // <= 0.3
    };

    export function ScreenTypeIsLow(t: ScreenType) {
        return t < 0;
    }

    export function ScreenTypeIsHigh(t: ScreenType) {
        return t > 0;
    }

    export enum HttpMethod {
        GET,
        POST,
    }

    /** http连接器 */
    export class CHttpConnector extends SObject {
        dispose() {
            super.dispose();
            this.data = undefined;
            this.fields = undefined;
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalEnd);
            this._signals.register(SignalDone);
            this._signals.register(SignalFailed);
            this._signals.register(SignalChanged);
        }

        /** 请求方式 */
        method = HttpMethod.GET;

        /** 全url */
        url: string;

        /** fields */
        fields: KvObject<any>;

        /** 获取的数据 */
        data: any;

        /** override 发送请求 */
        start() {
        }

        /** override 使用自动授权 */
        useCredentials() {
        }

        fullUrl(): string {
            let r = this.url;
            if (this.fields) {
                if (r.indexOf('?') == -1)
                    r += '?';
                else
                    r += '&';
                r += URL.MapToField(this.fields);
            }
            return r;
        }
    }

    /** socket连接器 */
    export abstract class CSocketConnector extends SObject {
        /** 地址 */
        host: string;

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalOpen);
            this._signals.register(SignalClose);
            this._signals.register(SignalDataChanged);
            this._signals.register(SignalTimeout);
            this._signals.register(SignalFailed);
            this._signals.register(SignalReopen);
        }

        /** 是否已经打开 */
        abstract isopened(): boolean;

        /** 连接服务器 */
        abstract open();

        /** 断开连接 */
        abstract close();

        /** 发送对象 */
        abstract write(obj: any);

        /** 监听对象 */
        abstract watch(obj: any, on: boolean);
    }

    /** 基本操作 */
    export abstract class Operation {
        constructor(idr?: any) {
            this.idr = idr;
        }

        // 依赖的qeueu
        _queue: OperationQueue;

        /** 标示号，用来查找 */
        idr: any;

        /** 开始动作 */
        abstract start();

        /** 完成自己的处理 */
        done() {
            if (this._queue)
                this._queue.next();
        }
    }

    /** 操作队列 */
    export class OperationQueue extends SObject {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalDone);
        }

        /** 自动开始队列 */
        autoMode: boolean = true;

        /** 手动的队列 */
        static Manual(): OperationQueue {
            let r = new OperationQueue();
            r.autoMode = false;
            return r;
        }

        /** 队列中操作的数量 */
        get count(): number {
            return this._opers.length;
        }

        /** 队列中添加一个操作 */
        add(oper: Operation) {
            if (oper._queue != null) {
                warn("该操作已经位于队列中");
                return;
            }
            oper._queue = this;
            this._opers.push(oper);
            if (this.autoMode)
                this.tryrun();
        }

        /** 移除 */
        remove(oper: Operation) {
            if (oper._queue != this) {
                warn("不能移除该操作");
                return;
            }
            if (oper == this._current)
                this._current = null;

            oper._queue = null;
            ArrayT.RemoveObject(this._opers, oper);
        }

        /** 接上，如果只传一个数据，则代表附加在当前之后
         @param l 目标的队列
         @param r 插入的队列
         */
        follow(l: Operation, r: Operation) {
            if (l._queue != this) {
                fatal("期望接上一个错误的队列操作");
                return;
            }

            let idx = this._opers.indexOf(l);
            r._queue = this;
            ArrayT.InsertObjectAtIndex(this._opers, r, idx + 1);
        }

        /** 附加到当前 */
        present(oper: Operation) {
            if (this._current) {
                this.follow(this._current, oper);
            } else {
                oper._queue = this;
                ArrayT.InsertObjectAtIndex(this._opers, oper, 1);
            }
        }

        /** 交换 */
        swap(l: Operation, r: Operation) {
            let il = this._opers.indexOf(l);
            let ir = this._opers.indexOf(r);
            if (il == -1 || ir == -1) {
                fatal("尝试交换不属于该队列的操作");
                return;
            }

            this._opers[il] = r;
            this._opers[ir] = l;

            if (this._current == l) {
                this._current = r;
                r.start();
            } else if (this._current == r) {
                this._current = l;
                l.start();
            }
        }

        /** 使用 r 换掉 l */
        replace(l: Operation, r: Operation) {
            if (l._queue != this) {
                fatal("期望替换一个错误的队列操作");
                return;
            }

            let idx = this._opers.indexOf(l);
            // 移除老的
            l._queue = null;
            l.done();

            // 加入新的
            r._queue = this;
            this._opers[idx] = r;
            if (this._current == l) {
                this._current = r;
                this._current.start();
            }
        }

        /** 尝试运行一个工作 */
        tryrun() {
            if (this._current || this._opers.length == 0)
                return;
            if (this._paused) {
                this._tryduringpaused = true;
                return;
            }
            this._current = this._opers[0];
            if (this._current)
                this._current.start();
        }

        /** 强制运行下一份工作 */
        next() {
            if (this._current == null)
                return;

            this._current._queue = null;
            this._current = null;

            this._opers.shift();
            if (this._opers.length == 0) {
                if (this._signals)
                    this._signals.emit(SignalDone);
            } else {
                this.tryrun();
            }
        }

        /** 查询一个被标记的工作 */
        findOperation(idr: any): Operation {
            return ArrayT.QueryObject(this._opers, (o: Operation): boolean => {
                return o.idr == idr;
            }, this);
        }

        /** 暂停工作队列 */
        pause() {
            // 暂停普通的
            if (this._paused)
                return;
            this._paused = true;
            this._tryduringpaused = false;
        }

        /** 恢复工作队列 */
        resume() {
            if (!this._paused)
                return;
            this._paused = false;
            if (this._tryduringpaused) {
                this._tryduringpaused = false;
                this.tryrun();
            }
        }

        protected _paused: boolean;
        protected _tryduringpaused: boolean; // 是否在暂停时请求了下一个
        protected _current: Operation;
        protected _opers = new Array<Operation>();

        get operations(): Array<Operation> {
            return this._opers;
        }
    }

    /** 闭包操作，为了支持Async，所以需要注意当闭包完成时调用done */
    export class OperationClosure extends Operation {
        constructor(cb: (oper: Operation) => void, ctx?: any, idr?: any) {
            super(idr);
            this.cb = cb;
            this.ctx = ctx;
        }

        cb: any;
        ctx: any;

        start() {
            this.cb.call(this.ctx, this);
        }
    }

    /** 简单封装一个函数，不附带 Operation，使用时需要手动调用 operationqueue.next，主要用于传统流程改造成队列流程 */
    export class OperationCall extends Operation {
        constructor(cb: (...p: any[]) => void, ctx?: any, argus?: any[], idr?: any) {
            super(idr);
            this.cb = cb;
            this.ctx = ctx;
            this.argus = argus;
        }

        cb: any;
        ctx: any;
        argus: any[];

        start() {
            this.cb.apply(this.ctx, this.argus);
        }
    }

    /** 间隔时间操作 */
    export class OperationDelay extends Operation {
        constructor(delay: number, idr?: any) {
            super(idr);
            this.delay = delay;
        }

        delay: number;

        start() {
            Delay(this.delay, () => {
                this.done();
            });
        }
    }

    class _OperationGroupQueue extends OperationQueue {
        constructor() {
            super();
            this.autoMode = false;
        }

        private _sum = 0;
        private _now = 0;

        start() {
            this._sum = this._opers.length;
            this._now = 0;
        }

        next() {
            if (++this._now == this._sum)
                this.signals.emit(SignalDone);
        }
    }

    /** 操作组 */
    export class OperationGroup extends Operation {
        constructor(idr?: any) {
            super(idr);
            this._subqueue.signals.connect(SignalDone, this.__subqueue_end, this);
        }

        dispose() {
            this._subqueue.dispose();
        }

        private _subqueue = new _OperationGroupQueue();

        start() {
            this._subqueue.start();
            this._subqueue.operations.forEach((q: Operation) => {
                q.start();
            });
        }

        add(q: Operation) {
            this._subqueue.add(q);
        }

        private __subqueue_end() {
            this.done();
            this.dispose();
        }
    }

    /** 顺序操作的接口 */
    export interface IOrder {
        /** 完成 */
        done();

        /** 执行下一个操作 */
        next();
    }

    /** 自动重试
     @code
     new Retry(....).process();
     */
    export class Retry implements IOrder {
        /*
           @param times 重试次数
           @param interval 重试的时间间隔s，或者是每一次的间隔
        */
        constructor(times: number, interval: number | Array<number>,
                    cb: (retry: IOrder) => void, ctx?: any) {
            this._times = times;
            this._currentTime = 0;
            this._interval = interval;
            this._cb = cb;
            this._ctx = ctx;
        }

        /** 运行 */
        process() {
            this._cb.call(this._ctx, this);
        }

        /** 结束 */
        done() {
            this._cb = undefined;
            this._ctx = undefined;
        }

        /** 下一个 */
        next() {
            let delay: number;
            if (typeof (this._interval) == 'number')
                delay = <number>this._interval;
            else
                delay = (<Array<number>>this._interval)[this._currentTime];

            if (this._times > 0 &&
                this._currentTime++ == this._times) {
                this.done();
                warn('重试达到指定次数，结束重试');
                return;
            }

            // 继续下一次
            if (delay == 0) {
                this._cb.call(this._ctx, this);
            } else {
                Delay(delay, () => {
                    this._cb.call(this._ctx, this);
                });
            }
        }

        private _times: number;
        private _currentTime: number;
        private _interval: number | Array<number>;
        private _cb: (retry: IOrder) => void;
        private _ctx: any;
    }

    export function retry(times: number, interval: number | Array<number>,
                          cb: (retry: IOrder) => void, ctx?: any): Retry {
        let r = new Retry(times, interval, cb, ctx);
        Defer(r.next, r);
        return r;
    }

    export interface IObjectsPool {
        use();

        unuse(o: any);
    }

    /** 对象池，自动初始化超过现存可用数量的对象 */
    export class ObjectsPool<T> implements IObjectsPool {
        private _arr = new Array<T>();

        constructor(ins: () => T, ctx?: any) {
            this.instance = ins;
        }

        dispose() {
            this.clear();
        }

        private instance: () => T;
        private ctx: any;

        use(): T {
            if (this._arr.length == 0)
                return this.instance.call(this.ctx);
            return this._arr.pop();
        }

        unuse(o: T) {
            if (o)
                this._arr.push(o);
        }

        get length(): number {
            return this._arr.length;
        }

        clear() {
            ArrayT.Clear(this._arr, (o: any) => {
                drop(o);
            });
        }
    }

    export interface IReusesPool {
        use(k: any, def: any, argus: any[]): any;

        unuse(k: any, o: any);
    }

    /** 简单复用池
     @note 业务建议使用 ReusesPool，提供了used和unused的管理
     */
    export class SimpleReusesPool<T> implements IReusesPool {
        constructor(ins?: (...p: any[]) => T, ctx?: any) {
            this._ins = ins;
            this._ctx = ctx;
        }

        dispose() {
            this.clear();
        }

        use(k: any, def?: T, argus?: any[]): T {
            let ar = this._pl[k];
            if (ar && ar.length)
                return ar.pop();
            if (this._ins)
                return this._ins.apply(this._ctx, argus);
            return def;
        }

        unuse(k: any, o: T) {
            let ar = this._pl[k];
            if (ar == null) {
                ar = new Array<T>();
                this._pl[k] = ar;
            }
            ar.push(o);
        }

        clear() {
            ObjectT.Clear(this._pl, (v, k) => {
                ArrayT.Clear(v, (o: T) => {
                    drop(o);
                });
            });
        }

        private _ins: (...p: any[]) => T;
        private _ctx: any;
        private _pl: KvObject<Array<T>> = {};
    }

    export class ReusesPool<T> implements IReusesPool {
        constructor(ins: (...p: any[]) => T,
                    use: (k: any, o: T) => void,
                    unuse: (k: any, o: T) => void,
                    ctx?: any) {
            this._ins = ins;
            this._use = use;
            this._unuse = unuse;
            this._ctx = ctx;
        }

        use(k: any, def?: T, argus?: any[]): T {
            let ar = this._pl[k];
            if (ar && ar.length) {
                let r = ar.pop();
                ArrayT.RemoveObject(this._unuseds, r);
                this._useds.push(r);
                if (this._use)
                    this._use.call(this._ctx, k, r);
                return r;
            }
            if (this._ins) {
                let r = this._ins.apply(this._ctx, argus);
                this._useds.push(r);
                if (this._use)
                    this._use.call(this._ctx, k, r);
                return r;
            }
            return def;
        }

        unuse(k: any, o: T) {
            let ar = this._pl[k];
            if (ar == null) {
                ar = new Array<T>();
                this._pl[k] = ar;
            } else {
                ArrayT.RemoveObject(this._useds, o);
            }
            ar.push(o);
            this._unuseds.push(o);
            if (this._unuse)
                this._unuse.call(this._ctx, k, o);
        }

        get useds(): Array<T> {
            return this._useds;
        }

        get unuseds(): Array<T> {
            return this._unuseds;
        }

        private _ins: (...p: any[]) => T;
        private _use: (k: any, o: T) => void;
        private _unuse: (k: any, o: T) => void;
        private _ctx: any;
        private _pl: KvObject<Array<T>> = {};
        private _useds = new Array<T>();
        private _unuseds = new Array<T>();
    }

    /** 编解码 */
    export interface ICodec {
        /** 编码 */
        encode(s: string): string;

        /** 解码 */
        decode(d: any): string;
    }

    /** 包文件系统 */
    export interface IArchiver {
        /** 读取包 */
        load(d: any): boolean;

        /** 获取文件内容 */
        file(path: string, type: ResType, cb: (str: any) => void, ctx?: any);
    }

    export class Storage implements IShared {
        // 编解码器
        codec: ICodec;

        // key的前缀
        private _prefix: string = '::n2';
        get prefix(): string {
            return this._prefix;
        }

        set prefix(pre: string) {
            this._prefix = pre ? pre : '';
        }

        // domain组，业务通常设置为userId
        domain: any;

        clone(): this {
            let r = InstanceNewObject(this);
            r.codec = this.codec;
            r.prefix = this.prefix;
            r.domain = this.domain;
            return r;
        }

        // 获取真正的key，避免同一个domain下key冲突
        protected getKey(key: string): string {
            let s = this.prefix;
            if (this.domain)
                s += "::" + this.domain;
            s += key;
            return s;
        }

        // 设置数据
        set(key: string, val: any) {
            if (key == null)
                return;
            let ks = this.getKey(key);
            if (this.codec)
                ks = this.codec.encode(ks);
            if (val == null) {
                IMP_STORAGE_DEL(ks);
            } else {
                let vs = val.toString();
                if (this.codec)
                    vs = this.codec.encode(vs);
                IMP_STORAGE_SET(ks, vs);
            }
        }

        // 读取数据
        value(key: string, def?: string | Closure): string {
            let ks = this.getKey(key);
            if (this.codec)
                ks = this.codec.encode(ks);
            let vs = IMP_STORAGE_GET(ks);
            if (this.codec && vs)
                vs = this.codec.decode(vs);
            if (vs == null) {
                if (<any>def instanceof Closure)
                    vs = (<Closure>def).invoke();
                else
                    vs = asString(def, null);
            }
            return vs;
        }

        // 快速设置一些数值
        setBool(key: any, val: boolean) {
            this.set(key, val ? '1' : '0');
        }

        getBool(key: any, def?: boolean): boolean {
            let r = this.value(key, def ? '1' : '0');
            return r != '0';
        }

        setNumber(key: any, val: number) {
            this.set(key, val);
        }

        getNumber(key: any, def?: number): number {
            let r = this.value(key, def ? def.toString() : '0');
            return parseFloat(r);
        }

        setObject(key: any, val: Object) {
            this.set(key, JSON.stringify(val));
        }

        getObject(key: any, def = null): any {
            let s = this.value(key, null);
            if (s == null)
                return def;
            return JSON.parse(s);
        }

        clear() {
            IMP_STORAGE_CLEAR();
        }

        static shared = new Storage();
    }

    export class CryptoStorages {
        get(idr: string): Storage {
            let st = this._storages[idr];
            if (st == null) {
                st = Storage.shared.clone();
                // debug不启用加密
                if (!ISDEBUG) {
                    let c = new CrytoString();
                    c.key = CApplication.shared.idfa + "::" + idr;
                    st.codec = c;
                }
                this._storages[idr] = st;
            }
            return st;
        }

        set(idr: string, key: string, val: any) {
            this.get(idr).set(idr + "::" + key, val);
        }

        value(idr: string, key: string, def?: string | Closure): string {
            return this.get(idr).value(idr + "::" + key, def);
        }

        setBool(idr: string, key: any, val: boolean) {
            this.get(idr).setBool(idr + "::" + key, val);
        }

        getBool(idr: string, key: any, def?: boolean): boolean {
            return this.get(idr).getBool(idr + "::" + key, def);
        }

        setNumber(idr: string, key: any, val: number) {
            this.get(idr).setNumber(idr + "::" + key, val);
        }

        getNumber(idr: string, key: any, def?: number): number {
            return this.get(idr).getNumber(idr + "::" + key, def);
        }

        private _storages: KvObject<Storage> = {};
        static shared = new CryptoStorages();
    }

    // 类似于C++的traittype，用来解决ts模版不支持特化的问题
    export let number_t = {type: 'number', def: 0};
    export let boolean_t = {type: 'boolean', def: false};
    export let string_t = {type: 'string', def: ''};

    /** 可以用来直接在声明时绑定位于storage中带类型的变量 */
    export class StorageVariable<T> {
        constructor(key: string, type = string_t) {
            this.key = key;
            this.type = type;
        }

        key: string;
        private type: any;

        get value(): T {
            if (this.type.type == 'number')
                return <any>Storage.shared.getNumber(this.key);
            else if (this.type.type == 'boolean')
                return <any>Storage.shared.getBool(this.key);
            return <any>Storage.shared.value(this.key);
        }

        set value(v: T) {
            if (this.type.type == 'number')
                Storage.shared.setNumber(this.key, <any>v);
            else if (this.type.type == 'boolean')
                Storage.shared.setBool(this.key, <any>v);
            else
                Storage.shared.set(this.key, <any>v);
        }
    }

    /** 缓存策略控制接口 */
    export interface ICacheObject {
        // 是否强制刷新
        cacheFlush: boolean;

        // 是否已经更新
        cacheUpdated: boolean;

        // 过期的时间段
        cacheTime: number;

        // 获得唯一标记
        keyForCache(): string;

        // 值
        valueForCache(): any;
    }

    export interface ICacheRecord extends IReference {
        /** 使用缓存的实际数据对象 */
        use(): any;

        /** 设置缓存的实际数据对象的属性，如果isnull跳过 */
        prop(k: any, v: any);

        /** 是否为空 */
        isnull: boolean;
    }

    export class CacheRecord implements ICacheRecord {
        key: string; // 键
        val: any; // 数据对象
        ts: number; // 时间戳

        count: number = 0; // 计数器
        fifo: boolean; // 位于fifo中
        mulo: boolean; // 位于mulo中

        get isnull(): boolean {
            return this.val == null;
        }

        use(): any {
            this.count += 1;
            return this.val;
        }

        prop(k: any, v: any) {
            if (this.val)
                this.val[k] = v;
        }

        grab() {
            this.count += 1;
        }

        drop() {
            this.count -= 1;
        }
    }

    /** 基础缓存实现 */
    export class Memcache implements IShared {
        // 存储所有的对象，用来做带key的查找
        protected _maps: KvObject<CacheRecord> = {};
        protected _records = new Array<CacheRecord>();

        // 是否启用
        enable: boolean = true;

        /** 添加一个待缓存的对象 */
        cache<T extends ICacheObject>(obj: T): CacheRecord {
            if (!this.enable) {
                let t = new CacheRecord();
                t.val = obj.valueForCache();
                return t;
            }

            let ks = obj.keyForCache();
            if (ks == null) {
                warn("放到缓存中的对象没有提供 mcKey");
                return null;
            }

            // 查找老的
            let rcd: CacheRecord = this._maps[ks];
            if (rcd) {
                rcd.val = obj.valueForCache();
                rcd.ts = obj.cacheTime > 0 ? obj.cacheTime + DateTime.Now() : 0;
                return rcd;
            }

            // 初始化一个新的缓存记录
            rcd = new CacheRecord();
            rcd.key = ks;
            rcd.val = obj.valueForCache();
            rcd.ts = obj.cacheTime > 0 ? obj.cacheTime + DateTime.Now() : 0;

            this._records.push(rcd);
            this._maps[ks] = rcd;

            // 池的改动需要引发gc的操作
            FramesManager.needsGC(this);
            return rcd;
        }

        // 执行一次淘汰验证
        gc() {
            let rms = ArrayT.RemoveObjectsByFilter(this._records, (rcd: CacheRecord): boolean => {
                return rcd.count <= 0;
            });
            rms.forEach((rcd: CacheRecord) => {
                this.doRemoveObject(rcd);
            });
        }

        /** 获得缓存对象 */
        query(ks: string): ICacheRecord {
            let rcd: CacheRecord = this._maps[ks];
            if (rcd == null)
                return null;
            if (rcd.ts > 0 && rcd.ts <= DateTime.Now()) {
                // 为了下一次将过期的清理掉
                rcd.count = 0;
                return null;
            }
            return rcd;
        }

        /** override 回调处理移除一个元素 */
        protected doRemoveObject(rcd: CacheRecord) {
            ObjectT.RemoveKey(this._maps, rcd.key);
        }

        static shared = new Memcache();
    }

    declare var require;

    export class _Scripts {
        require(p: string | Array<string>, cb?: () => void, ctx?: any) {
            if (ISHTML5) {
                if (<any>p instanceof Array) {
                    let srcs = <string[]>p;
                    js.loadScripts(srcs, cb, ctx);
                } else {
                    let src = <string>p;
                    js.loadScript(src, cb, ctx);
                }
            } else {
                if (<any>p instanceof Array) {
                    let srcs = <string[]>p;
                    for (let e in srcs) {
                        require(e);
                    }
                    cb.call(ctx);
                } else {
                    let src = <string>p;
                    require(src);
                    cb.call(ctx);
                }
            }
        }
    }

    export let Scripts = new _Scripts();
}

/** 当native时，直接用set会出现key为ui时第二次加入时崩溃，所以需要转成安全的set */
function NewSet<T>(): Set<T> {
    return <any>(nn.ISHTML5 ? new Set<T>() : new nn.SafeSet<T>());
}
