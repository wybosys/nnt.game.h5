var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// 提供一个类型，用来声明利用Object来模拟Map的类型
// ps：当KvObject位于nn空间内，egret4.0.1编译出的代码会漏掉nn名域，所以干错KvObject暴露到全局
var KvObject = (function () {
    function KvObject() {
    }
    return KvObject;
}());
var nn;
(function (nn) {
    nn.ECMA6_NATIVE = true;
    if (typeof (Map) == 'undefined')
        nn.ECMA6_NATIVE = false;
    var CMap = (function () {
        function CMap() {
            this.clear = nn.ECMA6_NATIVE ? this._n_clear : this._i_clear;
            this.delete = nn.ECMA6_NATIVE ? this._n_delete : this._i_delete;
            this.forEach = nn.ECMA6_NATIVE ? this._n_foreach : this._i_foreach;
            this.has = nn.ECMA6_NATIVE ? this._n_has : this._i_has;
            this.set = nn.ECMA6_NATIVE ? this._n_set : this._i_set;
            this.get = nn.ECMA6_NATIVE ? this._n_get : this._i_get;
            if (nn.ECMA6_NATIVE)
                this._imp = new Map();
            else
                this._imp = {};
        }
        CMap.prototype._n_clear = function () {
            this._imp.clear();
        };
        CMap.prototype._i_clear = function () {
            this._imp = {};
        };
        CMap.prototype._n_delete = function (k) {
            this._imp.delete(k);
        };
        CMap.prototype._i_delete = function (k) {
            delete this._imp[k];
        };
        CMap.prototype._n_foreach = function (cb, ctx) {
            this._imp.forEach(function (v, k) {
                cb.call(ctx, k, v);
            });
        };
        CMap.prototype._i_foreach = function (cb, ctx) {
            var ks = Object.keys(this._imp);
            ks.forEach(function (k) {
                cb.call(ctx, k, this._imp[k]);
            }, this);
        };
        CMap.prototype._n_has = function (k) {
            return this._imp.has(k);
        };
        CMap.prototype._i_has = function (k) {
            return this._imp.hasOwnProperty(k);
        };
        CMap.prototype._n_length = function () {
            return this._imp.size;
        };
        CMap.prototype._i_length = function () {
            return Object.keys(this._imp).length;
        };
        Object.defineProperty(CMap.prototype, "length", {
            get: function () {
                return nn.ECMA6_NATIVE ? this._n_length() : this._i_length();
            },
            enumerable: true,
            configurable: true
        });
        CMap.prototype._n_set = function (k, v) {
            this._imp.set(k, v);
        };
        CMap.prototype._i_set = function (k, v) {
            this._imp[k] = v;
        };
        CMap.prototype._n_get = function (k) {
            return this._imp.get(k);
        };
        CMap.prototype._i_get = function (k) {
            return this._imp[k];
        };
        return CMap;
    }());
    nn.CMap = CMap;
    var CSet = (function () {
        function CSet() {
            this.add = nn.ECMA6_NATIVE ? this._n_add : this._i_add;
            this.has = nn.ECMA6_NATIVE ? this._n_has : this._i_has;
            this.delete = nn.ECMA6_NATIVE ? this._n_delete : this._i_delete;
            this.clear = nn.ECMA6_NATIVE ? this._n_clear : this._i_clear;
            this.forEach = nn.ECMA6_NATIVE ? this._n_foreach : this._i_foreach;
            if (nn.ECMA6_NATIVE) {
                this._imp = new Set();
            }
            else {
                this._map = new CMap();
                this._arr = new Array();
            }
        }
        CSet.prototype._n_add = function (o) {
            return this._imp.add(o);
        };
        CSet.prototype._i_add = function (o) {
            var k = Js.hashKey(o);
            if (this._map[k] != undefined)
                return false;
            this._map[k] = true;
            this._arr.push(o);
            return true;
        };
        CSet.prototype._n_has = function (o) {
            return this._imp.has(o);
        };
        CSet.prototype._i_has = function (o) {
            var k = Js.hashKey(o);
            return this._map[k] != undefined;
        };
        CSet.prototype._n_delete = function (o) {
            return this._imp.delete(o);
        };
        CSet.prototype._i_delete = function (o) {
            var k = Js.hashKey(o);
            if (this._map[k] == undefined)
                return false;
            this._map.delete(k);
            var idx = this._arr.indexOf(o);
            this._arr.splice(idx, 1);
            return true;
        };
        CSet.prototype._n_size = function () {
            return this._imp.size;
        };
        CSet.prototype._i_size = function () {
            return this._arr.length;
        };
        Object.defineProperty(CSet.prototype, "size", {
            get: function () {
                return nn.ECMA6_NATIVE ? this._n_size() : this._i_size();
            },
            enumerable: true,
            configurable: true
        });
        CSet.prototype._n_clear = function () {
            this._imp.clear();
        };
        CSet.prototype._i_clear = function () {
            if (this._arr.length) {
                this._map.clear();
                this._arr.length = 0;
            }
        };
        CSet.prototype._n_foreach = function (cb, ctx) {
            this._imp.forEach(cb, ctx);
        };
        CSet.prototype._i_foreach = function (cb, ctx) {
            if (this._arr.length)
                this._arr.forEach(cb, ctx);
        };
        return CSet;
    }());
    nn.CSet = CSet;
})(nn || (nn = {}));
var tritrue = 1; // 类同于 true
var trifalse = 0; // 类同于 false
var trimay = 2; // 第三个中间状态
var nn;
(function (nn) {
    var FrameworkFeature;
    (function (FrameworkFeature) {
        // GL 硬件加速
        // GL = 1 << 1,
        // 不同步屏幕刷新
        FrameworkFeature[FrameworkFeature["NOSYNC"] = 4] = "NOSYNC";
        // 多分辨率素材支持
        FrameworkFeature[FrameworkFeature["MULTIRES"] = 8] = "MULTIRES";
        // 全屏幕
        FrameworkFeature[FrameworkFeature["FULLSCREEN"] = 16] = "FULLSCREEN";
        // 横竖屏自适应
        //MULTIDIRECTION = 1 << 5,
        // 默认没有属性
        FrameworkFeature[FrameworkFeature["DEFAULT"] = 0] = "DEFAULT";
    })(FrameworkFeature = nn.FrameworkFeature || (nn.FrameworkFeature = {}));
    ;
    /** 定位方式 */
    var LocatingType;
    (function (LocatingType) {
        LocatingType[LocatingType["LAYOUT"] = 0] = "LAYOUT";
        LocatingType[LocatingType["ABSOLUTE"] = 1] = "ABSOLUTE";
        LocatingType[LocatingType["RELATIVE"] = 2] = "RELATIVE";
    })(LocatingType = nn.LocatingType || (nn.LocatingType = {}));
    ;
    /** 全局的设计和实际坐标的转换 */
    nn.ScaleFactorX = 1;
    nn.ScaleFactorDeX = 1;
    nn.ScaleFactorY = 1;
    nn.ScaleFactorDeY = 1;
    nn.ScaleFactorW = 1;
    nn.ScaleFactorDeW = 1;
    nn.ScaleFactorH = 1;
    nn.ScaleFactorDeH = 1;
    nn.ScaleFactorS = 1;
    nn.ScaleFactorDeS = 1;
    nn.StageScaleFactorX = 1;
    nn.StageScaleFactorY = 1;
    nn.DomScaleFactorX = 1;
    nn.DomScaleFactorY = 1;
    nn.DomOffsetX = 0;
    nn.DomOffsetY = 0;
    nn.MAX_INT = 9007199254740991;
    function Integral(v) {
        return (v + 0.5) >> 0;
    }
    nn.Integral = Integral;
    var RefVariable = (function () {
        function RefVariable() {
        }
        // 获取当前值
        RefVariable.prototype.get = function () {
            return this._val;
        };
        // 设置当前值
        RefVariable.prototype.set = function (o, grab) {
            if (grab === void 0) { grab = true; }
            if (this._val)
                this._val.drop();
            this._val = o;
            if (o && grab)
                o.grab();
        };
        RefVariable.prototype.dispose = function () {
            if (this._val) {
                this._val.drop();
                this._val = undefined;
            }
        };
        return RefVariable;
    }());
    nn.RefVariable = RefVariable;
    /** 强制转换 */
    function any_cast(obj) {
        return obj;
    }
    nn.any_cast = any_cast;
    /** 带有信号的基类
        @brief 如果不能直接基类，需要实现信号的相关函数 */
    var SObject = (function () {
        /** 构造函数 */
        function SObject() {
            this.hashCode = ++SObject.HashCode;
            // 已经析构掉，用来 debug 模式下防止多次析构
            this.__disposed = false;
            /** 维护一个内部的引用计数器，防止对象的提前析构 */
            this._refcnt = 1;
        }
        /** 析构函数 */
        SObject.prototype.dispose = function () {
            if (nn.ISDEBUG && this.__disposed) {
                warn("对象 " + nn.Classname(this) + " 已经析构");
            }
            this.__disposed = true;
            if (this._attachs) {
                ArrayT.Clear(this._attachs, function (o) {
                    drop(o);
                });
            }
            if (this._signals) {
                this._signals.dispose();
                this._signals = undefined;
            }
        };
        /** 实现注册信号
            @note 业务通过重载此函数并通过调用 this._signals.register 来注册信号
        */
        SObject.prototype._initSignals = function () { };
        Object.defineProperty(SObject.prototype, "signals", {
            get: function () {
                if (this._signals)
                    return this._signals;
                this._instanceSignals();
                return this._signals;
            },
            enumerable: true,
            configurable: true
        });
        SObject.prototype._instanceSignals = function () {
            this._signals = new nn.Signals(this);
            this._initSignals();
        };
        SObject.prototype.attach = function (o) {
            // 如果不存在生命期维护，则直接放弃
            if (o.grab == undefined)
                return;
            if (this._attachs == null)
                this._attachs = new Array();
            o.grab();
            this._attachs.push(o);
        };
        SObject.prototype.detach = function (o) {
            if (o.drop == undefined)
                return;
            if (this._attachs == null)
                return;
            if (nn.ISDEBUG && !ArrayT.Contains(this._attachs, o)) {
                warn("尝试从 attachs 中移除一个本来没有加入的对象");
                return;
            }
            o.drop();
            ArrayT.RemoveObject(this._attachs, o);
        };
        /** 释放一次引用，如果到0则析构对象 */
        SObject.prototype.drop = function () {
            if (nn.ISDEBUG && this.__disposed) {
                warn("对象 " + nn.Classname(this) + " 已经析构");
            }
            if (--this._refcnt == 0)
                this.dispose();
        };
        /** 增加一次引用 */
        SObject.prototype.grab = function () {
            ++this._refcnt;
        };
        /** 调用自己 */
        SObject.prototype.callself = function (cb, ctx) {
            cb.call(ctx ? ctx : this, this);
            return this;
        };
        Object.defineProperty(SObject.prototype, "obj", {
            /** 获得自己，为了支持 InstanceType */
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        /** 测试自己是否为空 */
        SObject.prototype.isnull = function () {
            if (this.__disposed)
                return true;
            return false;
        };
        /** 比较函数 */
        SObject.prototype.isEqual = function (r) {
            return this == r;
        };
        Object.defineProperty(SObject.prototype, "clazz", {
            /** 获得自己的类定义 */
            get: function () {
                return nn.ObjectClass(this);
            },
            enumerable: true,
            configurable: true
        });
        /** 实例化一个对象 */
        SObject.New = function (cb) {
            var p = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                p[_i - 1] = arguments[_i];
            }
            var obj = nn.InstanceNewObject(this, p);
            if (cb)
                cb.call(this, obj);
            return obj;
        };
        return SObject;
    }());
    /** 唯一id */
    SObject.HashCode = 0;
    nn.SObject = SObject;
    // 包裹一个普通对象为signals对象
    var SObjectWrapper = (function (_super) {
        __extends(SObjectWrapper, _super);
        function SObjectWrapper(o) {
            var _this = _super.call(this) || this;
            _this._wrpobj = o;
            var tgt = _this._wrpobj;
            tgt.signals = _this.signals;
            tgt.attach = SObjectWrapper._imp_attach;
            tgt.dispose = SObjectWrapper._imp_dispose;
            tgt.__sobj_wrapper = _this;
            return _this;
        }
        SObjectWrapper.prototype.dispose = function () {
            var tgt = this._wrpobj;
            tgt.signals = null;
            tgt.dispose = null;
            tgt.__sobj_wrapper = null;
            this._wrpobj = null;
            _super.prototype.dispose.call(this);
        };
        return SObjectWrapper;
    }(SObject));
    SObjectWrapper._imp_dispose = function () {
        var tgt = this;
        tgt.__sobj_wrapper.dispose();
    };
    SObjectWrapper._imp_attach = function (o) {
        var tgt = this;
        tgt.__sobj_wrapper.attach(o);
    };
    nn.SObjectWrapper = SObjectWrapper;
    // 默认对象的名称需要跳过名字
    nn.OBJECT_DEFAULT_KEYS = ["hashCode"];
    // egret等实现框架会重叠listener，所以保护一下addEventListener，防止被多次添加
    function EventHook(obj, event, fun, target, capture) {
        if (target == null)
            target = obj;
        if (obj.hasEventListener(event, fun, target, capture) == false)
            obj.addEventListener(event, fun, target, capture);
    }
    nn.EventHook = EventHook;
    function EventUnhook(obj, event, fun, target, capture) {
        if (target == null)
            target = obj;
        obj.removeEventListener(event, fun, target, capture);
    }
    nn.EventUnhook = EventUnhook;
    /** 增加引用计数 */
    function grab(o) {
        if (o == null)
            return undefined;
        o.grab();
        return o;
    }
    nn.grab = grab;
    /** 减计数对象 */
    function drop(o) {
        if (o == null)
            return undefined;
        return o.drop();
    }
    nn.drop = drop;
    /** 直接析构一个对象 */
    function dispose(o) {
        if (o == null)
            return;
        o.dispose();
    }
    nn.dispose = dispose;
    /** 错误的类型 */
    var Failed = (function () {
        function Failed(code, msg, lmsg) {
            this.code = code;
            this.message = msg;
            if (lmsg == null)
                lmsg = msg;
            this.locationMessage = lmsg;
        }
        Failed.prototype.toString = function () {
            return this.code + ': ' + this.locationMessage;
        };
        return Failed;
    }());
    nn.Failed = Failed;
    /** 测试用的 closure, 如果当前不是测试模式，则会抛出一个错误 */
    function test(cb, ctx) {
        if (nn.ISDEBUG)
            cb.call(ctx);
        else
            fatal("must remove this test");
    }
    nn.test = test;
    /** debug 模式下才执行 */
    function debug(cb, ctx) {
        nn.VERBOSE && cb.call(ctx);
    }
    nn.debug = debug;
    (function (debug) {
        debug.text = { 'p': '%c', 'c': 'color:#b0b0b0' };
        debug.obje = { 'p': '%c', 'c': 'color:#f8881a' };
        debug.info = { 'p': '', 'c': '' };
        debug.noti = { 'p': '%c', 'c': 'color:blue' };
        debug.warn = { 'p': '%c', 'c': 'color:red' };
        function log(msg, face) {
            if (nn.ISHTML5)
                console.log(face.p + msg, face.c);
            else
                console.log(msg);
        }
        debug.log = log;
        function obj(o) {
            console.log('%o', o);
        }
        debug.obj = obj;
        var FEATURE_GROUP = console.groupCollapsed != null;
        function group(msg, cb, ctx) {
            FEATURE_GROUP && console.groupCollapsed(msg);
            cb.call(ctx);
            FEATURE_GROUP && console.groupEnd();
        }
        debug.group = group;
    })(debug = nn.debug || (nn.debug = {}));
    /** dump一个变量 */
    function vardump(o, depth) {
        if (depth === void 0) { depth = 2; }
        var buf = '{';
        for (var k in o) {
            buf += '"' + k + '":';
            var v = o[k];
            if (v == null) {
                buf += 'null';
            }
            else {
                var tp = typeof (v);
                switch (tp) {
                    case 'string':
                        {
                            buf += '"' + v + '"';
                        }
                        break;
                    case 'boolean':
                        {
                            buf += v ? 'true' : 'false';
                        }
                        break;
                    case 'number':
                        {
                            buf += v;
                        }
                        break;
                    case 'function':
                        {
                            buf += v.name + '(#' + v.length + ')';
                        }
                        break;
                    default:
                        {
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
    nn.vardump = vardump;
    /** 获得调用路径 */
    function callstack() {
        var r = [];
        var o = arguments.callee.caller;
        while (o) {
            r.push(o);
            ;
            o = o.caller;
        }
        return r;
    }
    nn.callstack = callstack;
    /** 控制台输出日志 */
    function log(msg, obj) {
        nn.VERBOSE && debug.log(msg, debug.text);
    }
    nn.log = log;
    /** 控制台打印一个对象 */
    function obj(o) {
        nn.VERBOSE && debug.obj(o);
    }
    nn.obj = obj;
    /** 控制台dump一个对象 */
    function dump(o, depth) {
        if (nn.VERBOSE) {
            var s = vardump(o, depth);
            debug.log(s, debug.obje);
            return s;
        }
        return '';
    }
    nn.dump = dump;
    /** 控制台输出信息 */
    function info(msg) {
        nn.VERBOSE && debug.log(msg, debug.info);
    }
    nn.info = info;
    /** 控制台输出提示 */
    function noti(msg) {
        nn.VERBOSE && debug.log(msg, debug.noti);
    }
    nn.noti = noti;
    /** 控制台输出警告 */
    function warn(msg, title) {
        var obj = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            obj[_i - 2] = arguments[_i];
        }
        if (nn.VERBOSE) {
            debug.log(msg, debug.warn);
            obj.length && debug.group(title, function () {
                obj.forEach(function (o) {
                    debug.obj(o);
                });
            }, this);
            console.log(console.trace());
        }
    }
    nn.warn = warn;
    /** 控制台打印一个异常 */
    function exception(obj, msg) {
        if (nn.VERBOSE) {
            var s = '';
            if (msg && msg.length)
                s += msg + ': ';
            s += obj.message;
            warn(s, obj.name, obj.stack);
        }
        Debugger();
    }
    nn.exception = exception;
    /** 控制台弹窗 */
    function msgbox(msg) {
        noti(msg);
        nn.VERBOSE && alert(msg);
    }
    nn.msgbox = msgbox;
    /** 中断程序流程 */
    function assert(exp, msg) {
        if (!exp) {
            warn(msg);
            Debugger();
        }
    }
    nn.assert = assert;
    /** 如果为null，返回另外一个值 */
    function val(inp, def) {
        return inp == null ? def : inp;
    }
    nn.val = val;
    /** 取大于的数值 great-than */
    function gt(inp, cmp, def) {
        if (cmp === void 0) { cmp = 0; }
        if (def === void 0) { def = 0; }
        return inp > cmp ? inp : def;
    }
    nn.gt = gt;
    /** 取小于的数值 less-than */
    function lt(inp, cmp, def) {
        if (cmp === void 0) { cmp = 0; }
        if (def === void 0) { def = 0; }
        return inp < cmp ? inp : def;
    }
    nn.lt = lt;
    /** 是否是Chrome */
    nn.ISCHROME = window['chrome'] != null;
    /** 中断chrome的调试器 */
    function Debugger() {
        if (nn.ISCHROME)
            debugger;
    }
    nn.Debugger = Debugger;
    /** 控制台输出一个错误 */
    function fatal(msg) {
        warn(msg);
        alert(msg);
        Debugger();
    }
    nn.fatal = fatal;
    /** 带保护的取得一个对象的长度 */
    function length(o, def) {
        if (def === void 0) { def = 0; }
        if (o == null)
            return def;
        return o.length;
    }
    nn.length = length;
    /** 带保护的取一堆中第一个不是空的值 */
    function nonnull1st(def) {
        var p = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            p[_i - 1] = arguments[_i];
        }
        for (var i = 0; i < p.length; ++i) {
            var v = p[i];
            if (v != null)
                return v;
        }
        return def;
    }
    nn.nonnull1st = nonnull1st;
    /** 带保护的根据下标取得列表中的对象 */
    function at(o, idx, def) {
        if (def === void 0) { def = null; }
        if (o == null)
            return def;
        if (length(o) <= idx)
            return def;
        return o[idx];
    }
    nn.at = at;
    /** 带保护的判断对象是不是 0 */
    function isZero(o) {
        if (o == null || o == 0)
            return true;
        if (o.length)
            return o.length == 0;
        return false;
    }
    nn.isZero = isZero;
    function SafeNumber(o, def) {
        if (def === void 0) { def = 0; }
        return isNaN(o) ? def : o;
    }
    /** 转换到 float */
    function toFloat(o, def) {
        if (def === void 0) { def = 0; }
        if (o == null)
            return def;
        var tp = typeof (o);
        if (tp == 'number')
            return SafeNumber(o, def);
        if (tp == 'string') {
            var v = parseFloat(o);
            return SafeNumber(v, def);
        }
        if (o.toNumber)
            return o.toNumber();
        return def;
    }
    nn.toFloat = toFloat;
    /** 转换到 int */
    function toInt(o, def) {
        if (def === void 0) { def = 0; }
        if (o == null)
            return def;
        var tp = typeof (o);
        if (tp == 'number' || tp == 'string') {
            var v = parseInt(o);
            return SafeNumber(v, def);
        }
        if (o.toNumber)
            return o.toNumber() >> 0;
        return def;
    }
    nn.toInt = toInt;
    /** 转换到数字
        @brief 如果对象不能直接转换，会尝试调用对象的 toNumber 进行转换
    */
    function toNumber(o, def) {
        if (def === void 0) { def = 0; }
        if (o == null)
            return def;
        var tp = typeof (o);
        if (tp == 'number')
            return SafeNumber(o, def);
        if (tp == 'string') {
            if (o.indexOf('.') == -1) {
                var v_1 = parseInt(o);
                return SafeNumber(v_1, def);
            }
            var v = parseFloat(o);
            return SafeNumber(v, def);
        }
        if (o.toNumber)
            return o.toNumber();
        return def;
    }
    nn.toNumber = toNumber;
    /** 转换到字符串 */
    function asString(o, def) {
        if (def === void 0) { def = ''; }
        if (o == null)
            return def;
        var tp = typeof (o);
        if (tp == 'string')
            return o;
        if (tp == 'number')
            return SafeNumber(o).toString();
        if (o.toString)
            return o.toString();
        return def;
    }
    nn.asString = asString;
    /** 转换到对象 */
    function toJsonObject(o, def) {
        if (def === void 0) { def = null; }
        var t = typeof (o);
        if (t == 'string')
            return JSON.parse(o);
        else if (t == 'object')
            return t;
        return def;
    }
    nn.toJsonObject = toJsonObject;
    /** 格式化字符串 */
    function formatString(fmt) {
        var p = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            p[_i - 1] = arguments[_i];
        }
        try {
            return nn.Invoke1(Js.printf, this, p, fmt);
        }
        catch (err) {
            exception(new Error('format: ' + fmt + '\nargus: ' + dump(p) + '\n' + err));
        }
        return '';
    }
    nn.formatString = formatString;
    function formatStringV(fmt, p) {
        try {
            return nn.Invoke1(Js.printf, this, p, fmt);
        }
        catch (err) {
            exception(new Error('format: ' + fmt + '\nargus: ' + dump(p) + '\n' + err));
        }
        return '';
    }
    nn.formatStringV = formatStringV;
    /** 格式化字符对象 */
    var FormatString = (function () {
        function FormatString(fmt) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.fmt = fmt;
            this.args = args;
        }
        FormatString.prototype.toString = function () {
            return formatStringV(this.fmt, this.args);
        };
        return FormatString;
    }());
    nn.FormatString = FormatString;
    /** json处理，保护防止crash并且打印出数据 */
    function json_encode(obj) {
        return JSON.stringify(obj);
    }
    nn.json_encode = json_encode;
    function json_decode(str) {
        var r;
        try {
            r = JSON.parse(str);
        }
        catch (err) {
            exception(err);
        }
        return r;
    }
    nn.json_decode = json_decode;
    /** 带保护的判断对象是不是空 */
    function IsEmpty(o) {
        if (o == null)
            return true;
        var tp = typeof (o);
        if (tp == 'string') {
            if (tp.length == 0)
                return true;
            return o.match(/^\s*$/) != null;
        }
        if (o instanceof Array) {
            return o.length == 0;
        }
        if (o instanceof nn.CMap) {
            return o.length != 0;
        }
        if (o instanceof nn.CSet) {
            return o.size != 0;
        }
        return Object.keys(o).length == 0;
    }
    nn.IsEmpty = IsEmpty;
    function TRIVALUE() {
        var p = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            p[_i] = arguments[_i];
        }
        if (p.length == 3)
            return p[0] ? p[1] : p[2];
        return p[0] ? p[0] : p[1];
    }
    nn.TRIVALUE = TRIVALUE;
    /** 简单比较 */
    var CMP;
    (function (CMP) {
        CMP[CMP["EQUAL"] = 0] = "EQUAL";
        CMP[CMP["EQUALQ"] = 1] = "EQUALQ";
        CMP[CMP["LESSEQUAL"] = 2] = "LESSEQUAL";
        CMP[CMP["GREATEREQUAL"] = 3] = "GREATEREQUAL";
        CMP[CMP["LESS"] = 4] = "LESS";
        CMP[CMP["GREATER"] = 5] = "GREATER";
        CMP[CMP["NOTEQUAL"] = 6] = "NOTEQUAL";
        CMP[CMP["NOTEQUALQ"] = 7] = "NOTEQUALQ";
    })(CMP = nn.CMP || (nn.CMP = {}));
    function Cmp(l, r, cmp) {
        switch (cmp) {
            case CMP.EQUAL: return l == r;
            case CMP.EQUALQ: return l === r;
            case CMP.LESSEQUAL: return l <= r;
            case CMP.GREATEREQUAL: return l >= r;
            case CMP.LESS: return l < r;
            case CMP.GREATER: return l > r;
            case CMP.NOTEQUAL: return l != r;
            case CMP.NOTEQUALQ: return l !== r;
        }
    }
    nn.Cmp = Cmp;
    /** 编解码器 */
    var Codec = (function (_super) {
        __extends(Codec, _super);
        function Codec() {
            return _super.call(this) || this;
        }
        /** 讲一个对象写入流
            @brief 成功会返回新增的节点，失败返回 null
        */
        Codec.prototype.write = function (o) { return null; };
        /** 从流里面读取一个对象，返回读出的对象
         */
        Codec.prototype.read = function () { return null; };
        /** 转换成字符串 */
        Codec.prototype.toString = function () { return null; };
        /** 从字符串构造 */
        Codec.prototype.fromString = function (s) { };
        return Codec;
    }(SObject));
    nn.Codec = Codec;
    /** JSON 编解码器
        @brief 区分于标准的 JSON 格式化，编解码器会附带额外的类型信息，并且解码时会自动重建对象，所以速度不如格式化快，但是支持自定义对象
    */
    var JsonCodec = (function (_super) {
        __extends(JsonCodec, _super);
        function JsonCodec() {
            var _this = _super.call(this) || this;
            _this._d = [];
            _this._sck = [];
            _this._sck.push(_this._d);
            return _this;
        }
        JsonCodec.prototype.write = function (o) {
            var _this = this;
            if (o == null)
                return null;
            var top = ArrayT.Top(this._sck);
            var tp = typeof (o);
            if (tp == 'number' || tp == 'string') {
                top.push(o);
            }
            else if (tp == 'object') {
                if (o instanceof Array) {
                    var t = { '__': 'Array', '--': [] };
                    top.push(t);
                    this._sck.push(t['--']);
                    o.forEach(function (o) {
                        _this.write(o);
                    }, this);
                    this._sck.pop();
                }
                else if (o instanceof nn.CMap) {
                    var t = { '__': 'Map', '--': [[], []] };
                    top.push(t);
                    // Map 分为使用 foreach 的原生以及按照{}使用的 Kernel实现，所以得分别遍历
                    this._sck.push(t['--'][0]);
                    o.forEach(function (v, k) {
                        if (_this.write(k))
                            _this.write(v);
                    }, this);
                    this._sck.pop();
                    this._sck.push(t['--'][1]);
                    MapT.Foreach(o, function (k, v) {
                        if (_this.write(k))
                            _this.write(v);
                    }, this);
                    this._sck.pop();
                }
                else if (typeof (o.serialize) == 'function') {
                    var t = { '__': nn.Classname(o), '--': [] };
                    top.push(t);
                    this._sck.push(t['--']);
                    o.serialize(this);
                    this._sck.pop();
                }
                else {
                    var t = { '__': 'Object', '--': [] };
                    top.push(t);
                    this._sck.push(t['--']);
                    MapT.Foreach(o, function (k, v) {
                        if (_this.write(k))
                            _this.write(v);
                    }, this);
                    this._sck.pop();
                }
            }
            else {
                return null;
            }
            return top;
        };
        JsonCodec.prototype.read = function () {
            var _this = this;
            var top = ArrayT.Top(this._sck);
            var o = top[0];
            var tp = typeof (o);
            if (tp == 'number' || tp == 'string') {
                return o;
            }
            var objcls = o['__'];
            var objdata = o['--'];
            var obj = eval("new " + objcls + '()');
            if (objcls == 'Array') {
                objdata.forEach(function (o) {
                    _this._sck.push([o]);
                    var v = _this.read();
                    _this._sck.pop();
                    obj.push(v);
                }, this);
            }
            else if (objcls == 'Map') {
                var o0 = objdata[0];
                var o1 = objdata[1];
                for (var i = 0; i < o0.length; ++i) {
                    var k = o0[i];
                    var v = o0[++i];
                    this._sck.push([k]);
                    k = this.read();
                    this._sck.pop();
                    this._sck.push([v]);
                    v = this.read();
                    this._sck.pop();
                    obj.set(k, v);
                }
                for (var i = 0; i < o1.length; ++i) {
                    var k = o1[i];
                    var v = o1[++i];
                    this._sck.push([k]);
                    k = this.read();
                    this._sck.pop();
                    this._sck.push([v]);
                    v = this.read();
                    this._sck.pop();
                    obj[k] = v;
                }
            }
            else if (objcls == 'Object') {
                for (var i = 0; i < objdata.length; ++i) {
                    var k = objdata[i];
                    var v = objdata[++i];
                    this._sck.push([k]);
                    k = this.read();
                    this._sck.pop();
                    this._sck.push([v]);
                    v = this.read();
                    this._sck.pop();
                    obj[k] = v;
                }
            }
            else if (typeof (obj.unserialize) == 'function') {
                this._sck.push(objdata);
                obj.unserialize(this);
                this._sck.pop();
            }
            return obj;
        };
        JsonCodec.prototype.toString = function () {
            return JSON.stringify(this._d);
        };
        JsonCodec.prototype.fromString = function (s) {
            this.clear();
            var o = JSON.parse(s);
            ArrayT.Set(this._d, o);
            this.read();
        };
        JsonCodec.prototype.clear = function () {
            this._d.length = 0;
            this._sck.length = 0;
            this._sck.push(this._d);
        };
        return JsonCodec;
    }(Codec));
    nn.JsonCodec = JsonCodec;
    /** 文本生成器 */
    var StringBuilder = (function () {
        function StringBuilder() {
            /** 行结尾 */
            this.linebreak = '\n';
            this._buf = '';
        }
        /** 添加行 */
        StringBuilder.prototype.line = function (s, color, size) {
            if (s == null)
                s = '';
            if (color != null || size != null)
                this.font(color, size);
            this._buf += s + this.linebreak;
            return this;
        };
        /** 添加文字 */
        StringBuilder.prototype.add = function (s, color, size) {
            if (s == null)
                s = '';
            if (color != null || size != null)
                this.font(color, size);
            this._buf += s;
            return this;
        };
        /** 设置一个样式 */
        StringBuilder.prototype.font = function (color, size) {
            var st = '';
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
        };
        /** 添加一个链接 */
        StringBuilder.prototype.href = function (text, addr) {
            if (addr == null)
                addr = text;
            this._buf += '<font u=true href=event:' + addr + '>' + text;
            return this;
        };
        /** 添加一个可以触摸的区域 */
        StringBuilder.prototype.touch = function (text) {
            this._buf += '<font href=event:' + text + '>' + text;
            return this;
        };
        /** 恢复之前的样式 */
        StringBuilder.prototype.pop = function () {
            this._buf += '</font>';
            return this;
        };
        StringBuilder.prototype.concat = function (r) {
            this._buf += r._buf;
            return this;
        };
        /** 格式化输出 */
        StringBuilder.prototype.toString = function () {
            return this._buf;
        };
        return StringBuilder;
    }());
    nn.StringBuilder = StringBuilder;
    var UnsignedInt = (function () {
        function UnsignedInt(d) {
            if (d === void 0) { d = 0; }
            this.obj = d;
        }
        Object.defineProperty(UnsignedInt.prototype, "obj", {
            get: function () {
                return this._obj;
            },
            set: function (d) {
                if (d < 0)
                    this._d = nn.MAX_INT + d;
                else
                    this._d = d;
                this._obj = d;
            },
            enumerable: true,
            configurable: true
        });
        UnsignedInt.prototype.valueOf = function () {
            return this._d;
        };
        return UnsignedInt;
    }());
    nn.UnsignedInt = UnsignedInt;
    var SafeSet = (function () {
        function SafeSet() {
            this._set = new nn.CSet();
        }
        SafeSet.prototype.has = function (v) {
            return this._set.has(v);
        };
        SafeSet.prototype.delete = function (v) {
            if (this._set.has(v))
                this._set.delete(v);
        };
        SafeSet.prototype.add = function (v) {
            if (this._set.has(v) == false)
                this._set.add(v);
        };
        SafeSet.prototype.forEach = function (p, ctx) {
            this._set.forEach(p, ctx);
        };
        Object.defineProperty(SafeSet.prototype, "size", {
            get: function () {
                return this._set.size;
            },
            enumerable: true,
            configurable: true
        });
        SafeSet.prototype.clear = function () {
            this._set.clear();
        };
        return SafeSet;
    }());
    nn.SafeSet = SafeSet;
    /** 提供操作基础对象的工具函数 */
    var ObjectT = (function () {
        function ObjectT() {
        }
        /** 比较两个实例是否相等
            @brief 优先使用比较函数的结果
        */
        ObjectT.IsEqual = function (l, r, eqfun, eqctx) {
            if (l == null || r == null)
                return false;
            if (eqfun)
                return eqfun.call(eqctx, l, r);
            if (l && l.isEqual)
                return l.isEqual(r);
            if (r && r.isEqual)
                return r.isEqual(l);
            return l == r;
        };
        /** 面向对象的深度copy
            @highRight 以右面的对象为主
        */
        ObjectT.Copy = function (l, r, highRight) {
            var _this = this;
            if (highRight === void 0) { highRight = true; }
            if (this.IsEqual(l, r))
                return;
            var b = highRight ? r : l;
            var keys = Object.keys(b);
            ArrayT.RemoveObjectsInArray(keys, nn.OBJECT_DEFAULT_KEYS);
            keys.forEach(function (key) {
                if (key.indexOf('_') == 0)
                    return;
                var t = typeof (b[key]);
                if (t == "string" || t == "number" || t == "boolean") {
                    l[key] = r[key];
                }
                else if (t == "object") {
                    var v_2 = r[key];
                    if (v_2 instanceof Array) {
                        if (l[key] == null)
                            l[key] = [];
                        var tmp_1 = l[key];
                        ArrayT.Resize(tmp_1, v_2.length);
                        // 复制对象
                        tmp_1.forEach(function (o, idx) {
                            if (o == null) {
                                o = nn.InstanceNewObject(v_2[idx]);
                                tmp_1[idx] = o;
                            }
                            // 复制内容
                            _this.Copy(o, v_2[idx]);
                        });
                    }
                    else {
                        var o = nn.InstanceNewObject(v_2);
                        _this.Copy(o, v_2);
                        l[key] = o;
                    }
                }
            });
        };
        /** 根据查询路径获取值 */
        ObjectT.GetValueByKeyPath = function (o, kp, def) {
            if (o == null)
                return def;
            var ks = kp.split('.');
            for (var i = 0; i < ks.length; ++i) {
                o = o[ks[i]];
                if (o == null)
                    return def;
            }
            return o;
        };
        /** 根据查询路径设置值 */
        ObjectT.SetValueByKeyPath = function (o, kp, v) {
            if (o == null) {
                warn("不能对null进行keypath的设置操作");
                return;
            }
            var ks = kp.split('.');
            var l = ks.length - 1;
            for (var i = 0; i < l; ++i) {
                var k = ks[i];
                var t = o[k];
                if (t == null) {
                    t = {};
                    o[k] = t;
                }
                o = t;
            }
            ;
            o[ks[l]] = v;
        };
        return ObjectT;
    }());
    nn.ObjectT = ObjectT;
    /** 操作 number */
    var NumberT = (function () {
        function NumberT() {
        }
        /** 任一数字的科学计数读法
            @return 数字部分和e的部分
        */
        NumberT.SciNot = function (v) {
            var n = NumberT.log(v, 10);
            var l = v / Math.pow(10, n);
            return [l, n];
        };
        /** 方根 */
        NumberT.radical = function (v, x, n) {
            return Math.exp(1 / n * Math.log(x));
        };
        /** 对数 */
        NumberT.log = function (v, n) {
            var r = Math.log(v) / Math.log(n) + 0.0000001;
            return r >> 0;
        };
        /** 修正为无符号 */
        NumberT.Unsigned = function (v) {
            if (v < 0)
                return 0xFFFFFFFF + v + 1;
            return v;
        };
        /** 映射到以m为底的数 */
        NumberT.MapToBase = function (v, base) {
            if (v % base == 0)
                return base;
            return v % base;
        };
        /** 运算，避免为null时候变成nan */
        NumberT.Add = function (v, r) {
            if (v == null)
                v = 0;
            if (r == null)
                r = 0;
            return v + r;
        };
        NumberT.Sub = function (v, r) {
            if (v == null)
                v = 0;
            if (r == null)
                r = 0;
            return v - r;
        };
        NumberT.Multiply = function (v, r) {
            if (v == null)
                v = 0;
            if (r == null)
                r = 0;
            return v * r;
        };
        NumberT.Div = function (v, r) {
            if (v == null)
                v = 0;
            if (r == null || r == 0)
                return nn.MAX_INT;
            return v / r;
        };
        /** 中文化数字 */
        NumberT.Hanlize = function (v) {
            var neg;
            if (v < 0) {
                neg = true;
                v = -v;
            }
            var r = neg ? '负' : '';
            if (v <= 10)
                r += this.HANMAPS[v];
            // TODO: 其他数字算法等用到的时候再实现
            return r;
        };
        return NumberT;
    }());
    NumberT.HANMAPS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    nn.NumberT = NumberT;
    /** 操作 string */
    var StringT = (function () {
        function StringT() {
        }
        /** 优化显示float
            @param v 输入的数字
            @param dp decimalplace 小数位
            @param term 是否去除末尾的0
        */
        StringT.FormatFloat = function (v, dp, term) {
            if (term === void 0) { term = true; }
            var s = formatString('%.' + dp + 'f', v);
            if (term)
                s = this.TermFloat(s);
            return s;
        };
        // 去除掉float后面的0
        StringT.TermFloat = function (str) {
            var lr = str.split('.');
            if (lr.length != 2) {
                warn("传入的 stirng 格式错误");
                return str;
            }
            var ro = lr[1], m = false, rs = '';
            for (var i = ro.length; i > 0; --i) {
                var c = ro[i - 1];
                if (!m && c != '0')
                    m = true;
                if (m)
                    rs = c + rs;
            }
            if (rs.length == 0)
                return lr[0];
            return lr[0] + '.' + rs;
        };
        StringT.Hash = function (str) {
            var hash = 0;
            if (str.length == 0)
                return hash;
            for (var i = 0; i < str.length; ++i) {
                hash = (((hash << 5) - hash) + str.charCodeAt(i)) & 0xffffffff;
            }
            return hash;
        };
        StringT.Count = function (str, substr) {
            var pos = str.indexOf(substr);
            if (pos == -1)
                return 0;
            var r = 1;
            r += this.Count(str.substr(pos + substr.length), substr);
            return r;
        };
        /** 计算ascii的长度 */
        StringT.AsciiLength = function (str) {
            var r = 0;
            for (var i = 0; i < str.length; ++i) {
                var c = str.charCodeAt(i);
                r += c > 128 ? 2 : 1;
            }
            return r;
        };
        /** 拆分，可以选择是否去空 */
        StringT.Split = function (str, sep, skipempty) {
            if (skipempty === void 0) { skipempty = true; }
            var r = str.split(sep);
            var r0 = [];
            r.forEach(function (e) {
                if (e.length)
                    r0.push(e);
            });
            return r0;
        };
        /** 拉开，如果不足制定长度，根据mode填充
            @param mode 0:中间填充，1:左边填充，2:右边填充
            @param wide 是否需要做宽字符补全，如果str为中文并且sep为单字节才需要打开
         */
        StringT.Stretch = function (str, len, mode, sep, wide) {
            if (mode === void 0) { mode = 0; }
            if (sep === void 0) { sep = ' '; }
            if (wide === void 0) { wide = true; }
            if (str.length >= len)
                return str;
            if (str.length == 0) {
                var r_1 = '';
                while (len--)
                    r_1 += sep;
                return r_1;
            }
            var n = len - str.length;
            var r = '';
            switch (mode) {
                case 0:
                    {
                        var c = (len - str.length) / (str.length - 1);
                        if (wide)
                            c *= 2;
                        if (c >= 1) {
                            // 每个字符后面加sep
                            for (var i = 0; i < str.length - 1; ++i) {
                                r += str[i];
                                for (var j = 0; j < c; ++j)
                                    r += sep;
                            }
                            r += str[str.length - 1];
                        }
                        else {
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
                case 1:
                    {
                        while (n--)
                            r = sep + r;
                        r += str;
                    }
                    break;
                case 2:
                    {
                        r = str;
                        while (n--)
                            r += sep;
                    }
                    break;
            }
            return r;
        };
        StringT.ForeachAsciiCode = function (s, f) {
            var b = new egret.ByteArray();
            b.writeUTFBytes(s);
            b.position = 0;
            var lb = b.length;
            for (var i = 0; i < lb; ++i)
                f(b.readUnsignedByte(), i);
        };
        StringT.Code = function (s) {
            var r = [];
            var l = s.length;
            for (var i = 0; i < l; ++i)
                r.push(s.charCodeAt(i));
            return r;
        };
        StringT.FromCode = function (c) {
            return String.fromCharCode.apply(null, c);
        };
        return StringT;
    }());
    nn.StringT = StringT;
    /** 提供了操作 array 的工具函数 */
    var ArrayT = (function () {
        function ArrayT() {
        }
        /** 初始化数量 */
        ArrayT.Allocate = function (count, def) {
            var isfun = typeof (def) == 'function';
            var f = def;
            var r = [];
            for (var i = 0; i < count; ++i) {
                var o = isfun ? f(i) : def;
                r.push(o);
            }
            return r;
        };
        /** 转换成数组 */
        ArrayT.ToArray = function (o) {
            if (o == null)
                return [];
            if (o instanceof Array)
                return o;
            return [o];
        };
        /** 合并所有的数组 */
        ArrayT.Merge = function () {
            var arr = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arr[_i] = arguments[_i];
            }
            var r = [];
            arr.forEach(function (arr) {
                r = r.concat(arr);
            });
            return r;
        };
        /** 使用比较函数来判断是否包含元素 */
        ArrayT.Contains = function (arr, o, eqfun, eqctx) {
            return arr.some(function (each) {
                return ObjectT.IsEqual(each, o, eqfun, eqctx);
            }, this);
        };
        /** 合并 */
        ArrayT.Concat = function (l, r) {
            if (l == null)
                return r;
            if (r == null)
                return l;
            return l.concat(r);
        };
        /** 压入一组数据 */
        ArrayT.PushObjects = function (arr, p) {
            p && p.forEach(function (e) {
                arr.push(e);
            });
        };
        /** 把 array 当成 stack 取得栈顶 */
        ArrayT.Top = function (arr, def) {
            return at(arr, arr.length - 1, def);
        };
        /** 设置栈顶元素，如果 array.len == 0，则添加该元素 */
        ArrayT.SetTop = function (arr, o) {
            if (arr.length == 0)
                arr.push(o);
            else
                arr[arr.length - 1] = o;
        };
        /** 弹出栈顶 */
        ArrayT.PopTop = function (arr, def) {
            if (arr.length == 0)
                return def;
            return arr.pop();
        };
        /** 查询 */
        ArrayT.QueryObject = function (arr, fun, ctx, def) {
            var r = def;
            arr.some(function (o, idx) {
                if (fun.call(ctx, o, idx)) {
                    r = o;
                    return true;
                }
                return false;
            }, this);
            return r;
        };
        /** 查找所有符合条件的对象 */
        ArrayT.QueryObjects = function (arr, fun, ctx) {
            var r = [];
            arr.forEach(function (o, idx) {
                if (fun.call(ctx, o, idx))
                    r.push(o);
            });
            return r;
        };
        /** 查询条件对应的索引 */
        ArrayT.QueryIndex = function (arr, fun, ctx, def) {
            var r = def;
            arr.some(function (o, idx) {
                if (fun.call(ctx, o, idx)) {
                    r = idx;
                    return true;
                }
                return false;
            }, this);
            return r;
        };
        /** 不为指定数据的数组长度 */
        ArrayT.TrustLength = function (arr, tgt) {
            if (tgt === void 0) { tgt = null; }
            var r = 0;
            arr.forEach(function (e) {
                if (e != tgt)
                    ++r;
            });
            return r;
        };
        /** 覆盖指定数据到数组 */
        ArrayT.TrustAddObject = function (arr, src, tgt) {
            if (tgt === void 0) { tgt = null; }
            for (var i = 0; i < arr.length; ++i) {
                if (arr[i] == tgt) {
                    arr[i] = src;
                    return true;
                }
            }
            return false;
        };
        /** 移除数据 */
        ArrayT.TrustRemoveObject = function (arr, src, tgt) {
            if (tgt === void 0) { tgt = null; }
            var idx = arr.indexOf(src);
            if (idx == -1)
                return;
            arr[idx] = tgt;
        };
        /** 覆盖数组 */
        ArrayT.TrustSet = function (arr, tgt, def) {
            if (def === void 0) { def = null; }
            for (var i = 0; i < arr.length; ++i) {
                var o = tgt[i];
                arr[i] = o ? o : def;
            }
        };
        /** 弹出数据 */
        ArrayT.TrustPop = function (arr, tgt, def) {
            if (def === void 0) { def = null; }
            for (var i = 0; i < arr.length; ++i) {
                var o = this.RemoveObjectAtIndex(tgt, 0);
                arr[i] = o ? o : def;
            }
        };
        /** 清除 */
        ArrayT.TrustClear = function (arr, tgt) {
            if (tgt === void 0) { tgt = null; }
            for (var i = 0; i < arr.length; ++i)
                arr[i] = tgt;
        };
        /** 插入元素 */
        ArrayT.InsertObjectAtIndex = function (arr, o, idx) {
            arr.splice(idx, 0, o);
        };
        /** 清空数组，并挨个回调 */
        ArrayT.Clear = function (arr, cb, ctx) {
            if (cb)
                arr.forEach(cb, ctx);
            arr.length = 0;
        };
        /** 安全的清空，以避免边加边删的边际效应 */
        ArrayT.SafeClear = function (arr, cb, ctx) {
            ArrayT.Clear(ArrayT.Clone(arr), cb, ctx);
            arr.length = 0;
        };
        /** 安全的增加，如果为null，则推入def，如果def也是null，则不推入 */
        ArrayT.SafePush = function (arr, o, def) {
            var obj = o ? o : def;
            if (obj)
                arr.push(obj);
        };
        /** 填充一个数组 */
        ArrayT.Fill = function (arr, cnt, instance, ctx) {
            if (arr == null)
                arr = [];
            while (cnt--) {
                arr.push(instance.call(ctx));
            }
            return arr;
        };
        /** 使用类型来自动实例化并填充数组 */
        ArrayT.FillType = function (arr, cnt, cls) {
            if (arr == null)
                arr = [];
            while (cnt--) {
                arr.push(new cls());
            }
            return arr;
        };
        /** 带保护的两两遍历 */
        ArrayT.ForeachWithArray = function (arrl, arrr, cb, ctx, def) {
            var cntl = arrl.length, cntr = arrr.length;
            var cnt = Math.max(cntl, cntr);
            for (var i = 0; i < cnt; ++i) {
                var ol = i < cntl ? arrl[i] : def;
                var or = i < cntr ? arrr[i] : def;
                cb.call(ctx, ol, or, i);
            }
        };
        /** 带 break 的索引遍历 */
        ArrayT.Foreach = function (arr, cb, ctx) {
            arr.every(function (each, idx) {
                return cb.call(ctx, each, idx);
            }, this);
        };
        /** 按照行来遍历 */
        ArrayT.ForeachRow = function (arr, columns, cb, ctx) {
            var rows = Math.ceil(arr.length / columns);
            for (var r = 0; r < rows; ++r) {
                for (var c = 0; c < columns; ++c) {
                    var i = r * columns + c;
                    if (cb.call(ctx, arr[i], r, c, i, rows) == false)
                        return;
                }
            }
        };
        /** 随机一个 */
        ArrayT.Random = function (arr) {
            if (arr.length == 0)
                return null;
            return arr[Random.Rangei(0, arr.length)];
        };
        /** 安全的遍历，以避免边删边加的边际效应 */
        ArrayT.SafeForeach = function (arr, cb, ctx) {
            ArrayT.Foreach(ArrayT.Clone(arr), cb, ctx);
        };
        /** 迭代数组，提供结束的标识 */
        ArrayT.Iterate = function (arr, cb, ctx) {
            if (arr.length == 0)
                return;
            var len = arr.length - 1;
            ArrayT.Foreach(arr, function (o, idx) {
                return cb.call(ctx, o, idx, idx == len);
            }, ctx);
        };
        /** 使用指定索引全遍历数组，包括索引外的 */
        ArrayT.FullEach = function (arr, idx, cbin, cbout) {
            var len = Math.min(arr.length, idx);
            for (var i = 0; i < len; ++i) {
                cbin(arr[i], i);
            }
            if (len >= idx) {
                len = arr.length;
                for (var i = idx; i < len; ++i) {
                    cbout(arr[i], i);
                }
            }
        };
        /** 带筛选器的统计个数 */
        ArrayT.LengthQuery = function (arr, cb, ctx) {
            var ret = 0;
            arr.forEach(function (each, idx) {
                if (cb.call(ctx, each, idx))
                    ret += 1;
            }, this);
            return ret;
        };
        /** 删除一个对象 */
        ArrayT.RemoveObject = function (arr, obj) {
            if (obj == null || arr == null)
                return false;
            var idx = arr.indexOf(obj);
            if (nn.ISDEBUG && idx == -1) {
                warn("obj 不属于 array 的元素");
                return false;
            }
            arr.splice(idx, 1);
            return true;
        };
        /** 删除指定索引的对象 */
        ArrayT.RemoveObjectAtIndex = function (arr, idx) {
            var r = arr.splice(idx, 1);
            return r[0];
        };
        /** 使用筛选器来删除对象 */
        ArrayT.RemoveObjectByFilter = function (arr, filter, ctx) {
            for (var i = 0; i < arr.length; ++i) {
                var e = arr[i];
                if (filter.call(ctx, e, i)) {
                    arr.splice(i, 1);
                    return e;
                }
            }
            return null;
        };
        ArrayT.RemoveObjectsByFilter = function (arr, filter, ctx) {
            var r = [];
            var res = arr.filter(function (o, idx) {
                if (filter.call(ctx, o, idx)) {
                    r.push(o);
                    return false;
                }
                return true;
            }, this);
            if (arr.length == res.length)
                return r;
            ArrayT.Set(arr, res);
            return r;
        };
        /** 移除位于另一个 array 中的所有元素 */
        ArrayT.RemoveObjectsInArray = function (arr, r) {
            var res = arr.filter(function (each, idx) {
                return !ArrayT.Contains(r, each);
            }, this);
            ArrayT.Set(arr, res);
        };
        /** 使用位于另一个 array 中对应下标的元素 */
        ArrayT.RemoveObjectsInIndexArray = function (arr, r) {
            var rm = [];
            var res = arr.filter(function (each, idx) {
                if (ArrayT.Contains(r, idx) == true) {
                    rm.push(each);
                    return false;
                }
                return true;
            }, this);
            ArrayT.Set(arr, res);
            return rm;
        };
        /** 调整大小 */
        ArrayT.Resize = function (arr, size, def) {
            if (arr.length < size) {
                var cnt = size - arr.length;
                var base = arr.length;
                for (var i = 0; i < cnt; ++i) {
                    arr.push(def);
                }
            }
            else if (arr.length > size) {
                arr.length = size;
            }
        };
        /** 上浮满足需求的对象 */
        ArrayT.Rise = function (arr, q) {
            var r = [];
            var n = [];
            arr.forEach(function (e) {
                if (q(e))
                    r.push(e);
                else
                    n.push(e);
            });
            this.Set(arr, r.concat(n));
        };
        /** 下沉满足需求的对象 */
        ArrayT.Sink = function (arr, q) {
            var r = [];
            var n = [];
            arr.forEach(function (e) {
                if (q(e))
                    r.push(e);
                else
                    n.push(e);
            });
            this.Set(arr, n.concat(r));
        };
        /** 使用另一个数组来填充当前数组 */
        ArrayT.Set = function (arr, r) {
            arr.length = 0;
            r.forEach(function (o) {
                arr.push(o);
            }, this);
        };
        /** 复制 */
        ArrayT.Clone = function (arr) {
            return arr.concat();
        };
        /** 转换 */
        ArrayT.Convert = function (arr, convert, ctx) {
            var r = [];
            arr.forEach(function (o, idx) {
                r.push(convert.call(ctx, o, idx));
            });
            return r;
        };
        /** 安全转换，如果结果为null，则跳过 */
        ArrayT.SafeConvert = function (arr, convert, ctx) {
            var r = [];
            arr.forEach(function (o, idx) {
                var t = convert.call(ctx, o, idx);
                if (t)
                    r.push(t);
            });
            return r;
        };
        /** 提取 */
        ArrayT.Filter = function (arr, filter, ctx) {
            var r = [];
            arr.forEach(function (o, idx) {
                var r = filter.call(ctx, o, idx);
                if (r)
                    r.push(r);
            });
            return r;
        };
        /** 数组 l 和 r 的共有项目 */
        ArrayT.ArrayInArray = function (l, r) {
            return l.filter(function (o) {
                return ArrayT.Contains(r, o);
            }, this);
        };
        /** 合并 */
        ArrayT.Combine = function (l, sep) {
            var r = l[0];
            for (var i = 1; i < l.length; i++) {
                r += sep + l[i];
            }
            return r;
        };
        /** 检查两个是否一样 */
        ArrayT.EqualTo = function (l, r, eqfun, eqctx) {
            if (l.length != r.length)
                return false;
            return r.every(function (o) {
                return ArrayT.Contains(l, o, eqfun, eqctx);
            }, this);
        };
        /** 严格(包含次序)检查两个是否一样 */
        ArrayT.StrictEqualTo = function (l, r, eqfun, eqctx) {
            if (l.length != r.length)
                return false;
            return r.every(function (o, idx) {
                return ObjectT.IsEqual(o, r[idx], eqfun, eqctx);
            }, this);
        };
        /** 乱序 */
        ArrayT.Disorder = function (arr) {
            arr.sort(function () {
                return Math.random();
            });
        };
        /** 截取尾部的空对象 */
        ArrayT.Trim = function (arr, emp) {
            if (emp === void 0) { emp = null; }
            var t = [];
            for (var i = arr.length; i != 0; --i) {
                var o = arr[i - 1];
                if (t.length == 0 && o == emp)
                    continue;
                t.push(o);
            }
            ArrayT.Set(arr, t.reverse());
        };
        /** 去重 */
        ArrayT.HashUnique = function (arr, hash) {
            if (hash === void 0) { hash = true; }
            var t = [];
            if (hash) {
                var h_1 = {};
                arr.forEach(function (o) {
                    var k = o.hashCode;
                    if (h_1[k])
                        return;
                    t.push(o);
                    h_1[k] = true;
                });
            }
            else {
                arr.forEach(function (o) {
                    if (t.indexOf(o) == -1)
                        t.push(o);
                });
            }
            this.Set(arr, t);
        };
        ArrayT.Unique = function (arr, eqfun, eqctx) {
            var _this = this;
            var t = [];
            arr.forEach(function (o) {
                if (_this.Contains(t, o, eqfun, eqctx) == false)
                    t.push(o);
            });
            this.Set(arr, t);
        };
        /** 取得一段 */
        ArrayT.RangeOf = function (arr, pos, len) {
            var n = arr.length;
            if (pos < 0) {
                pos = n + pos;
                if (pos < 0)
                    return arr;
            }
            if (pos >= n)
                return [];
            var c = len == null ? n : pos + len;
            return arr.slice(pos, c);
        };
        /** 弹出一段 */
        ArrayT.PopRangeOf = function (arr, pos, len) {
            var n = arr.length;
            if (pos < 0) {
                pos = n + pos;
                if (pos < 0) {
                    var r = arr.concat();
                    arr.length = 0;
                    return r;
                }
            }
            if (pos >= n)
                return [];
            var c = len == null ? n - pos : len;
            return arr.splice(pos, c);
        };
        /** 根据长度拆成几个Array */
        ArrayT.SplitByLength = function (arr, len) {
            var r = [];
            var n = Math.ceil(arr.length / len);
            for (var i = 0; i < n; ++i) {
                r.push(this.RangeOf(arr, i * len, len));
            }
            return r;
        };
        /** 快速返回下一个或上一个 */
        ArrayT.Next = function (arr, obj, def) {
            var idx = arr.indexOf(obj);
            if (idx == -1)
                return def;
            if (idx + 1 == arr.length)
                return def;
            return arr[idx + 1];
        };
        ArrayT.Previous = function (arr, obj, def) {
            var idx = arr.indexOf(obj);
            if (idx == -1)
                return def;
            if (idx == 0)
                return def;
            return arr[idx - 1];
        };
        return ArrayT;
    }());
    nn.ArrayT = ArrayT;
    function linq(arr) {
        return new LINQ(arr);
    }
    nn.linq = linq;
    /** 模拟linq的类 */
    var LINQ = (function () {
        function LINQ(arr) {
            // 为了加速查询，默认的arr一开时使用引用的模式，当修改时再进行copy
            this._ref = true;
            if (arr) {
                this._arr = arr;
            }
            else {
                this._arr = new Array();
                this._ref = false;
            }
        }
        LINQ.prototype._safe = function () {
            if (this._ref) {
                this._arr = this._arr.concat();
                this._ref = false;
            }
        };
        LINQ.prototype.forEach = function (fun) {
            for (var i = 0, n = this._arr.length; i < n; ++i) {
                if (fun(this._arr[i], i) == false)
                    return;
            }
        };
        LINQ.prototype.where = function (sel) {
            var r = [];
            this._arr.forEach(function (e, idx) {
                if (sel(e, idx))
                    r.push(e);
            });
            return nn.InstanceNewObject(this, r);
        };
        LINQ.prototype.count = function (sel) {
            if (sel)
                return this.where(sel).count();
            return this._arr.length;
        };
        LINQ.prototype.add = function (o) {
            this._safe();
            this._arr.push(o);
        };
        LINQ.prototype.exists = function (cond) {
            return ArrayT.QueryObject(this._arr, cond) != null;
        };
        LINQ.prototype.first = function (sel) {
            if (this._arr.length == 0)
                return null;
            if (!sel)
                return this._arr[0];
            var res = this.where(sel);
            if (res.count() == 0)
                return null;
            return res.at(0);
        };
        LINQ.prototype.last = function (sel) {
            if (this._arr.length == 0)
                return null;
            if (!sel)
                return this._arr[this._arr.length - 1];
            var res = this.where(sel);
            if (res.count() == 0)
                return null;
            return res.last();
        };
        LINQ.prototype.at = function (idx) {
            if (idx < 0 || idx > this._arr.length)
                return null;
            return this._arr[idx];
        };
        LINQ.prototype.union = function (tgt, getkey) {
            var r = [];
            var map = {};
            this._arr.forEach(function (e) {
                var h = Js.hashKey(getkey(e));
                if (!map[h]) {
                    map[h] = e;
                    r.push(e);
                }
            });
            tgt.forEach(function (e) {
                var h = Js.hashKey(getkey(e));
                if (!map[h]) {
                    map[h] = e;
                    r.push(e);
                }
            });
            return nn.InstanceNewObject(this, r);
        };
        return LINQ;
    }());
    nn.LINQ = LINQ;
    /** set 的工具类 */
    var SetT = (function () {
        function SetT() {
        }
        /** 删除对象 */
        SetT.RemoveObject = function (s, o) {
            s.delete(o);
        };
        /** 复制 */
        SetT.Clone = function (s) {
            var r = new nn.CSet();
            s.forEach(function (o) {
                r.add(o);
            }, this);
            return r;
        };
        /** 转换到 array */
        SetT.ToArray = function (s) {
            var r = new Array();
            s.forEach(function (o) {
                r.push(o);
            }, this);
            return r;
        };
        /** 清空 */
        SetT.Clear = function (s, cb, ctx) {
            if (s.size == 0)
                return;
            if (cb)
                s.forEach(cb, ctx);
            s.clear();
        };
        /** 带保护的清空，以避免边际效应 */
        SetT.SafeClear = function (s, cb, ctx) {
            if (s.size == 0)
                return;
            var ns = SetT.Clone(s);
            s.clear();
            ns.forEach(cb, ctx);
        };
        return SetT;
    }());
    nn.SetT = SetT;
    /** map 的工具类 */
    var MapT = (function () {
        function MapT() {
        }
        /** 获取 */
        MapT.Get = function (m, k) {
            return m[k];
        };
        /** 获取所有的value */
        MapT.GetValues = function (m) {
            var r = [];
            this.Foreach(m, function (k, v) {
                r.push(v);
            });
            return r;
        };
        /** 增加 */
        MapT.Add = function (m, k, v) {
            m[k] = v;
        };
        /** 遍历 */
        MapT.Foreach = function (m, fun, ctx) {
            var keys = Object.keys(m);
            keys.forEach(function (k) {
                fun.call(ctx, k, m[k]);
            }, this);
        };
        /** 转换 */
        MapT.ToArray = function (m, fun, ctx) {
            var r = [];
            var keys = Object.keys(m);
            keys.forEach(function (k) {
                var obj = fun.call(ctx, k, m[k]);
                r.push(obj);
            }, this);
            return r;
        };
        MapT.SafeToArray = function (m, fun, ctx) {
            var r = [];
            var keys = Object.keys(m);
            keys.forEach(function (k) {
                var obj = fun.call(ctx, k, m[k]);
                if (obj)
                    r.push(obj);
            }, this);
            return r;
        };
        /** 取值 */
        MapT.QueryObject = function (m, fun, ctx) {
            var keys = Object.keys(m);
            for (var i = 0; i < keys.length; ++i) {
                var k = keys[i];
                if (fun.call(ctx, k, m[k]))
                    return [k, m[k]];
            }
            return null;
        };
        MapT.QueryObjects = function (m, fun, ctx) {
            var keys = Object.keys(m);
            var r = {};
            keys.forEach(function (k) {
                var v = m[k];
                if (fun.call(ctx, k, v))
                    r[k] = v;
            });
            return r;
        };
        /** 获取值 */
        MapT.QueryValue = function (m, fun, ctx) {
            var fnd = this.QueryObject(m, fun, ctx);
            return fnd ? fnd[1] : null;
        };
        MapT.QueryValues = function (m, fun, ctx) {
            var keys = Object.keys(m);
            var r = [];
            keys.forEach(function (k) {
                var v = m[k];
                if (fun.call(ctx, k, v))
                    r.push(v);
            });
            return r;
        };
        MapT.QueryKey = function (m, fun, ctx) {
            var fnd = this.QueryObject(m, fun, ctx);
            return fnd ? fnd[0] : null;
        };
        MapT.QueryKeys = function (m, fun, ctx) {
            var keys = Object.keys(m);
            var r = [];
            keys.forEach(function (k) {
                var v = m[k];
                if (fun.call(ctx, k, v))
                    r.push(k);
            });
            return r;
        };
        /** 判断是否为空 */
        MapT.IsEmpty = function (m) {
            if (m == null)
                return true;
            return Object.keys(m).length == 0;
        };
        /** 删除key的元素 */
        MapT.RemoveKey = function (m, k) {
            delete m[k];
        };
        /** 清空 */
        MapT.Clear = function (m, cb, ctx) {
            MapT.Foreach(m, function (k, v) {
                if (cb)
                    cb.call(ctx, k, v);
                delete m[k];
            }, this);
        };
        /** 合并 */
        MapT.Concat = function (l, r) {
            if (l == null)
                return r;
            if (r == null)
                return l;
            MapT.Foreach(r, function (k, v) {
                l[k] = v;
            }, this);
        };
        /** 复制 */
        MapT.Clone = function (l) {
            var r = new KvObject();
            MapT.Foreach(l, function (k, v) {
                r[k] = v;
            }, this);
            return r;
        };
        /** 获取长度 */
        MapT.Length = function (m) {
            return Object.keys(m).length;
        };
        /** 使用下标获取对象 */
        MapT.ObjectAtIndex = function (m, idx, def) {
            var keys = Object.keys(m);
            var k = at(keys, idx, null);
            if (k == null)
                return def;
            return m[k];
        };
        /** 转换成普通Object */
        MapT.Simplify = function (m) {
            var obj = {};
            this.Foreach(m, function (k, v) {
                obj[k] = v;
            });
            return obj;
        };
        return MapT;
    }());
    nn.MapT = MapT;
    /** 使用索引的 map，可以按照顺序来获取元素 */
    var IndexedMap = (function () {
        function IndexedMap() {
            this._map = {};
            this._keys = new Array();
            this._vals = new Array();
        }
        /** 添加 */
        IndexedMap.prototype.add = function (k, v) {
            if (k in this._map) {
                var idx = this._keys.indexOf(k);
                this._keys[idx] = k;
                this._vals[idx] = v;
            }
            else {
                this._keys.push(k);
                this._vals.push(v);
            }
            this._map[k] = v;
        };
        /** 替换 */
        IndexedMap.prototype.replace = function (k, v) {
            if (k in this._map) {
                var idx = this._keys.indexOf(k);
                this._vals[idx] = v;
            }
            else {
                this._keys.push(k);
                this._vals.push(v);
            }
            this._map[k] = v;
        };
        /** 删除 */
        IndexedMap.prototype.remove = function (k) {
            if (!(k in this._map))
                return null;
            // k和v是1-1，所以indexOfKey和indexOfVal一致
            var idx = this._keys.indexOf(k);
            var val = this._vals[idx];
            ArrayT.RemoveObjectAtIndex(this._keys, idx);
            ArrayT.RemoveObjectAtIndex(this._vals, idx);
            delete this._map[k];
            return val;
        };
        Object.defineProperty(IndexedMap.prototype, "length", {
            /** 获得大小 */
            get: function () {
                return this._keys.length;
            },
            enumerable: true,
            configurable: true
        });
        /** 清空 */
        IndexedMap.prototype.clear = function () {
            this._keys.length = 0;
            this._vals.length = 0;
            this._map = {};
        };
        /** 遍历 */
        IndexedMap.prototype.forEach = function (cb, ctx) {
            var _this = this;
            this._keys.forEach(function (k, idx) {
                var v = _this._vals[idx];
                cb.call(ctx, k, v);
            }, this);
        };
        IndexedMap.prototype.iterateEach = function (cb, ctx) {
            for (var i = 0, len = this._keys.length; i < len; ++i) {
                var k = this._keys[i];
                var v = this._vals[i];
                if (!cb.call(ctx, k, v))
                    break;
            }
        };
        /** 是否存在k */
        IndexedMap.prototype.contains = function (k) {
            return k in this._map;
        };
        /** 取得k的下标 */
        IndexedMap.prototype.indexOfKey = function (k) {
            return this._keys.indexOf(k);
        };
        /** 使用下标取得数据 */
        IndexedMap.prototype.objectForKey = function (k) {
            return this._map[k];
        };
        IndexedMap.prototype.objectForIndex = function (idx) {
            var k = this._keys[idx];
            return this._map[k];
        };
        IndexedMap.prototype.keyForIndex = function (idx) {
            return this._keys[idx];
        };
        Object.defineProperty(IndexedMap.prototype, "keys", {
            get: function () {
                return this._keys.concat();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IndexedMap.prototype, "values", {
            get: function () {
                return this._vals;
            },
            enumerable: true,
            configurable: true
        });
        return IndexedMap;
    }());
    nn.IndexedMap = IndexedMap;
    var IndexedMapT = (function () {
        function IndexedMapT() {
        }
        IndexedMapT.RemoveObjectByFilter = function (map, filter, ctx) {
            var keys = map.keys;
            for (var i = 0, len = keys.length; i < len; ++i) {
                var k = keys[i];
                var v = map.objectForKey(k);
                if (filter.call(ctx, k, v)) {
                    map.remove(k);
                    return [k, v];
                }
            }
            return null;
        };
        IndexedMapT.RemoveObjectsByFilter = function (map, filter, ctx) {
            var r = new Array();
            var keys = map.keys;
            for (var i = 0, len = keys.length; i < len; ++i) {
                var k = keys[i];
                var v = map.objectForKey(k);
                if (filter.call(ctx, k, v)) {
                    map.remove(k);
                    r.push([k, v]);
                }
            }
            return r;
        };
        IndexedMapT.QueryObject = function (map, query, ctx) {
            var keys = map.keys;
            for (var i = 0, len = keys.length; i < len; ++i) {
                var k = keys[i];
                var v = map.objectForKey(k);
                if (query.call(ctx, k, v))
                    return v;
            }
            return null;
        };
        IndexedMapT.Convert = function (arr, convert, ctx) {
            var r = new IndexedMap();
            arr.forEach(function (e) {
                var o = convert.call(ctx, e);
                r.add(o[0], o[1]);
            });
            return r;
        };
        return IndexedMapT;
    }());
    nn.IndexedMapT = IndexedMapT;
    /** 多索引map */
    var MultiMap = (function () {
        function MultiMap() {
            this._map = new IndexedMap();
        }
        MultiMap.prototype.add = function (k, v) {
            var arr = this._map.objectForKey(k);
            if (arr == null) {
                arr = new Array();
                this._map.add(k, arr);
            }
            arr.push(v);
            return this;
        };
        MultiMap.prototype.replace = function (k, v) {
            this._map.replace(k, v);
        };
        MultiMap.prototype.objectForKey = function (k) {
            return this._map.objectForKey(k);
        };
        MultiMap.prototype.remove = function (k) {
            return this._map.remove(k);
        };
        MultiMap.prototype.forEach = function (proc, ctx) {
            this._map.forEach(proc, ctx);
        };
        MultiMap.prototype.iterateEach = function (proc, ctx) {
            this._map.iterateEach(proc, ctx);
        };
        Object.defineProperty(MultiMap.prototype, "keys", {
            get: function () {
                return this._map.keys;
            },
            enumerable: true,
            configurable: true
        });
        return MultiMap;
    }());
    nn.MultiMap = MultiMap;
    var Sort = (function () {
        function Sort() {
        }
        Sort.NumberAsc = function (l, r) {
            return l - r;
        };
        Sort.NumberDsc = function (l, r) {
            return r - l;
        };
        return Sort;
    }());
    nn.Sort = Sort;
    /** 链表 */
    var List = (function () {
        function List() {
            this.length = 0;
        }
        List.prototype.push = function (o) {
            this.length += 1;
            if (!this._top) {
                this._top = { value: o };
                return;
            }
            var cur = { value: o, previous: this._top };
            this._top.next = cur;
            this._top = cur;
        };
        return List;
    }());
    nn.List = List;
    /** 颜色类 */
    var Color = (function () {
        function Color(rgb, alpha) {
            if (alpha === void 0) { alpha = 0xff; }
            this.rgb = 0;
            this.alpha = 0xff;
            if (alpha > 0 && alpha < 1)
                alpha *= 0xff;
            this.rgb = rgb & 0xffffff;
            this.alpha = alpha & 0xff;
        }
        Color.prototype.clone = function () {
            return new Color(this.rgb, this.alpha);
        };
        Object.defineProperty(Color.prototype, "argb", {
            get: function () {
                return this.rgb | (this.alpha << 24);
            },
            set: function (v) {
                this.rgb = v & 0xffffff;
                this.alpha = (v >> 24) & 0xff;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "rgba", {
            get: function () {
                return (this.rgb << 8) | this.alpha;
            },
            set: function (v) {
                this.rgb = (v >> 8) & 0xffffff;
                this.alpha = v & 0xff;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "alphaf", {
            /** 位于 [0, 1] 的 alpha */
            get: function () {
                return this.alpha * Color._1_255;
            },
            set: function (val) {
                this.alpha = (val * 255) >> 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "red", {
            get: function () {
                return this.rgb >> 16;
            },
            /** 16进制的颜色 */
            set: function (val) {
                this.rgb &= 0x00ffff;
                this.rgb |= (val & 0xff) << 16;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "redf", {
            get: function () {
                return this.red * Color._1_255;
            },
            set: function (val) {
                this.red = val * 255;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "green", {
            get: function () {
                return (this.rgb >> 8) & 0xff;
            },
            /** 16进制的颜色 */
            set: function (val) {
                this.rgb &= 0xff00ff;
                this.rgb |= (val & 0xff) << 8;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "greenf", {
            get: function () {
                return this.green * Color._1_255;
            },
            set: function (val) {
                this.green = val * 255;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "blue", {
            get: function () {
                return this.rgb & 0xff;
            },
            /** 16进制的颜色 */
            set: function (val) {
                this.rgb &= 0xffff00;
                this.rgb |= val & 0xff;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "bluef", {
            get: function () {
                return this.blue * Color._1_255;
            },
            set: function (val) {
                this.blue = val * 255;
            },
            enumerable: true,
            configurable: true
        });
        Color.prototype.setAlpha = function (v) {
            this.alpha = v;
            return this;
        };
        Color.prototype.setAlphaf = function (v) {
            this.alphaf = v;
            return this;
        };
        Color.prototype.setRed = function (v) {
            this.red = v;
            return this;
        };
        Color.prototype.setRedf = function (v) {
            this.redf = v;
            return this;
        };
        Color.prototype.setGreen = function (v) {
            this.green = v;
            return this;
        };
        Color.prototype.setGreenf = function (v) {
            this.greenf = v;
            return this;
        };
        Color.prototype.setBlue = function (v) {
            this.blue = v;
            return this;
        };
        Color.prototype.setBluef = function (v) {
            this.bluef = v;
            return this;
        };
        Color.prototype.scale = function (s, alpha) {
            if (alpha === void 0) { alpha = false; }
            this.red *= s;
            this.green *= s;
            this.blue *= s;
            if (alpha)
                this.alpha *= s;
            return this;
        };
        /** 反色 */
        Color.prototype.invert = function () {
            this.rgb = 0xffffff - this.rgb;
            return this;
        };
        Color.RGBf = function (r, g, b, a) {
            if (a === void 0) { a = 1; }
            return new Color((r * 255) << 16 |
                (g * 255) << 8 |
                (b * 255) << 0, (a * 255) << 0);
        };
        Color.RGB = function (r, g, b, a) {
            if (a === void 0) { a = 1; }
            return new Color((r & 255) << 16 |
                (g & 255) << 8 |
                (b & 255) << 0, (a * 255) << 0);
        };
        Color.ARGB = function (v) {
            return new Color(v, v >> 24);
        };
        Color.RGBA = function (v) {
            return new Color(v >> 8, v);
        };
        /** 随机一个颜色 */
        Color.Random = function (a) {
            if (a === void 0) { a = 0xff; }
            return new Color(Random.Rangei(0, 0xffffff), a);
        };
        Color.prototype.isEqual = function (r) {
            return this.rgb == r.rgb &&
                this.alpha == r.alpha;
        };
        return Color;
    }());
    Color._1_255 = 0.00392156862745098;
    // 与定义的颜色，注意不要在业务中修改数值，如果要修改请使用clone先复制一份
    Color.White = new Color(0xffffff);
    Color.Black = new Color(0);
    Color.Gray = new Color(0x3f3f3f);
    Color.Red = new Color(0xff0000);
    Color.Green = new Color(0x00ff00);
    Color.Blue = new Color(0x0000ff);
    Color.Yellow = new Color(0xffff00);
    Color.Transparent = new Color(0, 0);
    nn.Color = Color;
    /** 颜色数值，rgb为24位，alpha规约到0-1的float */
    function GetColorComponent(c) {
        switch (typeof (c)) {
            case 'number': {
                var rgb = c & 0xffffff;
                var a = ((c >> 24) & 0xff) * Color._1_255;
                return [rgb, a > 0 ? a : 1];
            }
            case 'string': {
                var s = c.toLowerCase();
                switch (s) {
                    case 'red': return [0xff0000, 1];
                    case 'green': return [0x00ff00, 1];
                    case 'blue': return [0x0000ff, 1];
                    case 'white': return [0xffffff, 1];
                    case 'black': return [0, 1];
                    default: {
                        s = s.replace('#', '0x');
                        var v = toInt(s);
                        var rgb = v & 0xffffff;
                        var a = ((v >> 24) & 0xff) * Color._1_255;
                        return [rgb, a > 0 ? a : 1];
                    }
                }
            }
            default: {
                return [c.rgb, c.alphaf];
            }
        }
    }
    nn.GetColorComponent = GetColorComponent;
    /** 线段 */
    var Line = (function () {
        function Line(color, width) {
            if (color === void 0) { color = 0; }
            if (width === void 0) { width = 1; }
            /** 平滑 */
            this.smooth = true;
            this.color = color;
            this.width = width;
        }
        Object.defineProperty(Line.prototype, "length", {
            get: function () {
                return Math.sqrt(this.lengthSq);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "lengthSq", {
            get: function () {
                var self = this;
                var xsq = self.endPoint.x - self.startPoint.x;
                xsq *= xsq;
                var ysq = self.endPoint.y - self.startPoint.y;
                ysq *= ysq;
                return xsq + ysq;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "deltaX", {
            get: function () {
                return this.endPoint.x - this.startPoint.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "deltaY", {
            get: function () {
                return this.endPoint.y - this.startPoint.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "deltaPoint", {
            get: function () {
                return new Point(this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y);
            },
            enumerable: true,
            configurable: true
        });
        // 实例化线段
        Line.Segment = function (spt, ept) {
            var r = new Line();
            r.startPoint = spt;
            r.endPoint = ept;
            return r;
        };
        return Line;
    }());
    nn.Line = Line;
    /** 百分比对象 */
    var Percentage = (function () {
        function Percentage(max, val) {
            if (max === void 0) { max = 1; }
            if (val === void 0) { val = 0; }
            this.max = max;
            this.value = val;
        }
        Percentage.prototype.reset = function (max, val) {
            if (max === void 0) { max = 1; }
            if (val === void 0) { val = 0; }
            this.max = max;
            this.value = val;
            return this;
        };
        Percentage.prototype.copy = function (r) {
            this.max = r.max;
            this.value = r.value;
            return this;
        };
        Object.defineProperty(Percentage.prototype, "percent", {
            get: function () {
                if (this.max == 0)
                    return 1;
                var r = this.value / this.max;
                if (isNaN(r))
                    return 0;
                return r;
            },
            set: function (v) {
                this.value = this.max * v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Percentage.prototype, "safepercent", {
            get: function () {
                var p = this.percent;
                if (p < 0)
                    return 0;
                if (p > 1)
                    return 1;
                return p;
            },
            set: function (v) {
                if (v < 0)
                    v = 0;
                if (v > 1)
                    v = 1;
                this.percent = this.max * v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Percentage.prototype, "left", {
            /** 剩余的比率 */
            get: function () {
                return 1 - this.safepercent;
            },
            enumerable: true,
            configurable: true
        });
        Percentage.prototype.toString = function () {
            return formatString('%f/%f = %f%%', this.value, this.max, this.percent * 100);
        };
        Percentage.prototype.valueOf = function () {
            return this.percent;
        };
        return Percentage;
    }());
    nn.Percentage = Percentage;
    var Mask = (function () {
        function Mask() {
        }
        Mask.isset = function (mask, value) {
            return (value & mask) == mask;
        };
        Mask.unset = function (mask, value) {
            if (this.isset(mask, value))
                return (value & (~mask));
            return value;
        };
        Mask.set = function (mask, value) {
            if (this.isset(mask, value))
                return value;
            return (value | mask);
        };
        return Mask;
    }());
    nn.Mask = Mask;
    var Direction;
    (function (Direction) {
        Direction[Direction["UNKNOWN"] = 0] = "UNKNOWN";
        Direction[Direction["CENTER"] = 1] = "CENTER";
        Direction[Direction["UP"] = 16] = "UP";
        Direction[Direction["DOWN"] = 256] = "DOWN";
        Direction[Direction["LEFT"] = 32] = "LEFT";
        Direction[Direction["RIGHT"] = 512] = "RIGHT";
        Direction[Direction["HOV"] = 544] = "HOV";
        Direction[Direction["VEC"] = 272] = "VEC";
    })(Direction = nn.Direction || (nn.Direction = {}));
    ;
    function DirectionIsPortrait(d) {
        return d == Direction.UP || d == Direction.DOWN;
    }
    nn.DirectionIsPortrait = DirectionIsPortrait;
    function DirectionIsLandscape(d) {
        return d == Direction.LEFT || d == Direction.RIGHT;
    }
    nn.DirectionIsLandscape = DirectionIsLandscape;
    function DirectionAngle(l, r) {
        return Angle.DIRECTION(r).sub(Angle.DIRECTION(l));
    }
    nn.DirectionAngle = DirectionAngle;
    function DirectionFromSize(w, h) {
        return w > h ? Direction.LEFT : Direction.UP;
    }
    nn.DirectionFromSize = DirectionFromSize;
    function DirectionToString(d) {
        var c = [];
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
    nn.DirectionToString = DirectionToString;
    function DirectionFromString(s) {
        if (!s)
            return 0;
        var c = s.toLowerCase().split(',');
        var r = 0;
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
    nn.DirectionFromString = DirectionFromString;
    var Range = (function () {
        function Range(location, length) {
            this.location = location;
            this.length = length;
        }
        Range.prototype.contains = function (val) {
            return val >= this.location && val <= this.max();
        };
        /** 交叉判定 */
        Range.prototype.intersects = function (r) {
            return (Math.max(this.max(), r.max()) - Math.min(this.location, r.location))
                < (this.length + r.length);
        };
        Range.prototype.max = function () {
            return this.location + this.length;
        };
        Range.Intersects = function (loc0, len0, loc1, len1) {
            return (Math.max(loc0 + len0, loc1 + len1) - Math.min(loc0, loc1))
                < (len0 + len1);
        };
        return Range;
    }());
    nn.Range = Range;
    /** 边距 */
    var EdgeInsets = (function () {
        function EdgeInsets(t, b, l, r) {
            if (t === void 0) { t = 0; }
            if (b === void 0) { b = 0; }
            if (l === void 0) { l = 0; }
            if (r === void 0) { r = 0; }
            this.top = t;
            this.bottom = b;
            this.left = l;
            this.right = r;
        }
        EdgeInsets.All = function (v) {
            return new EdgeInsets(v, v, v, v);
        };
        EdgeInsets.prototype.add = function (t, b, l, r) {
            this.top += t;
            this.bottom += b;
            this.left += l;
            this.right += r;
            return this;
        };
        EdgeInsets.prototype.scale = function (v) {
            this.top *= v;
            this.bottom *= v;
            this.left *= v;
            this.right *= v;
            return this;
        };
        EdgeInsets.prototype.addEdgeInsets = function (r) {
            if (r == null)
                return this;
            this.top += r.top;
            this.bottom += r.bottom;
            this.left += r.left;
            this.right += r.right;
            return this;
        };
        Object.defineProperty(EdgeInsets.prototype, "width", {
            get: function () {
                return this.left + this.right;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EdgeInsets.prototype, "height", {
            get: function () {
                return this.top + this.bottom;
            },
            enumerable: true,
            configurable: true
        });
        EdgeInsets.Width = function (o) {
            if (o == null)
                return 0;
            return o.width;
        };
        EdgeInsets.Height = function (o) {
            if (o == null)
                return 0;
            return o.height;
        };
        EdgeInsets.Top = function (o) {
            return o ? o.top : 0;
        };
        EdgeInsets.Left = function (o) {
            return o ? o.left : 0;
        };
        return EdgeInsets;
    }());
    nn.EdgeInsets = EdgeInsets;
    /** 点 */
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.prototype.reset = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
            return this;
        };
        Point.prototype.clone = function () {
            var r = nn.InstanceNewObject(this);
            r.x = this.x;
            r.y = this.y;
            return r;
        };
        Point.prototype.copy = function (r) {
            this.x = r.x;
            this.y = r.y;
            return this;
        };
        Point.prototype.addPoint = function (r) {
            this.x += r.x;
            this.y += r.y;
            return this;
        };
        Point.prototype.subPoint = function (r) {
            this.x -= r.x;
            this.y -= r.y;
            return this;
        };
        Point.prototype.add = function (x, y) {
            if (x)
                this.x += x;
            if (y)
                this.y += y;
            return this;
        };
        Point.prototype.multiPoint = function (r) {
            this.x *= r.x;
            this.y *= r.y;
            return this;
        };
        Point.prototype.scale = function (v, vy) {
            if (vy == null)
                vy = v;
            this.x *= v;
            this.y *= vy;
            return this;
        };
        Point.prototype.isEqual = function (r) {
            return this.x == r.x &&
                this.y == r.y;
        };
        Point.prototype.invert = function () {
            var t = this.x;
            this.x = this.y;
            this.y = t;
            return this;
        };
        Point.prototype.toString = function () {
            return this.x + ',' + this.y;
        };
        Point.prototype.fromString = function (s) {
            if (s == null) {
                this.x = this.y = 0;
                return;
            }
            var c = s.split(',');
            this.x = toNumber(c[0]);
            this.y = toNumber(c[1]);
        };
        Point.prototype.applyScaleFactor = function () {
            this.x *= nn.ScaleFactorX;
            this.y *= nn.ScaleFactorY;
            return this;
        };
        Point.prototype.unapplyScaleFactor = function () {
            this.x *= nn.ScaleFactorDeX;
            this.y *= nn.ScaleFactorDeY;
            return this;
        };
        return Point;
    }());
    Point.AnchorCC = new Point(0.5, 0.5);
    Point.AnchorLT = new Point(0, 0);
    Point.AnchorLC = new Point(0, 0.5);
    Point.AnchorLB = new Point(0, 1);
    Point.AnchorTC = new Point(0.5, 0);
    Point.AnchorBC = new Point(0.5, 1);
    Point.AnchorRT = new Point(1, 0);
    Point.AnchorRC = new Point(1, 0.5);
    Point.AnchorRB = new Point(1, 1);
    Point.Zero = new Point();
    nn.Point = Point;
    /** 点云 */
    var PointCloud = (function () {
        function PointCloud() {
            this._points = new Array();
            this._minpt = new Point();
            this._maxpt = new Point();
        }
        PointCloud.prototype.add = function (pt) {
            if (this._points.length == 0) {
                this._minpt.reset(nn.MAX_INT, nn.MAX_INT);
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
        };
        Object.defineProperty(PointCloud.prototype, "boundingBox", {
            get: function () {
                return new Rect(this._minpt.x, this._minpt.y, this._maxpt.x - this._minpt.x, this._maxpt.y - this._minpt.y);
            },
            enumerable: true,
            configurable: true
        });
        return PointCloud;
    }());
    nn.PointCloud = PointCloud;
    /** 大小 */
    var Size = (function (_super) {
        __extends(Size, _super);
        function Size(w, h) {
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            return _super.call(this, w, h) || this;
        }
        Object.defineProperty(Size.prototype, "width", {
            get: function () {
                return this.x;
            },
            set: function (w) {
                this.x = w;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Size.prototype, "height", {
            get: function () {
                return this.y;
            },
            set: function (h) {
                this.y = h;
            },
            enumerable: true,
            configurable: true
        });
        Size.prototype.toRect = function () {
            return new Rect(0, 0, this.width, this.height);
        };
        Size.prototype.addSize = function (r) {
            this.x += r.x;
            this.y += r.y;
            return this;
        };
        return Size;
    }(Point));
    Size.Zero = new Size();
    nn.Size = Size;
    /** 多边形 */
    var Polygon = (function () {
        function Polygon() {
            this._pts = new Array();
        }
        Polygon.prototype.add = function (pt) {
            this._pts.push(pt);
            return this;
        };
        Polygon.prototype.clear = function () {
            this._pts.length = 0;
            return this;
        };
        Object.defineProperty(Polygon.prototype, "length", {
            get: function () {
                return this._pts.length;
            },
            enumerable: true,
            configurable: true
        });
        return Polygon;
    }());
    nn.Polygon = Polygon;
    var FillMode;
    (function (FillMode) {
        // 几何拉伸
        FillMode[FillMode["STRETCH"] = 4096] = "STRETCH";
        // 居中
        FillMode[FillMode["CENTER"] = 8192] = "CENTER";
        // 不变形拉伸(留黑边)
        FillMode[FillMode["ASPECTSTRETCH"] = 12288] = "ASPECTSTRETCH";
        // 不变形填充(无黑边，有裁剪)
        FillMode[FillMode["ASPECTFILL"] = 16384] = "ASPECTFILL";
        // 不变形近似拉伸(无黑边使用阈值拉伸)
        FillMode[FillMode["NEARESTSTRETCH"] = 20480] = "NEARESTSTRETCH";
        // 置于区域中
        FillMode[FillMode["MAPIN"] = 24576] = "MAPIN";
        // 附加参数
        FillMode[FillMode["NOBORDER"] = 1] = "NOBORDER";
        FillMode[FillMode["MAXIMUM"] = 2] = "MAXIMUM";
        FillMode[FillMode["NEAREST"] = 4] = "NEAREST";
        FillMode[FillMode["MASK_MAJOR"] = 61440] = "MASK_MAJOR";
    })(FillMode = nn.FillMode || (nn.FillMode = {}));
    ;
    function FillModeString(fm) {
        var v = [];
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
    nn.FillModeString = FillModeString;
    /** 相对尺寸 */
    var RRect = (function () {
        function RRect(p, width, height) {
            this.left = p.left;
            this.right = p.right;
            this.top = p.top;
            this.bottom = p.bottom;
            this.width = width;
            this.height = height;
        }
        RRect.prototype.rvalue = function (v, p) {
            if (v == null)
                return null;
            return typeof v == 'number' ?
                v :
                v * p;
        };
        RRect.prototype.toRect = function (prc) {
            if (nn.ISDEBUG) {
                if ((this.top && this.bottom) ||
                    (this.left && this.right))
                    warn("不能同时设置同类属性");
            }
            var rc = new Rect(prc.x, prc.y, this.rvalue(this.width, prc.width), this.rvalue(this.height, prc.height));
            if (this.top != null)
                rc.y += this.rvalue(this.top, prc.height);
            else if (this.bottom != null)
                rc.y = prc.maxY - this.rvalue(this.bottom, prc.height);
            if (this.left != null)
                rc.x += this.rvalue(this.left, prc.width);
            else if (this.right != null)
                rc.x = prc.maxX - this.rvalue(this.right, prc.width);
            return rc;
        };
        return RRect;
    }());
    nn.RRect = RRect;
    var POSITION;
    (function (POSITION) {
        POSITION[POSITION["LEFT_TOP"] = 0] = "LEFT_TOP";
        POSITION[POSITION["LEFT_CENTER"] = 1] = "LEFT_CENTER";
        POSITION[POSITION["LEFT_BOTTOM"] = 2] = "LEFT_BOTTOM";
        POSITION[POSITION["TOP_CENTER"] = 3] = "TOP_CENTER";
        POSITION[POSITION["CENTER"] = 4] = "CENTER";
        POSITION[POSITION["BOTTOM_CENTER"] = 5] = "BOTTOM_CENTER";
        POSITION[POSITION["RIGHT_TOP"] = 6] = "RIGHT_TOP";
        POSITION[POSITION["RIGHT_CENTER"] = 7] = "RIGHT_CENTER";
        POSITION[POSITION["RIGHT_BOTTOM"] = 8] = "RIGHT_BOTTOM";
    })(POSITION = nn.POSITION || (nn.POSITION = {}));
    ;
    var EDGE;
    (function (EDGE) {
        EDGE[EDGE["START"] = 1] = "START";
        EDGE[EDGE["MIDDLE"] = 0] = "MIDDLE";
        EDGE[EDGE["END"] = 2] = "END";
    })(EDGE = nn.EDGE || (nn.EDGE = {}));
    ;
    /** 尺寸 */
    var Rect = (function () {
        function Rect(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        }
        Object.defineProperty(Rect.prototype, "isnan", {
            get: function () {
                return isNaN(this.x) || isNaN(this.y) || isNaN(this.width) || isNaN(this.height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "position", {
            get: function () {
                return new Point(this.x, this.y);
            },
            set: function (p) {
                this.x = p.x;
                this.y = p.y;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.origin = function (anchor) {
            if (anchor)
                return new Point(this.x + this.width * anchor.x, this.y + this.height * anchor.y);
            return new Point(this.x, this.y);
        };
        Rect.prototype.setOrigin = function (pt, anchor) {
            if (anchor) {
                this.x = pt.x - this.width * anchor.x;
                this.y = pt.y - this.height * anchor.y;
            }
            else {
                this.x = pt.x;
                this.y = pt.y;
            }
            return this;
        };
        Rect.prototype.alignTo = function (rc, posto, posmy) {
            if (posmy == null)
                posmy = posto;
            this.setPosition(rc.getPosition(posto), posmy);
            return this;
        };
        Rect.prototype.edgeTo = function (rc, edge) {
            switch (edge) {
                case EDGE.START:
                    {
                        this.setLeftTop(rc.leftTop);
                    }
                    break;
                case EDGE.MIDDLE:
                    {
                        this.setCenter(rc.center);
                    }
                    break;
                case EDGE.END:
                    {
                        this.setRightBottom(rc.rightBottom);
                    }
                    break;
            }
            return this;
        };
        Rect.prototype.getPosition = function (pos) {
            switch (pos) {
                case POSITION.LEFT_TOP: return this.leftTop;
                case POSITION.LEFT_CENTER: return this.leftCenter;
                case POSITION.LEFT_BOTTOM: return this.leftBottom;
                case POSITION.CENTER: return this.center;
                case POSITION.TOP_CENTER: return this.topCenter;
                case POSITION.BOTTOM_CENTER: return this.bottomCenter;
                case POSITION.RIGHT_TOP: return this.rightTop;
                case POSITION.RIGHT_CENTER: return this.rightCenter;
                case POSITION.RIGHT_BOTTOM: return this.rightBottom;
            }
        };
        Rect.prototype.setPosition = function (pt, pos) {
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
        };
        Object.defineProperty(Rect.prototype, "size", {
            get: function () {
                return new Size(this.width, this.height);
            },
            set: function (v) {
                this.width = v.width;
                this.height = v.height;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setSize = function (w, h) {
            this.width = w;
            this.height = h;
            return this;
        };
        Rect.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Rect.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        Rect.prototype.setWidth = function (w) {
            this.width = w;
            return this;
        };
        Rect.prototype.setHeight = function (h) {
            this.height = h;
            return this;
        };
        Rect.prototype.integral = function () {
            this.x = Integral(this.x);
            this.y = Integral(this.y);
            this.width = Integral(this.width);
            this.height = Integral(this.height);
            return this;
        };
        Rect.prototype.invert = function () {
            var self = this;
            var t = self.x;
            self.x = self.y;
            self.y = t;
            t = self.width;
            self.width = self.height;
            self.height = t;
            return self;
        };
        Rect.prototype.clone = function () {
            var self = this;
            var ret = nn.InstanceNewObject(self);
            ret.x = self.x;
            ret.y = self.y;
            ret.width = self.width;
            ret.height = self.height;
            return ret;
        };
        Rect.prototype.copy = function (r) {
            var self = this;
            self.x = r.x;
            self.y = r.y;
            self.width = r.width;
            self.height = r.height;
            return self;
        };
        Rect.prototype.applyEdgeInsets = function (ei) {
            if (ei == null)
                return this;
            this.x += ei.left;
            this.y += ei.top;
            this.width -= ei.left + ei.right;
            this.height -= ei.top + ei.bottom;
            return this;
        };
        Rect.prototype.unapplyEdgeInsets = function (ei) {
            if (ei == null)
                return this;
            this.x -= ei.left;
            this.y -= ei.top;
            this.width += ei.left + ei.right;
            this.height += ei.top + ei.bottom;
            return this;
        };
        Rect.prototype.applyAnchor = function (ax, ay) {
            this.x -= this.width * ax;
            this.y -= this.height * ay;
            return this;
        };
        Rect.prototype.unapplyAnchor = function (ax, ay) {
            this.x += this.width * ax;
            this.y += this.height * ay;
            return this;
        };
        Rect.prototype.containsPoint = function (pt) {
            return pt.x >= this.x && pt.x <= this.x + this.width &&
                pt.y >= this.y && pt.y <= this.y + this.height;
        };
        Rect.ContainsPoint = function (x, y, rx, ry, rw, rh) {
            return x >= rx && x <= rx + rw &&
                y >= ry && y <= ry + rh;
        };
        Rect.Area = function (o) {
            return o.width * o.height;
        };
        Rect.Swap = function (l, r) {
            var x = l.x, y = l.y, w = l.width, h = l.height;
            l.x = r.x;
            l.y = r.y;
            l.width = r.width;
            l.height = r.height;
            r.x = x;
            r.y = y;
            r.width = w;
            r.height = h;
        };
        Rect.prototype.maxSize = function (w, h) {
            if (w != undefined && this.width > w)
                this.width = w;
            if (h != undefined && this.height > h)
                this.height = h;
            return this;
        };
        Rect.prototype.minSize = function (w, h) {
            if (w != undefined && this.width < w)
                this.width = w;
            if (h != undefined && this.height < h)
                this.height = h;
            return this;
        };
        Rect.prototype.isEqual = function (r) {
            return this.x == r.x && this.y == r.y &&
                this.width == r.width && this.height == r.height;
        };
        Rect.prototype.add = function (x, y, w, h) {
            this.x += x;
            this.y += y;
            if (w)
                this.width += w;
            if (h)
                this.height += h;
            return this;
        };
        Rect.prototype.union = function (r) {
            var maxX = this.maxX;
            var maxY = this.maxY;
            if (this.x > r.x)
                this.x = r.x;
            if (this.y > r.y)
                this.y = r.y;
            if (maxX < r.maxX)
                this.width += r.maxX - maxX;
            if (maxY < r.maxY)
                this.height += r.maxY - maxY;
            return this;
        };
        Rect.prototype.deflate = function (w, h) {
            return this.add(w * 0.5, h * 0.5, -w, -h);
        };
        Rect.prototype.deflateR = function (rw, rh) {
            return this.deflate(this.width * rw, this.height * rh);
        };
        Rect.prototype.scale = function (s, anchor) {
            if (anchor == undefined) {
                this.x *= s;
                this.y *= s;
            }
            else {
                this.x -= (this.width * s - this.width) * anchor.x;
                this.y -= (this.height * s - this.height) * anchor.y;
            }
            this.width *= s;
            this.height *= s;
            return this;
        };
        Object.defineProperty(Rect.prototype, "outterRadius", {
            // 外接圆的半径
            get: function () {
                var len = Math.max(this.width, this.height);
                return Math.sqrt(len * len * 2) / 2;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.multiRect = function (x, y, w, h) {
            if (x != null)
                this.x *= x;
            if (y != null)
                this.y *= y;
            if (w != null)
                this.width *= w;
            if (h != null)
                this.height *= h;
            return this;
        };
        Rect.prototype.scaleWidth = function (w) {
            this.width *= w;
            return this;
        };
        Rect.prototype.scaleHeight = function (h) {
            this.height *= h;
            return this;
        };
        Rect.prototype.clipCenter = function (w, h) {
            if (w) {
                var d = this.width - w;
                this.x += d * 0.5;
                this.width -= d;
            }
            if (h) {
                var d = this.height - h;
                this.y += d * 0.5;
                this.height -= d;
            }
            return this;
        };
        Rect.prototype.reset = function (x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            return this;
        };
        Object.defineProperty(Rect.prototype, "minX", {
            get: function () {
                return this.x;
            },
            set: function (v) {
                this.x = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "maxX", {
            get: function () {
                return this.x + this.width;
            },
            set: function (v) {
                this.x = v - this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "minY", {
            get: function () {
                return this.y;
            },
            set: function (v) {
                this.y = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "maxY", {
            get: function () {
                return this.y + this.height;
            },
            set: function (v) {
                this.y = v - this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "minL", {
            get: function () {
                return Math.min(this.width, this.height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "maxL", {
            get: function () {
                return Math.max(this.width, this.height);
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.toPolygon = function () {
            return new Polygon()
                .add(new Point(this.x, this.y))
                .add(new Point(this.x, this.y + this.height))
                .add(new Point(this.x + this.width, this.y + this.height))
                .add(new Point(this.x + this.width, this.y));
        };
        Rect.prototype.offset = function (pt) {
            this.x += pt.x;
            this.y += pt.y;
            return this;
        };
        Object.defineProperty(Rect.prototype, "center", {
            get: function () {
                return new Point(this.x + this.width * 0.5, this.y + this.height * 0.5);
            },
            set: function (pt) {
                this.x = pt.x - this.width * 0.5;
                this.y = pt.y - this.height * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setCenter = function (pt) {
            this.center = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "leftTop", {
            get: function () {
                return new Point(this.x, this.y);
            },
            set: function (pt) {
                this.x = pt.x;
                this.y = pt.y;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setLeftTop = function (pt) {
            this.leftTop = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "leftBottom", {
            get: function () {
                return new Point(this.x, this.y + this.height);
            },
            set: function (pt) {
                this.x = pt.x;
                this.y = pt.y - this.height;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setLeftBottom = function (pt) {
            this.leftBottom = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "rightTop", {
            get: function () {
                return new Point(this.x + this.width, this.y);
            },
            set: function (pt) {
                this.x = pt.x - this.width;
                this.y = pt.y;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setRightTop = function (pt) {
            this.rightTop = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "rightBottom", {
            get: function () {
                return new Point(this.x + this.width, this.y + this.height);
            },
            set: function (pt) {
                this.x = pt.x - this.width;
                this.y = pt.y - this.height;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setRightBottom = function (pt) {
            this.rightBottom = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "topCenter", {
            get: function () {
                return new Point(this.x + this.width * 0.5, this.y);
            },
            set: function (pt) {
                this.x = pt.x - this.width * 0.5;
                this.y = pt.y;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setTopCenter = function (pt) {
            this.topCenter = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "bottomCenter", {
            get: function () {
                return new Point(this.x + this.width * 0.5, this.y + this.height);
            },
            set: function (pt) {
                this.x = pt.x - this.width * 0.5;
                this.y = pt.y - this.height;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setBottomCenter = function (pt) {
            this.bottomCenter = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "leftCenter", {
            get: function () {
                return new Point(this.x, this.y + this.height * 0.5);
            },
            set: function (pt) {
                this.x = pt.x;
                this.y = pt.y - this.height * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setLeftCenter = function (pt) {
            this.leftCenter = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "rightCenter", {
            get: function () {
                return new Point(this.x + this.width, this.y + this.height * 0.5);
            },
            set: function (pt) {
                this.x = pt.x - this.width;
                this.y = pt.y - this.height * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setRightCenter = function (pt) {
            this.rightCenter = pt;
            return this;
        };
        Rect.prototype.toString = function () {
            return this.x + "," + this.y + "," + this.width + "," + this.height;
        };
        Object.defineProperty(Rect.prototype, "nearest", {
            get: function () {
                return this._nearest == null ? 0.1 : this._nearest;
            },
            enumerable: true,
            configurable: true
        });
        /** 将当前的rc映射到目标rc中，默认会居中结果 */
        Rect.prototype.fill = function (to, mode) {
            var self = this;
            if (self.width == 0 || self.height == 0)
                return self;
            var needcenter = true;
            switch (mode & FillMode.MASK_MAJOR) {
                case FillMode.STRETCH:
                    {
                        self.copy(to);
                    }
                    break;
                case FillMode.MAPIN:
                    {
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
                case FillMode.NEARESTSTRETCH:
                    {
                        // 先做 as，如果接近，则拉伸
                        var rw = self.width / to.width;
                        var rh = self.height / to.height;
                        if (rw < rh) {
                            self.width /= rh;
                            self.height = to.height;
                        }
                        else {
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
                case FillMode.ASPECTSTRETCH:
                    {
                        var rw = self.width / to.width;
                        var rh = self.height / to.height;
                        if (rw < rh) {
                            self.width /= rh;
                            self.height = to.height;
                        }
                        else {
                            self.height /= rw;
                            self.width = to.width;
                        }
                    }
                    break;
                case FillMode.ASPECTFILL:
                    {
                        var rw = self.width / to.width;
                        var rh = self.height / to.height;
                        if (rw < rh) {
                            self.height /= rw;
                            self.width = to.width;
                        }
                        else {
                            self.width /= rh;
                            self.height = to.height;
                        }
                    }
                    break;
            }
            if (Mask.isset(FillMode.NOBORDER, mode)) {
                var r1 = to.width / to.height;
                if (self.width / to.width < self.height / to.height) {
                    self.width = self.height * r1;
                }
                else {
                    self.height = self.width / r1;
                }
            }
            if (Mask.isset(FillMode.NEAREST, mode)) {
                var rw = self.width / to.width;
                var rh = self.height / to.height;
                if (Math.abs(rw - rh) < self.nearest) {
                    if (rw < rh) {
                        self.width /= rw;
                    }
                    else {
                        self.height /= rh;
                    }
                }
            }
            if (needcenter)
                self.center = to.center;
            return self;
        };
        Rect.prototype.applyScaleFactor = function () {
            this.x *= nn.ScaleFactorX;
            this.y *= nn.ScaleFactorY;
            this.width *= nn.ScaleFactorW;
            this.height *= nn.ScaleFactorH;
            return this;
        };
        Rect.prototype.unapplyScaleFactor = function () {
            this.x *= nn.ScaleFactorDeX;
            this.y *= nn.ScaleFactorDeY;
            this.width *= nn.ScaleFactorDeW;
            this.height *= nn.ScaleFactorDeH;
            return this;
        };
        // 转换到笛卡尔坐标系
        Rect.prototype.applyCartesian = function (tfm) {
            var self = this;
            self.y = tfm.height - self.y - self.height - tfm.y;
            self.x += tfm.x;
            return self;
        };
        Rect.prototype.unapplyCartesian = function (tfm) {
            var self = this;
            self.y = tfm.height - self.y - tfm.y;
            self.x -= tfm.x;
            return self;
        };
        return Rect;
    }());
    Rect.Zero = new Rect();
    Rect.Max = new Rect(-999999, -999999, 999999, 999999);
    nn.Rect = Rect;
    var UnionRect = (function (_super) {
        __extends(UnionRect, _super);
        function UnionRect(x, y, w, h) {
            var _this = _super.call(this) || this;
            _this.x = x;
            _this.y = y;
            _this.width = w;
            _this.height = h;
            return _this;
        }
        UnionRect.prototype.union = function (r) {
            var self = this;
            if (self.x == null || self.y == null || self.width == null || self.height == null) {
                self.x = r.x;
                self.y = r.y;
                self.width = r.width;
                self.height = r.height;
                return self;
            }
            return _super.prototype.union.call(this, r);
        };
        return UnionRect;
    }(Rect));
    nn.UnionRect = UnionRect;
    var WorkState;
    (function (WorkState) {
        WorkState[WorkState["UNKNOWN"] = 0] = "UNKNOWN";
        WorkState[WorkState["WAITING"] = 1] = "WAITING";
        WorkState[WorkState["DOING"] = 2] = "DOING";
        WorkState[WorkState["PAUSED"] = 3] = "PAUSED";
        WorkState[WorkState["DONE"] = 4] = "DONE";
    })(WorkState = nn.WorkState || (nn.WorkState = {}));
    ;
    /** 角度 */
    var Angle = (function () {
        function Angle(rad) {
            if (rad === void 0) { rad = 0; }
            this._rad = rad;
        }
        Angle.ToRad = function (ang) {
            return ang * Angle._DEGREE;
        };
        Angle.ToAngle = function (rad) {
            return rad * Angle._RAD;
        };
        Angle.prototype.clone = function () {
            return new Angle(this._rad);
        };
        Angle.RAD = function (rad) {
            var r = new Angle(rad);
            return r;
        };
        Angle.ANGLE = function (ang) {
            var r = new Angle(Angle.ToRad(ang));
            return r;
        };
        Angle.DIRECTION = function (d) {
            var r = new Angle();
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
        };
        Object.defineProperty(Angle.prototype, "angle", {
            get: function () {
                return this._rad * Angle._RAD;
            },
            set: function (v) {
                this._rad = v * Angle._DEGREE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "rad", {
            get: function () {
                return this._rad;
            },
            set: function (v) {
                this._rad = v;
            },
            enumerable: true,
            configurable: true
        });
        Angle.prototype.add = function (r) {
            this._rad += r._rad;
            return this;
        };
        Angle.prototype.sub = function (r) {
            this._rad -= r._rad;
            return this;
        };
        Angle.prototype.multiScala = function (v) {
            this._rad *= v;
            return this;
        };
        Angle.prototype.normalize = function () {
            if (this._rad < 0)
                this._rad += Angle._2PI;
            this._rad %= Angle._2PI;
            return this;
        };
        Object.defineProperty(Angle.prototype, "direction", {
            get: function () {
                var ang = this.clone().normalize().angle;
                if (ang <= 45 || ang >= 315)
                    return Direction.UP;
                if (45 <= ang && ang <= 135)
                    return Direction.LEFT;
                if (135 <= ang && ang <= 225)
                    return Direction.DOWN;
                return Direction.RIGHT;
            },
            enumerable: true,
            configurable: true
        });
        Angle.prototype.toString = function () {
            return "角度:" + this.angle + ", 弧度:" + this.rad;
        };
        return Angle;
    }());
    Angle._PI = Math.PI;
    Angle._PI_2 = Math.PI / 2;
    Angle._2PI = Math.PI * 2;
    Angle._1_2PI = 1 / Math.PI / 2;
    Angle._DEGREE = Math.PI / 180;
    Angle._RAD = 180 / Math.PI;
    nn.Angle = Angle;
    /** 射线 */
    var Rayline = (function () {
        function Rayline(pt, angle) {
            this.pt = pt;
            this.angle = angle;
        }
        Rayline.prototype.atLength = function (len, angle) {
            if (angle == undefined)
                angle = this.angle;
            return new Point(len * Math.cos(angle), len * Math.sin(angle))
                .addPoint(this.pt);
        };
        return Rayline;
    }());
    nn.Rayline = Rayline;
    /** 路径
        @note 默认h5-tag-path来实现，所以也原生支持了svg^_^
    */
    var Path = (function () {
        function Path(svg) {
            this._ph = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            if (this._ph == null)
                fatal("当前环境不支持 H5-PATH-SVG");
            if (svg)
                this.unserialize(svg);
        }
        Path.prototype.serialize = function () {
            return this._ph.getAttribute("d");
        };
        Path.prototype.unserialize = function (stream) {
            var suc;
            try {
                this._ph.setAttribute("d", stream);
                this._changed = suc = true;
            }
            catch (err) {
                suc = false;
            }
            return suc;
        };
        Path.prototype.clear = function () {
            this._ph.setAttribute("d", "");
        };
        Object.defineProperty(Path.prototype, "length", {
            get: function () {
                if (this._changed) {
                    this._len = this._ph.getTotalLength();
                    this._changed = false;
                }
                return this._len;
            },
            enumerable: true,
            configurable: true
        });
        Path.prototype.pointAtPos = function (percent) {
            var len = this.length;
            return this._ph.getPointAtLength(len * percent);
        };
        return Path;
    }());
    nn.Path = Path;
    var URL = (function () {
        function URL(uri) {
            this.fields = new KvObject();
            this.domain = '';
            if (uri)
                this.parseString(uri);
        }
        URL.prototype.parseString = function (uri) {
            var _this = this;
            if (isZero(uri)) {
                warn("不能解析传入的 URI 信息");
                return;
            }
            var s = uri.split('?');
            if (s.length == 1)
                s = ['', s[0]];
            this.domain = s[0];
            var fs = s[1];
            if (length(fs)) {
                fs.split('&').forEach(function (s) {
                    if (length(s) == 0)
                        return;
                    var fs = s.split('=');
                    _this.fields[fs[0]] = fs[1] ? fs[1] : null;
                });
            }
        };
        URL.prototype.toString = function () {
            var r = '';
            if (this.domain.length) {
                if (/\:\/\//i.test(this.domain) == false)
                    r += 'http://';
                r += this.domain;
                if (this.domain.indexOf('?') == -1 &&
                    !MapT.IsEmpty(this.fields))
                    r += '?';
            }
            r += URL.MapToField(this.fields);
            return r;
        };
        URL.MapToField = function (m) {
            var _this = this;
            var arr = [];
            MapT.Foreach(m, function (k, v) {
                arr.push(k + "=" + _this.encode(v));
            }, this);
            return arr.join('&');
        };
        URL.encode = function (str) {
            return encodeURIComponent(str);
        };
        URL.decode = function (d) {
            return decodeURIComponent(d);
        };
        /** 字符串打包，encode测试发现在native状态下，如果使用urlloader发送，则放在参数中的例如http://之类的字符串会被恢复编码，导致500错误 */
        URL.pack = function (str, uri) {
            if (uri === void 0) { uri = true; }
            var r = btoa(str);
            if (uri)
                return encodeURIComponent(r);
            return r;
        };
        URL.unpack = function (str, uri) {
            if (uri === void 0) { uri = true; }
            var r = atob(str);
            if (uri)
                return decodeURIComponent(r);
            return r;
        };
        URL.htmlEncode = function (s) {
            if (s.length == 0)
                return "";
            s = s.replace(/&/g, "&amp;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            return s;
        };
        URL.htmlDecode = function (s) {
            if (s.length == 0)
                return "";
            s = s.replace(/&amp;/g, "&");
            s = s.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39;/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            return s;
        };
        return URL;
    }());
    nn.URL = URL;
    /** 时间日期 */
    var DateTime = (function () {
        function DateTime(ts) {
            this._changed = false;
            this._date = new Date();
            if (ts === undefined)
                ts = DateTime.Timestamp();
            this.timestamp = ts;
        }
        /** 当前的时间 */
        DateTime.Now = function () {
            return new Date().getTime() / 1000;
        };
        /** 当前的时间戳 */
        DateTime.Timestamp = function () {
            return (new Date().getTime() / 1000) >> 0;
        };
        /** 从开始运行时过去的时间 */
        DateTime.Pass = function () {
            return nn.IMP_TIMEPASS();
        };
        /** 一段时间 */
        DateTime.Interval = function (ts) {
            // 偏移GMT, -2880000是 GMT8 1970/1/1 0:0:0
            return new DateTime(ts - 2880000);
        };
        /** 从字符串转换 */
        DateTime.parse = function (s) {
            var v = Date.parse(s);
            // safari下日期必须用/分割，但是chrome支持-或者/的格式，所以如果是NaN，则把所有的-转换成/
            if (isNaN(v)) {
                if (s.indexOf('-') != -1) {
                    s = s.replace(/-/g, '/');
                    v = Date.parse(s);
                }
            }
            return new DateTime(v / 1000);
        };
        /** 未来 */
        DateTime.prototype.future = function (ts) {
            this.timestamp += ts;
            return this;
        };
        /** 过去 */
        DateTime.prototype.past = function (ts) {
            this.timestamp -= ts;
            return this;
        };
        /** 计算间隔 */
        DateTime.prototype.diff = function (r) {
            return new DateTime(r._timestamp - this._timestamp);
        };
        Object.defineProperty(DateTime.prototype, "timestamp", {
            get: function () {
                if (this._changed) {
                    this._timestamp = this._date.getTime() / 1000;
                    this._changed = false;
                }
                return this._timestamp;
            },
            set: function (val) {
                if (this._timestamp === val)
                    return;
                this._timestamp = val;
                this._date.setTime(this._timestamp * 1000);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "year", {
            get: function () {
                return this._date.getFullYear();
            },
            set: function (val) {
                this._changed = true;
                this._date.setFullYear(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "month", {
            get: function () {
                return this._date.getMonth();
            },
            set: function (val) {
                this._changed = true;
                this._date.setMonth(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "day", {
            get: function () {
                return this._date.getDate();
            },
            set: function (val) {
                this._changed = true;
                this._date.setDate(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "hyear", {
            get: function () {
                return this.year;
            },
            set: function (val) {
                this.year = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "hmonth", {
            get: function () {
                return this.month + 1;
            },
            set: function (val) {
                this.month = val - 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "hday", {
            get: function () {
                return this.day;
            },
            set: function (val) {
                this.day = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "hour", {
            get: function () {
                return this._date.getHours();
            },
            set: function (val) {
                this._changed = true;
                this._date.setHours(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "minute", {
            get: function () {
                return this._date.getMinutes();
            },
            set: function (val) {
                this._changed = true;
                this._date.setMinutes(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "second", {
            get: function () {
                return this._date.getSeconds();
            },
            set: function (val) {
                this._changed = true;
                this._date.setSeconds(val);
            },
            enumerable: true,
            configurable: true
        });
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
        DateTime.prototype.toString = function (fmt) {
            if (fmt)
                return this._date.pattern(fmt);
            return this._date.toString();
        };
        DateTime.Dyears = function (ts, up) {
            if (up === void 0) { up = true; }
            return Math.floor(ts / this.YEAR);
        };
        DateTime.Dmonths = function (ts, up) {
            if (up === void 0) { up = true; }
            var v;
            if (up) {
                v = ts % this.YEAR;
                v = Math.floor(v / this.MONTH);
            }
            else {
                v = Math.floor(ts / this.MONTH);
            }
            return v;
        };
        DateTime.Ddays = function (ts, up) {
            if (up === void 0) { up = true; }
            var v;
            if (up) {
                v = ts % this.MONTH;
                v = Math.floor(v / this.DAY);
            }
            else {
                v = Math.floor(ts / this.DAY);
            }
            return v;
        };
        DateTime.Dhours = function (ts, up) {
            if (up === void 0) { up = true; }
            var v;
            if (up) {
                v = ts % this.DAY;
                v = Math.floor(v / this.HOUR);
            }
            else {
                v = Math.floor(ts / this.HOUR);
            }
            return v;
        };
        DateTime.Dminutes = function (ts, up) {
            if (up === void 0) { up = true; }
            var v;
            if (up) {
                v = ts % this.HOUR;
                v = Math.floor(v / this.MINUTE);
            }
            else {
                v = Math.floor(ts / this.MINUTE);
            }
            return v;
        };
        DateTime.Dseconds = function (ts, up) {
            if (up === void 0) { up = true; }
            var v;
            if (up) {
                v = ts % this.MINUTE;
            }
            else {
                v = ts;
            }
            return v;
        };
        /** 计算diff-year，根绝suffix的类型返回对应的类型 */
        DateTime.prototype.dyears = function (up, suffix) {
            if (up === void 0) { up = true; }
            if (suffix === void 0) { suffix = 0; }
            var v = DateTime.Dyears(this._timestamp, up);
            if (typeof (suffix) == 'string')
                return v ? v + suffix : '';
            return v + suffix;
        };
        /** 计算diff-months */
        DateTime.prototype.dmonths = function (up, suffix) {
            if (up === void 0) { up = true; }
            if (suffix === void 0) { suffix = 0; }
            var v = DateTime.Dmonths(this._timestamp, up);
            if (typeof (suffix) == 'string')
                return v ? v + suffix : '';
            return v + suffix;
        };
        /** 计算diff-days */
        DateTime.prototype.ddays = function (up, suffix) {
            if (up === void 0) { up = true; }
            if (suffix === void 0) { suffix = 0; }
            var v = DateTime.Ddays(this._timestamp, up);
            if (typeof (suffix) == 'string')
                return v ? v + suffix : '';
            return v + suffix;
        };
        /** 计算diff-hours */
        DateTime.prototype.dhours = function (up, suffix) {
            if (up === void 0) { up = true; }
            if (suffix === void 0) { suffix = 0; }
            var v = DateTime.Dhours(this._timestamp, up);
            if (typeof (suffix) == 'string')
                return v ? v + suffix : '';
            return v + suffix;
        };
        /** 计算diff-mins */
        DateTime.prototype.dminutes = function (up, suffix) {
            if (up === void 0) { up = true; }
            if (suffix === void 0) { suffix = 0; }
            var v = DateTime.Dminutes(this._timestamp, up);
            if (typeof (suffix) == 'string')
                return v ? v + suffix : '';
            return v + suffix;
        };
        /** 计算diff-secs */
        DateTime.prototype.dseconds = function (up, suffix) {
            if (up === void 0) { up = true; }
            if (suffix === void 0) { suffix = 0; }
            var v = DateTime.Dseconds(this._timestamp, up);
            if (typeof (suffix) == 'string')
                return v ? v + suffix : '';
            return v + suffix;
        };
        DateTime.prototype.isSameDay = function (r) {
            return this.year == r.year &&
                this.month == r.month &&
                this.day == r.day;
        };
        return DateTime;
    }());
    DateTime.MINUTE = 60;
    DateTime.MINUTE_5 = 300;
    DateTime.MINUTE_15 = 900;
    DateTime.MINUTE_30 = 1800;
    DateTime.HOUR = 3600;
    DateTime.HOUR_2 = 7200;
    DateTime.HOUR_6 = 21600;
    DateTime.HOUR_12 = 43200;
    DateTime.DAY = 86400;
    DateTime.MONTH = 2592000;
    DateTime.YEAR = 31104000;
    nn.DateTime = DateTime;
    /** 定时器 */
    var CTimer = (function (_super) {
        __extends(CTimer, _super);
        function CTimer(interval, count) {
            var _this = _super.call(this) || this;
            /** tick 的次数 */
            _this.count = -1;
            /** 间隔 s */
            _this.interval = 1; // 间隔 s
            /** timer 的附加数据 */
            _this.xdata = {};
            /** 当前激发的次数 */
            _this._firedCount = 0;
            /** 每一次激发的增量 */
            _this._deltaFired = 1;
            _this.interval = interval;
            _this.count = count;
            return _this;
        }
        CTimer.prototype.dispose = function () {
            this.stop();
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(CTimer.prototype, "firedCount", {
            get: function () {
                return this._firedCount;
            },
            set: function (v) {
                fatal("不允许设置 firedCount");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CTimer.prototype, "deltaFired", {
            get: function () {
                return this._deltaFired;
            },
            set: function (v) {
                this._deltaFired = v;
            },
            enumerable: true,
            configurable: true
        });
        CTimer.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalAction);
            this._signals.register(nn.SignalDone);
        };
        Object.defineProperty(CTimer.prototype, "pastTime", {
            /** 已经过去了的时间 */
            get: function () {
                return this._firedCount / this.interval;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CTimer.prototype, "isRunning", {
            /** 是否正在运行 */
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        CTimer.prototype.oneTick = function (delta) {
            if (delta === void 0) { delta = 0; }
            this._deltaFired = 0;
            this.signals.emit(nn.SignalAction);
        };
        return CTimer;
    }(SObject));
    // 例如egret，timer不能通过全局静态变量启动，所以如过是被静态对象启动，则需要把timer延迟到application加载成功后启动
    CTimer.SAFE_TIMER_ENABLED = true;
    CTimer.SAFE_TIMERS = new nn.CSet();
    nn.CTimer = CTimer;
    /** 低精度的实际时间定时器
        @brief 使用实际时间来判定每一次的 tick
    */
    var RtTimer = (function (_super) {
        __extends(RtTimer, _super);
        function RtTimer(interval, count) {
            if (interval === void 0) { interval = 1; }
            if (count === void 0) { count = -1; }
            return _super.call(this, interval, count) || this;
        }
        RtTimer.prototype.start = function () {
            this.stop();
            this._firedCount = 0;
            this._tmr = nn.IMP_CREATE_TIMER(this.interval, 0);
            if (CTimer.SAFE_TIMER_ENABLED) {
                CTimer.SAFE_TIMERS.add(this);
            }
            else {
                nn.IMP_START_TIMER(this._tmr, this.__tmr_tick, this);
                // 记录一下启动的时间                
                this.currentTime = DateTime.Pass();
            }
        };
        RtTimer.prototype.stop = function () {
            if (this.isRunning == false)
                return;
            nn.IMP_STOP_TIMER(this._tmr, this.__tmr_tick, this);
            this._tmr = null;
        };
        Object.defineProperty(RtTimer.prototype, "isRunning", {
            get: function () {
                return this._tmr != null;
            },
            enumerable: true,
            configurable: true
        });
        RtTimer.prototype.__tmr_tick = function () {
            // 过去了的时间
            var nowed = DateTime.Pass();
            var elpased = nowed - this.currentTime;
            this.currentTime = nowed;
            // 已经超过了间隔时间，可以算作一次 tick
            if (elpased >= this.interval) {
                // 计算 tick 的次数
                this.deltaFired = Math.floor(elpased / this.interval);
                this._firedCount += this.deltaFired;
                // 额外计算一下多余跑的时间
                this.xdata.overflow = elpased - this.deltaFired * this.interval;
                // 判定
                if (this.count != -1) {
                    if (this._firedCount >= this.count) {
                        this._firedCount = this.count;
                        this.signals.emit(nn.SignalAction);
                        this.signals.emit(nn.SignalDone);
                        this.stop();
                    }
                    else {
                        this.signals.emit(nn.SignalAction);
                    }
                }
                else {
                    this.signals.emit(nn.SignalAction);
                }
                // 扣除已经用过的
                this.currentTime -= this.xdata.overflow;
                // 恢复增量
                this.deltaFired = 1;
            }
        };
        return RtTimer;
    }(CTimer));
    nn.RtTimer = RtTimer;
    /** 系统定时器 */
    var SysTimer = (function (_super) {
        __extends(SysTimer, _super);
        function SysTimer(interval, count) {
            if (interval === void 0) { interval = 1; }
            if (count === void 0) { count = -1; }
            return _super.call(this, interval, count) || this;
        }
        SysTimer.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._tmr = undefined;
        };
        SysTimer.prototype.start = function () {
            // 先暂停
            this.stop();
            this._firedCount = 0;
            this._tmr = nn.IMP_CREATE_TIMER(this.interval, this.count == -1 ? 0 : this.count);
            if (CTimer.SAFE_TIMER_ENABLED) {
                CTimer.SAFE_TIMERS.add(this);
            }
            else {
                nn.IMP_START_TIMER(this._tmr, this.__tmr_tick, this);
            }
        };
        SysTimer.prototype.stop = function () {
            if (this.isRunning == false)
                return;
            nn.IMP_STOP_TIMER(this._tmr, this.__tmr_tick, this);
            this._tmr = null;
        };
        Object.defineProperty(SysTimer.prototype, "isRunning", {
            get: function () {
                return this._tmr != null;
            },
            enumerable: true,
            configurable: true
        });
        SysTimer.prototype.__tmr_tick = function () {
            this.currentTime = DateTime.Pass();
            this._firedCount += this.deltaFired;
            if (this.count != -1) {
                if (this._firedCount >= this.count) {
                    this._firedCount = this.count;
                    this.signals.emit(nn.SignalAction);
                    this.signals.emit(nn.SignalDone);
                    this.stop();
                }
                else {
                    this.signals.emit(nn.SignalAction);
                }
            }
            else {
                this.signals.emit(nn.SignalAction);
            }
        };
        return SysTimer;
    }(CTimer));
    nn.SysTimer = SysTimer;
    /** 定时器
        @brief 可以选择支持不支持在后台运行 */
    var Timer = (function (_super) {
        __extends(Timer, _super);
        function Timer(interval, count) {
            if (interval === void 0) { interval = 1; }
            if (count === void 0) { count = -1; }
            return _super.call(this, interval, count) || this;
        }
        Timer.prototype.start = function () {
            this.stop();
            if (this.backgroundMode) {
                this._rtmr = new RtTimer(this.interval, this.count);
                this._rtmr.signals.connect(nn.SignalAction, this.__act_action, this);
                this._rtmr.signals.connect(nn.SignalDone, this.__act_done, this);
            }
            else {
                this._systmr = new SysTimer(this.interval, this.count);
                this._systmr.signals.connect(nn.SignalAction, this.__act_action, this);
                this._systmr.signals.connect(nn.SignalDone, this.__act_done, this);
            }
            if (this._rtmr)
                this._rtmr.start();
            else
                this._systmr.start();
        };
        Timer.prototype.__act_action = function (s) {
            this.xdata = s.sender.xdata;
            this.signals.emit(nn.SignalAction);
        };
        Timer.prototype.__act_done = function (s) {
            this.xdata = s.sender.xdata;
            this.signals.emit(nn.SignalDone);
        };
        Timer.prototype.stop = function () {
            if (this.isRunning == false)
                return;
            if (this._rtmr) {
                this._rtmr.drop();
                this._rtmr = undefined;
            }
            if (this._systmr) {
                this._systmr.drop();
                this._systmr = undefined;
            }
        };
        Timer.prototype.timer = function () {
            if (this._rtmr)
                return this._rtmr;
            if (this._systmr)
                return this._systmr;
            return null;
        };
        Object.defineProperty(Timer.prototype, "isRunning", {
            get: function () {
                var tmr = this.timer();
                return tmr && tmr.isRunning;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "firedCount", {
            get: function () {
                var tmr = this.timer();
                return tmr && tmr.firedCount;
            },
            set: function (v) {
                warn("不允许直接设置 firedCount");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "deltaFired", {
            get: function () {
                var tmr = this.timer();
                return tmr && tmr.deltaFired;
            },
            set: function (v) {
                warn("不允许直接设置 deltaFired");
            },
            enumerable: true,
            configurable: true
        });
        return Timer;
    }(CTimer));
    nn.Timer = Timer;
    /** 延迟运行 */
    function Delay(duration, cb, ctx) {
        var p = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            p[_i - 3] = arguments[_i];
        }
        if (duration <= 0) {
            cb.call(ctx, p);
            return null;
        }
        var tmr = new Timer(duration, 1);
        tmr.signals.connect(nn.SignalDone, function () {
            cb.call(ctx, p);
            tmr.stop(); // 不能dispse，一般业务层会做这个事情或者自动就gc掉了
        }, null);
        // 直接开始，不能用defer避免出现外部先stop然后才到start的问题
        tmr.start();
        return tmr;
    }
    nn.Delay = Delay;
    /** 时间片对象 */
    var CoTimerItem = (function (_super) {
        __extends(CoTimerItem, _super);
        function CoTimerItem() {
            var _this = _super.call(this, 1, -1) || this;
            /** tick时间数 */
            _this.times = 0;
            /** 当前的 tick */
            _this.now = 0;
            return _this;
        }
        CoTimerItem.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.delegate = this;
        };
        CoTimerItem.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._cotimer = null;
        };
        // 当连接新的信号时，自动激活一次信号以即时刷新数值
        CoTimerItem.prototype._signalConnected = function (sig) {
            if (this.radicalMode && this.isRunning && sig == nn.SignalAction)
                this._signals.emit(nn.SignalAction);
        };
        Object.defineProperty(CoTimerItem.prototype, "isRunning", {
            /** 正在运行 */
            get: function () {
                return this._cotimer && this._cotimer.isRunning;
            },
            set: function (v) {
                fatal('不允许设置运行状态');
            },
            enumerable: true,
            configurable: true
        });
        /** 重新设置并启动定时器 */
        CoTimerItem.prototype.reset = function (inv, count, of) {
            if (count === void 0) { count = -1; }
            this.interval = inv;
            this.times = inv / this._timeinterval;
            this.count = count;
            if (of == null) {
                this.now = 0;
                this._firedCount = 0;
            }
            else {
                if (of.overflow) {
                    var dt = of.overflow / this._timeinterval;
                    this.now = dt % this.times;
                    this._firedCount = Math.floor(dt / this.times);
                }
                else {
                    this.now = 0;
                    this._firedCount = 0;
                }
            }
            // 延迟启动，为了让业务层有机会设置相关参数
            nn.Defer(this.start, this);
            return this;
        };
        /** 修改一下计时参数, 和 reset 的区别是不影响当前状态 */
        CoTimerItem.prototype.set = function (inv, count) {
            if (count === void 0) { count = -1; }
            this.interval = inv;
            this.times = inv / this._timeinterval;
            this.count = count;
        };
        CoTimerItem.prototype.start = function () {
            if (this._cotimer == null) {
                warn("没有加入过 timer，不能启动");
                return;
            }
            this._cotimer._addTimer(this);
            if (this.radicalMode && this.isRunning)
                this.signals.emit(nn.SignalAction);
        };
        CoTimerItem.prototype.stop = function () {
            if (this._cotimer == null) {
                warn("CoTimerItem 已经停止");
                return;
            }
            this._cotimer._stopTimer(this);
        };
        return CoTimerItem;
    }(CTimer));
    nn.CoTimerItem = CoTimerItem;
    /** 统一调度的计时器
        @brief 由 CoTimer 派发出的 TimerItem 将具有统一的调度，默认精度为100ms，如果业务需要准确的计时器，最好传入业务实际的间隔
    */
    var CoTimer = (function (_super) {
        __extends(CoTimer, _super);
        function CoTimer(interval) {
            if (interval === void 0) { interval = 0.1; }
            var _this = _super.call(this) || this;
            /** 具体参见 CoTimerItem 里面的解释 */
            _this.radicalMode = false;
            _this._splices = new Array();
            _this._tmr = new Timer();
            _this._tmr.interval = interval;
            _this._tmr.signals.connect(nn.SignalAction, _this.__tmr_tick, _this);
            return _this;
        }
        CoTimer.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.stop();
            if (this._tmr) {
                this._tmr.drop();
                this._tmr = undefined;
            }
            this.clear();
        };
        Object.defineProperty(CoTimer.prototype, "interval", {
            get: function () {
                return this._tmr.interval;
            },
            set: function (val) {
                this._tmr.interval = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CoTimer.prototype, "backgroundMode", {
            get: function () {
                return this._tmr.backgroundMode;
            },
            set: function (v) {
                this._tmr.backgroundMode = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CoTimer.prototype, "isRunning", {
            get: function () {
                return this._tmr.isRunning;
            },
            set: function (v) {
                fatal("不能设置 timer 的状态");
            },
            enumerable: true,
            configurable: true
        });
        CoTimer.prototype.start = function () {
            if (this.isRunning) {
                warn("CoTimer 定时器已经在运行");
                return this;
            }
            this._tmr.start();
            return this;
        };
        CoTimer.prototype.stop = function () {
            if (!this.isRunning) {
                warn("CoTimer 定时器已经停止");
                return;
            }
            this._tmr.stop();
            return this;
        };
        /** 增加一个分片定时器，时间单位为 s
            @param idr, 重用定时器的标记，如果!=undefined，则尝试重用定时器并设置为新的定时值
            @note 增加会直接添加到时间片列表，由CoTimer的运行情况来决定此时间片是否运行
        */
        CoTimer.prototype.add = function (inv, count, idr) {
            if (count === void 0) { count = -1; }
            var r = this.acquire(idr);
            r.reset(inv, count);
            return r;
        };
        /** 申请一个定时器，和 add 的区别是不会重置参数 */
        CoTimer.prototype.acquire = function (idr) {
            var r = this.findItemByIdr(idr);
            if (r)
                return r;
            r = new CoTimerItem();
            r._cotimer = this;
            r._timeinterval = this._tmr.interval;
            r.radicalMode = this.radicalMode;
            r.tag = idr;
            return r;
        };
        // 添加一个分片计时器
        CoTimer.prototype._addTimer = function (tmr) {
            if (ArrayT.Contains(this._splices, tmr))
                return;
            this._splices.push(tmr);
        };
        // 停止一个分片计时器
        CoTimer.prototype._stopTimer = function (tmr) {
            ArrayT.RemoveObject(this._splices, tmr);
        };
        /** 根据idr查找分片计时器 */
        CoTimer.prototype.findItemByIdr = function (idr) {
            if (idr == null)
                return null;
            return ArrayT.QueryObject(this._splices, function (o) {
                return o.tag && o.tag == idr;
            }, this);
        };
        /** 清空所有的分片 */
        CoTimer.prototype.clear = function () {
            ArrayT.Clear(this._splices, function (o) {
                dispose(o);
            }, this);
        };
        CoTimer.prototype.__tmr_tick = function (s) {
            var _this = this;
            this._splices.forEach(function (item) {
                var dfired = _this._tmr.deltaFired;
                // 判断是否一次完整的激发
                item.now += dfired;
                if (item.now < item.times)
                    return;
                // 如果中间间隔了很久，则需要保存余数为下一次的激发判断
                item.now = item.now % item.times;
                // 遇到一次激发
                item.deltaFired = dfired > item.times ?
                    Math.floor(dfired / item.times) : 1;
                item._firedCount += item.deltaFired;
                // 遇到激发的最大数目
                if (item.count != -1) {
                    if (item._firedCount >= item.count) {
                        item._firedCount = item.count;
                        // 移除
                        _this._stopTimer(item);
                        // 抛出事件
                        item.signals.emit(nn.SignalAction, s.sender.xdata);
                        item.signals.emit(nn.SignalDone, s.sender.xdata);
                        // 恢复激发计数
                        item._firedCount = 0;
                    }
                    else {
                        item.signals.emit(nn.SignalAction, s.sender.xdata);
                    }
                }
                else {
                    item.signals.emit(nn.SignalAction, s.sender.xdata);
                }
            }, this);
        };
        return CoTimer;
    }(SObject));
    nn.CoTimer = CoTimer;
    /** 延迟器 */
    var Delayer = (function () {
        function Delayer(tm, cb, ctx) {
            this._tm = tm;
            this._cb = cb;
            this._ctx = ctx;
        }
        Delayer.prototype.start = function () {
            if (this._tmr) {
                warn("Delayer已经开始");
                return;
            }
            this._tmr = new SysTimer(this._tm, 1);
            this._tmr.signals.connect(nn.SignalDone, this._cb, this._ctx);
            this._tmr.start();
        };
        Delayer.prototype.stop = function () {
            if (this._tmr == null)
                return;
            this._tmr.drop();
            this._tmr = null;
        };
        Delayer.prototype.restart = function () {
            this.stop();
            this.start();
        };
        return Delayer;
    }());
    nn.Delayer = Delayer;
    /** 重复调用 */
    function Repeat(s, cb, ctx) {
        var tmr = new RtTimer(s);
        tmr.signals.connect(nn.SignalAction, cb, ctx);
        tmr.start();
        return tmr;
    }
    nn.Repeat = Repeat;
    /** 随机数 */
    var Random = (function () {
        function Random() {
        }
        // 半开区间 [from, to)
        Random.Rangei = function (from, to, close) {
            if (close === void 0) { close = false; }
            if (close)
                return Math.round(Random.Rangef(from, to));
            return Math.floor(Random.Rangef(from, to));
        };
        Random.Rangef = function (from, to) {
            return Math.random() * (to - from) + from;
        };
        return Random;
    }());
    nn.Random = Random;
    /** 设备屏幕信息的评级
        @note 根据评级和设置的开关决定使用哪套资源 */
    var ScreenType;
    (function (ScreenType) {
        ScreenType[ScreenType["NORMAL"] = 0] = "NORMAL";
        ScreenType[ScreenType["HIGH"] = 1] = "HIGH";
        ScreenType[ScreenType["EXTRAHIGH"] = 2] = "EXTRAHIGH";
        ScreenType[ScreenType["LOW"] = -1] = "LOW";
        ScreenType[ScreenType["EXTRALOW"] = -2] = "EXTRALOW";
    })(ScreenType = nn.ScreenType || (nn.ScreenType = {}));
    ;
    function ScreenTypeIsLow(t) {
        return t < 0;
    }
    nn.ScreenTypeIsLow = ScreenTypeIsLow;
    function ScreenTypeIsHigh(t) {
        return t > 0;
    }
    nn.ScreenTypeIsHigh = ScreenTypeIsHigh;
    /** 设备信息 */
    var Device = (function (_super) {
        __extends(Device, _super);
        function Device() {
            var _this = _super.call(this) || this;
            /** canvas模式 */
            _this.isCanvas = true;
            /** 支持自动播放音效 */
            _this.supportAutoSound = true;
            /** 屏幕的尺寸 */
            _this.screenFrame = new Rect();
            /** 页面的尺寸 */
            _this.screenBounds = new Rect();
            /** 屏幕的方向 */
            _this.screenOrientation = new Angle();
            /** 屏幕尺寸的类型，对应于 android 的归类 */
            _this.screenType = ScreenType.NORMAL;
            _this.detectEnv();
            return _this;
        }
        Device.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalOrientationChanged);
        };
        Device.prototype.detectEnv = function () {
            var self = this;
            self.platform = navigator.platform;
            self.agent = navigator.userAgent;
            self.isMac = (self.platform == "Mac68K") ||
                (self.platform == "MacPPC") ||
                (self.platform == "Macintosh") ||
                (self.platform == "MacIntel");
            self.isWin = (self.platform == "Win32") ||
                (self.platform == "Windows");
            self.isUnix = (self.platform == "X11") &&
                !self.isMac && !self.isWin;
            self.isLinux = self.platform.indexOf("Linux") != -1;
            self.isIOS = /(iPhone|iPad|iPod|iOS)/i.test(self.agent);
            self.isAndroid = /android/i.test(self.agent);
            self.isMobile = self.isIOS || self.isAndroid;
            self.isPC = !self.isMobile || self.isMac || self.isWin || self.isUnix || self.isLinux;
            self.isPurePC = !self.isMobile && (self.isMac || self.isWin || self.isUnix || self.isLinux);
            self.isHighPerfomance = !self.isAndroid;
        };
        Device.prototype._updateScreen = function () {
            var browserSize = Js.getBrowserSize();
            var screenSize = Js.getScreenSize();
            // 需要保护一下browser定义必须小于screen，但是有些渠道发现刚好相反
            /*
            if (Rect.Area(browserSize) > Rect.Area(screenSize))
                Rect.Swap(browserSize, screenSize);
            */
            this.screenBounds.reset(0, 0, browserSize.width, browserSize.height);
            this.screenFrame.reset(0, 0, screenSize.width, screenSize.height);
            var browserOri = Js.getBrowserOrientation();
            if (this.screenOrientation.angle != browserOri) {
                this.screenOrientation.angle = browserOri;
                this.signals.emit(nn.SignalOrientationChanged, this.screenOrientation);
            }
        };
        return Device;
    }(SObject));
    Device.shared = new Device();
    nn.Device = Device;
    var HttpMethod;
    (function (HttpMethod) {
        HttpMethod[HttpMethod["GET"] = 0] = "GET";
        HttpMethod[HttpMethod["POST"] = 1] = "POST";
    })(HttpMethod = nn.HttpMethod || (nn.HttpMethod = {}));
    ;
    /** http连接器 */
    var CHttpConnector = (function (_super) {
        __extends(CHttpConnector, _super);
        function CHttpConnector() {
            var _this = _super.apply(this, arguments) || this;
            /** 请求方式 */
            _this.method = HttpMethod.GET;
            return _this;
        }
        CHttpConnector.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.data = undefined;
            this.fields = undefined;
        };
        CHttpConnector.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalEnd);
            this._signals.register(nn.SignalDone);
            this._signals.register(nn.SignalFailed);
            this._signals.register(nn.SignalChanged);
        };
        /** override 发送请求 */
        CHttpConnector.prototype.start = function () {
        };
        /** override 使用自动授权 */
        CHttpConnector.prototype.useCredentials = function () {
        };
        CHttpConnector.prototype.fullUrl = function () {
            var r = this.url;
            if (this.fields) {
                if (r.indexOf('?') == -1)
                    r += '?';
                else
                    r += '&';
                r += URL.MapToField(this.fields);
            }
            return r;
        };
        return CHttpConnector;
    }(SObject));
    nn.CHttpConnector = CHttpConnector;
    /** socket连接器 */
    var CSocketConnector = (function (_super) {
        __extends(CSocketConnector, _super);
        function CSocketConnector() {
            return _super.apply(this, arguments) || this;
        }
        CSocketConnector.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalOpen);
            this._signals.register(nn.SignalClose);
            this._signals.register(nn.SignalDataChanged);
            this._signals.register(nn.SignalTimeout);
            this._signals.register(nn.SignalFailed);
        };
        return CSocketConnector;
    }(SObject));
    nn.CSocketConnector = CSocketConnector;
    /** 基本操作 */
    var Operation = (function () {
        function Operation(idr) {
            this.idr = idr;
        }
        /** 完成自己的处理 */
        Operation.prototype.done = function () {
            if (this._queue)
                this._queue.next();
        };
        return Operation;
    }());
    nn.Operation = Operation;
    /** 操作队列 */
    var OperationQueue = (function (_super) {
        __extends(OperationQueue, _super);
        function OperationQueue() {
            var _this = _super.call(this) || this;
            /** 自动开始队列 */
            _this.autoMode = true;
            _this._opers = new Array();
            return _this;
        }
        OperationQueue.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalDone);
        };
        /** 手动的队列 */
        OperationQueue.Manual = function () {
            var r = new OperationQueue();
            r.autoMode = false;
            return r;
        };
        Object.defineProperty(OperationQueue.prototype, "count", {
            /** 队列中操作的数量 */
            get: function () {
                return this._opers.length;
            },
            enumerable: true,
            configurable: true
        });
        /** 队列中添加一个操作 */
        OperationQueue.prototype.add = function (oper) {
            if (oper._queue != null) {
                warn("该操作已经位于队列中");
                return;
            }
            oper._queue = this;
            this._opers.push(oper);
            if (this.autoMode)
                this.tryrun();
        };
        /** 移除 */
        OperationQueue.prototype.remove = function (oper) {
            if (oper._queue != this) {
                warn("不能移除该操作");
                return;
            }
            if (oper == this._current)
                this._current = null;
            oper._queue = null;
            ArrayT.RemoveObject(this._opers, oper);
        };
        /** 接上，如果只传一个数据，则代表附加在当前之后
            @param l 目标的队列
            @param r 插入的队列
        */
        OperationQueue.prototype.follow = function (l, r) {
            if (l._queue != this) {
                fatal("期望接上一个错误的队列操作");
                return;
            }
            var idx = this._opers.indexOf(l);
            r._queue = this;
            ArrayT.InsertObjectAtIndex(this._opers, r, idx + 1);
        };
        /** 附加到当前 */
        OperationQueue.prototype.present = function (oper) {
            if (this._current) {
                this.follow(this._current, oper);
            }
            else {
                oper._queue = this;
                ArrayT.InsertObjectAtIndex(this._opers, oper, 1);
            }
        };
        /** 交换 */
        OperationQueue.prototype.swap = function (l, r) {
            var il = this._opers.indexOf(l);
            var ir = this._opers.indexOf(r);
            if (il == -1 || ir == -1) {
                fatal("尝试交换不属于该队列的操作");
                return;
            }
            this._opers[il] = r;
            this._opers[ir] = l;
            if (this._current == l) {
                this._current = r;
                r.start();
            }
            else if (this._current == r) {
                this._current = l;
                l.start();
            }
        };
        /** 使用 r 换掉 l */
        OperationQueue.prototype.replace = function (l, r) {
            if (l._queue != this) {
                fatal("期望替换一个错误的队列操作");
                return;
            }
            var idx = this._opers.indexOf(l);
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
        };
        /** 尝试运行一个工作 */
        OperationQueue.prototype.tryrun = function () {
            if (this._current || this._opers.length == 0)
                return;
            if (this._paused) {
                this._tryduringpaused = true;
                return;
            }
            this._current = this._opers[0];
            if (this._current)
                this._current.start();
        };
        /** 强制运行下一份工作 */
        OperationQueue.prototype.next = function () {
            if (this._current == null)
                return;
            this._current._queue = null;
            this._current = null;
            this._opers.shift();
            if (this._opers.length == 0) {
                if (this._signals)
                    this._signals.emit(nn.SignalDone);
            }
            else {
                this.tryrun();
            }
        };
        /** 查询一个被标记的工作 */
        OperationQueue.prototype.findOperation = function (idr) {
            return ArrayT.QueryObject(this._opers, function (o) {
                return o.idr == idr;
            }, this);
        };
        /** 暂停工作队列 */
        OperationQueue.prototype.pause = function () {
            // 暂停普通的
            if (this._paused)
                return;
            this._paused = true;
            this._tryduringpaused = false;
        };
        /** 恢复工作队列 */
        OperationQueue.prototype.resume = function () {
            if (!this._paused)
                return;
            this._paused = false;
            if (this._tryduringpaused) {
                this._tryduringpaused = false;
                this.tryrun();
            }
        };
        Object.defineProperty(OperationQueue.prototype, "operations", {
            get: function () {
                return this._opers;
            },
            enumerable: true,
            configurable: true
        });
        return OperationQueue;
    }(SObject));
    nn.OperationQueue = OperationQueue;
    /** 闭包操作，为了支持Async，所以需要注意当闭包完成时调用done */
    var OperationClosure = (function (_super) {
        __extends(OperationClosure, _super);
        function OperationClosure(cb, ctx, idr) {
            var _this = _super.call(this, idr) || this;
            _this.cb = cb;
            _this.ctx = ctx;
            return _this;
        }
        OperationClosure.prototype.start = function () {
            this.cb.call(this.ctx, this);
        };
        return OperationClosure;
    }(Operation));
    nn.OperationClosure = OperationClosure;
    /** 简单封装一个函数，不附带 Operation，使用时需要手动调用 operationqueue.next，主要用于传统流程改造成队列流程 */
    var OperationCall = (function (_super) {
        __extends(OperationCall, _super);
        function OperationCall(cb, ctx, argus, idr) {
            var _this = _super.call(this, idr) || this;
            _this.cb = cb;
            _this.ctx = ctx;
            _this.argus = argus;
            return _this;
        }
        OperationCall.prototype.start = function () {
            this.cb.apply(this.ctx, this.argus);
        };
        return OperationCall;
    }(Operation));
    nn.OperationCall = OperationCall;
    /** 间隔时间操作 */
    var OperationDelay = (function (_super) {
        __extends(OperationDelay, _super);
        function OperationDelay(delay, idr) {
            var _this = _super.call(this, idr) || this;
            _this.delay = delay;
            return _this;
        }
        OperationDelay.prototype.start = function () {
            egret.setTimeout(this.done, this, this.delay);
        };
        return OperationDelay;
    }(Operation));
    nn.OperationDelay = OperationDelay;
    var _OperationGroupQueue = (function (_super) {
        __extends(_OperationGroupQueue, _super);
        function _OperationGroupQueue() {
            var _this = _super.call(this) || this;
            _this._sum = 0;
            _this._now = 0;
            _this.autoMode = false;
            return _this;
        }
        _OperationGroupQueue.prototype.start = function () {
            this._sum = this._opers.length;
            this._now = 0;
        };
        _OperationGroupQueue.prototype.next = function () {
            if (++this._now == this._sum)
                this.signals.emit(nn.SignalDone);
        };
        return _OperationGroupQueue;
    }(OperationQueue));
    /** 操作组 */
    var OperationGroup = (function (_super) {
        __extends(OperationGroup, _super);
        function OperationGroup(idr) {
            var _this = _super.call(this, idr) || this;
            _this._subqueue = new _OperationGroupQueue();
            _this._subqueue.signals.connect(nn.SignalDone, _this.__subqueue_end, _this);
            return _this;
        }
        OperationGroup.prototype.dispose = function () {
            this._subqueue.dispose();
        };
        OperationGroup.prototype.start = function () {
            this._subqueue.start();
            this._subqueue.operations.forEach(function (q) {
                q.start();
            });
        };
        OperationGroup.prototype.add = function (q) {
            this._subqueue.add(q);
        };
        OperationGroup.prototype.__subqueue_end = function () {
            this.done();
            this.dispose();
        };
        return OperationGroup;
    }(Operation));
    nn.OperationGroup = OperationGroup;
    /** 自动重试
        @code
        new Retry(....).process();
    */
    var Retry = (function () {
        /*
           @param times 重试次数
           @param interval 重试的时间间隔s，或者是每一次的间隔
        */
        function Retry(times, interval, cb, ctx) {
            this._times = times;
            this._currentTime = 0;
            this._interval = interval;
            this._cb = cb;
            this._ctx = ctx;
        }
        /** 运行 */
        Retry.prototype.process = function () {
            this._cb.call(this._ctx, this);
        };
        /** 结束 */
        Retry.prototype.done = function () {
            this._cb = undefined;
            this._ctx = undefined;
        };
        /** 下一个 */
        Retry.prototype.next = function () {
            var _this = this;
            var delay;
            if (typeof (this._interval) == 'number')
                delay = this._interval;
            else
                delay = this._interval[this._currentTime];
            if (this._times > 0 &&
                this._currentTime++ == this._times) {
                this.done();
                warn('重试达到指定次数，结束重试');
                return;
            }
            // 继续下一次
            if (delay == 0) {
                this._cb.call(this._ctx, this);
            }
            else {
                Delay(delay, function () {
                    _this._cb.call(_this._ctx, _this);
                }, this);
            }
        };
        return Retry;
    }());
    nn.Retry = Retry;
    function retry(times, interval, cb, ctx) {
        var r = new Retry(times, interval, cb, ctx);
        nn.Defer(r.next, r);
        return r;
    }
    nn.retry = retry;
    /** 对象池，自动初始化超过现存可用数量的对象 */
    var ObjectsPool = (function () {
        function ObjectsPool(ins, ctx) {
            this._arr = new Array();
            this.instance = ins;
        }
        ObjectsPool.prototype.dispose = function () {
            this.clear();
        };
        ObjectsPool.prototype.use = function () {
            if (this._arr.length == 0)
                return this.instance.call(this.ctx);
            return this._arr.pop();
        };
        ObjectsPool.prototype.unuse = function (o) {
            if (o)
                this._arr.push(o);
        };
        Object.defineProperty(ObjectsPool.prototype, "length", {
            get: function () {
                return this._arr.length;
            },
            enumerable: true,
            configurable: true
        });
        ObjectsPool.prototype.clear = function () {
            ArrayT.Clear(this._arr, function (o) {
                drop(o);
            });
        };
        return ObjectsPool;
    }());
    nn.ObjectsPool = ObjectsPool;
    /** 简单复用池
        @note 业务建议使用 ReusesPool，提供了used和unused的管理
    */
    var SimpleReusesPool = (function () {
        function SimpleReusesPool(ins, ctx) {
            this._pl = new KvObject();
            this._ins = ins;
            this._ctx = ctx;
        }
        SimpleReusesPool.prototype.dispose = function () {
            this.clear();
        };
        SimpleReusesPool.prototype.use = function (k, def, argus) {
            var ar = this._pl[k];
            if (ar && ar.length)
                return ar.pop();
            if (this._ins)
                return this._ins.apply(this._ctx, argus);
            return def;
        };
        SimpleReusesPool.prototype.unuse = function (k, o) {
            var ar = this._pl[k];
            if (ar == null) {
                ar = new Array();
                this._pl[k] = ar;
            }
            ar.push(o);
        };
        SimpleReusesPool.prototype.clear = function () {
            MapT.Clear(this._pl, function (k, v) {
                ArrayT.Clear(v, function (o) {
                    drop(o);
                });
            });
        };
        return SimpleReusesPool;
    }());
    nn.SimpleReusesPool = SimpleReusesPool;
    var ReusesPool = (function () {
        function ReusesPool(ins, use, unuse, ctx) {
            this._pl = new KvObject();
            this._useds = new Array();
            this._unuseds = new Array();
            this._ins = ins;
            this._use = use;
            this._unuse = unuse;
            this._ctx = ctx;
        }
        ReusesPool.prototype.use = function (k, def, argus) {
            var ar = this._pl[k];
            if (ar && ar.length) {
                var r = ar.pop();
                ArrayT.RemoveObject(this._unuseds, r);
                this._useds.push(r);
                if (this._use)
                    this._use.call(this._ctx, k, r);
                return r;
            }
            if (this._ins) {
                var r = this._ins.apply(this._ctx, argus);
                this._useds.push(r);
                if (this._use)
                    this._use.call(this._ctx, k, r);
                return r;
            }
            return def;
        };
        ReusesPool.prototype.unuse = function (k, o) {
            var ar = this._pl[k];
            if (ar == null) {
                ar = new Array();
                this._pl[k] = ar;
            }
            else {
                ArrayT.RemoveObject(this._useds, o);
            }
            ar.push(o);
            this._unuseds.push(o);
            if (this._unuse)
                this._unuse.call(this._ctx, k, o);
        };
        Object.defineProperty(ReusesPool.prototype, "useds", {
            get: function () {
                return this._useds;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ReusesPool.prototype, "unuseds", {
            get: function () {
                return this._unuseds;
            },
            enumerable: true,
            configurable: true
        });
        return ReusesPool;
    }());
    nn.ReusesPool = ReusesPool;
    var Storage = (function () {
        function Storage() {
            // key的前缀
            this._prefix = '::n2';
        }
        Object.defineProperty(Storage.prototype, "prefix", {
            get: function () {
                return this._prefix;
            },
            set: function (pre) {
                this._prefix = pre ? pre : '';
            },
            enumerable: true,
            configurable: true
        });
        Storage.prototype.clone = function () {
            var r = nn.InstanceNewObject(this);
            r.codec = this.codec;
            r.prefix = this.prefix;
            r.domain = this.domain;
            return r;
        };
        // 获取真正的key，避免同一个domain下key冲突
        Storage.prototype.getKey = function (key) {
            var s = this.prefix;
            if (this.domain)
                s += "::" + this.domain;
            s += key;
            return s;
        };
        // 设置数据
        Storage.prototype.set = function (key, val) {
            if (key == null)
                return;
            var ks = this.getKey(key);
            if (this.codec)
                ks = this.codec.encode(ks);
            if (val == null) {
                nn.IMP_STORAGE_DEL(ks);
            }
            else {
                var vs = val.toString();
                if (this.codec)
                    vs = this.codec.encode(vs);
                nn.IMP_STORAGE_SET(ks, vs);
            }
        };
        // 读取数据
        Storage.prototype.value = function (key, def) {
            var ks = this.getKey(key);
            if (this.codec)
                ks = this.codec.encode(ks);
            var vs = nn.IMP_STORAGE_GET(ks);
            if (this.codec && vs)
                vs = this.codec.decode(vs);
            if (vs == null) {
                if (def instanceof nn.Closure)
                    vs = def.invoke();
                else
                    vs = asString(def, null);
            }
            return vs;
        };
        // 快速设置一些数值
        Storage.prototype.setBool = function (key, val) {
            this.set(key, val ? '1' : '0');
        };
        Storage.prototype.getBool = function (key, def) {
            var r = this.value(key, def ? '1' : '0');
            return r != '0';
        };
        Storage.prototype.setNumber = function (key, val) {
            this.set(key, val);
        };
        Storage.prototype.getNumber = function (key, def) {
            var r = this.value(key, def ? def.toString() : '0');
            return parseFloat(r);
        };
        Storage.prototype.setObject = function (key, val) {
            this.set(key, JSON.stringify(val));
        };
        Storage.prototype.getObject = function (key) {
            var s = this.value(key);
            return JSON.parse(s);
        };
        Storage.prototype.clear = function () {
            nn.IMP_STORAGE_CLEAR();
        };
        return Storage;
    }());
    Storage.shared = new Storage();
    nn.Storage = Storage;
    var CryptoStorages = (function () {
        function CryptoStorages() {
            this._storages = new KvObject();
        }
        CryptoStorages.prototype.get = function (idr) {
            var st = this._storages[idr];
            if (st == null) {
                st = Storage.shared.clone();
                // debug不启用加密
                if (!nn.ISDEBUG) {
                    var c = new nn.CrytoString();
                    c.key = nn.CApplication.shared.idfa + "::" + idr;
                    st.codec = c;
                }
                this._storages[idr] = st;
            }
            return st;
        };
        CryptoStorages.prototype.set = function (idr, key, val) {
            this.get(idr).set(idr + "::" + key, val);
        };
        CryptoStorages.prototype.value = function (idr, key, def) {
            return this.get(idr).value(idr + "::" + key, def);
        };
        CryptoStorages.prototype.setBool = function (idr, key, val) {
            this.get(idr).setBool(idr + "::" + key, val);
        };
        CryptoStorages.prototype.getBool = function (idr, key, def) {
            return this.get(idr).getBool(idr + "::" + key, def);
        };
        CryptoStorages.prototype.setNumber = function (idr, key, val) {
            this.get(idr).setNumber(idr + "::" + key, val);
        };
        CryptoStorages.prototype.getNumber = function (idr, key, def) {
            return this.get(idr).getNumber(idr + "::" + key, def);
        };
        return CryptoStorages;
    }());
    CryptoStorages.shared = new CryptoStorages();
    nn.CryptoStorages = CryptoStorages;
    // 类似于C++的traittype，用来解决ts模版不支持特化的问题
    nn.number_t = { type: 'number', def: 0 };
    nn.boolean_t = { type: 'boolean', def: false };
    nn.string_t = { type: 'string', def: '' };
    /** 可以用来直接在声明时绑定位于storage中带类型的变量 */
    var StorageVariable = (function () {
        function StorageVariable(key, type) {
            if (type === void 0) { type = nn.string_t; }
            this.key = key;
            this.type = type;
        }
        Object.defineProperty(StorageVariable.prototype, "value", {
            get: function () {
                if (this.type.type == 'number')
                    return Storage.shared.getNumber(this.key);
                else if (this.type.type == 'boolean')
                    return Storage.shared.getBool(this.key);
                return Storage.shared.value(this.key);
            },
            set: function (v) {
                if (this.type.type == 'number')
                    Storage.shared.setNumber(this.key, v);
                else if (this.type.type == 'boolean')
                    Storage.shared.setBool(this.key, v);
                else
                    Storage.shared.set(this.key, v);
            },
            enumerable: true,
            configurable: true
        });
        return StorageVariable;
    }());
    nn.StorageVariable = StorageVariable;
    var CacheRecord = (function () {
        function CacheRecord() {
            this.count = 0; // 计数器
        }
        Object.defineProperty(CacheRecord.prototype, "isnull", {
            get: function () {
                return this.val == null;
            },
            enumerable: true,
            configurable: true
        });
        CacheRecord.prototype.use = function () {
            this.count += 1;
            return this.val;
        };
        CacheRecord.prototype.prop = function (k, v) {
            if (this.val)
                this.val[k] = v;
        };
        CacheRecord.prototype.grab = function () {
            this.count += 1;
        };
        CacheRecord.prototype.drop = function () {
            this.count -= 1;
        };
        return CacheRecord;
    }());
    nn.CacheRecord = CacheRecord;
    /** 基础缓存实现 */
    var Memcache = (function () {
        function Memcache() {
            // 存储所有的对象，用来做带key的查找
            this._maps = new KvObject();
            this._records = new Array();
            // 是否启用
            this.enable = true;
        }
        /** 添加一个待缓存的对象 */
        Memcache.prototype.cache = function (obj) {
            if (!this.enable) {
                var t = new CacheRecord();
                t.val = obj.valueForCache();
                return t;
            }
            var ks = obj.keyForCache();
            if (ks == null) {
                warn("放到缓存中的对象没有提供 mcKey");
                return null;
            }
            // 查找老的
            var rcd = this._maps[ks];
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
            nn.FramesManager.needsGC(this);
            return rcd;
        };
        // 执行一次淘汰验证
        Memcache.prototype.gc = function () {
            var _this = this;
            var rms = ArrayT.RemoveObjectsByFilter(this._records, function (rcd) {
                return rcd.count <= 0;
            });
            rms.forEach(function (rcd) {
                _this.doRemoveObject(rcd);
            });
        };
        /** 获得缓存对象 */
        Memcache.prototype.query = function (ks) {
            var rcd = this._maps[ks];
            if (rcd == null)
                return null;
            if (rcd.ts > 0 && rcd.ts <= DateTime.Now()) {
                // 为了下一次将过期的清理掉
                rcd.count = 0;
                return null;
            }
            return rcd;
        };
        /** override 回调处理移除一个元素 */
        Memcache.prototype.doRemoveObject = function (rcd) {
            MapT.RemoveKey(this._maps, rcd.key);
        };
        return Memcache;
    }());
    Memcache.shared = new Memcache();
    nn.Memcache = Memcache;
    var _Scripts = (function () {
        function _Scripts() {
        }
        _Scripts.prototype.require = function (p, cb, ctx) {
            if (nn.ISHTML5) {
                if (p instanceof Array) {
                    var srcs = p;
                    Js.loadScripts(srcs, cb, ctx);
                }
                else {
                    var src = p;
                    Js.loadScript(src, cb, ctx);
                }
            }
            else {
                if (p instanceof Array) {
                    var srcs = p;
                    for (var e in srcs) {
                        require(e);
                    }
                    cb.call(ctx);
                }
                else {
                    var src = p;
                    require(src);
                    cb.call(ctx);
                }
            }
        };
        return _Scripts;
    }());
    nn._Scripts = _Scripts;
    nn.Scripts = new _Scripts();
})(nn || (nn = {}));
/** 当native时，直接用set会出现key为ui时第二次加入时崩溃，所以需要转成安全的set */
function NewSet() {
    return (nn.ISHTML5 ? new nn.CSet() : new nn.SafeSet());
}
var nn;
(function (nn) {
    // 当元素添加到舞台上
    nn.SignalAddedToStage = "::ui::addedtostage";
    // 请求关闭页面
    nn.SignalRequestClose = "::nn::request::close";
    /** zPosition的几个预定的层次 */
    var ZPOSITION;
    (function (ZPOSITION) {
        ZPOSITION[ZPOSITION["DEFAULT"] = 100] = "DEFAULT";
        ZPOSITION[ZPOSITION["FRONT"] = -999] = "FRONT";
        ZPOSITION[ZPOSITION["NORMAL"] = 0] = "NORMAL";
        ZPOSITION[ZPOSITION["BACK"] = 999] = "BACK";
    })(ZPOSITION = nn.ZPOSITION || (nn.ZPOSITION = {}));
    ;
    /** 资源组管理 */
    var ReqResources = (function () {
        function ReqResources() {
        }
        /** 对象依赖的动态资源组 */
        ReqResources.prototype.getReqResources = function () {
            return this.reqResources;
        };
        /** 获得依赖的静态资源组 */
        ReqResources.GetReqResources = function () {
            var self = this;
            if (self.__reqResources)
                return self.__reqResources;
            self.__reqResources = [];
            self.ResourcesRequire(self.__reqResources);
            return self.__reqResources;
        };
        /** 通过该函数回调业务层的静态资源组定义 */
        ReqResources.ResourcesRequire = function (res) { };
        return ReqResources;
    }());
    /** 是否显示资源加载的进度
        @note 静态的资源加载一般都需要显示资源进度 */
    ReqResources.ShowResourceProgress = true;
    nn.ReqResources = ReqResources;
    // 材质的类型
    var COriginType = (function () {
        function COriginType() {
        }
        return COriginType;
    }());
    COriginType.shared = new COriginType();
    nn.COriginType = COriginType;
    // 直接用于源类型的对象
    var SourceVariable = (function (_super) {
        __extends(SourceVariable, _super);
        function SourceVariable() {
            return _super.apply(this, arguments) || this;
        }
        SourceVariable.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.source = undefined;
        };
        return SourceVariable;
    }(nn.RefVariable));
    nn.SourceVariable = SourceVariable;
    // 舞台的大小
    nn.StageBounds = new nn.Rect();
})(nn || (nn = {}));
var nn;
(function (nn) {
    // 触摸前处理
    nn.SignalPreTouch = "::nn::pretouch";
    // 点击前处理
    nn.SignalPreClick = "::nn::preclick";
    /** 触摸数据 */
    var CTouch = (function () {
        function CTouch() {
            this.startPosition = new nn.Point();
            this.lastPosition = new nn.Point();
            this.currentPosition = new nn.Point();
        }
        Object.defineProperty(CTouch.prototype, "delta", {
            /** 当前的增量 */
            get: function () {
                var pt = this.currentPosition.clone();
                return pt.add(-this.lastPosition.x, -this.lastPosition.y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CTouch.prototype, "distance", {
            /** 移动的距离 */
            get: function () {
                return new nn.Point(this.currentPosition.x - this.startPosition.x, this.currentPosition.y - this.startPosition.y);
            },
            enumerable: true,
            configurable: true
        });
        return CTouch;
    }());
    nn.CTouch = CTouch;
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 内部实现的基类 */
    var CComponent = (function (_super) {
        __extends(CComponent, _super);
        function CComponent() {
            var _this = _super.call(this) || this;
            // 绑定内部控件双方
            _this.createImp();
            if (_this._imp)
                _this._imp._fmui = _this;
            return _this;
        }
        CComponent.prototype.handle = function () {
            return this._imp;
        };
        // 获得内部控件对应的UI对象
        CComponent.FromImp = function (imp) {
            return imp._fmui;
        };
        Object.defineProperty(CComponent.prototype, "descriptionName", {
            // debugClassname
            get: function () {
                return nn.Classname(this);
            },
            enumerable: true,
            configurable: true
        });
        CComponent.prototype._instanceSignals = function () {
            _super.prototype._instanceSignals.call(this);
            this._signals.delegate = this;
        };
        CComponent.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalTouchBegin);
            this._signals.register(nn.SignalTouchEnd);
            this._signals.register(nn.SignalTouchMove);
            this._signals.register(nn.SignalConstriantChanged);
            this._signals.register(nn.SignalLoaded);
            this._signals.register(nn.SignalAddedToStage);
            this._signals.register(nn.SignalClicked);
            this._signals.register(nn.SignalPreTouch);
            this._signals.register(nn.SignalPreClick);
        };
        CComponent.prototype.dispose = function () {
            // 断开gui类和实现类的关系
            this._imp._fmui = undefined;
            this._imp = undefined;
            // 清空附加数据
            this.tag = undefined;
            this._viewStack = undefined;
            if (this._states) {
                this._states.drop();
                this._states = undefined;
            }
            if (this.transitionObject) {
                this.transitionObject.drop();
                this.transitionObject = undefined;
            }
            this.clearGestures();
            // 停止所有相关的动画
            this.stopAllAnimates();
            _super.prototype.dispose.call(this);
        };
        // 子类空间处理实现相关的事件绑定
        CComponent.prototype._signalConnected = function (sig, s) { };
        // 计算点击
        CComponent.prototype.hitTest = function (x, y) {
            if (this.touchChildren == false)
                return this.hitTestClient(x, y);
            var r = this.hitTestChild(x, y);
            if (r == null)
                r = this.hitTestClient(x, y);
            return r;
        };
        CComponent.prototype.validate = function () {
            return true;
        };
        // 通过tag来查找控件
        CComponent.prototype.getChildByTag = function (tag) {
            var chds = this.children;
            for (var i = 0; i < chds.length; ++i) {
                if (chds[i].tag == tag)
                    return chds[i];
            }
            return null;
        };
        // 当子级加入时业务级调用
        CComponent.prototype.onChildAdded = function (c, layout) {
            // 子元素的加入需要更新一下自身的布局
            if (layout && !this._islayouting && this.validate())
                this.setNeedsLayout();
            // 如果已经显示在舞台，激活一下appear
            if (c.onStage)
                c.setNeedsAppear();
            // 回调加载成功
            c.onLoaded();
            // 资源也准备好了
            c.updateResource();
        };
        // 当子级移除时业务级调用
        CComponent.prototype.onChildRemoved = function (c) {
            c.drop();
        };
        Object.defineProperty(CComponent.prototype, "belong", {
            get: function () {
                return this._belong ? this._belong : this.parent;
            },
            set: function (c) {
                this._belong = c;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CComponent.prototype, "interactiveEnabled", {
            /** 是否可以触摸 */
            get: function () {
                return this.touchEnabled || this.touchChildren;
            },
            set: function (b) {
                this.touchEnabled = b;
                this.touchChildren = b;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CComponent.prototype, "animate", {
            /** 动画变成属性
                @note 只允许设置，不允许get，设计的CAnimate会当结束后自动释放掉自己
             */
            set: function (ani) { },
            enumerable: true,
            configurable: true
        });
        CComponent.prototype.playAnimate = function (ani, idr) {
            if (idr == null)
                idr = ani.tag ? ani.tag : ani.hashCode;
            if (this._playingAnimates == null)
                this._playingAnimates = new Array();
            if (this.findAnimate(idr) != null) {
                nn.warn("存在同样名字的动画");
                return null;
            }
            ani = ani.clone();
            ani.tag = idr;
            this._playingAnimates.push(ani);
            ani.complete(this.__cb_aniend, this);
            ani.bind(this).play();
            return ani;
        };
        /** 根据id查找动画 */
        CComponent.prototype.findAnimate = function (idr) {
            if (this._playingAnimates)
                return nn.ArrayT.QueryObject(this._playingAnimates, function (ani) {
                    return ani.tag == idr;
                });
            return null;
        };
        /** 根据id停止动画 */
        CComponent.prototype.stopAnimate = function (idr) {
            if (this._playingAnimates == null)
                return;
            var ani = this.findAnimate(idr);
            if (ani == null)
                return;
            ani.stop();
            nn.ArrayT.RemoveObject(this._playingAnimates, ani);
            return;
        };
        /** 停止所有的动画 */
        CComponent.prototype.stopAllAnimates = function () {
            if (this._playingAnimates) {
                nn.ArrayT.Clear(this._playingAnimates, function (ani) {
                    ani.stop();
                });
            }
        };
        CComponent.prototype.__cb_aniend = function (s) {
            // 移除播放结束的
            var ani = s.sender;
            nn.ArrayT.RemoveObject(this._playingAnimates, ani);
            //noti("动画 " + ani.tag + " 停止");
        };
        // 设置内部实现类的大小
        CComponent.prototype.impSetFrame = function (rc, ui) { };
        /** 更新缓存 */
        CComponent.prototype.updateCache = function () {
            if (this.cacheEnabled)
                this.setNeedsCache();
        };
        /** 请求更新缓存 */
        CComponent.prototype.setNeedsCache = function () {
            nn.FramesManager.needsCache(this);
        };
        /** 当加载时的回调
            @note 加载流程 loadScene -> onLoaded */
        CComponent.prototype.onLoaded = function () {
            if (this._signals)
                this._signals.emit(nn.SignalLoaded);
        };
        // 资源组，参见 ReqResources
        CComponent.GetReqResources = function () {
            return nn.ReqResources.GetReqResources.call(this);
        };
        CComponent.ResourcesRequire = function (res) {
            nn.ReqResources.ResourcesRequire.call(this, res);
        };
        CComponent.prototype.getReqResources = function () {
            return nn.ReqResources.prototype.getReqResources.call(this);
        };
        /** 当资源准备完成时更新资源 */
        CComponent.prototype.updateResource = function () { };
        /** 加载需要的资源 */
        CComponent.prototype.loadReqResources = function (cb, ctx) {
            var cls = nn.ObjectClass(this);
            var reqRes = nn.ArrayT.Concat(cls.GetReqResources(), this.getReqResources());
            if (nn.length(reqRes) == 0) {
                cb.call(ctx);
                return;
            }
            var res = nn.ResManager.capsules(reqRes);
            if (cls.ShowResourceProgress) {
                if (cls.ClazzResourceProgress) {
                    var clsloading = cls.ClazzResourceProgress;
                    if (clsloading == null)
                        clsloading = nn.CApplication.shared.clazzResourceProgress.type;
                    var loading_1 = new clsloading();
                    res.signals.connect(nn.SignalChanged, function (s) {
                        loading_1.progressValue = s.data;
                    }, null);
                    loading_1.open(false);
                    res.load(function () {
                        loading_1.close();
                        cb.call(ctx);
                    });
                }
                else if (nn.RESOURCELOADINGISHUD) {
                    nn.Hud.ShowProgress();
                    res.load(function () {
                        nn.Hud.HideProgress();
                        cb.call(ctx);
                    });
                }
            }
            else {
                res.load(function () {
                    cb.call(ctx);
                });
            }
        };
        /** 实例化GUI对象
            @note 如果设置了静态的resourceGroups，则需要在回调中使用真正的实例
        */
        CComponent.New = function (cb) {
            var _this = this;
            var p = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                p[_i - 1] = arguments[_i];
            }
            var cls = nn.ObjectClass(this);
            var reqRes = cls.GetReqResources();
            if (nn.length(reqRes) == 0) {
                var obj_1 = nn.NewObject(cls, p);
                cb.call(this, obj_1);
                return obj_1;
            }
            var res = nn.ResManager.capsules(reqRes);
            if (cls.ShowResourceProgress) {
                if (cls.ClazzResourceProgress) {
                    var clsloading = cls.ClazzResourceProgress;
                    if (clsloading == null)
                        clsloading = nn.CApplication.shared.clazzResourceProgress.type;
                    var loading_2 = new clsloading();
                    res.signals.connect(nn.SignalChanged, function (s) {
                        loading_2.progressValue = s.data;
                    }, null);
                    loading_2.open(false);
                    res.load(function () {
                        loading_2.close();
                        var obj = nn.NewObject(cls, p);
                        cb.call(_this, obj);
                    });
                }
                else if (nn.RESOURCELOADINGISHUD) {
                    nn.Hud.ShowProgress();
                    res.load(function () {
                        nn.Hud.HideProgress();
                        var obj = nn.NewObject(cls, p);
                        cb.call(_this, obj);
                    });
                }
            }
            else {
                res.load(function () {
                    var obj = nn.NewObject(cls, p);
                    cb.call(_this, obj);
                });
            }
            return null;
        };
        /** 请求更新布局 */
        CComponent.prototype.setNeedsLayout = function () {
            nn.FramesManager.needsLayout(this);
        };
        /** 强制刷新布局 */
        CComponent.prototype.flushLayout = function () {
            nn.FramesManager.cancelLayout(this);
            this.updateLayout();
        };
        /** 更新布局 */
        CComponent.prototype.updateLayout = function () { };
        /** 需要刷新z顺序 */
        CComponent.prototype.setNeedsZPosition = function () {
            nn.FramesManager.needsZPosition(this);
        };
        /** 更新数据 */
        CComponent.prototype.updateData = function () { };
        // 设置大小的工具函数
        CComponent.prototype.setX = function (v) {
            var rc = this.frame;
            rc.x = v;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.getX = function () {
            return this.frame.x;
        };
        CComponent.prototype.setY = function (v) {
            var rc = this.frame;
            rc.y = v;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.getY = function () {
            return this.frame.y;
        };
        CComponent.prototype.setWidth = function (v) {
            var rc = this.frame;
            if (rc.width == v)
                return this;
            rc.width = v;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.getWidth = function () {
            return this.frame.width;
        };
        CComponent.prototype.setHeight = function (v) {
            var rc = this.frame;
            if (rc.height == v)
                return this;
            rc.height = v;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.getHeight = function () {
            return this.frame.height;
        };
        CComponent.prototype.setSize = function (sz) {
            var rc = this.frame;
            if (rc.width == sz.width && rc.height == sz.height)
                return this;
            rc.size = sz;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.setOrigin = function (pt) {
            var rc = this.frame;
            if (rc.x == pt.x && rc.y == pt.y)
                return;
            rc.position = pt;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.offsetOrigin = function (pt) {
            var rc = this.frame;
            rc.add(pt.x, pt.y);
            this.frame = rc;
            return this;
        };
        CComponent.prototype.setCenter = function (pt) {
            var rc = this.frame;
            rc.center = pt;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.setLeftTop = function (pt) {
            var rc = this.frame;
            rc.leftTop = pt;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.setLeftCenter = function (pt) {
            var rc = this.frame;
            rc.leftCenter = pt;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.setLeftBottom = function (pt) {
            var rc = this.frame;
            rc.leftBottom = pt;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.setTopCenter = function (pt) {
            var rc = this.frame;
            rc.topCenter = pt;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.setBottomCenter = function (pt) {
            var rc = this.frame;
            rc.bottomCenter = pt;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.setRightTop = function (pt) {
            var rc = this.frame;
            rc.rightTop = pt;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.setRightCenter = function (pt) {
            var rc = this.frame;
            rc.rightCenter = pt;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.setRightBottom = function (pt) {
            var rc = this.frame;
            rc.rightBottom = pt;
            this.frame = rc;
            return this;
        };
        CComponent.prototype.setScaleX = function (v) {
            var s = this.scale;
            if (s == null)
                s = new nn.Point(v, 1);
            else
                s = new nn.Point(v, s.y);
            this.scale = s;
        };
        CComponent.prototype.setScaleY = function (v) {
            var s = this.scale;
            if (s == null)
                s = new nn.Point(1, v);
            else
                s = new nn.Point(s.x, v);
            this.scale = s;
            return this;
        };
        CComponent.prototype.setScale = function (v) {
            this.scale = new nn.Point(v, v);
            return this;
        };
        CComponent.prototype.setTranslateX = function (v) {
            var s = this.translate;
            if (s == null)
                s = new nn.Point(v, 0);
            else
                s = new nn.Point(v, s.y);
            this.translate = s;
            return this;
        };
        CComponent.prototype.setTranslateY = function (v) {
            var s = this.translate;
            if (s == null)
                s = new nn.Point(0, v);
            else
                s = new nn.Point(s.x, v);
            this.translate = s;
            return this;
        };
        /** 提供最佳大小 */
        CComponent.prototype.bestFrame = function (rc) {
            return nn.ObjectClass(this).BestFrame(rc);
        };
        CComponent.prototype.bestPosition = function () {
            return null;
        };
        CComponent.BestFrame = function (rc) {
            return new nn.Rect();
        };
        CComponent.prototype.getEdgeInsets = function () {
            if (this.edgeInsets == null)
                this.edgeInsets = new nn.EdgeInsets();
            return this.edgeInsets;
        };
        CComponent.prototype.boundsForLayout = function () {
            return this.bounds().applyEdgeInsets(this.edgeInsets);
        };
        /** 当显示改变时 */
        CComponent.prototype.onVisibleChanged = function () {
        };
        /** 出现在界面上的回调 */
        CComponent.prototype.onAppeared = function () {
            if (nn.ISDEBUG) {
                if (this.isAppeared)
                    nn.warn(nn.Classname(this) + ' 重复显示');
            }
            this.isAppeared = true;
            // 暂停当前级别的loop动画
            if (this._playingAnimates) {
                this._playingAnimates.forEach(function (ani) {
                    if (ani.count == -1 && ani.isPaused())
                        ani.resume();
                });
            }
            // 传递给子集
            this.children.forEach(function (c) {
                if (!c.isAppeared)
                    c.onAppeared();
            }, this);
        };
        CComponent.prototype.onDisappeared = function () {
            if (nn.ISDEBUG) {
                if (!this.isAppeared)
                    nn.warn(nn.Classname(this) + ' 重复消失');
            }
            this.isAppeared = false;
            // 暂停当前级别的loop动画
            if (this._playingAnimates) {
                this._playingAnimates.forEach(function (ani) {
                    if (ani.count == -1)
                        ani.pause();
                });
            }
            // 传递给子集
            this.children.forEach(function (c) {
                if (c.isAppeared)
                    c.onDisappeared();
            }, this);
        };
        /** 请求显示 */
        CComponent.prototype.setNeedsAppear = function () {
            nn.FramesManager.needsAppear(this);
        };
        /** 从父级移除 */
        CComponent.prototype.removeFromParent = function () {
            var p = this.parent;
            if (p)
                p.removeChild(this);
        };
        Object.defineProperty(CComponent.prototype, "viewStack", {
            get: function () {
                if (this._viewStack)
                    return this._viewStack;
                var p = this.parent;
                if (p)
                    return p.viewStack;
                return null;
            },
            set: function (v) {
                this._viewStack = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CComponent.prototype, "states", {
            get: function () {
                if (this._states == null) {
                    this._states = new nn.States();
                    this._states.cbset = this.onChangeState;
                    this._states.cbctx = this;
                    this._states.nullobj = null;
                }
                return this._states;
            },
            enumerable: true,
            configurable: true
        });
        CComponent.prototype.onChangeState = function (obj) {
            nn.State.As(obj).setIn(this);
            this.updateCache();
        };
        return CComponent;
    }(nn.SObject));
    CComponent.ClazzResourceProgress = nn.ReqResources.ClazzResourceProgress;
    CComponent.ShowResourceProgress = nn.ReqResources.ShowResourceProgress;
    nn.CComponent = CComponent;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var gs_convertpt = new egret.Point();
    var gs_convertrc = new egret.Rectangle();
    var Touch = (function (_super) {
        __extends(Touch, _super);
        function Touch() {
            return _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Touch.prototype, "target", {
            get: function () {
                return this._e.target;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Touch.prototype, "currentTarget", {
            get: function () {
                return this._e.currentTarget;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Touch.prototype, "_event", {
            set: function (e) {
                this._e = e;
                if (e == null)
                    return;
                var x, y;
                if (e.currentTarget != e.target) {
                    // 需要转化到当前
                    e.currentTarget.globalToLocal(e.stageX, e.stageY, gs_convertpt);
                    x = gs_convertpt.x;
                    y = gs_convertpt.y;
                }
                else {
                    x = e.localX;
                    y = e.localY;
                }
                x *= nn.ScaleFactorDeX;
                y *= nn.ScaleFactorDeY;
                switch (e.type) {
                    case egret.TouchEvent.TOUCH_MOVE:
                        {
                            this.currentPosition.reset(x, y);
                        }
                        break;
                    case egret.TouchEvent.TOUCH_BEGIN:
                        {
                            this.startPosition.reset(x, y);
                            this.lastPosition.copy(this.startPosition);
                            this.currentPosition.copy(this.startPosition);
                        }
                        break;
                    case egret.TouchEvent.TOUCH_END:
                    case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:
                    case egret.TouchEvent.TOUCH_TAP:
                        {
                            this.currentPosition.reset(x, y);
                        }
                        break;
                }
            },
            enumerable: true,
            configurable: true
        });
        Touch.prototype.cancel = function () {
            this._e.stopImmediatePropagation();
        };
        Touch.prototype.veto = function () {
            this._e.stopPropagation();
        };
        Touch.prototype.positionInView = function (v) {
            var c = nn.CComponent.FromImp(this._e.currentTarget);
            return c.convertPointTo(this.currentPosition, v);
        };
        return Touch;
    }(nn.CTouch));
    nn.Touch = Touch;
    var ExtSprite = (function (_super) {
        __extends(ExtSprite, _super);
        function ExtSprite() {
            var _this = _super.call(this) || this;
            _this.width = 0;
            _this.height = 0;
            return _this;
        }
        ExtSprite.prototype.$hitTest = function (stageX, stageY) {
            var cmp = nn.CComponent.FromImp(this);
            if (cmp)
                return cmp.hitTest(stageX, stageY);
            return _super.prototype.$hitTest.call(this, stageX, stageY);
        };
        ExtSprite.prototype.$measureContentBounds = function (rc) {
            rc.width = this.width;
            rc.height = this.height;
        };
        return ExtSprite;
    }(egret.Sprite));
    var ExtBitmap = (function (_super) {
        __extends(ExtBitmap, _super);
        function ExtBitmap() {
            var _this = _super.call(this) || this;
            _this.width = 0;
            _this.height = 0;
            return _this;
        }
        return ExtBitmap;
    }(egret.Bitmap));
    nn.ExtBitmap = ExtBitmap;
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component() {
            return _super.call(this) || this;
        }
        Component.prototype.createImp = function () {
            this._imp = new ExtSprite();
        };
        Component.prototype._signalConnected = function (sig, s) {
            _super.prototype._signalConnected.call(this, sig, s);
            switch (sig) {
                case nn.SignalTouchBegin:
                case nn.SignalTouchEnd:
                case nn.SignalTouchMove:
                    {
                        this.touchEnabled = true;
                        nn.EventHook(this._imp, egret.TouchEvent.TOUCH_BEGIN, this.__dsp_touchbegin, this);
                        nn.EventHook(this._imp, egret.TouchEvent.TOUCH_END, this.__dsp_touchend, this);
                        nn.EventHook(this._imp, egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.__dsp_touchrelease, this);
                        nn.EventHook(this._imp, egret.TouchEvent.TOUCH_MOVE, this.__dsp_touchmove, this);
                    }
                    break;
                case nn.SignalAddedToStage:
                    {
                        nn.EventHook(this._imp, egret.Event.ADDED_TO_STAGE, this.__dsp_addedtostage, this);
                    }
                    break;
                case nn.SignalClicked:
                    {
                        this.touchEnabled = true;
                        nn.EventHook(this._imp, egret.TouchEvent.TOUCH_TAP, this.__dsp_tap, this);
                    }
                    break;
                case nn.SignalPreTouch:
                    {
                        nn.EventHook(this._imp, egret.TouchEvent.TOUCH_BEGIN, this.__dsp_pretouch, this, true);
                        nn.EventHook(this._imp, egret.TouchEvent.TOUCH_END, this.__dsp_pretouch, this, true);
                        nn.EventHook(this._imp, egret.TouchEvent.TOUCH_MOVE, this.__dsp_pretouch, this, true);
                    }
                    break;
                case nn.SignalPreClick:
                    {
                        nn.EventHook(this._imp, egret.TouchEvent.TOUCH_TAP, this.__dsp_preclick, this, true);
                    }
                    break;
            }
        };
        Component.prototype.dispose = function () {
            if (DEBUG && this._imp == null) {
                nn.fatal('错误的多次析构UI对象 ' + nn.Classname(this));
            }
            // 经过测试，addEventListener 当imp＝＝null的时候会自动释放，所以不需要清除之前hook的event
            for (var i = 0; i < this._imp.numChildren; ++i) {
                var c = this.getChildAt(i);
                if (c)
                    c.drop();
            }
            this._touch = undefined;
            _super.prototype.dispose.call(this);
        };
        Component.prototype.instance = function () {
            this._imp = new egret.Sprite();
        };
        Component.prototype.validate = function () {
            var imp = this._imp;
            return imp != null
                && imp.width > 0
                && imp.height > 0;
        };
        Component.prototype.hitTestChild = function (x, y) {
            return egret.Sprite.prototype.$hitTest.call(this._imp, x, y);
        };
        Component.prototype.hitTestClient = function (stageX, stageY) {
            var imp = this._imp;
            if (!imp.$renderNode || !imp.$visible) {
                return null;
            }
            var m = imp.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            return nn.Rect.ContainsPoint(localX, localY, 0, 0, imp.width, imp.height) ?
                imp : null;
        };
        Object.defineProperty(Component.prototype, "onStage", {
            get: function () {
                return this._imp.stage != null;
            },
            enumerable: true,
            configurable: true
        });
        /** 加载场景，如果存在设定的资源组，则需要提前加载资源组 */
        Component.prototype.loadScene = function (cb, ctx) {
            if (!nn.ResManager.isGroupsArrayLoaded(this.resourceGroups)) {
                var res = nn.ResManager.capsules(this.resourceGroups);
                if (this.showResourceProgress) {
                    if (nn.RESOURCELOADINGISHUD) {
                        nn.Hud.ShowProgress();
                        res.load(function () {
                            nn.Hud.HideProgress();
                            cb.call(ctx);
                        });
                    }
                    else {
                        var cls = this.clazzResourceProgress;
                        if (cls == null)
                            cls = nn.CApplication.shared.clazzResourceProgress.type;
                        var loading_3 = new cls();
                        res.signals.connect(nn.SignalChanged, function (s) {
                            loading_3.progressValue = s.data;
                        }, null);
                        loading_3.open(false);
                        res.load(function () {
                            loading_3.close();
                            cb.call(ctx);
                        });
                    }
                }
                else {
                    res.load(function () {
                        cb.call(ctx);
                    });
                }
            }
            else {
                cb.call(ctx);
            }
        };
        Component.prototype.addChild = function (c, layout) {
            var _this = this;
            if (layout === void 0) { layout = true; }
            this._imp.addChild(c._imp);
            c.loadScene(function () {
                if (_this.__disposed)
                    return; // 加载延迟但是UI已经关掉
                _this.onChildAdded(c, layout);
            }, this);
        };
        Component.prototype.addChildAt = function (c, idx, layout) {
            var _this = this;
            if (layout === void 0) { layout = true; }
            this._imp.addChildAt(c._imp, idx);
            c.loadScene(function () {
                if (_this.__disposed)
                    return; // 加载延迟但是UI已经关掉
                _this.onChildAdded(c, layout);
            }, this);
        };
        Component.prototype.removeChild = function (c) {
            this._imp.removeChild(c._imp);
            this.onChildRemoved(c);
        };
        Component.prototype.removeChildren = function () {
            var _this = this;
            this.children.forEach(function (c) {
                _this.removeChild(c);
            }, this);
            this._imp.removeChildren();
        };
        Component.prototype.getChildAt = function (idx) {
            return Component.FromImp(this._imp.getChildAt(idx));
        };
        Component.prototype.setChildIndex = function (c, idx) {
            this._imp.setChildIndex(c.handle(), idx);
        };
        Component.prototype.getChildIndex = function (c) {
            return this._imp.getChildIndex(c.handle());
        };
        Component.prototype.swapChildAt = function (idx0, idx1) {
            this._imp.swapChildrenAt(idx0, idx1);
        };
        Component.prototype.swapChild = function (l, r) {
            this._imp.swapChildren(l.handle(), r.handle());
        };
        Component.prototype.hasChild = function (c) {
            return this._imp.contains(c.handle());
        };
        Component.prototype.bringFront = function (v) {
            var idx = v ? this.parent.getChildIndex(v) : this.parent._imp.numChildren;
            this.parent._imp.setChildIndex(this._imp, idx);
        };
        Component.prototype.sendBack = function (v) {
            var idx = v ? this.parent.getChildIndex(v) : 0;
            if (idx > 0)
                --idx;
            this.parent._imp.setChildIndex(this._imp, idx);
        };
        Component.prototype.hollowOut = function (c) {
            c.handle().blendMode = egret.BlendMode.ERASE;
            this._imp.addChild(c.handle());
            this.hasHollowOut = true;
        };
        Object.defineProperty(Component.prototype, "numChildren", {
            get: function () {
                return this._imp.numChildren;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "zPosition", {
            get: function () {
                var imp = this._imp;
                if (imp.parent == null)
                    return imp._zposition;
                var num = imp.parent.numChildren;
                var idx = imp.parent.getChildIndex(imp);
                return num - 1 - idx;
            },
            set: function (pos) {
                var self = this;
                var imp = self._imp;
                if (imp._zposition == pos)
                    return;
                imp._zposition = pos;
                if (imp.parent == null)
                    return;
                self.parent.setNeedsZPosition();
            },
            enumerable: true,
            configurable: true
        });
        Component._SortDepth = function (l, r) {
            return r._zposition - l._zposition;
        };
        Component.prototype.updateZPosition = function () {
            var self = this;
            var imp = self._imp;
            var cnt = imp.numChildren;
            // 和default来比较，分别排序
            var depthsPos = [], depthsNeg = [];
            for (var i = 0; i < cnt; ++i) {
                var c = imp.getChildAt(i);
                if (c._zposition > nn.ZPOSITION.DEFAULT)
                    depthsPos.push(c);
                else if (c._zposition < nn.ZPOSITION.DEFAULT)
                    depthsNeg.push(c);
            }
            // 越小代表越靠近用户
            if (depthsNeg.length) {
                // 优先排列所有具有层次关系的，避免被普通的对象遮盖住
                depthsNeg.sort(Component._SortDepth);
                depthsNeg.forEach(function (c) {
                    imp.setChildIndex(c, cnt);
                });
            }
            // 越大代表越远离
            if (depthsPos.length) {
                depthsPos.sort(Component._SortDepth);
                depthsPos.forEach(function (c, i) {
                    imp.setChildIndex(c, 0);
                });
            }
        };
        Object.defineProperty(Component.prototype, "children", {
            get: function () {
                var r = [];
                for (var i = 0; i < this.numChildren; ++i) {
                    var t = Component.FromImp(this._imp.getChildAt(i));
                    t && r.push(t);
                }
                return r;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "parent", {
            get: function () {
                if (DEBUG && this._imp == null) {
                    nn.warn('实例已经析构或尚未实现，请检查对象生命期，使用grab和drop手动维护');
                }
                var p = this._imp.parent;
                return p ? Component.FromImp(p) : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "touchEnabled", {
            get: function () {
                return this._imp.touchEnabled;
            },
            set: function (b) {
                this._imp.touchEnabled = b;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "touchChildren", {
            get: function () {
                return this._imp.touchChildren;
            },
            set: function (b) {
                this._imp.touchChildren = b;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "visible", {
            get: function () {
                return this._imp.visible;
            },
            set: function (b) {
                if (b == this._imp.visible)
                    return;
                this._imp.visible = b;
                this.onVisibleChanged();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "clipsToBounds", {
            get: function () {
                return this._imp.mask != null;
            },
            set: function (b) {
                if (this._imp.mask && !b)
                    this._imp.mask = undefined;
                else if (this._imp.mask == null && b)
                    this._imp.mask = new nn.Rect(0, 0, this._imp.width, this._imp.height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "clipsRegion", {
            get: function () {
                return this._imp.mask;
            },
            set: function (rc) {
                this._imp.mask = rc;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "maskView", {
            get: function () {
                var m = this._imp.mask;
                return m ? m._fmui : null;
            },
            set: function (v) {
                this._imp.mask = v.handle();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "animate", {
            get: function () {
                nn.warn("Component的animate只允许set");
                return null;
            },
            set: function (ani) {
                ani.clone().bind(this).play();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "translate", {
            get: function () {
                return this._translate ? this._translate.clone() : null;
            },
            set: function (pt) {
                var rc = this.frame;
                if (this._translate) {
                    rc.x -= this._translate.x;
                    rc.y -= this._translate.y;
                }
                this._translate = pt;
                this.frame = rc;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "scale", {
            get: function () {
                return this._scale;
            },
            set: function (pt) {
                this._scale = pt;
                this._imp.scaleX = pt ? pt.x : 1;
                this._imp.scaleY = pt ? pt.y : 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (ang) {
                this._rotation = ang;
                this._imp.rotation = ang ? ang.angle : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "alpha", {
            get: function () {
                return this._imp.alpha;
            },
            set: function (v) {
                this._imp.alpha = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "cacheEnabled", {
            get: function () {
                return this._cacheEnabled;
            },
            set: function (b) {
                if (this._cacheEnabled == b)
                    return;
                this._cacheEnabled = b;
                this._imp.cacheAsBitmap = b;
            },
            enumerable: true,
            configurable: true
        });
        Component.prototype.flushCache = function () {
            // egret2.5的实现会自动刷新
        };
        Component.prototype.updateCache = function () {
            // egret2.5的实现会自动刷新
        };
        Component.prototype.setNeedsCache = function () {
            // egret2.5的实现会自动刷新
        };
        Object.defineProperty(Component.prototype, "anchor", {
            get: function () {
                return this._anchorPoint;
            },
            set: function (pt) {
                if (nn.ObjectT.IsEqual(pt, this._anchorPoint))
                    return;
                this._anchorPoint = pt;
                this._anchorOffset = undefined;
                if (pt == null) {
                    var dx = this._imp.anchorOffsetX;
                    var dy = this._imp.anchorOffsetY;
                    this._imp.x -= dx;
                    this._imp.y -= dy;
                    this._imp.anchorOffsetX = 0;
                    this._imp.anchorOffsetY = 0;
                }
                else {
                    var dx = pt.x * this._imp.width;
                    var dy = pt.y * this._imp.height;
                    this._imp.anchorOffsetX = dx;
                    this._imp.anchorOffsetY = dy;
                    this._imp.x += dx;
                    this._imp.y += dy;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "anchorOffset", {
            get: function () {
                return this._anchorOffset;
            },
            set: function (pt) {
                if (nn.ObjectT.IsEqual(pt, this._anchorOffset))
                    return;
                this._anchorOffset = pt;
                this._anchorPoint = null;
                // 恢复一下原始位置
                this._imp.x -= this._imp.anchorOffsetX;
                this._imp.y -= this._imp.anchorOffsetY;
                if (pt == null) {
                    this._imp.anchorOffsetX = 0;
                    this._imp.anchorOffsetY = 0;
                }
                else {
                    this._imp.anchorOffsetX = pt.x;
                    this._imp.anchorOffsetY = pt.y;
                    this._imp.x += pt.x;
                    this._imp.y += pt.y;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "frame", {
            get: function () {
                var x = this._imp.x;
                var y = this._imp.y;
                var w = this._imp.width;
                var h = this._imp.height;
                // 如过有锚点，需要扣除掉为了让egret渲染符合我们的定义而做的偏移
                if (this._anchorPoint || this._anchorOffset) {
                    x -= this._imp.anchorOffsetX;
                    y -= this._imp.anchorOffsetY;
                }
                // 不对translate做反偏移，避免业务层取到的位置不是显示的位置
                x *= nn.ScaleFactorDeX;
                y *= nn.ScaleFactorDeY;
                w *= nn.ScaleFactorDeW;
                h *= nn.ScaleFactorDeH;
                return new nn.Rect(x, y, w, h);
            },
            set: function (rc) {
                this.setFrame(rc, true);
            },
            enumerable: true,
            configurable: true
        });
        Component.prototype.setFrame = function (rc, anchor) {
            if (anchor === void 0) { anchor = true; }
            var x = rc.x * nn.ScaleFactorX;
            var y = rc.y * nn.ScaleFactorY;
            var w = rc.width * nn.ScaleFactorW;
            var h = rc.height * nn.ScaleFactorH;
            // 偏移
            if (this._translate) {
                x += this._translate.x * nn.ScaleFactorX;
                y += this._translate.y * nn.ScaleFactorY;
            }
            // 计算锚点
            if (anchor && this._anchorPoint) {
                var dx = this._anchorPoint.x * w;
                var dy = this._anchorPoint.y * h;
                this._imp.anchorOffsetX = dx;
                this._imp.anchorOffsetY = dy;
                x += dx;
                y += dy;
            }
            // 规整
            if (!this.floatCoordinate) {
                x = nn.Integral(x);
                y = nn.Integral(y);
                w = nn.Integral(w);
                h = nn.Integral(h);
            }
            var imp = this._imp;
            var layout = imp.width != w || imp.height != h;
            imp.x = x;
            imp.y = y;
            imp.width = w;
            imp.height = h;
            if (imp.mask instanceof egret.Rectangle)
                imp.mask.setTo(0, 0, w, h);
            if (layout)
                this.setNeedsLayout();
        };
        Component.prototype.getX = function () {
            return this._imp.x * nn.ScaleFactorDeX;
        };
        Component.prototype.getY = function () {
            return this._imp.y * nn.ScaleFactorDeY;
        };
        Component.prototype.getWidth = function () {
            return this._imp.width * nn.ScaleFactorDeW;
        };
        Component.prototype.getHeight = function () {
            return this._imp.height * nn.ScaleFactorDeH;
        };
        Component.prototype.impSetFrame = function (rc, ui) {
            if (!this.floatCoordinate) {
                ui.x = nn.Integral(rc.x * nn.ScaleFactorX);
                ui.y = nn.Integral(rc.y * nn.ScaleFactorY);
                ui.width = nn.Integral(rc.width * nn.ScaleFactorW);
                ui.height = nn.Integral(rc.height * nn.ScaleFactorH);
            }
            else {
                ui.x = rc.x * nn.ScaleFactorX;
                ui.y = rc.y * nn.ScaleFactorY;
                ui.width = rc.width * nn.ScaleFactorW;
                ui.height = rc.height * nn.ScaleFactorH;
            }
        };
        Component.prototype.bounds = function () {
            return new nn.Rect(0, 0, this._imp.width * nn.ScaleFactorDeW, this._imp.height * nn.ScaleFactorDeH);
        };
        Object.defineProperty(Component.prototype, "backgroundColor", {
            get: function () {
                return this._backgroundColor;
            },
            set: function (c) {
                this._backgroundColor = c;
                this._drawBackground(null);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "borderLine", {
            get: function () {
                return this._borderLine;
            },
            set: function (l) {
                this._borderLine = l;
                this._drawBackground(null);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "backgroundImage", {
            get: function () {
                if (this._backgroundImageView == null)
                    return null;
                nn.COriginType.shared.imp = this._backgroundImageView.texture;
                return nn.COriginType.shared;
            },
            set: function (ts) {
                var _this = this;
                if (this._backgroundImageSource == ts)
                    return;
                this._backgroundImageSource = ts;
                if (ts == null) {
                    if (this._backgroundImageView)
                        this._backgroundImageView.texture = null;
                    return;
                }
                if (this._backgroundImageView == null) {
                    this._backgroundImageView = new ExtBitmap();
                    this._imp.addChildAt(this._backgroundImageView, 0);
                    this.setNeedsLayout();
                }
                nn.ResManager.getTexture(ts, nn.ResPriority.NORMAL, function (tex) {
                    if (_this._backgroundImageSource != ts)
                        return; // 多次设置以最后一次为准
                    impSetTexture(_this._backgroundImageView, tex.use());
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        Component.prototype._drawBackground = function (rc) {
            var self = this;
            if (rc == null) {
                rc = self.bounds()
                    .applyEdgeInsets(self.backgroundEdgeInsets)
                    .applyScaleFactor();
            }
            // 如过镂空，则需要新建一个层负责绘制背景
            var gra;
            if (self.hasHollowOut) {
                var lyr = self._lyrBackground;
                if (lyr == null) {
                    lyr = new egret.Shape();
                    lyr._zposition = nn.ZPOSITION.DEFAULT + 1;
                    self._imp.addChildAt(lyr, 0);
                    self._lyrBackground = lyr;
                }
                lyr.x = rc.x;
                lyr.y = rc.y;
                lyr.width = rc.width;
                lyr.height = rc.height;
                gra = lyr.graphics;
                // 此中状态下，背景其实是画在内部
                rc.x = rc.y = 0;
            }
            else {
                gra = self._imp.graphics;
            }
            gra.clear();
            var color = self._backgroundColor;
            if (color) {
                gra.beginFill.apply(gra, nn.GetColorComponent(color));
                gra.drawRect(rc.x, rc.y, rc.width, rc.height);
                gra.endFill();
            }
            var line = self._borderLine;
            if (this._borderLine) {
                var colors = nn.GetColorComponent(line.color);
                gra.lineStyle(line.width, colors[0], colors[1], line.smooth);
                gra.drawRect(rc.x, rc.y, rc.width, rc.height);
            }
        };
        Object.defineProperty(Component.prototype, "gestures", {
            get: function () {
                if (this._gestures == null)
                    this._gestures = new Array();
                return this._gestures;
            },
            enumerable: true,
            configurable: true
        });
        Component.prototype.addGesture = function (ges) {
            // 信号的控制由gesture对象自己控制
            ges.detach();
            ges.attach(this);
        };
        Component.prototype.clearGestures = function () {
            if (this._gestures) {
                nn.ArrayT.Clear(this._gestures, function (o) {
                    o.drop();
                });
            }
        };
        Component.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            var bkgrc = this.bounds()
                .applyEdgeInsets(this.backgroundEdgeInsets)
                .applyScaleFactor();
            if (this._backgroundColor)
                this._drawBackground(bkgrc);
            var iv = this._backgroundImageView;
            if (iv) {
                iv.x = bkgrc.x;
                iv.y = bkgrc.y;
                iv.width = bkgrc.width;
                iv.height = bkgrc.height;
            }
        };
        Object.defineProperty(Component.prototype, "touch", {
            get: function () {
                if (this._touch == null)
                    this._touch = new Touch();
                return this._touch;
            },
            enumerable: true,
            configurable: true
        });
        Component.prototype.__dsp_touchbegin = function (e) {
            var t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalTouchBegin, t);
        };
        Component.prototype.__dsp_touchend = function (e) {
            var t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalTouchEnd, t);
        };
        Component.prototype.__dsp_touchrelease = function (e) {
            if (this.__disposed)
                return;
            var t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalTouchEnd, t);
        };
        Component.prototype.__dsp_touchmove = function (e) {
            var t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalTouchMove, t);
            t.lastPosition.copy(t.currentPosition);
        };
        Component.prototype.__dsp_pretouch = function (e) {
            var t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalPreTouch, t);
        };
        Component.prototype.__dsp_preclick = function (e) {
            var t = this.touch;
            t._event = e;
            this._signals.emit(nn.SignalPreClick, t);
        };
        Component.prototype.__dsp_addedtostage = function () {
            this._signals.emit(nn.SignalAddedToStage);
        };
        Component.prototype.__dsp_tap = function (e) {
            var t = this.touch;
            t._event = e;
            if (this._signals)
                this._signals.emit(nn.SignalClicked, t);
            // 防止之后的被点击
            e.stopPropagation();
        };
        Component.prototype.convertPointTo = function (pt, des) {
            var from = this._imp;
            var to = des ? des._imp : nn.CApplication.shared.gameLayer._imp;
            from.localToGlobal(pt.x * nn.ScaleFactorX, pt.y * nn.ScaleFactorY, gs_convertpt);
            to.globalToLocal(gs_convertpt.x, gs_convertpt.y, gs_convertpt);
            gs_convertpt.x *= nn.ScaleFactorDeX;
            gs_convertpt.y *= nn.ScaleFactorDeY;
            return new nn.Point(gs_convertpt.x, gs_convertpt.y);
        };
        Component.prototype.convertRectTo = function (rc, des) {
            var from = this._imp;
            var to = des ? des._imp : nn.CApplication.shared.gameLayer._imp;
            from.localToGlobal(rc.x * nn.ScaleFactorX, rc.y * nn.ScaleFactorY, gs_convertpt);
            to.globalToLocal(gs_convertpt.x, gs_convertpt.y, gs_convertpt);
            gs_convertpt.x *= nn.ScaleFactorDeX;
            gs_convertpt.y *= nn.ScaleFactorDeY;
            return new nn.Rect(gs_convertpt.x, gs_convertpt.y, rc.width, rc.height);
        };
        Component.prototype.renderToTexture = function () {
            gs_convertrc.x = gs_convertrc.y = 0;
            gs_convertrc.width = this._imp.width;
            gs_convertrc.height = this._imp.height;
            // 刷新一次图形缓存
            this.updateCache();
            // draw到内存纹理中
            var tex = new egret.RenderTexture();
            if (tex.drawToTexture(this._imp, gs_convertrc) == false)
                nn.warn("绘制 ui 到纹理失败");
            nn.COriginType.shared.imp = tex;
            return nn.COriginType.shared;
        };
        return Component;
    }(nn.CComponent));
    nn.Component = Component;
    function impSetTexture(bmp, tex) {
        var part = tex ? tex[nn.ResPartKey] : null;
        var p9 = tex ? tex['scale9Grid'] : null;
        if (part) {
            var url = new nn.URL(part);
            if (url.fields['repeat'] !== undefined)
                bmp.fillMode = egret.BitmapFillMode.REPEAT;
            if (url.fields['point9'] !== undefined) {
                var r = nn.ArrayT.Convert(url.fields['point9'].split(','), function (e) {
                    return parseInt(e);
                });
                p9 = new egret.Rectangle(r[0], r[1], r[2], r[3]);
            }
        }
        bmp.texture = tex;
        bmp.scale9Grid = p9;
    }
    nn.impSetTexture = impSetTexture;
    var __PROTO = nn.Point.prototype;
    __PROTO.setTo = function (x, y) {
        this.x = x;
        this.y = y;
    };
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 自定义动画对象 */
    var Animator = (function () {
        function Animator() {
            this._preproperties = new KvObject();
            this._properties = new KvObject();
        }
        /** 增量移动 */
        Animator.prototype.translate = function (dpt) {
            if (this.backMode) {
                this._preproperties['dx'] = -dpt.x;
                this._preproperties['dy'] = -dpt.y;
                this._properties['dx'] = 0;
                this._properties['dy'] = 0;
            }
            else {
                this._properties['dx'] = dpt.x;
                this._properties['dy'] = dpt.y;
            }
            return this;
        };
        Animator.prototype.translatex = function (x) {
            if (this.backMode) {
                this._preproperties['dx'] = -x;
                this._properties['dx'] = 0;
            }
            else {
                this._properties['dx'] = x;
            }
            return this;
        };
        Animator.prototype.translatey = function (y) {
            if (this.backMode) {
                this._preproperties['dy'] = -y;
                this._properties['dy'] = 0;
            }
            else {
                this._properties['dy'] = y;
            }
            return this;
        };
        /** 倍数移动 */
        Animator.prototype.stranslate = function (dpt) {
            if (this.backMode) {
                this._preproperties['dxs'] = -dpt.x;
                this._preproperties['dys'] = -dpt.y;
                this._properties['dxs'] = 0;
                this._properties['dys'] = 0;
            }
            else {
                this._properties['dxs'] = dpt.x;
                this._properties['dys'] = dpt.y;
            }
            return this;
        };
        /** 移动到点 */
        Animator.prototype.moveto = function (dpt) {
            this._properties['x'] = dpt.x;
            this._properties['y'] = dpt.y;
            return this;
        };
        Animator.prototype.movetox = function (v) {
            this._properties['x'] = v;
            return this;
        };
        Animator.prototype.movetoy = function (v) {
            this._properties['y'] = v;
            return this;
        };
        /** 增量缩放倍数 */
        Animator.prototype.scale = function (dpt) {
            if (this.backMode) {
                this._preproperties['dsx'] = -dpt.x;
                this._preproperties['dsy'] = -dpt.y;
                this._properties['dsx'] = 0;
                this._properties['dsy'] = 0;
            }
            else {
                this._properties['dsx'] = dpt.x;
                this._properties['dsy'] = dpt.y;
            }
            return this;
        };
        Animator.prototype.scaleto = function (dpt) {
            this._properties['scaleX'] = dpt.x;
            this._properties['scaleY'] = dpt.y;
            return this;
        };
        /** 旋转 */
        Animator.prototype.rotate = function (ang) {
            if (this.backMode)
                this._preproperties['dangle'] = -ang.angle;
            this._properties['dangle'] = ang.angle;
            return this;
        };
        /** 淡入淡出 */
        Animator.prototype.fade = function (to, from) {
            if (from != null)
                this._preproperties['alpha'] = from;
            if (to != null)
                this._properties['alpha'] = to;
            return this;
        };
        Animator.prototype.fadeIn = function (alpha) {
            if (alpha === void 0) { alpha = 1; }
            return this.fade(alpha, 0);
        };
        Animator.prototype.fadeOut = function (alpha) {
            if (alpha === void 0) { alpha = 0; }
            return this.fade(alpha);
        };
        /** 任意参数做动画 */
        Animator.prototype.change = function (key, to, from) {
            if (from != null)
                this._preproperties[key] = from;
            if (to != null)
                this._properties[key] = to;
            return this;
        };
        return Animator;
    }());
    nn.Animator = Animator;
    var TimeFunction = (function () {
        function TimeFunction() {
        }
        return TimeFunction;
    }());
    // inout 的设置属性，配合下面的函数使用
    TimeFunction.IN = 1;
    TimeFunction.OUT = 2;
    TimeFunction.INOUT = 3;
    nn.TimeFunction = TimeFunction;
    ;
    var CAnimate = (function (_super) {
        __extends(CAnimate, _super);
        function CAnimate() {
            var _this = _super.call(this) || this;
            /** 播放几次 */
            _this.count = 1;
            // 当前第几次
            _this._firedCount = 0;
            /** 动画结束是否自动解除绑定 */
            _this.autoUnbind = true;
            /** 动画结束后是否自动释放 */
            _this.autoDrop = true;
            return _this;
        }
        CAnimate.prototype.dispose = function () {
            this.clear();
            _super.prototype.dispose.call(this);
        };
        CAnimate.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalStart);
            this._signals.register(nn.SignalEnd);
            this._signals.register(nn.SignalDone);
        };
        /** 设置重复的次数 */
        CAnimate.prototype.repeat = function (count) {
            this.count = count;
            return this;
        };
        CAnimate.prototype.then = function (ani, ctx, duration, tf) {
            if (ctx === void 0) { ctx = null; }
            if (duration === void 0) { duration = CAnimate.Duration; }
            if (tf === void 0) { tf = null; }
            return this.to(duration, tf, ani, ctx);
        };
        /** 结束 */
        CAnimate.prototype.complete = function (cb, ctx) {
            this.signals.connect(nn.SignalDone, cb, ctx);
            return this;
        };
        /** 复制 */
        CAnimate.prototype.clone = function () {
            var obj = nn.InstanceNewObject(this);
            obj.autoReset = this.autoReset;
            obj.autoUnbind = this.autoUnbind;
            obj.autoDrop = this.autoDrop;
            obj.count = this.count;
            obj.tag = this.tag;
            return obj;
        };
        /** 直接停止对象动画 */
        CAnimate.Stop = function (tgt) {
        };
        CAnimate.prototype.inTo = function (duration, cb, ctx, tf) {
            if (tf === void 0) { tf = TimeFunction.Quad(TimeFunction.OUT); }
            return this.to(duration, tf, cb, ctx);
        };
        CAnimate.prototype.outTo = function (duration, cb, ctx, tf) {
            if (tf === void 0) { tf = TimeFunction.Quad(TimeFunction.IN); }
            return this.to(duration, tf, cb, ctx);
        };
        CAnimate.prototype.tremble = function (duration, tf) {
            if (duration === void 0) { duration = CAnimate.Duration; }
            return this
                .next({ 'scaleX': 1.3, 'scaleY': 1.3 }, duration * 0.2, tf)
                .next({ 'scaleX': 0.8, 'scaleY': 0.8 }, duration * 0.2, tf)
                .next({ 'scaleX': 1.1, 'scaleY': 1.1 }, duration * 0.2, tf)
                .next({ 'scaleX': 0.9, 'scaleY': 0.9 }, duration * 0.2, tf)
                .next({ 'scaleX': 1, 'scaleY': 1 }, duration * 0.2, tf);
        };
        return CAnimate;
    }(nn.SObject));
    // 系统默认的动画时间
    CAnimate.Duration = 0.33;
    nn.CAnimate = CAnimate;
    var CTween = (function () {
        function CTween() {
        }
        /** 激活一个对象添加动画 */
        CTween.Get = function (c, props) {
            return null;
        };
        /** 删除对象的全部动画 */
        CTween.Stop = function (c) {
        };
        return CTween;
    }());
    nn.CTween = CTween;
})(nn || (nn = {}));
var nn;
(function (nn) {
    nn.TimeFunction.Pow = function (pow, inout) {
        if (inout == nn.TimeFunction.INOUT)
            return egret.Ease.getPowInOut(pow);
        else if (inout == nn.TimeFunction.OUT)
            return egret.Ease.getPowOut(pow);
        return egret.Ease.getPowIn(pow);
    };
    nn.TimeFunction.Quad = function (inout) {
        if (inout == nn.TimeFunction.INOUT)
            return egret.Ease.quadInOut;
        else if (inout == nn.TimeFunction.OUT)
            return egret.Ease.quadOut;
        return egret.Ease.quadIn;
    };
    nn.TimeFunction.Bounce = function (inout) {
        if (inout == nn.TimeFunction.INOUT)
            return egret.Ease.bounceInOut;
        else if (inout == nn.TimeFunction.OUT)
            return egret.Ease.bounceOut;
        return egret.Ease.bounceIn;
    };
    nn.TimeFunction.Elastic = function (amplitude, period, inout) {
        if (amplitude == null && period == null) {
            if (inout == nn.TimeFunction.INOUT)
                return egret.Ease.elasticInOut;
            else if (inout == nn.TimeFunction.OUT)
                return egret.Ease.elasticOut;
            return egret.Ease.elasticIn;
        }
        if (inout == nn.TimeFunction.INOUT)
            return egret.Ease.getElasticInOut(amplitude, period);
        else if (inout == nn.TimeFunction.OUT)
            return egret.Ease.getElasticOut(amplitude, period);
        return egret.Ease.getElasticIn(amplitude, period);
    };
    nn.TimeFunction.Circ = function (inout) {
        if (inout == nn.TimeFunction.INOUT)
            return egret.Ease.circInOut;
        else if (inout == nn.TimeFunction.OUT)
            return egret.Ease.circOut;
        return egret.Ease.circIn;
    };
    nn.TimeFunction.Back = function (amount, inout) {
        if (amount == null) {
            if (inout == nn.TimeFunction.INOUT)
                return egret.Ease.backInOut;
            else if (inout == nn.TimeFunction.OUT)
                return egret.Ease.backOut;
            return egret.Ease.backIn;
        }
        if (inout == nn.TimeFunction.INOUT)
            return egret.Ease.getBackInOut(amount);
        else if (inout == nn.TimeFunction.OUT)
            return egret.Ease.getBackOut(amount);
        return egret.Ease.getBackIn(amount);
    };
    var Animate = (function (_super) {
        __extends(Animate, _super);
        function Animate() {
            var _this = _super.call(this) || this;
            _this.__ani_ended = 0;
            _this._paused = false;
            // uiobj
            _this._targets = new nn.CSet();
            // 变化前、变化后、持续、时间函数、附加数据
            _this._steps = new Array();
            return _this;
        }
        Animate.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        Animate.prototype.bind = function (tgt) {
            this._targets.add(tgt.handle());
            return this;
        };
        Animate.prototype.unbind = function (tgt) {
            this._targets.delete(tgt.handle());
        };
        Animate.prototype.unbindAll = function () {
            nn.SetT.Clear(this._targets);
        };
        Animate.prototype.clear = function () {
            this.stop();
            nn.ArrayT.Clear(this._steps);
            return this;
        };
        Animate.prototype.stop = function () {
            this._targets.forEach(function (o) {
                egret.Tween.removeTweens(o);
                return true;
            });
        };
        Animate.prototype.next = function (props, duration, tf) {
            this._steps.push({ preprops: {}, props: props, duration: duration, time: tf });
            return this;
        };
        Animate.prototype.to = function (duration, tf, cb, ctx) {
            var a = new nn.Animator();
            cb.call(ctx, a);
            this._steps.push({ preprops: a._preproperties, props: a._properties, duration: duration, time: tf });
            return this;
        };
        Animate.prototype.wait = function (duration, passive) {
            this._steps.push({ preprops: {}, props: {}, duration: duration, time: null, opt: passive });
            return this;
        };
        Animate.prototype.invoke = function (fun, ctx) {
            this._steps.push({ preprops: {}, props: {}, workfun: fun, workctx: ctx, time: null });
            return this;
        };
        Animate.prototype._doPlay = function (reverse) {
            var _this = this;
            var self = this;
            self.__ani_ended = 0;
            // 动画每一步
            self._targets.forEach(function (ui) {
                var tw = egret.Tween.get(ui, { 'loop': self.count < 1 });
                self._steps.forEach(function (step) {
                    var pprops = step.preprops;
                    var props = step.props;
                    // 设置旧值
                    var cntpprops = nn.MapT.Length(pprops);
                    if (cntpprops) {
                        var sets = {};
                        nn.MapT.Foreach(pprops, function (k, v) {
                            if (reverse)
                                v = -v;
                            switch (k) {
                                case 'dx':
                                    sets['x'] = ui.x + v * nn.ScaleFactorW;
                                    break;
                                case 'dy':
                                    sets['y'] = ui.y + v * nn.ScaleFactorH;
                                    break;
                                case 'dsx':
                                    sets['scaleX'] = ui.scaleX + v;
                                    break;
                                case 'dsy':
                                    sets['scaleY'] = ui.scaleY + v;
                                    break;
                                case 'dxs':
                                    sets['x'] = ui.x + ui.width * v;
                                    break;
                                case 'dys':
                                    sets['y'] = ui.y + ui.height * v;
                                    break;
                                case 'alpha':
                                    sets['alpha'] = v;
                                    break;
                                case 'dangle':
                                    sets['rotation'] = ui.rotation + v;
                                    break;
                                default:
                                    sets[k] = ui[k] + v;
                                    break;
                            }
                            return true;
                        });
                        tw.to(sets, 0, null);
                    }
                    // 设置新值
                    var cntprops = nn.MapT.Length(props);
                    if (cntprops) {
                        var sets = {};
                        nn.MapT.Foreach(props, function (k, v) {
                            if (reverse)
                                v = -v;
                            switch (k) {
                                case 'x':
                                    sets['x'] = v * nn.ScaleFactorX + ui.anchorOffsetX;
                                    break;
                                case 'y':
                                    sets['y'] = v * nn.ScaleFactorY + ui.anchorOffsetY;
                                    break;
                                case 'dx':
                                    sets['x'] = ui.x + v * nn.ScaleFactorW;
                                    break;
                                case 'dy':
                                    sets['y'] = ui.y + v * nn.ScaleFactorH;
                                    break;
                                case 'dsx':
                                    sets['scaleX'] = ui.scaleX + v;
                                    break;
                                case 'dsy':
                                    sets['scaleY'] = ui.scaleY + v;
                                    break;
                                case 'dxs':
                                    sets['x'] = ui.x + ui.width * v;
                                    break;
                                case 'dys':
                                    sets['y'] = ui.y + ui.height * v;
                                    break;
                                case 'alpha':
                                    sets['alpha'] = v;
                                    break;
                                case 'dangle':
                                    sets['rotation'] = ui.rotation + v;
                                    break;
                                default:
                                    sets[k] = v;
                                    break;
                            }
                            return true;
                        }, _this);
                        tw.to(sets, step.duration * 1000, step.time);
                    }
                    if (cntpprops == 0 && cntprops == 0) {
                        if (step.duration) {
                            // 如过都是空的，代表等待
                            tw.wait(step.duration * 1000, step.opt);
                        }
                        else if (step.workfun) {
                            // 代表中途回调
                            step.workfun.call(step.workctx);
                        }
                    }
                    // 自动恢复
                    if (self.autoReset && cntprops) {
                        var sets = {};
                        nn.MapT.Foreach(props, function (k, v) {
                            switch (k) {
                                case 'dx':
                                    sets['x'] = ui.x;
                                    break;
                                case 'dy':
                                    sets['y'] = ui.y;
                                    break;
                                case 'dsx':
                                    sets['scaleX'] = ui.scaleX;
                                    break;
                                case 'dsy':
                                    sets['scaleY'] = ui.scaleY;
                                    break;
                                case 'dxs':
                                    sets['x'] = ui.x;
                                    break;
                                case 'dys':
                                    sets['y'] = ui.y;
                                    break;
                                case 'alpha':
                                    sets['alpha'] = ui.alpha;
                                    break;
                                case 'dangle':
                                    sets['rotation'] = ui.rotation;
                                    break;
                                default:
                                    sets[k] = ui[v];
                                    break;
                            }
                            return true;
                        }, _this);
                        tw.to(sets, 0, null);
                    }
                    // end for each tw & target
                }, _this);
                // 监听结束
                tw.call(function (o) {
                    if (++self.__ani_ended == self._targets.size) {
                        // 重置计数器
                        self.__ani_ended = 0;
                        // 一批动画结束
                        self._signals && self._signals.emit(nn.SignalEnd);
                        // 一次动画都结束了
                        if (self.count > 0) {
                            if (++self._firedCount >= self.count) {
                                // 释放所有动画
                                self.stop();
                                // 激发结束
                                self._signals && self._signals.emit(nn.SignalDone);
                                // 检查一下是否需要释放
                                if (self.autoUnbind)
                                    self.unbindAll();
                                if (self.autoDrop)
                                    self = nn.drop(self);
                            }
                            else {
                                // 播放下一次
                                self._doPlay(reverse);
                            }
                        }
                    }
                }, self, [ui]);
            }, self);
        };
        Animate.prototype.play = function (reverse) {
            var self = this;
            self._firedCount = 0;
            var mark = false;
            // 如果存在对象和步数代表可以动画
            if (self._targets.size != 0 || self._steps.length != 0) {
                self._doPlay(reverse);
                mark = true;
            }
            // 如果存在命中的动画需要抛出开始事件
            if (mark && self._signals)
                self._signals.emit(nn.SignalStart);
            return self;
        };
        Animate.prototype.pause = function () {
            if (this._paused)
                return;
            this._paused = true;
            this._targets.forEach(function (o) {
                egret.Tween.pauseTweens(o);
            });
        };
        Animate.prototype.resume = function () {
            if (this._paused == false)
                return;
            this._paused = false;
            this._targets.forEach(function (o) {
                egret.Tween.resumeTweens(o);
            });
        };
        Animate.prototype.isPaused = function () {
            return this._paused;
        };
        Animate.prototype.clone = function () {
            var obj = _super.prototype.clone.call(this);
            obj._targets = nn.SetT.Clone(this._targets);
            obj._steps = nn.ArrayT.Clone(this._steps);
            return obj;
        };
        Animate.Stop = function (tgt) {
            egret.Tween.removeTweens(tgt.handle());
        };
        return Animate;
    }(nn.CAnimate));
    nn.Animate = Animate;
    var Tween = (function (_super) {
        __extends(Tween, _super);
        function Tween() {
            return _super.apply(this, arguments) || this;
        }
        Tween.Get = function (c, props) {
            return egret.Tween.get(c.handle(), props);
        };
        Tween.Stop = function (c) {
            egret.Tween.removeTweens(c.handle());
        };
        return Tween;
    }(nn.CTween));
    nn.Tween = Tween;
    /** 同时播放一堆动画 */
    var Animates = (function (_super) {
        __extends(Animates, _super);
        function Animates() {
            var _this = _super.call(this) || this;
            _this._list = new Array();
            return _this;
        }
        Animates.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        Animates.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalDone);
        };
        Animates.prototype.add = function (ani) {
            this._list.push(ani);
            ani.signals.connect(nn.SignalDone, this._cb_aniend, this);
            return this;
        };
        Animates.prototype.play = function () {
            this._counter = 0;
            this._list.forEach(function (ani) {
                ani.play();
            });
            return this;
        };
        Animates.prototype.complete = function (cb, ctx) {
            this.signals.connect(nn.SignalDone, cb, ctx);
            return this;
        };
        Animates.prototype._cb_aniend = function () {
            if (++this._counter != this._list.length)
                return;
            this.signals.emit(nn.SignalDone);
        };
        return Animates;
    }(nn.SObject));
    nn.Animates = Animates;
    /** 用来接管一组的动画 */
    var AnimateGroup = (function (_super) {
        __extends(AnimateGroup, _super);
        function AnimateGroup() {
            var _this = _super.call(this) || this;
            _this._animates = new Array();
            return _this;
        }
        AnimateGroup.prototype.dispose = function () {
            this.clear();
            _super.prototype.dispose.call(this);
        };
        AnimateGroup.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalDone);
        };
        /** 同时播放 */
        AnimateGroup.prototype.add = function (ani) {
            this._current().add(ani);
            return this;
        };
        /** 之后播放 */
        AnimateGroup.prototype.next = function (ani) {
            this._next().add(ani);
            return this;
        };
        /** 播放动画组 */
        AnimateGroup.prototype.play = function () {
            var _this = this;
            if (this._animates.length == 0) {
                this._signals && this._signals.emit(nn.SignalDone);
                this.drop();
                return;
            }
            var first = this._animates[0];
            var last = this._animates[this._animates.length - 1];
            last.complete(function () {
                _this._signals && _this._signals.emit(nn.SignalDone);
                _this.drop();
            }, this);
            first.play();
            return this;
        };
        AnimateGroup.prototype.complete = function (cb, ctx) {
            this.signals.connect(nn.SignalDone, cb, ctx);
            return this;
        };
        AnimateGroup.prototype.clear = function () {
            nn.ArrayT.Clear(this._animates, function (as) {
                as.drop();
            });
        };
        AnimateGroup.prototype._current = function () {
            if (this.__current)
                return this.__current;
            this.__current = new Animates();
            this._animates.push(this.__current);
            return this.__current;
        };
        AnimateGroup.prototype._next = function () {
            var old = this.__current;
            this.__current = new Animates();
            if (old)
                old.complete(this.__current.play, this.__current);
            this._animates.push(this.__current);
            return this.__current;
        };
        return AnimateGroup;
    }(nn.SObject));
    nn.AnimateGroup = AnimateGroup;
    /** 多个UI之间的过渡动画
     */
    var Transition = (function (_super) {
        __extends(Transition, _super);
        function Transition(a, d) {
            var _this = _super.call(this) || this;
            _this._ani_step = 0;
            _this._ani_cnt = 0;
            _this.appear = a;
            _this.disappear = d;
            return _this;
        }
        Transition.prototype.dispose = function () {
            this.appear = undefined;
            this.disappear = undefined;
            _super.prototype.dispose.call(this);
        };
        Transition.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalDone);
        };
        Transition.prototype.play = function (appear, disappear) {
            this._ani_step = 0;
            this._ani_cnt = 0;
            // 先修改成直接play，而不是把play合到一个地方，简化一下写法，业务中如过用到了transition，一般是不是播放一个0持续的动画
            if (this.appear && appear) {
                ++this._ani_cnt;
                var ani = this.appear.clone();
                ani.signals.connect(nn.SignalDone, this.__cbani_end, this);
                ani.bind(appear).play(this.reverse);
            }
            if (this.disappear && disappear) {
                ++this._ani_cnt;
                var ani = this.disappear.clone();
                ani.signals.connect(nn.SignalDone, this.__cbani_end, this);
                ani.bind(disappear).play(this.reverse);
            }
            // 没有可用的动画直接代表完成
            if (this._ani_cnt == 0) {
                this.signals.emit(nn.SignalDone);
                // 完成即释放
                this.drop();
            }
        };
        Transition.prototype.__cbani_end = function () {
            ++this._ani_step;
            if (this._ani_step == this._ani_cnt) {
                // 释放绑定的动画的链接
                if (this.appear) {
                    this.appear.signals.disconnect(nn.SignalDone, this.__cbani_end, this);
                    this.appear.unbindAll();
                }
                if (this.disappear) {
                    this.disappear.signals.disconnect(nn.SignalDone, this.__cbani_end, this);
                    this.disappear.unbindAll();
                }
                // 完成所有的动画
                this.signals.emit(nn.SignalDone);
                // 完成即释放
                this.drop();
            }
        };
        return Transition;
    }(nn.SObject));
    nn.Transition = Transition;
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 堆栈类，作为具有层级结构的基类使用
        push/pop 等操作因为业务通常会连着用，避免连续多个引发问题，所以实现放倒队列中进行
    */
    var ViewStack = (function (_super) {
        __extends(ViewStack, _super);
        function ViewStack() {
            var _this = _super.call(this) || this;
            // 是否可以弹出根页面
            _this.rootPopable = false;
            // viewstack的很多动作不能无序操作，所以需要通过队列管理起来
            _this._opers = new nn.OperationQueue();
            // 每一个子页面，有可能是实体，有可能是通过Instance提供的类
            _this._views = new Array();
            return _this;
        }
        ViewStack.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalSelectionChanged);
        };
        ViewStack.prototype.dispose = function () {
            // 清除页面
            nn.ArrayT.Clear(this._views, function (p) {
                if (p.isnull() == false && p.obj.parent == null) {
                    p.drop();
                }
            }, this);
            this._topView = null;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(ViewStack.prototype, "topView", {
            get: function () {
                return this._topView;
            },
            set: function (page) {
                nn.fatal("请使用index来设置当前页面");
            },
            enumerable: true,
            configurable: true
        });
        // 为了支持复用实体，所以去除掉topview ＝＝ page 的判断
        ViewStack.prototype.setTopView = function (page, animated) {
            if (animated === void 0) { animated = true; }
            if (page == null)
                return null;
            if (nn.ISDEBUG && this._views.indexOf(page) == -1) {
                nn.fatal("不能设置一个不属于当前Stack的页面为 Top");
                return null;
            }
            var now;
            var old = this._topView ? this._topView.obj : null;
            // 判断page是不是还没有实例化
            if (page.isnull()) {
                // 使用 Instance 初始化
                now = page.obj;
                this._addPage(page, true);
            }
            else {
                now = page.obj;
                if (now.parent == null)
                    this.addChild(now);
                else
                    now.setNeedsAppear();
            }
            this._topView = page;
            // 切换两个页面
            this.swapPages(now, old, animated);
            return old;
        };
        ViewStack.prototype.swapPages = function (now, old, animated) {
            var _this = this;
            // 需要刷新一下数据
            now.updateData();
            this.setPageFrame(now);
            now.visible = true;
            if (old) {
                // 先抛出事件
                this._emitSelectionChanged(now, old);
                now.signals.emit(nn.SignalSelected);
                // 制作动画
                var anicomp = void 0;
                if (old == now) {
                    anicomp = function () {
                        // 下一步
                        _this._opers.next();
                    };
                }
                else {
                    anicomp = function () {
                        // 隐藏掉老的
                        old.visible = false;
                        old.onDisappeared();
                        old.signals.emit(nn.SignalDeselected);
                        // 下一步
                        _this._opers.next();
                    };
                }
                if (animated) {
                    if (old == now) {
                        this.transiting(null, now, false, anicomp);
                    }
                    else {
                        this.transiting(old, now, false, anicomp);
                    }
                }
                else {
                    anicomp();
                }
            }
            else {
                // 外抛事件
                this._emitSelectionChanged(now, old);
                now.signals.emit(nn.SignalSelected);
                // 下一步
                this._opers.next();
            }
        };
        // 发送选中变化的信号，因为viewstack通常需要被继承实现更复杂的功能，所以导致选中的信号除了now\old外还要附加其他数据，所以开放供子类修改
        ViewStack.prototype._emitSelectionChanged = function (now, old) {
            if (this._signals)
                this._signals.emit(nn.SignalSelectionChanged, { now: now, old: old });
        };
        ViewStack.prototype.removeChild = function (c) {
            if (c == this._topView) {
                if (this._views.length > 1)
                    nn.warn("直接移除 topView 会对 ViewStack 产生风险");
                this._topView = undefined;
            }
            _super.prototype.removeChild.call(this, c);
        };
        ViewStack.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            if (this._topView)
                this.setPageFrame(this._topView.obj);
        };
        // 设置页面的大小
        ViewStack.prototype.setPageFrame = function (page) {
            var rc = this.bounds();
            page.frame = rc;
        };
        ViewStack.prototype.setViews = function (arr) {
            var _this = this;
            if (arr == this._views)
                return;
            this.clear();
            arr.forEach(function (page) {
                // 添加到页面数组中
                _this._views.push(page);
                // 默认都不显示
                if (page.isnull() == false) {
                    var p = page.obj;
                    p.visible = false;
                    _this._addPage(page, false);
                }
            }, this);
        };
        ViewStack.prototype.push = function (page, animated) {
            if (animated === void 0) { animated = true; }
            if (page == null) {
                nn.warn("不能推入一个null页面");
                return false;
            }
            if (nn.ArrayT.Contains(this._views, page)) {
                nn.warn("不能重复推入页面");
                return false;
            }
            this._opers.add(new nn.OperationCall(this._doPush, this, [page, animated]));
            return true;
        };
        ViewStack.prototype._doPush = function (page, animated) {
            if (animated === void 0) { animated = true; }
            this._views.push(page);
            // 直接推入的页面不能位于views之中，所以也就不存在已经是child的问题
            var now = page.obj;
            var old = this._topView ? this._topView.obj : null;
            this._addPage(page, true);
            this._topView = page;
            // 切换两个页面
            this.swapPages(now, old, animated);
        };
        ViewStack.prototype._addPage = function (page, aschild) {
            var p = page.obj;
            p.viewStack = this;
            p.signals.register(nn.SignalSelected);
            p.signals.register(nn.SignalDeselected);
            if (aschild)
                this.addChild(p);
        };
        ViewStack.prototype.pop = function (page, animated) {
            if (page === void 0) { page = null; }
            if (animated === void 0) { animated = true; }
            if (this._views.length == 0)
                return false;
            if (!this.rootPopable && this._views.length == 1)
                return false;
            if (page == null)
                page = this.topView;
            var idx = this._views.indexOf(page);
            if (idx == -1) {
                nn.fatal("不能弹出不属于Stack的页面");
                return false;
            }
            this._opers.add(new nn.OperationCall(this._doPop, this, [page, animated]));
            return true;
        };
        ViewStack.prototype._doPop = function (page, animated) {
            var _this = this;
            var idx = this._views.indexOf(page);
            var prev = page.obj;
            // 如过相等，则直接移除，但是因为是top的改变，需要加上动画处理
            if (this.topView == page) {
                this._topView = this._views[idx - 1];
                var now = void 0;
                if (this._topView) {
                    now = this._topView.obj;
                    now.visible = true;
                    now.setNeedsAppear();
                    // 发送事件
                    this._emitSelectionChanged(now, null);
                    now.signals.emit(nn.SignalSelected);
                }
                var fun = function () {
                    // 隐藏之前
                    prev.onDisappeared();
                    prev.signals.emit(nn.SignalDeselected);
                    // 直接移除
                    _this.removeChild(prev);
                    // 下一步
                    _this._opers.next();
                };
                if (animated) {
                    this.transiting(prev, now, true, fun);
                }
                else {
                    fun();
                }
            }
            else {
                this.removeChild(prev);
                // 下一步
                this._opers.next();
            }
            nn.ArrayT.RemoveObjectAtIndex(this._views, idx);
        };
        ViewStack.prototype.popTo = function (page, animated) {
            if (animated === void 0) { animated = true; }
            var idx; // 跳转到指定序号            
            var to; // 跳转到指定页面
            if (typeof (page) == 'number') {
                idx = page;
                to = this._views[idx];
            }
            else {
                to = page;
                idx = this._views.indexOf(to);
            }
            var curidx = this._views.indexOf(this._topView);
            if (idx < 0 || idx >= curidx || to == null)
                return false;
            this._opers.add(new nn.OperationCall(this._doPopTo, this, [idx, curidx, animated]));
            return true;
        };
        ViewStack.prototype._doPopTo = function (idx, curidx, animated) {
            var _this = this;
            if (animated === void 0) { animated = true; }
            nn.ArrayT.RemoveObjectsByFilter(this._views, function (o, i) {
                if (i > idx && i < curidx) {
                    // 移除不显示的
                    var pop = o.obj;
                    pop.onDisappeared();
                    pop.signals.emit(nn.SignalDeselected);
                    _this.removeChild(pop);
                    return true;
                }
                return false;
            }, this);
            this._doPop(this._topView, animated);
        };
        ViewStack.prototype.popToRoot = function (animated) {
            if (animated === void 0) { animated = true; }
            this.popTo(0, animated);
        };
        ViewStack.prototype.clear = function () {
            var _this = this;
            nn.ArrayT.Clear(this._views, function (p) {
                if (p.isnull() == false) {
                    if (p.obj.parent == null)
                        p.drop();
                    else
                        _this.removeChild(p.obj);
                }
            }, this);
            this._topView = null;
        };
        ViewStack.prototype.transiting = function (from, to, reverse, cb, ctx) {
            var _this = this;
            var ts = this.transitionObject;
            var tsapr = ts ? ts.appear : null;
            var tsdis = ts ? ts.disappear : null;
            var tsfrom = from ? from.transitionObject : null;
            if (tsfrom)
                tsdis = tsfrom.disappear;
            var tsto = to ? to.transitionObject : null;
            if (tsto)
                tsapr = tsto.appear;
            var t = new nn.Transition(tsapr, tsdis);
            t.reverse = reverse;
            var oldte = this.touchChildren;
            this.touchChildren = false;
            t.signals.connect(nn.SignalDone, function () {
                _this.touchChildren = oldte;
                if (cb)
                    cb.call(ctx ? ctx : _this);
            }, this);
            t.play(to, from);
            return t;
        };
        return ViewStack;
    }(nn.Component));
    nn.ViewStack = ViewStack;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var CScrollView = (function (_super) {
        __extends(CScrollView, _super);
        function CScrollView(cnt) {
            var _this = _super.call(this) || this;
            /** 指示条是否嵌入页面中，否则浮在页面上 */
            _this.floatingIdentifier = true;
            /** 滚动的偏移 */
            _this._contentOffset = new nn.Point();
            if (cnt)
                _this.contentView = cnt;
            return _this;
        }
        CScrollView.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalScrollBegin);
            this._signals.register(nn.SignalScrollEnd);
            this._signals.register(nn.SignalScrolled);
        };
        Object.defineProperty(CScrollView.prototype, "contentOffset", {
            get: function () {
                return this._contentOffset;
            },
            set: function (pt) {
                this.setContentOffset(pt, 0);
            },
            enumerable: true,
            configurable: true
        });
        /** 带动画的偏移
            @note 注意会引起 ScrollEnd 的消息
         */
        CScrollView.prototype.setContentOffset = function (pt, duration) {
            this._contentOffset = pt;
        };
        CScrollView.prototype.setContentOffsetX = function (v, duration) {
            var pt = new nn.Point(v, this._contentOffset.y);
            this.setContentOffset(pt, duration);
        };
        CScrollView.prototype.setContentOffsetY = function (v, duration) {
            var pt = new nn.Point(this._contentOffset.x, v);
            this.setContentOffset(pt, duration);
        };
        /** 当滚动 */
        CScrollView.prototype.onPositionChanged = function () {
            if (this._signals)
                this._signals.emit(nn.SignalScrolled);
        };
        /** 停止滚动 */
        CScrollView.prototype.stopDecelerating = function () { };
        /** 使用scroll包裹一个空间来滑动 */
        CScrollView.Wrapper = function (ui) {
            var cls = nn.ObjectClass(this);
            var scl = new cls(ui);
            // 内容改变时刷新
            if (ui instanceof nn.CBitmap ||
                ui instanceof nn.CLabel) {
                ui.signals.redirect(nn.SignalChanged, nn.SignalConstriantChanged);
            }
            var rc = ui.bestFrame();
            scl.contentSize = rc.size;
            ui.signals.connect(nn.SignalConstriantChanged, function () {
                var bst;
                if (ui instanceof nn.CLabel) {
                    var lbl = ui;
                    var cnt = scl.boundsForContent();
                    if (lbl.multilines)
                        bst = ui.bestFrame(new nn.Rect(0, 0, cnt.width, 0));
                    else
                        bst = ui.bestFrame(new nn.Rect(0, 0, 0, cnt.height));
                }
                else {
                    bst = ui.bestFrame();
                }
                scl.contentSize = bst.size;
            }, this);
            return scl;
        };
        return CScrollView;
    }(nn.Component));
    nn.CScrollView = CScrollView;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget() {
            var _this = _super.call(this) || this;
            _this.touchChildren = false;
            return _this;
        }
        Widget.prototype.hitTest = function (x, y) {
            if (this.touchEnabled == false)
                return null;
            return _super.prototype.hitTest.call(this, x, y);
        };
        return Widget;
    }(nn.Component));
    nn.Widget = Widget;
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite() {
            return _super.call(this) || this;
        }
        Sprite.prototype.reuse = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            if (this._reuseUis == null)
                this._reuseUis = new KvObject();
            var obj = this._reuseUis[params[0]];
            if (obj == null) {
                if (params.length == 3) {
                    obj = params[1].call(params[2]);
                }
                else if (params.length == 2) {
                    var o = params[1];
                    if (typeof (o) == 'function')
                        obj = new params[1]();
                    else
                        obj = o;
                }
                if (obj) {
                    if (obj instanceof nn.CComponent)
                        this.addChild(obj);
                    this._reuseUis[params[0]] = obj;
                }
            }
            return obj;
        };
        return Sprite;
    }(nn.Component));
    nn.Sprite = Sprite;
    var SpriteWrapper = (function (_super) {
        __extends(SpriteWrapper, _super);
        function SpriteWrapper(cnt) {
            var _this = _super.call(this) || this;
            if (cnt)
                _this.contentView = cnt;
            return _this;
        }
        SpriteWrapper.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.contentView = null;
        };
        Object.defineProperty(SpriteWrapper.prototype, "contentView", {
            get: function () {
                return this._contentView;
            },
            set: function (cnt) {
                if (this._contentView == cnt)
                    return;
                if (this._contentView) {
                    this.removeChild(this._contentView);
                }
                this._contentView = cnt;
                if (this._contentView) {
                    this.addChild(this._contentView);
                }
            },
            enumerable: true,
            configurable: true
        });
        SpriteWrapper.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            if (this._contentView)
                this._contentView.frame = this.boundsForLayout();
        };
        return SpriteWrapper;
    }(nn.Component));
    nn.SpriteWrapper = SpriteWrapper;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var Navigation = (function (_super) {
        __extends(Navigation, _super);
        function Navigation() {
            return _super.call(this) || this;
        }
        Navigation.prototype._addPage = function (page, aschild) {
            var _this = this;
            var p = page.obj;
            p.signals.register(nn.SignalRequestClose);
            p.signals.connect(nn.SignalRequestClose, function () {
                _this.pop();
            }, this);
            _super.prototype._addPage.call(this, page, aschild);
        };
        Object.defineProperty(Navigation.prototype, "pages", {
            get: function () {
                return this._views;
            },
            set: function (v) {
                nn.fatal("不能直接设置navi的pages");
            },
            enumerable: true,
            configurable: true
        });
        return Navigation;
    }(nn.ViewStack));
    nn.Navigation = Navigation;
    /** 用来进行导航的过渡特效，推进和推出 */
    var TransitionNavigation = (function (_super) {
        __extends(TransitionNavigation, _super);
        function TransitionNavigation(duration) {
            if (duration === void 0) { duration = nn.Animate.Duration; }
            var _this = _super.call(this) || this;
            var ani = new nn.Animate();
            ani.autoReset = true;
            ani.inTo(duration, function (ani) {
                ani.backMode = true;
                ani.stranslate(new nn.Point(-1, 0));
            });
            _this.appear = ani;
            ani = new nn.Animate();
            ani.autoReset = true;
            ani.outTo(duration, function (ani) {
                ani.stranslate(new nn.Point(-1, 0));
            });
            _this.disappear = ani;
            return _this;
        }
        return TransitionNavigation;
    }(nn.Transition));
    nn.TransitionNavigation = TransitionNavigation;
    /** 淡入淡出交替的过渡特效 */
    var TransitionFade = (function (_super) {
        __extends(TransitionFade, _super);
        function TransitionFade(duration) {
            if (duration === void 0) { duration = nn.Animate.Duration; }
            var _this = _super.call(this) || this;
            var ani = new nn.Animate();
            ani.autoReset = true;
            ani.inTo(duration, function (ani) {
                ani.backMode = true;
                ani.fadeIn();
            });
            _this.appear = ani;
            ani = new nn.Animate();
            ani.autoReset = true;
            ani.outTo(duration, function (ani) {
                ani.fadeOut();
            });
            _this.disappear = ani;
            return _this;
        }
        return TransitionFade;
    }(nn.Transition));
    nn.TransitionFade = TransitionFade;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var _GameLayer = (function (_super) {
        __extends(_GameLayer, _super);
        function _GameLayer() {
            return _super.apply(this, arguments) || this;
        }
        Object.defineProperty(_GameLayer.prototype, "root", {
            get: function () {
                return this.topView.obj;
            },
            set: function (spr) {
                this.push(spr);
            },
            enumerable: true,
            configurable: true
        });
        return _GameLayer;
    }(nn.Navigation));
    nn._GameLayer = _GameLayer;
    var _DesktopLayer = (function (_super) {
        __extends(_DesktopLayer, _super);
        function _DesktopLayer() {
            return _super.apply(this, arguments) || this;
        }
        return _DesktopLayer;
    }(nn.Sprite));
    nn._DesktopLayer = _DesktopLayer;
    var CApplication = (function (_super) {
        __extends(CApplication, _super);
        function CApplication() {
            var _this = _super.call(this) || this;
            /** 用来重新定义弹出文字框 */
            _this.clazzHudText = new nn.Class(nn.HudText);
            /** 用来重新定义弹出的等待框 */
            _this.clazzHudProgress = new nn.Class(nn.HudProgress);
            /** 用来实现实时资源加载进度的类 */
            _this.clazzResourceProgress = new nn.Class();
            /** 用来实现首页加载进度的类 */
            _this.clazzLoadingScene = new nn.Class(nn.LoadingScreen);
            _this.reqResources = [];
            /** 打开 app 所使用的地址 */
            _this.url = new nn.URL(Js.siteUrl);
            /** 版本号 */
            _this.version = nn.APPVERSION;
            /** 图标 */
            _this.icon = nn.APPICON;
            /** 默认资源 */
            _this.resourceFile = "default.res.json";
            /** 默认主题资源 */
            _this.themeFile = "default.thm.json";
            /** 默认数据资源 */
            _this.dataFile = "default.data.js";
            /** 默认项目配置 */
            _this.configFile = "app.json";
            /** 游戏的代号 */
            _this._identifier = '::n2';
            /** 程序中使用的默认字体 */
            _this.fontFamily = nn.FontsManager.font("黑体");
            // 当加入到场景中后开始加载资源、页面
            _this.signals.connect(nn.SignalAddedToStage, _this.__app_addedtostage, _this);
            // 控制全局的点击
            _this.signals.connect(nn.SignalPreTouch, _this.__app_pretouch, _this);
            _this.signals.connect(nn.SignalPreClick, _this.__app_preclick, _this);
            // 屏幕方向变化
            nn.Device.shared.signals.connect(nn.SignalOrientationChanged, _this.__app_orientationchanged, _this);
            // 设置资源的根目录
            nn.ResManager.directory = "resource";
            return _this;
        }
        /** 预加载的资源 */
        CApplication.prototype.getReqResources = function () {
            return this.reqResources;
        };
        CApplication.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalLoaded);
            this._signals.register(nn.SignalActivated);
            this._signals.register(nn.SignalDeactivated);
            this._signals.register(nn.SignalFrameChanged);
            this._signals.register(nn.SignalException);
        };
        Object.defineProperty(CApplication.prototype, "versioninfo", {
            /** 版本信息 */
            get: function () {
                var r = [this.version];
                if (nn.ISDEBUG && app.debug) {
                    r.push(new nn.DateTime(app.debug.BUILDDATE).toString('yyyy/M/d HH:mm:ss'));
                }
                return r.join(' ');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CApplication.prototype, "identifier", {
            get: function () {
                return this._identifier;
            },
            set: function (v) {
                if (this._identifier == v)
                    return;
                this._identifier = v;
                nn.Storage.shared.prefix = v;
            },
            enumerable: true,
            configurable: true
        });
        // 当app添加到舞台后开始默认资源的加载
        CApplication.prototype.__app_addedtostage = function () {
            var _this = this;
            // 是否是同一个类
            nn.RESOURCELOADINGISHUD = this.clazzResourceProgress.isEqual(this.clazzHudProgress);
            // 初始化默认的游戏层
            this._gameLayer = new _GameLayer();
            this._desktopLayer = new _DesktopLayer();
            this.addChild(this._gameLayer);
            this.addChild(this._desktopLayer);
            // 预加载流程
            var queue = new nn.OperationQueue();
            queue.autoMode = false;
            var queuegrp = new nn.OperationGroup();
            this._preloadConfig(queuegrp);
            queue.add(queuegrp);
            queue.add(new nn.OperationClosure(function () {
                // 绑定app的句柄
                CApplication.shared = _this;
                // 读取预定义
                nn.ResManager.cacheEnabled = nn.val(_this.config['resource.gc'], true);
                // 需要启动预启动的定时器
                if (nn.CTimer.SAFE_TIMER_ENABLED) {
                    nn.CTimer.SAFE_TIMER_ENABLED = false;
                    nn.SetT.Clear(nn.CTimer.SAFE_TIMERS, function (tmr) {
                        tmr.start();
                    });
                }
                // 模拟一次初始化的切到前台的操作
                _this.onActivated();
                // 设置背景填充
                if (_this.backgroundImagePattern)
                    nn.Dom.style.backgroundImage = "url(" + nn.ResManager.getResUrl(_this.backgroundImagePattern) + ")";
                // 启动处理
                var opers = CApplication._OPERATIONS.remove('boot');
                opers && opers.forEach(function (fn) {
                    fn();
                });
                // 隐藏接入平台的loading
                var cnt = new nn.svc.LoadingContent(100, 100);
                nn.ServicesManager.fetch(cnt, function () { });
                // 如果当前显示着 launch 页面，则需要移除
                var launchdiv = document.getElementById('launchDiv');
                if (launchdiv)
                    launchdiv.parentElement.removeChild(launchdiv);
                // 加载 loading 页面
                _this._loadingScreen = _this.clazzLoadingScene.instance();
                // 该信号负责加载起主业务界面
                _this._loadingScreen.signals.connect(nn.SignalDone, _this._cbLoadingComplete, _this);
                // 该信号用来加载默认依赖资源组
                _this._loadingScreen.signals.connect(nn.SignalStart, _this.onLoadingScreenStart, _this);
                // 显示加载页面
                _this.addChild(_this._loadingScreen);
            }, this));
            // 开始启动队列
            queue.tryrun();
        };
        /** 延期加载的capsules */
        CApplication.prototype.capsules = function (reqs) {
            var c = [new nn.ResourceEntity(nn.ResManager.directory + this.dataFile + '?v=' + this.version, nn.ResType.JSREF)];
            var r = nn.ResManager.capsules(reqs.concat(c));
            // 加载成功后，激发dataloaded的处理
            r.signals.connect(nn.SignalDone, function () {
                var opers = CApplication._OPERATIONS.remove('data');
                opers && opers.forEach(function (fn) {
                    fn();
                });
            }, this);
            return r;
        };
        // 预加载队列
        CApplication.prototype._preloadConfig = function (oper) {
            var _this = this;
            // 加载资源文件
            oper.add(new nn.OperationClosure(function (oper) {
                var res = _this.resourceFile + '?v=' + _this.version;
                nn.ResManager.loadConfig(res, function () {
                    oper.done();
                }, _this);
            }, this));
            // 加载配置文件
            oper.add(new nn.OperationClosure(function (oper) {
                var cfg = _this.configFile + '?v=' + _this.version;
                nn.ResManager.getResByUrl(cfg, nn.ResPriority.NORMAL, function (obj) {
                    _this.config = obj.val;
                    // 如果需要处理debug的config文件
                    if (app.debug.CONFIG) {
                        nn.ResManager.getResByUrl('~debug.json', nn.ResPriority.NORMAL, function (obj) {
                            var cfg = obj.val;
                            Object.keys(cfg).forEach(function (e) {
                                _this.config[e] = cfg[e];
                            });
                            oper.done();
                        }, _this, nn.ResType.JSON);
                    }
                    else {
                        oper.done();
                    }
                }, _this, nn.ResType.JSON);
            }, this));
        };
        // 开始加载资源
        CApplication.prototype.onLoadingScreenStart = function () {
            // 加载默认的资源组
            var grp = nn.ResManager.capsules(this.getReqResources());
            grp.signals.connect(nn.SignalChanged, this._cbResLoadChanged, this);
            grp.load(this._cbResLoadCompleted, this);
        };
        // 资源加载的进度变化
        CApplication.prototype._cbResLoadChanged = function (s) {
            this._loadingScreen.progressValue = s.data;
        };
        // 资源加载成功
        CApplication.prototype._cbResLoadCompleted = function () {
            if (this._loadingScreen) {
                this._loadingScreen.complete();
            }
            else {
                this._cbLoadingComplete();
            }
        };
        // 所有资源加载完成，开始加载主场景
        CApplication.prototype._cbLoadingComplete = function () {
            // 初始化场景
            this.onLoaded();
            // 移除 loading 页面
            this._loadingScreen.removeFromParent();
            this._loadingScreen = null;
        };
        CApplication.prototype.onLoaded = function () {
            nn.log("加载应用业务");
            this.signals.emit(nn.SignalLoaded);
        };
        Object.defineProperty(CApplication.prototype, "gameLayer", {
            get: function () {
                return this._gameLayer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CApplication.prototype, "desktopLayer", {
            get: function () {
                return this._desktopLayer;
            },
            enumerable: true,
            configurable: true
        });
        CApplication.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            var rc = this.bounds();
            this._gameLayer.setFrame(rc);
            this._desktopLayer.setFrame(rc);
            if (this._loadingScreen)
                this._loadingScreen.setFrame(rc);
        };
        Object.defineProperty(CApplication.prototype, "viewStack", {
            get: function () {
                return this._gameLayer;
            },
            set: function (v) {
                nn.fatal('不能设置 Application 的 viewStack');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CApplication.prototype, "uniqueId", {
            get: function () {
                if (this._uniqueId)
                    return this._uniqueId;
                var id = nn.Storage.shared.value("::n2::app::uid");
                if (id == null) {
                    id = this.generateUniqueId();
                    nn.Storage.shared.set("::n2::app::uid", id);
                    this._uniqueId = id;
                }
                else {
                    this._uniqueId = id;
                }
                return this._uniqueId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CApplication.prototype, "idfa", {
            get: function () {
                if (this._idfa)
                    return this._idfa;
                var ds = [navigator.appName, navigator.vendor, navigator.platform, navigator.product,];
                this._idfa = nn.StringT.Hash(ds.join("#")).toString();
                return this._idfa;
            },
            enumerable: true,
            configurable: true
        });
        /** 基于唯一标示的用户数据 */
        CApplication.prototype.uniqueKey = function (key) {
            return this.uniqueId + '/' + key;
        };
        /** 期望的尺寸，返回 null，则代表使用当前屏幕的尺寸 */
        CApplication.BestFrame = function () {
            return null;
        };
        /** 是否使用webgl */
        CApplication.UseWebGl = function () {
            return false;
        };
        /** 应用的主方向 */
        CApplication.Orientation = function () {
            if (typeof (document_orientation) == 'undefined')
                document_orientation = 0;
            return document_orientation;
        };
        /** 是否使用屏幕尺寸
            4种样式: 使用屏幕尺寸、使用设计尺寸、使用设计尺寸适配屏幕尺寸、使用设计尺寸填充屏幕尺寸，对应于 STRETCH、CENTER、ASSTRETCH、ASFILL
         */
        CApplication.ScreenFillMode = function () {
            return nn.FillMode.CENTER;
        };
        /** 屏幕的物理缩放比例
            @note 如果业务是根据720*1280来设计，如果发现跑的慢，需要修改一下设计尺寸，但是所有布局已经按照720*1280来编码，此时已经不容重新修改布局代码，通过该参数就可以控制重新按照缩放后的分辨率来布局
        */
        CApplication.ScreenScale = function () {
            return 1;
        };
        /** 应用支持的特性 */
        CApplication.Features = function () {
            return nn.FrameworkFeature.DEFAULT;
        };
        /** 生成唯一标示 */
        CApplication.prototype.generateUniqueId = function () {
            return Js.uuid(16, 16);
        };
        CApplication.prototype.__app_preclick = function (s) {
            // 检查是否需要激活全屏模式
            if (CApplication.NeedFullscreen) {
                CApplication.NeedFullscreen = false;
                this.enterFullscreen();
            }
            var t = s.data;
            // 处理被镂空的desktop
            var dsk = nn.ArrayT.Top(nn.Desktop._AllNeedFilters);
            if (dsk) {
                // 如果 desk 位于最上方，则需要处理
                var top_1 = nn.ArrayT.Top(nn.Desktop._AllOpenings);
                if (dsk == top_1) {
                    var pt = t.positionInView(dsk);
                    var ht = dsk.hitTestInFilters(pt);
                    if (ht == null)
                        t.cancel();
                    else
                        dsk.signals.emit(nn.SignalHitTest, ht);
                }
            }
        };
        CApplication.prototype.__app_pretouch = function (s) {
            var t = s.data;
            // 处理被镂空的desktop
            var dsk = nn.ArrayT.Top(nn.Desktop._AllNeedFilters);
            if (dsk) {
                var top_2 = nn.ArrayT.Top(nn.Desktop._AllOpenings);
                if (dsk == top_2) {
                    var pt = t.positionInView(dsk);
                    var ht = dsk.hitTestInFilters(pt);
                    if (ht == null)
                        t.cancel();
                }
            }
        };
        /** 进入全屏模式 */
        CApplication.prototype.enterFullscreen = function () {
            if (nn.ISNATIVE || this.isFullscreen)
                return;
            Js.enterFullscreen(document.body);
        };
        /** 推出全屏模式 */
        CApplication.prototype.exitFullscreen = function () {
            if (nn.ISNATIVE || !this.isFullscreen)
                return;
            Js.exitFullscreen();
        };
        Object.defineProperty(CApplication.prototype, "isFullscreen", {
            get: function () {
                if (nn.ISNATIVE)
                    return true;
                return Js.isFullscreen();
            },
            enumerable: true,
            configurable: true
        });
        CApplication.prototype.onActivated = function () {
            nn.log("应用激活");
            // 恢复切换到后台时暂停的声音
            nn.SoundManager.background._app_actived();
            this.isActivating = true;
            this.signals.emit(nn.SignalActivated);
        };
        CApplication.prototype.onDeactived = function () {
            nn.log("应用切换到后台");
            // 暂停背景声音
            nn.SoundManager.background._app_deactived();
            this.isActivating = false;
            this.signals.emit(nn.SignalDeactivated);
        };
        CApplication.prototype.restart = function () {
            if (this.__restarting)
                return;
            this.__restarting = true;
            // 使用平台的重新加载
            nn.ServicesManager.fetch(new nn.svc.LogoutContent());
        };
        CApplication.prototype.__app_orientationchanged = function (e) {
            nn.log("方向变化");
        };
        /** 启动过程中执行 */
        CApplication.InBoot = function (fn) {
            this._OPERATIONS.add('boot', fn);
        };
        /** 加载过程中执行 */
        CApplication.InData = function (fn) {
            this._OPERATIONS.add('data', fn);
        };
        return CApplication;
    }(nn.Sprite));
    CApplication._OPERATIONS = new nn.MultiMap();
    nn.CApplication = CApplication;
})(nn || (nn = {}));
(function (nn) {
    var loader;
    (function (loader) {
        // 绑定异常处理
        var doException = function (msg, url, line) {
            // 判断是不是自己的js引起的
            if (url.indexOf(location.host + location.pathname) == -1)
                return;
            // 只有debug模式才提示异常
            var content = ["遇到一个未处理的错误:", msg, url, 'L' + line].join('\n');
            if (nn.ISDEBUG)
                alert(content);
            else
                console.warn(content);
            // 发出信号，可以用来监听
            if (nn.CApplication.shared) {
                nn.CApplication.shared.signals.emit(nn.SignalException, new nn.Failed(-1, msg, url));
            }
        };
        // 默认只让测试版会监控未知错误
        window.onerror = doException;
        // 为了保证框架的实例化不依赖于生成的js加载顺序，提供当框架所有js都加载后才运行的函数
        var _LOADED_OPERATIONS = new Array();
        function InBoot(fn) {
            _LOADED_OPERATIONS.push(fn);
        }
        loader.InBoot = InBoot;
        // 执行加载的动作
        function InvokeBoot() {
            _LOADED_OPERATIONS.forEach(function (e) {
                e();
            });
            _LOADED_OPERATIONS.length = 0;
        }
        loader.InvokeBoot = InvokeBoot;
    })(loader = nn.loader || (nn.loader = {}));
})(nn || (nn = {}));
// 底层维护的debug状态都放到这个ns里面，避免每次用的时候都需要判断exist
var app;
(function (app) {
    var debug;
    (function (debug) {
    })(debug = app.debug || (app.debug = {}));
})(app || (app = {}));
var nn;
(function (nn) {
    var ObjectReference = (function () {
        function ObjectReference() {
        }
        return ObjectReference;
    }());
    nn.ObjectReference = ObjectReference;
    function ObjectPrototype(o) {
        if (o == null)
            return null;
        var p = o['prototype'];
        return p ? p : o['__proto__'];
    }
    function ObjectClass(o) {
        if (o == null)
            return Object;
        return ObjectPrototype(o)['constructor'];
    }
    nn.ObjectClass = ObjectClass;
    function Classname(cls) {
        return ObjectPrototype(cls)['__class__'];
    }
    nn.Classname = Classname;
    function SuperClass(o) {
        return ObjectPrototype(ObjectPrototype(o));
    }
    nn.SuperClass = SuperClass;
    function IsInherit(type, parent) {
        var c = ObjectPrototype(type);
        var t = ObjectPrototype(parent);
        while (c && c != t) {
            c = ObjectPrototype(c); //js的特殊性
        }
        return !!(c && c == t);
    }
    nn.IsInherit = IsInherit;
    /** 带参数的实例化对象 */
    function NewObject(cls, p) {
        var len = p.length;
        if (len == 0)
            return new cls();
        if (len == 1)
            return new cls(p[0]);
        if (len == 2)
            return new cls(p[0], p[1]);
        if (len == 3)
            return new cls(p[0], p[1], p[2]);
        if (len == 4)
            return new cls(p[0], p[1], p[2], p[3]);
        if (len == 5)
            return new cls(p[0], p[1], p[2], p[3], p[4]);
        if (len == 6)
            return new cls(p[0], p[1], p[2], p[3], p[4], p[5]);
        if (len == 7)
            return new cls(p[0], p[1], p[2], p[3], p[4], p[5], p[6]);
        if (len == 8)
            return new cls(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]);
        if (len == 9)
            return new cls(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8]);
        if (len == 10)
            return new cls(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]);
        nn.fatal("Typescript没有对 " + len + " 个参数的的 NewObject 实现");
        return null;
    }
    nn.NewObject = NewObject;
    function InstanceNewObject(o) {
        var p = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            p[_i - 1] = arguments[_i];
        }
        var cls = ObjectClass(o);
        return NewObject(cls, p);
    }
    nn.InstanceNewObject = InstanceNewObject;
    function MethodIsOverrided(cls, method) {
        return ObjectPrototype(cls)[method] != SuperClass(cls)[method];
    }
    nn.MethodIsOverrided = MethodIsOverrided;
    function HasMethod(cls, method) {
        return ObjectPrototype(cls)[method] != undefined;
    }
    nn.HasMethod = HasMethod;
    function Method(obj, method) {
        return ObjectPrototype(obj)[method];
    }
    nn.Method = Method;
    var Class = (function () {
        function Class(type) {
            this.type = type;
        }
        Class.prototype.instance = function () {
            if (this.type == null)
                return null;
            return new this.type();
        };
        Class.prototype.isEqual = function (r) {
            return this.type == r.type;
        };
        return Class;
    }());
    nn.Class = Class;
    /** 实例的容器
        @note 承载实例好的对象或者延迟实例化的类，但是暴露出去的都是实例
    */
    var Instance = (function () {
        function Instance(o) {
            if (typeof (o) == 'function') {
                this._clazz = o;
            }
            else {
                this._obj = o;
            }
        }
        Instance.prototype.drop = function () {
            this._obj = nn.drop(this._obj);
        };
        Object.defineProperty(Instance.prototype, "obj", {
            get: function () {
                if (this._obj == null) {
                    var clz = this._clazz;
                    this._obj = new clz();
                }
                return this._obj;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Instance.prototype, "clazz", {
            get: function () {
                return this._clazz;
            },
            enumerable: true,
            configurable: true
        });
        Instance.prototype.isnull = function () {
            if (this._obj == null)
                return true;
            if (this._obj.__disposed == true)
                return true;
            return false;
        };
        return Instance;
    }());
    nn.Instance = Instance;
    function New(v) {
        return new Instance(v);
    }
    nn.New = New;
    var Closure = (function () {
        function Closure(cb, ctx) {
            var p = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                p[_i - 2] = arguments[_i];
            }
            this.cb = cb;
            this.ctx = ctx;
            this.argus = p;
        }
        Closure.prototype.dispose = function () {
            this.cb = undefined;
            this.ctx = undefined;
            this.argus = undefined;
        };
        Closure.prototype.invoke = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (this.cb) {
                return this.cb.apply(this.ctx, p ? p : this.argus);
            }
            return undefined;
        };
        Closure.prototype.reset = function (cb, ctx) {
            var p = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                p[_i - 2] = arguments[_i];
            }
            this.cb = cb;
            this.ctx = ctx;
            this.argus = p;
        };
        return Closure;
    }());
    nn.Closure = Closure;
    /** 拼装参数，直接发起函数调用 */
    function Invoke1(fun, ctx, p) {
        var prefixarguments = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            prefixarguments[_i - 3] = arguments[_i];
        }
        var argus = nn.ArrayT.Concat(prefixarguments, p);
        return fun.apply(ctx, argus);
    }
    nn.Invoke1 = Invoke1;
    function Invoke2(fun, ctx, prefixarguments, p) {
        var argus = nn.ArrayT.Concat(prefixarguments, p);
        return fun.apply(ctx, argus);
    }
    nn.Invoke2 = Invoke2;
    /** 直接运行，返回参数 */
    function call(cb) {
        return cb();
    }
    nn.call = call;
})(nn || (nn = {}));
var tmp;
(function (tmp) {
    // 通用全局命名计数器
    var _RT_NAMECOUNT = 0;
    function rtname() {
        return '__rt' + (_RT_NAMECOUNT++);
    }
    tmp.rtname = rtname;
})(tmp || (tmp = {}));
var nn;
(function (nn) {
    var TextAlign = (function () {
        function TextAlign() {
        }
        return TextAlign;
    }());
    TextAlign.CENTER = 'center';
    TextAlign.LEFT = 'left';
    TextAlign.RIGHT = 'right';
    nn.TextAlign = TextAlign;
    ;
    var CLabel = (function (_super) {
        __extends(CLabel, _super);
        function CLabel() {
            return _super.call(this) || this;
        }
        CLabel.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalChanged);
            this._signals.register(nn.SignalAction);
        };
        return CLabel;
    }(nn.Widget));
    // 默认的字体大小
    CLabel.FontSize = 30;
    nn.CLabel = CLabel;
    var CBitmapLabel = (function (_super) {
        __extends(CBitmapLabel, _super);
        function CBitmapLabel() {
            return _super.apply(this, arguments) || this;
        }
        return CBitmapLabel;
    }(nn.Widget));
    nn.CBitmapLabel = CBitmapLabel;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var ExtScrollView = (function (_super) {
        __extends(ExtScrollView, _super);
        function ExtScrollView(ui) {
            var _this = _super.call(this) || this;
            _this.setContent(ui.handle());
            return _this;
        }
        ExtScrollView.prototype.dispose = function () {
            this._fmui = undefined;
        };
        ExtScrollView.prototype._updateContentPosition = function () {
            // 当滚动的时候回调
            _super.prototype._updateContentPosition.call(this);
            if (this._fmui)
                this._fmui.onPositionChanged();
        };
        ExtScrollView.prototype.setScrollPosition = function (top, left, isOffset) {
            _super.prototype.setScrollPosition.call(this, top, left, isOffset);
        };
        // 直接覆盖基类的函数
        ExtScrollView.prototype._onTouchBegin = function (e) {
            _super.prototype._onTouchBegin.call(this, e);
            if (this._fmui)
                this._fmui._onTouchBegin(e);
        };
        ExtScrollView.prototype._onTouchMove = function (e) {
            _super.prototype._onTouchMove.call(this, e);
            if (this._fmui)
                this._fmui.onPositionChanged();
        };
        ExtScrollView.prototype._onTouchEnd = function (e) {
            _super.prototype._onTouchEnd.call(this, e);
            if (this._fmui)
                this._fmui._onTouchEnd(e);
        };
        ExtScrollView.prototype._onScrollStarted = function () {
            _super.prototype._onScrollStarted.call(this);
            if (this._fmui)
                this._fmui._onScrollStarted();
        };
        ExtScrollView.prototype._onScrollFinished = function () {
            _super.prototype._onScrollFinished.call(this);
            if (this._fmui)
                this._fmui._onScrollFinished();
        };
        return ExtScrollView;
    }(egret.ScrollView));
    var ScrollView = (function (_super) {
        __extends(ScrollView, _super);
        function ScrollView(cnt) {
            var _this = _super.call(this, null) || this;
            _this._contentSize = new nn.Size();
            _this._scrollTouching = false;
            _this.regionBounds = new nn.Rect();
            _this._scrollContent = new nn.SpriteWrapper();
            _this._scrollView = new ExtScrollView(_this._scrollContent);
            _this._scrollView._fmui = _this;
            _this._imp.addChild(_this._scrollView);
            if (cnt)
                _this.contentView = cnt;
            return _this;
        }
        ScrollView.prototype.dispose = function () {
            this._scrollView.dispose();
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(ScrollView.prototype, "contentEdgeInsets", {
            get: function () {
                return this._scrollContent.edgeInsets;
            },
            set: function (v) {
                this._scrollContent.edgeInsets = v;
            },
            enumerable: true,
            configurable: true
        });
        ScrollView.prototype.updateData = function () {
            _super.prototype.updateData.call(this);
            this.contentView.updateData();
        };
        ScrollView.prototype.stopDecelerating = function () {
            var scl = this._scrollView;
            if (scl._ScrV_Props_._isHTweenPlaying) {
                egret.ScrollTween.removeTweens(scl);
                scl._ScrV_Props_._isHTweenPlaying = false;
                scl._ScrV_Props_._hScrollTween = null;
            }
            if (scl._ScrV_Props_._isVTweenPlaying) {
                egret.ScrollTween.removeTweens(scl);
                scl._ScrV_Props_._isVTweenPlaying = false;
                scl._ScrV_Props_._vScrollTween = null;
            }
        };
        ScrollView.prototype.updateLayout = function () {
            var _this = this;
            _super.prototype.updateLayout.call(this);
            var rc = this.bounds();
            if (this.floatingIdentifier == false) {
                if (this._verticalIdentifier) {
                    var bst = this._verticalIdentifier.bestFrame();
                    rc.width -= Math.abs(bst.x) + bst.width;
                }
                if (this._horizonIdentifier) {
                    var bst = this._horizonIdentifier.bestFrame();
                    rc.height -= Math.abs(bst.y) + bst.height;
                }
            }
            var box = new nn.HBox(this).setRect(this.bounds());
            box.addFlexVBox(1, function (box) {
                if (_this._horizonIdentifier) {
                    var bst = _this._horizonIdentifier.bestFrame();
                    box.addFlex(1);
                    box.addPixel(bst.height, _this._horizonIdentifier);
                }
            });
            if (this._verticalIdentifier) {
                var bst = this._verticalIdentifier.bestFrame();
                box.addPixel(bst.width, this._verticalIdentifier);
            }
            box.apply();
            // 计算到抛去指示条后的大小
            rc.applyEdgeInsets(this.edgeInsets);
            // 可视区域大小
            this.regionBounds.setSize(rc.width, rc.height);
            // 引用到egret的scroll
            this.impSetFrame(rc, this._scrollView);
            this._scrollView.mask = new egret.Rectangle(0, 0, 200, 200);
        };
        ScrollView.prototype.boundsForContent = function () {
            return this.bounds().applyEdgeInsets(this.contentEdgeInsets);
        };
        ScrollView.prototype.addChild = function (c) {
            return this.contentView.addChild(c);
        };
        ScrollView.prototype.removeChild = function (c) {
            this.contentView.removeChild(c);
        };
        Object.defineProperty(ScrollView.prototype, "verticalIdentifier", {
            get: function () {
                return this._verticalIdentifier;
            },
            set: function (v) {
                if (v == this._verticalIdentifier)
                    return;
                if (this._verticalIdentifier)
                    _super.prototype.removeChild.call(this, this._verticalIdentifier);
                this._verticalIdentifier = v;
                if (v) {
                    v.touchEnabled = false;
                    _super.prototype.addChild.call(this, v);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollView.prototype, "horizonIdentifier", {
            get: function () {
                return this._horizonIdentifier;
            },
            set: function (v) {
                if (v == this._horizonIdentifier)
                    return;
                if (this._horizonIdentifier)
                    _super.prototype.removeChild.call(this, this._horizonIdentifier);
                this._horizonIdentifier = v;
                if (v) {
                    v.touchEnabled = false;
                    _super.prototype.addChild.call(this, v);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollView.prototype, "contentSize", {
            get: function () {
                return this._contentSize.clone();
            },
            set: function (sz) {
                // 保存
                this._contentSize.copy(sz);
                // 增加边缘
                sz.add(nn.EdgeInsets.Width(this.contentEdgeInsets), nn.EdgeInsets.Height(this.contentEdgeInsets));
                // 刷新后需要设置回之前的位置
                var pos = this.contentOffset;
                var d = sz.width - this._contentSize.width;
                if (d < 0 && pos.x + d >= 0) {
                    pos.x += d;
                    this.regionBounds.x = pos.x - nn.EdgeInsets.Left(this.contentEdgeInsets);
                }
                var d = sz.height - this._contentSize.height;
                if (d < 0 && pos.y + d >= 0) {
                    pos.y += d;
                    this.regionBounds.y = pos.y - nn.EdgeInsets.Top(this.contentEdgeInsets);
                }
                this.contentOffset = pos;
                // 刷新指示的位置
                this._scrollContent.setSize(new nn.Size(sz.width, sz.height));
                this._updateIdentifier();
                if (this._signals)
                    this._signals.emit(nn.SignalConstriantChanged);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollView.prototype, "contentView", {
            get: function () {
                var r = this._scrollContent.contentView;
                if (r == null) {
                    r = new nn.Sprite();
                    this._scrollContent.contentView = r;
                }
                return r;
            },
            set: function (ui) {
                if (this._scrollContent.contentView)
                    this._scrollContent.contentView.belong = null;
                this._scrollContent.contentView = ui;
                if (ui)
                    ui.belong = this;
            },
            enumerable: true,
            configurable: true
        });
        ScrollView.prototype._updateIdentifier = function () {
            if (this._verticalIdentifier == null &&
                this._horizonIdentifier == null)
                return;
            var cntsz = this.contentSize;
            var rg = this.regionBounds;
            if (this._verticalIdentifier) {
                var per = new nn.Percentage(cntsz.height - rg.height, rg.y);
                this._verticalIdentifier.progressValue = per;
            }
            if (this._horizonIdentifier) {
                var per = new nn.Percentage(cntsz.width - rg.width, rg.x);
                this._horizonIdentifier.progressValue = per;
            }
        };
        ScrollView.prototype.onPositionChanged = function () {
            // 更新偏移
            this._contentOffset.x = this._scrollView.scrollLeft * nn.ScaleFactorDeX;
            this._contentOffset.y = this._scrollView.scrollTop * nn.ScaleFactorDeY;
            // 更新可视区域
            this.regionBounds.x = this._contentOffset.x - nn.EdgeInsets.Left(this.contentEdgeInsets);
            this.regionBounds.y = this._contentOffset.y - nn.EdgeInsets.Top(this.contentEdgeInsets);
            // 更新指示器的位置
            this._updateIdentifier();
            _super.prototype.onPositionChanged.call(this);
        };
        ScrollView.prototype._onTouchBegin = function (e) {
            this._scrollTouching = true;
            this._signals && this._signals.emit(nn.SignalScrollBegin);
        };
        ScrollView.prototype._onTouchEnd = function (e) {
        };
        ScrollView.prototype._onScrollStarted = function () {
        };
        ScrollView.prototype._onScrollFinished = function () {
            if (this._scrollTouching == false)
                return;
            this._scrollTouching = false;
            this._signals && this._signals.emit(nn.SignalScrollEnd);
        };
        ScrollView.prototype.setContentOffset = function (pt, duration) {
            _super.prototype.setContentOffset.call(this, pt, duration);
            if (duration == 0) {
                this._scrollView.scrollLeft = pt.x * nn.ScaleFactorX;
                this._scrollView.scrollTop = pt.y * nn.ScaleFactorY;
            }
            else {
                this._scrollView.setScrollLeft(pt.x * nn.ScaleFactorX, duration * 1000);
                this._scrollView.setScrollTop(pt.y * nn.ScaleFactorY, duration * 1000);
            }
        };
        return ScrollView;
    }(nn.CScrollView));
    nn.ScrollView = ScrollView;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var CBitmap = (function (_super) {
        __extends(CBitmap, _super);
        function CBitmap(res) {
            var _this = _super.call(this) || this;
            /** 填充模式 */
            _this.fillMode = nn.FillMode.STRETCH;
            return _this;
        }
        CBitmap.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        CBitmap.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalChanged);
        };
        return CBitmap;
    }(nn.Widget));
    nn.CBitmap = CBitmap;
})(nn || (nn = {}));
var Js;
(function (Js) {
    Js.siteUrl = location.href;
    var __PROTO = Date.prototype;
    __PROTO.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
            "H+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
    function str_repeat(i, m) {
        for (var o = []; m > 0; o[--m] = i)
            ;
        return o.join('');
    }
    Js.printf = function () {
        var i = 0, a;
        var f = arguments[i++];
        var o = [], m, p, c, x, s = '';
        while (f) {
            if ((m = /^[^\x25]+/.exec(f))) {
                o.push(m[0]);
            }
            else if ((m = /^\x25{2}/.exec(f))) {
                o.push('%');
            }
            else if ((m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f))) {
                if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
                    throw ('Too few arguments.');
                }
                if (/[^s]/.test(m[7]) && (typeof (a) != 'number')) {
                    throw ('Expecting number but found ' + typeof (a));
                }
                switch (m[7]) {
                    case 'b':
                        a = a.toString(2);
                        break;
                    case 'c':
                        a = String.fromCharCode(a);
                        break;
                    case 'd':
                        a = parseInt(a);
                        break;
                    case 'e':
                        a = m[6] ? a.toExponential(m[6]) : a.toExponential();
                        break;
                    case 'f':
                        a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a);
                        break;
                    case 'o':
                        a = a.toString(8);
                        break;
                    case 's':
                        a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a);
                        break;
                    case 'u':
                        a = Math.abs(a);
                        break;
                    case 'x':
                        a = a.toString(16);
                        break;
                    case 'X':
                        a = a.toString(16).toUpperCase();
                        break;
                }
                a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+' + a : a);
                c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
                x = m[5] - String(a).length - s.length;
                p = m[5] ? str_repeat(c, x) : '';
                o.push(s + (m[4] ? a + p : p + a));
            }
            else {
                throw ('Huh ?!');
            }
            f = f.substring(m[0].length);
        }
        return o.join('');
    };
    Js.guid = function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };
    Js.uuid = function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            // Compact form
            for (i = 0; i < len; i++)
                uuid[i] = chars[0 | Math.random() * radix];
        }
        else {
            // rfc4122, version 4 form
            var r;
            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    };
    Js.getBrowserSize = function () {
        if (nn.ISNATIVE) {
            return { width: egret_native.EGTView.getFrameWidth(),
                height: egret_native.EGTView.getFrameHeight() };
        }
        var intH = 0;
        var intW = 0;
        if (document.documentElement &&
            (document.documentElement.clientWidth ||
                document.documentElement.clientHeight)) {
            intH = document.documentElement.clientHeight;
            intW = document.documentElement.clientWidth;
        }
        else if (document.body &&
            (document.body.clientWidth || document.body.clientHeight)) {
            if (document.body.scrollHeight > document.body.clientHeight) {
                intH = document.body.scrollHeight;
                intW = document.body.scrollWidth;
            }
            else {
                intH = document.body.clientHeight;
                intW = document.body.clientWidth;
            }
        }
        else if (typeof window.innerWidth == 'number') {
            intH = window.innerHeight;
            intW = window.innerWidth;
        }
        return { width: intW,
            height: intH };
    };
    Js.getScreenSize = function () {
        if (nn.ISNATIVE) {
            return { width: egret_native.EGTView.getFrameWidth(),
                height: egret_native.EGTView.getFrameHeight() };
        }
        if (typeof window.screen == 'undefined')
            return Js.getBrowserSize();
        var intW = window.screen.width;
        var intH = window.screen.height;
        return { width: intW,
            height: intH };
    };
    Js.getBrowserOrientation = function () {
        var orientation;
        //orientation = window.orientation;
        //if (orientation == undefined) {
        var sz = Js.getBrowserSize();
        if (sz.width >= sz.height)
            orientation = 90;
        else
            orientation = 0;
        //}
        return orientation;
    };
    Js.hashKey = function (o) {
        if (o == null)
            return null;
        var tp = typeof (o);
        if (tp == 'string' || tp == 'number' || tp == 'function')
            return o;
        if (o.hashCode)
            return o.hashCode;
        return o.toString();
    };
    function GetArguments(arg) {
        var r = [];
        var l = arg.length;
        for (var i = 0; i < l; ++i)
            r.push(arg[i]);
        return r;
    }
    function GetPropertyDescriptor(cls, name) {
        var d;
        do {
            d = Object.getOwnPropertyDescriptor(cls, name);
            cls = cls.__proto__;
        } while (d == null && cls != null);
        return d;
    }
    __PROTO = Object;
    __PROTO.getPropertyDescriptor = GetPropertyDescriptor;
    function OverrideGetSet(cls, name, oset, ounset) {
        var prop = Object.getOwnPropertyDescriptor(cls, name);
        var funs = prop.set;
        var fung = prop.get;
        prop.set = function (v) {
            oset.call(null, this, funs, v);
        };
        prop.get = function () {
            return ounset.call(null, this, fung);
        };
        Object.defineProperty(cls, name, prop);
    }
    Js.OverrideGetSet = OverrideGetSet;
    function OverrideFunction(cls, funm, of) {
        var impl = cls[funm];
        cls[funm] = function () {
            return of.apply(this, [impl].concat(GetArguments(arguments)));
        };
    }
    Js.OverrideFunction = OverrideFunction;
    function enterFullscreen(e) {
        if (e.requestFullscreen) {
            e.requestFullscreen();
        }
        else if (e.mozRequestFullScreen) {
            e.mozRequestFullScreen();
        }
        else if (e.webkitRequestFullscreen) {
            e.webkitRequestFullscreen();
        }
        else if (e.msRequestFullscreen) {
            e.msRequestFullscreen();
        }
    }
    Js.enterFullscreen = enterFullscreen;
    ;
    function exitFullscreen() {
        var e = document;
        if (e.exitFullscreen) {
            e.exitFullscreen();
        }
        else if (e.mozCancelFullScreen) {
            e.mozCancelFullScreen();
        }
        else if (e.webkitExitFullscreen) {
            e.webkitExitFullscreen();
        }
    }
    Js.exitFullscreen = exitFullscreen;
    ;
    function isFullscreen() {
        var e = document;
        if (e.isFullScreen)
            return true;
        if (e.mozIsFullScreen)
            return true;
        if (e.webkitIsFullScreen)
            return true;
        if (e.msIsFullScreen)
            return true;
        return false;
    }
    Js.isFullscreen = isFullscreen;
    ;
    // base64
    (function (global) {
        'use strict';
        // existing version for noConflict()
        var _Base64 = global.Base64;
        var version = "2.1.9";
        // constants
        var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var b64tab = function (bin) {
            var t = {};
            for (var i = 0, l = bin.length; i < l; i++)
                t[bin.charAt(i)] = i;
            return t;
        }(b64chars);
        var fromCharCode = String.fromCharCode;
        // encoder stuff
        var cb_utob = function (c) {
            if (c.length < 2) {
                var cc = c.charCodeAt(0);
                return cc < 0x80 ? c
                    : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                        + fromCharCode(0x80 | (cc & 0x3f)))
                        : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                            + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                            + fromCharCode(0x80 | (cc & 0x3f)));
            }
            else {
                var cc = 0x10000
                    + (c.charCodeAt(0) - 0xD800) * 0x400
                    + (c.charCodeAt(1) - 0xDC00);
                return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                    + fromCharCode(0x80 | (cc & 0x3f)));
            }
        };
        var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
        var utob = function (u) {
            return u.replace(re_utob, cb_utob);
        };
        var cb_encode = function (ccc) {
            var padlen = [0, 2, 1][ccc.length % 3], ord = ccc.charCodeAt(0) << 16
                | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
                | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)), chars = [
                b64chars.charAt(ord >>> 18),
                b64chars.charAt((ord >>> 12) & 63),
                padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
            ];
            return chars.join('');
        };
        var btoa = global.btoa ? function (b) {
            return global.btoa(b);
        } : function (b) {
            return b.replace(/[\s\S]{1,3}/g, cb_encode);
        };
        var buffer = null; //nodejs模式时会提供buffer类，所以我们在前端直接舍弃
        var _encode = buffer ? function (u) {
            return (u.constructor === buffer.constructor ? u : new buffer(u))
                .toString('base64');
        }
            : function (u) { return btoa(utob(u)); };
        var encode = function (u, urisafe) {
            return !urisafe
                ? _encode(String(u))
                : _encode(String(u)).replace(/[+\/]/g, function (m0) {
                    return m0 == '+' ? '-' : '_';
                }).replace(/=/g, '');
        };
        var encodeURI = function (u) { return encode(u, true); };
        // decoder stuff
        var re_btou = new RegExp([
            '[\xC0-\xDF][\x80-\xBF]',
            '[\xE0-\xEF][\x80-\xBF]{2}',
            '[\xF0-\xF7][\x80-\xBF]{3}'
        ].join('|'), 'g');
        var cb_btou = function (cccc) {
            switch (cccc.length) {
                case 4:
                    var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                        | ((0x3f & cccc.charCodeAt(1)) << 12)
                        | ((0x3f & cccc.charCodeAt(2)) << 6)
                        | (0x3f & cccc.charCodeAt(3)), offset = cp - 0x10000;
                    return (fromCharCode((offset >>> 10) + 0xD800)
                        + fromCharCode((offset & 0x3FF) + 0xDC00));
                case 3:
                    return fromCharCode(((0x0f & cccc.charCodeAt(0)) << 12)
                        | ((0x3f & cccc.charCodeAt(1)) << 6)
                        | (0x3f & cccc.charCodeAt(2)));
                default:
                    return fromCharCode(((0x1f & cccc.charCodeAt(0)) << 6)
                        | (0x3f & cccc.charCodeAt(1)));
            }
        };
        var btou = function (b) {
            return b.replace(re_btou, cb_btou);
        };
        var cb_decode = function (cccc) {
            var len = cccc.length, padlen = len % 4, n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
                | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
                | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0)
                | (len > 3 ? b64tab[cccc.charAt(3)] : 0), chars = [
                fromCharCode(n >>> 16),
                fromCharCode((n >>> 8) & 0xff),
                fromCharCode(n & 0xff)
            ];
            chars.length -= [0, 0, 2, 1][padlen];
            return chars.join('');
        };
        var atob = global.atob ? function (a) {
            return global.atob(a);
        } : function (a) {
            return a.replace(/[\s\S]{1,4}/g, cb_decode);
        };
        var _decode = buffer ? function (a) {
            return (a.constructor === buffer.constructor
                ? a : new buffer(a, 'base64')).toString();
        }
            : function (a) { return btou(atob(a)); };
        var decode = function (a) {
            return _decode(String(a).replace(/[-_]/g, function (m0) { return m0 == '-' ? '+' : '/'; })
                .replace(/[^A-Za-z0-9\+\/]/g, ''));
        };
        var noConflict = function () {
            var Base64 = global.Base64;
            global.Base64 = _Base64;
            return Base64;
        };
        // export Base64
        global.Base64 = {
            VERSION: version,
            atob: atob,
            btoa: btoa,
            fromBase64: decode,
            toBase64: encode,
            utob: utob,
            encode: encode,
            encodeURI: encodeURI,
            btou: btou,
            decode: decode,
            noConflict: noConflict
        };
        // if ES5 is available, make Base64.extendString() available
        if (typeof Object.defineProperty === 'function') {
            var noEnum = function (v) {
                return { value: v, enumerable: false, writable: true, configurable: true };
            };
            global.Base64.extendString = function () {
                Object.defineProperty(String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this);
                }));
                Object.defineProperty(String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe);
                }));
                Object.defineProperty(String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true);
                }));
            };
        }
        // that's it!
        if (global['Meteor']) {
            Base64 = global.Base64; // for normal export in Meteor.js
        }
        if (typeof (btoa) == 'undefined')
            btoa = global.Base64.btoa;
        if (typeof (atob) == 'undefined')
            atob = global.Base64.atob;
        if (typeof (utob) == 'undefined')
            utob = global.Base64.utob;
        if (typeof (btou) == 'undefined')
            btou = global.Base64.btou;
    })({});
    function loadScripts(list, cb, ctx) {
        var loaded = 0;
        var loadNext = function () {
            loadScript(list[loaded], function () {
                loaded++;
                if (loaded >= list.length) {
                    cb.call(ctx);
                }
                else {
                    loadNext();
                }
            }, this);
        };
        loadNext();
    }
    Js.loadScripts = loadScripts;
    function loadScript(src, cb, ctx) {
        var s = document.createElement('script');
        if (s.hasOwnProperty("async")) {
            s.async = false;
        }
        s.src = src;
        var fun = function () {
            this.removeEventListener('load', fun, false);
            cb.call(ctx);
        };
        s.addEventListener('load', fun, false);
        document.body.appendChild(s);
    }
    Js.loadScript = loadScript;
    function loadStyles(list, cb, ctx) {
        var loaded = 0;
        var loadNext = function () {
            loadStyle(list[loaded], function () {
                loaded++;
                if (loaded >= list.length) {
                    cb.call(ctx);
                }
                else {
                    loadNext();
                }
            }, this);
        };
        loadNext();
    }
    Js.loadStyles = loadStyles;
    function loadStyle(src, cb, ctx) {
        var s = document.createElement('link');
        if (s.hasOwnProperty("async")) {
            s.async = false;
        }
        s.setAttribute("rel", "stylesheet");
        s.setAttribute("type", "text/css");
        s.setAttribute("href", src);
        var fun = function () {
            this.removeEventListener('load', fun, false);
            cb.call(ctx);
        };
        s.addEventListener('load', fun, false);
        document.body.appendChild(s);
    }
    Js.loadStyle = loadStyle;
    ;
    function loadSources(list, cb, ctx) {
        var loaded = 0;
        var loadNext = function () {
            loadSource(list[loaded], function () {
                loaded++;
                if (loaded >= list.length) {
                    cb.call(ctx);
                }
                else {
                    loadNext();
                }
            }, this);
        };
        loadNext();
    }
    Js.loadSources = loadSources;
    function loadSource(src, cb, ctx) {
        if (src[1] == 0)
            loadScript(src[0], cb, ctx);
        else if (src[1] == 1)
            loadStyle(src[0], cb, ctx);
        else
            cb.call(ctx);
    }
    Js.loadSource = loadSource;
    function stacktrace() {
        var callstack = [];
        var isCallstackPopulated = false;
        try {
            var i = null;
            i.dont.exist += 0; //doesn't exist- that's the point
        }
        catch (e) {
            var win = window;
            if (e.stack) {
                var lines = e.stack.split('\n');
                for (var i = 0, len = lines.length; i < len; i++) {
                    var res = lines[i].match("at (.+)$");
                    if (res && res.length == 2) {
                        callstack.push(res[1]);
                    }
                }
                callstack.shift();
                isCallstackPopulated = true;
            }
            else if (win.opera && e.message) {
                var lines = e.message.split('\n');
                for (var i = 0, len = lines.length; i < len; i++) {
                    if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
                        var entry = lines[i];
                        if (lines[i + 1]) {
                            entry += ' at ' + lines[i + 1];
                            i++;
                        }
                        callstack.push(entry);
                    }
                }
                callstack.shift();
                isCallstackPopulated = true;
            }
        }
        if (!isCallstackPopulated) {
            var currentFunction = arguments.callee.caller;
            while (currentFunction) {
                var fn = currentFunction.toString();
                var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf('')) || 'anonymous';
                callstack.push(fname);
                currentFunction = currentFunction.caller;
            }
        }
        return callstack.join("\n");
    }
    Js.stacktrace = stacktrace;
})(Js || (Js = {}));
var nn;
(function (nn) {
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap(res) {
            var _this = _super.call(this) || this;
            _this._bmp = new nn.ExtBitmap();
            _this._imageSource = null;
            _this._bmp.width = _this._bmp.height = 0;
            _this._imp.addChild(_this._bmp);
            if (res) {
                _this.imageSource = res;
                _this.setFrame(_this.bestFrame());
            }
            return _this;
        }
        Bitmap.prototype.onChangeState = function (obj) {
            if (obj == null) {
                this.imageSource = null;
                return;
            }
            _super.prototype.onChangeState.call(this, obj);
        };
        Bitmap.prototype.bestFrame = function (inrc) {
            if (this.preferredFrame)
                return this.preferredFrame.clone();
            var tex = this._getTexture();
            if (tex == null)
                return new nn.Rect();
            return new nn.Rect(0, 0, tex.textureWidth, tex.textureHeight);
        };
        Bitmap.prototype._getTexture = function () {
            if (this._bmp.texture instanceof egret.Texture)
                return this._bmp.texture;
            return null;
        };
        Object.defineProperty(Bitmap.prototype, "imageSource", {
            get: function () {
                var tex = this._getTexture();
                if (tex == null)
                    return this._imageSource;
                nn.COriginType.shared.imp = tex;
                return nn.COriginType.shared;
            },
            set: function (ds) {
                var _this = this;
                if (this._imageSource == ds)
                    return;
                this._imageSource = ds;
                nn.ResManager.getTexture(ds, nn.ResPriority.NORMAL, function (tex) {
                    if (ds != _this._imageSource)
                        return;
                    _this._setTexture(tex.use());
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        Bitmap.prototype._setTexture = function (tex) {
            this._bmp.scale9Grid = tex ? tex['scale9Grid'] : null;
            this._bmp.texture = tex;
            if (this._signals)
                this._signals.emit(nn.SignalChanged, tex);
            // 材质的变化有可能会引起布局的改变，所以需要刷新一下
            this.setNeedsLayout();
        };
        Bitmap.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            var self = this;
            var rc = self.boundsForLayout();
            if (rc.width == 0 && rc.height == 0) {
                var bmp = self._bmp;
                bmp.width = bmp.height = 0;
                self.updateCache();
                return;
            }
            var bst = self.bestFrame();
            if (bst.width == 0 || bst.height == 0) {
                self.impSetFrame(rc, self._bmp);
                self.updateCache();
                return;
            }
            bst.fill(rc, self.fillMode);
            var pt = rc.center;
            if (self.preferredFrame) {
                pt.x += self.preferredFrame.x;
                pt.y += self.preferredFrame.y;
            }
            bst.center = pt;
            self.impSetFrame(bst, self._bmp);
            self.updateCache();
        };
        return Bitmap;
    }(nn.CBitmap));
    nn.Bitmap = Bitmap;
    var Picture = (function (_super) {
        __extends(Picture, _super);
        function Picture(res) {
            var _this = _super.call(this, res) || this;
            _this.fillMode = nn.FillMode.CENTER;
            return _this;
        }
        return Picture;
    }(Bitmap));
    nn.Picture = Picture;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var FrameTimer = (function () {
        function FrameTimer() {
            /** 消耗时间 */
            this.cost = 0;
            /** 过去了的时间 */
            this.past = 0;
            /** 次数统计 */
            this.count = 0;
            this.start = this.now = nn.DateTime.Pass();
        }
        return FrameTimer;
    }());
    nn.FrameTimer = FrameTimer;
    var CFramesManager = (function () {
        function CFramesManager() {
            this._blayouts = NewSet();
            this._bzpositions = NewSet();
            this._bappears = NewSet();
            this._bcaches = NewSet();
            this._bmcs = NewSet();
            this.RENDERS = NewSet();
            this._ft = new FrameTimer();
        }
        CFramesManager.prototype.onPrepare = function () {
            if (nn.ISDEBUG) {
                ++this._ft.count;
            }
            // 刷新一下布局
            ++CFramesManager._layoutthreshold;
            nn.SetT.SafeClear(this._blayouts, function (c) {
                if (!c.__disposed) {
                    c._islayouting = true;
                    c.updateLayout();
                    c._islayouting = false;
                }
            });
            --CFramesManager._layoutthreshold;
            // 调整z顺序
            nn.SetT.SafeClear(this._bzpositions, function (c) {
                if (!c.__disposed)
                    c.updateZPosition();
            });
            // 当布局结束才激发已显示
            nn.SetT.SafeClear(this._bappears, function (c) {
                if (!c.__disposed && !c.isAppeared)
                    c.onAppeared();
            });
            // 更新图形缓存
            nn.SetT.Clear(this._bcaches, function (c) {
                if (!c.__disposed)
                    c.flushCache();
            });
            // 更新内存缓存
            nn.SetT.Clear(this._bmcs, function (mc) {
                mc.gc();
            });
        };
        CFramesManager.prototype.onRendering = function () {
            var now = nn.DateTime.Pass();
            this._ft.cost = now - this._ft.now;
            this._ft.past = now - this._ft.start;
            this._ft.now = now;
            // 标准set的foreach需要传入3个参数，但是后两个我们都不会去使用
            var cost = this._ft.cost;
            this.RENDERS.forEach(function (each) {
                each.onRender(cost);
            }, this);
        };
        /** 布局 */
        CFramesManager.prototype.needsLayout = function (c) {
            if (CFramesManager._layoutthreshold == 0) {
                this._blayouts.add(c);
                this.invalidate();
            }
            else {
                c.updateLayout();
            }
        };
        CFramesManager.prototype.cancelLayout = function (c) {
            this._blayouts.delete(c);
        };
        /** 调整Z顺序 */
        CFramesManager.prototype.needsZPosition = function (c) {
            this._bzpositions.add(c);
            this.invalidate();
        };
        /** 显示 */
        CFramesManager.prototype.needsAppear = function (c) {
            this._bappears.add(c);
            this.invalidate();
        };
        /** 刷新图形缓存 */
        CFramesManager.prototype.needsCache = function (c) {
            this._bcaches.add(c);
            this.invalidate();
        };
        /** 刷新内存缓存 */
        CFramesManager.prototype.needsGC = function (mc) {
            this._bmcs.add(mc);
            this.invalidate();
        };
        return CFramesManager;
    }());
    CFramesManager._layoutthreshold = 0;
    nn.CFramesManager = CFramesManager;
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 按钮类
        @note 定义为具有点按状态、文字、图片的元素，可以通过子类化来调整文字、图片的布局方式
     */
    var CButton = (function (_super) {
        __extends(CButton, _super);
        function CButton() {
            var _this = _super.call(this) || this;
            /** 点击频度限制 */
            _this.eps = 3;
            _this.touchEnabled = true;
            _this.anchor = nn.Point.AnchorCC;
            return _this;
        }
        CButton.prototype._signalConnected = function (sig, s) {
            _super.prototype._signalConnected.call(this, sig, s);
            if (sig == nn.SignalClicked)
                s.eps = this.eps;
        };
        CButton.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalClicked);
        };
        CButton.prototype.isSelection = function () {
            return this._isSelected;
        };
        return CButton;
    }(nn.Widget));
    CButton.STATE_NORMAL = "::button::state::normal";
    CButton.STATE_DISABLED = "::button::state::disable";
    CButton.STATE_HIGHLIGHT = "::button::state::highlight";
    CButton.STATE_SELECTED = "::button::state::selected";
    nn.CButton = CButton;
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 骨骼的配置信息 */
    var BoneConfig = (function () {
        /**
           @name 骨骼动画的名称，如果设置name而不设置其他，则使用 name 和默认规则来生成缺失的文件
           @character 角色名称，通常和name一致
           @skeleton 动作的配置文件，通常为动作名 skeleton_json 结尾
           @place 材质节点的位置配置文件，通常为 texture_json 结尾
           @texture 图片文件，通常为 texture_png 结尾
        */
        function BoneConfig(name, character, skeleton, place, texture) {
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
        Object.defineProperty(BoneConfig.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (v) {
                this._name = v;
                if (!this._character)
                    this._character = name;
                if (!this._skeleton)
                    this._skeleton = name + '_skeleton_json';
                if (!this._place)
                    this._place = name + '_texture_json';
                if (!this._texture)
                    this._texture = name + '_png';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoneConfig.prototype, "skeleton", {
            get: function () {
                return this._skeleton;
            },
            set: function (v) {
                this._skeleton = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoneConfig.prototype, "place", {
            get: function () {
                return this._place;
            },
            set: function (v) {
                this._place = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoneConfig.prototype, "texture", {
            get: function () {
                return this._texture;
            },
            set: function (v) {
                this._texture = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoneConfig.prototype, "character", {
            get: function () {
                return this._character;
            },
            set: function (v) {
                this._character = v;
            },
            enumerable: true,
            configurable: true
        });
        BoneConfig.prototype.getReqResources = function () {
            var r = [];
            r.push(new nn.ResourceEntity(this.skeleton, nn.ResType.JSON));
            r.push(new nn.ResourceEntity(this.place, nn.ResType.JSON));
            r.push(new nn.ResourceEntity(this.texture, nn.ResType.TEXTURE));
            return r;
        };
        return BoneConfig;
    }());
    nn.BoneConfig = BoneConfig;
    ;
    /** 业务使用的骨骼显示类 */
    var CBones = (function (_super) {
        __extends(CBones, _super);
        function CBones() {
            var _this = _super.call(this) || this;
            /** 同一批骨骼的大小可能一直，但有效区域不一致，所以可以通过该参数附加调整 */
            _this.additionScale = 1;
            /** 骨骼填充的方式，默认为充满 */
            _this.fillMode = nn.FillMode.ASPECTSTRETCH;
            /** 对齐位置 */
            _this.clipAlign = nn.POSITION.BOTTOM_CENTER;
            /** 自动开始播放 */
            _this.autoPlay = true;
            /** 播放次数控制
                -1: 循环
                0: 使用文件设置的次数
                >0: 次数控制
            */
            _this.count = -1;
            return _this;
        }
        CBones.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            // 骨骼开始播放
            this._signals.register(nn.SignalStart);
            // 一次 motion 结束
            this._signals.register(nn.SignalEnd);
            // 所有循环的结束
            this._signals.register(nn.SignalDone);
            // 骨骼改变，当骨骼资源变更时激发
            this._signals.register(nn.SignalChanged);
            // 骨骼更新，和change的区别在update每一次设置source都会激发
            this._signals.register(nn.SignalUpdated);
        };
        return CBones;
    }(nn.Widget));
    nn.CBones = CBones;
})(nn || (nn = {}));
// generated by n2build, do not modify!
var egret;
(function (egret) {
    egret.VERSION = 40001;
    function MAKE_VERSION(maj, min, patch) {
        return maj * 10000 + min * 100 + patch;
    }
    egret.MAKE_VERSION = MAKE_VERSION;
})(egret || (egret = {}));
var nn;
(function (nn) {
    var CMovieClip = (function (_super) {
        __extends(CMovieClip, _super);
        function CMovieClip() {
            var _this = _super.call(this) || this;
            /** 播放次数，-1代表循环，默认为一次*/
            _this.count = 1;
            /** 切换clipSource时清空原来的clip */
            _this.clearOnChanging = true;
            /** 是否自动播放 */
            _this.autoPlay = true;
            /** 附加缩放 */
            _this.additionScale = 1;
            /** 填充方式 */
            _this.fillMode = nn.FillMode.ASPECTSTRETCH;
            /** 序列帧的对齐位置 */
            _this.clipAlign = nn.POSITION.CENTER;
            return _this;
            //this.backgroundColor = Color.Red;
        }
        CMovieClip.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalStart);
            this._signals.register(nn.SignalChanged);
            this._signals.register(nn.SignalUpdated);
            this._signals.register(nn.SignalEnd);
            this._signals.register(nn.SignalDone);
        };
        // 需要在disap的时候暂停count＝－1的动画
        CMovieClip.prototype.onAppeared = function () {
            _super.prototype.onAppeared.call(this);
            if (this.__autopaused == true) {
                this.__autopaused = false;
                this.play();
            }
        };
        CMovieClip.prototype.onDisappeared = function () {
            _super.prototype.onDisappeared.call(this);
            if (this.isPlaying() && this.count == -1) {
                this.__autopaused = true;
                this.stop();
            }
        };
        return CMovieClip;
    }(nn.Widget));
    nn.CMovieClip = CMovieClip;
    var ClipConfig = (function () {
        /**
           @name 资源名称，资源由 json\bmp 组成，如过传入的时候没有带后缀，则自动加上后缀
           @res 动作文件，通常为 _json
           @tex 素材平成，通常为 _png
        */
        function ClipConfig(name, res, tex) {
            /** OPT 是否为独立数据，否则同一个资源公用一份帧数据 */
            this.key = '';
            this._name = name;
            this._frame = nn.nonnull1st(null, res, name);
            this._texture = nn.nonnull1st(null, tex, res, name, res);
        }
        Object.defineProperty(ClipConfig.prototype, "frame", {
            get: function () {
                var src = this._frame;
                if (src) {
                    // 如过是普通key，则需要判断有没有加后缀，不存在需要自动补全
                    if (src.indexOf('://') == -1) {
                        if (src.indexOf('_json') == -1)
                            src += '_json';
                    }
                }
                return src;
            },
            set: function (frm) {
                this._frame = frm;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClipConfig.prototype, "texture", {
            get: function () {
                var src = this._texture;
                if (src) {
                    if (src.indexOf('://') == -1) {
                        if (src.indexOf('_png') == -1)
                            src += '_png';
                    }
                }
                return src;
            },
            set: function (tex) {
                this._texture = tex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClipConfig.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (n) {
                this._name = n;
                if (this._frame == null)
                    this._frame = n;
                if (this._texture == null)
                    this._texture = n;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClipConfig.prototype, "hashCode", {
            get: function () {
                return nn.StringT.Hash(this.name + "::" + this._frame + "::" + this._texture + '::' + this.key);
            },
            enumerable: true,
            configurable: true
        });
        ClipConfig.prototype.isEqual = function (r) {
            return this.name == r.name &&
                this._frame == r._frame &&
                this._texture == r._texture &&
                this.fps == r.fps &&
                this.additionScale == r.additionScale &&
                this.key == r.key;
        };
        ClipConfig.prototype.getReqResources = function () {
            var r = [];
            r.push(new nn.ResourceEntity(this.frame, nn.ResType.JSON));
            r.push(new nn.ResourceEntity(this.texture, nn.ResType.TEXTURE));
            return r;
        };
        ClipConfig.prototype.toString = function () {
            return [this.name, this._frame, this._texture, this.key].join("\n");
        };
        return ClipConfig;
    }());
    nn.ClipConfig = ClipConfig;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var CParticle = (function (_super) {
        __extends(CParticle, _super);
        function CParticle() {
            return _super.call(this) || this;
        }
        return CParticle;
    }(nn.Widget));
    nn.CParticle = CParticle;
})(nn || (nn = {}));
if (typeof (document_class) == 'undefined')
    document_class = 'Main';
var nn;
(function (nn) {
    var EgretApp = (function (_super) {
        __extends(EgretApp, _super);
        function EgretApp() {
            var _this = _super.call(this) || this;
            // 通用的app事件
            egret.MainContext.instance.stage.addEventListener(egret.Event.ACTIVATE, _this.onActivated, _this);
            egret.MainContext.instance.stage.addEventListener(egret.Event.DEACTIVATE, _this.onDeactived, _this);
            return _this;
        }
        Object.defineProperty(EgretApp.prototype, "fontFamily", {
            get: function () {
                return egret.TextField.default_fontFamily;
            },
            set: function (f) {
                egret.TextField.default_fontFamily = f;
            },
            enumerable: true,
            configurable: true
        });
        return EgretApp;
    }(nn.CApplication));
    nn.EgretApp = EgretApp;
    nn.EUI_MODE = false;
    // ------------------实现egret需要的加载过程 ------------------------
    // 保护Main入口类    
    var CLAZZ_MAIN;
    // 伪main类，为了支持library(用来支持wing项目)和framework两种模式下的切换
    var _CloakMain = (function (_super) {
        __extends(_CloakMain, _super);
        function _CloakMain() {
            return _super.apply(this, arguments) || this;
        }
        return _CloakMain;
    }(nn.CApplication));
    // 替换掉egret原始调试信息窗
    var _InstrumentObject = (function (_super) {
        __extends(_InstrumentObject, _super);
        function _InstrumentObject() {
            var _this = _super.apply(this, arguments) || this;
            _this.totalTime = 0;
            _this.lastTime = 0;
            _this.totalTick = 0;
            _this.drawCalls = 0;
            return _this;
        }
        // 次数、脏比率、时间、为了统计消耗的时间
        _InstrumentObject.prototype.update = function (drawCalls, dirtyRatio, cost, statcost) {
            var current = egret.getTimer();
            this.totalTime += current - this.lastTime;
            this.lastTime = current;
            this.totalTick++;
            this.drawCalls = Math.max(drawCalls, this.drawCalls);
            if (this.totalTime > 500) {
                nn.COLLECT_FPS = Math.round(this.totalTick * 1000 / this.totalTime);
                nn.COLLECT_COST = cost;
                nn.COLLECT_DRAWS = drawCalls;
                nn.COLLECT_DIRTYR = dirtyRatio;
                nn.Instrument.shared.updateData();
                this.totalTick = 0;
                this.totalTime = 0;
                this.drawCalls = 0;
            }
        };
        return _InstrumentObject;
    }(egret.DisplayObject));
    var _Player = (function (_super) {
        __extends(_Player, _super);
        function _Player() {
            return _super.apply(this, arguments) || this;
        }
        _Player.prototype.start = function () {
            _super.prototype.start.call(this);
            if (DEBUG && this['fpsDisplay'] == null) {
                var io_1 = new _InstrumentObject();
                this['fpsDisplay'] = io_1;
            }
        };
        _Player.prototype.$render = function (triggerByFrame, costTicker) {
            if (DEBUG) {
                // 打开fps的统计
                this['showFPS'] = nn.COLLECT_INSTRUMENT;
            }
            _super.prototype.$render.call(this, triggerByFrame, costTicker);
        };
        return _Player;
    }(egret.sys.Player));
    egret.sys.Player = _Player;
    // 需要控制一下 stage 的一些功能
    var _AppStage = (function (_super) {
        __extends(_AppStage, _super);
        function _AppStage() {
            var _this = _super.call(this) || this;
            _AppStage.shared = _this;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.__stage_added, _this);
            // 开启帧监听，负责自动刷新布局、显示状态等功能
            nn.FramesManager.launch(_this);
            return _this;
        }
        _AppStage.prototype.__stage_added = function () {
            // 创建 APP 首页面的实例
            var app = new CLAZZ_MAIN();
            this.appMain = app;
            this.addChild(app.handle());
            // 更新大小
            egret.MainContext.instance.stage.setContentSize(_AppStage.StageBounds.width, _AppStage.StageBounds.height);
            // 计算dom的缩放
            var p = document.querySelector('.egret-player');
            if (p) {
                var canvas = p.children[0];
                nn.DomScaleFactorX = canvas.clientWidth / nn.toInt(canvas.getAttribute('width'));
                nn.DomScaleFactorY = canvas.clientHeight / nn.toInt(canvas.getAttribute('height'));
                nn.DomOffsetX = canvas.offsetLeft;
                nn.DomOffsetY = canvas.offsetTop;
            }
            // 直接刷新主布局
            this.updateLayout();
        };
        // 初始化 Stage 架构
        _AppStage.Init = function () {
            // 设置主业务入口类
            CLAZZ_MAIN = eval("Main");
            // 判断支持的特性
            var features = CLAZZ_MAIN.Features();
            if (nn.Mask.isset(nn.FrameworkFeature.MULTIRES, features))
                nn.ResManager.multiRes = true;
            if (nn.Device.shared.isAndroid &&
                nn.Mask.isset(nn.FrameworkFeature.NOSYNC, features))
                _AppStage.Fps = 0; // 0使用egret默认的帧速
            else
                _AppStage.Fps = 30;
            if (nn.Mask.isset(nn.FrameworkFeature.FULLSCREEN, features))
                nn.CApplication.NeedFullscreen = true;
            _AppStage.UpdateBounds();
        };
        // 界面发生变化
        _AppStage.UpdateBounds = function () {
            // 取得app预定的方向，如果时HTML则取meta中的设置，或者和native一样，取的APP重载的设置
            document_orientation = CLAZZ_MAIN.Orientation();
            // 刷新当前屏幕的尺寸
            nn.Device.shared._updateScreen();
            nn.Dom.updateBounds();
            // 设置大小            
            this.ScreenBounds = nn.Device.shared.screenBounds;
            this.DesignBounds = CLAZZ_MAIN.BestFrame();
            if (this.DesignBounds == null)
                this.DesignBounds = this.ScreenBounds.clone();
            // 计算 app 的尺寸
            var stageBounds = this.DesignBounds.clone();
            var fillMode = CLAZZ_MAIN.ScreenFillMode();
            this.ScreenScale = nn.ISHTML5 ? CLAZZ_MAIN.ScreenScale() : 1;
            // 如果是纯PC，则使用原始分辨率居中
            if (nn.Device.shared.isPurePC) {
                fillMode = nn.FillMode.CENTER;
                this.ScreenScale = 1;
            }
            // 映射设计分辨率到实际分辨率中
            stageBounds.fill(this.ScreenBounds, fillMode);
            // 如果宽度小于800，高度小于480，则需要映射到800*480中
            if (stageBounds.width > stageBounds.height) {
                var r = stageBounds.width / stageBounds.height;
                if (nn.Mask.isset(nn.FillMode.MAXIMUM, fillMode) ?
                    stageBounds.width > 800 :
                    stageBounds.width < 800) {
                    stageBounds.height *= 800 / stageBounds.width;
                    stageBounds.width = 800;
                }
            }
            else {
                var r = stageBounds.height / stageBounds.width;
                if (nn.Mask.isset(nn.FillMode.MAXIMUM, fillMode) ?
                    stageBounds.height > 800 :
                    stageBounds.height < 800) {
                    stageBounds.width *= 800 / stageBounds.height;
                    stageBounds.height = 800;
                }
            }
            // 大小需要规整
            stageBounds.scale(this.ScreenScale).integral();
            this.StageBounds = new nn.Rect(0, 0, stageBounds.width, stageBounds.height);
            // 计算屏幕的类型
            var scrFactor = nn.Rect.Area(stageBounds) / nn.Rect.Area(this.DesignBounds);
            if (scrFactor >= 3)
                nn.Device.shared.screenType = nn.ScreenType.EXTRAHIGH;
            else if (scrFactor >= 1.5)
                nn.Device.shared.screenType = nn.ScreenType.HIGH;
            else if (scrFactor <= 0.3)
                nn.Device.shared.screenType = nn.ScreenType.EXTRALOW;
            else if (scrFactor <= 0.75)
                nn.Device.shared.screenType = nn.ScreenType.LOW;
            else
                nn.Device.shared.screenType = nn.ScreenType.NORMAL;
            // 计算缩放系数，如果是PUREPC，则不进行缩放控制
            if ((fillMode & nn.FillMode.MASK_MAJOR) == nn.FillMode.CENTER) {
                nn.ScaleFactorX = nn.ScaleFactorY = this.ScreenScale;
                nn.ScaleFactorW = nn.ScaleFactorH = this.ScreenScale;
                if (nn.Mask.isset(nn.FillMode.NOBORDER, fillMode)) {
                    nn.StageScaleFactorX = stageBounds.width / this.DesignBounds.width / this.ScreenScale;
                    nn.StageScaleFactorY = stageBounds.height / this.DesignBounds.height / this.ScreenScale;
                }
                else {
                    nn.StageScaleFactorX = this.ScreenScale;
                    nn.StageScaleFactorY = this.ScreenScale;
                }
            }
            else {
                nn.ScaleFactorX = stageBounds.width / this.DesignBounds.width;
                nn.ScaleFactorY = stageBounds.height / this.DesignBounds.height;
                if ((fillMode & nn.FillMode.MASK_MAJOR) == nn.FillMode.STRETCH) {
                    nn.ScaleFactorW = nn.ScaleFactorX;
                    nn.ScaleFactorH = nn.ScaleFactorY;
                }
                else {
                    nn.ScaleFactorW = nn.ScaleFactorH = Math.min(nn.ScaleFactorX, nn.ScaleFactorY);
                }
                nn.StageScaleFactorX = this.ScreenScale;
                nn.StageScaleFactorY = this.ScreenScale;
            }
            nn.ScaleFactorDeX = 1 / nn.ScaleFactorX;
            nn.ScaleFactorDeY = 1 / nn.ScaleFactorY;
            nn.ScaleFactorDeW = 1 / nn.ScaleFactorW;
            nn.ScaleFactorDeH = 1 / nn.ScaleFactorH;
            nn.ScaleFactorS = Math.min(nn.ScaleFactorW, nn.ScaleFactorH);
            nn.ScaleFactorDeS = 1 / nn.ScaleFactorS;
            // 打印日志
            /*
            log(`ScaleFactor:
                x:${ScaleFactorX}, y:${ScaleFactorY}
                w:${ScaleFactorW}, h:${ScaleFactorH}, s:${ScaleFactorS}
                sx:${StageScaleFactorX}, sy:${StageScaleFactorY}`);
            */
            // 设置到全局变量，用以其他界面初始化的时候使用
            nn.StageBounds.reset(0, 0, stageBounds.width * nn.ScaleFactorDeW, stageBounds.height * nn.ScaleFactorDeH)
                .integral();
            // 设置egret内部的舞台大小
            if (egret.MainContext.instance.stage) {
                egret.MainContext.instance.stage.setContentSize(this.StageBounds.width, this.StageBounds.height);
            }
        };
        _AppStage.prototype.updateLayout = function () {
            this.appMain.setFrame(nn.StageBounds);
        };
        return _AppStage;
    }(egret.Sprite));
    Js.OverrideFunction(egret, 'updateAllScreens', function (orifn) {
        if (CLAZZ_MAIN == null)
            return;
        // 如果键盘弹出，则认定为因为弹出键盘导致的尺寸修改
        if (nn.Keyboard.visible)
            return;
        nn.log("尺寸改变");
        // 重新计算一下舞台的大小
        _AppStage.UpdateBounds();
        // 刷新首页的尺寸        
        _AppStage.shared.updateLayout();
        // 激活信号            
        nn.emit(nn.CApplication.shared, nn.SignalFrameChanged);
        // 调用原始的实现
        orifn.call(this);
    });
    // 需要替换查找入口类的函数，使得我们可以插入非业务类作为主入口
    Js.OverrideFunction(egret, 'getDefinitionByName', function (orifn, name) {
        if (name == 'Main')
            return _AppStage;
        return orifn(name);
    });
    // 替换掉默认的屏幕适配        
    var ExtScreenAdapter = (function (_super) {
        __extends(ExtScreenAdapter, _super);
        function ExtScreenAdapter() {
            return _super.apply(this, arguments) || this;
        }
        ExtScreenAdapter.prototype.calculateStageSize = function (scaleMode, screenWidth, screenHeight, contentWidth, contentHeight) {
            // 如果是标准PC浏览器，使用设计尺寸直接计算
            if (nn.Device.shared.isPurePC)
                return _super.prototype.calculateStageSize.call(this, scaleMode, screenWidth, screenHeight, contentWidth, contentHeight);
            // 否则手机上使用实时适配出来的舞台大小计算
            return _super.prototype.calculateStageSize.call(this, scaleMode, screenWidth, screenHeight, _AppStage.StageBounds.width, _AppStage.StageBounds.height);
        };
        return ExtScreenAdapter;
    }(egret.sys.DefaultScreenAdapter));
    // 替换掉系统的adapter
    egret.sys.screenAdapter = new ExtScreenAdapter();
    nn.loader.webstart = function () {
        // 执行加载动作
        nn.loader.InvokeBoot();
        // 初始化舞台
        _AppStage.Init();
        // 约定是否使用webgl
        var glmode = CLAZZ_MAIN.UseWebGl();
        if (location.href.indexOf('nowebgl=1') != -1)
            glmode = false;
        else if (location.href.indexOf('webgl=1') != -1)
            glmode = true;
        if (glmode) {
            // 如果是UC，则关闭webgl
            var agent = navigator.userAgent;
            if (agent.indexOf('UCBrowser') != -1)
                glmode = false;
        }
        // 默认使用webgl渲染
        if (glmode)
            egret.runEgret({ renderMode: "webgl" });
        else
            egret.runEgret();
        if (egret.Capabilities.renderMode == "webgl")
            nn.Device.shared.isCanvas = false;
    };
    // 启动原生程序
    nn.loader.nativestart = function () {
        // 创建舞台
        _AppStage.Init();
        // 运行原始的入口
        egret.runEgret();
    };
    // 启动runtime版本
    nn.loader.runtimestart = function () {
        // 创建舞台
        _AppStage.Init();
        // 运行原始的入口
        egret.runEgret();
    };
})(nn || (nn = {}));
var nn;
(function (nn) {
    var ExtHtmlTextParser = (function (_super) {
        __extends(ExtHtmlTextParser, _super);
        function ExtHtmlTextParser() {
            var _this = _super.call(this) || this;
            _this['replaceArr'].push([/\\n/g, "\n"]);
            _this['replaceArr'].push([/\\t/g, "\t"]);
            return _this;
        }
        ExtHtmlTextParser.prototype.parser = function (htmltext) {
            var r = null;
            try {
                r = _super.prototype.parser.call(this, htmltext);
            }
            catch (e) {
                nn.exception(e, 'HtmlTextParser出错');
            }
            return r;
        };
        return ExtHtmlTextParser;
    }(egret.HtmlTextParser));
    nn.ExtHtmlTextParser = ExtHtmlTextParser;
    var ExtTextField = (function (_super) {
        __extends(ExtTextField, _super);
        function ExtTextField() {
            var _this = _super.call(this) || this;
            _this.width = 0;
            _this.height = 0;
            return _this;
        }
        return ExtTextField;
    }(egret.TextField));
    // 用来计算富文本格式尺寸
    var __gs_label4calc = new egret.TextField();
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label() {
            var _this = _super.call(this) || this;
            _this._lbl = new ExtTextField();
            _this._lineSpacing = 0;
            _this.fontSize = nn.CLabel.FontSize;
            _this._lbl.touchEnabled = true;
            _this._lbl.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this._imp.addChild(_this._lbl);
            return _this;
        }
        Label.prototype._signalConnected = function (sig, s) {
            _super.prototype._signalConnected.call(this, sig, s);
            if (sig == nn.SignalAction) {
                this.touchEnabled = true;
                nn.EventHook(this._lbl, egret.TextEvent.LINK, this.__lbl_link, this);
            }
        };
        // 文本框的实现比其它空间特殊，因为会输入或者直接点击，所以需要返回的是实现的实体
        Label.prototype.hitTestClient = function (x, y) {
            return _super.prototype.hitTestClient.call(this, x, y) ? this._imp : null;
        };
        Label.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            this.impSetFrame(this.boundsForLayout(), this._lbl);
            this._scaleToFit && this.doScaleToFit();
            this.updateCache();
        };
        Object.defineProperty(Label.prototype, "bold", {
            get: function () {
                return this._lbl.bold;
            },
            set: function (b) {
                this._lbl.bold = b;
                this.updateCache();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "italic", {
            get: function () {
                return this._lbl.italic;
            },
            set: function (b) {
                this._lbl.italic = b;
                this.updateCache();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "stroke", {
            get: function () {
                return this._lbl.stroke;
            },
            set: function (width) {
                this._lbl.stroke = width;
                this.updateCache();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "strokeColor", {
            get: function () {
                return this._lbl.strokeColor;
            },
            set: function (color) {
                this._lbl.strokeColor = nn.GetColorComponent(color)[0];
                this.updateCache();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "lineSpacing", {
            get: function () {
                return this._lineSpacing * nn.ScaleFactorDeS;
            },
            set: function (v) {
                this._lineSpacing = v * nn.ScaleFactorS;
                this._lbl.lineSpacing = this._lineSpacing;
                this.updateCache();
            },
            enumerable: true,
            configurable: true
        });
        Label.prototype.bestFrame = function (inrc) {
            var w = inrc ? inrc.width : 0;
            var h = inrc ? inrc.height : 0;
            var rc;
            if (this._lbl.textFlow) {
                __gs_label4calc.multiline = this._lbl.multiline;
                __gs_label4calc.size = this._lbl.size;
                __gs_label4calc.fontFamily = this._lbl.fontFamily;
                __gs_label4calc.lineSpacing = this._lbl.lineSpacing;
                __gs_label4calc.width = w * nn.ScaleFactorW;
                __gs_label4calc.height = h * nn.ScaleFactorH;
                __gs_label4calc.textFlow = this._lbl.textFlow;
                rc = new nn.Rect(0, 0, __gs_label4calc.textWidth + 1, //避免integral时产生的舍入误差
                __gs_label4calc.textHeight + 1)
                    .unapplyScaleFactor();
            }
            else {
                rc = nn.Font.sizeFitString(this.text, this.fontSize, w, h, this.lineSpacing).toRect();
            }
            if (this.edgeInsets)
                return rc.unapplyEdgeInsets(this.edgeInsets);
            return rc;
        };
        Label.prototype._setFontSize = function (v) {
            if (this._tfnsz == v)
                return;
            this._tfnsz = v * nn.ScaleFactorS;
            this._lbl.size = this._tfnsz;
            this.updateCache();
        };
        Object.defineProperty(Label.prototype, "fontSize", {
            get: function () {
                return this._lbl.size * nn.ScaleFactorDeS;
            },
            set: function (v) {
                this._setFontSize(v);
            },
            enumerable: true,
            configurable: true
        });
        Label.prototype._setTextAlign = function (a) {
            this._lbl.textAlign = a;
            this.updateCache();
        };
        Label.prototype._setTextSide = function (s) {
            this._lbl.verticalAlign = s;
            this.updateCache();
        };
        Object.defineProperty(Label.prototype, "textAlign", {
            get: function () {
                return this._lbl.textAlign;
            },
            set: function (a) {
                this._setTextAlign(a);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "textSide", {
            get: function () {
                return this._lbl.verticalAlign;
            },
            set: function (s) {
                this._setTextSide(s);
            },
            enumerable: true,
            configurable: true
        });
        Label.prototype._setText = function (s) {
            if (this._lbl.text == s)
                return false;
            if (this._htmlText)
                this._htmlText = undefined;
            this._lbl.text = s;
            this._scaleToFit && this.doScaleToFit();
            this.updateCache();
            return true;
        };
        Object.defineProperty(Label.prototype, "text", {
            get: function () {
                return this._lbl.text;
            },
            set: function (s) {
                this._setText(s);
                if (this._signals)
                    this._signals.emit(nn.SignalChanged, s);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "attributedText", {
            get: function () {
                return this._lbl.textFlow;
            },
            set: function (arr) {
                this._htmlText = undefined;
                this._lbl.textFlow = arr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "htmlText", {
            get: function () {
                return this._htmlText;
            },
            set: function (html) {
                if (this._htmlText == html)
                    return;
                // 为了解决egret的html不能<>不匹配的bug
                if (nn.StringT.Count(html, '<') != nn.StringT.Count(html, '>'))
                    return;
                var data = new ExtHtmlTextParser().parser(html);
                this._setTextFlow(data);
                if (this._signals)
                    this._signals.emit(nn.SignalChanged, html);
            },
            enumerable: true,
            configurable: true
        });
        Label.prototype._setTextFlow = function (tf) {
            // 调整一下字体缩放            
            tf && tf.forEach(function (te) {
                var s = te.style;
                if (s && s.size != null) {
                    s.size *= nn.ScaleFactorS;
                }
            });
            this._lbl.textFlow = tf;
        };
        Object.defineProperty(Label.prototype, "textColor", {
            get: function () {
                return this._lbl.textColor;
            },
            set: function (v) {
                this._lbl.textColor = nn.GetColorComponent(v)[0];
                this.updateCache();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "fontFamily", {
            get: function () {
                return this._lbl.fontFamily;
            },
            set: function (s) {
                this._lbl.fontFamily = s;
                this.updateCache();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "numlines", {
            get: function () {
                return this._lbl.numLines;
            },
            set: function (v) {
                if (v == -1 || v > 1) {
                    if (this._scaleToFit)
                        return;
                    this._lbl.multiline = true;
                }
                else {
                    this._lbl.multiline = false;
                }
                this.updateCache();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "multilines", {
            get: function () {
                return this._lbl.multiline;
            },
            set: function (b) {
                if (this._lbl.multiline == b)
                    return;
                this._lbl.multiline = b;
                this.updateCache();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "textFlow", {
            get: function () {
                return this._lbl.textFlow;
            },
            set: function (arr) {
                this._lbl.textFlow = arr;
                this.updateCache();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "scaleToFit", {
            get: function () {
                return this._scaleToFit;
            },
            set: function (v) {
                if (v == this._scaleToFit)
                    return;
                if (v && this._lbl.multiline) {
                    return;
                }
                this._scaleToFit = v;
                v && this.doScaleToFit();
            },
            enumerable: true,
            configurable: true
        });
        Label.prototype.doScaleToFit = function () {
            var str = this.text;
            if (str.length == 0)
                return;
            var rc = this.boundsForLayout();
            var w = rc.width / str.length * nn.ScaleFactorS;
            if (w > this._lbl.size) {
                if (this._lbl.size != this._tfnsz) {
                    this._lbl.size = this._tfnsz;
                    this.updateCache();
                }
            }
            else {
                this._lbl.size = w;
                this.updateCache();
            }
        };
        Label.prototype.appendText = function (s) {
            this._lbl.appendText(s);
            this.updateCache();
        };
        Label.prototype.href = function (re, cb, ctx) {
            if (this._links == null) {
                this._links = new Array();
                // 打开link点击的监听
                this.touchEnabled = true;
                nn.EventHook(this._lbl, egret.TextEvent.LINK, this.__lbl_link, this);
            }
            var c = new nn.Closure(cb, ctx);
            c.payload = re;
            this._links.push(c);
        };
        Label.prototype.__lbl_link = function (e) {
            var link = e.text;
            nn.noti("点击链接 " + link);
            this.signals.emit(nn.SignalAction, link);
            // 直接回调
            if (this._links) {
                this._links.forEach(function (c) {
                    var r = c.payload;
                    if (link.match(r))
                        r.invoke(link);
                });
            }
        };
        return Label;
    }(nn.CLabel));
    nn.Label = Label;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var CDom = (function (_super) {
        __extends(CDom, _super);
        function CDom() {
            return _super.apply(this, arguments) || this;
        }
        return CDom;
    }(nn.Component));
    nn.CDom = CDom;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var HtmlBuilder = (function () {
        function HtmlBuilder() {
            this._buf = '';
        }
        HtmlBuilder.prototype.enter = function (element) {
            this._ele = element;
            this._buf += '<' + element + ' ';
            return this;
        };
        HtmlBuilder.prototype.pop = function () {
            if (this._style)
                this._buf += 'style="' + this._style + '" ';
            this._buf += '>';
            if (this._text)
                this._buf += this._text;
            this._buf += '</' + this._ele + '>';
            return this;
        };
        HtmlBuilder.prototype.style = function (key, value) {
            if (this._style == null)
                this._style = '';
            this._style += key + ':' + value + ';';
            return this;
        };
        HtmlBuilder.prototype.attr = function (key, value) {
            this._buf += key + '=';
            var strval = value;
            if (typeof (value) == 'string' && strval.length && strval[0] != '#')
                this._buf += '"' + value + '" ';
            else
                this._buf += value + ' ';
            return this;
        };
        HtmlBuilder.prototype.text = function (str) {
            this._text = str;
            return this;
        };
        HtmlBuilder.prototype.toString = function () {
            return this._buf;
        };
        return HtmlBuilder;
    }());
    nn.HtmlBuilder = HtmlBuilder;
    function getEvent(stop) {
        var ret;
        if (window.event) {
            ret = window.event;
        }
        else {
            var e = arguments.callee.caller;
            while (e.caller != null) {
                e = e.caller;
            }
            ret = e.arguments[0];
        }
        if (stop)
            ret.stopImmediatePropagation();
        return ret;
    }
    var dom;
    (function (dom_1) {
        function getElementById(id) {
            if (typeof (id) == 'string')
                return document.getElementById(id);
            return id;
        }
        dom_1.getElementById = getElementById;
        var DomObject = (function (_super) {
            __extends(DomObject, _super);
            function DomObject(id) {
                var _this = _super.call(this) || this;
                _this._visible = true;
                _this.nodes = new Array();
                if (id)
                    _this.node = getElementById(id);
                return _this;
            }
            DomObject.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                if (this._listeners) {
                    nn.MapT.Clear(this._listeners);
                }
            };
            DomObject.From = function (id) {
                return new DomObject(id);
            };
            DomObject.prototype._initSignals = function () {
                _super.prototype._initSignals.call(this);
                this._signals.delegate = this;
                this._signals.register(nn.SignalClicked);
            };
            DomObject.prototype._signalConnected = function (sig) {
                switch (sig) {
                    case nn.SignalClicked:
                        {
                            this.setAttr("onclick", this.method('__dom_clicked'));
                        }
                        break;
                }
            };
            DomObject.prototype.__dom_clicked = function () {
                this.event = getEvent(true);
                this._signals && this._signals.emit(nn.SignalClicked);
            };
            DomObject.prototype.updateData = function () { };
            Object.defineProperty(DomObject.prototype, "css", {
                get: function () {
                    return this._node.style.cssText;
                },
                set: function (v) {
                    this._node.style.cssText = v;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomObject.prototype, "style", {
                get: function () {
                    if (this._style == null)
                        this._style = this._node.style;
                    return this._style;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomObject.prototype, "content", {
                get: function () {
                    return this._node.textContent;
                },
                set: function (v) {
                    this._node.textContent = v;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomObject.prototype, "id", {
                get: function () {
                    return this.getAttr('id');
                },
                set: function (v) {
                    this.setAttr('id', v);
                },
                enumerable: true,
                configurable: true
            });
            DomObject.prototype.getAttr = function (k, def) {
                var v = this._node.getAttribute(k);
                return v == null ? def : v;
            };
            DomObject.prototype.setAttr = function (k, v) {
                this._node.setAttribute(k, v);
            };
            Object.defineProperty(DomObject.prototype, "fontSize", {
                get: function () {
                    return this._fontSize * dom_1.ScaleFactorDeSize;
                },
                set: function (v) {
                    if (this._fontSize == v)
                        return;
                    this._fontSize = v;
                    this._node.style.fontSize = v * dom_1.ScaleFactorSize + 'em';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomObject.prototype, "src", {
                get: function () {
                    return this._src;
                },
                set: function (s) {
                    this._src = s;
                    this._node.style.src = 'url(' + s + ')';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomObject.prototype, "width", {
                get: function () {
                    return this._node.clientWidth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomObject.prototype, "height", {
                get: function () {
                    return this._node.clientHeight;
                },
                enumerable: true,
                configurable: true
            });
            DomObject.prototype.add = function (node) {
                node.parent = this;
                this._node.appendChild(node._node);
                this.nodes.push(node);
                node.preload(function () {
                    node.onLoaded();
                }, this);
                return this;
            };
            DomObject.prototype.preload = function (cb, ctx) {
                cb.call(ctx);
            };
            DomObject.prototype.onLoaded = function () { };
            DomObject.prototype.br = function () {
                this._node.appendChild(document.createElement('br'));
            };
            DomObject.prototype.remove = function (node) {
                if (node.parent != this)
                    return;
                node._node.parentElement.removeChild(node._node);
                node.parent = null;
                nn.ArrayT.RemoveObject(this.nodes, node);
                // 移除即代表析构
                nn.drop(node);
            };
            DomObject.prototype.removeFromParent = function () {
                if (this.parent)
                    this.parent.remove(this);
            };
            Object.defineProperty(DomObject.prototype, "visible", {
                get: function () {
                    return this._visible;
                },
                set: function (b) {
                    if (b == this._visible)
                        return;
                    this._visible = b;
                    this._node.style.display = b ? 'block' : 'none';
                },
                enumerable: true,
                configurable: true
            });
            DomObject.prototype.setFrame = function (rc) {
                if (this._node.style.position != 'absolute')
                    this._node.style.position = 'absolute';
                this._node.style.left = rc.x + 'px';
                this._node.style.top = rc.y + 'px';
                this._node.style.width = rc.width + 'px';
                this._node.style.height = rc.height + 'px';
            };
            Object.defineProperty(DomObject.prototype, "node", {
                get: function () {
                    return this._node;
                },
                set: function (n) {
                    if (n == this._node)
                        return;
                    if (this._node)
                        this.remove(this._node);
                    this._node = n;
                    if (this._node) {
                        this.id = this.hashCode;
                        if (this.parent)
                            this.parent.add(n);
                    }
                },
                enumerable: true,
                configurable: true
            });
            DomObject.prototype.method = function (mtdname) {
                var _this = this;
                if (this.listener(mtdname) == null)
                    this._node[mtdname] = this.bindListener(mtdname, function () {
                        _this[mtdname]();
                    });
                return "document.getElementById(" + this.id + ")['" + mtdname + "']()";
            };
            /** 维护 listener */
            DomObject.prototype.listener = function (idr) {
                return this._listeners ? this._listeners[idr] : undefined;
            };
            DomObject.prototype.bindListener = function (idr, cb) {
                this.listeners[idr] = cb;
                return cb;
            };
            Object.defineProperty(DomObject.prototype, "listeners", {
                get: function () {
                    if (this._listeners == null)
                        this._listeners = new KvObject();
                    return this._listeners;
                },
                enumerable: true,
                configurable: true
            });
            return DomObject;
        }(nn.SObject));
        dom_1.DomObject = DomObject;
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button(id) {
                var _this = _super.call(this, id) || this;
                if (id == null)
                    _this.node = document.createElement('button');
                _this.style.backgroundColor = 'transparent';
                _this.style.border = 'none';
                return _this;
            }
            Object.defineProperty(Button.prototype, "image", {
                get: function () {
                    return this._image;
                },
                set: function (img) {
                    if (this._image == undefined) {
                        this.style.backgroundSize = 'contain';
                        this.style.backgroundPosition = 'center';
                        this.style.backgroundRepeat = 'no-repeat';
                    }
                    this._image = img;
                    this.style.backgroundImage = 'url(' + img + ')';
                },
                enumerable: true,
                configurable: true
            });
            return Button;
        }(DomObject));
        dom_1.Button = Button;
        var Label = (function (_super) {
            __extends(Label, _super);
            function Label(id) {
                var _this = _super.call(this, id) || this;
                if (id == null)
                    _this.node = document.createElement('label');
                _this.fontSize = 1;
                return _this;
            }
            return Label;
        }(DomObject));
        dom_1.Label = Label;
        var Image = (function (_super) {
            __extends(Image, _super);
            function Image(id) {
                var _this = _super.call(this, id) || this;
                if (id == null)
                    _this.node = document.createElement('img');
                return _this;
            }
            return Image;
        }(DomObject));
        dom_1.Image = Image;
        var Sprite = (function (_super) {
            __extends(Sprite, _super);
            function Sprite(id) {
                var _this = _super.call(this, id) || this;
                if (id == null)
                    _this.node = document.createElement('div');
                _this.style.position = 'relative';
                return _this;
            }
            return Sprite;
        }(DomObject));
        dom_1.Sprite = Sprite;
        var Desktop = (function (_super) {
            __extends(Desktop, _super);
            function Desktop(dom, id) {
                var _this = _super.call(this, id) || this;
                if (id == null)
                    _this.node = document.createElement('div');
                _this.contentView = dom;
                var s = _this.style;
                s.position = 'absolute';
                s.zIndex = 0;
                s.width = '100%';
                s.height = '100%';
                s.left = '0px';
                s.top = '0px';
                s.backgroundColor = 'rgba(0,0,0,0.7)';
                _this.signals.connect(nn.SignalClicked, _this.__dsk_clicked, _this);
                return _this;
            }
            Object.defineProperty(Desktop.prototype, "contentView", {
                get: function () {
                    return this._contentView;
                },
                set: function (v) {
                    if (v == this._contentView)
                        return;
                    if (this._contentView) {
                        this._contentView.removeFromParent();
                        this._contentView.signals.disconnectOfTarget(this);
                    }
                    this._contentView = v;
                    if (v) {
                        v.signals.register(nn.SignalRequestClose);
                        v.signals.connect(nn.SignalRequestClose, this.close, this);
                        this.add(v);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Desktop.prototype.open = function () {
                nn.Dom.add(this);
            };
            Desktop.prototype.close = function () {
                this.removeFromParent();
            };
            Desktop.prototype.__dsk_clicked = function () {
                if (this.clickedToClose)
                    this.close();
            };
            return Desktop;
        }(DomObject));
        dom_1.Desktop = Desktop;
        function x(v) {
            return nn.Integral(v * dom_1.ScaleFactorX);
        }
        dom_1.x = x;
        function y(v) {
            return nn.Integral(v * dom_1.ScaleFactorY);
        }
        dom_1.y = y;
        function size(v) {
            return nn.Integral(v * dom_1.ScaleFactorSize);
        }
        dom_1.size = size;
    })(dom = nn.dom || (nn.dom = {}));
    var _Dom = (function (_super) {
        __extends(_Dom, _super);
        function _Dom() {
            var _this = _super.call(this) || this;
            /** 模拟一次点击 */
            _this._waitclick = new nn.Closure(null, null);
            _this.node = document.body;
            return _this;
        }
        _Dom.prototype.updateBounds = function () {
            // 设计尺寸按照 iphone5
            var design = new nn.Size(320, 568);
            var browser = nn.Device.shared.screenBounds;
            dom.ScaleFactorX = browser.width / design.width;
            dom.ScaleFactorY = browser.height / design.height;
            dom.ScaleFactorDeX = 1 / dom.ScaleFactorX;
            dom.ScaleFactorDeY = 1 / dom.ScaleFactorY;
            dom.ScaleFactorSize = Math.min(dom.ScaleFactorX, dom.ScaleFactorY);
            dom.ScaleFactorDeSize = 1 / dom.ScaleFactorDeSize;
        };
        _Dom.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
        };
        /** 打开新页面 */
        _Dom.prototype.openLink = function (url) {
            nn.log("打开新页面：" + url);
            window.open(url);
        };
        /** 模拟一次点击链接 */
        _Dom.prototype.simulateLink = function (url) {
            nn.log("模拟点击链接：" + url);
            //let n = document.createElement('a');
            //n.href = url;
            //n.click();
            try {
                window.top.location.href = url;
            }
            catch (err) {
                location.href = url;
            }
        };
        /** 打开页面 */
        _Dom.prototype.openUrl = function (url) {
            if (nn.Device.shared.isMobile)
                this.simulateLink(url);
            else
                this.openLink(url);
        };
        _Dom.prototype.simulateClick = function (cb, ctx) {
            var n = document.createElement('div');
            if (n == null) {
                cb.call(ctx);
                return;
            }
            this._waitclick.reset(cb, ctx);
            n.style.display = 'none';
            n.setAttribute('id', '::n2::dom::simulateclick');
            n.setAttribute('onclick', this.method('__cb_simulate_click'));
            this.node.appendChild(n);
            n.click();
            n.remove();
        };
        _Dom.prototype.__cb_simulate_click = function () {
            this._waitclick.invoke();
            this._waitclick.reset(null, null);
        };
        return _Dom;
    }(dom.DomObject));
    nn._Dom = _Dom;
    nn.Dom = new _Dom();
})(nn || (nn = {}));
var nn;
(function (nn) {
    nn.COPYRIGHT = "WYBOSYS";
    nn.AUTHOR = "WYBOSYS@GMAIL.COM";
    // 判断版本
    nn.ISHTML5 = egret.Capabilities.runtimeType == "web";
    nn.ISNATIVE = !nn.ISHTML5;
    var CLocation = (function () {
        function CLocation() {
            this.protocol = "http:";
        }
        return CLocation;
    }());
    var CDocument = (function () {
        function CDocument() {
            this.domain = "localhost";
            this.location = new CLocation();
        }
        CDocument.prototype.getElementsByTagName = function (name) {
            return [];
        };
        return CDocument;
    }());
    var CNavigator = (function () {
        function CNavigator() {
            this.platform = "native";
            this.userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53";
        }
        return CNavigator;
    }());
    if (nn.ISNATIVE && typeof (document) == 'undefined') {
        document = new CDocument();
        navigator = new CNavigator();
    }
    nn.ISHTTPS = document.location.protocol == "https:";
    var app = document.getElementsByTagName('app');
    if (app.length) {
        app = app[0];
        nn.APPICON = app.getAttribute('icon');
        nn.APPNAME = app.getAttribute('name');
        var parseContent = function (content) {
            if (content == undefined)
                return;
            var sets = content.replace(/ /g, '').split(',');
            sets.forEach(function (set) {
                if (set.indexOf('=') == -1) {
                    this['__tag_' + set] = true;
                }
                else {
                    var p = set.split('=');
                    this['__tag_' + p[0]] = p[1];
                }
            });
        };
        parseContent(app.getAttribute('content'));
        var children = app.children;
        var def, matched;
        for (var i = 0; i < children.length; ++i) {
            var node = children[i];
            var url = node.getAttribute('url');
            if (url && document.domain.match(url)) {
                matched = true;
                parseContent(node.getAttribute('content'));
            }
            else if (url == undefined) {
                def = node.getAttribute('content');
            }
        }
        ;
        if (!matched)
            parseContent(def);
    }
    else {
        if (nn.ISNATIVE) {
            var p;
            if (p = egret.getOption('debug'))
                __tag_debug = p == 'true';
            if (p = egret.getOption('verbose'))
                __tag_verbose = p == 'true';
            if (p = egret.getOption('version'))
                __tag_version = p;
            if (p = egret.getOption('publish'))
                __tag_publish = p == 'true';
        }
        else {
            alert("没有配置 app 的基础信息");
        }
    }
    // 测试版标志
    nn.ISDEBUG = typeof (__tag_debug) == 'undefined' ? false : __tag_debug;
    // 打印日志标志
    nn.VERBOSE = typeof (__tag_verbose) == 'undefined' ? false : __tag_verbose;
    // 版本号
    nn.APPVERSION = typeof (__tag_version) == 'undefined' ? '' : __tag_version;
    // 发布版本标志
    nn.PUBLISH = typeof (__tag_publish) == 'undefined' ? false : __tag_publish;
    // 如果是runtime，需要提供
    /*
      options[@"debug"] = @"true";
      options[@"verbose"] = @"true";
      options[@"version"] = @"1.0.0";
      options[@"publish"] = @"false";
    */
})(nn || (nn = {}));
var nn;
(function (nn) {
    // RES为单线程模型，所以可以直接扩展来进行加载的排序控制
    // 增加优先级的定义：普通UI资源 > Clip(Bone) 的加载
    var ResPriority;
    (function (ResPriority) {
        ResPriority[ResPriority["NORMAL"] = 0] = "NORMAL";
        ResPriority[ResPriority["CLIP"] = 1] = "CLIP";
    })(ResPriority = nn.ResPriority || (nn.ResPriority = {}));
    ;
    // 不需要做Stack的模式，因为所有获取资源的地方必须传入priority的定义
    nn.ResCurrentPriority = ResPriority.NORMAL;
    var ResType;
    (function (ResType) {
        ResType[ResType["JSON"] = 0] = "JSON";
        ResType[ResType["TEXTURE"] = 1] = "TEXTURE";
        ResType[ResType["TEXT"] = 2] = "TEXT";
        ResType[ResType["FONT"] = 3] = "FONT";
        ResType[ResType["SOUND"] = 4] = "SOUND";
        ResType[ResType["BINARY"] = 5] = "BINARY";
        ResType[ResType["JSREF"] = 6] = "JSREF";
    })(ResType = nn.ResType || (nn.ResType = {}));
    ;
    nn.ResPartKey = "::res::part";
    var ResourceEntity = (function () {
        function ResourceEntity(src, t) {
            this.source = src;
            this.type = t;
        }
        Object.defineProperty(ResourceEntity.prototype, "hashCode", {
            get: function () {
                return nn.StringT.Hash(this.source + ":" + this.type);
            },
            enumerable: true,
            configurable: true
        });
        return ResourceEntity;
    }());
    nn.ResourceEntity = ResourceEntity;
    // 检查是否属于uri的规范
    var WebUriCheckPattern = /^([\w]+):\/\/(.+)$/i;
    // 资源包
    var CResCapsule = (function (_super) {
        __extends(CResCapsule, _super);
        function CResCapsule(reqres) {
            var _this = _super.call(this) || this;
            _this._reqRes = reqres;
            return _this;
        }
        CResCapsule.prototype.dispose = function () {
            this._reqRes = undefined;
            _super.prototype.dispose.call(this);
        };
        CResCapsule.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalDone);
            this._signals.register(nn.SignalFailed);
            this._signals.register(nn.SignalChanged);
        };
        CResCapsule.prototype.load = function (cb, ctx) {
            var _this = this;
            // 如果为空，直接回调
            if (nn.IsEmpty(this._reqRes)) {
                if (cb)
                    cb.call(ctx);
                return;
            }
            // 监听结束的消息
            if (cb)
                this.signals.connect(nn.SignalDone, cb, ctx);
            // 如果正在加载，则直接返回等待
            if (this._isloading)
                return;
            this._isloading = true;
            this._total = this.total();
            this._idx = 0;
            // 直接一次性加载所有的资源
            var reqid = 0;
            this._reqRes.forEach(function (e) {
                if (e == null)
                    return;
                _this.loadOne(e, function () {
                    if (_this._reqRes.length != ++reqid)
                        return;
                    // 加载完成
                    // 移除时会自动析构，需要保护生命期
                    _this.grab();
                    // 从管理器中移除
                    nn.ResManager.removeCapsule(_this);
                    // 完成加载
                    _this._isloading = false;
                    // 回调结束的事件
                    _this.signals.emit(nn.SignalDone);
                    _this.drop();
                }, _this);
            });
        };
        CResCapsule.prototype.hashKey = function () {
            return CResCapsule.HashKey(this._reqRes);
        };
        CResCapsule.HashKey = function (reqres) {
            var a = [];
            reqres.forEach(function (rr) {
                if (rr instanceof ResourceEntity)
                    a.push(rr.hashCode);
                else
                    a.push(rr);
            });
            return nn.StringT.Hash(a.join('::'));
        };
        return CResCapsule;
    }(nn.SObject));
    nn.CResCapsule = CResCapsule;
    var CResManager = (function (_super) {
        __extends(CResManager, _super);
        function CResManager() {
            return _super.call(this) || this;
        }
        Object.defineProperty(CResManager.prototype, "directory", {
            get: function () {
                return this._directory;
            },
            set: function (nm) {
                this._directory = nm;
                // 仿照 android，不同尺寸适配不同分辨率的资源
                if (this.multiRes) {
                    switch (nn.Device.shared.screenType) {
                        case nn.ScreenType.NORMAL: break;
                        case nn.ScreenType.LOW:
                            this._directory += '_m';
                            break;
                        case nn.ScreenType.EXTRALOW:
                            this._directory += '_l';
                            break;
                        case nn.ScreenType.EXTRAHIGH:
                            this._directory += '_xh';
                            break;
                        case nn.ScreenType.HIGH:
                            this._directory += '_h';
                            break;
                    }
                }
                // 如果是发布模式，则使用发布图片
                if (nn.PUBLISH) {
                    // RELEASE模式下才需要拼装资源目录
                    if (!nn.ISDEBUG)
                        this._directory = this._directory + '_' + nn.APPVERSION;
                }
                // 保护一下路径末尾
                this._directory += '/';
            },
            enumerable: true,
            configurable: true
        });
        /** 根据 src - type 的对照数组来加载资源数组 */
        CResManager.prototype.getSources = function (srcs, priority, cb, ctx) {
            var _this = this;
            if (nn.length(srcs) == 0) {
                cb.call(ctx, []);
                return;
            }
            var res = [];
            var proc = function (src, idx) {
                _this.getSourceByType(src[0], priority, function (ds) {
                    res.push(ds);
                    if (++idx == srcs.length) {
                        cb.call(ctx, res);
                    }
                    else {
                        proc(srcs[idx], idx);
                    }
                }, _this, src[1]);
            };
            proc(srcs[0], 0);
        };
        /** 根据类型来获得指定的资源 */
        CResManager.prototype.getSourceByType = function (src, priority, cb, ctx, type) {
            if (src == null) {
                cb.call(ctx, new nn.CacheRecord());
                return;
            }
            // 处理特殊类型
            if (type == ResType.JSREF) {
                nn.Scripts.require(src, function () {
                    cb.call(ctx);
                }, this);
                return;
            }
            // 附加参数
            var part;
            // 判断是否有附加控制用 # 来隔开
            var parts = src.split('#');
            src = parts[0];
            part = parts[1];
            // 如果是 uri
            var res = src.match(WebUriCheckPattern);
            if (res != null) {
                var scheme = res[1];
                var path = res[2];
                if (scheme == 'http' || scheme == 'https') {
                    this.getResByUrl(src, priority, function (rcd) {
                        rcd.prop(nn.ResPartKey, part);
                        cb.call(ctx, rcd);
                    }, this, type);
                }
                else if (scheme == 'file') {
                    this.getResByUrl(path, priority, function (rcd) {
                        rcd.prop(nn.ResPartKey, part);
                        cb.call(ctx, rcd);
                    }, this, type);
                }
                else if (scheme == 'assets') {
                    var url = this.directory + 'assets/' + path;
                    this.getResByUrl(url, priority, function (rcd) {
                        rcd.prop(nn.ResPartKey, part);
                        cb.call(ctx, rcd);
                    }, this, type);
                }
            }
            else {
                var rcd = nn.ResManager.tryGetRes(src);
                // 如果直接取得了 Res，则直接设定，否则需要通过异步来取得对应的资源
                if (rcd.val != null) {
                    rcd.prop(nn.ResPartKey, part);
                    cb.call(ctx, rcd);
                }
                else {
                    nn.ResManager.getResAsync(src, priority, function (rcd) {
                        rcd.prop(nn.ResPartKey, part);
                        cb.call(ctx, rcd);
                    }, this);
                }
            }
        };
        CResManager.prototype.getJson = function (src, priority, cb, ctx) {
            this.getSourceByType(src, priority, cb, ctx, ResType.JSON);
        };
        CResManager.prototype.getText = function (src, priority, cb, ctx) {
            this.getSourceByType(src, priority, cb, ctx, ResType.TEXT);
        };
        CResManager.prototype.getTexture = function (src, priority, cb, ctx) {
            if (src instanceof nn.COriginType) {
                var t = new nn.CacheRecord();
                t.val = src.imp;
                cb.call(ctx, t);
                return;
            }
            this.getSourceByType(src, priority, cb, ctx, ResType.TEXTURE);
        };
        CResManager.prototype.getBitmapFont = function (src, priority, cb, ctx) {
            if (src instanceof nn.COriginType) {
                var t = new nn.CacheRecord();
                t.val = src.imp;
                cb.call(ctx, t);
                return;
            }
            this.getSourceByType(src, priority, cb, ctx, ResType.FONT);
        };
        CResManager.prototype.getSound = function (src, priority, cb, ctx) {
            if (src instanceof nn.COriginType) {
                var t = new nn.CacheRecord();
                t.val = src.imp;
                cb.call(ctx, t);
                return;
            }
            this.getSourceByType(src, priority, cb, ctx, ResType.SOUND);
        };
        CResManager.prototype.getBinary = function (src, priority, cb, ctx) {
            this.getSourceByType(src, priority, cb, ctx, ResType.BINARY);
        };
        return CResManager;
    }(nn.SObject));
    nn.CResManager = CResManager;
    /** 使用约定的方式获取资源名称 */
    var ResName = (function () {
        function ResName() {
        }
        /** 普通 */
        ResName.normal = function (name) {
            return name.replace('_hl', '');
        };
        /** 高亮 */
        ResName.hl = function (name) {
            return this.normal(name) + '_hl';
        };
        return ResName;
    }());
    nn.ResName = ResName;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var svc;
    (function (svc) {
        // Service 支持的功能
        var Feature;
        (function (Feature) {
            Feature[Feature["SHARE"] = 0] = "SHARE";
            Feature[Feature["PAY"] = 1] = "PAY";
            Feature[Feature["LOGIN"] = 2] = "LOGIN";
            Feature[Feature["SWITCHUSER"] = 3] = "SWITCHUSER";
            Feature[Feature["PROFILE"] = 4] = "PROFILE";
            Feature[Feature["AUTH"] = 5] = "AUTH";
            Feature[Feature["LOGOUT"] = 6] = "LOGOUT";
            Feature[Feature["REPORT"] = 7] = "REPORT";
            Feature[Feature["LOADING"] = 8] = "LOADING";
            Feature[Feature["GETAPP"] = 9] = "GETAPP";
            Feature[Feature["BIND"] = 10] = "BIND";
            Feature[Feature["SUBSCRIBE"] = 11] = "SUBSCRIBE";
            Feature[Feature["DESKTOP"] = 12] = "DESKTOP";
            Feature[Feature["BBS"] = 13] = "BBS";
            Feature[Feature["STATUS"] = 14] = "STATUS";
            Feature[Feature["CUSTOMER"] = 15] = "CUSTOMER";
            Feature[Feature["LANZUAN"] = 16] = "LANZUAN";
        })(Feature = svc.Feature || (svc.Feature = {}));
        ;
        // 当前已知的平台
        var Platform;
        (function (Platform) {
            Platform[Platform["XHB"] = 0] = "XHB";
            Platform[Platform["WANBA"] = 1] = "WANBA";
            Platform[Platform["QQGAME"] = 2] = "QQGAME";
            Platform[Platform["QQBROWSER"] = 3] = "QQBROWSER";
            Platform[Platform["X360"] = 4] = "X360";
            Platform[Platform["X360ZS"] = 5] = "X360ZS";
            Platform[Platform["MOCK"] = 6] = "MOCK";
        })(Platform = svc.Platform || (svc.Platform = {}));
        ;
        var Content = (function () {
            function Content() {
            }
            return Content;
        }());
        svc.Content = Content;
        /** 支付的数据 */
        var PayContent = (function (_super) {
            __extends(PayContent, _super);
            function PayContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'pay';
                return _this;
            }
            return PayContent;
        }(Content));
        svc.PayContent = PayContent;
        /** 分享的数据 */
        var ShareContent = (function (_super) {
            __extends(ShareContent, _super);
            function ShareContent() {
                var _this = _super.apply(this, arguments) || this;
                /** 分享出去的链接 */
                _this.url = '';
                /** 分享出去的图片 */
                _this.image = '';
                /** 分享出去的标题 */
                _this.title = '';
                /** 分享出去的内容 */
                _this.detail = '';
                _this.proc = 'share';
                return _this;
            }
            return ShareContent;
        }(Content));
        svc.ShareContent = ShareContent;
        /** 登陆到sdk, 一些SDK的特殊要求也放在这里面处理 */
        var LoginContent = (function (_super) {
            __extends(LoginContent, _super);
            function LoginContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'login';
                return _this;
            }
            return LoginContent;
        }(Content));
        svc.LoginContent = LoginContent;
        /** 第三方平台上的用户信息 */
        var ProfileContent = (function (_super) {
            __extends(ProfileContent, _super);
            function ProfileContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'profile';
                return _this;
            }
            return ProfileContent;
        }(Content));
        svc.ProfileContent = ProfileContent;
        /** 状态 */
        var StatusContent = (function (_super) {
            __extends(StatusContent, _super);
            function StatusContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'status';
                return _this;
            }
            /** 兑换 */
            StatusContent.prototype.excharge = function (v) {
                if (this.monetaryDiscount != null)
                    return v * this.monetaryRate * this.monetaryDiscount;
                return v * this.monetaryRate;
            };
            return StatusContent;
        }(Content));
        svc.StatusContent = StatusContent;
        /** 登出 */
        var LogoutContent = (function (_super) {
            __extends(LogoutContent, _super);
            function LogoutContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'logout';
                return _this;
            }
            return LogoutContent;
        }(Content));
        svc.LogoutContent = LogoutContent;
        /** 切换账号 */
        var SwitchUserContent = (function (_super) {
            __extends(SwitchUserContent, _super);
            function SwitchUserContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'switchuser';
                return _this;
            }
            return SwitchUserContent;
        }(Content));
        svc.SwitchUserContent = SwitchUserContent;
        /** 加载进度 */
        var LoadingContent = (function (_super) {
            __extends(LoadingContent, _super);
            function LoadingContent(t, c) {
                var _this = _super.call(this) || this;
                _this.proc = 'loading';
                _this.total = t;
                _this.current = c;
                return _this;
            }
            return LoadingContent;
        }(Content));
        svc.LoadingContent = LoadingContent;
        /** 授权信息 */
        var AuthContent = (function (_super) {
            __extends(AuthContent, _super);
            function AuthContent() {
                var _this = _super.apply(this, arguments) || this;
                /** 游戏在渠道的标志 */
                _this.app = '';
                /** 授权的id */
                _this.pid = '';
                /** 渠道号 */
                _this.channel = 0;
                /** 授权类型 */
                _this.type = 0;
                /** 授权key */
                _this.key = '';
                /** 凭据 */
                _this.ticket = '';
                /** 时间戳 */
                _this.timestamp = '';
                /** 随机串 */
                _this.nonce = '';
                /** 授权签名 */
                _this.signature = '';
                _this.proc = 'auth';
                return _this;
            }
            return AuthContent;
        }(Content));
        svc.AuthContent = AuthContent;
        /** 游戏汇报信息 */
        var ReportType;
        (function (ReportType) {
            ReportType[ReportType["LOGIN"] = 0] = "LOGIN";
            ReportType[ReportType["ROLE"] = 1] = "ROLE";
            ReportType[ReportType["UPGRADE"] = 2] = "UPGRADE";
            ReportType[ReportType["PROGRESS"] = 3] = "PROGRESS";
            ReportType[ReportType["SCORE"] = 4] = "SCORE";
        })(ReportType = svc.ReportType || (svc.ReportType = {}));
        /** 提交信息 */
        var ReportContent = (function (_super) {
            __extends(ReportContent, _super);
            function ReportContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'report';
                return _this;
            }
            return ReportContent;
        }(Content));
        svc.ReportContent = ReportContent;
        /** 绑定手机 */
        var BindContent = (function (_super) {
            __extends(BindContent, _super);
            function BindContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'bind';
                return _this;
            }
            return BindContent;
        }(Content));
        svc.BindContent = BindContent;
        /** 打开论坛 */
        var BBSContent = (function (_super) {
            __extends(BBSContent, _super);
            function BBSContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'bbs';
                return _this;
            }
            return BBSContent;
        }(Content));
        svc.BBSContent = BBSContent;
        /** 添加关注 */
        var SubscribeContent = (function (_super) {
            __extends(SubscribeContent, _super);
            function SubscribeContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'subscribe';
                return _this;
            }
            return SubscribeContent;
        }(Content));
        svc.SubscribeContent = SubscribeContent;
        /** 下载微端 */
        var GetAppContent = (function (_super) {
            __extends(GetAppContent, _super);
            function GetAppContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'getapp';
                return _this;
            }
            return GetAppContent;
        }(Content));
        svc.GetAppContent = GetAppContent;
        /** 保存到桌面 */
        var SendToDesktopContent = (function (_super) {
            __extends(SendToDesktopContent, _super);
            function SendToDesktopContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'sendtodesktop';
                return _this;
            }
            return SendToDesktopContent;
        }(Content));
        svc.SendToDesktopContent = SendToDesktopContent;
        var LanZuanContent = (function (_super) {
            __extends(LanZuanContent, _super);
            function LanZuanContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'lanzuan';
                return _this;
            }
            return LanZuanContent;
        }(Content));
        svc.LanZuanContent = LanZuanContent;
        var LanZuanXuFeiContent = (function (_super) {
            __extends(LanZuanXuFeiContent, _super);
            function LanZuanXuFeiContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'lanzuanxufei';
                return _this;
            }
            return LanZuanXuFeiContent;
        }(Content));
        svc.LanZuanXuFeiContent = LanZuanXuFeiContent;
        // 收到了新的客服消息
        svc.SignalMessagesGot = "::nn::service::messages::got";
        // 平台支持的状态变化
        svc.SignalStatusChanged = "::nn::service::status::changed";
        var Message = (function () {
            function Message() {
            }
            return Message;
        }());
        svc.Message = Message;
        /** 打开客服系统 */
        var CustomerContent = (function (_super) {
            __extends(CustomerContent, _super);
            function CustomerContent() {
                var _this = _super.apply(this, arguments) || this;
                _this.proc = 'customer';
                return _this;
            }
            return CustomerContent;
        }(Content));
        svc.CustomerContent = CustomerContent;
        /** 发送客服聊天
            @note 基类的参数就不需要传了
         */
        var SendCustomerContent = (function (_super) {
            __extends(SendCustomerContent, _super);
            function SendCustomerContent() {
                return _super.apply(this, arguments) || this;
            }
            return SendCustomerContent;
        }(CustomerContent));
        svc.SendCustomerContent = SendCustomerContent;
        var Service = (function (_super) {
            __extends(Service, _super);
            function Service() {
                return _super.call(this) || this;
            }
            Service.prototype._initSignals = function () {
                _super.prototype._initSignals.call(this);
                this._signals.register(svc.SignalMessagesGot);
                this._signals.register(svc.SignalStatusChanged);
            };
            /** 查询是否支持该功能 */
            Service.prototype.support = function (feature) {
                return false;
            };
            /** 调用功能 */
            Service.prototype.fetch = function (c) {
                var fun = this[c.proc];
                if (fun == null) {
                    nn.fatal("没有找到Service中对应Content的处理方法");
                    return;
                }
                fun.call(this, c);
            };
            Service.Prepare = function (cb, ctx) {
                cb.call(ctx);
            };
            Service.prototype.toString = function () {
                return [
                    'id: ' + nn.ObjectClass(this).ID,
                    'description: ' + nn.ObjectClass(this).DESCRIPTION.NAME,
                    'class: ' + nn.Classname(this)
                ].join('\n');
            };
            return Service;
        }(nn.SObject));
        /** 服务的唯一标示 */
        Service.ID = "";
        Service.QQAPPID = "";
        svc.Service = Service;
        var Signature = (function () {
            function Signature() {
            }
            /** 签名成功
                @data 签名得到的数据
             */
            Signature.prototype.next = function (data) {
                this.cb.call(this.ctx, data);
            };
            return Signature;
        }());
        svc.Signature = Signature;
    })(svc = nn.svc || (nn.svc = {}));
})(nn || (nn = {}));
(function (nn) {
    var _ContentWrapper = (function (_super) {
        __extends(_ContentWrapper, _super);
        function _ContentWrapper(cnt) {
            var _this = _super.call(this, cnt) || this;
            _this.signals.register(nn.SignalSucceed);
            _this.signals.register(nn.SignalFailed);
            return _this;
        }
        return _ContentWrapper;
    }(nn.SObjectWrapper));
    var ServicesManager = (function (_super) {
        __extends(ServicesManager, _super);
        function ServicesManager() {
            var _this = _super.call(this) || this;
            // 当前服务的实例
            _this._service = null;
            return _this;
        }
        ServicesManager.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
        };
        ServicesManager.prototype.dispose = function () {
            this._service = nn.drop(this._service);
            _super.prototype.dispose.call(this);
        };
        /** 注册可用的service列表
            @note 默认manager会遍历当前可用的第一个service
        */
        ServicesManager.register = function (cls) {
            this._SERVICES.push(cls);
        };
        /** 绑定平台的签名接口
            @note 部分平台需要对参数进行加密后再传回去，所以需要提供一个签名函数
        */
        ServicesManager.prototype.bindSignature = function (fun, ctx) {
            this._sigfun = fun;
            this._sigctx = ctx;
        };
        /** 调用签名
            @note 和bind配对使用 */
        ServicesManager.prototype.signature = function (cnt, cb, ctx) {
            var pl = new nn.svc.Signature();
            pl.content = cnt;
            pl.cb = cb;
            pl.ctx = ctx;
            this._sigfun.call(this._sigctx, pl);
        };
        Object.defineProperty(ServicesManager.prototype, "service", {
            get: function () {
                return this._service;
            },
            enumerable: true,
            configurable: true
        });
        /** 获得支持的特性 */
        ServicesManager.support = function (feature) {
            return this._shared._service.support(feature);
        };
        ServicesManager.fetch = function () {
            var _this = this;
            var p = arguments;
            var cnt = p[0];
            var suc = p[1];
            var failed;
            var ctx;
            if (typeof (p[2]) == 'function') {
                failed = p[2];
                ctx = p[3];
            }
            else {
                failed = null;
                ctx = p[2];
            }
            var cls = nn.ObjectClass(this._shared._service);
            if (cls.prepared) {
                this.doFetch(cnt, suc, failed, ctx);
            }
            else {
                cls.Prepare(function () {
                    cls.prepared = true;
                    _this.doFetch(cnt, suc, failed, ctx);
                }, this);
            }
        };
        ServicesManager.doFetch = function (cnt, suc, failed, ctx) {
            // 解耦合content的生命期
            new _ContentWrapper(cnt);
            if (ctx)
                cnt.attach(ctx);
            if (suc)
                cnt.signals.connect(nn.SignalSucceed, suc, ctx);
            if (failed)
                cnt.signals.connect(nn.SignalFailed, failed, ctx);
            // 不能放到try中，防止出问题不能断在出问题的地方
            this._shared._service.fetch(cnt);
        };
        /** 设置成默认的实现
            @param cls 默认使用的服务类型，如果是null则使用manager选择的服务
        */
        ServicesManager.prototype.setAsDefault = function (cls) {
            if (cls === void 0) { cls = null; }
            if (cls == null)
                cls = this.detectService();
            // 首先检验当前的service类型
            this._service = new cls();
            // 设置为全局
            ServicesManager._shared = this;
            return this;
        };
        Object.defineProperty(ServicesManager, "shared", {
            get: function () {
                return this._shared;
            },
            set: function (v) {
                nn.fatal("不能直接设置");
            },
            enumerable: true,
            configurable: true
        });
        return ServicesManager;
    }(nn.SObject));
    ServicesManager._SERVICES = new Array();
    nn.ServicesManager = ServicesManager;
    var AnyServices = (function (_super) {
        __extends(AnyServices, _super);
        function AnyServices() {
            return _super.apply(this, arguments) || this;
        }
        AnyServices.prototype.detectService = function () {
            var cls = nn.ArrayT.QueryObject(ServicesManager._SERVICES, function (e) {
                return e.IsCurrent();
            });
            nn.assert(cls);
            return cls;
        };
        return AnyServices;
    }(ServicesManager));
    nn.AnyServices = AnyServices;
})(nn || (nn = {}));
var nn;
(function (nn) {
    // 用于穿透整个emit流程的对象
    var SlotTunnel = (function () {
        function SlotTunnel() {
        }
        return SlotTunnel;
    }());
    nn.SlotTunnel = SlotTunnel;
    // 插槽对象
    var Slot = (function () {
        function Slot() {
            /** 激发频率限制 (emits per second) */
            this.eps = 0;
            this.emitedCount = 0;
        }
        Object.defineProperty(Slot.prototype, "veto", {
            get: function () {
                return this._veto;
            },
            set: function (b) {
                this._veto = b;
                if (this.tunnel)
                    this.tunnel.veto = b;
            },
            enumerable: true,
            configurable: true
        });
        Slot.prototype.dispose = function () {
            this.cb = null;
            this.target = null;
            this.sender = null;
            this.data = null;
            this.payload = null;
            this.tunnel = null;
        };
        Slot.prototype.toString = function () {
            var str = "";
            if (this.target) {
                if (this.cb)
                    str += this.cb.toString();
                else
                    (this.redirect);
                str += "'" + this.redirect + "'";
                str += '@' + nn.Classname(this.target);
            }
            else if (this.cb) {
                str += this.cb.toString();
            }
            return str;
        };
        /** 激发信号
            @data 附带的数据，激发后自动解除引用 */
        Slot.prototype.emit = function (data, tunnel) {
            if (this.eps) {
                var now = egret.getTimer();
                if (this._epstms == undefined) {
                    this._epstms = now;
                }
                else {
                    var el = now - this._epstms;
                    //this._epstms = now; 注释以支持快速多次点击中可以按照频率命中一次，而不是全部都忽略掉
                    if ((1000 / el) > this.eps)
                        return;
                    this._epstms = now; //命中一次后重置时间
                }
            }
            this.data = data;
            this.tunnel = tunnel;
            if (this.delay) {
                nn.Delay(this.delay, this.doEmit, this);
            }
            else {
                this.doEmit();
            }
        };
        Slot.prototype.doEmit = function () {
            if (this.target) {
                if (this.cb) {
                    this.cb.call(this.target, this);
                }
                else if (this.redirect && this.target.signals) {
                    this.target.signals.emit(this.redirect, this.data);
                }
            }
            else if (this.cb) {
                this.cb.call(this, this);
            }
            this.data = undefined;
            this.tunnel = undefined;
            ++this.emitedCount;
        };
        Slot.Data = function (d) {
            var r = new Slot();
            r.data = d;
            return r;
        };
        return Slot;
    }());
    nn.Slot = Slot;
    var Slots = (function () {
        function Slots() {
            // 保存所有插槽
            this.slots = new Array();
            /** 阻塞信号
                @note emit被阻塞的信号将不会有任何作用
            */
            this._block = 0;
        }
        Slots.prototype.dispose = function () {
            this.clear();
            this.owner = undefined;
        };
        /** 清空连接 */
        Slots.prototype.clear = function () {
            nn.ArrayT.Clear(this.slots, function (o) {
                o.dispose();
            });
        };
        Slots.prototype.toString = function () {
            var str = "";
            this.slots.forEach(function (e, i) {
                str += "\tslot" + i + ": " + e + "\n";
            }, this);
            return str;
        };
        Slots.prototype.block = function () {
            this._block += 1;
        };
        Slots.prototype.unblock = function () {
            this._block -= 1;
        };
        /** 是否已经阻塞 */
        Slots.prototype.isblocked = function () {
            return this._block != 0;
        };
        /** 添加一个插槽 */
        Slots.prototype.add = function (s) {
            this.slots.push(s);
        };
        /** 对所有插槽激发信号
            @note 返回被移除的插槽的对象
         */
        Slots.prototype.emit = function (data, tunnel) {
            var _this = this;
            if (this.isblocked())
                return null;
            var ids;
            nn.ArrayT.SafeForeach(this.slots, function (o, idx) {
                if (o.count != null &&
                    o.emitedCount >= o.count)
                    return true; // 激活数控制
                // 激发信号
                o.signal = _this.signal;
                o.sender = _this.owner;
                o.emit(data, tunnel);
                // 控制激活数
                if (o.count != null &&
                    o.emitedCount >= o.count) {
                    if (ids == null)
                        ids = new Array();
                    ids.push(idx);
                    return true;
                }
                return !(o.veto);
            }, this);
            // 删除用完的slot
            if (ids) {
                var r_2 = new nn.CSet();
                nn.ArrayT.RemoveObjectsInIndexArray(this.slots, ids)
                    .forEach(function (o) {
                    if (o.target)
                        r_2.add(o.target);
                    // 释放
                    o.dispose();
                    return true;
                });
                return r_2;
            }
            ;
            return null;
        };
        Slots.prototype.disconnect = function (cb, target) {
            var rmd = nn.ArrayT.RemoveObjectsByFilter(this.slots, function (o) {
                if (cb && o.cb != cb)
                    return false;
                if (o.target == target) {
                    o.dispose();
                    return true;
                }
                return false;
            }, this);
            return rmd.length != 0;
        };
        Slots.prototype.find_connected_function = function (cb, target) {
            return nn.ArrayT.QueryObject(this.slots, function (s) {
                return s.cb == cb && s.target == target;
            });
        };
        Slots.prototype.find_redirected = function (sig, target) {
            return nn.ArrayT.QueryObject(this.slots, function (s) {
                return s.redirect == sig && s.target == target;
            }, this);
        };
        Slots.prototype.is_connected = function (target) {
            return nn.ArrayT.QueryObject(this.slots, function (s) {
                return s.target == target;
            }, this) != null;
        };
        return Slots;
    }());
    nn.Slots = Slots;
    var Signals = (function () {
        function Signals(owner) {
            this._slots = new KvObject();
            // 反向登记，当自身 dispose 时，需要和对方断开
            this.__invtargets = new nn.CSet();
            this.owner = owner;
        }
        // 析构
        Signals.prototype.dispose = function () {
            var _this = this;
            // 反向断开连接
            nn.SetT.Clear(this.__invtargets, function (o) {
                if (o.owner && o.owner._signals)
                    o.owner._signals.disconnectOfTarget(_this.owner, false);
            }, this);
            // 清理信号，不能直接用clear的原因是clear不会断开对于ower的引用
            nn.MapT.Clear(this._slots, function (k, o) {
                if (o)
                    o.dispose();
            });
            this.owner = null;
            this.delegate = null;
            this._castings = null;
        };
        Signals.prototype.clear = function () {
            var _this = this;
            // 清空反向的连接
            nn.SetT.Clear(this.__invtargets, function (o) {
                if (o.owner && o.owner._signals)
                    o.owner._signals.disconnectOfTarget(_this.owner, false);
            }, this);
            // 清空slot的连接
            nn.MapT.Foreach(this._slots, function (k, o) {
                if (o)
                    o.clear();
            });
        };
        Signals.prototype.toString = function () {
            var str = "";
            nn.MapT.Foreach(this._slots, function (k, v) {
                str += k + ": " + v + "\n";
            }, this);
            return str;
        };
        /** 注册信号 */
        Signals.prototype.register = function (sig) {
            if (sig == null) {
                nn.fatal("不能注册一个空信号");
                return;
            }
            if (this._slots[sig])
                return;
            this._slots[sig] = null;
        };
        Signals.prototype.avaslots = function (sig) {
            var ss = this._slots[sig];
            if (ss === undefined) {
                nn.fatal("对象 " + nn.Classname(this.owner) + " 信号 " + sig + " 不存在");
                return null;
            }
            if (ss == null) {
                ss = new Slots();
                ss.signal = sig;
                ss.owner = this.owner;
                this._slots[sig] = ss;
            }
            return ss;
        };
        /** 只连接一次 */
        Signals.prototype.once = function (sig, cb, target) {
            var r = this.connect(sig, cb, target);
            r.count = 1;
            return r;
        };
        /** 连接信号插槽 */
        Signals.prototype.connect = function (sig, cb, target) {
            var ss = this.avaslots(sig);
            if (ss == null) {
                nn.fatal("对象 " + nn.Classname(this.owner) + " 信号 " + sig + " 不存在");
                return null;
            }
            var s;
            if (s = ss.find_connected_function(cb, target))
                return s;
            s = new Slot();
            s.cb = cb;
            s.target = target;
            ss.add(s);
            if (this.delegate)
                this.delegate._signalConnected(sig, s);
            this.__inv_connect(target);
            return s;
        };
        /** 该信号是否存在连接上的插槽 */
        Signals.prototype.isConnected = function (sig) {
            var ss = this._slots[sig];
            return ss != null && ss.slots.length != 0;
        };
        Signals.prototype.redirect = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var sig, sig2, target;
            sig = params[0];
            if (params.length == 3) {
                sig2 = params[1];
                target = params[2];
            }
            else if (params.length == 2) {
                if (typeof (params[1]) == 'string') {
                    sig2 = params[1];
                    target = this.owner;
                }
                else {
                    sig2 = sig;
                    target = params[1];
                }
            }
            else {
                nn.fatal("SignalRedirect 传入了错误的参数");
                return;
            }
            var ss = this.avaslots(sig);
            var s;
            if (s = ss.find_redirected(sig2, target))
                return s;
            s = new Slot();
            s.redirect = sig2;
            s.target = target;
            ss.add(s);
            if (this.delegate)
                this.delegate._signalConnected(sig, s);
            this.__inv_connect(target);
            return s;
        };
        /** 激发信号 */
        Signals.prototype.emit = function (sig, data, tunnel) {
            var _this = this;
            var ss = this._slots[sig];
            if (ss) {
                var targets = ss.emit(data, tunnel);
                if (targets) {
                    // 收集所有被移除的target，并断开反向连接
                    targets.forEach(function (target) {
                        if (_this.isConnectedOfTarget(target) == false)
                            _this.__inv_disconnect(target);
                    }, this);
                }
            }
            else if (ss === undefined) {
                nn.fatal("对象 " + nn.Classname(this.owner) + " 信号 " + sig + " 不存在");
                return;
            }
        };
        /** 向外抛出信号
            @note 为了解决诸如金币变更、元宝变更等大部分同时发生的事件但是因为set的时候不能把这些的修改函数合并成1个函数处理，造成同一个消息短时间多次激活，所以使用该函数可以在下一帧开始后归并发出唯一的事件。所以该函数出了信号外不支持其他带参
        */
        Signals.prototype.cast = function (sig) {
            if (this._castings == null) {
                this._castings = new nn.CSet();
                nn.Defer(this._doCastings, this);
            }
            this._castings.add(sig);
        };
        Signals.prototype._doCastings = function () {
            var _this = this;
            if (this._castings == null)
                return;
            this._castings.forEach(function (sig) {
                _this.emit(sig);
            });
            this._castings = null;
        };
        /** 断开连接 */
        Signals.prototype.disconnectOfTarget = function (target, inv) {
            if (inv === void 0) { inv = true; }
            if (target == null)
                return;
            nn.MapT.Foreach(this._slots, function (sig, ss) {
                if (ss)
                    ss.disconnect(null, target);
            }, this);
            if (inv)
                this.__inv_disconnect(target);
        };
        /** 断开连接 */
        Signals.prototype.disconnect = function (sig, cb, target) {
            var _this = this;
            var ss = this._slots[sig];
            if (ss == null)
                return null;
            if (cb == null && target == null) {
                // 清除sig的所有插槽，自动断开反向引用
                var targets_1 = new nn.CSet();
                nn.ArrayT.Clear(ss.slots, function (o) {
                    if (o.target)
                        targets_1.add(o.target);
                    o.dispose();
                });
                targets_1.forEach(function (target) {
                    if (!_this.isConnectedOfTarget(target))
                        _this.__inv_disconnect(target);
                }, this);
            }
            else {
                // 先清除对应的slot，再判断是否存在和target相连的插槽，如过不存在，则断开反向连接
                if (ss.disconnect(cb, target) &&
                    target && !this.isConnectedOfTarget(target)) {
                    this.__inv_disconnect(target);
                }
            }
        };
        Signals.prototype.isConnectedOfTarget = function (target) {
            return nn.MapT.QueryObject(this._slots, function (sig, ss) {
                return ss ? ss.is_connected(target) : false;
            }, this) != null;
        };
        /** 阻塞一个信号，将不响应激发 */
        Signals.prototype.block = function (sig) {
            var ss = this._slots[sig];
            ss && ss.block();
        };
        Signals.prototype.unblock = function (sig) {
            var ss = this._slots[sig];
            ss && ss.unblock();
        };
        Signals.prototype.isblocked = function (sig) {
            var ss = this._slots[sig];
            if (ss)
                return ss.isblocked();
            return false;
        };
        Signals.prototype.__inv_connect = function (tgt) {
            if (tgt == null || tgt.signals == null)
                return;
            if (tgt.signals == this)
                return;
            tgt.signals.__invtargets.add(this);
        };
        Signals.prototype.__inv_disconnect = function (tgt) {
            if (tgt == null || tgt.signals == null)
                return;
            if (tgt.signals == this)
                return;
            tgt.signals.__invtargets.delete(this);
        };
        return Signals;
    }());
    nn.Signals = Signals;
    var _EventWeak = (function () {
        function _EventWeak() {
            this.cbs = new Array();
        }
        _EventWeak.prototype.dispose = function () {
            this.cbs.forEach(function (c) {
                c.dispose();
            });
            this.cbs.length = 0;
        };
        return _EventWeak;
    }());
    var EventWeakDispatcher = (function () {
        function EventWeakDispatcher() {
            this._slots = new KvObject();
        }
        EventWeakDispatcher.prototype.add = function (idr, cb, cbctx) {
            var fnd = this._slots[idr];
            if (fnd != null)
                fnd.cbs.push(new nn.Closure(cb, cbctx));
            else {
                var ew = new _EventWeak();
                ew.idr = idr;
                ew.cbs.push(new nn.Closure(cb, cbctx));
                this._slots[idr] = ew;
            }
        };
        EventWeakDispatcher.prototype.remove = function (idr) {
            var ew = this._slots[idr];
            if (ew) {
                ew.dispose();
                delete this._slots[idr];
            }
        };
        EventWeakDispatcher.prototype.invoke = function (idr, e, debug) {
            var ew = this._slots[idr];
            if (ew == null) {
                if (debug)
                    nn.fatal("没有找到 " + idr);
                return;
            }
            ew.cbs.forEach(function (cb) {
                if (cb.cb && cb.ctx)
                    cb.cb.call(cb.ctx, e);
            }, this);
        };
        EventWeakDispatcher.prototype.clear = function () {
            nn.MapT.Clear(this._slots);
        };
        return EventWeakDispatcher;
    }());
    nn.EventWeakDispatcher = EventWeakDispatcher;
    var Reactors = (function () {
        function Reactors() {
            this._slots = [];
        }
        Reactors.prototype.add = function (cb, ctx) {
            this._slots.push([cb, ctx]);
        };
        Reactors.prototype.invoke = function (e) {
            this._slots.forEach(function (v) {
                v[0].call(v[1], e);
            });
        };
        Reactors.prototype.clear = function () {
            nn.ArrayT.Clear(this._slots);
        };
        return Reactors;
    }());
    nn.Reactors = Reactors;
    function emit(obj, sig, data) {
        if (obj && obj._signals)
            obj._signals.emit(sig, data);
    }
    nn.emit = emit;
    //------------------ 预定义一些通用的信号 --------------------------
    // 遇到了一个异常
    nn.SignalException = "::nn::exception";
    // 动作完成，通常代表成功后的完成
    nn.SignalDone = "::nn::done";
    // 成功
    nn.SignalSucceed = "::nn::done";
    nn.SignalOk = "::nn::done";
    // 超时
    nn.SignalTimeout = "::nn::timeout";
    // 动作结束，和完成概念不一样，代表一个阶段的结束
    nn.SignalEnd = "::nn::end";
    // 动作开始
    nn.SignalStart = "::nn::start";
    // 动作退出
    nn.SignalExit = "::nn::exit";
    // 改变已经发生(改变只有设置不同的数据时发生)
    nn.SignalChanged = "::nn::changed";
    // 发生更新(跟新和改变的区别为，更新可以为重复设置相同的数据)
    nn.SignalUpdated = "::nn::update::need";
    // 暂停
    nn.SignalPaused = "::nn::paused";
    // 恢复
    nn.SignalResume = "::nn::resume";
    // 数据发生改变
    nn.SignalDataChanged = "::nn::data::changed";
    // 项目发生改变
    nn.SignalItemChanged = "::nn::item::changed";
    // 取消
    nn.SignalCancel = "::nn::cancel";
    // 失败
    nn.SignalFailed = "::nn::failed";
    // 正在添加，位于 added 之前激发
    nn.SignalAdding = "::nn::adding";
    // 已经添加
    nn.SignalAdded = "::nn::added";
    // 正在移除，位于 remove 之前激发
    nn.SignalRemoving = "::nn::removing";
    // 已经移除
    nn.SignalRemoved = "::nn::removed";
    // 显示状态变更
    nn.SignalVisibleChanged = "::nn::visible::changed";
    // 需要重新动作一下
    nn.SignalNeedRedo = "::nn::redo::need";
    // 需要刷新
    nn.SignalNeedReload = "::nn::reload::need";
    // 需要强制刷新
    nn.SignalNeedFlush = "::nn::flush::need";
    // 新的项目发生
    nn.SignalNewChanged = "::nn::new::changed";
    // 请求一个动作，例如计时器到时
    nn.SignalAction = "::nn::action";
    // 选择产生了变化
    nn.SignalSelected = "::nn::selection::on";
    nn.SignalDeselected = "::nn::selection::off";
    ;
    nn.SignalSelectionChanged = "::nn::selection::changed";
    nn.SignalSelectionChanging = "::nn::selection::changing";
    // 加载成功
    nn.SignalLoaded = "::nn::loaded";
    // 激活
    nn.SignalActivated = "::nn::activated";
    nn.SignalDeactivated = "::nn::deactivated";
    // 聚焦
    nn.SignalFocusGot = "::nn::focus::got";
    nn.SignalFocusLost = "::nn::focus::lost";
    // 约束条件发生了变化，例如 ui 的内容产生了需要改变 ui 尺寸的动作
    nn.SignalConstriantChanged = "::nn::constriant::changed";
    // 点击
    nn.SignalClicked = "::nn::clicked";
    // 元素点击
    nn.SignalItemClicked = "::nn::item::clicked";
    // 触摸相关
    nn.SignalTouchBegin = "::nn::touch::begin"; // 开始
    nn.SignalTouchEnd = "::nn::touch::end"; // 结束
    nn.SignalTouchMove = "::nn::touch::move"; // 移动
    // 按键相关
    nn.SignalKeyPress = "::nn::key::press"; // 任意键
    nn.SignalEnterKey = "::nn::key::enter"; // 回车键
    // 滚动相关
    nn.SignalScrollBegin = "::nn::scroll::begin";
    nn.SignalScrollEnd = "::nn::scroll::end";
    nn.SignalScrolled = "::nn::scroll::changed";
    // 请求一次 hitTest 的判定
    nn.SignalHitTest = "::nn::hittest";
    // 尺寸的改变
    nn.SignalFrameChanged = "::nn::frame::changed";
    // 状态的改变
    nn.SignalStateChanged = "::nn::state::changed";
    // 朝向变化
    nn.SignalOrientationChanged = "::nn::orientation::changed";
    // 打开
    nn.SignalOpening = "::nn::opening";
    nn.SignalOpen = "::nn::open";
    // 关闭
    nn.SignalClosing = "::nn::Closing";
    nn.SignalClose = "::nn::close";
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 音频播放 */
    var CSoundPlayer = (function (_super) {
        __extends(CSoundPlayer, _super);
        function CSoundPlayer() {
            var _this = _super.call(this) || this;
            /** 播放次数，-1代表循环 */
            _this.count = 1;
            return _this;
        }
        CSoundPlayer.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalStart);
            this._signals.register(nn.SignalPaused);
            this._signals.register(nn.SignalDone);
            this._signals.register(nn.SignalChanged);
        };
        Object.defineProperty(CSoundPlayer.prototype, "isPlaying", {
            get: function () {
                return this.playingState == nn.WorkState.DOING;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSoundPlayer.prototype, "isPaused", {
            get: function () {
                return this.playingState == nn.WorkState.PAUSED;
            },
            enumerable: true,
            configurable: true
        });
        return CSoundPlayer;
    }(nn.SObject));
    nn.CSoundPlayer = CSoundPlayer;
    var SoundTrack = (function (_super) {
        __extends(SoundTrack, _super);
        function SoundTrack() {
            var _this = _super.call(this) || this;
            /** 播放次数，-1代表无限循环 */
            _this.count = 1;
            /** 用以实现player的类对象 */
            _this.classForPlayer = nn.SoundPlayer;
            /** 可用状态 */
            _this._enable = true;
            // 映射文件和播放器
            _this._sounds = new KvObject();
            return _this;
        }
        Object.defineProperty(SoundTrack.prototype, "autoRecovery", {
            get: function () {
                return this._autoRecovery;
            },
            set: function (b) {
                if (b == this._autoRecovery)
                    return;
                this._autoRecovery = b;
                nn.MapT.Foreach(this._sounds, function (k, v) {
                    v.autoRecovery = b;
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoundTrack.prototype, "enable", {
            get: function () {
                return this._enable;
            },
            set: function (b) {
                if (b == this._enable)
                    return;
                this._enable = b;
                nn.MapT.Foreach(this._sounds, function (k, v) {
                    v.enable = b;
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        /** 获取一个播放器 */
        SoundTrack.prototype.player = function (name) {
            var groups = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                groups[_i - 1] = arguments[_i];
            }
            var ply = this._sounds[name];
            if (ply == null) {
                ply = new this.classForPlayer();
                ply.enable = this.enable;
                ply.autoRecovery = this.autoRecovery;
                ply.resourceGroups = groups.length ? groups : this.resourceGroups;
                ply.setMediaSource(name);
                ply.count = this.count;
                ply.signals.connect(nn.SignalStart, this.__cb_play, this);
                this._sounds[name] = ply;
            }
            return ply;
        };
        /** 实例化一个播放器，播放完成后会自动清掉 */
        SoundTrack.prototype.acquire = function (name) {
            var groups = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                groups[_i - 1] = arguments[_i];
            }
            var ply = new this.classForPlayer();
            ply.enable = this.enable;
            ply.autoRecovery = this.autoRecovery;
            ply.resourceGroups = groups.length ? groups : this.resourceGroups;
            ply.setMediaSource(name);
            ply.count = this.count;
            if (!ply.enable) {
                nn.Defer(ply.drop, ply);
            }
            else {
                ply.signals.connect(nn.SignalEnd, function (s) {
                    nn.drop(s.sender);
                }, null);
            }
            return ply;
        };
        SoundTrack.prototype.__cb_play = function (s) {
            if (this.solo && this._soloplayer != s.sender) {
                if (this._soloplayer)
                    this._soloplayer.breakee();
                this._soloplayer = s.sender;
            }
        };
        /** 播放全部 */
        SoundTrack.prototype.play = function () {
            nn.MapT.Foreach(this._sounds, function (k, v) {
                v.play();
            }, this);
        };
        /** 停止全部 */
        SoundTrack.prototype.stop = function () {
            nn.MapT.Foreach(this._sounds, function (k, v) {
                v.stop();
            }, this);
        };
        SoundTrack.prototype._app_actived = function () {
            if (this.__app_activate_enable)
                this.enable = true;
        };
        SoundTrack.prototype._app_deactived = function () {
            this.__app_activate_enable = this.enable;
            this.enable = false;
        };
        return SoundTrack;
    }(nn.SObject));
    nn.SoundTrack = SoundTrack;
    var CSoundManager = (function (_super) {
        __extends(CSoundManager, _super);
        function CSoundManager() {
            var _this = _super.call(this) || this;
            _this._tracks = new KvObject();
            return _this;
        }
        /** 获取到指定音轨 */
        CSoundManager.prototype.track = function (idr) {
            var tk = this._tracks[idr];
            if (tk == null) {
                tk = new SoundTrack();
                this._tracks[idr] = tk;
            }
            return tk;
        };
        return CSoundManager;
    }(nn.SObject));
    nn.CSoundManager = CSoundManager;
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 对于可以调整高度，或者存在 ui 和 data 重入的问题，通过这个参数来分别判断是 UI 过程还是 DATA 过程
     * @brief 例如在 tableview 中应用时，如果是变高，则 updateData 会重入2次，一次是 UI 过程(粗布局)，一次是 DATA 过程(刷数据显示)，之后就可以拿到实高，但是 updateData 里面会有例如设置图片的操作，而这些操作仅需要在 UI 过程中被调用，所以可以通过该变量区分开
     */
    nn.DATAUPDATE = true;
    var TableViewCell = (function (_super) {
        __extends(TableViewCell, _super);
        function TableViewCell() {
            return _super.call(this) || this;
        }
        TableViewCell.FromItem = function (cv) {
            return nn.findParentByType(cv, TableViewCell);
        };
        Object.defineProperty(TableViewCell.prototype, "item", {
            get: function () {
                return this._item;
            },
            set: function (item) {
                if (this._item == item)
                    return;
                if (this._item)
                    this.removeChild(this._item);
                this._item = item;
                if (this._item)
                    this.addChild(this._item);
            },
            enumerable: true,
            configurable: true
        });
        TableViewCell.prototype.updateData = function () {
            _super.prototype.updateData.call(this);
            if (this._item && this._item.updateData)
                this._item.updateData();
        };
        TableViewCell.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            if (this._item)
                this._item.frame = this.boundsForLayout();
        };
        Object.defineProperty(TableViewCell.prototype, "row", {
            get: function () {
                return this._row;
            },
            set: function (v) {
                nn.warn("不能直接设置cell的行号");
            },
            enumerable: true,
            configurable: true
        });
        return TableViewCell;
    }(nn.Sprite));
    nn.TableViewCell = TableViewCell;
    var TableViewContent = (function (_super) {
        __extends(TableViewContent, _super);
        function TableViewContent() {
            var _this = _super.call(this) || this;
            /** 是否支持重用的模式
                @note 关闭重用的好处：固定列表的大小，不需要考虑item重入的问题
            */
            _this.reuseMode = true;
            /** 默认的cell类型 */
            _this.cellClass = TableViewCell;
            /** 间距 */
            _this.spacing = 0;
            // 所有正在使用的和在缓存队列中的单元格
            _this._usedCells = new Array();
            _this._unusedCells = new Array();
            // 单元格高度的查找表, index => height
            _this._rowHeights = new Array();
            // 重用的元素列表, idr => [ItemView]
            _this._reuseItems = new KvObject();
            return _this;
        }
        TableViewContent.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalItemChanged);
        };
        TableViewContent.prototype.dispose = function () {
            var _this = this;
            this.dataSource = undefined;
            nn.ArrayT.Clear(this._unusedCells, function (o) {
                nn.drop(o);
            }, this);
            nn.MapT.Clear(this._reuseItems, function (k, o) {
                // 位于待复用的 item 的销毁
                nn.ArrayT.Clear(o, function (o) {
                    nn.drop(o);
                }, _this);
            }, this);
            _super.prototype.dispose.call(this);
        };
        // 如果尺寸有变化，需要调整单元格的位置
        TableViewContent.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            // 尺寸变化会导致变高情况下单元格高度变化
            // 如果添加了辅助控件，也需要重新刷一下当前布局
            this.reloadData();
        };
        Object.defineProperty(TableViewContent.prototype, "headerEdgeInsets", {
            get: function () {
                return this._headerEdgeInsets;
            },
            set: function (ei) {
                this._headerEdgeInsets = ei;
                this._updateEdgeInsets();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableViewContent.prototype, "footerEdgeInsets", {
            get: function () {
                return this._footerEdgeInsets;
            },
            set: function (ei) {
                this._footerEdgeInsets = ei;
                this._updateEdgeInsets();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableViewContent.prototype, "additionEdgeInsets", {
            get: function () {
                return this._additionEdgeInsets;
            },
            set: function (ei) {
                this._additionEdgeInsets = ei;
                this._updateEdgeInsets();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableViewContent.prototype, "topIdentifierEdgeInsets", {
            get: function () {
                return this._topIdentifierEdgeInsets;
            },
            set: function (ei) {
                this._topIdentifierEdgeInsets = ei;
                this._updateEdgeInsets();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableViewContent.prototype, "bottomIdentifierEdgeInsets", {
            get: function () {
                return this._bottomIdentifierEdgeInsets;
            },
            set: function (ei) {
                this._bottomIdentifierEdgeInsets = ei;
                this._updateEdgeInsets();
            },
            enumerable: true,
            configurable: true
        });
        TableViewContent.prototype._updateEdgeInsets = function () {
            var ei = new nn.EdgeInsets();
            ei.addEdgeInsets(this._headerEdgeInsets);
            ei.addEdgeInsets(this._footerEdgeInsets);
            ei.addEdgeInsets(this._additionEdgeInsets);
            ei.addEdgeInsets(this._topIdentifierEdgeInsets);
            ei.addEdgeInsets(this._bottomIdentifierEdgeInsets);
            this.contentEdgeInsets = ei;
        };
        TableViewContent.prototype.clear = function () {
            var _this = this;
            // 滚动到最前面
            this.stopDecelerating();
            if (this.horizonMode)
                this.setContentOffsetX(0, 0);
            else
                this.setContentOffsetY(0, 0);
            // 去除掉所有cell
            if (this.reuseMode == false) {
                nn.ArrayT.Clear(this._usedCells, function (cell) {
                    _this.removeChild(cell);
                }, this);
                return;
            }
            nn.ArrayT.Clear(this._usedCells, function (cell) {
                var cv = cell.item;
                _this.addOneReuseItem(cv);
                cell.item = null;
                cell.visible = false;
                cell._row = undefined;
                _this._unusedCells.push(cell);
            }, this);
        };
        // 重新加载单元格
        TableViewContent.prototype.reloadData = function () {
            // 所有的行数，如果是固定高度，则直接结算处总高，否则需要计算合计的高度
            var rows = this.dataSource.numberOfRows();
            // 如果当前的行数比之前的小，所以需要pop掉不用的
            if (rows < this._usedCells.length) {
                for (var i = this._usedCells.length - rows; i > 0; --i)
                    this.popUsedCell();
            }
            // 刷新每一行的高度
            // 取得每一行的高度和总高
            var height = 0;
            nn.DATAUPDATE = false;
            // 初始化一个用来计算高度的 cell
            var cell = this.useCell(undefined);
            // 设置每一个最初的大小
            var cntrc = this.boundsForContent();
            if (this.horizonMode)
                cell.frame = new nn.Rect(0, 0, 0, cntrc.height);
            else
                cell.frame = new nn.Rect(0, 0, cntrc.width, 0);
            // 统计总高
            for (var i = 0; i < rows; ++i) {
                // 取得内部元素的类型
                var cls = this.dataSource.classForRow(i);
                // 如果支持变高，则从 best 里面取值
                var h = 0;
                if (nn.MethodIsOverrided(cls, 'bestFrame')) {
                    // 需要使用业务对象来计算真实高度
                    var item = this.getOneReuseItem(cls);
                    // 绑定到 cell->更新大小，使用_item的原因是不是真正的加入渲染书，只是为了让布局、数据刷新生效，才可以计算出期望的大小
                    cell._item = item;
                    // 刷新下数据
                    this.updateRow(item, cell, i);
                    // 直接布局基础控件
                    cell.updateLayout();
                    // 基于基础布局估计总高
                    var rc = item.bestFrame();
                    if (this.horizonMode)
                        h = rc.width;
                    else
                        h = rc.height;
                    // 放回去临时用的item
                    cell._item = null;
                    this.addOneReuseItem(item);
                }
                else {
                    h = this.dataSource.heightForRow(i);
                }
                h += this.spacing;
                // 缓存一下，以后就不重新计算
                this._rowHeights[i] = h;
                height += h;
            }
            // 完成计算任务，临时的cell变成等待重用
            this.unuseCell(cell);
            nn.DATAUPDATE = true;
            // 设置table的总高度
            var cntSz = this.contentSize;
            if (this.horizonMode) {
                cntSz.width = height;
                cntSz.height = cntrc.height;
            }
            else {
                cntSz.height = height;
                cntSz.width = cntrc.width;
            }
            this.contentSize = cntSz;
            // 刷新当前位置对应的表格组
            this._updateValidCells(true);
            // 刷新辅助的视图(例如表头)
            this._layoutViews();
        };
        // 增加一个重用的内部元素
        TableViewContent.prototype.addOneReuseItem = function (item) {
            var idr = nn.Classname(item);
            var items = this._reuseItems[idr];
            if (items == null) {
                items = new Array();
                this._reuseItems[idr] = items;
            }
            items.push(item);
            // 存在复用关系，一般addOneReuseItem的下一步就是把cell.item = null，所以需要保护一下item，避免当从cell中remove后被析构
            nn.grab(item);
        };
        // 获得一个重用的内部元素
        TableViewContent.prototype.getOneReuseItem = function (type) {
            var idr = nn.Classname(type);
            var items = this._reuseItems[idr];
            if (!items || items.length == 0) {
                return this.instanceItem(type);
            }
            return items.pop();
        };
        TableViewContent.prototype.instanceItem = function (type) {
            var item = new type();
            item.signals.connect(nn.SignalConstriantChanged, this._updateConstriant, this);
            return item;
        };
        /** 查找指定的单元格 */
        TableViewContent.prototype.findCell = function (row) {
            return nn.ArrayT.QueryObject(this._usedCells, function (c) {
                if (row !== undefined && row != c._row)
                    return false;
                return true;
            }, this, null);
        };
        /** 滚动到指定单元格 */
        TableViewContent.prototype.scrollToCell = function (idx, duration, edge) {
            if (duration === void 0) { duration = nn.CAnimate.Duration; }
            if (edge === void 0) { edge = nn.EDGE.START; }
            var pos = 0;
            var atid = Math.min(this._rowHeights.length, idx);
            for (var i = 0; i < atid; ++i) {
                pos += this._rowHeights[i];
            }
            // 偏移edge
            if (edge == nn.EDGE.MIDDLE) {
                var add = this._rowHeights[idx + 1];
                if (add != null)
                    pos += add / 2;
            }
            else if (edge == nn.EDGE.END) {
                var add = this._rowHeights[idx + 1];
                if (add != null)
                    pos += add;
            }
            this.scrollToPos(pos, duration);
        };
        /** 滚动到指定位置 */
        TableViewContent.prototype.scrollToPos = function (pos, duration) {
            if (duration === void 0) { duration = nn.CAnimate.Duration; }
            if (this.contentEdgeInsets)
                pos += this.contentEdgeInsets.top;
            if (this.horizonMode)
                this.setContentOffsetX(pos, duration);
            else
                this.setContentOffsetY(pos, duration);
        };
        Object.defineProperty(TableViewContent.prototype, "visibledCells", {
            /** 获取所有可见的单元格 */
            get: function () {
                // 按照row排序
                return this._usedCells.sort(function (l, r) {
                    return l.row - r.row;
                });
            },
            enumerable: true,
            configurable: true
        });
        // 获取一个 cell
        TableViewContent.prototype.useCell = function (row) {
            var cell;
            if (this._unusedCells.length) {
                cell = this._unusedCells.pop();
            }
            else {
                cell = new this.cellClass();
                if (this.spacing) {
                    cell.getEdgeInsets().bottom = this.spacing;
                }
                this.addChild(cell);
            }
            this._usedCells.push(cell);
            cell._row = row;
            cell.visible = row != undefined;
            return cell;
        };
        // 压出一个 cell
        TableViewContent.prototype.unuseCell = function (cell) {
            if (this.reuseMode == false) {
                nn.ArrayT.RemoveObject(this._usedCells, cell);
                this.removeChild(cell);
                return;
            }
            var cv = cell.item;
            if (cv) {
                this.addOneReuseItem(cv);
                cell.item = null;
            }
            cell.visible = false;
            cell._row = undefined;
            nn.ArrayT.RemoveObject(this._usedCells, cell);
            this._unusedCells.push(cell);
        };
        TableViewContent.prototype.popUsedCell = function () {
            var cell = this._usedCells.pop();
            if (this.reuseMode == false) {
                nn.ArrayT.RemoveObject(this._usedCells, cell);
                this.removeChild(cell);
                return;
            }
            var cv = cell.item;
            if (cv) {
                this.addOneReuseItem(cv);
                cell.item = null;
            }
            cell.visible = false;
            cell._row = undefined;
            this._unusedCells.push(cell);
        };
        TableViewContent.prototype.updateRow = function (item, cell, row) {
            if (DEBUG) {
                try {
                    this.dataSource.updateRow(item, cell, row);
                    cell.updateData();
                }
                catch (ex) {
                    nn.exception(ex);
                }
                return;
            }
            this.dataSource.updateRow(item, cell, row);
            cell.updateData();
        };
        TableViewContent.prototype._updateConstriant = function (s) {
            var item = s.sender;
            var cell = TableViewCell.FromItem(item);
            if (cell == null) {
                // 第一步先实现只调整已经显示的单元格大小
                return;
            }
            var row = cell.row;
            var rc = item.bestFrame();
            var h;
            if (this.horizonMode)
                h = rc.width;
            else
                h = rc.height;
            // 记录差值，需要修改一下contentSize
            var dh = h - this._rowHeights[row];
            if (dh == 0)
                return;
            var cntSz = this.contentSize;
            if (this.horizonMode)
                cntSz.width += dh;
            else
                cntSz.height += dh;
            this.contentSize = cntSz;
            // 刷新下单元格的位置
            this._rowHeights[row] = h;
            this._updateValidCells(false);
            // updateValidCells不会尝试修改已经显示的cell的大小，所以需要手动调整
            cell.setHeight(h);
            // 更新辅助元素位置
            this._layoutViews();
        };
        TableViewContent.prototype._updateValidCells = function (update) {
            var cntrc = this.boundsForContent();
            var rows = this.dataSource.numberOfRows();
            var regrc = this.regionBounds;
            var pos = 0;
            var itemchanged = 0;
            for (var i = 0; i < rows; ++i) {
                var h = this._rowHeights[i];
                if (h == undefined)
                    return;
                var cell = this.findCell(i);
                if (this.horizonMode) {
                    if (nn.Range.Intersects(regrc.x, regrc.width, pos, h) == false) {
                        if (cell) {
                            ++itemchanged;
                            this.unuseCell(cell);
                        }
                        pos += h;
                        continue;
                    }
                }
                else {
                    if (nn.Range.Intersects(regrc.y, regrc.height, pos, h) == false) {
                        if (cell) {
                            ++itemchanged;
                            this.unuseCell(cell);
                        }
                        pos += h;
                        continue;
                    }
                }
                // 已经位于显示的状态
                if (cell) {
                    if (this.horizonMode)
                        cell.setX(pos);
                    else
                        cell.setY(pos);
                    pos += h;
                    // 已经显示的cell要更新下长度
                    if (this.horizonMode)
                        cell.setHeight(cntrc.height);
                    else
                        cell.setWidth(cntrc.width);
                    if (update) {
                        // 刷新行数据                    
                        this.updateRow(cell.item, cell, i);
                    }
                    continue;
                }
                // 新建一个单元格
                cell = this.useCell(i);
                var cls = this.dataSource.classForRow(i);
                var item = this.getOneReuseItem(cls);
                cell.item = item;
                ++itemchanged;
                // 刷新行数据
                this.updateRow(cell.item, cell, i);
                // 调整 cell 的大小
                item.frame = nn.Rect.Zero;
                cell.frame = nn.Rect.Zero;
                if (this.horizonMode)
                    cell.frame = new nn.Rect(pos, 0, h, cntrc.height);
                else
                    cell.frame = new nn.Rect(0, pos, cntrc.width, h);
                pos += h;
            }
            if (itemchanged)
                this._signals && this._signals.emit(nn.SignalItemChanged);
        };
        // 移动后需要计算一下当前需要显示的单元格
        TableViewContent.prototype.onPositionChanged = function () {
            _super.prototype.onPositionChanged.call(this);
            this._updateValidCells(false);
        };
        Object.defineProperty(TableViewContent.prototype, "headerView", {
            get: function () {
                return this._headerView;
            },
            set: function (v) {
                if (v == this._headerView)
                    return;
                if (this._headerView)
                    this._scrollContent.removeChild(this._headerView);
                this._headerView = v;
                if (v) {
                    var vrc = v.frame;
                    if (this.horizonMode) {
                        if (vrc.width == 0 && v.bestFrame) {
                            vrc = v.bestFrame();
                        }
                        this.headerEdgeInsets = new nn.EdgeInsets(0, 0, vrc.width, 0);
                    }
                    else {
                        if (vrc.height == 0 && v.bestFrame) {
                            vrc = v.bestFrame();
                        }
                        this.headerEdgeInsets = new nn.EdgeInsets(vrc.height, 0, 0, 0);
                    }
                    this._scrollContent.addChild(v);
                }
                else {
                    this.headerEdgeInsets = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableViewContent.prototype, "footerView", {
            get: function () {
                return this._footerView;
            },
            set: function (v) {
                if (v == this._footerView)
                    return;
                if (this._footerView)
                    this._scrollContent.removeChild(this._footerView);
                this._footerView = v;
                if (v) {
                    var vrc = v.frame;
                    if (this.horizonMode) {
                        if (vrc.width == 0 && v.bestFrame) {
                            vrc = v.bestFrame();
                        }
                        this.footerEdgeInsets = new nn.EdgeInsets(0, 0, 0, vrc.width);
                    }
                    else {
                        if (vrc.height == 0 && v.bestFrame) {
                            vrc = v.bestFrame();
                        }
                        this.footerEdgeInsets = new nn.EdgeInsets(0, vrc.height, 0, 0);
                    }
                    this._scrollContent.addChild(v);
                }
                else {
                    this.footerEdgeInsets = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        TableViewContent.prototype._layoutViews = function () {
            var cntrc = this.boundsForContent();
            // 排列表头等其他 ui 元素
            if (this._headerView) {
                var rc = void 0;
                if (this.horizonMode) {
                    rc = new nn.Rect(0, 0, this._headerEdgeInsets.left, cntrc.height);
                }
                else {
                    rc = new nn.Rect(0, 0, cntrc.width, this._headerEdgeInsets.top);
                }
                this._headerView.frame = rc;
            }
            if (this._footerView) {
                var rc = void 0;
                if (this.horizonMode) {
                    rc = new nn.Rect(0, 0, this._footerEdgeInsets.right, cntrc.height);
                    rc.rightTop = this._scrollContent.frame.rightTop;
                }
                else {
                    rc = new nn.Rect(0, 0, cntrc.width, this._footerEdgeInsets.bottom);
                    rc.leftBottom = this._scrollContent.frame.leftBottom;
                }
                this._footerView.frame = rc;
            }
        };
        return TableViewContent;
    }(nn.ScrollView));
    nn.TableViewContent = TableViewContent;
    var TableView = (function (_super) {
        __extends(TableView, _super);
        function TableView() {
            var _this = _super.call(this) || this;
            _this._table = _this.instanceTable();
            _this._table.dataSource = _this;
            _this.addChild(_this._table);
            return _this;
        }
        TableView.FromItem = function (cv) {
            return nn.findParentByType(cv, TableView);
        };
        TableView.prototype.instanceTable = function () {
            return new TableViewContent();
        };
        Object.defineProperty(TableView.prototype, "table", {
            get: function () {
                return this._table;
            },
            enumerable: true,
            configurable: true
        });
        TableView.prototype.classForRow = function (row) {
            return this._table.rowClass;
        };
        TableView.prototype.heightForRow = function (row) {
            return this._table.rowHeight;
        };
        TableView.prototype.updateRow = function (item, cell, row) {
            /* 更新内部元素的数据
               可以通过 if (DATAUPDATE) 来区分刷新数据还是只是为了计算高度
               如果只是为了计算高度，只需要在 updateData 中赋值和高度相关的数据
            */
        };
        TableView.prototype.numberOfRows = function () {
            return 0;
        };
        TableView.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            this._table.frame = this.boundsForLayout();
        };
        return TableView;
    }(nn.Sprite));
    nn.TableView = TableView;
})(nn || (nn = {}));
var nn;
(function (nn) {
    // 网络连接错误
    nn.ERROR_NETWORK_FAILED = -0xFFFFFFFE;
    /* 用法
       let m = new app.model.Test();
       m.message = "hello";
       m.signals.connect(nn.Model.SignalDone, function(e:nn.Slot) {
       nn.msgbox(m.result);
       }, this);
       nn.RestSession.fetch(m);
    */
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model() {
            var _this = _super.call(this) || this;
            /** 动作 */
            _this.action = '';
            /** 参数 */
            _this.params = new KvObject();
            /** 需要自动带上授权信息 */
            _this.withCredentials = true;
            /** 获得请求的类型 */
            _this.method = nn.HttpMethod.GET;
            /** 调试模式，即使错误也同样激活成功的消息 */
            _this.isDebug = false;
            /** 是否显示错误信息 */
            _this.showError = true;
            /** 超时 s，默认不使用改特性 */
            _this.timeout = 0;
            return _this;
        }
        Model.prototype.dispose = function () {
            this.response = undefined;
            nn.MapT.Clear(this.params);
            _super.prototype.dispose.call(this);
        };
        Model.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalStart);
            this._signals.register(nn.SignalEnd);
            this._signals.register(nn.SignalSucceed);
            this._signals.register(nn.SignalFailed);
            this._signals.register(nn.SignalTimeout);
        };
        Model.prototype.keyForCache = function () {
            return this.host + '|' + this.action + '|' + JSON.stringify(this.paramsForCache());
        };
        Model.prototype.paramsForCache = function () {
            return this.params;
        };
        Model.prototype.valueForCache = function () {
            return this.response;
        };
        Object.defineProperty(Model.prototype, "modelcallback", {
            get: function () {
                return this._modelcallback;
            },
            set: function (val) {
                this._modelcallback = val;
                this.params['modelcallback'] = val;
            },
            enumerable: true,
            configurable: true
        });
        /** 是否跨域 */
        Model.prototype.iscross = function () {
            // 使用服务器转向来解决跨域的问题
            if (this.useproxy())
                return false;
            return this.host.indexOf(Model.HTTP) == -1 &&
                this.host.indexOf(Model.HTTPS) == -1;
        };
        /** 是否使用代理 */
        Model.prototype.useproxy = function () {
            return nn.ISDEBUG;
        };
        /** 全路径 */
        Model.prototype.url = function () {
            return this.host + this.action;
        };
        /** 可用的参数 */
        Model.prototype.fields = function () {
            return this.params;
        };
        /** 是否获取成功 */
        Model.prototype.isSucceed = function () {
            return this.code === 0;
        };
        /** 处理结果数据 */
        Model.prototype.serialize = function (respn) { return false; };
        Model.prototype.unserialize = function (respn) { return true; };
        /** 用于调试的数据 */
        Model.prototype.urlForLog = function () {
            return this.url();
        };
        Model.prototype.fieldsForLog = function () {
            return this.fields();
        };
        // 开始拉数据
        Model.prototype.__mdl_start = function () {
            // 输出日志
            if (nn.VERBOSE) {
                var str = this.urlForLog();
                var flds = this.fieldsForLog();
                if (nn.MapT.IsEmpty(flds) == false) {
                    str += ' >> ' + nn.URL.MapToField(flds);
                }
                nn.log("API " + this.action + " 请求 " + str);
            }
            if (this.showWaiting)
                nn.Hud.ShowProgress();
            // 启动超时计时器
            if (this.timeout)
                this._tmr_timeout = nn.Delay(this.timeout, this.__mdl_timeout, this);
            this.signals.emit(nn.SignalStart);
        };
        // 获取数据成功
        Model.prototype.__mdl_completed = function (e) {
            var data = this._urlreq ? this._urlreq.data : e;
            // 判断是否需要从 json 转换回来
            if (typeof (data) == 'string') {
                try {
                    this.response = JSON.parse(data);
                }
                catch (err) {
                    nn.exception(err);
                }
            }
            else {
                this.response = data;
            }
            this.processResponse();
            this.__mdl_end();
        };
        // 获取数据失败
        Model.prototype.__mdl_failed = function (e) {
            // 设置网路错误的id
            this.code = nn.ERROR_NETWORK_FAILED;
            var tn = new nn.SlotTunnel();
            this.signals.emit(nn.SignalFailed, e.data, tn);
            if (!tn.veto)
                nn.RestSession.signals.emit(nn.SignalFailed, this, tn);
            // 如果业务层阻塞掉该信号，则不转发
            if (!tn.veto) {
                var str = nn.ISDEBUG ?
                    'API ' + this.action + ' 请求服务器失败' :
                    '请检查网络设置';
                nn.Hud.Error(str);
            }
            this.__mdl_end();
        };
        Model.prototype.__mdl_timeout = function () {
            if (nn.VERBOSE)
                nn.log('API ' + this.action + ' 超时');
            if (this.isDebug) {
                this.signals.emit(nn.SignalSucceed);
                nn.RestSession.signals.emit(nn.SignalSucceed, this);
            }
            else {
                if (this.timeoutAsFailed) {
                    this.signals.emit(nn.SignalFailed);
                    nn.RestSession.signals.emit(nn.SignalFailed, this);
                }
                this.signals.emit(nn.SignalTimeout);
                nn.RestSession.signals.emit(nn.SignalTimeout, this);
            }
            this.__mdl_end();
        };
        // 处理结束
        Model.prototype.__mdl_end = function () {
            this.clear();
            this.signals.emit(nn.SignalEnd);
            nn.RestSession.signals.emit(nn.SignalEnd, this);
            if (this.showWaiting)
                nn.Hud.HideProgress();
            // 调用完成，析构对象
            this.drop();
        };
        // 处理接收到的数据
        Model.prototype.processResponse = function () {
            if ('code' in this.response)
                this.code = this.response.code;
            else if ('1' in this.response)
                this.code = this.response[1];
            else
                this.code = -1;
            if ('message' in this.response)
                this.message = this.response.message;
            else if ('2' in this.response)
                this.message = this.response[2];
            else
                this.message = "从服务器没有获取到数据";
            if (nn.VERBOSE)
                nn.log('API ' + this.action + ' 返回 ' + JSON.stringify(this.response));
            this.cacheUpdated = false;
            if ((this.succeed = this.isSucceed())) {
                if (nn.VERBOSE)
                    nn.log('API ' + this.action + ' 请求成功');
                if (this.cacheTime && this.cacheFlush) {
                    this.cacheUpdated = true;
                    // 添加到缓存中
                    nn.Memcache.shared.cache(this);
                }
                this.unserialize(this.response);
                this.signals.emit(nn.SignalSucceed);
                nn.RestSession.signals.emit(nn.SignalSucceed, this);
            }
            else {
                nn.warn('API ' + this.action + ' ' + this.message);
                var tn = new nn.SlotTunnel();
                if (this.isDebug) {
                    this.signals.emit(nn.SignalSucceed);
                    nn.RestSession.signals.emit(nn.SignalSucceed, this);
                }
                else {
                    this.signals.emit(nn.SignalFailed, this, tn);
                    if (!tn.veto)
                        nn.RestSession.signals.emit(nn.SignalFailed, this, tn);
                }
                // 业务层可以拦截处理
                if (!tn.veto && this.showError && this.message)
                    nn.Hud.Error(this.message);
            }
        };
        Model.prototype.clear = function () {
            // 释放连接
            this._urlreq = nn.drop(this._urlreq);
            this._urlreq = undefined;
            // 释放超时判定
            if (this._tmr_timeout) {
                this._tmr_timeout.stop();
                this._tmr_timeout = undefined;
            }
        };
        return Model;
    }(nn.SObject));
    Model.HTTP = "http://" + document.domain;
    Model.HTTPS = "https://" + document.domain;
    nn.Model = Model;
    /** 支持分页的model */
    var PagedModel = (function () {
        function PagedModel() {
            // 当前页的标记
            this.page = 0;
            // 所有分页的数据
            this._items = new nn.IndexedMap();
        }
        // 添加页数据
        PagedModel.prototype.add = function (page, items) {
            this.changed = false;
            if (this._items.contains(page))
                return;
            // 如果items为空，则也不加入，为了下一次同页面刷新
            if (items.length == 0)
                return;
            this.changed = true;
            this._items.add(page, items);
            this.page = page;
        };
        Object.defineProperty(PagedModel.prototype, "items", {
            // 获得当前页面的items
            get: function () {
                return this._items.objectForKey(this.page);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagedModel.prototype, "allItems", {
            // 所有页面的对象
            get: function () {
                var r = [];
                this._items.forEach(function (k, o) {
                    nn.ArrayT.PushObjects(r, o);
                });
                return r;
            },
            enumerable: true,
            configurable: true
        });
        // 前一页面
        PagedModel.prototype.previous = function () {
            var idx = this._items.indexOfKey(this.page);
            if (idx == 0)
                return false;
            this.page = this._items.keyForIndex(idx - 1);
            return true;
        };
        // 后一页，如果返回false，则需要去查询有没有后一页
        PagedModel.prototype.next = function () {
            var idx = this._items.indexOfKey(this.page);
            var k = this._items.keyForIndex(idx + 1);
            if (k == null)
                return false;
            this.page = k;
            return true;
        };
        return PagedModel;
    }());
    nn.PagedModel = PagedModel;
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 用来将标准对象包装成业务对象 */
    var BridgedComponent = (function (_super) {
        __extends(BridgedComponent, _super);
        function BridgedComponent(tgt) {
            var _this = _super.call(this) || this;
            if (tgt) {
                _this._imp = tgt;
                _this._imp._fmui = _this;
            }
            return _this;
        }
        // 不替换所有关系的桥接(避免同一个对象位于不同功能时需要临时包装的问题)
        BridgedComponent.Wrapper = function (tgt) {
            var r = new BridgedComponent(null);
            r._imp = tgt;
            return r;
        };
        // 从元数据获取包装类型
        BridgedComponent.FromImp = function (tgt) {
            var r = tgt._fmui;
            while (r == null && tgt) {
                tgt = tgt.parent;
                if (tgt)
                    r = tgt._fmui;
            }
            return r;
        };
        // 阻止实现类的初始化
        BridgedComponent.prototype.createImp = function () { };
        Object.defineProperty(BridgedComponent.prototype, "signals", {
            get: function () {
                return this._imp.signals;
            },
            enumerable: true,
            configurable: true
        });
        BridgedComponent.prototype._initSignals = function () {
            this._imp._initSignals();
        };
        Object.defineProperty(BridgedComponent.prototype, "descriptionName", {
            // 显示在inspector中
            get: function () {
                return nn.Classname(this._imp);
            },
            enumerable: true,
            configurable: true
        });
        // 转接最佳大小
        BridgedComponent.prototype.bestFrame = function () {
            return this._imp.bestFrame ? this._imp.bestFrame() : new nn.Rect();
        };
        BridgedComponent.prototype.bestPosition = function () {
            return this._imp.bestPosition ? this._imp.bestPosition() : null;
        };
        BridgedComponent.prototype.updateCache = function () {
            if (this._imp.updateCache)
                this._imp.updateCache();
        };
        BridgedComponent.prototype.grab = function () {
            if (this._imp.grab)
                this._imp.grab();
            _super.prototype.grab.call(this);
        };
        BridgedComponent.prototype.drop = function () {
            if (this._imp.drop)
                this._imp.drop();
            _super.prototype.drop.call(this);
        };
        BridgedComponent.prototype.onAppeared = function () {
            _super.prototype.onAppeared.call(this);
            this._imp.onAppeared();
        };
        BridgedComponent.prototype.onDisappeared = function () {
            _super.prototype.onDisappeared.call(this);
            this._imp.onDisappeared();
        };
        return BridgedComponent;
    }(nn.Component));
    nn.BridgedComponent = BridgedComponent;
})(nn || (nn = {}));
var nn;
(function (nn) {
    // network
    var HttpConnector = (function (_super) {
        __extends(HttpConnector, _super);
        function HttpConnector() {
            var _this = _super.call(this) || this;
            _this._imp = new egret.HttpRequest();
            _this._prg = new nn.Percentage();
            //暴露到外部设置
            //this._imp.withCredentials = true;
            nn.EventHook(_this._imp, egret.Event.COMPLETE, _this.__cnt_completed, _this);
            nn.EventHook(_this._imp, egret.IOErrorEvent.IO_ERROR, _this.__cnt_error, _this);
            return _this;
        }
        HttpConnector.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._imp = undefined;
        };
        HttpConnector.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.delegate = this;
        };
        HttpConnector.prototype._signalConnected = function (sig, s) {
            if (sig == nn.SignalChanged)
                nn.EventHook(this._imp, egret.ProgressEvent.PROGRESS, this.__cnt_progress, this);
        };
        HttpConnector.prototype.start = function () {
            this.data = null;
            if (this.method == nn.HttpMethod.GET) {
                this._imp.open(this.fullUrl(), egret.HttpMethod.GET);
                this._imp.send();
            }
            else {
                this._imp.open(this.url, egret.HttpMethod.POST);
                if (this.fields) {
                    this._imp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    var d = nn.URL.MapToField(this.fields);
                    this._imp.send(d);
                }
                else {
                    this._imp.send();
                }
            }
        };
        HttpConnector.prototype.useCredentials = function () {
            this._imp.withCredentials = true;
        };
        HttpConnector.prototype.__cnt_completed = function (e) {
            this.data = this._imp ? this._imp.response : null;
            this.signals.emit(nn.SignalDone, this.data);
            this.signals.emit(nn.SignalEnd);
        };
        HttpConnector.prototype.__cnt_error = function (e) {
            this.signals.emit(nn.SignalFailed, new nn.Failed(-1, "网络连接失败"));
            this.signals.emit(nn.SignalEnd);
        };
        HttpConnector.prototype.__cnt_progress = function (e) {
            this._prg.max = e.bytesTotal;
            this._prg.value = e.bytesLoaded;
            this.signals.emit(nn.SignalChanged, this._prg);
        };
        return HttpConnector;
    }(nn.CHttpConnector));
    nn.HttpConnector = HttpConnector;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var _FramesManager = (function (_super) {
        __extends(_FramesManager, _super);
        function _FramesManager() {
            return _super.apply(this, arguments) || this;
        }
        _FramesManager.prototype.launch = function (c) {
            nn.EventHook(c, egret.Event.ENTER_FRAME, this.onRendering, this);
            nn.EventHook(c, egret.Event.RENDER, this.onPrepare, this);
        };
        _FramesManager.prototype.onPrepare = function () {
            this.__invalidating = false;
            _super.prototype.onPrepare.call(this);
            // 如过更新的同时又加入了新的，则需要再一次刷新
            if (this.__invalidating)
                egret.callLater(this.invalidate, this);
        };
        _FramesManager.prototype.invalidate = function () {
            this.__invalidating = true;
            egret.MainContext.instance.stage.invalidate();
        };
        return _FramesManager;
    }(nn.CFramesManager));
    nn._FramesManager = _FramesManager;
    nn.loader.InBoot(function () {
        nn.FramesManager = new _FramesManager();
    });
})(nn || (nn = {}));
var nn;
(function (nn) {
    var Font = (function () {
        function Font() {
        }
        // 计算单行文字大小
        Font.sizeOfString = function (str, fontSize, width, height) {
            var w = 0, h = fontSize;
            w = (str.length ? str.length + 1 : 0) * fontSize;
            if (width) {
                h = Math.ceil(w / width) * fontSize;
                if (height && h > height)
                    h = height;
                w = Math.min(w, width);
                return new nn.Size(w, h);
            }
            if (height) {
                if (fontSize > height)
                    h = height;
                return new nn.Size(w, h);
            }
            return new nn.Size(w, h);
        };
        // 计算多行文字大小
        Font.sizeFitString = function (str, fontSize, width, height, lineSpacing) {
            if (!str || !str.length)
                return new nn.Size();
            var r = new nn.Size();
            var lns = str.split('\n');
            lns.forEach(function (s) {
                var sz = Font.sizeOfString(s, fontSize, width, height);
                r.width = Math.max(r.width, sz.width);
                r.height += sz.height;
            });
            r.height += lns.length * lineSpacing;
            return r;
        };
        return Font;
    }());
    nn.Font = Font;
})(nn || (nn = {}));
var nn;
(function (nn) {
    // 应用设置fillMode导致scaleFactor！=1，所以需要对egret的画法进行修正
    egret.sys.BitmapNode['$updateTextureDataWithScale9Grid'] = function (node, scale9Grid, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH) {
        var imageWidth = bitmapWidth;
        var imageHeight = bitmapHeight;
        destW = destW - (textureWidth - bitmapWidth * egret.$TextureScaleFactor);
        destH = destH - (textureHeight - bitmapHeight * egret.$TextureScaleFactor);
        var targetW0 = scale9Grid.x - offsetX;
        var targetH0 = scale9Grid.y - offsetY;
        var sourceW0 = targetW0 / egret.$TextureScaleFactor;
        var sourceH0 = targetH0 / egret.$TextureScaleFactor;
        var sourceW1 = scale9Grid.width / egret.$TextureScaleFactor;
        var sourceH1 = scale9Grid.height / egret.$TextureScaleFactor;
        //防止空心的情况出现。
        if (sourceH1 == 0) {
            sourceH1 = 1;
            if (sourceH0 >= imageHeight) {
                sourceH0--;
            }
        }
        if (sourceW1 == 0) {
            sourceW1 = 1;
            if (sourceW0 >= imageWidth) {
                sourceW0--;
            }
        }
        // sf
        targetW0 *= nn.ScaleFactorW;
        targetH0 *= nn.ScaleFactorH;
        var sourceX0 = bitmapX;
        var sourceX1 = sourceX0 + sourceW0;
        var sourceX2 = sourceX1 + sourceW1;
        var sourceW2 = imageWidth - sourceW0 - sourceW1;
        var sourceY0 = bitmapY;
        var sourceY1 = sourceY0 + sourceH0;
        var sourceY2 = sourceY1 + sourceH1;
        var sourceH2 = imageHeight - sourceH0 - sourceH1;
        var targetW2 = sourceW2 * egret.$TextureScaleFactor;
        var targetH2 = sourceH2 * egret.$TextureScaleFactor;
        if ((sourceW0 + sourceW2) * egret.$TextureScaleFactor > destW || (sourceH0 + sourceH2) * egret.$TextureScaleFactor > destH) {
            node.drawImage(bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, destW, destH);
            return;
        }
        // sf
        targetW2 *= nn.ScaleFactorW;
        targetH2 *= nn.ScaleFactorH;
        var targetX0 = offsetX;
        var targetX1 = targetX0 + targetW0;
        var targetX2 = targetX0 + (destW - targetW2);
        var targetW1 = destW - targetW0 - targetW2;
        var targetY0 = offsetY;
        var targetY1 = targetY0 + targetH0;
        var targetY2 = targetY0 + destH - targetH2;
        var targetH1 = destH - targetH0 - targetH2;
        //
        //             x0     x1     x2
        //          y0 +------+------+------+
        //             |      |      |      | h0(s)
        //             |      |      |      |
        //          y1 +------+------+------+
        //             |      |      |      | h1
        //             |      |      |      |
        //          y2 +------+------+------+
        //             |      |      |      | h2(s)
        //             |      |      |      |
        //             +------+------+------+
        //                w0(s)     w1     w2(s)
        //
        if (sourceH0 > 0) {
            if (sourceW0 > 0)
                node.drawImage(sourceX0, sourceY0, sourceW0, sourceH0, targetX0, targetY0, targetW0, targetH0);
            if (sourceW1 > 0)
                node.drawImage(sourceX1, sourceY0, sourceW1, sourceH0, targetX1, targetY0, targetW1, targetH0);
            if (sourceW2 > 0)
                node.drawImage(sourceX2, sourceY0, sourceW2, sourceH0, targetX2, targetY0, targetW2, targetH0);
        }
        if (sourceH1 > 0) {
            if (sourceW0 > 0)
                node.drawImage(sourceX0, sourceY1, sourceW0, sourceH1, targetX0, targetY1, targetW0, targetH1);
            if (sourceW1 > 0)
                node.drawImage(sourceX1, sourceY1, sourceW1, sourceH1, targetX1, targetY1, targetW1, targetH1);
            if (sourceW2 > 0)
                node.drawImage(sourceX2, sourceY1, sourceW2, sourceH1, targetX2, targetY1, targetW2, targetH1);
        }
        if (sourceH2 > 0) {
            if (sourceW0 > 0)
                node.drawImage(sourceX0, sourceY2, sourceW0, sourceH2, targetX0, targetY2, targetW0, targetH2);
            if (sourceW1 > 0)
                node.drawImage(sourceX1, sourceY2, sourceW1, sourceH2, targetX1, targetY2, targetW1, targetH2);
            if (sourceW2 > 0)
                node.drawImage(sourceX2, sourceY2, sourceW2, sourceH2, targetX2, targetY2, targetW2, targetH2);
        }
    };
})(nn || (nn = {}));
var nn;
(function (nn) {
    var CollectionView = (function (_super) {
        __extends(CollectionView, _super);
        function CollectionView() {
            var _this = _super.call(this) || this;
            /** 元素的默认类型 */
            _this.itemClass = nn.Sprite;
            /** 空余元素 */
            _this.nullItemClass = nn.Sprite;
            _this.dataSource = _this;
            return _this;
        }
        CollectionView.prototype.numberOfItems = function () {
            return 0;
        };
        CollectionView.prototype.classForItem = function (idx) {
            return this.itemClass;
        };
        CollectionView.prototype.classForNullItem = function () {
            return this.nullItemClass;
        };
        CollectionView.prototype.updateItem = function (item, idx) {
        };
        CollectionView.prototype.updateNullItem = function (item) {
        };
        /** 弹出一个元素 */
        CollectionView.prototype.popUsedItem = function () {
        };
        /** 拿出一个元素 */
        CollectionView.prototype.useItem = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            return null;
        };
        /** 放回去一个元素 */
        CollectionView.prototype.unuseItem = function (item) {
        };
        CollectionView.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            this.reloadData();
        };
        return CollectionView;
    }(nn.Sprite));
    nn.CollectionView = CollectionView;
    /** 类似于iTunes Coverflow的效果 */
    var CoverFlowView = (function (_super) {
        __extends(CoverFlowView, _super);
        function CoverFlowView() {
            var _this = _super.call(this) || this;
            /** 最多屏幕上出现的个数 */
            _this.maxItemsOnScreen = -1;
            /** 选中那个 */
            _this.selection = 0;
            /** 自动停靠
                @note 交互一办抬起手指后，是否自动对齐
             */
            _this.autoDock = true;
            _this._minIndex = 0;
            _this._allItems = 0;
            _this._nullItems = 0;
            _this._usedItems = new Array();
            _this._reuseItems = new nn.SimpleReusesPool(_this.instanceItem, _this);
            // 动态的偏移位置，拖动的交互依赖
            _this.offsetPos = new nn.Point();
            _this._startPos = new nn.Point();
            _this.signals.connect(nn.SignalTouchBegin, _this._cv_touch_begin, _this);
            _this.signals.connect(nn.SignalTouchMove, _this._cv_touch_move, _this);
            _this.signals.connect(nn.SignalTouchEnd, _this._cv_touch_end, _this);
            return _this;
        }
        CoverFlowView.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        CoverFlowView.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalSelectionChanged);
        };
        CoverFlowView.prototype.reloadData = function () {
            var self = this;
            self.clear();
            self._allItems = self.numberOfItems();
            // cnt 必须为max和cnt中最小的，初始时，0号应该位于第一个
            var all = 0;
            if (self.maxItemsOnScreen == -1) {
                self._nullItems = Math.floor(self._allItems / 2);
                all = self._allItems - self.selection;
            }
            else {
                self._nullItems = Math.floor(self.maxItemsOnScreen / 2);
                all = self.maxItemsOnScreen;
            }
            // 当前最小的id
            self._minIndex = self.selection - self._nullItems;
            // 初始化，需要处理好几种不同的情况
            var clsnull = self.dataSource.classForNullItem();
            for (var i = 0; i < all; ++i) {
                var idx = self._minIndex + i;
                var cls = void 0;
                if (idx < 0) {
                    cls = clsnull;
                }
                else if (idx >= self._allItems) {
                    cls = clsnull;
                }
                else {
                    cls = self.dataSource.classForItem(idx);
                }
                var item = self.useItem(cls, true);
                item.visible = true;
            }
            // 更新
            self._updateItems(true);
            // 抛出默认的选中信号
            var now = self._usedItems[self._nullItems];
            now.signals.emit(nn.SignalSelected);
            self.signals.emit(nn.SignalSelectionChanged, { now: now });
        };
        CoverFlowView.prototype.popUsedItem = function (idx) {
            var self = this;
            if (self._usedItems.length == 0)
                return;
            if (idx == null)
                idx = self._usedItems.length - 1;
            var item = this._usedItems[idx];
            this.unuseItem(item);
        };
        CoverFlowView.prototype.clear = function () {
            var _this = this;
            var self = this;
            nn.ArrayT.Clear(self._usedItems, function (item) {
                item.visible = false;
                _this._reuseItems.unuse(nn.Classname(item), item);
            });
        };
        CoverFlowView.prototype.useItem = function (cls, end) {
            var idr = nn.Classname(cls);
            var item = this._reuseItems.use(idr, null, [cls]);
            if (end)
                this._usedItems.push(item);
            else
                nn.ArrayT.InsertObjectAtIndex(this._usedItems, item, 0);
            return item;
        };
        CoverFlowView.prototype.unuseItem = function (item) {
            this._reuseItems.unuse(nn.Classname(item), item);
            nn.ArrayT.RemoveObject(this._usedItems, item);
        };
        /** 根据位置更新尺寸 */
        CoverFlowView.prototype.updateItemSize = function (item, idx, pos) {
        };
        /** 一次性刷新所有尺寸 */
        CoverFlowView.prototype.updateItemsSize = function (items, idx) {
        };
        /** 打开下一个 */
        CoverFlowView.prototype.gotoNext = function () {
            var self = this;
            var tgtid = self._minIndex + self._usedItems.length;
            // 提供null的支持，所以需要把null参与计算
            if (tgtid >= this._allItems + this._nullItems)
                return false;
            // 踢掉第一个
            self.popUsedItem(0);
            // 加上最后一个
            var cls = tgtid >= this._allItems ? this.dataSource.classForNullItem() : this.dataSource.classForItem(tgtid);
            var item = this.useItem(cls, true);
            item.visible = true;
            // 调整下min序号
            ++self._minIndex;
            self.selection = self._minIndex + self._nullItems;
            // 从当前位置继续滑动，而不是重新开始
            this._startPos.copy(this.touch.currentPosition);
            this.offsetPos.reset();
            this._updateItems(true);
            // 发送信号
            var old = self._usedItems[self._nullItems - 1];
            var now = self._usedItems[self._nullItems];
            self.signals.emit(nn.SignalSelectionChanged, { now: now, old: old });
            now.signals.emit(nn.SignalSelected);
            old.signals.emit(nn.SignalDeselected);
            return true;
        };
        /** 打开上一个 */
        CoverFlowView.prototype.gotoPrevious = function () {
            var self = this;
            var tgtid = self._minIndex - 1;
            // 提供对null的支持
            if (tgtid < -self._nullItems)
                return false;
            // 踢掉最后一个
            self.popUsedItem();
            // 加上前一个，如过请求的是null，则取null的类型
            var cls = tgtid < 0 ? this.dataSource.classForNullItem() : this.dataSource.classForItem(tgtid);
            var item = this.useItem(cls, true);
            item.visible = true;
            // 调整下min序号
            --self._minIndex;
            self.selection = self._minIndex + self._nullItems;
            this._startPos.copy(this.touch.currentPosition);
            this.offsetPos.reset();
            this._updateItems(true);
            var old = self._usedItems[self._nullItems + 1];
            var now = self._usedItems[self._nullItems];
            self.signals.emit(nn.SignalSelectionChanged, { now: now, old: old });
            now.signals.emit(nn.SignalSelected);
            old.signals.emit(nn.SignalDeselected);
            return true;
        };
        /** 用来测试能否运行goto，如果是false那么touch将被跳掉 */
        CoverFlowView.prototype.canGoto = function () {
            var self = this;
            if (self.thresholdSize) {
                // 如过设置了触发器大小，则在底层自动核算是否需要滚向下一个
                if (self.thresholdSize.width > 0) {
                    // 如果已经是第一个，则不能往前翻页
                    if (self.offsetPos.x > 0) {
                        if (self._minIndex == -self._nullItems)
                            return false;
                        return true;
                    }
                    else if (self.offsetPos.x < 0) {
                        if (self._allItems - 1 == self._minIndex + self._nullItems)
                            return false;
                        return true;
                    }
                }
                else {
                    if (self.offsetPos.y > 0) {
                        if (self._minIndex == -self._nullItems)
                            return false;
                        return true;
                    }
                    else if (self.offsetPos.y < 0) {
                        if (self._allItems - 1 == self._minIndex + self._nullItems)
                            return false;
                        return true;
                    }
                }
            }
            return true;
        };
        CoverFlowView.prototype._updateItems = function (updateData) {
            var self = this;
            // 挨个更新
            self._usedItems.forEach(function (item, i) {
                var idx = self._minIndex + i;
                // 跳过空白的
                if (idx < 0) {
                    if (updateData) {
                        self.updateNullItem(item);
                        item.updateData();
                    }
                    return;
                }
                // 刷新数据
                if (updateData) {
                    self.updateItem(item, idx);
                    item.updateData();
                }
                // 刷新尺寸
                self.updateItemSize(item, idx, i);
            });
            // 一次刷新所有尺寸
            if (self.thresholdSize) {
                // 如过设置了触发器大小，则在底层自动核算是否需要滚向下一个
                if (self.thresholdSize.width > 0) {
                    var thred = self.thresholdSize.width / 2;
                    if (self.offsetPos.x >= thred) {
                        if (this.gotoPrevious())
                            return;
                    }
                    else if (self.offsetPos.x <= -thred) {
                        if (this.gotoNext())
                            return;
                    }
                }
                else {
                    var thred = self.thresholdSize.height / 2;
                    if (self.offsetPos.y >= thred) {
                        if (this.gotoPrevious())
                            return;
                    }
                    else if (self.offsetPos.y <= -thred) {
                        if (this.gotoNext())
                            return;
                    }
                }
            }
            this.updateItemsSize(this._usedItems, this._minIndex);
        };
        CoverFlowView.prototype.instanceItem = function (cls) {
            var item = new cls();
            // 注册几个动信号
            item.signals.register(nn.SignalSelected);
            item.signals.register(nn.SignalDeselected);
            this.addChild(item);
            return item;
        };
        CoverFlowView.prototype._cv_touch_begin = function () {
            this._startPos.copy(this.touch.startPosition);
        };
        CoverFlowView.prototype._cv_touch_move = function () {
            var cur = this.touch.currentPosition;
            this.offsetPos.reset(cur.x - this._startPos.x, cur.y - this._startPos.y);
            if (this.canGoto())
                this._updateItems(false);
        };
        CoverFlowView.prototype._cv_touch_end = function () {
            var self = this;
            if (self.offsetPos.x == 0 && self.offsetPos.y == 0)
                return;
            if (self.autoDock) {
                var thrd = 0;
                if (self.thresholdSize) {
                    var done = false;
                    if (self.thresholdSize.width > 0) {
                        var thd = self.thresholdSize.width / 2;
                        if (self.offsetPos.x > thd) {
                            done = self.gotoPrevious();
                        }
                        else if (self.offsetPos.x < -thd) {
                            done = self.gotoNext();
                        }
                    }
                    else {
                        var thd = self.thresholdSize.height / 2;
                        if (self.offsetPos.y > thd) {
                            done = self.gotoPrevious();
                        }
                        else if (self.offsetPos.y < -thd) {
                            done = self.gotoNext();
                        }
                    }
                    if (done == false) {
                        self.offsetPos.reset();
                        self._updateItems(true);
                        return;
                    }
                }
            }
            self.offsetPos.reset();
        };
        return CoverFlowView;
    }(CollectionView));
    nn.CoverFlowView = CoverFlowView;
})(nn || (nn = {}));
var nn;
(function (nn) {
    function _bindDesktop(c, dsk) {
        c.__desktop = dsk;
    }
    function _bindedDesktop(c) {
        return c ? c.__desktop : null;
    }
    var DisabledAutolayoutSprite = (function (_super) {
        __extends(DisabledAutolayoutSprite, _super);
        function DisabledAutolayoutSprite() {
            return _super.apply(this, arguments) || this;
        }
        DisabledAutolayoutSprite.prototype.setNeedsLayout = function () { };
        return DisabledAutolayoutSprite;
    }(nn.Sprite));
    var DisabledAutolayoutBitmap = (function (_super) {
        __extends(DisabledAutolayoutBitmap, _super);
        function DisabledAutolayoutBitmap() {
            return _super.apply(this, arguments) || this;
        }
        DisabledAutolayoutBitmap.prototype.setNeedsLayout = function () { };
        return DisabledAutolayoutBitmap;
    }(nn.Bitmap));
    /** Desktop默认依赖的执行队列，业务可以通过替换对来来手动划分不同的Desktop打开层级
        @note 如果Desktop放到队列中，则当上一个dialog关闭时，下一个dialog才打开
    */
    nn.DesktopOperationQueue = new nn.OperationQueue();
    /** 桌面，打开时铺平整个屏幕 */
    var Desktop = (function (_super) {
        __extends(Desktop, _super);
        function Desktop(ui) {
            var _this = _super.call(this) || this;
            /** 高亮元素，在元素所在的位置镂空背景 */
            _this._filters = new Array();
            /** 是否已经打开
                @note 如果open在队列中，则调用open后，当前parent仍然为null，但是逻辑上该dialog算是已经打开，所以需要使用独立的变量来维护打开状态
            */
            _this._isOpened = false;
            /** 队列控制时依赖的队列组，业务层设置为自己的队列实例来和标准desktop的队列隔离，避免多重desktop等待时造成业务中弹出的类似如tip的页面在业务dialog后等待的问题 */
            _this.queue = nn.DesktopOperationQueue;
            /** desktop打开的样式
                @note 默认为弹出在desktopLayer，否则为push进desktopLayer
                弹出不会隐藏后面的内容，push将根据对应的viewStack来决定是否背景的内容隐藏
            */
            _this.popupMode = true;
            // 需要被添加到已经打开的对战中
            _this._addIntoOpening = true;
            /** 点击桌面自动关闭 */
            _this.clickedToClose = false;
            /** 使用自适应来布局内容页面 */
            _this.adaptiveContentFrame = true;
            if (nn.ObjectClass(_this).BackgroundColor)
                _this.backgroundColor = nn.ObjectClass(_this).BackgroundColor;
            if (nn.ObjectClass(_this).BackgroundImage)
                _this.backgroundImage = nn.ObjectClass(_this).BackgroundImage;
            _this.touchEnabled = true;
            _this.contentView = ui;
            _this.frame = nn.StageBounds;
            _this.signals.connect(nn.SignalClicked, _this.__dsk_clicked, _this);
            _this.signals.connect(nn.SignalHitTest, _this.__dsk_clicked, _this);
            _this.signals.connect(nn.SignalAddedToStage, _this.__dsk_addedtostage, _this);
            // 保证一直是满屏大小
            nn.CApplication.shared.signals.connect(nn.SignalFrameChanged, _this.__dsk_sizechanged, _this);
            return _this;
        }
        Desktop.prototype.dispose = function () {
            nn.ArrayT.Clear(this._filters);
            _super.prototype.dispose.call(this);
        };
        Desktop.FromView = function (c) {
            var r = _bindedDesktop(c);
            var t = c;
            while (r == null && c) {
                c = c.parent;
                r = _bindedDesktop(c);
            }
            return r;
        };
        // 屏幕大小变化时需要及时更新desktop大小，不然周边会出现空白
        Desktop.prototype.__dsk_sizechanged = function (s) {
            this.frame = nn.StageBounds;
        };
        Desktop.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalHitTest);
            this._signals.register(nn.SignalOpening);
            this._signals.register(nn.SignalClosing);
            this._signals.register(nn.SignalOpen);
            this._signals.register(nn.SignalClose);
        };
        Desktop.prototype.addFilter = function (ui) {
            this._filters.push(ui);
        };
        Object.defineProperty(Desktop.prototype, "onlyFiltersTouchEnabled", {
            get: function () {
                return this._onlyFiltersTouchEnabled;
            },
            set: function (val) {
                this._onlyFiltersTouchEnabled = val;
                this.touchEnabled = !val;
                this.touchChildren = !val;
            },
            enumerable: true,
            configurable: true
        });
        Desktop.prototype.hitTestInFilters = function (pt) {
            var _this = this;
            return nn.ArrayT.QueryObject(this._filters, function (ui) {
                var rc = ui.convertRectTo(ui.bounds(), _this);
                return rc.containsPoint(pt);
            }, this, null);
        };
        Desktop.prototype.onLoaded = function () {
            _super.prototype.onLoaded.call(this);
            if (this._contentView)
                this._contentView.updateData();
        };
        Desktop.prototype.__dsk_addedtostage = function () {
            // 显示内容页面
            if (this._contentView)
                this.addChild(this._contentView);
        };
        Desktop.prototype.onAppeared = function () {
            _super.prototype.onAppeared.call(this);
            // 延迟关闭
            if (nn.isZero(this.delayClose) == false)
                nn.Delay(this.delayClose, this.close, this);
            this.updateFilters();
        };
        Desktop.prototype.updateFilters = function () {
            var _this = this;
            if (this._filters.length == 0)
                return;
            var bkcr = this.backgroundColor;
            var bkimg = this.backgroundImage;
            this.backgroundColor = null;
            this.backgroundImage = null;
            var sp = new DisabledAutolayoutSprite();
            sp.hasHollowOut = true;
            sp.backgroundColor = bkcr;
            sp.backgroundImage = bkimg;
            sp.frame = this.bounds();
            sp.updateLayout();
            this._filters.forEach(function (ui) {
                var bmp = new DisabledAutolayoutBitmap();
                bmp.frame = ui.convertRectTo(ui.bounds(), _this);
                bmp.imageSource = ui.renderToTexture();
                bmp.updateLayout();
                sp.hollowOut(bmp);
            }, this);
            this.backgroundImage = sp.renderToTexture();
        };
        Object.defineProperty(Desktop.prototype, "contentView", {
            get: function () {
                return this._contentView;
            },
            set: function (val) {
                if (this._contentView == val)
                    return;
                if (this._contentView) {
                    this.removeChild(this._contentView);
                    _bindDesktop(this._contentView, null);
                }
                this._contentView = val;
                if (val) {
                    _bindDesktop(val, this);
                    if (this.onStage)
                        this.__dsk_addedtostage();
                    val.signals.register(nn.SignalOpening);
                    val.signals.register(nn.SignalClosing);
                    val.signals.register(nn.SignalOpen);
                    val.signals.register(nn.SignalClose);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Desktop.prototype, "isOpened", {
            get: function () {
                return this._isOpened;
            },
            enumerable: true,
            configurable: true
        });
        /** 打开
            @param queue, 是否放到队列中打开
        */
        Desktop.prototype.open = function (queue) {
            if (queue === void 0) { queue = false; }
            if (this._isOpened)
                return;
            this._isOpened = true;
            if (queue) {
                this._oper = new DesktopOperation(this);
                this.queue.add(this._oper);
            }
            else {
                this.doOpen();
            }
        };
        /** 接着其他对象打开 */
        Desktop.prototype.follow = function (otherContent) {
            if (this._isOpened)
                return;
            this._isOpened = true;
            this._oper = new DesktopOperation(this);
            var dsk = _bindedDesktop(otherContent);
            if (dsk._oper == null) {
                this.queue.add(this._oper);
            }
            else {
                this.queue.follow(dsk._oper, this._oper);
            }
        };
        /** 替换打开 */
        Desktop.prototype.replace = function (otherContent) {
            if (this._isOpened)
                return;
            this._isOpened = true;
            var dsk = _bindedDesktop(otherContent);
            if (dsk._oper == null) {
                dsk.close();
                this.open();
            }
            else {
                if (dsk.desktopLayer == null)
                    dsk.desktopLayer = this.desktopLayer;
                this._oper = new DesktopOperation(this);
                this.queue.replace(dsk._oper, this._oper);
                dsk.close();
            }
        };
        Desktop.prototype.doOpen = function () {
            if (this.desktopLayer == null)
                this.desktopLayer = nn.CApplication.shared.gameLayer;
            if (this._onlyFiltersTouchEnabled)
                Desktop._AllNeedFilters.push(this);
            if (this._addIntoOpening)
                Desktop._AllOpenings.push(this);
            this.signals.emit(nn.SignalOpening);
            if (this._contentView)
                this._contentView.signals.emit(nn.SignalOpening);
            if (this.popupMode)
                this.desktopLayer.addChild(this);
            else
                this.desktopLayer.push(this);
            if (this._contentView)
                this._contentView.signals.emit(nn.SignalOpen);
            this.signals.emit(nn.SignalOpen);
        };
        /** 关闭所有正在打开的desktop */
        Desktop.CloseAllOpenings = function () {
            nn.ArrayT.SafeClear(this._AllOpenings, function (e) {
                e.close();
            });
        };
        /** 正在打开的desktop */
        Desktop.Current = function () {
            return nn.ArrayT.Top(this._AllOpenings);
        };
        /** 关闭 */
        Desktop.prototype.close = function () {
            if (!this._isOpened)
                return;
            this._isOpened = false;
            // 如过还在等待队列中，需要保护一下状态
            if (this.parent == null) {
                if (this._oper) {
                    this.queue.remove(this._oper);
                    this._oper = null;
                }
                return;
            }
            this.doClose();
            if (this._oper) {
                this._oper.done();
                this._oper = null;
            }
        };
        Desktop.prototype.doClose = function () {
            if (this._onlyFiltersTouchEnabled)
                nn.ArrayT.RemoveObject(Desktop._AllNeedFilters, this);
            if (this._addIntoOpening)
                nn.ArrayT.RemoveObject(Desktop._AllOpenings, this);
            this.signals.emit(nn.SignalClosing);
            if (this._contentView)
                this._contentView.signals.emit(nn.SignalClosing);
            // 保护生命期
            this.grab();
            if (this._contentView)
                this._contentView.grab();
            // popup弹出模式直接作为deskLayer子控件
            if (this.popupMode) {
                this.onDisappeared();
                this.desktopLayer.removeChild(this);
            }
            else {
                this.desktopLayer.pop(this);
            }
            if (this._contentView)
                this._contentView.signals.emit(nn.SignalClose);
            this.signals.emit(nn.SignalClose);
            // 释放
            if (this._contentView)
                this._contentView.drop();
            this.drop();
        };
        Desktop.prototype.__dsk_clicked = function () {
            if (!this.clickedToClose)
                return;
            this.close();
        };
        Desktop.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            if (this._contentView) {
                if (this.adaptiveContentFrame) {
                    var crc = this._contentView.bestFrame();
                    if (crc) {
                        crc.center = this.bounds().center.add(crc.x, crc.y);
                        var cpos = this._contentView.bestPosition();
                        if (cpos)
                            crc.position = cpos;
                        this._contentView.frame = crc;
                    }
                }
            }
        };
        return Desktop;
    }(nn.Component));
    Desktop.BackgroundColor = nn.Color.RGBf(0, 0, 0, 0.61);
    // 所有需要被镂空的desktop，用来在点击是过滤掉touch事件
    Desktop._AllNeedFilters = new Array();
    // 当前已经打开的所有desktop的数组
    Desktop._AllOpenings = new Array();
    nn.Desktop = Desktop;
    var DesktopOperation = (function (_super) {
        __extends(DesktopOperation, _super);
        function DesktopOperation(desk) {
            var _this = _super.call(this) || this;
            _this._desktop = desk;
            return _this;
        }
        DesktopOperation.prototype.start = function () {
            var dsk = this._desktop;
            var d = dsk.delayOpenInQueue;
            if (d) {
                nn.Delay(d, dsk.doOpen, dsk);
            }
            else {
                dsk.doOpen();
            }
        };
        return DesktopOperation;
    }(nn.Operation));
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 弹出的对话框类型
        @note 通过返回 bestFrame 来决定对话框的大小 */
    var Dialog = (function (_super) {
        __extends(Dialog, _super);
        function Dialog() {
            var _this = _super.call(this) || this;
            // 最终转由desktop处理
            _this._filters = new nn.CSet();
            /** 弹出的模式 */
            _this.popupMode = true;
            _this._clickedToClose = false;
            _this.anchor = new nn.Point(0.5, 0.5);
            return _this;
        }
        Dialog.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            // 请求关闭
            this._signals.register(nn.SignalRequestClose);
            // 其他状态
            this._signals.register(nn.SignalOpening);
            this._signals.register(nn.SignalClosing);
            this._signals.register(nn.SignalOpen);
            this._signals.register(nn.SignalClose);
        };
        Dialog.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            nn.SetT.Clear(this._filters);
        };
        /** 获得视图隶属的dialog对象 */
        Dialog.FromView = function (cv) {
            return nn.findParentByType(cv, Dialog);
        };
        Dialog.prototype.addFilter = function (ui) {
            this._filters.add(ui);
        };
        Dialog.prototype.onAppeared = function () {
            _super.prototype.onAppeared.call(this);
            if (nn.ISDEBUG)
                nn.info(nn.Classname(this) + ' 显示');
        };
        Dialog.prototype.onDisappeared = function () {
            _super.prototype.onDisappeared.call(this);
            if (nn.ISDEBUG)
                nn.info(nn.Classname(this) + ' 消失');
        };
        Object.defineProperty(Dialog.prototype, "clickedToClose", {
            get: function () {
                return this._clickedToClose;
            },
            set: function (b) {
                if (this._clickedToClose == b)
                    return;
                var dsk = nn.Desktop.FromView(this);
                if (dsk)
                    dsk.clickedToClose = b;
                this._clickedToClose = b;
            },
            enumerable: true,
            configurable: true
        });
        Dialog.prototype.instanceDesktop = function () {
            var dsk = new nn.Desktop(this);
            dsk.onlyFiltersTouchEnabled = this.onlyFiltersTouchEnabled;
            dsk.delayClose = this.delayClose;
            dsk.delayOpenInQueue = this.delayOpenInQueue;
            dsk.clickedToClose = this.clickedToClose;
            dsk.popupMode = this.popupMode;
            dsk.desktopLayer = this.desktopLayer;
            if (this.queue)
                dsk.queue = this.queue;
            this.signals.connect(nn.SignalRequestClose, dsk.close, dsk);
            this._filters.forEach(function (o) {
                dsk.addFilter(o);
            });
            return dsk;
        };
        /** 替换掉队列中对应的的dialog */
        Dialog.prototype.replace = function (link) {
            var dsk = this.instanceDesktop();
            dsk.replace(link);
            return dsk;
        };
        /** 打开
            @param queue, 是否放到队列中打开，默认为 false
        */
        Dialog.prototype.open = function (queue) {
            if (queue === void 0) { queue = false; }
            var dsk = this.instanceDesktop();
            dsk.open(queue);
            return dsk;
        };
        /** 打开在队列中的指定dialog之后 */
        Dialog.prototype.follow = function (link) {
            var dsk = this.instanceDesktop();
            dsk.follow(link);
            return dsk;
        };
        /** 关闭 */
        Dialog.prototype.close = function () {
            this.signals.emit(nn.SignalRequestClose);
        };
        /** 默认为0尺寸 */
        Dialog.prototype.bestFrame = function () {
            return new nn.Rect();
        };
        /** 默认的位置，返回null代表使用对bestFrame进行偏移 */
        Dialog.prototype.bestPosition = function () {
            return null;
        };
        return Dialog;
    }(nn.Component));
    nn.Dialog = Dialog;
})(nn || (nn = {}));
var nn;
(function (nn) {
    // 只能用在单player的模式下
    var Div = (function (_super) {
        __extends(Div, _super);
        function Div() {
            var _this = _super.call(this) || this;
            // 创建dom对象
            var p = document.querySelector('.egret-player');
            _this._node = document.createElement('div');
            _this._node.style.cssText = 'position:absolute;';
            p.appendChild(_this._node);
            return _this;
        }
        Div.prototype.dispose = function () {
            this._node.remove();
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(Div.prototype, "text", {
            get: function () {
                return this._html;
            },
            set: function (text) {
                this._html = text;
                this._node.innerHTML = text;
                // 填满
                var f = this._node.children[0];
                if (f) {
                    f.style.width = '100%';
                    f.style.height = '100%';
                }
            },
            enumerable: true,
            configurable: true
        });
        Div.prototype.onAppeared = function () {
            _super.prototype.onAppeared.call(this);
            this._node.style.display = 'block';
        };
        Div.prototype.onDisappeared = function () {
            _super.prototype.onDisappeared.call(this);
            this._node.style.display = 'none';
        };
        Div.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            var rc = this.bounds();
            rc = this.convertRectTo(rc, null);
            rc.x *= nn.DomScaleFactorX * nn.ScaleFactorX;
            rc.y *= nn.DomScaleFactorY * nn.ScaleFactorY;
            rc.x += nn.DomOffsetX;
            rc.y += nn.DomOffsetY;
            rc.width *= nn.DomScaleFactorX * nn.ScaleFactorX;
            rc.height *= nn.DomScaleFactorY * nn.ScaleFactorY;
            this._node.style.left = rc.x + 'px';
            this._node.style.top = rc.y + 'px';
            this._node.style.width = rc.width + 'px';
            this._node.style.height = rc.height + 'px';
        };
        return Div;
    }(nn.CDom));
    nn.Div = Div;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var Hud = (function (_super) {
        __extends(Hud, _super);
        function Hud() {
            var _this = _super.call(this) || this;
            if (nn.ObjectClass(_this).BackgroundColor)
                _this.backgroundColor = nn.ObjectClass(_this).BackgroundColor;
            if (nn.ObjectClass(_this).BackgroundImage)
                _this.backgroundImage = nn.ObjectClass(_this).BackgroundImage;
            _this.edgeInsets = new nn.EdgeInsets(30, 30, 30, 30);
            _this.visible = false;
            return _this;
        }
        Hud.prototype.onAppeared = function () {
            _super.prototype.onAppeared.call(this);
            this.visible = true;
        };
        Hud.prototype.instanceDesktop = function () {
            var desk = new nn.Desktop(this);
            desk.desktopLayer = nn.CApplication.shared.desktopLayer;
            desk.backgroundColor = null;
            desk.backgroundImage = null;
            return desk;
        };
        Hud.prototype.open = function () {
            if (this._desk)
                return;
            this._desk = this.instanceDesktop();
            this._desk.open();
        };
        Hud.prototype.close = function () {
            if (!this._desk)
                return;
            this._desk.close();
            this._desk = null;
        };
        Hud.Text = function (str, delay) {
            if (delay === void 0) { delay = 2; }
            var hud = nn.CApplication.shared.clazzHudText.instance();
            hud.message = str;
            hud.open();
            nn.Delay(delay, function () {
                hud.close();
            }, this);
            return hud;
        };
        Hud.Error = function (str, delay) {
            if (delay === void 0) { delay = 2; }
            var hud = nn.CApplication.shared.clazzHudText.instance();
            hud.message = str;
            hud.mode = false;
            hud.open();
            nn.Delay(delay, function () {
                hud.close();
            }, this);
            return hud;
        };
        Hud.ShowProgress = function () {
            HudProgress.__hud_progress_counter += 1;
            if (HudProgress.__hud_progress) {
                HudProgress.__hud_progress.open();
                return;
            }
            var hud = nn.CApplication.shared.clazzHudProgress.instance();
            hud.open();
            return hud;
        };
        Hud.HideProgress = function () {
            HudProgress.__hud_progress_counter -= 1;
            if (HudProgress.__hud_progress_counter == 0) {
                HudProgress.__hud_progress.delayClose();
            }
            if (nn.ISDEBUG && HudProgress.__hud_progress_counter < 0) {
                nn.fatal("HudProgress 的计数器 <0， 正常逻辑下必须 >=0，可能执行了不匹配的 Show/Hide 过程");
            }
        };
        return Hud;
    }(nn.Sprite));
    Hud.BackgroundColor = new nn.Color(0xffffff, 0xf0);
    nn.Hud = Hud;
    var HudText = (function (_super) {
        __extends(HudText, _super);
        function HudText() {
            var _this = _super.call(this) || this;
            _this.labelMessage = new nn.Label();
            _this.labelMessage.textColor = 0;
            _this.labelMessage.textAlign = "center";
            _this.addChild(_this.labelMessage);
            return _this;
        }
        HudText.prototype.instanceDesktop = function () {
            var desk = _super.prototype.instanceDesktop.call(this);
            desk._addIntoOpening = false;
            return desk;
        };
        Object.defineProperty(HudText.prototype, "message", {
            get: function () {
                return this.labelMessage.text;
            },
            set: function (s) {
                this._setMessage(s);
            },
            enumerable: true,
            configurable: true
        });
        HudText.prototype._setMessage = function (s) {
            this.labelMessage.text = s;
        };
        HudText.prototype.open = function () {
            _super.prototype.open.call(this);
            this._desk.touchEnabled = false;
        };
        HudText.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            this.labelMessage.frame = this.boundsForLayout();
        };
        HudText.prototype.bestFrame = function (inrc) {
            var w = nn.StageBounds.width * 0.9; //业务中还是希望文字可用区域宽一些
            //let w = StageBounds.width * 0.617;
            //let h = StageBounds.height * 0.617;
            //let bsz = Font.sizeFitString(this.labelMessage.text, this.labelMessage.fontSize, w, 0, this.labelMessage.lineSpacing);
            //w = Math.min(bsz.width, w);
            //h = Math.min(bsz.height, h);
            var bsz = this.labelMessage.bestFrame(new nn.Rect(0, 0, w, 0));
            //return new Rect(0, 0, w, h).unapplyEdgeInsets(this.edgeInsets);
            bsz = bsz.unapplyEdgeInsets(this.edgeInsets);
            bsz.x = bsz.y = 0; // unei会引起偏移
            return bsz;
        };
        return HudText;
    }(Hud));
    HudText.BackgroundColor = null;
    HudText.BackgroundImage = null;
    nn.HudText = HudText;
    var HudProgress = (function (_super) {
        __extends(HudProgress, _super);
        function HudProgress() {
            var _this = _super.call(this) || this;
            _this._progressValue = new nn.Percentage(1, 0);
            return _this;
        }
        Object.defineProperty(HudProgress.prototype, "activity", {
            get: function () {
                return this._activity;
            },
            set: function (val) {
                if (this._activity == val)
                    return;
                if (this._activity)
                    this.removeChild(this._activity);
                this._activity = val;
                if (this._activity)
                    this.addChild(val);
            },
            enumerable: true,
            configurable: true
        });
        HudProgress.Current = function () {
            return HudProgress.__hud_progress;
        };
        Object.defineProperty(HudProgress.prototype, "progressValue", {
            get: function () {
                return this._progressValue;
            },
            set: function (v) {
                this._progressValue = v;
                this.updateData();
            },
            enumerable: true,
            configurable: true
        });
        HudProgress.prototype.open = function () {
            if (this.__tmrdc) {
                egret.clearTimeout(this.__tmrdc);
                this.__tmrdc = 0;
            }
            if (HudProgress.__hud_progress)
                return;
            HudProgress.__hud_progress = this;
            _super.prototype.open.call(this);
            this.__tmropen = egret.getTimer();
            if (this._activity)
                this._activity.startAnimation();
        };
        HudProgress.prototype.close = function () {
            _super.prototype.close.call(this);
            if (HudProgress.__hud_progress == this)
                HudProgress.__hud_progress = null;
            if (this._activity)
                this._activity.stopAnimation();
        };
        HudProgress.prototype.delayClose = function (timeout) {
            if (timeout === void 0) { timeout = 0.3; }
            if (this.__tmrdc)
                egret.clearTimeout(this.__tmrdc);
            if ((egret.getTimer() - this.__tmropen) * 0.001 > timeout) {
                this.close();
                return;
            }
            this.__tmrdc = egret.setTimeout(this.doDelayClose, this, timeout * 1000);
        };
        HudProgress.prototype.doDelayClose = function () {
            egret.clearTimeout(this.__tmrdc);
            this.__tmrdc = 0;
            this.close();
        };
        HudProgress.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            if (this._activity)
                this._activity.frame = this.boundsForLayout();
        };
        HudProgress.prototype.bestFrame = function (inrc) {
            if (this._activity)
                return this._activity.bestFrame();
            return new nn.Rect();
        };
        return HudProgress;
    }(Hud));
    HudProgress.BackgroundColor = null;
    HudProgress.BackgroundImage = null;
    HudProgress.__hud_progress = null;
    HudProgress.__hud_progress_counter = 0;
    nn.HudProgress = HudProgress;
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 连续图片（背景） */
    var ContinuousBitmap = (function (_super) {
        __extends(ContinuousBitmap, _super);
        function ContinuousBitmap() {
            var _this = _super.call(this) || this;
            _this._bmpn = new nn.Bitmap(); // bitmap now
            _this._bmpb = new nn.Bitmap(); // bitmap back
            /** 方向，先默认实现为水平 */
            _this.direction = nn.Direction.HOV;
            _this._pos = 0;
            _this.addChild(_this._bmpb);
            _this.addChild(_this._bmpn);
            return _this;
        }
        Object.defineProperty(ContinuousBitmap.prototype, "imageSource", {
            get: function () {
                return this._bmpn.imageSource;
            },
            set: function (ds) {
                this._bmpn.imageSource = ds;
                this._bmpb.imageSource = ds;
            },
            enumerable: true,
            configurable: true
        });
        ContinuousBitmap.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            var rc = this.boundsForLayout();
            this._bmpn.setSize(rc.size);
            this._bmpb.setSize(rc.size);
        };
        /** 偏移的距离 */
        ContinuousBitmap.prototype.offset = function (v) {
            this._pos += v;
            this.position(this._pos);
        };
        /** 直接设置位置 */
        ContinuousBitmap.prototype.position = function (v) {
            var rc = this._bmpn.frame;
            if (this.direction == nn.Direction.HOV)
                rc.x = v % rc.width;
            else
                rc.y = v % rc.height;
            this._bmpn.frame = rc;
            var rcb = this._bmpb.frame;
            if (this.direction == nn.Direction.HOV) {
                if (rc.x >= 0) {
                    rcb.rightTop = rc.leftTop;
                }
                else {
                    rcb.leftTop = rc.rightTop;
                }
            }
            else {
                if (rc.y >= 0) {
                    rcb.leftBottom = rc.leftTop;
                }
                else {
                    rcb.leftTop = rc.leftBottom;
                }
            }
            this._bmpb.frame = rcb;
        };
        return ContinuousBitmap;
    }(nn.Widget));
    nn.ContinuousBitmap = ContinuousBitmap;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var Slider = (function (_super) {
        __extends(Slider, _super);
        function Slider() {
            var _this = _super.call(this) || this;
            /** 水平模式 */
            _this.horizonMode = true;
            _this._progressValue = new nn.Percentage(1, 0);
            _this.clipsToBounds = true;
            _this.signals.connect(nn.SignalTouchBegin, _this.__sld_touchchanged, _this);
            _this.signals.connect(nn.SignalTouchEnd, _this.__sld_touchchanged, _this);
            _this.signals.connect(nn.SignalTouchMove, _this.__sld_touchchanged, _this);
            return _this;
        }
        Slider.prototype.dispose = function () {
            this._progressValue = undefined;
            _super.prototype.dispose.call(this);
        };
        Slider.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalChanged);
        };
        Object.defineProperty(Slider.prototype, "identifierView", {
            get: function () {
                return this._identifierView;
            },
            set: function (s) {
                if (this._identifierView == s)
                    return;
                if (this._identifierView)
                    this.removeChild(this._identifierView);
                this._identifierView = s;
                if (s)
                    this.addChild(s);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "progressValue", {
            get: function () {
                return this._progressValue;
            },
            set: function (val) {
                this._progressValue = val;
                this.updateLayout();
            },
            enumerable: true,
            configurable: true
        });
        Slider.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            if (this._identifierView == null)
                return;
            var rc = this.boundsForLayout();
            var trc = this._identifierView.frame;
            if (this.horizonMode) {
                trc.x = this._progressValue.safepercent * (rc.width - trc.width);
                trc.y = rc.y + (rc.height - trc.height) * 0.5;
            }
            else {
                trc.y = this._progressValue.safepercent * (rc.height - trc.height);
                trc.x = rc.x + (rc.width - trc.width) * 0.5;
            }
            this._identifierView.frame = trc;
        };
        Slider.prototype.__sld_touchchanged = function (s) {
            var t = s.data;
            if (this._identifierView) {
                var rc = this.boundsForLayout();
                var idrc = this._identifierView.frame;
                idrc.x += t.delta.x;
                var pt = idrc.center;
                if (pt.x > rc.width) {
                    pt = rc.rightCenter;
                    idrc.center = pt;
                }
                else if (pt.x < 0) {
                    pt = rc.leftCenter;
                    idrc.center = pt;
                }
                this._identifierView.frame = idrc;
                var p = pt.x / rc.width;
                if (p != this.progressValue.percent) {
                    this.progressValue.percent = p;
                    this.signals.emit(nn.SignalChanged, this.progressValue);
                }
            }
        };
        return Slider;
    }(nn.Widget));
    nn.Slider = Slider;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var ExtBitmapText = (function (_super) {
        __extends(ExtBitmapText, _super);
        function ExtBitmapText() {
            var _this = _super.call(this) || this;
            _this.width = 0;
            _this.height = 0;
            return _this;
        }
        return ExtBitmapText;
    }(egret.BitmapText));
    var BitmapLabel = (function (_super) {
        __extends(BitmapLabel, _super);
        function BitmapLabel() {
            var _this = _super.call(this) || this;
            _this._lbl = new ExtBitmapText();
            _this._fontScale = 1;
            _this._fontSource = null;
            _this._imp.addChild(_this._lbl);
            _this.fontSize = nn.CLabel.FontSize;
            return _this;
        }
        BitmapLabel.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            // 虽然 2.5.6 版本以后实现了align，但是因为不支持字体缩放，所以不用系统的来实现
            if (this._lbl.font == null)
                return;
            var rc = this.boundsForLayout();
            // 需要计算被fontSize影响下的大小和缩放
            rc.width /= this._fontScale;
            rc.height /= this._fontScale;
            this.impSetFrame(rc, this._lbl);
            // 需要计算真实的大小，达到垂直居中
            if (this.textAlign == 'center') {
                var trcw = this._lbl.measuredWidth * nn.ScaleFactorDeW;
                rc.x = (rc.width - trcw) * this._lbl.scaleX * 0.5;
            }
            else if (this.textAlign == 'right') {
                var trcw = this._lbl.measuredWidth * nn.ScaleFactorDeW;
                rc.x = (rc.width - trcw) * this._lbl.scaleX;
            }
            var trch = this._lbl.measuredHeight * nn.ScaleFactorDeH;
            rc.y = (rc.height - trch) * this._lbl.scaleY * 0.5;
            this.impSetFrame(rc, this._lbl);
        };
        Object.defineProperty(BitmapLabel.prototype, "fontSize", {
            get: function () {
                return this._fontSize * nn.ScaleFactorDeS;
            },
            set: function (fs) {
                var self = this;
                if (self._fontSize == fs)
                    return;
                var oldcs = self.characterSpacing;
                var oldls = self.lineSpacing;
                // 获得之前的尺寸
                fs *= nn.ScaleFactorS;
                self._fontSize = fs;
                self._fontScale = fs / nn.CLabel.FontSize;
                // 应用尺寸
                self._lbl.scaleX = self._fontScale;
                self._lbl.scaleY = self._fontScale;
                self.characterSpacing = oldcs;
                self.lineSpacing = oldls;
                // 刷新尺寸
                self.setNeedsLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitmapLabel.prototype, "characterSpacing", {
            get: function () {
                return this._lbl.letterSpacing * this._fontScale;
            },
            set: function (v) {
                this._lbl.letterSpacing = v / this._fontScale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitmapLabel.prototype, "lineSpacing", {
            get: function () {
                return this._lbl.lineSpacing * this._fontScale;
            },
            set: function (v) {
                this._lbl.lineSpacing = v / this._fontScale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitmapLabel.prototype, "text", {
            get: function () {
                return this._lbl.text;
            },
            set: function (s) {
                this._lbl.text = s;
                this.setNeedsLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitmapLabel.prototype, "fontSource", {
            get: function () {
                var fnt = this._lbl.font;
                if (fnt == null)
                    return this._fontSource;
                nn.COriginType.shared.imp = fnt;
                return nn.COriginType.shared;
            },
            set: function (fs) {
                var _this = this;
                if (this._fontSource == fs)
                    return;
                this._fontSource = fs;
                nn.ResManager.getBitmapFont(fs, nn.ResPriority.NORMAL, function (font) {
                    if (fs != _this._fontSource)
                        return;
                    _this._lbl.font = font.use();
                    _this.setNeedsLayout();
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        return BitmapLabel;
    }(nn.CBitmapLabel));
    nn.BitmapLabel = BitmapLabel;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var TabStack = (function (_super) {
        __extends(TabStack, _super);
        function TabStack() {
            var _this = _super.call(this) || this;
            _this._selection = 0;
            _this._selsgrp = new nn.SelectionsGroup();
            _this._selsgrp.signals.connect(nn.SignalSelectionChanged, _this.__cbSelsChanged, _this);
            return _this;
        }
        Object.defineProperty(TabStack.prototype, "tabButtons", {
            get: function () {
                return this._selsgrp.elements();
            },
            set: function (arr) {
                nn.fatal("不能直接设置tabButtons");
            },
            enumerable: true,
            configurable: true
        });
        TabStack.prototype.clear = function () {
            this._selsgrp.elements().forEach(function (p) {
                p.removeFromParent();
            });
            this._selsgrp.clear();
            _super.prototype.clear.call(this);
        };
        Object.defineProperty(TabStack.prototype, "pages", {
            get: function () {
                return this._views;
            },
            set: function (arr) {
                this.clear();
                this.setViews(arr);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TabStack.prototype, "selection", {
            get: function () {
                return this._selection;
            },
            set: function (idx) {
                if (this._selection == idx)
                    return;
                this._selection = idx;
                if (this._selsgrp.length)
                    this._selsgrp.selection = idx;
            },
            enumerable: true,
            configurable: true
        });
        TabStack.prototype._getPageTabButton = function (page, idx) {
            if (page.isnull() == false) {
                var btn_1 = page.obj.tabButton;
                // 如果btn已经加入到statesgroup中，则判定为复用page
                // 复用page则需要生成一个新的tabbutton
                if (btn_1 && this._selsgrp.indexOf(btn_1) != -1)
                    btn_1 = null;
                if (btn_1 == null) {
                    var fun_1 = nn.ObjectClass(page.obj).TabButton;
                    if (fun_1 == null)
                        fun_1 = nn.ObjectClass(this).TabButton;
                    if (fun_1 == null)
                        nn.fatal('没有提供 TabStack 用来实例化 TabButton 的方法');
                    btn_1 = fun_1(page, idx);
                    page.obj.tabButton = btn_1;
                    return btn_1;
                }
                return btn_1;
            }
            var fun = page.clazz.TabButton;
            if (fun == null)
                fun = nn.ObjectClass(this).TabButton;
            if (fun == null)
                nn.fatal('没有提供 TabStack 用来实例化 TabButton 的方法');
            var btn = fun(page, idx);
            page.__tabbutton = btn;
            return btn;
        };
        TabStack.prototype.setViews = function (arr) {
            var _this = this;
            if (arr == this._views)
                return;
            this.clear();
            arr.forEach(function (page) {
                _this._views.push(page);
                var tabbtn = _this._getPageTabButton(page, _this._views.length - 1);
                if (tabbtn) {
                    _this._selsgrp.add(tabbtn);
                    if (tabbtn.parent == null)
                        _this.addChild(tabbtn);
                }
                if (page.isnull() == false) {
                    var p = page.obj;
                    p.visible = false;
                    // 取保绑定好了tabbutton
                    if (page.tabButton == null)
                        page.tabButton = tabbtn;
                    _this._addPage(page, false);
                }
            }, this);
            this._selsgrp.selection = this._selection;
        };
        TabStack.prototype._addPage = function (page, aschild) {
            _super.prototype._addPage.call(this, page, aschild);
            // 绑定一下提前初始化的tabButton
            var p = page.obj;
            if (p.tabButton == null)
                p.tabButton = page.__tabbutton;
        };
        TabStack.prototype.push = function (page, animated) {
            if (animated === void 0) { animated = true; }
            var r = _super.prototype.push.call(this, page, animated);
            if (r == null)
                return null;
            var tabbtn = this._getPageTabButton(page, this._views.length - 1);
            if (tabbtn) {
                this._selsgrp.add(tabbtn);
                if (tabbtn.parent == null)
                    this.addChild(tabbtn);
            }
            return r;
        };
        TabStack.prototype.__cbSelsChanged = function (e) {
            this._selection = this._selsgrp.selection;
            this.setTopView(this._views[this._selection]);
        };
        TabStack.prototype._emitSelectionChanged = function (now, old) {
            if (this._signals)
                this._signals.emit(nn.SignalSelectionChanged, { now: now, old: old,
                    nowTabButton: this._selsgrp.selectionItem,
                    oldTabButton: this._selsgrp.previousSelectionItem });
        };
        TabStack.prototype.setPageFrame = function (page) {
            var rc = this.boundsForLayout();
            page.frame = rc;
        };
        return TabStack;
    }(nn.ViewStack));
    nn.TabStack = TabStack;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var Tips = (function (_super) {
        __extends(Tips, _super);
        function Tips() {
            var _this = _super.call(this) || this;
            /** 尖头 */
            _this.identifier = new nn.Bitmap();
            _this.identifier.anchor = nn.Point.AnchorCC;
            _this.identifier.frame = new nn.Rect(0, 0, 50, 50);
            _this.addChild(_this.identifier);
            return _this;
        }
        Tips.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._target = undefined;
            this._base = undefined;
        };
        Tips.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalRequestClose);
        };
        Object.defineProperty(Tips.prototype, "target", {
            /** 指向的目标 */
            get: function () {
                return this._target;
            },
            enumerable: true,
            configurable: true
        });
        Tips.prototype.onAppeared = function () {
            _super.prototype.onAppeared.call(this);
            this._layoutTips();
        };
        /** 作为子控件来显示 */
        Tips.prototype.showTo = function (target, parent) {
            var _this = this;
            this._target = target;
            if (parent == null)
                parent = target.parent;
            this._base = parent;
            this.signals.connect(nn.SignalRequestClose, this.removeFromParent, this);
            parent.addChild(this, false);
            if (nn.isZero(this.delayClose) == false)
                nn.Delay(this.delayClose, function () {
                    _this._base = null;
                    _this.removeFromParent();
                }, this);
        };
        Tips.prototype.instanceDesktop = function () {
            var dsk = new nn.Desktop();
            dsk.adaptiveContentFrame = false;
            dsk.clickedToClose = true;
            dsk.onlyFiltersTouchEnabled = true;
            dsk.delayClose = this.delayClose;
            return dsk;
        };
        /** 作为弹出来显示 */
        Tips.prototype.popupTo = function (target, autoopen) {
            if (autoopen === void 0) { autoopen = true; }
            this._target = target;
            var dsk = this.instanceDesktop();
            dsk.contentView = this;
            dsk.addFilter(target);
            this.signals.connect(nn.SignalRequestClose, dsk.close, dsk);
            this._base = dsk;
            if (autoopen)
                dsk.open();
            return dsk;
        };
        Tips.prototype.close = function () {
            this.signals.emit(nn.SignalRequestClose);
        };
        Tips.prototype._layoutTips = function () {
            var rc = this._base.bounds();
            var bst = this.bestFrame();
            var trc = this._target.convertRectTo(this._target.bounds(), this._base);
            var idrc = this.identifier.frame;
            var d;
            if (trc.maxX + idrc.width + bst.width < rc.maxX) {
                d = nn.Direction.RIGHT;
                this.identifier.rotation = nn.Angle.ANGLE(-90);
                this.identifier.scale = new nn.Point(-1, 1);
                var pt = trc.rightCenter;
                bst.x = trc.maxX + idrc.width;
                bst.y = pt.y - bst.height / 2;
                if (bst.maxX > rc.maxX)
                    bst.maxX = rc.maxX;
                else if (bst.minX < rc.minX)
                    bst.minX = rc.minX;
                if (bst.maxY > rc.maxY)
                    bst.maxY = rc.maxY;
                else if (bst.minY < rc.minY)
                    bst.minY = rc.minY;
                idrc.x = -idrc.width;
                idrc.y = (bst.height - idrc.height) / 2;
                var tarc = new nn.Rect(trc.x - bst.x, trc.y - bst.y, trc.width, trc.height);
                if (idrc.maxY > tarc.maxY)
                    idrc.maxY = tarc.maxY;
                else if (idrc.minY < tarc.minY)
                    idrc.minY = tarc.minY;
            }
            else if (trc.y - idrc.height - bst.height > rc.y) {
                d = nn.Direction.UP;
                this.identifier.rotation = nn.Angle.ANGLE(180);
                var pt = trc.topCenter;
                bst.x = pt.x - bst.width / 2;
                bst.y = trc.y - idrc.height - bst.height;
                if (bst.maxX > rc.maxX)
                    bst.maxX = rc.maxX;
                else if (bst.minX < rc.minX)
                    bst.minX = rc.minX;
                if (bst.maxY > rc.maxY)
                    bst.maxY = rc.maxY;
                else if (bst.minY < rc.minY)
                    bst.minY = rc.minY;
                idrc.x = (bst.width - idrc.width) / 2;
                idrc.y = bst.height;
                var tarc = new nn.Rect(trc.x - bst.x, trc.y - bst.y, trc.width, trc.height);
                if (idrc.maxX > tarc.maxX)
                    idrc.maxX = tarc.maxX;
                else if (idrc.minX < tarc.minX)
                    idrc.minX = tarc.minX;
            }
            else if (trc.x - idrc.width - bst.width > rc.x) {
                d = nn.Direction.LEFT;
                this.identifier.rotation = nn.Angle.ANGLE(90);
                var pt = trc.leftCenter;
                bst.x = trc.x - idrc.width - bst.width;
                bst.y = pt.y - bst.height / 2;
                if (bst.maxX > rc.maxX)
                    bst.maxX = rc.maxX;
                else if (bst.minX < rc.minX)
                    bst.minX = rc.minX;
                if (bst.maxY > rc.maxY)
                    bst.maxY = rc.maxY;
                else if (bst.minY < rc.minY)
                    bst.minY = rc.minY;
                idrc.x = bst.width;
                idrc.y = (bst.height - idrc.height) / 2;
                var tarc = new nn.Rect(trc.x - bst.x, trc.y - bst.y, trc.width, trc.height);
                if (idrc.maxY > tarc.maxY)
                    idrc.maxY = tarc.maxY;
                else if (idrc.minY < tarc.minY)
                    idrc.minY = tarc.minY;
            }
            else {
                d = nn.Direction.DOWN;
                this.identifier.rotation = nn.Angle.ANGLE(0);
                var pt = trc.topCenter;
                bst.x = pt.x - bst.width / 2;
                bst.y = trc.y + idrc.height;
                if (bst.maxX > rc.maxX)
                    bst.maxX = rc.maxX;
                else if (bst.minX < rc.minX)
                    bst.minX = rc.minX;
                if (bst.maxY > rc.maxY)
                    bst.maxY = rc.maxY;
                else if (bst.minY < rc.minY)
                    bst.minY = rc.minY;
                idrc.x = (bst.width - idrc.width) / 2;
                idrc.y = -idrc.height;
                var tarc = new nn.Rect(trc.x - bst.x, trc.y - bst.y, trc.width, trc.height);
                if (idrc.maxX > tarc.maxX)
                    idrc.maxX = tarc.maxX;
                else if (idrc.minX < tarc.minX)
                    idrc.minX = tarc.minX;
            }
            this.frame = bst;
            this.identifier.frame = idrc;
        };
        return Tips;
    }(nn.Sprite));
    nn.Tips = Tips;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var _BonesRender = (function () {
        function _BonesRender() {
        }
        _BonesRender.prototype.onRender = function (cost) {
            dragonBones.WorldClock.clock.advanceTime(cost);
        };
        return _BonesRender;
    }());
    var _BonesManager = (function (_super) {
        __extends(_BonesManager, _super);
        function _BonesManager() {
            var _this = _super.call(this) || this;
            /** 使用Fast加速骨骼动画 */
            _this.turboMode = true;
            /** 默认骨骼的帧速 */
            _this.fps = 30;
            _this._factory = new dragonBones.EgretFactory();
            nn.FramesManager.RENDERS.add(new _BonesRender());
            return _this;
        }
        _BonesManager.prototype.instance = function (cfg, cb, ctx) {
            var _this = this;
            if (nn.length(cfg.resourceGroups)) {
                nn.ResManager.capsules(cfg.resourceGroups).load(function () {
                    _this.instanceOne(cfg.character, cfg.skeleton, cfg.place, cfg.texture, cfg.fps, cb, ctx);
                }, this);
            }
            else {
                this.instanceOne(cfg.character, cfg.skeleton, cfg.place, cfg.texture, cfg.fps, cb, ctx);
            }
        };
        _BonesManager.prototype.instanceOne = function (character, skeleton, place, texture, fps, cb, ctx) {
            var _this = this;
            nn.ResManager.getSources([
                [skeleton, nn.ResType.JSON],
                [place, nn.ResType.JSON],
                [texture, nn.ResType.TEXTURE]
            ], nn.ResPriority.CLIP, function (ds) {
                var sd = ds[0].use();
                if (sd == null) {
                    nn.warn("bone-skcfg " + skeleton + " not found");
                    cb.call(ctx, null);
                    return;
                }
                var td = ds[1].use();
                if (td == null) {
                    nn.warn("bone-tcfg " + place + " not found");
                    cb.call(ctx, null);
                    return;
                }
                var t = ds[2].use();
                if (t == null) {
                    nn.warn("bone-tex " + texture + " not found");
                    cb.call(ctx, null);
                    return;
                }
                var bd = dragonBones.DataParser.parseDragonBonesData(sd);
                if (bd == null) {
                    nn.warn("解析骨骼数据 " + character + " 失败");
                    cb.call(ctx, null);
                    return;
                }
                _this._factory.addSkeletonData(bd);
                var ta = new dragonBones.EgretTextureAtlas(t, td);
                if (ta == null) {
                    nn.warn("构造骨骼贴图 " + character + " 失败");
                    cb.call(ctx, null);
                    return;
                }
                _this._factory.addTextureAtlas(ta);
                if (_this.turboMode) {
                    var arm_1 = _this._factory.buildFastArmature(character);
                    if (arm_1 == null) {
                        nn.warn("创建加速骨骼 " + character + " 失败 [" + character + "]");
                    }
                    else {
                        var v = arm_1._armatureData.frameRate;
                        if (!v)
                            v = _this.fps;
                        arm_1.enableAnimationCache(v);
                    }
                    var bn_1 = new BoneData(arm_1);
                    cb.call(ctx, bn_1);
                    return;
                }
                var arm = _this._factory.buildArmature(character);
                if (arm == null)
                    nn.warn("创建普通骨骼 " + character + " 失败 [" + character + "]");
                var bn = new BoneData(arm);
                cb.call(ctx, bn);
            }, this);
        };
        return _BonesManager;
    }(nn.SObject));
    nn._BonesManager = _BonesManager;
    var _bonesManager;
    function BonesManager() {
        if (_bonesManager)
            return _bonesManager;
        _bonesManager = new _BonesManager();
        return _bonesManager;
    }
    nn.BonesManager = BonesManager;
    var BoneData = (function () {
        function BoneData(am) {
            this._armature = am;
        }
        Object.defineProperty(BoneData.prototype, "armature", {
            get: function () {
                return this._armature;
            },
            set: function (a) {
                nn.warn("不能直接设置 BoneData");
            },
            enumerable: true,
            configurable: true
        });
        BoneData.prototype.addLoop = function () {
            if (this._armature)
                dragonBones.WorldClock.clock.add(this._armature);
        };
        BoneData.prototype.rmLoop = function () {
            if (this._armature)
                dragonBones.WorldClock.clock.remove(this._armature);
        };
        // 计算指定帧数的进度
        BoneData.prototype.calcFrameProgress = function (mo, frame) {
            var ani = this._armature.animation;
            var data = nn.ArrayT.QueryObject(ani.animationDataList, function (o) {
                return o.name == mo;
            });
            if (data == null)
                return 0;
            nn.fatal("没有实现");
            var frametm = 0;
            //let frametm = 1000/data.frameRate;
            var frameslen = Math.ceil(data.duration / frametm);
            var pos = frame < 0 ? frameslen + frame : frame;
            return pos / frameslen;
        };
        /* 播放动画
           @motion 动作名
           @times 次数
           @stopAtProgress OPT 停止位置
        */
        BoneData.prototype.playMotion = function (motion, times, stopAtProgress) {
            var ani = this._armature.animation;
            var state = ani.gotoAndPlay(motion, 0, -1, times);
            state.__stopAtProgress = stopAtProgress;
        };
        BoneData.prototype.seekToMotion = function (motion, time) {
            var ani = this._armature.animation;
            ani.gotoAndStop(motion, time);
        };
        BoneData.prototype.hasMotion = function (val) {
            var ani = this._armature.animation;
            return ani.hasAnimation(val);
        };
        BoneData.prototype.bestFrame = function () {
            var r = new nn.Rect();
            if (this._armature) {
                var rc = this._armature.display.getBounds();
                // 去掉制作bone时的锚点偏移
                r.x = -rc.x;
                r.y = -rc.y;
                r.width = rc.width;
                r.height = rc.height;
            }
            return r.unapplyScaleFactor();
        };
        Object.defineProperty(BoneData.prototype, "display", {
            get: function () {
                return this._armature.display;
            },
            enumerable: true,
            configurable: true
        });
        return BoneData;
    }());
    nn.BoneData = BoneData;
    var Bones = (function (_super) {
        __extends(Bones, _super);
        function Bones() {
            var _this = _super.call(this) || this;
            _this._bs = null;
            _this._motions = new Array();
            return _this;
        }
        Bones.prototype.dispose = function () {
            if (this._data) {
                this._data.rmLoop();
                this._data = undefined;
            }
            _super.prototype.dispose.call(this);
        };
        Bones.prototype.getBoneData = function () {
            return this._data;
        };
        Bones.prototype.setBoneData = function (d) {
            var self = this;
            if (self._data == d) {
                if (self._signals)
                    self._signals.emit(nn.SignalUpdated);
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
                var am = d.armature;
                nn.EventHook(am, dragonBones.AnimationEvent.START, self.__db_start, self);
                nn.EventHook(am, dragonBones.AnimationEvent.LOOP_COMPLETE, self.__db_loopcomplete, self);
                nn.EventHook(am, dragonBones.AnimationEvent.COMPLETE, self.__db_complete, self);
                // 更新大小
                self.updateLayout();
                // 是否需要直接开始动画
                if (self._playingState == nn.WorkState.DOING ||
                    self.autoPlay) {
                    self._playingState = nn.WorkState.DONE;
                    self.play();
                }
            }
            // 抛出改变的事件
            if (self._signals) {
                self._signals.emit(nn.SignalUpdated);
                self._signals.emit(nn.SignalChanged);
            }
        };
        Object.defineProperty(Bones.prototype, "boneSource", {
            get: function () {
                return this._bs;
            },
            set: function (bs) {
                var _this = this;
                if (this._bs == bs)
                    return;
                this._bs = bs;
                if (bs instanceof nn.BoneConfig) {
                    var cfg = bs;
                    BonesManager().instance(cfg, function (bn) {
                        if (_this._bs != bs)
                            return;
                        _this.setBoneData(bn);
                    }, this);
                }
                else {
                    var tp = typeof bs;
                    if (tp == 'string') {
                        var cfg = new nn.BoneConfig(bs);
                        BonesManager().instance(cfg, function (bn) {
                            if (_this._bs != bs)
                                return;
                            _this.setBoneData(bn);
                        }, this);
                    }
                    else {
                        nn.warn('设置了错误的骨骼数据');
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Bones.prototype.bestFrame = function () {
            if (this._data)
                return this._data.bestFrame();
            return new nn.Rect();
        };
        Bones.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            var bd = this._data;
            if (bd == null)
                return;
            // 计算bone的实际显示位置
            var rc = this.boundsForLayout();
            var bst = bd.bestFrame();
            if (bst.width == 0 || bst.height == 0)
                return;
            var bst2 = bst.clone().fill(rc, this.fillMode);
            // 计算缩放的尺寸
            var sw = bst2.width / bst.width;
            var sh = bst2.height / bst.height;
            var scale = Math.min(sw, sh) * this.additionScale;
            // 定位位置
            bst.x *= scale;
            bst.y *= scale;
            bst2.alignTo(rc, this.clipAlign);
            bst.x += bst2.x;
            bst.y += bst2.y;
            var dsp = this._data.display;
            dsp.scaleX = dsp.scaleY = scale;
            this.impSetFrame(bst, dsp);
        };
        Object.defineProperty(Bones.prototype, "motion", {
            get: function () {
                return nn.ArrayT.Top(this._motions);
            },
            set: function (val) {
                if (val == this.motion)
                    return;
                nn.ArrayT.SetTop(this._motions, val);
                if (this._playingState == nn.WorkState.DOING || this.autoPlay) {
                    this._playingState = nn.WorkState.DONE;
                    this.play();
                }
            },
            enumerable: true,
            configurable: true
        });
        Bones.prototype.pushMotion = function (val) {
            this._motions.push(val);
            if (this._playingState == nn.WorkState.DOING || this.autoPlay) {
                this._playingState = nn.WorkState.DONE;
                this.play();
            }
        };
        Bones.prototype.popMotion = function () {
            this._motions.pop();
            if (this._playingState == nn.WorkState.DOING || this.autoPlay) {
                this._playingState = nn.WorkState.DONE;
                this.play();
            }
        };
        Bones.prototype.motions = function () {
            return this._data ? this._data.armature.animation.animationList : [];
        };
        Bones.prototype.hasMotion = function (val) {
            return this._data && this._data.hasMotion(val);
        };
        Bones.prototype.play = function () {
            var self = this;
            if (self._data == null ||
                self._motions.length == 0 ||
                self._playingState == nn.WorkState.DOING)
                return;
            var mo = self.motion;
            if (self.hasMotion(mo) == false) {
                nn.warn("bone-motion " + mo + " not found, avaliable motions:" + this.motions.toString());
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
            self._playingState = nn.WorkState.DOING;
            this._data.addLoop();
        };
        Bones.prototype.stop = function () {
            var self = this;
            if (self._data == null ||
                self._playingState != nn.WorkState.DOING)
                return;
            self._playingState = nn.WorkState.DONE;
            //let ani = self._data.animation();
            self._data.rmLoop();
        };
        Bones.prototype.__db_start = function () {
            if (this._signals) {
                this._signals.emit(nn.SignalStart);
            }
        };
        Bones.prototype.__db_complete = function () {
            this._data.rmLoop();
            this._playingState = nn.WorkState.DONE;
            if (this._signals) {
                this._signals.emit(nn.SignalEnd);
                this._signals.emit(nn.SignalDone);
            }
        };
        Bones.prototype.__db_loopcomplete = function () {
            if (this._signals) {
                this._signals.emit(nn.SignalEnd);
            }
        };
        return Bones;
    }(nn.CBones));
    nn.Bones = Bones;
    // hack-db
    var FastAnimationState = (function (_super) {
        __extends(FastAnimationState, _super);
        function FastAnimationState() {
            return _super.apply(this, arguments) || this;
        }
        Object.defineProperty(FastAnimationState.prototype, "progress", {
            get: function () {
                var self = this;
                var v = self._progress;
                var f = self.__stopAtProgress;
                if (f && v >= f)
                    return f;
                return self._progress;
            },
            enumerable: true,
            configurable: true
        });
        return FastAnimationState;
    }(dragonBones.AnimationState));
    dragonBones.AnimationState = FastAnimationState;
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 按键数据 */
    var CKeyboard = (function () {
        function CKeyboard() {
        }
        return CKeyboard;
    }());
    nn.CKeyboard = CKeyboard;
    var _Keyboard = (function (_super) {
        __extends(_Keyboard, _super);
        function _Keyboard() {
            var _this = _super.apply(this, arguments) || this;
            _this._visible = false;
            return _this;
        }
        _Keyboard.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalActivated);
            this._signals.register(nn.SignalDeactivated);
        };
        Object.defineProperty(_Keyboard.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (b) {
                if (this._visible == b)
                    return;
                this._visible = b;
                this.signals.emit(b ? nn.SignalActivated : nn.SignalDeactivated);
            },
            enumerable: true,
            configurable: true
        });
        return _Keyboard;
    }(nn.SObject));
    nn.Keyboard = new _Keyboard();
})(nn || (nn = {}));
var nn;
(function (nn) {
    var ExtMovieClip = (function (_super) {
        __extends(ExtMovieClip, _super);
        function ExtMovieClip() {
            var _this = _super.call(this) || this;
            // 标准的包围盒
            _this.originBoundingBox = new nn.Rect();
            return _this;
        }
        ExtMovieClip.prototype.bestFrame = function () {
            // 此时不需要进行缩放因子调整，每一个序列帧需要用实际大小来计算上层的缩放系数
            return this.originBoundingBox.clone();
        };
        ExtMovieClip.prototype.bindMovieClipData = function (d, f) {
            this.movieClipData = d;
            this.factory = f;
            if (d) {
                this.originBoundingBox = d.boundingBox;
                this.originFrameRate = d.__fileFrameRate;
                this.visible = true;
            }
            else {
                this.originBoundingBox = new nn.Rect();
                this.originFrameRate = 30;
                this.visible = false;
            }
        };
        return ExtMovieClip;
    }(egret.MovieClip));
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip() {
            var _this = _super.call(this) || this;
            _this._mc = new ExtMovieClip();
            _this._cs = null;
            _this._imp.addChild(_this._mc);
            return _this;
        }
        MovieClip.prototype._signalConnected = function (sig, s) {
            _super.prototype._signalConnected.call(this, sig, s);
            switch (sig) {
                case nn.SignalEnd:
                    {
                        nn.EventHook(this._mc, egret.Event.LOOP_COMPLETE, this.__cb_end, this);
                    }
                    break;
                case nn.SignalDone:
                    {
                        nn.EventHook(this._mc, egret.Event.COMPLETE, this.__cb_done, this);
                    }
                    break;
            }
        };
        MovieClip.prototype.dispose = function () {
            // 反向模式中如过已经调整过方向，则需要当析构时恢复方向，不然下一次打开就已经是反方向的
            if (this.reverseMode && !this.__needreverse) {
                this.__needreverse = true;
                this.tryReverseMovieClipData();
            }
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(MovieClip.prototype, "fps", {
            get: function () {
                return this._mc.frameRate;
            },
            set: function (fps) {
                this._fps = fps;
                this._mc.frameRate = fps;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "clipSource", {
            get: function () {
                return this._cs;
            },
            set: function (cs) {
                var self = this;
                if (nn.ObjectT.IsEqual(cs, self._cs)) {
                    if (self._signals)
                        self._signals.emit(nn.SignalUpdated);
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
                var pcs = self._cs;
                self._cs = cs;
                // 加载新的资源数据
                ClipsManager().instance(cs, function (mc, f) {
                    if (self.__disposed || false == nn.ObjectT.IsEqual(cs, self._cs))
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "clip", {
            get: function () {
                return this._clip;
            },
            set: function (c) {
                if (c == this._clip)
                    return;
                this._location = undefined;
                this._clip = c;
                if (this.autoPlay && !this.isPlaying())
                    this.play();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "location", {
            get: function () {
                return this._location;
            },
            set: function (l) {
                if (l == this._location)
                    return;
                this._clip = undefined;
                this._location = l;
                if (this.autoPlay && !this.isPlaying())
                    this.play();
            },
            enumerable: true,
            configurable: true
        });
        MovieClip.prototype.isPlaying = function () {
            return this._mc.isPlaying;
        };
        MovieClip.prototype.stop = function () {
            if (this.isPlaying())
                this._mc.stop();
        };
        MovieClip.prototype.play = function () {
            if (this.isPlaying())
                return;
            this._updateAnimation();
        };
        MovieClip.prototype.bestFrame = function () {
            var rc = this._mc.bestFrame();
            rc.x = rc.y = 0;
            return rc;
        };
        MovieClip.prototype._setMovieClipData = function (d, f) {
            if (d) {
                this._mc.bindMovieClipData(d, f);
                if (this._fps) {
                    this._mc.frameRate = this._fps;
                }
                else {
                    this._mc.frameRate = this._mc.originFrameRate;
                }
                // 需要重新布局以调整位置
                //this.setNeedsLayout();
                this.updateLayout(); // 飞天项目汇报如果用setNeedsLayout会引起重影
            }
            else {
                this._mc.bindMovieClipData(d, f);
            }
            // 刷新动画
            if (this._signals) {
                this._signals.emit(nn.SignalUpdated);
                this._signals.emit(nn.SignalChanged);
            }
            if (this.autoPlay && !this.isPlaying())
                this.play();
        };
        Object.defineProperty(MovieClip.prototype, "reverseMode", {
            get: function () {
                return this._reverseMode;
            },
            set: function (b) {
                if (this._reverseMode == b)
                    return;
                this._reverseMode = b;
                this.__needreverse = true;
            },
            enumerable: true,
            configurable: true
        });
        MovieClip.prototype.tryReverseMovieClipData = function () {
            if (!this.reverseMode && !this.__needreverse)
                return;
            var d = this._mc.movieClipData;
            d.frames.reverse(); // 反向序列帧
            this.__needreverse = undefined;
        };
        Object.defineProperty(MovieClip.prototype, "flashMode", {
            get: function () {
                return this._flashMode;
            },
            set: function (b) {
                this._flashMode = b;
                if (b && this.flashAnchorPoint == null) {
                    this.flashAnchorPoint = new nn.Point(0.5, 0.5);
                }
            },
            enumerable: true,
            configurable: true
        });
        MovieClip.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            var rc = this.bounds();
            var arc = this._mc.bestFrame();
            // 计算一下以中心点为基准的目标 mc 大小
            var frm = arc.clone()
                .fill(rc, this.fillMode)
                .scale(this.additionScale);
            // 计算填充的缩放比例
            var sw = frm.width / arc.width;
            var sh = frm.height / arc.height;
            var s = Math.min(sw, sh);
            this._mc.scaleX = this._mc.scaleY = s * nn.ScaleFactorS;
            // 计算缩放后应该放置的位置
            frm.alignTo(rc, this.clipAlign);
            frm.add(-arc.x * s, -arc.y * s);
            if (this.flashMode) {
                frm.add((arc.x + arc.width * this.flashAnchorPoint.x) * s, (arc.y + arc.height * this.flashAnchorPoint.y) * s);
            }
            this.impSetFrame(frm.integral(), this._mc);
        };
        MovieClip.prototype._updateAnimation = function () {
            // 跳过不存在的和正在播放的
            if (this._mc.movieClipData == null ||
                this._mc.isPlaying)
                return;
            // 跳过不设置动画定义的情况
            if (this._clip == null && this._location == null)
                return;
            // 不知道是不是bug，需要判断下mcd里面的帧数
            if (DEBUG && this._mc.movieClipData.frames.length == 0) {
                nn.warn("mc尝试启动一个空帧"); // 需要在factory::instance中把空帧转换为null处理
                return;
            }
            // 是否需要处理反向
            this.tryReverseMovieClipData();
            // 开始播放动画
            if (this._signals)
                this._signals.emit(nn.SignalStart);
            if (this._clip)
                this._mc.gotoAndPlay(this._clip, this.count);
            else if (this._location != null)
                this._mc.gotoAndPlay(this._location, this.count);
        };
        MovieClip.prototype.__cb_end = function (e) {
            if (this.__disposed)
                return;
            this._signals.emit(nn.SignalEnd);
        };
        MovieClip.prototype.__cb_done = function (e) {
            if (this.__disposed)
                return;
            this._signals.emit(nn.SignalDone);
        };
        return MovieClip;
    }(nn.CMovieClip));
    nn.MovieClip = MovieClip;
    var _ClipsManager = (function () {
        function _ClipsManager() {
            // 如果是同一种config，则只生成一份factorydata
            this._factorys = new KvObject();
        }
        // 根据配置实例化序列帧
        _ClipsManager.prototype.instance = function (cfg, cb, ctx) {
            var _this = this;
            if (nn.length(cfg.resourceGroups)) {
                nn.ResManager.capsules(cfg.resourceGroups).load(function () {
                    _this.instanceOne(cfg, cb, ctx);
                }, this);
            }
            else {
                this.instanceOne(cfg, cb, ctx);
            }
        };
        _ClipsManager.prototype.instanceOne = function (cfg, cb, ctx) {
            var _this = this;
            var name = cfg.name;
            var frame = cfg.frame;
            var tex = cfg.texture;
            var key = cfg.hashCode;
            var factory = this._factorys[key];
            if (factory) {
                var d = this.instanceFromFactory(factory, name, false);
                if (d.frames.length == 0) {
                    nn.warn('MovieClip为空帧，清检查资源文件和配置是否一致\n' + cfg);
                    d = null;
                }
                cb.call(ctx, d, factory);
            }
            else {
                nn.ResManager.getSources([
                    [frame, nn.ResType.JSON],
                    [tex, nn.ResType.TEXTURE]
                ], nn.ResPriority.CLIP, function (ds) {
                    var djson = ds[0].use();
                    var dtex = ds[1].use();
                    if (djson == null) {
                        nn.warn("mc-cfg " + frame + " not found");
                        cb.call(ctx, null, null);
                        return;
                    }
                    if (dtex == null) {
                        nn.warn("mc-tex " + tex + " not found");
                        cb.call(ctx, null, null);
                        return;
                    }
                    // 如果是全异步的情况，会同时实例化多个相同的factory，引用技术使用
                    var factory = _this._factorys[key];
                    if (!factory) {
                        // 创建factory之后再创建数据
                        factory = {
                            cfg: cfg,
                            factory: new egret.MovieClipDataFactory(djson, dtex)
                        };
                        _this._factorys[key] = factory;
                    }
                    // 创建数据
                    var d = _this.instanceFromFactory(factory, name, true);
                    if (d.frames.length == 0) {
                        nn.warn('MovieClip为空帧，请检查资源文件和配置是否一致\n' + cfg);
                        d = null;
                    }
                    cb.call(ctx, d, factory);
                }, this);
            }
        };
        _ClipsManager.prototype.instanceFromFactory = function (factory, name, newdata) {
            var r = factory.factory.generateMovieClipData(name);
            if (r == null) {
                nn.warn("生成序列帧 " + name + " 失败");
            }
            else {
                // 保存最原始的真帧速度
                if (newdata)
                    r.__fileFrameRate = r.frameRate;
                // 计算帧包围盒
                var rc_1 = new nn.Rect();
                // 计算帧的位置
                var pts_1 = new nn.PointCloud();
                nn.ArrayT.Foreach(r.frames, function (f) {
                    if (f.hasOwnProperty('frame'))
                        return true;
                    var tex = r.textureData[f.res];
                    if (tex == null)
                        return true;
                    pts_1.add(new nn.Point(f.x, f.y));
                    // 合并包围盒
                    rc_1.union(new nn.Rect(0, 0, tex.w, tex.h));
                    return true;
                }, this);
                rc_1.position = pts_1.boundingBox.position;
                // 绑定包围盒到mc数据，用来在控件里计算位置、大小
                r.boundingBox = rc_1;
            }
            return r;
        };
        return _ClipsManager;
    }());
    var _clipsManager;
    function ClipsManager() {
        if (_clipsManager)
            return _clipsManager;
        _clipsManager = new _ClipsManager();
        return _clipsManager;
    }
})(nn || (nn = {}));
var nn;
(function (nn) {
    var LoadingScreen = (function (_super) {
        __extends(LoadingScreen, _super);
        function LoadingScreen() {
            var _this = _super.call(this) || this;
            _this.labelProgress = new nn.Label();
            _this.labelVersion = new nn.Label();
            _this._progressValue = new nn.Percentage();
            _this.labelProgress.textColor = 0;
            _this.labelProgress.textAlign = "center";
            _this.addChild(_this.labelProgress);
            _this.labelVersion.textColor = 0;
            _this.labelVersion.textAlign = "center";
            _this.labelVersion.text = "版本:" + nn.APPVERSION;
            _this.addChild(_this.labelVersion);
            return _this;
        }
        LoadingScreen.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        LoadingScreen.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            // 进度条前期工作已经准备完成，可以开始进行资源的加载
            this._signals.register(nn.SignalStart);
            // 进度条整体资源已经加载完成，可以进行下一步（通常加载主界面）
            this._signals.register(nn.SignalDone);
        };
        LoadingScreen.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            new nn.VBox(this).setRect(this.bounds())
                .addFlex(1)
                .addPixel(30, this.labelProgress)
                .addFlex(1)
                .addPixel(30, this.labelVersion)
                .apply();
        };
        Object.defineProperty(LoadingScreen.prototype, "progressValue", {
            get: function () {
                return this._progressValue;
            },
            set: function (v) {
                this._progressValue = v;
                this.updateData();
            },
            enumerable: true,
            configurable: true
        });
        LoadingScreen.prototype.updateData = function () {
            _super.prototype.updateData.call(this);
            this.labelProgress.bringFront();
            this.labelVersion.bringFront();
            this.labelProgress.text = "正在加载" +
                this._progressValue.value + "/" +
                this._progressValue.max;
        };
        LoadingScreen.prototype.onLoaded = function () {
            _super.prototype.onLoaded.call(this);
            this.prepare();
        };
        /** 完成主界面的加载 override */
        LoadingScreen.prototype.complete = function () {
            this.close();
        };
        /** 关闭当前页面 */
        LoadingScreen.prototype.close = function () {
            this.signals.emit(nn.SignalDone);
        };
        /** 完成加载前的准备 override */
        LoadingScreen.prototype.prepare = function () {
            this.start();
        };
        LoadingScreen.prototype.start = function () {
            this.signals.emit(nn.SignalStart);
        };
        return LoadingScreen;
    }(nn.Sprite));
    nn.LoadingScreen = LoadingScreen;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var Gesture = (function (_super) {
        __extends(Gesture, _super);
        function Gesture() {
            return _super.call(this) || this;
        }
        Gesture.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.detach();
        };
        Gesture.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalStart);
            this._signals.register(nn.SignalChanged);
            this._signals.register(nn.SignalCancel);
            this._signals.register(nn.SignalEnd);
            this._signals.register(nn.SignalDone);
        };
        Gesture.prototype.attach = function (spr) {
            if (spr == null) {
                this.detach();
                return;
            }
            this._spr = spr;
            this._spr.gestures.push(this);
            this.doAttach();
        };
        Gesture.prototype.doAttach = function () { };
        Gesture.prototype.detach = function () {
            if (this._spr == null)
                return;
            this.doDetach();
            nn.ArrayT.RemoveObject(this._spr.gestures, this);
            this._spr = null;
        };
        Gesture.prototype.doDetach = function () { };
        return Gesture;
    }(nn.SObject));
    nn.Gesture = Gesture;
    var GestureTap = (function (_super) {
        __extends(GestureTap, _super);
        function GestureTap() {
            var _this = _super.call(this) || this;
            /** 统计次数 */
            _this.count = 0;
            _this._tms = 0;
            return _this;
        }
        GestureTap.prototype.doAttach = function () {
            this._spr.signals.connect(nn.SignalClicked, this.__cb_tap, this);
        };
        GestureTap.prototype.doDetach = function () {
            this._spr.signals.disconnectOfTarget(this);
        };
        GestureTap.prototype.__cb_tap = function () {
            var tms = nn.DateTime.Now();
            if (tms - this._tms > this.interval) {
                this.count = 0;
                this._tms = tms;
            }
            this.count++;
            this.signals.emit(nn.SignalDone);
        };
        return GestureTap;
    }(Gesture));
    nn.GestureTap = GestureTap;
    var GestureLongTap = (function (_super) {
        __extends(GestureLongTap, _super);
        function GestureLongTap(duration) {
            if (duration === void 0) { duration = 1.3; }
            var _this = _super.call(this) || this;
            _this.duration = duration;
            return _this;
        }
        GestureLongTap.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            nn.drop(this._tmr);
        };
        GestureLongTap.prototype.doAttach = function () {
            this._spr.signals.connect(nn.SignalTouchBegin, this.__cb_touchbegin, this);
            this._spr.signals.connect(nn.SignalTouchEnd, this.__cb_touchend, this);
            this._spr.signals.connect(nn.SignalTouchMove, this.__cb_touchmove, this);
        };
        GestureLongTap.prototype.doDetach = function () {
            this._spr.signals.disconnectOfTarget(this);
        };
        GestureLongTap.prototype.__cb_touchbegin = function () {
            // 启动计时器
            if (this._tmr != null) {
                nn.warn("长按的定时器应该当触摸开始时为 null");
            }
            this._tmr = new nn.SysTimer(this.duration, 1);
            this._tmr.signals.connect(nn.SignalDone, this.__cb_timer, this);
            this._tmr.start();
        };
        GestureLongTap.prototype.__cb_touchend = function (s) {
            var _this = this;
            if (this._tmr) {
                this._tmr = nn.drop(this._tmr);
                this.signals.emit(nn.SignalCancel);
            }
            else {
                // 如果 tmr 已经为 null，然而该函数仍然进了，则代表是系统原先的事件，需要终止，否则仍然会激活 SignalClicked
                this._spr.signals.block(nn.SignalClicked);
                nn.Defer(function () {
                    _this._spr.signals.unblock(nn.SignalClicked);
                }, this);
            }
        };
        GestureLongTap.prototype.__cb_touchmove = function () {
            if (this._tmr) {
                this._tmr = nn.drop(this._tmr);
                this.signals.emit(nn.SignalCancel);
            }
        };
        GestureLongTap.prototype.__cb_timer = function () {
            this._tmr = nn.drop(this._tmr);
            this.signals.emit(nn.SignalDone);
        };
        return GestureLongTap;
    }(Gesture));
    nn.GestureLongTap = GestureLongTap;
    var GestureRecognizer = (function (_super) {
        __extends(GestureRecognizer, _super);
        function GestureRecognizer() {
            var _this = _super.call(this) || this;
            /** 上次位置、当前位置 */
            _this.lastPosition = new nn.Point();
            _this.currentPosition = new nn.Point();
            /** 增量 */
            _this.deltaPosition = new nn.Point();
            /** 变动次数 */
            _this.stat = 0;
            /** 加速度 */
            _this.velocity = new nn.Point();
            /** 最小间隔时间 */
            _this.thresholdInterval = 0.3;
            return _this;
        }
        GestureRecognizer.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalDone);
        };
        /** 重置 */
        GestureRecognizer.prototype.reset = function () {
            this.stat = 0;
            this.velocity.reset(0, 0);
        };
        /** 移动一次位置 */
        GestureRecognizer.prototype.addPosition = function (x, y) {
            // 第一次移动，直接设置
            if (this.stat == 0) {
                this.lastPosition.reset(x, y);
                this.currentPosition.reset(x, y);
                this.lastTime = this.currentTime = nn.DateTime.Now();
                ++this.stat;
                return;
            }
            // 其他时候的移动，更新手势
            this.lastTime = this.currentTime;
            this.currentTime = nn.DateTime.Now();
            this.deltaTime = this.currentTime - this.lastTime;
            this.lastPosition.copy(this.currentPosition);
            this.currentPosition.reset(x, y);
            this.deltaPosition.reset(this.currentPosition.x - this.lastPosition.x, this.currentPosition.y - this.lastPosition.y);
            this.velocity.reset(0, 0);
            if (this.deltaTime) {
                this.velocity.reset(this.deltaPosition.x / this.deltaTime, this.deltaPosition.y / this.deltaTime);
            }
            if (this.deltaTime <= this.thresholdInterval)
                this.doPosition();
            ++this.stat;
        };
        GestureRecognizer.prototype.doPosition = function () { };
        /** 主方向 */
        GestureRecognizer.prototype.majorDirection = function (threshold) {
            if (threshold === void 0) { threshold = new nn.Point(30, 30); }
            var r = nn.Direction.UNKNOWN;
            var d = this.deltaPosition;
            if (d.x > threshold.x)
                r |= nn.Direction.RIGHT;
            else if (d.x < -threshold.x)
                r |= nn.Direction.LEFT;
            if (d.y > threshold.y)
                r |= nn.Direction.DOWN;
            else if (d.y < -threshold.y)
                r |= nn.Direction.UP;
            return r;
        };
        return GestureRecognizer;
    }(nn.SObject));
    nn.GestureRecognizer = GestureRecognizer;
    var GestureSwipe = (function (_super) {
        __extends(GestureSwipe, _super);
        function GestureSwipe() {
            var _this = _super.call(this) || this;
            _this._recognizer = new GestureRecognizer();
            return _this;
        }
        GestureSwipe.prototype.doAttach = function () {
            this._spr.signals.connect(nn.SignalTouchBegin, this.__cb_touchbegin, this);
            this._spr.signals.connect(nn.SignalTouchEnd, this.__cb_touchend, this);
        };
        GestureSwipe.prototype.doDetach = function () {
            this._spr.signals.disconnectOfTarget(this);
        };
        GestureSwipe.prototype.__cb_touchbegin = function (s) {
            this._recognizer.reset();
            var th = s.data;
            this._recognizer.addPosition(th.currentPosition.x, th.currentPosition.y);
        };
        GestureSwipe.prototype.__cb_touchend = function (s) {
            var th = s.data;
            this._recognizer.addPosition(th.currentPosition.x, th.currentPosition.y);
            if (this._recognizer.deltaTime <= 0.3) {
                this.direction = this._recognizer.majorDirection();
                this.signals.emit(nn.SignalDone, this.direction);
            }
        };
        return GestureSwipe;
    }(Gesture));
    nn.GestureSwipe = GestureSwipe;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var _ParticlesManager = (function () {
        function _ParticlesManager() {
        }
        _ParticlesManager.prototype.instanceParticle = function (name) {
            var tex = RES.getRes(name + "_png");
            if (tex == null) {
                nn.warn("particle " + name + "_png not found");
                return null;
            }
            var cfg = RES.getRes(name + "_json");
            if (cfg == null) {
                nn.warn("particle " + name + "_json not found");
                return null;
            }
            var r = new particle.GravityParticleSystem(tex, cfg);
            if (r == null) {
                nn.warn("particle " + name + " instance failed");
            }
            return r;
        };
        return _ParticlesManager;
    }());
    nn._ParticlesManager = _ParticlesManager;
    nn.ParticlesManager = new _ParticlesManager();
    var Particle = (function (_super) {
        __extends(Particle, _super);
        function Particle() {
            return _super.call(this) || this;
        }
        Particle.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.stop();
        };
        Object.defineProperty(Particle.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (val) {
                if (this._name == val)
                    return;
                this._name = val;
                this.system = nn.ParticlesManager.instanceParticle(this._name);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Particle.prototype, "system", {
            get: function () {
                return this._system;
            },
            set: function (val) {
                if (this._system == val)
                    return;
                if (this._system) {
                    this.stop();
                    this._imp.removeChild(this._system);
                }
                this._system = val;
                if (this._system) {
                    this._imp.addChild(this._system);
                    this.start();
                }
                this.updateLayout();
            },
            enumerable: true,
            configurable: true
        });
        Particle.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            if (this._system) {
                var rc = this.bounds();
                rc.x = rc.width * 0.5 - this._system.emitterX;
                rc.y = rc.height * 0.5 - this._system.emitterY;
                this.impSetFrame(rc, this._system);
            }
        };
        Particle.prototype.start = function () {
            this._system && this._system.start();
        };
        Particle.prototype.stop = function () {
            this._system && this._system.stop();
        };
        return Particle;
    }(nn.CParticle));
    nn.Particle = Particle;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var GridCellsItem = (function (_super) {
        __extends(GridCellsItem, _super);
        function GridCellsItem(cols, cls) {
            var _this = _super.call(this) || this;
            _this.spacing = 0;
            _this.cells = new Array();
            for (var i = 0; i < cols; ++i) {
                var cell = new cls();
                _this.addChild(cell);
                _this.cells.push(cell);
            }
            return _this;
        }
        GridCellsItem.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            var box = new nn.HBox(this);
            box.spacing = this.spacing;
            this.cells.forEach(function (c) {
                box.addFlex(1, c);
            });
            box.apply();
        };
        GridCellsItem.prototype.itemAtIndex = function (idx) {
            return this.cells[idx].item;
        };
        GridCellsItem.prototype.setItemAtIndex = function (item, idx) {
            this.cells[idx].item = item;
        };
        GridCellsItem.prototype.updateData = function () {
            _super.prototype.updateData.call(this);
            this.cells.forEach(function (c) {
                c.updateData();
            });
        };
        GridCellsItem.prototype.reuseAll = function (pool) {
            this.cells.forEach(function (c) {
                var item = c.item;
                if (item == null)
                    return;
                // 重用为了避免释放
                nn.grab(item);
                c.item = null;
                pool.unuse(nn.Classname(item), item);
            });
        };
        return GridCellsItem;
    }(nn.Sprite));
    nn.GridCellsItem = GridCellsItem;
    var GridViewCell = (function (_super) {
        __extends(GridViewCell, _super);
        function GridViewCell() {
            return _super.apply(this, arguments) || this;
        }
        Object.defineProperty(GridViewCell.prototype, "item", {
            get: function () {
                return this._item;
            },
            set: function (item) {
                if (this._item == item)
                    return;
                if (this._item)
                    this.removeChild(this._item);
                this._item = item;
                if (item)
                    this.addChild(item);
            },
            enumerable: true,
            configurable: true
        });
        GridViewCell.prototype.updateData = function () {
            _super.prototype.updateData.call(this);
            if (this._item)
                this._item.updateData();
        };
        GridViewCell.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            if (this._item)
                this._item.frame = this.boundsForLayout();
        };
        return GridViewCell;
    }(nn.Sprite));
    nn.GridViewCell = GridViewCell;
    var GridViewContent = (function (_super) {
        __extends(GridViewContent, _super);
        function GridViewContent() {
            var _this = _super.call(this) || this;
            /** 用来实现gridcell的类型 */
            _this.gridCellClass = GridViewCell;
            // 重用griditems
            _this._reuseGridItems = new nn.SimpleReusesPool(_this.instanceGridItem, _this);
            _this.rowClass = GridCellsItem;
            return _this;
        }
        Object.defineProperty(GridViewContent.prototype, "gridDataSource", {
            get: function () {
                return this.dataSource;
            },
            set: function (ds) {
                this.dataSource = ds;
            },
            enumerable: true,
            configurable: true
        });
        // 实例化rowitem
        GridViewContent.prototype.instanceItem = function (type) {
            var r = new type(this.numberOfColumns, this.gridCellClass);
            r.spacing = this.spacing;
            return r;
        };
        // 实例化griditem
        GridViewContent.prototype.instanceGridItem = function (cls) {
            return new cls();
        };
        // 设置item
        GridViewContent.prototype.updateRow = function (item, cell, row) {
            var colscnt = this.numberOfColumns;
            var cnt = this.gridDataSource.numberOfItems();
            // 逐个
            for (var col = 0; col < colscnt; ++col) {
                var idx = row * colscnt + col;
                if (idx >= cnt) {
                    // 越界
                    item.setItemAtIndex(null, col);
                }
                else {
                    var cls = this.gridDataSource.classForItem(row, col, idx);
                    var idr = nn.Classname(cls);
                    var ci = this._reuseGridItems.use(idr, null, [cls]);
                    item.setItemAtIndex(ci, col);
                    // 刷新格子
                    this.gridDataSource.updateItem(ci, row, col, idx);
                }
            }
            _super.prototype.updateRow.call(this, item, cell, row);
        };
        // 如果cellsitem被重用，则需要把内部的items也重用
        GridViewContent.prototype.addOneReuseItem = function (item) {
            item.reuseAll(this._reuseGridItems);
            _super.prototype.addOneReuseItem.call(this, item);
        };
        return GridViewContent;
    }(nn.TableViewContent));
    nn.GridViewContent = GridViewContent;
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            return _super.call(this) || this;
        }
        GridView.prototype.instanceTable = function () {
            return new GridViewContent();
        };
        Object.defineProperty(GridView.prototype, "grid", {
            get: function () {
                return this._table;
            },
            enumerable: true,
            configurable: true
        });
        GridView.prototype.numberOfItems = function () {
            return 0;
        };
        /** 元素的类型 */
        GridView.prototype.classForItem = function (row, col, idx) {
            return this._table.itemClass;
        };
        /** 更新元素 */
        GridView.prototype.updateItem = function (item, row, col, idx) {
        };
        GridView.prototype.numberOfRows = function () {
            var cnt = this.numberOfItems();
            var cols = this._table.numberOfColumns;
            return Math.ceil(cnt / cols);
        };
        return GridView;
    }(nn.TableView));
    nn.GridView = GridView;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var SelectionsGroup = (function (_super) {
        __extends(SelectionsGroup, _super);
        function SelectionsGroup() {
            var _this = _super.call(this) || this;
            _this._store = new Array();
            return _this;
        }
        SelectionsGroup.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalSelectionChanged);
        };
        SelectionsGroup.prototype.dispose = function () {
            this.clear();
            _super.prototype.dispose.call(this);
        };
        SelectionsGroup.prototype.add = function (ui) {
            if (ui.states == undefined) {
                nn.fatal("push a non state object");
                return;
            }
            ui.states.signals.connect(nn.SignalStateChanged, this._cbStateChanged, this);
            this._store.push(ui);
        };
        SelectionsGroup.prototype.clear = function () {
            var _this = this;
            this._old = undefined;
            nn.ArrayT.Clear(this._store, function (e) {
                e.signals.disconnectOfTarget(_this);
            }, this);
        };
        SelectionsGroup.prototype.elements = function () {
            return this._store;
        };
        SelectionsGroup.prototype._cbStateChanged = function (e) {
            var ui = e.sender.cbctx;
            // 如过是自身在变化，则跳过
            if (ui == this._old)
                return;
            this._store.forEach(function (o) {
                if (o == ui)
                    return;
                o.states.next(e.data, true, false);
            }, this);
            this.signals.emit(nn.SignalSelectionChanged, { now: ui, old: this._old });
            this._old = ui;
        };
        Object.defineProperty(SelectionsGroup.prototype, "selection", {
            get: function () {
                return nn.ArrayT.QueryIndex(this._store, function (o) {
                    return o.isSelection && o.isSelection();
                }, this, -1);
            },
            set: function (idx) {
                var o = this._store[idx];
                if (o.setSelection)
                    o.setSelection(true);
                else
                    nn.warn("该对象不支持 setSelection 操作");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionsGroup.prototype, "selectionItem", {
            get: function () {
                return nn.ArrayT.QueryObject(this._store, function (o) {
                    return o.isSelection && o.isSelection();
                }, this);
            },
            set: function (o) {
                if (o.setSelection)
                    o.setSelection(true);
                else
                    nn.warn("该对象不支持 setSelection 操作");
            },
            enumerable: true,
            configurable: true
        });
        SelectionsGroup.prototype.indexOf = function (o) {
            return this._store.indexOf(o);
        };
        Object.defineProperty(SelectionsGroup.prototype, "previousSelectionItem", {
            get: function () {
                return this._old;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionsGroup.prototype, "length", {
            get: function () {
                return this._store.length;
            },
            enumerable: true,
            configurable: true
        });
        return SelectionsGroup;
    }(nn.SObject));
    nn.SelectionsGroup = SelectionsGroup;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var SoundPlayer = (function (_super) {
        __extends(SoundPlayer, _super);
        function SoundPlayer() {
            var _this = _super.call(this) || this;
            _this._enable = nn.Device.shared.supportAutoSound;
            _this._position = 0;
            return _this;
        }
        SoundPlayer.prototype.dispose = function () {
            this.stop();
            this._hdl = null;
            this._cnl = null;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(SoundPlayer.prototype, "enable", {
            get: function () {
                return this._enable;
            },
            set: function (b) {
                if (b == this._enable)
                    return;
                if (!b) {
                    this._prePlayingState = this.playingState;
                    // 设置成不可用会自动停掉当前播放
                    this.stop();
                }
                this._enable = b;
                if (b && this.autoRecovery && this._prePlayingState == nn.WorkState.DOING) {
                    this.play();
                }
            },
            enumerable: true,
            configurable: true
        });
        SoundPlayer.prototype.setMediaSource = function (ms) {
            if (this._mediaSource) {
                nn.warn('不能重复设置player的mediaSource');
                return;
            }
            this._mediaSource = ms;
        };
        Object.defineProperty(SoundPlayer.prototype, "position", {
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });
        // 只能设置一次
        SoundPlayer.prototype.setHdl = function (val) {
            if (this._hdl) {
                if (this._hdl.hashCode == val.hashCode)
                    return;
                nn.warn('不能覆盖已经设置了的声音对象');
                return;
            }
            this._hdl = val;
        };
        SoundPlayer.prototype.setCnl = function (cnl) {
            if (this._cnl == cnl)
                return;
            if (this._cnl)
                nn.EventUnhook(this._cnl, egret.Event.SOUND_COMPLETE, this.__cb_end, this);
            this._cnl = cnl;
            if (cnl)
                nn.EventHook(cnl, egret.Event.SOUND_COMPLETE, this.__cb_end, this);
        };
        SoundPlayer.prototype.play = function () {
            var _this = this;
            if (!this._enable) {
                this._prePlayingState = nn.WorkState.DOING;
                return;
            }
            if (this.playingState == nn.WorkState.DOING)
                return;
            if (this.playingState == nn.WorkState.PAUSED) {
                this.resume();
                return;
            }
            // cbplay放倒play之前是为了确保其他依赖于本对象play信号的动作能先执行，以避免h5浏览器当只能播放一个音频时冲突
            this.__cb_play();
            // 如果播放的媒体有变化，则需要重新加载，否则直接播放
            if (this._hdl == null) {
                if (this.resourceGroups) {
                    nn.ResManager.capsules(this.resourceGroups).load(function () {
                        nn.ResManager.getSound(_this._mediaSource, nn.ResPriority.NORMAL, function (snd) {
                            if (snd.isnull)
                                return;
                            _this.setHdl(snd.use());
                            // 如果当前还是位于播放中，则真正去播放
                            if (_this.playingState == nn.WorkState.DOING)
                                _this.setCnl(_this._hdl.play(_this._position, _this.count));
                        }, _this);
                    }, this);
                }
                else {
                    nn.ResManager.getSound(this._mediaSource, nn.ResPriority.NORMAL, function (snd) {
                        if (snd.isnull)
                            return;
                        _this.setHdl(snd.use());
                        if (_this.playingState == nn.WorkState.DOING)
                            _this.setCnl(_this._hdl.play(_this._position, _this.count));
                    }, this);
                }
            }
            else {
                this.setCnl(this._hdl.play(this._position, this.count));
            }
        };
        SoundPlayer.prototype.replay = function () {
            this.stop();
            this.play();
        };
        SoundPlayer.prototype.pause = function () {
            if (!this._enable) {
                this._prePlayingState = nn.WorkState.PAUSED;
                return;
            }
            if (this.playingState == nn.WorkState.DOING) {
                if (this._cnl) {
                    this._position = this._cnl.position;
                    this._cnl.stop();
                }
                this.playingState = nn.WorkState.PAUSED;
                this.__cb_pause();
            }
        };
        SoundPlayer.prototype.resume = function () {
            if (!this._enable) {
                this._prePlayingState = nn.WorkState.DOING;
                return;
            }
            if (this.playingState == nn.WorkState.PAUSED) {
                this.__cb_play();
                if (this._hdl) {
                    this.setCnl(this._hdl.play(this._position, this.count));
                }
            }
        };
        SoundPlayer.prototype.stop = function () {
            if (!this._enable) {
                this._prePlayingState = nn.WorkState.DONE;
                return;
            }
            if (this.playingState != nn.WorkState.DONE) {
                if (this._cnl) {
                    this._cnl.stop();
                    this._cnl = undefined;
                    this._position = 0;
                }
                this.playingState = nn.WorkState.DONE;
            }
        };
        SoundPlayer.prototype.breakee = function () {
            this.pause();
        };
        SoundPlayer.prototype.__cb_end = function () {
            nn.log("播放 " + this._mediaSource + " 结束");
            this.playingState = nn.WorkState.DONE;
            this._signals && this._signals.emit(nn.SignalDone);
        };
        SoundPlayer.prototype.__cb_pause = function () {
            this._signals && this._signals.emit(nn.SignalPaused);
        };
        SoundPlayer.prototype.__cb_play = function () {
            this.playingState = nn.WorkState.DOING;
            this._signals && this._signals.emit(nn.SignalStart);
        };
        return SoundPlayer;
    }(nn.CSoundPlayer));
    nn.SoundPlayer = SoundPlayer;
    var EffectSoundPlayer = (function (_super) {
        __extends(EffectSoundPlayer, _super);
        function EffectSoundPlayer() {
            return _super.apply(this, arguments) || this;
        }
        EffectSoundPlayer.prototype.setHdl = function (val) {
            if (val)
                val.type = egret.Sound.EFFECT;
            _super.prototype.setHdl.call(this, val);
        };
        EffectSoundPlayer.prototype.breakee = function () {
            this.stop();
        };
        return EffectSoundPlayer;
    }(SoundPlayer));
    var BackgroundSourdPlayer = (function (_super) {
        __extends(BackgroundSourdPlayer, _super);
        function BackgroundSourdPlayer() {
            return _super.apply(this, arguments) || this;
        }
        BackgroundSourdPlayer.prototype.setHdl = function (val) {
            if (val)
                val.type = egret.Sound.MUSIC;
            _super.prototype.setHdl.call(this, val);
        };
        BackgroundSourdPlayer.prototype.breakee = function () {
            this.stop();
        };
        return BackgroundSourdPlayer;
    }(SoundPlayer));
    var _SoundManager = (function (_super) {
        __extends(_SoundManager, _super);
        function _SoundManager() {
            var _this = _super.apply(this, arguments) || this;
            _this._enable = nn.Device.shared.supportAutoSound;
            return _this;
        }
        Object.defineProperty(_SoundManager.prototype, "background", {
            get: function () {
                var tk = this._tracks["background"];
                if (tk == null) {
                    tk = new nn.SoundTrack();
                    tk.classForPlayer = BackgroundSourdPlayer;
                    tk.count = -1;
                    tk.solo = true;
                    tk.autoRecovery = true;
                    tk.resourceGroups = this.resourceGroups;
                    this._tracks["background"] = tk;
                }
                return tk;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_SoundManager.prototype, "effect", {
            get: function () {
                var tk = this._tracks["effect"];
                if (tk == null) {
                    tk = new nn.SoundTrack();
                    tk.classForPlayer = EffectSoundPlayer;
                    tk.count = 1;
                    tk.resourceGroups = this.resourceGroups;
                    this._tracks["effect"] = tk;
                }
                return tk;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_SoundManager.prototype, "enable", {
            get: function () {
                return this._enable;
            },
            set: function (b) {
                if (b == this._enable)
                    return;
                nn.MapT.Foreach(this._tracks, function (k, v) {
                    v.enable = b;
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        return _SoundManager;
    }(nn.CSoundManager));
    nn._SoundManager = _SoundManager;
    nn.SoundManager = new _SoundManager();
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 承载不同状态对应的外观 */
    var State = (function () {
        function State(props) {
            this.props = props;
        }
        State.prototype.change = function (o) {
            var _this = this;
            if (this.props == null)
                this.props = {};
            nn.MapT.Foreach(o, function (k, v) {
                _this.props[k] = v;
            }, this);
        };
        State.Text = function (text, color, size) {
            return new State({ 'text': text,
                'textColor': color,
                'fontSize': size
            });
        };
        State.Color = function (textcolor, backcolor) {
            return new State({ 'textColor': textcolor,
                'backgroundColor': backcolor
            });
        };
        State.Image = function (image) {
            return new State({ 'imageSource': image });
        };
        State.BackgroundImage = function (image) {
            return new State({ 'backgroundImage': image });
        };
        State.Button = function (text, image, back) {
            return new State({ 'text': text,
                'imageSource': image,
                'backgroundImage': back });
        };
        State.As = function (obj) {
            if (obj instanceof State)
                return obj;
            var t = typeof (obj);
            if (t == 'string')
                return State.Text(obj);
            return new State();
        };
        State.prototype.setIn = function (ui) {
            if (this.props) {
                nn.MapT.Foreach(this.props, function (k, v) {
                    if (v !== undefined)
                        ui[k] = v;
                }, this);
            }
            if (this._children) {
                nn.MapT.Foreach(this._children, function (k, v) {
                    v.setIn(ui);
                }, this);
            }
        };
        Object.defineProperty(State.prototype, "children", {
            get: function () {
                if (this._children == null)
                    this._children = new KvObject();
                return this._children;
            },
            enumerable: true,
            configurable: true
        });
        State.prototype.add = function (idr, child) {
            this.children[idr] = child;
            return this;
        };
        State.prototype.remove = function (idr) {
            delete this.children[idr];
            return this;
        };
        return State;
    }());
    nn.State = State;
    var States = (function (_super) {
        __extends(States, _super);
        function States() {
            var _this = _super.call(this) || this;
            _this._states = new KvObject();
            return _this;
        }
        States.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalStateChanged);
        };
        States.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.nullstate = undefined;
            this.nullobj = undefined;
            this._state = undefined;
            nn.MapT.Clear(this._states);
        };
        Object.defineProperty(States.prototype, "state", {
            get: function () {
                return this._state;
            },
            set: function (val) {
                this.changeState(val);
            },
            enumerable: true,
            configurable: true
        });
        /** 修改一个状态 */
        States.prototype.changeState = function (val, sig) {
            if (sig === void 0) { sig = true; }
            if (this.cbset == null) {
                if (this._state == val)
                    return false;
                this._state = val;
                return true;
            }
            if (val == null)
                val = this.nullstate;
            if (val == this._state)
                return false;
            var obj = this._states[val];
            if (obj == null) {
                if (this.nullobj === undefined) {
                    nn.warn("state " + val + " not binded");
                    return false;
                }
                obj = this.nullobj;
            }
            this._state = val;
            this.cbset.call(this.cbctx, obj);
            sig && this.signals.emit(nn.SignalStateChanged, val);
            return true;
        };
        /** 选中基于传入状态的下一个状态 */
        States.prototype.next = function (state, selection, sig) {
            var delegate = this.cbctx;
            if (sig === undefined)
                sig = true;
            if (state === undefined)
                state = this._state;
            if (selection === undefined && delegate.isSelection)
                selection = delegate.isSelection();
            if (delegate.nextState) {
                state = delegate.nextState(state);
                this.changeState(state, sig);
            }
            else if (delegate.setSelection) {
                if (!sig)
                    this.signals.block(nn.SignalStateChanged);
                delegate.setSelection(!selection);
                if (!sig)
                    this.signals.unblock(nn.SignalStateChanged);
            }
        };
        States.prototype.updateData = function (skipnull) {
            if (skipnull === void 0) { skipnull = true; }
            var obj = this._states[this._state];
            if (obj == null) {
                if (skipnull && this.nullobj === undefined)
                    return;
                obj = this.nullobj;
            }
            this.cbset.call(this.cbctx, obj);
        };
        /** 绑定状态 */
        States.prototype.bind = function (state, val, isnullstate) {
            var obj = val instanceof State ? val : new State(val);
            this._states[state] = obj;
            if (isnullstate)
                this.nullstate = state;
            return this;
        };
        /** 查询状态 */
        States.prototype.get = function (state) {
            return this._states[state];
        };
        return States;
    }(nn.SObject));
    nn.States = States;
})(nn || (nn = {}));
/// <reference path="./core-label.ts" />
var nn;
(function (nn) {
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            var _this = _super.call(this) || this;
            _this.placeholderTextColor = 0x7d7d7d;
            _this.touchEnabled = true;
            _this._lbl.type = egret.TextFieldType.INPUT;
            nn.EventHook(_this._lbl, egret.FocusEvent.FOCUS_IN, _this.__inp_focus, _this);
            nn.EventHook(_this._lbl, egret.FocusEvent.FOCUS_OUT, _this.__inp_blur, _this);
            return _this;
        }
        TextField.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        TextField.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalFocusGot);
            this._signals.register(nn.SignalFocusLost);
        };
        TextField.prototype._signalConnected = function (sig, s) {
            _super.prototype._signalConnected.call(this, sig, s);
            if (sig == nn.SignalChanged)
                nn.EventHook(this._lbl, egret.Event.CHANGE, this.__lbl_changed, this);
        };
        // 文本框的实现比其它空间特殊，因为会输入或者直接点击，所以需要返回的是实现的实体
        TextField.prototype.hitTestClient = function (x, y) {
            return _super.prototype.hitTestClient.call(this, x, y) ? this._lbl : null;
        };
        Object.defineProperty(TextField.prototype, "readonly", {
            get: function () {
                return !this._lbl.touchEnabled;
            },
            set: function (v) {
                this._lbl.touchEnabled = !v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "securityInput", {
            get: function () {
                return this._lbl.displayAsPassword;
            },
            set: function (v) {
                this._lbl.displayAsPassword = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "labelPlaceholder", {
            get: function () {
                return this._labelPlaceholder;
            },
            set: function (lbl) {
                if (lbl == this._labelPlaceholder)
                    return;
                if (this._labelPlaceholder)
                    this.removeChild(this._labelPlaceholder);
                this._labelPlaceholder = lbl;
                if (lbl)
                    this.addChild(lbl);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "placeholder", {
            get: function () {
                return this._labelPlaceholder ? this._labelPlaceholder.text : '';
            },
            set: function (s) {
                if (this._labelPlaceholder == null) {
                    var lbl = new nn.Label();
                    lbl.textAlign = this.textAlign;
                    lbl.fontSize = this.fontSize;
                    lbl.textColor = this.placeholderTextColor;
                    lbl.visible = this.text.length == 0;
                    lbl.multilines = this.multilines;
                    this.labelPlaceholder = lbl;
                }
                this._labelPlaceholder.text = s;
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype._setFontSize = function (v) {
            _super.prototype._setFontSize.call(this, v);
            if (this._labelPlaceholder)
                this._labelPlaceholder.fontSize = v;
        };
        TextField.prototype._setTextAlign = function (a) {
            _super.prototype._setTextAlign.call(this, a);
            if (this._labelPlaceholder)
                this._labelPlaceholder.textAlign = a;
        };
        TextField.prototype._setText = function (s) {
            if (!_super.prototype._setText.call(this, s))
                return false;
            if (this._labelPlaceholder)
                this._labelPlaceholder.visible = s.length == 0;
            return true;
        };
        Object.defineProperty(TextField.prototype, "multilines", {
            get: function () {
                return this._lbl.multiline;
            },
            set: function (b) {
                this._lbl.multiline = b;
                if (this._labelPlaceholder)
                    this._labelPlaceholder.multilines = b;
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.__inp_focus = function () {
            nn.Keyboard.visible = true;
            if (this._labelPlaceholder)
                this._labelPlaceholder.visible = false;
            if (this._signals)
                this._signals.emit(nn.SignalFocusGot);
        };
        TextField.prototype.__inp_blur = function () {
            nn.Keyboard.visible = false;
            if (this._labelPlaceholder && this.text.length == 0)
                this._labelPlaceholder.visible = true;
            if (this._signals)
                this._signals.emit(nn.SignalFocusLost);
        };
        TextField.prototype.__lbl_changed = function (e) {
            this._scaleToFit && this.doScaleToFit();
            this._signals.emit(nn.SignalChanged, this.text);
        };
        TextField.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            if (this._labelPlaceholder)
                this._labelPlaceholder.setFrame(this.boundsForLayout());
        };
        return TextField;
    }(nn.Label));
    nn.TextField = TextField;
})(nn || (nn = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
// 解决textfield没有按键通知的问题
if (nn.ISHTML5) {
    var FUNC_TEXTHOOK_1 = egret.web['$cacheTextAdapter'];
    egret.web['$cacheTextAdapter'] = function (adapter, stage, container, canvas) {
        FUNC_TEXTHOOK_1(adapter, stage, container, canvas);
        var s = adapter._simpleElement;
        var m = adapter._multiElement;
        function FUNC_TEXTONPRESS(e) {
            var textfield = adapter._stageText.$textfield;
            if (textfield) {
                var ui = textfield.parent;
                if (ui._need_fix_textadapter && ui._signals) {
                    if (ui.keyboard == null)
                        ui.keyboard = new nn.CKeyboard();
                    ui.keyboard.key = e.key;
                    ui.keyboard.code = e.keyCode;
                    ui._signals.emit(nn.SignalKeyPress, ui.keyboard);
                }
            }
        }
        ;
        if (s && s.onkeypress != FUNC_TEXTHOOK_1)
            s.onkeypress = FUNC_TEXTONPRESS;
        if (m && m.onkeypress != FUNC_TEXTHOOK_1)
            m.onkeypress = FUNC_TEXTONPRESS;
    };
}
var nn;
(function (nn) {
    /** 找到所有的父对象 */
    function getParents(ui) {
        var r = [];
        var p = ui;
        while (p) {
            r.push(p);
            p = p.parent;
        }
        return r;
    }
    nn.getParents = getParents;
    /** 获取每一个 view 的 supers，做两个 arr 的交集，取得第一个返回 */
    function findAncestorView(l, r) {
        var ls = getParents(l);
        var rs = getParents(r);
        var s = nn.ArrayT.ArrayInArray(ls, rs);
        return s.length ? s[0] : null;
    }
    nn.findAncestorView = findAncestorView;
    /** 根据类型找父对象 */
    function findParentByType(l, cls, def) {
        var p = l.parent;
        while (p) {
            if (p instanceof cls)
                return p;
            p = p.parent;
        }
        return def;
    }
    nn.findParentByType = findParentByType;
    /** 根据自定义条件查找满足条件的父对象 */
    function queryParent(l, query, ctx) {
        var p = l.parent;
        while (p) {
            var r = query.call(ctx, p);
            if (r)
                return r;
            p = p.parent;
        }
        return null;
    }
    nn.queryParent = queryParent;
    /** 使用tag查找所有子元素 */
    function findElementsByTag(l, tag) {
        var arr = [];
        l.children.forEach(function (c) {
            if (c.tag == tag)
                arr.push(c);
            var sba = findElementsByTag(c, tag);
            nn.ArrayT.Concat(arr, sba);
        }, this);
        return arr;
    }
    nn.findElementsByTag = findElementsByTag;
    /** 判断是否在屏幕上显示 */
    function isAppearing(obj) {
        if (!obj)
            return true;
        if (egret.is(obj, "egret.Stage"))
            return true;
        if (!obj.visible)
            return false;
        return isAppearing(obj.parent);
    }
    nn.isAppearing = isAppearing;
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 转换标记到本地字符串 */
    function T(str) {
        return str;
    }
    nn.T = T;
    var _i18n = (function () {
        function _i18n() {
        }
        return _i18n;
    }());
    nn.i18n = new _i18n();
})(nn || (nn = {}));
var app;
(function (app) {
    var dev;
    (function (dev) {
    })(dev = app.dev || (app.dev = {}));
})(app || (app = {}));
var nn;
(function (nn) {
    // 提供底层用来从egret获取一些必要的数据
    nn.COLLECT_INSTRUMENT = false;
    var IPLabel = (function (_super) {
        __extends(IPLabel, _super);
        function IPLabel() {
            return _super.call(this) || this;
        }
        return IPLabel;
    }(nn.dom.Label));
    nn.IPLabel = IPLabel;
    var ProfilerPanel = (function (_super) {
        __extends(ProfilerPanel, _super);
        function ProfilerPanel() {
            var _this = _super.call(this) || this;
            _this.lblDrawed = new IPLabel();
            _this.lblCost = new IPLabel();
            _this.lblFps = new IPLabel();
            _this.lblDirty = new IPLabel();
            _this.add(_this.lblDrawed).br();
            _this.add(_this.lblCost).br();
            _this.add(_this.lblFps).br();
            _this.add(_this.lblDirty).br();
            return _this;
        }
        ProfilerPanel.prototype.start = function () {
            nn.COLLECT_INSTRUMENT = true;
        };
        ProfilerPanel.prototype.stop = function () {
            nn.COLLECT_INSTRUMENT = false;
        };
        ProfilerPanel.prototype.updateData = function () {
            _super.prototype.updateData.call(this);
            this.lblDrawed.content = (nn.Device.shared.isCanvas ? 'Canvas' : 'WebGL') + " Drawed: " + nn.COLLECT_DRAWS;
            this.lblCost.content = "Cost: " + nn.COLLECT_COST;
            this.lblFps.content = "FPS: " + nn.COLLECT_FPS;
            this.lblDirty.content = "Dirty: " + nn.COLLECT_DIRTYR + '%';
        };
        return ProfilerPanel;
    }(nn.dom.Sprite));
    nn.ProfilerPanel = ProfilerPanel;
    var SystemInfoPanel = (function (_super) {
        __extends(SystemInfoPanel, _super);
        function SystemInfoPanel() {
            var _this = _super.call(this) || this;
            _this.lblOrientation = new IPLabel();
            _this.lblEnvSize = new IPLabel();
            _this.lblNavi = new IPLabel();
            _this.add(_this.lblOrientation).br();
            _this.add(_this.lblEnvSize).br();
            _this.add(_this.lblNavi).br();
            nn.CApplication.shared.signals.connect(nn.SignalFrameChanged, _this.updateData, _this);
            return _this;
        }
        SystemInfoPanel.prototype.updateData = function () {
            _super.prototype.updateData.call(this);
            this.lblOrientation.content = 'Orientation: ' + Js.getBrowserOrientation() + (window.orientation != undefined ? ' SUPPORT' : '');
            var brwsz = Js.getBrowserSize();
            var scrsz = Js.getScreenSize();
            var stgsz = nn.StageBounds.size;
            this.lblEnvSize.content = 'BrowserSize: ' + brwsz.width + ',' + brwsz.height
                + ' ScreenSize: ' + scrsz.width + ',' + scrsz.height
                + ' StageSize: ' + stgsz.width * nn.ScaleFactorW + ',' + stgsz.height * nn.ScaleFactorH + ' Resource: ' + nn.ResManager.directory;
            this.lblNavi.content = navigator.userAgent;
        };
        return SystemInfoPanel;
    }(nn.dom.Sprite));
    nn.SystemInfoPanel = SystemInfoPanel;
    var InstrumentPanel = (function (_super) {
        __extends(InstrumentPanel, _super);
        function InstrumentPanel() {
            var _this = _super.call(this) || this;
            _this.pnlSysinfo = new SystemInfoPanel();
            _this.pnlProfiler = new ProfilerPanel();
            _this.pnlDebug = new DebugPanel();
            _this.css = "position:absolute;bottom:0px;height:90%;width:100%;z-position:999;opacity:0.95;background:white;";
            return _this;
        }
        InstrumentPanel.prototype.preload = function (cb, ctx) {
            Js.loadSources([
                ["http://7xlcco.com1.z0.glb.clouddn.com/webix/webix.css", 1 /* CSS */],
                ["http://7xlcco.com1.z0.glb.clouddn.com/webix/webix_debug.js", 0 /* JS */]
            ], cb, ctx);
        };
        InstrumentPanel.prototype.onLoaded = function () {
            _super.prototype.onLoaded.call(this);
            webix.getElementById = function (id) {
                return $$(id).getNode();
            };
            // 初始化webix
            webix.ui({
                view: "tabview",
                cells: [
                    {
                        header: "INFO", body: {
                            id: "::dt::info"
                        }
                    },
                    {
                        header: "DEBUG", body: {
                            id: "::dt::debug"
                        }
                    }
                ],
                multiview: {
                    keepViews: true
                },
                container: this.id
            });
            // 初始化panel
            var panel = nn.dom.DomObject.From(webix.getElementById("::dt::info"));
            panel.add(this.pnlSysinfo);
            panel.add(this.pnlProfiler);
            panel = nn.dom.DomObject.From(webix.getElementById("::dt::debug"));
            panel.add(this.pnlDebug);
        };
        InstrumentPanel.prototype.open = function () {
            this.pnlSysinfo.updateData();
            this.pnlProfiler.start();
        };
        InstrumentPanel.prototype.close = function () {
            this.pnlProfiler.stop();
        };
        InstrumentPanel.prototype.updateData = function () {
            _super.prototype.updateData.call(this);
            this.pnlProfiler.updateData();
        };
        return InstrumentPanel;
    }(nn.dom.Sprite));
    nn.InstrumentPanel = InstrumentPanel;
    var DebugPanel = (function (_super) {
        __extends(DebugPanel, _super);
        function DebugPanel() {
            return _super.call(this) || this;
        }
        // 加载外部的debug工具脚本
        DebugPanel.prototype.onLoaded = function () {
            _super.prototype.onLoaded.call(this);
            if (app.dev.main != null)
                app.dev.main(this);
        };
        return DebugPanel;
    }(nn.dom.Sprite));
    nn.DebugPanel = DebugPanel;
    var Instrument = (function (_super) {
        __extends(Instrument, _super);
        function Instrument() {
            var _this = _super.call(this) || this;
            _this.button = new nn.dom.Button();
            _this.panel = new InstrumentPanel();
            _this.button.content = "调试器";
            _this.button.css = "position:absolute;top:0;left:50%;z-position:999;background:white;opacity:0.3;";
            _this.button.signals.connect(nn.SignalClicked, _this.open, _this);
            nn.Dom.add(_this.button);
            return _this;
        }
        Instrument.run = function () {
            // 当前利用dom来实现测试器，不支持原生模式
            if (nn.ISNATIVE)
                return;
            if (Instrument.shared == null)
                Instrument.shared = new Instrument();
            return Instrument.shared;
        };
        Instrument.prototype.open = function () {
            if (this.panel.parent == null) {
                nn.Dom.add(this.panel);
            }
            this.panel.visible = true;
            this.button.signals.disconnect(nn.SignalClicked);
            this.button.signals.connect(nn.SignalClicked, this.close, this);
            this.panel.open();
        };
        Instrument.prototype.close = function () {
            this.panel.visible = false;
            this.button.signals.disconnect(nn.SignalClicked);
            this.button.signals.connect(nn.SignalClicked, this.open, this);
            this.panel.close();
        };
        Instrument.prototype.updateData = function () {
            this.panel.updateData();
        };
        return Instrument;
    }(nn.SObject));
    nn.Instrument = Instrument;
    nn.CApplication.InBoot(function () {
        if (nn.ISDEBUG)
            Instrument.run();
    });
})(nn || (nn = {}));
var nn;
(function (nn) {
    var journal;
    (function (journal) {
        var _records = new Array();
        /** 添加一个日志 */
        function add(reason, obj) {
            _records.push({
                time: new nn.DateTime(),
                snapshot: obj.snapshot(),
                reason: reason,
                stack: Js.stacktrace()
            });
        }
        journal.add = add;
        /** 查找满足条件的日志 */
        function query(keypath, val) {
            return nn.ArrayT.QueryObjects(_records, function (e) {
                return nn.ObjectT.GetValueByKeyPath(e.snapshot, keypath) == val;
            });
        }
        journal.query = query;
        function recordStringify(rcd, sb) {
            sb.add(rcd.time.toString("HH:mm:ss "));
            sb.add(rcd.reason).add(" ");
            sb.add(nn.vardump(rcd.snapshot));
            sb.line();
        }
        /** 打印日志 */
        function recordsStringify(rcds) {
            if (rcds === void 0) { rcds = _records; }
            var sb = new nn.StringBuilder();
            rcds.forEach(function (e) {
                recordStringify(e, sb);
            });
            return sb.toString();
        }
        journal.recordsStringify = recordsStringify;
        var ArrayT = (function () {
            function ArrayT() {
            }
            ArrayT.RemoveObjectByFilter = function (reason, arr, filter, ctx) {
                var obj = nn.ArrayT.RemoveObjectByFilter(arr, filter, ctx);
                if (obj)
                    add(reason, obj);
                return obj;
            };
            ArrayT.RemoveObjectsByFilter = function (reason, arr, filter, ctx) {
                var objs = nn.ArrayT.RemoveObjectsByFilter(arr, filter, ctx);
                objs.forEach(function (e) {
                    add(reason, e);
                });
                return objs;
            };
            ArrayT.Convert = function (reason, arr, convert, ctx) {
                var objs = nn.ArrayT.Convert(arr, convert, ctx);
                objs.forEach(function (e) {
                    add(reason, e);
                });
                return objs;
            };
            return ArrayT;
        }());
        journal.ArrayT = ArrayT;
        var IndexedMapT = (function () {
            function IndexedMapT() {
            }
            IndexedMapT.RemoveObjectByFilter = function (reason, map, filter, ctx) {
                var obj = nn.IndexedMapT.RemoveObjectByFilter(map, filter, ctx);
                if (obj)
                    add(reason, obj[1]);
                return obj;
            };
            IndexedMapT.RemoveObjectsByFilter = function (reason, map, filter, ctx) {
                var objs = nn.IndexedMapT.RemoveObjectsByFilter(map, filter, ctx);
                objs.forEach(function (e) {
                    add(reason, e[1]);
                });
                return objs;
            };
            IndexedMapT.Convert = function (reason, arr, convert, ctx) {
                var map = nn.IndexedMapT.Convert(arr, convert, ctx);
                map.forEach(function (k, v) {
                    add(reason, v);
                });
                return map;
            };
            return IndexedMapT;
        }());
        journal.IndexedMapT = IndexedMapT;
    })(journal = nn.journal || (nn.journal = {}));
})(nn || (nn = {}));
// 标准APP架构
var nn;
(function (nn) {
    var EntrySettings = (function () {
        function EntrySettings() {
            /** 独立模式，代表该实体只能同时存在一个对象，默认为true */
            this.singletone = true;
        }
        return EntrySettings;
    }());
    EntrySettings.Default = new EntrySettings();
    nn.EntrySettings = EntrySettings;
    var Manager = (function (_super) {
        __extends(Manager, _super);
        function Manager() {
            return _super.apply(this, arguments) || this;
        }
        /** 当整个APP完成配置数据加载试调用，初始化自身的数据 */
        Manager.prototype.onDataLoaded = function () {
        };
        return Manager;
    }(nn.SObject));
    nn.Manager = Manager;
    var Managers = (function (_super) {
        __extends(Managers, _super);
        function Managers() {
            var _this = _super.apply(this, arguments) || this;
            _this._managers = new Array();
            return _this;
        }
        Managers.prototype.register = function (obj) {
            this._managers.push(obj);
            return obj;
        };
        Managers.prototype.onLoaded = function () {
            this._managers.forEach(function (e) {
                e.onLoaded();
            });
        };
        Managers.prototype.onDataLoaded = function () {
            this._managers.forEach(function (e) {
                e.onDataLoaded();
            });
        };
        return Managers;
    }(nn.SObject));
    nn.Managers = Managers;
    var _EntriesManager = (function () {
        function _EntriesManager() {
            this._entries = new KvObject();
            this._entriesdata = new KvObject();
        }
        /** 注册一个模块
            @param entryClass类
        */
        _EntriesManager.prototype.register = function (entryClass, data) {
            if (data === void 0) { data = EntrySettings.Default; }
            var idr;
            if (typeof (entryClass) == 'object') {
                var o = entryClass;
                idr = o.name;
            }
            else {
                idr = nn.Classname(entryClass);
            }
            this._entries[idr] = entryClass;
            this._entriesdata[idr] = data;
        };
        /** 启动一个模块
            @param entry 类或者标类名
            @param launcher 启动点的标示号或者启动点的实例
            @pram data 附加的参数
        */
        _EntriesManager.prototype.invoke = function (entry, launcher, ext) {
            this._doInvoke(entry, launcher, ext);
        };
        _EntriesManager.prototype._doInvoke = function (entry, launcher, ext) {
            var _this = this;
            if (entry == null) {
                nn.warn("不能打开空的实例");
                return;
            }
            var idr = typeof (entry) == 'string' ? entry : nn.Classname(entry);
            var cls = this._entries[idr];
            if (typeof (cls) == 'object') {
                // 复杂定义一个类型，为了支持动态入口逻辑
                var o = cls;
                cls = o.clazz();
            }
            if (cls == null) {
                nn.fatal("找不到实体类型 " + idr + "，请检查是否没有注册到EntriesManager");
                return;
            }
            // 在launchers中查启动点
            var ler;
            if (typeof (launcher) == 'string')
                ler = nn.LaunchersManager.find(launcher);
            if (ler == null && typeof (launcher) == 'function') {
                var leridr_1 = launcher(idr);
                ler = nn.LaunchersManager.find(leridr_1);
                // 如果ler为null，则代表目标模块还没有加载，需要先加载目标模块，待之准备好后，再加载当前模块
                if (ler == null) {
                    var wait_1 = function (s) {
                        if (s.data != leridr_1)
                            return;
                        nn.LaunchersManager.signals.disconnect(nn.SignalChanged, wait_1);
                        var data = _this._entriesdata[idr];
                        // 重新查找，此次不可能查不到
                        ler = nn.LaunchersManager.find(leridr_1);
                        ler.launchEntry(cls, data);
                    };
                    nn.LaunchersManager.signals.connect(nn.SignalChanged, wait_1, null);
                    this._doInvoke(leridr_1, launcher);
                    return;
                }
            }
            if (ler == null && typeof (launcher) == 'object')
                ler = launcher;
            if (ler == null) {
                nn.fatal("没有找到停靠点" + launcher);
                return;
            }
            // 加载最终的模块
            var data = this._entriesdata[idr];
            if (!nn.EntryCheckSettings(cls, data))
                return;
            // 检查是否可以打开
            if (data == null)
                data = new EntrySettings();
            data.ext = ext;
            ler.launchEntry(cls, data);
        };
        _EntriesManager.prototype.toString = function () {
            var t = [];
            nn.MapT.Foreach(this._entries, function (k) {
                t.push(k);
            });
            return t.join(';');
        };
        return _EntriesManager;
    }());
    nn._EntriesManager = _EntriesManager;
    // 应用实例管理器
    nn.EntriesManager = new _EntriesManager();
    var _LaunchersManager = (function (_super) {
        __extends(_LaunchersManager, _super);
        function _LaunchersManager() {
            var _this = _super.call(this) || this;
            _this._launchers = new KvObject();
            return _this;
        }
        _LaunchersManager.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalChanged);
        };
        /** 注册一个启动器 */
        _LaunchersManager.prototype.register = function (obj) {
            var idr = nn.Classname(obj);
            var fnd = this._launchers[idr];
            if (fnd) {
                nn.warn('LaunchersManager 已经注册过 ' + idr);
                return;
            }
            this._launchers[idr] = obj;
            // 直接设置UI对象中的对应标记，用来当UI关闭时释放该停靠点
            obj.__need_remove_from_launchersmanager = true;
            this.signals.emit(nn.SignalChanged, idr);
        };
        /** 取消 */
        _LaunchersManager.prototype.unregister = function (obj) {
            var idr = nn.Classname(obj);
            nn.MapT.RemoveKey(this._launchers, idr);
        };
        /** 查找一个启动器 */
        _LaunchersManager.prototype.find = function (str) {
            return this._launchers[str];
        };
        _LaunchersManager.prototype.toString = function () {
            var t = [];
            nn.MapT.Foreach(this._launchers, function (k) {
                t.push(k);
            });
            return t.join(';');
        };
        return _LaunchersManager;
    }(nn.SObject));
    nn._LaunchersManager = _LaunchersManager;
    // 应用入口管理器
    nn.LaunchersManager = new _LaunchersManager();
})(nn || (nn = {}));
var nn;
(function (nn) {
    var Vector2d = (function (_super) {
        __extends(Vector2d, _super);
        function Vector2d() {
            return _super.apply(this, arguments) || this;
        }
        Vector2d.prototype.applyTransform = function (tfm) {
            tfm._mat.transformPoint(this.x, this.y, this);
            return this;
        };
        return Vector2d;
    }(nn.Point));
    nn.Vector2d = Vector2d;
    var Rect2d = (function (_super) {
        __extends(Rect2d, _super);
        function Rect2d() {
            return _super.apply(this, arguments) || this;
        }
        Rect2d.prototype.applyTransform = function (tfm) {
            var pt = new Vector2d(this.x, this.y);
            pt.applyTransform(tfm);
            this.x = pt.x;
            this.y = pt.y;
            return this;
        };
        return Rect2d;
    }(nn.Rect));
    nn.Rect2d = Rect2d;
    // 放射变换
    var Transform2d = (function () {
        function Transform2d() {
            this._mat = new egret.Matrix();
        }
        Transform2d.prototype.scale = function (vec) {
            this._mat.scale(vec.x, vec.y);
            return this;
        };
        Transform2d.prototype.rotate = function (ang) {
            this._mat.rotate(ang.rad);
            return this;
        };
        Transform2d.prototype.translate = function (vec) {
            this._mat.translate(vec.x, vec.y);
            return this;
        };
        Transform2d.prototype.invert = function () {
            this._mat.invert();
            return this;
        };
        Transform2d.prototype.identity = function () {
            this._mat.identity();
            return this;
        };
        return Transform2d;
    }());
    nn.Transform2d = Transform2d;
    var Vector3d = (function () {
        function Vector3d(x, y, z, w) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (w === void 0) { w = 1; }
            this._v[0] = x;
            this._v[1] = y;
            this._v[2] = z;
            this._v[3] = w;
        }
        Object.defineProperty(Vector3d.prototype, "x", {
            get: function () {
                return this._v[0];
            },
            set: function (v) {
                this._v[0] = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3d.prototype, "y", {
            get: function () {
                return this._v[1];
            },
            set: function (v) {
                this._v[1] = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3d.prototype, "z", {
            get: function () {
                return this._v[2];
            },
            set: function (v) {
                this._v[2] = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3d.prototype, "w", {
            get: function () {
                return this._v[3];
            },
            set: function (v) {
                this._v[3] = v;
            },
            enumerable: true,
            configurable: true
        });
        return Vector3d;
    }());
    nn.Vector3d = Vector3d;
    // 4元组变换
    var Transform3d = (function () {
        function Transform3d() {
        }
        return Transform3d;
    }());
    nn.Transform3d = Transform3d;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var Layout = (function () {
        function Layout(ctx) {
            this._ctx = ctx;
        }
        Layout.prototype.useAnchor = function (b) {
            this.anchor = b;
            return this;
        };
        /** 设置整体大小 */
        Layout.prototype.setRect = function (rc) {
            if (this._orc == null) {
                this._orc = rc;
            }
            else {
                this._orc.x = rc.x;
                this._orc.y = rc.y;
                this._orc.width = rc.width;
                this._orc.height = rc.height;
            }
            this._rc = this._orc.clone().applyEdgeInsets(this.edgeInsets);
            return this;
        };
        Object.defineProperty(Layout.prototype, "frame", {
            /** 获得整体大小 */
            get: function () {
                this._avaRect();
                return this._orc.clone();
            },
            set: function (rc) {
                this.setRect(rc);
            },
            enumerable: true,
            configurable: true
        });
        // 初始化 rect
        Layout.prototype._avaRect = function () {
            if (this._orc)
                return false;
            if (this._ctx) {
                this._orc = this._ctx.boundsForLayout();
            }
            else {
                this._orc = new nn.Rect();
                nn.warn("没有设置 Box 的 Rect");
            }
            this._rc = this._orc.clone().applyEdgeInsets(this.edgeInsets);
            return true;
        };
        Layout.prototype.frameForLayout = function () {
            this._avaRect();
            return this._rc.clone();
        };
        /** 设置布局的边距 */
        Layout.prototype.padding = function (ei) {
            this.edgeInsets = ei;
            if (this._avaRect() == false)
                this._rc = this._orc.clone().applyEdgeInsets(this.edgeInsets);
            return this;
        };
        /** 偏移 */
        Layout.prototype.offset = function (pt) {
            this._avaRect();
            this._orc.offset(pt);
            this._rc.offset(pt);
            return this;
        };
        /** 应用布局 */
        Layout.prototype.apply = function () {
            // 确保 rect 不是 null
            this._avaRect();
            this._offset = 0;
            // 如果有依赖的 view，则之后的布局均按照在 view 内部布局来处理
            if (this.view) {
                this.view.setFrame(this._rc);
                this.setRect(this.view.boundsForLayout());
            }
            // 不能在此处理结束，由子类负责
        };
        Layout.prototype.complete = function (cb, ctx) {
            this._cbcomplete = cb;
            this._ctxcomplete = ctx;
        };
        return Layout;
    }());
    nn.Layout = Layout;
    var LinearSegment = (function () {
        function LinearSegment() {
        }
        LinearSegment.prototype.dispose = function () {
            this.obj = undefined;
            this.cb = undefined;
            this.ctx = undefined;
            this.data = undefined;
        };
        LinearSegment.prototype.setRect = function (x, y, w, h) {
            if (this.cb) {
                this.cb.call(this.ctx, this.obj, new nn.Rect(x, y, w, h), this.data);
            }
            else if (this.obj &&
                this.obj instanceof nn.CComponent) {
                this.obj.setFrame(new nn.Rect(x, y, w, h), this.anchor);
            }
        };
        return LinearSegment;
    }());
    nn.LinearSegment = LinearSegment;
    var LinearLayout = (function (_super) {
        __extends(LinearLayout, _super);
        function LinearLayout() {
            var _this = _super.apply(this, arguments) || this;
            _this._segments = new Array();
            /** 间距 */
            _this.spacing = 0;
            return _this;
        }
        LinearLayout.prototype.setSpacing = function (v) {
            this.spacing = v;
            return this;
        };
        LinearLayout.prototype.clear = function () {
            nn.ArrayT.Clear(this._segments, function (o) {
                o.dispose();
            });
        };
        /** 按照像素划分 */
        LinearLayout.prototype.addPixel = function (pixel, obj, cb, ctx, data) {
            var seg = new LinearSegment();
            seg.val = pixel;
            seg.isp = true;
            seg.obj = obj;
            seg.cb = cb;
            seg.ctx = ctx ? ctx : this._ctx;
            seg.data = data;
            seg.anchor = this.anchor;
            this._segments.push(seg);
            return this;
        };
        /** 按照定比来划分，总比例为各个 flex 之和，每一个 flex 的长度为 (总长 - 固定像素长) / 总 flex */
        LinearLayout.prototype.addFlex = function (flex, obj, cb, ctx, data) {
            var seg = new LinearSegment();
            seg.val = flex;
            seg.isp = false;
            seg.obj = obj;
            seg.cb = cb;
            seg.ctx = ctx ? ctx : this._ctx;
            seg.data = data;
            seg.anchor = this.anchor;
            this._segments.push(seg);
            return this;
        };
        LinearLayout.prototype.addPixelHBox = function (pixel, boxcb, ctx, data) {
            this.addPixel(pixel, null, function (obj, rc, data) {
                var box = new HBox(this).setRect(rc);
                boxcb.call(this, box, data);
                box.apply();
            }, ctx, data);
            return this;
        };
        LinearLayout.prototype.addPixelVBox = function (pixel, boxcb, ctx, data) {
            this.addPixel(pixel, null, function (obj, rc, data) {
                var box = new VBox(this).setRect(rc);
                boxcb.call(this, box, data);
                box.apply();
            }, ctx, data);
            return this;
        };
        LinearLayout.prototype.addFlexHBox = function (flex, boxcb, ctx, data) {
            this.addFlex(flex, null, function (obj, rc, data) {
                var box = new HBox(this).setRect(rc);
                boxcb.call(this, box, data);
                box.apply();
            }, ctx, data);
            return this;
        };
        LinearLayout.prototype.addFlexVBox = function (flex, boxcb, ctx, data) {
            this.addFlex(flex, null, function (obj, rc, data) {
                var box = new VBox(this).setRect(rc);
                boxcb.call(this, box, data);
                box.apply();
            }, ctx, data);
            return this;
        };
        LinearLayout.prototype.addAspect = function (w, h, obj, cb, ctx, data) {
            return this.addPixel(w / h * this.against(), obj, cb, ctx, data);
        };
        LinearLayout.prototype.addAspectHBox = function (w, h, boxcb, ctx, data) {
            return this.addPixelHBox(w / h * this.against(), boxcb, ctx, data);
        };
        LinearLayout.prototype.addAspectVBox = function (w, h, boxcb, ctx, data) {
            return this.addPixelVBox(w / h * this.against(), boxcb, ctx, data);
        };
        LinearLayout.prototype.apply = function () {
            var _this = this;
            _super.prototype.apply.call(this);
            // 计算所有的定长度，扣除后，计算所有的占比和单份占比
            var sumpixel = 0, sumflex = 0;
            this._segments.forEach(function (seg) {
                if (seg.isp)
                    sumpixel += seg.val;
                else
                    sumflex += seg.val;
            }, this);
            var lftlen = this.length() - sumpixel;
            var seglen = sumflex ? lftlen / sumflex : 0;
            // 应用长度
            this._segments.forEach(function (seg, idx) {
                var val = 0;
                if (seg.isp)
                    val = seg.val;
                else
                    val = seg.val * seglen;
                _this._offset += _this.setSegmentLength(val, seg, idx);
            }, this);
            // 处理结束
            if (this._cbcomplete)
                this._cbcomplete.call(this._ctxcomplete ? this._ctxcomplete : this._ctx);
            // 清空
            this.clear();
        };
        // 获得间距占的长度
        LinearLayout.prototype._spacingsLength = function () {
            var self = this;
            if (self.spacing == 0)
                return 0;
            var cnt = self._segments.length;
            if (cnt > 1)
                return self.spacing * (cnt - 1);
            return 0;
        };
        // 一些工具函数
        // 按照比例来从中间拿出固定大小
        LinearLayout.prototype.clipPixel = function (pix, obj, lflex, rflex, cb, ctx, data) {
            if (lflex === void 0) { lflex = 1; }
            if (rflex === void 0) { rflex = 1; }
            if (lflex != 0)
                this.addFlex(lflex);
            this.addPixel(pix, obj, cb, ctx, data);
            if (rflex != 0)
                this.addFlex(rflex);
            return this;
        };
        LinearLayout.prototype.clipFlex = function (flex, obj, lpix, rpix, cb, ctx, data) {
            if (lpix != 0)
                this.addPixel(lpix);
            this.addFlex(flex, obj, cb, ctx, data);
            if (rpix != 0)
                this.addPixel(rpix);
            return this;
        };
        LinearLayout.prototype.clipPixelHBox = function (pix, boxcb, lflex, rflex, ctx, data) {
            if (lflex === void 0) { lflex = 1; }
            if (rflex === void 0) { rflex = 1; }
            if (lflex != 0)
                this.addFlex(lflex);
            this.addPixelHBox(pix, boxcb, ctx, data);
            if (rflex != 0)
                this.addFlex(rflex);
            return this;
        };
        LinearLayout.prototype.clipFlexHBox = function (flex, boxcb, lpix, rpix, ctx, data) {
            if (lpix != 0)
                this.addPixel(lpix);
            this.addFlexHBox(flex, boxcb, ctx, data);
            if (rpix != 0)
                this.addPixel(rpix);
            return this;
        };
        LinearLayout.prototype.clipPixelVBox = function (pix, boxcb, lflex, rflex, ctx, data) {
            if (lflex === void 0) { lflex = 1; }
            if (rflex === void 0) { rflex = 1; }
            if (lflex != 0)
                this.addFlex(lflex);
            this.addPixelVBox(pix, boxcb, ctx, data);
            if (rflex != 0)
                this.addFlex(rflex);
            return this;
        };
        LinearLayout.prototype.clipFlexVBox = function (flex, boxcb, lpix, rpix, ctx, data) {
            if (lpix != 0)
                this.addPixel(lpix);
            this.addFlexVBox(flex, boxcb, ctx, data);
            if (rpix != 0)
                this.addPixel(rpix);
            return this;
        };
        return LinearLayout;
    }(Layout));
    nn.LinearLayout = LinearLayout;
    var HBox = (function (_super) {
        __extends(HBox, _super);
        function HBox(ctx) {
            return _super.call(this, ctx) || this;
        }
        HBox.prototype.length = function () {
            return this._rc.width - this._spacingsLength();
        };
        HBox.prototype.against = function () {
            this._avaRect();
            return this._rc.height;
        };
        HBox.prototype.setSegmentLength = function (len, seg, idx) {
            var self = this;
            seg.setRect(self._offset + self._rc.x, self._rc.y, len, self._rc.height);
            if (self.spacing && (idx + 1) < self._segments.length)
                len += self.spacing;
            return len;
        };
        return HBox;
    }(LinearLayout));
    nn.HBox = HBox;
    var VBox = (function (_super) {
        __extends(VBox, _super);
        function VBox(ctx) {
            return _super.call(this, ctx) || this;
        }
        VBox.prototype.length = function () {
            return this._rc.height - this._spacingsLength();
        };
        VBox.prototype.against = function () {
            this._avaRect();
            return this._rc.width;
        };
        VBox.prototype.setSegmentLength = function (len, seg, idx) {
            var self = this;
            seg.setRect(self._rc.x, self._offset + self._rc.y, self._rc.width, len);
            if (self.spacing && (idx + 1) < self._segments.length)
                len += self.spacing;
            return len;
        };
        return VBox;
    }(LinearLayout));
    nn.VBox = VBox;
    var FlowOption;
    (function (FlowOption) {
        FlowOption[FlowOption["Fix"] = 0] = "Fix";
        FlowOption[FlowOption["Stretch"] = 1] = "Stretch";
    })(FlowOption = nn.FlowOption || (nn.FlowOption = {}));
    ;
    var FlowSegment = (function () {
        function FlowSegment() {
        }
        FlowSegment.prototype.dispose = function () {
            this.obj = undefined;
            this.cb = undefined;
            this.ctx = undefined;
            this.data = undefined;
        };
        FlowSegment.prototype.setRect = function (x, y, w) {
            if (this.cb) {
                this.cb.call(this.ctx, this.obj, new nn.Rect(x, y, w, this.h), this.data);
            }
            else if (this.obj &&
                this.obj instanceof nn.CComponent) {
                this.obj.setFrame(new nn.Rect(x, y, w, this.h), this.anchor);
            }
        };
        return FlowSegment;
    }());
    nn.FlowSegment = FlowSegment;
    var HFlow = (function (_super) {
        __extends(HFlow, _super);
        function HFlow(ctx) {
            var _this = _super.call(this, ctx) || this;
            _this._segments = new Array();
            return _this;
        }
        HFlow.prototype.clear = function () {
            nn.ArrayT.Clear(this._segments, function (o) {
                o.dispose();
            });
        };
        HFlow.prototype.addSize = function (w, h, option, obj, cb, ctx, data) {
            if (option === void 0) { option = 0; }
            var seg = new FlowSegment();
            seg.w = w;
            seg.h = h;
            seg.option = option;
            seg.obj = obj;
            seg.cb = cb;
            seg.ctx = ctx ? ctx : this._ctx;
            seg.data = data;
            seg.anchor = this.anchor;
            this._segments.push(seg);
            return this;
        };
        HFlow.prototype.apply = function () {
            var _this = this;
            _super.prototype.apply.call(this);
            this._avaRect();
            this.position = this._rc.leftTop;
            var w = this._rc.width;
            var h = this._rc.height;
            // 按照行划分格子
            var sw = 0, sh = 0;
            var rows = new Array();
            this._segments.forEach(function (seg) {
                if (sw + seg.w <= w) {
                    sw += seg.w;
                    if (sh < seg.h)
                        sh = seg.h;
                    rows.push(seg);
                }
                else {
                    // 超出了当前行的宽度，需要换行并应用掉
                    _this.applyRows(rows, _this.position, w);
                    nn.ArrayT.Clear(rows);
                    // 开始下一行
                    _this.position.y += sh;
                    sw = seg.w;
                    sh = seg.h;
                    rows.push(seg);
                }
            }, this);
            // 如果最后一行没有遇到换行，则需要附加计算一次
            if (rows.length) {
                this.applyRows(rows, this.position, w);
                nn.ArrayT.Clear(rows);
                this.position.y += sh;
            }
            // 处理结束
            if (this._cbcomplete)
                this._cbcomplete.call(this._ctxcomplete ? this._ctxcomplete : this._ctx);
            // 清理
            this.clear();
        };
        HFlow.prototype.applyRows = function (rows, pos, w) {
            var _this = this;
            this._offset = 0;
            // 和 linear 的 flex 算法类似
            var flex = 0, pix = 0;
            rows.forEach(function (seg) {
                if (seg.option == FlowOption.Stretch)
                    flex += 1;
                pix += seg.w;
            }, this);
            // 计算可以拉伸的控件需要拉大多少
            flex = flex ? ((w - pix) / flex) : 0;
            // 布局
            rows.forEach(function (seg) {
                var w = seg.w;
                if (seg.option == FlowOption.Stretch)
                    w += flex;
                seg.setRect(_this._offset + pos.x, pos.y, w);
                _this._offset += w;
            });
        };
        return HFlow;
    }(Layout));
    nn.HFlow = HFlow;
})(nn || (nn = {}));
var egret;
(function (egret) {
    egret.VERSION_2_5_6 = egret.MAKE_VERSION(2, 5, 6);
})(egret || (egret = {}));
var nn;
(function (nn) {
    nn.IMP_TIMEPASS = function () {
        return egret.getTimer() * 0.001;
    };
    nn.IMP_CREATE_TIMER = function (duration, count) {
        return new egret.Timer(duration * 1000, count);
    };
    nn.IMP_START_TIMER = function (tmr, cb, ctx) {
        tmr.addEventListener(egret.TimerEvent.TIMER, cb, ctx);
        tmr.start();
    };
    nn.IMP_STOP_TIMER = function (tmr, cb, ctx) {
        tmr.stop();
        tmr.removeEventListener(egret.TimerEvent.TIMER, cb, ctx);
    };
    // 需要判断一下是使用LocalStorage还是使用SessionStorage
    var _storageMode = (function () {
        var key = "::n2::test::localstorage::mode";
        if (egret.localStorage.setItem(key, "test")) {
            egret.localStorage.removeItem(key);
            return 0;
        }
        if (window && window.sessionStorage) {
            try {
                window.sessionStorage.setItem(key, "test");
                window.sessionStorage.removeItem(key);
                return 1;
            }
            catch (e) { } // 不支持sessionStorage
        }
        return -1;
    })();
    if (_storageMode == 0) {
        nn.IMP_STORAGE_GET = egret.localStorage.getItem;
        nn.IMP_STORAGE_SET = egret.localStorage.setItem;
        nn.IMP_STORAGE_DEL = egret.localStorage.removeItem;
        nn.IMP_STORAGE_CLEAR = egret.localStorage.clear;
    }
    else if (_storageMode == 1) {
        nn.IMP_STORAGE_GET = function (k) {
            return window.sessionStorage.getItem(k);
        };
        nn.IMP_STORAGE_SET = function (k, v) {
            window.sessionStorage.setItem(k, v);
        };
        nn.IMP_STORAGE_DEL = function (k) {
            window.sessionStorage.removeItem(k);
        };
        nn.IMP_STORAGE_CLEAR = function () {
            window.sessionStorage.clear();
        };
    }
    else {
        var __g_storage_1 = {};
        nn.IMP_STORAGE_GET = function (key) {
            return __g_storage_1[key];
        };
        nn.IMP_STORAGE_SET = function (key, v) {
            __g_storage_1[key] = v;
        };
        nn.IMP_STORAGE_DEL = function (key) {
            delete __g_storage_1[key];
        };
        nn.IMP_STORAGE_CLEAR = function () {
            __g_storage_1 = {};
        };
    }
    nn.Defer = function (cb, ctx) {
        var p = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            p[_i - 2] = arguments[_i];
        }
        egret.callLater.apply(null, [cb, ctx].concat(p));
    };
    // 将point伪装成egret.point
    var __PROTO = nn.Point.prototype;
    __PROTO.setTo = function (x, y) {
        this.x = x;
        this.y = y;
    };
    // 解决egret-inspector显示的是实现类而不是业务类的名称
    Js.OverrideFunction(egret, 'getQualifiedClassName', function (orifn, value) {
        if ('_fmui' in value)
            return value._fmui.descriptionName;
        return orifn(value);
    });
})(nn || (nn = {}));
// 对egret的RES模块进行功能扩展
var RES;
(function (RES) {
    var ExtResourceItem = (function (_super) {
        __extends(ExtResourceItem, _super);
        function ExtResourceItem(name, url, type) {
            var _this = _super.call(this, name, url, type) || this;
            _this._priority = nn.ResCurrentPriority;
            return _this;
        }
        return ExtResourceItem;
    }(RES.ResourceItem));
    var ExtLazyLoadList = (function () {
        function ExtLazyLoadList() {
            this.length = 0;
            // 不通的等级定义不同的队列
            this.items = [
                new Array(),
                new Array()
            ];
        }
        ExtLazyLoadList.prototype.push = function (item) {
            var arr = this.items[item._priority];
            arr.push(item);
            ++this.length;
        };
        ExtLazyLoadList.prototype.pop = function () {
            if (this.length == 0)
                return null;
            var arr = this.items[nn.ResPriority.NORMAL];
            var poped = arr.pop();
            if (poped == null) {
                arr = this.items[nn.ResPriority.CLIP];
                poped = arr.pop();
            }
            --this.length;
            return poped;
        };
        return ExtLazyLoadList;
    }());
    RES.ResourceItem = ExtResourceItem;
    // 使用ext换掉原来的lazy以提供附加的优先级控制
    var lazyLoadListChanged;
    var PROTO = RES.ResourceLoader.prototype;
    var funcLoadItem = PROTO.loadItem;
    PROTO.loadItem = function (resItem) {
        var self = this;
        if (!lazyLoadListChanged) {
            if (self.lazyLoadList == null)
                nn.fatal("Egret引擎升级RES的LazyLoadList方法，请检查引擎修改");
            self.lazyLoadList = new ExtLazyLoadList();
            lazyLoadListChanged = true;
        }
        funcLoadItem.call(self, resItem);
    };
})(RES || (RES = {}));
var nn;
(function (nn) {
    // 资源池
    var _ResMemcache = (function (_super) {
        __extends(_ResMemcache, _super);
        function _ResMemcache() {
            var _this = _super.call(this) || this;
            // 自定义个hashCode
            _this._hashCode = 0;
            // cache-key 和 sources 的对照表
            _this._sources = new KvObject();
            _this._keys = new KvObject();
            _this.enable = true;
            return _this;
        }
        _ResMemcache.prototype.doRemoveObject = function (rcd) {
            var _this = this;
            _super.prototype.doRemoveObject.call(this, rcd);
            var srcs = this._sources[rcd.key];
            srcs.forEach(function (e) {
                RES.destroyRes(e);
                if (nn.VERBOSE)
                    nn.log("释放资源 " + e);
                delete _this._keys[e];
            });
            delete this._sources[rcd.key];
        };
        // 根据source添加data
        _ResMemcache.prototype.add = function (source, data) {
            // 根据data的不同计算对应的key
            var key;
            if (data == null) {
                key = "::mc::null";
            }
            else if ('hashCode' in data) {
                key = data.hashCode;
            }
            else if (typeof (data) == 'object') {
                key = data[_ResMemcache.IDR_HASHCODE];
                if (key == null) {
                    key = '::mc::' + this._hashCode++;
                    data[_ResMemcache.IDR_HASHCODE] = key;
                }
            }
            else {
                var rcd = new nn.CacheRecord();
                rcd.val = data;
                return rcd;
            }
            var srcs = this._sources[key];
            if (srcs == null) {
                srcs = [source];
                this._sources[key] = srcs;
            }
            else {
                srcs.push(source);
            }
            this._keys[source] = key;
            // 添加到缓存中
            var obj = new _ResCacheObject();
            obj.key = key;
            obj.data = data;
            return this.cache(obj);
        };
        _ResMemcache.prototype.query = function (source) {
            var key = this._keys[source];
            return _super.prototype.query.call(this, key);
        };
        return _ResMemcache;
    }(nn.Memcache));
    _ResMemcache.IDR_HASHCODE = '::mc::hashCode';
    nn._ResMemcache = _ResMemcache;
    var _ResCacheObject = (function () {
        function _ResCacheObject() {
            this.cacheFlush = true;
            this.cacheUpdated = true;
            this.cacheTime = -1;
        }
        _ResCacheObject.prototype.keyForCache = function () {
            return this.key;
        };
        _ResCacheObject.prototype.valueForCache = function () {
            return this.data;
        };
        return _ResCacheObject;
    }());
    var ResCapsule = (function (_super) {
        __extends(ResCapsule, _super);
        function ResCapsule(reqres, ewd) {
            var _this = _super.call(this, reqres) || this;
            _this._ewd = ewd;
            return _this;
        }
        ResCapsule.prototype.dispose = function () {
            this._ewd = undefined;
            _super.prototype.dispose.call(this);
        };
        ResCapsule.prototype.loadOne = function (rr, cb, ctx) {
            var _this = this;
            var curidx = 0;
            // 判断是加载资源组，还是直接加载资源
            if (rr instanceof nn.ResourceEntity) {
                var re = rr;
                nn.ResManager.getSourceByType(re.source, nn.ResPriority.NORMAL, function (rcd) {
                    if (_this.signals.isConnected(nn.SignalChanged)) {
                        curidx = 1;
                        _this._idx += 1;
                        // 发出消息
                        _this.signals.emit(nn.SignalChanged, new nn.Percentage(_this._total, _this._idx));
                    }
                    cb.call(ctx);
                }, this, re.type);
            }
            else {
                var grp = rr;
                if (RES.isGroupLoaded(grp)) {
                    if (this.signals.isConnected(nn.SignalChanged)) {
                        var len = RES.getGroupByName(grp).length;
                        curidx = len;
                        this._idx += len;
                        this.signals.emit(nn.SignalChanged, new nn.Percentage(this._total, this._idx));
                    }
                    cb.call(ctx);
                }
                else {
                    this._ewd.add("::res::group::" + grp, cb, ctx);
                    if (this.signals.isConnected(nn.SignalChanged)) {
                        this._ewd.add("::res::group::progress::" + grp, function (e) {
                            // 计算进度
                            var delta = e.itemsLoaded - curidx;
                            curidx = e.itemsLoaded;
                            _this._idx += delta;
                            // 发出消息
                            _this.signals.emit(nn.SignalChanged, new nn.Percentage(_this._total, _this._idx));
                        }, this);
                    }
                    RES.loadGroup(grp);
                }
            }
        };
        ResCapsule.prototype.total = function () {
            var r = 0;
            this._reqRes.forEach(function (rr) {
                if (rr instanceof nn.ResourceEntity)
                    r += 1;
                else
                    r += RES.getGroupByName(rr).length;
            });
            return r;
        };
        return ResCapsule;
    }(nn.CResCapsule));
    nn.ResCapsule = ResCapsule;
    var EgretItemTypeMap = {};
    EgretItemTypeMap[nn.ResType.JSON] = RES.ResourceItem.TYPE_JSON;
    EgretItemTypeMap[nn.ResType.TEXTURE] = RES.ResourceItem.TYPE_IMAGE;
    EgretItemTypeMap[nn.ResType.TEXT] = RES.ResourceItem.TYPE_TEXT;
    EgretItemTypeMap[nn.ResType.FONT] = RES.ResourceItem.TYPE_FONT;
    EgretItemTypeMap[nn.ResType.SOUND] = RES.ResourceItem.TYPE_SOUND;
    EgretItemTypeMap[nn.ResType.BINARY] = RES.ResourceItem.TYPE_BIN;
    var _ResManager = (function (_super) {
        __extends(_ResManager, _super);
        function _ResManager() {
            var _this = _super.call(this) || this;
            // 用来转发事件
            _this._ewd = new nn.EventWeakDispatcher();
            // 资源的缓存管理
            _this.cache = new _ResMemcache();
            // 正在加载的资源包
            _this._capsules = new KvObject();
            // config 只在manager中处理，其他事件转到包中处理
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, _this._cfg_loaded, _this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, _this._grp_complete, _this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, _this._grp_failed, _this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, _this._grp_progress, _this);
            // 切换为4线程下载资源
            RES.setMaxLoadingThread(4);
            return _this;
        }
        _ResManager.prototype.loadConfig = function (file, cb, ctx) {
            this._ewd.add("::res::config", cb, ctx);
            // 如过file是绝对地址，则不添加directory
            if (file.indexOf('://') == -1)
                file = this.directory + file;
            RES.loadConfig(file, this.directory);
        };
        Object.defineProperty(_ResManager.prototype, "cacheEnabled", {
            get: function () {
                return this.cache.enable;
            },
            set: function (v) {
                this.cache.enable = v;
            },
            enumerable: true,
            configurable: true
        });
        _ResManager.prototype._cfg_loaded = function (e) {
            var idr = "::res::config";
            this._ewd.invoke(idr, e, false);
            this._ewd.remove(idr);
        };
        _ResManager.prototype._grp_complete = function (e) {
            var idr0 = "::res::group::" + e.groupName;
            var idr1 = "::res::group::progress::" + e.groupName;
            this._ewd.invoke(idr0, e, false);
            this._ewd.remove(idr0);
            this._ewd.remove(idr1);
        };
        _ResManager.prototype._grp_failed = function (e) {
            this._grp_complete(e);
        };
        _ResManager.prototype._grp_progress = function (e) {
            var item = e.resItem;
            // 增加其他数据文件
            if (item.type == RES.ResourceItem.TYPE_BIN) {
                // 增加字体
                if (nn.FontFilePattern.test(item.url)) {
                    nn.FontsManager.add(item.name, item.url);
                }
            }
            var idr = "::res::group::progress::" + e.groupName;
            this._ewd.invoke(idr, e, false);
        };
        _ResManager.prototype.isGroupsArrayLoaded = function (grps) {
            if (grps) {
                for (var i = 0; i < grps.length; ++i) {
                    if (RES.isGroupLoaded(grps[i]) == false)
                        return false;
                }
            }
            return true;
        };
        _ResManager.prototype.capsules = function (grps) {
            var k = ResCapsule.HashKey(grps);
            var cp = this._capsules[k];
            if (cp == null) {
                cp = new ResCapsule(grps, this._ewd);
                this._capsules[k] = cp;
            }
            return cp;
        };
        _ResManager.prototype.removeCapsule = function (cp) {
            var k = cp.hashKey();
            cp.drop();
            delete this._capsules[k];
        };
        _ResManager.prototype.tryGetRes = function (key) {
            var rcd = this.cache.query(key);
            if (rcd == null) {
                var d = RES.getRes(key);
                if (d) {
                    rcd = this.cache.add(key, d);
                }
                else {
                    return new nn.CacheRecord();
                }
            }
            return rcd;
        };
        _ResManager.prototype.getResAsync = function (key, priority, cb, ctx) {
            var _this = this;
            if (nn.length(key) == 0) {
                cb.call(ctx, new nn.CacheRecord());
                return;
            }
            var rcd = this.cache.query(key);
            if (rcd == null) {
                nn.ResCurrentPriority = priority;
                RES.getResAsync(key, function (d) {
                    if (d) {
                        rcd = _this.cache.add(key, d);
                    }
                    else {
                        rcd = new nn.CacheRecord();
                        nn.warn("res " + key + " not found");
                    }
                    cb.call(ctx, rcd);
                }, this);
            }
            else {
                cb.call(ctx, rcd);
            }
        };
        _ResManager.prototype.if = function (DEBUG) {
            if (RES.configInstance == undefined)
                nn.fatal('ResManager 存在兼容问题');
        };
        _ResManager.prototype.getResUrl = function (key) {
            var obj = RES.configInstance.keyMap[key];
            if (obj == null) {
                nn.warn("res " + key + " not found");
                return null;
            }
            return obj.url;
        };
        _ResManager.prototype.getResByUrl = function (src, priority, cb, ctx, type) {
            var _this = this;
            // 如果位于缓存中，则直接返回
            var rcd = this.cache.query(src);
            if (rcd != null) {
                cb.call(ctx, rcd);
                return;
            }
            // 不在缓存中，需要直接获得
            nn.ResCurrentPriority = priority;
            RES.getResByUrl(src, function (d) {
                // 添加到缓存
                rcd = _this.cache.add(src, d);
                // 回调
                cb.call(ctx, rcd);
            }, this, EgretItemTypeMap[type]);
        };
        _ResManager.prototype.hasAsyncUri = function (uri) {
            return this.cache.query(uri) != null;
        };
        _ResManager.prototype.getTexture = function (src, priority, cb, ctx) {
            if (src instanceof nn.COriginType) {
                var t = new nn.CacheRecord();
                t.val = src.imp;
                cb.call(ctx, t);
                return;
            }
            if (src instanceof egret.Texture) {
                var t = new nn.CacheRecord();
                t.val = src;
                cb.call(ctx, t);
                return;
            }
            this.getSourceByType(src, priority, cb, ctx, nn.ResType.TEXTURE);
        };
        _ResManager.prototype.getBitmapFont = function (src, priority, cb, ctx) {
            if (src instanceof nn.COriginType) {
                var t = new nn.CacheRecord();
                t.val = src.imp;
                cb.call(ctx, t);
                return;
            }
            if (src instanceof egret.BitmapFont) {
                var t = new nn.CacheRecord();
                t.val = src;
                cb.call(ctx, t);
                return;
            }
            // 通过配置来获得
            if (src instanceof nn.FontConfig) {
                var cfg = src;
                if (cfg.name) {
                    this.getSourceByType(cfg.name, priority, cb, ctx, nn.ResType.FONT);
                }
                else {
                    // 通过两个配置文件来获得
                    this.getSources([[cfg.texture, nn.ResType.TEXTURE],
                        [cfg.config, nn.ResType.JSON]], priority, function (ds) {
                        var tex = ds[0];
                        var cfg = ds[1];
                        // todo 现在为简化font缓存处理(直接调用use逻辑避免tex和cfg被释放)
                        var t = new nn.CacheRecord();
                        t.val = new egret.BitmapFont(tex.use(), cfg.use());
                        cb.call(ctx, t);
                    }, this);
                }
                return;
            }
            // 通过key来获得
            this.getSourceByType(src, priority, cb, ctx, nn.ResType.FONT);
        };
        _ResManager.prototype.getSound = function (src, priority, cb, ctx) {
            if (src instanceof nn.COriginType) {
                var t = new nn.CacheRecord();
                t.val = src.imp;
                cb.call(ctx, t);
                return;
            }
            if (src instanceof egret.Sound) {
                var t = new nn.CacheRecord();
                t.val = src;
                cb.call(ctx, t);
                return;
            }
            this.getSourceByType(src, priority, cb, ctx, nn.ResType.SOUND);
        };
        return _ResManager;
    }(nn.CResManager));
    nn._ResManager = _ResManager;
    nn.ResManager = new _ResManager();
})(nn || (nn = {}));
var nn;
(function (nn) {
    var _CrossLoader = (function () {
        function _CrossLoader() {
        }
        _CrossLoader.process = function (m) {
            _CrossLoader.completeCall["call_" + _CrossLoader._regID] = function (data) {
                var id = _CrossLoader._regID;
                m.__mdl_completed(data);
                delete _CrossLoader.completeCall["call_" + id];
            };
            _CrossLoader.start(m, _CrossLoader._regID++);
        };
        _CrossLoader.start = function (m, id) {
            var script = document.createElement('script');
            m.modelcallback = "nn._CrossLoader.completeCall.call_" + id + "";
            script.src = m.url();
            document.body.appendChild(script);
        };
        return _CrossLoader;
    }());
    _CrossLoader._regID = 0;
    _CrossLoader.completeCall = {};
    nn._CrossLoader = _CrossLoader;
    var _RestSession = (function (_super) {
        __extends(_RestSession, _super);
        function _RestSession() {
            return _super.apply(this, arguments) || this;
        }
        _RestSession.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalStart);
            this._signals.register(nn.SignalSucceed);
            this._signals.register(nn.SignalFailed);
            this._signals.register(nn.SignalEnd);
            this._signals.register(nn.SignalTimeout);
        };
        _RestSession.prototype.post = function (m, cb, cbctx) {
            m.showWaiting = false;
            m.showError = false;
            this.fetch(m, cb, cbctx);
        };
        /** 获取一个数据
            @param cb, 成功后的回调
            @param cbfail, 失败后的回调
            @param cbend, 结束的回调（不区分成功、失败）
        */
        _RestSession.prototype.fetch = function (m, cbsuc, cbctx, cbfail, cbend) {
            m.ts = nn.DateTime.Now();
            // 为了防止正在调用 api 时，接受信号的对象析构，保护一下
            if (cbctx)
                m.attach(cbctx);
            if (cbsuc)
                m.signals.connect(nn.SignalSucceed, cbsuc, cbctx);
            if (cbfail)
                m.signals.connect(nn.SignalFailed, cbfail, cbctx);
            if (cbend)
                m.signals.connect(nn.SignalEnd, cbend, cbctx);
            // 判断是否支持缓存
            if (m.cacheTime && !m.cacheFlush) {
                // 先去查找一下原来的数据
                var respn = nn.Memcache.shared.query(m.keyForCache());
                if (respn) {
                    if (nn.VERBOSE)
                        nn.log("成功获取到缓存数据");
                    // 手动激活一下请求开始
                    m.__mdl_start();
                    // 存在可用的缓存，则直接 parse
                    m.response = respn;
                    m.processResponse();
                    // 处理结束
                    m.__mdl_end();
                    return;
                }
            }
            // 如果不支持缓存，则为了兼容获取时对数据新旧的判断，设置为强刷
            m.cacheFlush = true;
            // 初始化网络
            m._urlreq = new nn.HttpConnector();
            if (m.withCredentials)
                m._urlreq.useCredentials();
            m._urlreq.signals.connect(nn.SignalDone, m.__mdl_completed, m);
            m._urlreq.signals.connect(nn.SignalFailed, m.__mdl_failed, m);
            m.__mdl_start();
            if (m.iscross()) {
                _CrossLoader.process(m);
            }
            else {
                var url = m.url();
                if (url.indexOf('?') == -1)
                    url += '?';
                else
                    url += '&';
                // _ts_ 时间戳用来防止浏览器缓存API调用
                url += '_ts_=' + m.ts;
                // 增加sessionid以解决cookie不稳定导致的问题
                if (this.SID)
                    url += '&_sid=' + this.SID;
                m._urlreq.url = url;
                m._urlreq.method = m.method;
                m._urlreq.fields = m.fields();
                m._urlreq.start();
            }
        };
        /** 批量调用一堆接口，返回和调用的顺序保持一致 */
        _RestSession.prototype.fetchs = function (ms, cbsuc, cbctx) {
            var _this = this;
            var ss = [];
            var work = function (ms, idx) {
                if (idx == ms.length) {
                    cbsuc.call(cbctx, ss);
                    return;
                }
                _this.fetch(ms[idx++], function (s) {
                    ss.push(s);
                    // 下一个
                    work(ms, idx);
                }, null);
            };
            work(ms, 0);
        };
        return _RestSession;
    }(nn.SObject));
    // 请求API的序列号
    _RestSession.__sequenceId = 0;
    nn.RestSession = new _RestSession();
    /** 基本的通过URL来访问数据的模型对象 */
    var UrlModel = (function (_super) {
        __extends(UrlModel, _super);
        function UrlModel() {
            return _super.apply(this, arguments) || this;
        }
        UrlModel.prototype.url = function () {
            if (this.useproxy()) {
                var ret = 'http://gameapi.wyb.u1.hgame.com/web/index.php?r=redirect/redirect';
                var p = {};
                p['url'] = this.request;
                p['method'] = this.method == nn.HttpMethod.POST ? 'post' : 'get';
                p['uid'] = nn.CApplication.shared.uniqueId;
                ret += '&data=';
                ret += nn.URL.encode(JSON.stringify(p));
                return ret;
            }
            return this.request;
        };
        UrlModel.prototype.urlForLog = function () {
            return this.request;
        };
        return UrlModel;
    }(nn.Model));
    nn.UrlModel = UrlModel;
})(nn || (nn = {}));
var nn;
(function (nn) {
    /** 用来管理所有自动生成的位于 resource/assets/~tsc/ 中的数据 */
    var _DatasManager = (function (_super) {
        __extends(_DatasManager, _super);
        function _DatasManager() {
            return _super.call(this) || this;
        }
        // 读取所有数据，由application自动调用
        _DatasManager.prototype._load = function () {
        };
        return _DatasManager;
    }(nn.SObject));
    nn._DatasManager = _DatasManager;
    nn.DatasManager = new _DatasManager();
})(nn || (nn = {}));
var nn;
(function (nn) {
    var ServiceMock = (function (_super) {
        __extends(ServiceMock, _super);
        function ServiceMock() {
            var _this = _super.call(this) || this;
            _this._oldmessages = new Array();
            return _this;
        }
        ServiceMock.Prepare = function (cb, ctx) {
            cb.call(ctx);
        };
        ServiceMock.prototype.support = function (feature) {
            return true;
        };
        ServiceMock.prototype.pay = function (c) {
            var err = new nn.Failed(-1, "模拟的服务不支持购买\n请通过平台入口运行游戏");
            nn.Hud.Text(err.message);
            c.signals.emit(nn.SignalFailed, err);
            c.dispose();
        };
        ServiceMock.prototype.payable = function (price) {
            return true;
        };
        ServiceMock.prototype.share = function (c) {
            c.signals.emit(nn.SignalSucceed);
            c.dispose();
        };
        ServiceMock.prototype.profile = function (c) {
            c.avatar = "";
            c.islogin = true;
            c.nickname = "::mock::";
            c.signals.emit(nn.SignalSucceed);
            c.dispose();
        };
        ServiceMock.prototype.status = function (c) {
            c.appmode = false;
            c.phone = false;
            c.subscribe = false;
            c.monetaryName = "元";
            c.monetaryRate = 1;
            c.monetaryDiscount = null;
            c.signals.emit(nn.SignalSucceed);
            c.dispose();
        };
        ServiceMock.prototype.auth = function (c) {
            var fs = nn.CApplication.shared.url.fields;
            var oid = fs['openid'];
            if (oid == null)
                oid = nn.CApplication.shared.uniqueId;
            c.pid = oid;
            c.app = "";
            c.platform = nn.svc.Platform.MOCK;
            c.channel = 0;
            c.signals.emit(nn.SignalSucceed);
            c.dispose();
        };
        ServiceMock.prototype.login = function (c) {
            c.signals.emit(nn.SignalSucceed);
            c.dispose();
        };
        ServiceMock.prototype.switchuser = function (c) {
            var err = new nn.Failed(-1, "模拟的服务不支持切换用户\n请通过平台入口运行游戏");
            nn.Hud.Text(err.message);
            c.signals.emit(nn.SignalFailed, err);
            c.dispose();
        };
        ServiceMock.prototype.logout = function (c) {
            location.reload();
        };
        ServiceMock.prototype.loading = function (c) {
            c.signals.emit(nn.SignalSucceed);
            c.dispose();
        };
        ServiceMock.prototype.bind = function (c) {
            var err = new nn.Failed(-1, "模拟的服务不支持绑定\n请通过平台入口运行游戏");
            nn.Hud.Text(err.message);
            c.signals.emit(nn.SignalFailed, err);
            c.dispose();
        };
        ServiceMock.prototype.subscribe = function (c) {
            var err = new nn.Failed(-1, "模拟的服务不支持关注\n请通过平台入口运行游戏");
            nn.Hud.Text(err.message);
            c.signals.emit(nn.SignalFailed, err);
            c.dispose();
        };
        ServiceMock.prototype.bbs = function (c) {
            var err = new nn.Failed(-1, "模拟的服务不支持论坛\n请通过平台入口运行游戏");
            nn.Hud.Text(err.message);
            c.signals.emit(nn.SignalFailed, err);
            c.dispose();
        };
        ServiceMock.prototype.report = function (c) {
            c.signals.emit(nn.SignalSucceed);
            c.dispose();
        };
        ServiceMock.prototype.getapp = function (c) {
            var err = new nn.Failed(-1, "模拟的服务不支持微端\n请通过平台入口运行游戏");
            nn.Hud.Text(err.message);
            c.signals.emit(nn.SignalFailed, err);
            c.dispose();
        };
        ServiceMock.prototype.sendtodesktop = function (c) {
            var err = new nn.Failed(-1, "模拟的服务不支持桌面\n请通过平台入口运行游戏");
            nn.Hud.Text(err.message);
            c.signals.emit(nn.SignalFailed, err);
            c.dispose();
        };
        ServiceMock.prototype.lanzuan = function (c) {
            var err = new nn.Failed(-1, "模拟的服务不支持蓝钻开通");
            nn.Hud.Text(err.message);
            c.signals.emit(nn.SignalFailed, err);
            c.dispose();
        };
        ServiceMock.prototype.lanzuanxufei = function (c) {
            var err = new nn.Failed(-1, "模拟的服务不支持蓝钻续费开通");
            nn.Hud.Text(err.message);
            c.signals.emit(nn.SignalFailed, err);
            c.dispose();
        };
        ServiceMock.prototype.customer = function (c) {
            if (c instanceof nn.svc.SendCustomerContent) {
                var cnt = c;
                c.signals.emit(nn.SignalSucceed);
                c.dispose();
                var msg = new nn.svc.Message();
                msg.id = this._oldmessages.length;
                msg.message = cnt.message;
                msg.senderName = '我';
                this._oldmessages.push(msg);
                this.signals.emit(nn.svc.SignalMessagesGot, this._oldmessages);
            }
            else {
                if (c.all)
                    this.signals.emit(nn.svc.SignalMessagesGot, this._oldmessages);
                c.signals.emit(nn.SignalSucceed);
                c.dispose();
            }
        };
        ServiceMock.IsCurrent = function () {
            return false;
        };
        return ServiceMock;
    }(nn.svc.Service));
    nn.ServiceMock = ServiceMock;
    // 不注册模拟服务
    //ServicesManager.register(ServiceMock);
    var MockServices = (function (_super) {
        __extends(MockServices, _super);
        function MockServices() {
            return _super.apply(this, arguments) || this;
        }
        MockServices.prototype.detectService = function () {
            return ServiceMock;
        };
        return MockServices;
    }(nn.ServicesManager));
    nn.MockServices = MockServices;
})(nn || (nn = {}));
// 唯一的小伙伴对象
var hGameHdl;
var nn;
(function (nn) {
    // 小伙伴游戏中心
    // 老家: http://open.hgame.com
    // 文档: http://open.hgame.com/doc/index
    var ServiceXHB = (function (_super) {
        __extends(ServiceXHB, _super);
        function ServiceXHB() {
            var _this = _super.call(this) || this;
            _this._maxmessages = 100;
            _this._oldmessages = new Array();
            return _this;
        }
        ServiceXHB.Prepare = function (cb, ctx) {
            var _this = this;
            // 如果在其他地方已经初始化，则直接返回
            if (hGameHdl) {
                cb.call(ctx);
                return;
            }
            // 使用n2build直接添加sdk的引用到index.html中
            try {
                var xhb_1 = new hGame({ 'game_key': this.GameKey,
                    'debug': nn.ISDEBUG });
                var queue = new nn.OperationQueue();
                // 初始化
                queue.add(new nn.OperationClosure(function (oper) {
                    xhb_1.ready(function () {
                        hGameHdl = xhb_1;
                        oper.done();
                    });
                }));
                // 获得当前的平台信息
                queue.add(new nn.OperationClosure(function (oper) {
                    hGameHdl.getPlatform(function (result) {
                        var d = result.data;
                        _this.PLATFORM = d.platform.toUpperCase();
                        switch (_this.PLATFORM) {
                            case 'wybosys':
                            case 'HGAME':
                                _this.PLATFORMID = nn.svc.Platform.XHB;
                                break;
                            case 'WANBA':
                                _this.PLATFORMID = nn.svc.Platform.WANBA;
                                break;
                            case 'QQGAME':
                                _this.PLATFORMID = nn.svc.Platform.QQGAME;
                                break;
                            case 'QQBROWSER':
                                _this.PLATFORMID = nn.svc.Platform.QQBROWSER;
                                break;
                            case 'X360':
                                _this.PLATFORMID = nn.svc.Platform.X360;
                                break;
                            case 'X360ZS':
                                _this.PLATFORMID = nn.svc.Platform.X360ZS;
                                break;
                        }
                        if ('payUnit' in d)
                            _this.PAYUNIT = d.payUnit;
                        if ('payRate' in d)
                            _this.PAYRATE = d.payRate;
                        oper.done();
                    });
                }));
                // 回调
                queue.add(new nn.OperationClosure(function (oper) {
                    cb.call(ctx);
                }));
            }
            catch (err) {
                nn.exception(err);
                hGameHdl = null;
                cb.call(ctx);
            }
        };
        ServiceXHB.prototype._doResult = function (result, c, suc, failed) {
            if (result.code == 0) {
                suc(result.data);
                c.signals.emit(nn.SignalSucceed);
            }
            else {
                var err = new nn.Failed(result.code, result.message, result.showMessage);
                if (failed)
                    failed(err);
                c.signals.emit(nn.SignalFailed, err);
            }
            c.dispose();
        };
        ServiceXHB.prototype.support = function (feature) {
            var sup;
            switch (feature) {
                case nn.svc.Feature.PAY:
                case nn.svc.Feature.PROFILE:
                case nn.svc.Feature.AUTH:
                case nn.svc.Feature.LOGIN:
                case nn.svc.Feature.LOGOUT:
                case nn.svc.Feature.CUSTOMER:
                case nn.svc.Feature.REPORT:
                    {
                        sup = true;
                    }
                    break;
                case nn.svc.Feature.LANZUAN:
                    {
                        sup = true;
                    }
                    break;
                case nn.svc.Feature.SHARE:
                    {
                        sup = 'share' in this._dataStatus;
                        if (sup) {
                            // 如果是0，代表分享次数使用完，则不能分享
                            var count = nn.ObjectT.GetValueByKeyPath(this._dataStatus, 'share.status', 1);
                            sup = count > 0;
                        }
                    }
                    break;
                case nn.svc.Feature.GETAPP:
                    {
                        sup = 'client' in this._dataStatus;
                    }
                    break;
                case nn.svc.Feature.DESKTOP:
                    {
                        sup = 'toDesktop' in this._dataStatus;
                    }
                    break;
                case nn.svc.Feature.BBS:
                    {
                        sup = 'bbs' in this._dataStatus;
                    }
                    break;
                case nn.svc.Feature.SUBSCRIBE:
                    {
                        sup = 'subscribe' in this._dataStatus;
                    }
                    break;
                case nn.svc.Feature.BIND:
                    {
                        sup = 'bindPhone' in this._dataStatus;
                    }
                    break;
                case nn.svc.Feature.SWITCHUSER:
                    {
                        hGameHdl.changeAccount({ open_id: this._pid, action: 'query' }, function (result) {
                            sup = result.code == 0;
                        });
                    }
                    break;
                default:
                    {
                        sup = false;
                    }
                    break;
            }
            return sup;
        };
        ServiceXHB.prototype.pay = function (c) {
            var _this = this;
            hGameHdl.pay(nn.toJsonObject(c.data), null, function (result) {
                _this._doResult(result, c, function (data) {
                }, function (err) {
                    nn.Hud.Text(err.locationMessage);
                });
            });
        };
        ServiceXHB.prototype.payable = function (price) {
            // QQ浏览器iOS渠道限制金额要小于388
            if (nn.Device.shared.isIOS &&
                ServiceXHB.PLATFORMID == nn.svc.Platform.QQBROWSER)
                return price < 388;
            return true;
        };
        ServiceXHB.prototype.share = function (c) {
            var _this = this;
            var data;
            if (c.data) {
                data = nn.toJsonObject(c.data);
            }
            else {
                data = {
                    open_id: this._pid,
                    title: c.title,
                    message: c.detail,
                    imgUrl: c.image,
                    url: c.url,
                    extend: {}
                };
            }
            hGameHdl.doExtraAction('share', data, function (result) {
                _this._doResult(result, c, function (data) {
                    _this._setStatus('share.status', 0);
                });
            });
        };
        ServiceXHB.prototype.profile = function (c) {
            var _this = this;
            hGameHdl.getUserInfo(function (result) {
                _this._doResult(result, c, function (data) {
                    c.avatar = data.avatar;
                    c.islogin = data.is_guest != 1;
                    c.nickname = data.nickname;
                });
            });
        };
        ServiceXHB.prototype.status = function (c) {
            c.appmode = nn.ObjectT.GetValueByKeyPath(this._dataStatus, 'client.status') == 1;
            c.phone = nn.ObjectT.GetValueByKeyPath(this._dataStatus, 'bindPhone.status') == 1;
            c.subscribe = nn.ObjectT.GetValueByKeyPath(this._dataStatus, 'subscribe.status') == 1;
            c.monetaryName = ServiceXHB.PAYUNIT;
            c.monetaryRate = ServiceXHB.PAYRATE;
            if (ServiceXHB.PLATFORMID == nn.svc.Platform.WANBA)
                c.monetaryDiscount = 1;
            else
                c.monetaryDiscount = null;
            c.signals.emit(nn.SignalSucceed);
            c.dispose();
        };
        ServiceXHB.prototype.auth = function (c) {
            var fs = nn.CApplication.shared.url.fields;
            if (ServiceXHB.IsCurrent()) {
                c.pid = '';
                c.type = nn.toInt(fs["login_type"]);
                c.ticket = fs["ticket"];
                c.timestamp = fs["timestamp"];
                c.nonce = fs["nonce"];
                c.signature = fs["signature"];
            }
            else {
                var oid = fs['openid'];
                if (oid == null)
                    oid = nn.CApplication.shared.uniqueId;
                c.pid = oid;
            }
            // 设置一下通用对话框
            if (c.alert) {
                hGameHdl.setGameFunc('alert', function (title, msg, callback) {
                    c.alert({ msg: msg,
                        title: title,
                        done: function () {
                            callback();
                        } });
                });
            }
            if (c.confirm) {
                hGameHdl.setGameFunc('confirm', function (title, msg, fnYes, fnNo) {
                    c.confirm({ msg: msg,
                        title: title,
                        done: function () {
                            fnYes();
                        },
                        cancel: function () {
                            fnNo();
                        } });
                });
            }
            if (c.prompt) {
                hGameHdl.setGameFunc('prompt', function (title, defaultTxt, fnYes, fnNo) {
                    c.prompt({ msg: defaultTxt,
                        title: title,
                        done: function (val) {
                            fnYes(val);
                        },
                        cancel: function () {
                            fnNo();
                        } });
                });
            }
            c.app = ServiceXHB.GameKey;
            c.platform = ServiceXHB.PLATFORMID;
            c.channel = 0;
            c.signals.emit(nn.SignalSucceed);
            c.dispose();
        };
        ServiceXHB.prototype.login = function (c) {
            var _this = this;
            // 保存，用来避免调用其他借口时还需要传参数
            this._pid = nn.asString(c.pid);
            if (c.maxCustomerMessages)
                this._maxmessages = c.maxCustomerMessages;
            // 获得到当前平台的状态
            hGameHdl.queryExtraStatus({ openId: this._pid }, function (result) {
                // 保存下来状态
                _this._dataStatus = result;
                c.signals.emit(nn.SignalSucceed);
                c.dispose();
            });
        };
        ServiceXHB.prototype.switchuser = function (c) {
            var _this = this;
            hGameHdl.changeAccount({ open_id: this._pid, action: 'do' }, function (result) {
                _this._doResult(result, c, function (data) {
                });
            });
        };
        ServiceXHB.prototype.logout = function (c) {
            hGameHdl.logout();
        };
        ServiceXHB.prototype.loading = function (c) {
            hGameHdl.loadingProgress(nn.toInt(c.current / c.total * 100));
            c.signals.emit(nn.SignalSucceed);
            c.dispose();
        };
        ServiceXHB.prototype._setStatus = function (key, v) {
            var old = nn.ObjectT.GetValueByKeyPath(this._dataStatus, key);
            if (old == v)
                return;
            nn.ObjectT.SetValueByKeyPath(this._dataStatus, key, v);
            this.signals.cast(nn.svc.SignalStatusChanged);
        };
        ServiceXHB.prototype.bind = function (c) {
            var _this = this;
            var data;
            if (c.data) {
                data = nn.toJsonObject(c.data);
            }
            else {
                data = { open_id: this._pid, autoRedirect: true };
            }
            hGameHdl.doExtraAction("bindPhone", data, function (result) {
                _this._doResult(result, c, function (data) {
                    c.phone = true;
                    _this._setStatus('bindPhone.status', 1);
                });
            });
        };
        ServiceXHB.prototype.subscribe = function (c) {
            var _this = this;
            var data;
            if (c.data) {
                data = nn.toJsonObject(c.data);
            }
            else {
                data = { open_id: this._pid, autoRedirect: true };
            }
            hGameHdl.doExtraAction("subscribe", data, function (result) {
                _this._doResult(result, c, function (data) {
                    c.subscribe = true;
                    _this._setStatus('subscribe.status', 1);
                });
            });
        };
        ServiceXHB.prototype.bbs = function (c) {
            var _this = this;
            var data;
            if (c.data) {
                data = nn.toJsonObject(c.data);
            }
            else {
                data = { open_id: this._pid };
            }
            hGameHdl.doExtraAction("bbs", data, function (result) {
                _this._doResult(result, c, function (data) {
                });
            });
        };
        ServiceXHB.prototype.report = function (c) {
            var baseData = {
                'game_key': ServiceXHB.GameKey,
                'open_id': this._pid,
                'role': nn.asString(c.roleId),
                'nickname': c.nickname,
                'area': nn.asString(c.region),
                'group': nn.asString(c.server)
            };
            var extendData = {
                'level': c.level,
                'vipLevel': nn.asString(c.viplevel),
                'score': nn.toInt(c.score),
                'isNew': c.newuser ? 1 : 0,
                'progress': nn.asString(c.progress)
            };
            var type;
            switch (c.type) {
                case nn.svc.ReportType.LOGIN:
                    type = 'enterGame';
                    break;
                case nn.svc.ReportType.ROLE:
                    type = 'createRole';
                    break;
                case nn.svc.ReportType.UPGRADE:
                    type = 'levelUpgrade';
                    break;
                case nn.svc.ReportType.PROGRESS:
                    type = 'processReport';
                    break;
                case nn.svc.ReportType.SCORE:
                    type = 'scoreReport';
                    break;
            }
            hGameHdl.gameReport(type, baseData, extendData, function (data) {
                nn.log('汇报数据 ' + type);
                if (data && data.code == 0) {
                    c.signals.emit(nn.SignalSucceed);
                }
                else {
                    nn.dump(baseData);
                    nn.dump(extendData);
                    nn.dump(data);
                    c.signals.emit(nn.SignalFailed);
                }
                c.dispose();
            });
        };
        ServiceXHB.prototype.getapp = function (c) {
            var _this = this;
            var data;
            if (c.data) {
                data = nn.toJsonObject(c.data);
            }
            else {
                data = { open_id: this._pid };
            }
            hGameHdl.doExtraAction("client", data, function (result) {
                _this._doResult(result, c, function (data) {
                });
            });
        };
        ServiceXHB.prototype.sendtodesktop = function (c) {
            var data;
            if (c.data) {
                data = nn.toJsonObject(c.data);
            }
            else {
                data = { open_id: this._pid };
            }
            hGameHdl.doExtraAction("toDesktop", data, function (result) {
                c.signals.emit(nn.SignalSucceed);
                c.dispose();
            });
        };
        ServiceXHB.prototype.lanzuan = function (c) {
            hGameHdl.callPsdk("NewOpenGameVIPService", [3, null, function (result) {
                    c.signals.emit(nn.SignalSucceed);
                    c.dispose();
                }]);
        };
        ServiceXHB.prototype.lanzuanxufei = function (c) {
            hGameHdl.callPsdk("NewGameVIPAction", [ServiceXHB.QQAPPID, function (result) {
                    c.signals.emit(nn.SignalSucceed);
                    c.dispose();
                }, null, null, null, null, ServiceXHB.GameKey, c.notifyUrl]);
        };
        ServiceXHB.prototype.customer = function (c) {
            var _this = this;
            if (this._customer_running) {
                if (c instanceof nn.svc.SendCustomerContent) {
                    var cnt = c;
                    var data = void 0;
                    if (cnt.data) {
                        data = nn.toJsonObject(cnt.data);
                    }
                    else {
                        data = {
                            content: cnt.message,
                            level: cnt.level,
                            vipLevel: cnt.viplevel
                        };
                    }
                    hGameHdl.customerServicePost(data);
                    c.signals.emit(nn.SignalSucceed);
                }
                else {
                    if (c.all)
                        this.signals.emit(nn.svc.SignalMessagesGot, this._oldmessages);
                    c.signals.emit(nn.SignalSucceed);
                }
                c.dispose();
                return;
            }
            this._customer_running = true;
            hGameHdl.customerServiceStart(nn.toJsonObject(c.data), function (chats) {
                chats.forEach(function (e) {
                    var msg = new nn.svc.Message();
                    msg.id = e.id;
                    msg.message = e.content;
                    msg.senderName = e.nickname;
                    _this._oldmessages.push(msg);
                });
                if (_this._oldmessages.length > _this._maxmessages)
                    _this._oldmessages = nn.ArrayT.RangeOf(_this._oldmessages, -_this._maxmessages);
                _this.signals.emit(nn.svc.SignalMessagesGot, _this._oldmessages);
            }, function (suc) {
                if (suc)
                    c.signals.emit(nn.SignalSucceed);
                else
                    c.signals.emit(nn.SignalFailed);
                c.dispose();
            });
        };
        ServiceXHB.IsCurrent = function () {
            var fs = new nn.URL(Js.siteUrl).fields;
            return 'game_key' in fs &&
                'timestamp' in fs &&
                'nonce' in fs &&
                'login_type' in fs &&
                'ticket' in fs &&
                'game_url' in fs &&
                'signature' in fs;
        };
        return ServiceXHB;
    }(nn.svc.Service));
    ServiceXHB.ID = "::wybosys::xiaohuoban";
    ServiceXHB.DESCRIPTION = { NAME: '小伙伴平台', CONTACT: '客服QQ:800098876' };
    // 当前的渠道
    ServiceXHB.PLATFORM = "wybosys";
    // 价格信息
    ServiceXHB.PAYUNIT = '元';
    ServiceXHB.PAYRATE = 1;
    nn.ServiceXHB = ServiceXHB;
    nn.ServicesManager.register(ServiceXHB);
    var XHBServices = (function (_super) {
        __extends(XHBServices, _super);
        function XHBServices() {
            return _super.apply(this, arguments) || this;
        }
        XHBServices.prototype.detectService = function () {
            if (ServiceXHB.IsCurrent())
                return ServiceXHB;
            if (nn.ISDEBUG)
                return nn.ServiceMock;
            return ServiceXHB;
        };
        return XHBServices;
    }(nn.ServicesManager));
    nn.XHBServices = XHBServices;
    // 小伙伴平台有时会去修改location.href但是会提供一个fullGameUrl解决之后获取location错误的问题
    Js.siteUrl = hGame.fullGameUrl;
})(nn || (nn = {}));
var nn;
(function (nn) {
    nn.FontFilePattern = /\.(ttf|otf|woff)$/i;
    nn.FontKeyPattern = /(.+)_(?:ttf|otf|woff)$/i;
    var _FontsManager = (function () {
        function _FontsManager() {
            this._fonts = new KvObject();
            this._dfonts = new KvObject();
        }
        _FontsManager.prototype.add = function (name, url) {
            this._fonts[name] = url;
            this._doAddH5Font(name, url);
        };
        _FontsManager.prototype._doAddH5Font = function (name, url) {
            var res = name.match(nn.FontKeyPattern);
            if (nn.length(res) != 2)
                return;
            var family = res[1];
            // 解析字体信息，插入 CSS3
            var h = "@font-face { font-family:'" + family + "'; src:url(" + url + '); }';
            var n = document.createElement('style');
            n.innerHTML = h;
            var p = document.getElementsByTagName('head')[0];
            p.appendChild(n);
        };
        // 计算出默认的字体组合
        _FontsManager.prototype.font = function (name) {
            var fnd = this._dfonts[name];
            if (fnd)
                return fnd;
            if (name == "黑体") {
                if (nn.Device.shared.isIOS || nn.Device.shared.isMac) {
                    fnd = "PingFangSC-Regular";
                }
                else if (nn.Device.shared.isWin) {
                    fnd = "微软雅黑";
                }
                else {
                    fnd = "黑体";
                }
            }
            else if (name == "宋体") {
                if (nn.Device.shared.isIOS || nn.Device.shared.isMac) {
                    fnd = "SimSun";
                }
                else {
                    fnd = "宋体";
                }
            }
            else {
                fnd = name;
            }
            this._dfonts[name] = fnd;
            return fnd;
        };
        return _FontsManager;
    }());
    nn._FontsManager = _FontsManager;
    nn.FontsManager = new _FontsManager();
    var WebUriCheckPattern = /^[\w]+:\/\/.+$/i;
    // 支持普通字体和bitmapfont字体
    var FontConfig = (function () {
        function FontConfig() {
        }
        FontConfig.Font = function (family) {
            var r = new FontConfig();
            r.family = family;
            return r;
        };
        FontConfig.Bitmap = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            var cfg = new FontConfig();
            if (p.length == 1) {
                var s = p[0];
                if (s.indexOf("_fnt") == -1)
                    cfg.name = s + "_fnt";
                else
                    cfg.name = s;
            }
            else {
                var t = p[0];
                var c = p[1];
                if (t.search(WebUriCheckPattern) != -1)
                    cfg.texture = t;
                else if (t.indexOf("_png") == -1)
                    cfg.texture = t + "_png";
                if (c.search(WebUriCheckPattern) != -1)
                    cfg.config = c;
                else if (c.indexOf("_fnt") != -1)
                    cfg.config = t + "_fnt";
            }
            return cfg;
        };
        return FontConfig;
    }());
    nn.FontConfig = FontConfig;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var SocketModel = (function (_super) {
        __extends(SocketModel, _super);
        function SocketModel() {
            var _this = _super.call(this) || this;
            /** 参数 */
            _this.params = new KvObject();
            return _this;
        }
        SocketModel.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalStart);
            this._signals.register(nn.SignalEnd);
            this._signals.register(nn.SignalSucceed);
            this._signals.register(nn.SignalFailed);
            this._signals.register(nn.SignalTimeout);
        };
        SocketModel.prototype.fields = function () {
            return this.params;
        };
        /** 反解析 */
        SocketModel.prototype.unserialize = function (rsp) {
            if (this.data) {
                // 反解析数据到data对象
                this.data.unserialize(rsp);
            }
            return true;
        };
        // 开始拉数据
        SocketModel.prototype.__mdl_start = function () {
            if (this.showWaiting)
                nn.Hud.ShowProgress();
            this.signals.emit(nn.SignalStart);
        };
        // 获取数据成功
        SocketModel.prototype.__mdl_completed = function (rsp) {
            this.unserialize(rsp);
            this.signals.emit(nn.SignalSucceed);
            this.__mdl_end();
        };
        // 获取数据失败
        SocketModel.prototype.__mdl_failed = function () {
            this.signals.emit(nn.SignalFailed);
            this.__mdl_end();
        };
        // 处理结束
        SocketModel.prototype.__mdl_end = function () {
            this.signals.emit(nn.SignalEnd);
            if (this.showWaiting)
                nn.Hud.HideProgress();
            // 调用完成，析构对象
            this.drop();
        };
        return SocketModel;
    }(nn.SObject));
    nn.SocketModel = SocketModel;
    var ProtoBufHeader = (function () {
        function ProtoBufHeader() {
        }
        ProtoBufHeader.prototype.toString = function () {
            return 'header: ' + this.cmd + ' ' + this.seqid + ' ' + this.code;
        };
        return ProtoBufHeader;
    }());
    var ProtoBufImpl = (function () {
        function ProtoBufImpl() {
            this._tpls = new KvObject();
            this._cfgs = new KvObject();
        }
        ProtoBufImpl.prototype.classForModel = function (cfg, name) {
            var key = cfg + ':/:' + name;
            if (this._tpls[key])
                return this._tpls[key];
            var mdls = this._cfgs[cfg];
            if (mdls == null) {
                var proto = nn.ResManager.getText(cfg + '_dsl', nn.ResPriority.NORMAL, null, null);
                if (proto == null) {
                    nn.warn('dsl ' + cfg + ' not found');
                    return null;
                }
                /// mdls = dcodeIO.ProtoBuf.loadProto(proto);
                this._cfgs[cfg] = mdls;
            }
            var cls = mdls.build(name);
            if (cls == null)
                nn.warn('没有找到数据模型 ' + name);
            this._tpls[key] = cls;
            return cls;
        };
        return ProtoBufImpl;
    }());
    var WebSocketConnector = (function (_super) {
        __extends(WebSocketConnector, _super);
        function WebSocketConnector() {
            return _super.apply(this, arguments) || this;
        }
        WebSocketConnector.prototype.open = function () {
            var _this = this;
            if (this._hdl)
                return;
            this._hdl = new WebSocket(this.host);
            this._hdl.binaryType = "arraybuffer";
            this._hdl.onopen = function () {
                _this.signals.emit(nn.SignalOpen);
            };
            this._hdl.onclose = function () {
                _this._hdl = null;
                _this.signals.emit(nn.SignalClose);
            };
            this._hdl.onmessage = function (e) {
                _this.signals.emit(nn.SignalDataChanged, e.data);
            };
            this._hdl.onerror = function (e) {
                _this._hdl = null;
                _this.signals.emit(nn.SignalFailed);
            };
        };
        WebSocketConnector.prototype.close = function () {
            if (this._hdl == null)
                return;
            this._hdl.close();
            this._hdl == null;
        };
        WebSocketConnector.prototype.isopened = function () {
            return this._hdl != null;
        };
        WebSocketConnector.prototype.write = function (d) {
            this._hdl.send(d);
        };
        return WebSocketConnector;
    }(nn.CSocketConnector));
    nn.WebSocketConnector = WebSocketConnector;
    var _SocketSession = (function (_super) {
        __extends(_SocketSession, _super);
        function _SocketSession() {
            var _this = _super.call(this) || this;
            // 当前发送的序号
            _this._seqId = 0;
            // Req&Response模型对照表, seq => model
            _this._seqMdls = new KvObject();
            // Notify模型对照表, type => [model]
            _this._ntfMdls = new KvObject();
            _this._pb = new ProtoBufImpl();
            return _this;
        }
        _SocketSession.prototype._initSignals = function () {
            _super.prototype._initSignals.call(this);
            this._signals.register(nn.SignalOpen);
            this._signals.register(nn.SignalClose);
            this._signals.register(nn.SignalTimeout);
        };
        Object.defineProperty(_SocketSession.prototype, "connector", {
            get: function () {
                return this._connector;
            },
            set: function (cnt) {
                if (this._connector == cnt)
                    return;
                if (this._connector)
                    nn.drop(this._connector);
                this._connector = cnt;
                if (cnt) {
                    cnt.signals.connect(nn.SignalOpen, this.__cnt_connected, this);
                    cnt.signals.connect(nn.SignalClose, this.__cnt_disconnected, this);
                    cnt.signals.connect(nn.SignalDataChanged, this.__cnt_byteavaliable, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        /** 监听服务器发来的一个对象
         */
        _SocketSession.prototype.watch = function (mdl, cb, cbctx) {
            if (cbctx)
                mdl.attach(cbctx);
            if (cb)
                mdl.signals.connect(nn.SignalSucceed, cb, cbctx);
            var cmd = nn.ObjectClass(mdl).Command;
            var arr = this._ntfMdls[cmd];
            if (arr == null) {
                arr = new nn.CSet();
                this._ntfMdls[cmd] = arr;
            }
            arr.add(mdl);
        };
        _SocketSession.prototype.unwatch = function (mdl) {
            var cmd = nn.ObjectClass(mdl).Command;
            var arr = this._ntfMdls[cmd];
            if (arr == null) {
                nn.warn('还没有监听该对象 ' + nn.Classname(mdl));
                return;
            }
            // 释放
            mdl.drop();
            // 从session中移除
            nn.SetT.RemoveObject(arr, mdl);
        };
        /** 获取一个数据
            @param cb, 成功后的回调
            @param cbfail, 失败后的回调
            @param cbend, 结束的回调（不区分成功、失败）
        */
        _SocketSession.prototype.fetch = function (mdl, cb, cbctx, cbfail, cbend) {
            var cls = this._pb.classForModel(mdl.cfg, mdl.name);
            if (cls == null)
                return;
            mdl.ts = nn.DateTime.Now();
            // 为了防止正在调用 api 时，接受信号的对象析构，保护一下
            if (cbctx)
                mdl.attach(cbctx);
            if (cb)
                mdl.signals.connect(nn.SignalSucceed, cb, cbctx);
            if (cbfail)
                mdl.signals.connect(nn.SignalFailed, cbfail, cbctx);
            if (cbend)
                mdl.signals.connect(nn.SignalEnd, cbend, cbctx);
            mdl.__mdl_start();
            var m = new cls();
            // 设置参数
            nn.MapT.Foreach(mdl.fields(), function (k, v) {
                m['set_' + k](v);
                return true;
            }, this);
            // 生成数据
            var buf = new egret.ByteArray();
            buf.endian = egret.Endian.BIG_ENDIAN;
            var seqid = ++this._seqId;
            this.writeHeader(buf, seqid, mdl);
            buf.writeBytes(new egret.ByteArray(m.toArrayBuffer()));
            // 发送出去
            this._seqMdls[seqid] = mdl;
            this.connector.write(buf.buffer);
        };
        /*
          定义为:
          binary.BigEndian.PutUint16(data[0:2], uint16(this.CmdId))
          binary.BigEndian.PutUint32(data[2:6], uint32(this.TransId))
          binary.BigEndian.PutUint16(data[6:8], uint16(this.Code))
         */
        _SocketSession.prototype.writeHeader = function (buf, seqid, mdl) {
            buf.writeShort(nn.ObjectClass(mdl).Command);
            buf.writeInt(seqid);
            buf.writeShort(0);
        };
        _SocketSession.prototype.readHeader = function (buf) {
            if (buf.length < 8)
                return null;
            var r = new ProtoBufHeader();
            r.cmd = buf.readShort();
            r.seqid = buf.readInt();
            r.code = buf.readShort();
            return r;
        };
        /** 打开连接 */
        _SocketSession.prototype.open = function () {
            if (this.connector.isopened()) {
                nn.fatal('连接已经打开');
                return;
            }
            this.connector.host = this.host;
            this.connector.open();
        };
        _SocketSession.prototype.__cnt_connected = function () {
            nn.noti('连接服务器 ' + this.host + ' 成功');
            this.signals.emit(nn.SignalOpen);
        };
        _SocketSession.prototype.__cnt_disconnected = function () {
            nn.noti('服务器 ' + this.host + ' 断开连接');
            this.signals.emit(nn.SignalClose);
        };
        _SocketSession.prototype.__cnt_byteavaliable = function (s) {
            var _this = this;
            var data = new egret.ByteArray(s.data);
            var header = this.readHeader(data);
            if (header == null) {
                nn.warn('收到了不能解析的头');
                return;
            }
            // 读取协议数据段数据
            var buf = new egret.ByteArray();
            data.readBytes(buf);
            // 处理数据时需要分为ReqRsp和Ntf两种处理
            // 处理 ntf 数据
            var mdls = this._ntfMdls[header.cmd];
            if (mdls && mdls.size) {
                var arr = this._ntfMdls[header.cmd];
                try {
                    var cls = null;
                    var md = null;
                    arr.forEach(function (mdl) {
                        if (cls == null) {
                            // 成组的对象采用同一份描述
                            cls = _this._pb.classForModel(mdl.cfg, mdl.name);
                            if (cls == null) {
                                nn.warn('没有找到模型返回对象的描述类');
                                arr.forEach(function (mdl) {
                                    mdl.__mdl_failed();
                                });
                                return;
                            }
                            md = cls.decode(buf.buffer);
                        }
                        mdl.__mdl_completed(md);
                    }, this);
                }
                catch (e) {
                    nn.warn('解析数据失败');
                    arr.forEach(function (mdl) {
                        mdl.__mdl_failed();
                    });
                }
                return;
            }
            // 处理 reqrsp 数据
            var mdl = this._seqMdls[header.seqid];
            if (mdl) {
                // 处理数据
                var cls = this._pb.classForModel(mdl.cfg, mdl.dname);
                if (cls == null) {
                    nn.warn('没有找到模型返回对象的描述类');
                    mdl.__mdl_failed();
                    return;
                }
                try {
                    var md = cls.decode(buf.buffer);
                    mdl.__mdl_completed(md);
                }
                catch (e) {
                    nn.warn('解析数据失败');
                    mdl.__mdl_failed();
                }
                nn.MapT.RemoveKey(this._seqMdls, header.seqid);
                return;
            }
            nn.noti('没有找到模型对象 ' + header);
        };
        return _SocketSession;
    }(nn.SObject));
    nn.SocketSession = new _SocketSession();
})(nn || (nn = {}));
// 开发专用的服务
var nn;
(function (nn) {
    var developer;
    (function (developer) {
        var Connector = (function () {
            function Connector() {
                var _this = this;
                this._cnt = new nn.WebSocketConnector();
                this._opers = new nn.OperationQueue();
                this._cnt.host = "ws://127.0.0.1:59001";
                this._cnt.signals.connect(nn.SignalFailed, function () {
                    nn.warn("连接开发服务器失败，请使用n2build启动开发服务");
                }, null);
                this._opers.add(new nn.OperationClosure(function (oper) {
                    _this._cnt.signals.once(nn.SignalOpen, function () {
                        oper.done();
                    }, null);
                    _this._cnt.open();
                }));
            }
            Connector.prototype.fetch = function (cb) {
                var _this = this;
                this._cnt.signals.once(nn.SignalDataChanged, function (d) {
                    var data = JSON.parse(d.data);
                    cb(data);
                }, null);
                this._opers.add(new nn.OperationClosure(function (oper) {
                    _this._cnt.write(JSON.stringify({ 'cmd': "::wswrk::developer",
                        'method': _this.method,
                        'fields': _this.fields }));
                    oper.done();
                }));
            };
            return Connector;
        }());
        var FileDialog = (function () {
            function FileDialog() {
            }
            FileDialog.prototype.pathForSave = function (cb) {
                var cnt = new Connector();
                cnt.method = "::file::dialog::save";
                cnt.fields = { 'filter': this.filter };
                cnt.fetch(function (d) {
                    cb(d.path);
                });
            };
            FileDialog.prototype.pathForOpen = function (cb) {
                var cnt = new Connector();
                cnt.method = "::file::dialog::open";
                cnt.fields = { 'filter': this.filter };
                cnt.fetch(function (d) {
                    cb(d.path);
                });
            };
            FileDialog.prototype.pathForDir = function (cb) {
                var cnt = new Connector();
                cnt.method = "::file::dialog::dir";
                cnt.fields = { 'filter': this.filter };
                cnt.fetch(function (d) {
                    cb(d.path);
                });
            };
            return FileDialog;
        }());
        developer.FileDialog = FileDialog;
        var FileSystem = (function () {
            function FileSystem() {
            }
            /** 创建文件夹
                @param p Create intermediate directories as required
            */
            FileSystem.prototype.mkdir = function (path, p, cb) {
                var cnt = new Connector();
                cnt.method = "::fs::mkdir";
                cnt.fields = { 'p': p, 'path': path };
                cnt.fetch(function (d) {
                    cb();
                });
            };
            return FileSystem;
        }());
        developer.FileSystem = FileSystem;
        var Image = (function (_super) {
            __extends(Image, _super);
            function Image() {
                return _super.apply(this, arguments) || this;
            }
            Image.prototype.open = function (path, cb) {
                var _this = this;
                var cnt = new Connector();
                cnt.method = "::image::open";
                cnt.fields = { 'file': path };
                cnt.fetch(function (d) {
                    _this._hdl = d.hdl;
                    cb(_this._hdl != null);
                });
            };
            Image.prototype.save = function (path, cb) {
                var cnt = new Connector();
                cnt.method = "::image::save";
                cnt.fields = { 'file': path, 'hdl': this._hdl };
                cnt.fetch(function (d) {
                    cb(true);
                });
            };
            Image.prototype.scale = function (x, y, cb) {
                var cnt = new Connector();
                cnt.method = "::image::scale";
                cnt.fields = { 'x': x, 'y': y, 'hdl': this._hdl };
                cnt.fetch(function (d) {
                    var r = new Image();
                    r._hdl = d.hdl;
                    cb(r);
                });
            };
            Image.prototype.subimage = function (rc, cb) {
                var cnt = new Connector();
                cnt.method = "::image::subimage";
                cnt.fields = { 'hdl': this._hdl, 'rect': { x: rc.x, y: rc.y, w: rc.width, h: rc.height } };
                cnt.fetch(function (d) {
                    var r = new Image();
                    r._hdl = d.hdl;
                    cb(r);
                });
            };
            return Image;
        }(nn.SObject));
        developer.Image = Image;
    })(developer = nn.developer || (nn.developer = {}));
})(nn || (nn = {}));
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function () {
    // private property
    var f = String.fromCharCode;
    var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    var baseReverseDic = {};
    function getBaseValue(alphabet, character) {
        if (!baseReverseDic[alphabet]) {
            baseReverseDic[alphabet] = {};
            for (var i = 0; i < alphabet.length; i++) {
                baseReverseDic[alphabet][alphabet.charAt(i)] = i;
            }
        }
        return baseReverseDic[alphabet][character];
    }
    var LZString = {
        compressToBase64: function (input) {
            if (input == null)
                return "";
            var res = LZString._compress(input, 6, function (a) { return keyStrBase64.charAt(a); });
            switch (res.length % 4) {
                default: // When could this happen ?
                case 0: return res;
                case 1: return res + "===";
                case 2: return res + "==";
                case 3: return res + "=";
            }
        },
        decompressFromBase64: function (input) {
            if (input == null)
                return "";
            if (input == "")
                return null;
            return LZString._decompress(input.length, 32, function (index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
        },
        compressToUTF16: function (input) {
            if (input == null)
                return "";
            return LZString._compress(input, 15, function (a) { return f(a + 32); }) + " ";
        },
        decompressFromUTF16: function (compressed) {
            if (compressed == null)
                return "";
            if (compressed == "")
                return null;
            return LZString._decompress(compressed.length, 16384, function (index) { return compressed.charCodeAt(index) - 32; });
        },
        //compress into uint8array (UCS-2 big endian format)
        compressToUint8Array: function (uncompressed) {
            var compressed = LZString.compress(uncompressed);
            var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character
            for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
                var current_value = compressed.charCodeAt(i);
                buf[i * 2] = current_value >>> 8;
                buf[i * 2 + 1] = current_value % 256;
            }
            return buf;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function (compressed) {
            if (compressed === null || compressed === undefined) {
                return LZString.decompress(compressed);
            }
            else {
                var buf = new Array(compressed.length / 2); // 2 bytes per character
                for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
                    buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
                }
                var result = [];
                buf.forEach(function (c) {
                    result.push(f(c));
                });
                return LZString.decompress(result.join(''));
            }
        },
        //compress into a string that is already URI encoded
        compressToEncodedURIComponent: function (input) {
            if (input == null)
                return "";
            return LZString._compress(input, 6, function (a) { return keyStrUriSafe.charAt(a); });
        },
        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function (input) {
            if (input == null)
                return "";
            if (input == "")
                return null;
            input = input.replace(/ /g, "+");
            return LZString._decompress(input.length, 32, function (index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
        },
        compress: function (uncompressed) {
            return LZString._compress(uncompressed, 16, function (a) { return f(a); });
        },
        _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
            if (uncompressed == null)
                return "";
            var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, // Compensate for the first entry which should not count
            context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
            for (ii = 0; ii < uncompressed.length; ii += 1) {
                context_c = uncompressed.charAt(ii);
                if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                    context_dictionary[context_c] = context_dictSize++;
                    context_dictionaryToCreate[context_c] = true;
                }
                context_wc = context_w + context_c;
                if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                    context_w = context_wc;
                }
                else {
                    if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                        if (context_w.charCodeAt(0) < 256) {
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                            }
                            value = context_w.charCodeAt(0);
                            for (i = 0; i < 8; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        else {
                            value = 1;
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1) | value;
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = 0;
                            }
                            value = context_w.charCodeAt(0);
                            for (i = 0; i < 16; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        context_enlargeIn--;
                        if (context_enlargeIn == 0) {
                            context_enlargeIn = Math.pow(2, context_numBits);
                            context_numBits++;
                        }
                        delete context_dictionaryToCreate[context_w];
                    }
                    else {
                        value = context_dictionary[context_w];
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    // Add wc to the dictionary.
                    context_dictionary[context_wc] = context_dictSize++;
                    context_w = String(context_c);
                }
            }
            // Output the code for w.
            if (context_w !== "") {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                    if (context_w.charCodeAt(0) < 256) {
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 8; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    else {
                        value = 1;
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | value;
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = 0;
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 16; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    delete context_dictionaryToCreate[context_w];
                }
                else {
                    value = context_dictionary[context_w];
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
            }
            // Mark the end of the stream
            value = 2;
            for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                }
                else {
                    context_data_position++;
                }
                value = value >> 1;
            }
            // Flush the last char
            while (true) {
                context_data_val = (context_data_val << 1);
                if (context_data_position == bitsPerChar - 1) {
                    context_data.push(getCharFromInt(context_data_val));
                    break;
                }
                else
                    context_data_position++;
            }
            return context_data.join('');
        },
        decompress: function (compressed) {
            if (compressed == null)
                return "";
            if (compressed == "")
                return null;
            return LZString._decompress(compressed.length, 32768, function (index) { return compressed.charCodeAt(index); });
        },
        _decompress: function (length, resetValue, getNextValue) {
            var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
            for (i = 0; i < 3; i += 1) {
                dictionary[i] = i;
            }
            bits = 0;
            maxpower = Math.pow(2, 2);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            switch (next = bits) {
                case 0:
                    bits = 0;
                    maxpower = Math.pow(2, 8);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = f(bits);
                    break;
                case 1:
                    bits = 0;
                    maxpower = Math.pow(2, 16);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = f(bits);
                    break;
                case 2:
                    return "";
            }
            dictionary[3] = c;
            w = c;
            result.push(c);
            while (true) {
                if (data.index > length) {
                    return "";
                }
                bits = 0;
                maxpower = Math.pow(2, numBits);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                switch (c = bits) {
                    case 0:
                        bits = 0;
                        maxpower = Math.pow(2, 8);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 1:
                        bits = 0;
                        maxpower = Math.pow(2, 16);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 2:
                        return result.join('');
                }
                if (enlargeIn == 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++;
                }
                if (dictionary[c]) {
                    entry = dictionary[c];
                }
                else {
                    if (c === dictSize) {
                        entry = w + w.charAt(0);
                    }
                    else {
                        return null;
                    }
                }
                result.push(entry);
                // Add w+entry[0] to the dictionary.
                dictionary[dictSize++] = w + entry.charAt(0);
                enlargeIn--;
                w = entry;
                if (enlargeIn == 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++;
                }
            }
        }
    };
    return LZString;
})();
var nn;
(function (nn) {
    // des
    function des(key, message, encrypt, mode, iv, padding) {
        //declaring this locally speeds things up a bit
        var spfunction1 = new Array(0x1010400, 0, 0x10000, 0x1010404, 0x1010004, 0x10404, 0x4, 0x10000, 0x400, 0x1010400, 0x1010404, 0x400, 0x1000404, 0x1010004, 0x1000000, 0x4, 0x404, 0x1000400, 0x1000400, 0x10400, 0x10400, 0x1010000, 0x1010000, 0x1000404, 0x10004, 0x1000004, 0x1000004, 0x10004, 0, 0x404, 0x10404, 0x1000000, 0x10000, 0x1010404, 0x4, 0x1010000, 0x1010400, 0x1000000, 0x1000000, 0x400, 0x1010004, 0x10000, 0x10400, 0x1000004, 0x400, 0x4, 0x1000404, 0x10404, 0x1010404, 0x10004, 0x1010000, 0x1000404, 0x1000004, 0x404, 0x10404, 0x1010400, 0x404, 0x1000400, 0x1000400, 0, 0x10004, 0x10400, 0, 0x1010004);
        var spfunction2 = new Array(-0x7fef7fe0, -0x7fff8000, 0x8000, 0x108020, 0x100000, 0x20, -0x7fefffe0, -0x7fff7fe0, -0x7fffffe0, -0x7fef7fe0, -0x7fef8000, -0x80000000, -0x7fff8000, 0x100000, 0x20, -0x7fefffe0, 0x108000, 0x100020, -0x7fff7fe0, 0, -0x80000000, 0x8000, 0x108020, -0x7ff00000, 0x100020, -0x7fffffe0, 0, 0x108000, 0x8020, -0x7fef8000, -0x7ff00000, 0x8020, 0, 0x108020, -0x7fefffe0, 0x100000, -0x7fff7fe0, -0x7ff00000, -0x7fef8000, 0x8000, -0x7ff00000, -0x7fff8000, 0x20, -0x7fef7fe0, 0x108020, 0x20, 0x8000, -0x80000000, 0x8020, -0x7fef8000, 0x100000, -0x7fffffe0, 0x100020, -0x7fff7fe0, -0x7fffffe0, 0x100020, 0x108000, 0, -0x7fff8000, 0x8020, -0x80000000, -0x7fefffe0, -0x7fef7fe0, 0x108000);
        var spfunction3 = new Array(0x208, 0x8020200, 0, 0x8020008, 0x8000200, 0, 0x20208, 0x8000200, 0x20008, 0x8000008, 0x8000008, 0x20000, 0x8020208, 0x20008, 0x8020000, 0x208, 0x8000000, 0x8, 0x8020200, 0x200, 0x20200, 0x8020000, 0x8020008, 0x20208, 0x8000208, 0x20200, 0x20000, 0x8000208, 0x8, 0x8020208, 0x200, 0x8000000, 0x8020200, 0x8000000, 0x20008, 0x208, 0x20000, 0x8020200, 0x8000200, 0, 0x200, 0x20008, 0x8020208, 0x8000200, 0x8000008, 0x200, 0, 0x8020008, 0x8000208, 0x20000, 0x8000000, 0x8020208, 0x8, 0x20208, 0x20200, 0x8000008, 0x8020000, 0x8000208, 0x208, 0x8020000, 0x20208, 0x8, 0x8020008, 0x20200);
        var spfunction4 = new Array(0x802001, 0x2081, 0x2081, 0x80, 0x802080, 0x800081, 0x800001, 0x2001, 0, 0x802000, 0x802000, 0x802081, 0x81, 0, 0x800080, 0x800001, 0x1, 0x2000, 0x800000, 0x802001, 0x80, 0x800000, 0x2001, 0x2080, 0x800081, 0x1, 0x2080, 0x800080, 0x2000, 0x802080, 0x802081, 0x81, 0x800080, 0x800001, 0x802000, 0x802081, 0x81, 0, 0, 0x802000, 0x2080, 0x800080, 0x800081, 0x1, 0x802001, 0x2081, 0x2081, 0x80, 0x802081, 0x81, 0x1, 0x2000, 0x800001, 0x2001, 0x802080, 0x800081, 0x2001, 0x2080, 0x800000, 0x802001, 0x80, 0x800000, 0x2000, 0x802080);
        var spfunction5 = new Array(0x100, 0x2080100, 0x2080000, 0x42000100, 0x80000, 0x100, 0x40000000, 0x2080000, 0x40080100, 0x80000, 0x2000100, 0x40080100, 0x42000100, 0x42080000, 0x80100, 0x40000000, 0x2000000, 0x40080000, 0x40080000, 0, 0x40000100, 0x42080100, 0x42080100, 0x2000100, 0x42080000, 0x40000100, 0, 0x42000000, 0x2080100, 0x2000000, 0x42000000, 0x80100, 0x80000, 0x42000100, 0x100, 0x2000000, 0x40000000, 0x2080000, 0x42000100, 0x40080100, 0x2000100, 0x40000000, 0x42080000, 0x2080100, 0x40080100, 0x100, 0x2000000, 0x42080000, 0x42080100, 0x80100, 0x42000000, 0x42080100, 0x2080000, 0, 0x40080000, 0x42000000, 0x80100, 0x2000100, 0x40000100, 0x80000, 0, 0x40080000, 0x2080100, 0x40000100);
        var spfunction6 = new Array(0x20000010, 0x20400000, 0x4000, 0x20404010, 0x20400000, 0x10, 0x20404010, 0x400000, 0x20004000, 0x404010, 0x400000, 0x20000010, 0x400010, 0x20004000, 0x20000000, 0x4010, 0, 0x400010, 0x20004010, 0x4000, 0x404000, 0x20004010, 0x10, 0x20400010, 0x20400010, 0, 0x404010, 0x20404000, 0x4010, 0x404000, 0x20404000, 0x20000000, 0x20004000, 0x10, 0x20400010, 0x404000, 0x20404010, 0x400000, 0x4010, 0x20000010, 0x400000, 0x20004000, 0x20000000, 0x4010, 0x20000010, 0x20404010, 0x404000, 0x20400000, 0x404010, 0x20404000, 0, 0x20400010, 0x10, 0x4000, 0x20400000, 0x404010, 0x4000, 0x400010, 0x20004010, 0, 0x20404000, 0x20000000, 0x400010, 0x20004010);
        var spfunction7 = new Array(0x200000, 0x4200002, 0x4000802, 0, 0x800, 0x4000802, 0x200802, 0x4200800, 0x4200802, 0x200000, 0, 0x4000002, 0x2, 0x4000000, 0x4200002, 0x802, 0x4000800, 0x200802, 0x200002, 0x4000800, 0x4000002, 0x4200000, 0x4200800, 0x200002, 0x4200000, 0x800, 0x802, 0x4200802, 0x200800, 0x2, 0x4000000, 0x200800, 0x4000000, 0x200800, 0x200000, 0x4000802, 0x4000802, 0x4200002, 0x4200002, 0x2, 0x200002, 0x4000000, 0x4000800, 0x200000, 0x4200800, 0x802, 0x200802, 0x4200800, 0x802, 0x4000002, 0x4200802, 0x4200000, 0x200800, 0, 0x2, 0x4200802, 0, 0x200802, 0x4200000, 0x800, 0x4000002, 0x4000800, 0x800, 0x200002);
        var spfunction8 = new Array(0x10001040, 0x1000, 0x40000, 0x10041040, 0x10000000, 0x10001040, 0x40, 0x10000000, 0x40040, 0x10040000, 0x10041040, 0x41000, 0x10041000, 0x41040, 0x1000, 0x40, 0x10040000, 0x10000040, 0x10001000, 0x1040, 0x41000, 0x40040, 0x10040040, 0x10041000, 0x1040, 0, 0, 0x10040040, 0x10000040, 0x10001000, 0x41040, 0x40000, 0x41040, 0x40000, 0x10041000, 0x1000, 0x40, 0x10040040, 0x1000, 0x41040, 0x10001000, 0x40, 0x10000040, 0x10040000, 0x10040040, 0x10000000, 0x40000, 0x10001040, 0, 0x10041040, 0x40040, 0x10000040, 0x10040000, 0x10001000, 0x10001040, 0, 0x10041040, 0x41000, 0x41000, 0x1040, 0x1040, 0x40040, 0x10000000, 0x10041000);
        //create the 16 or 48 subkeys we will need
        var keys = des_createKeys(key);
        var m = 0, i, j, temp, temp2, right1, right2, left, right, looping;
        var cbcleft, cbcleft2, cbcright, cbcright2;
        var endloop, loopinc;
        var len = message.length;
        var chunk = 0;
        //set up the loops for single and triple des
        var iterations = keys.length == 32 ? 3 : 9; //single or triple des
        if (iterations == 3) {
            looping = encrypt ? new Array(0, 32, 2) : new Array(30, -2, -2);
        }
        else {
            looping = encrypt ? new Array(0, 32, 2, 62, 30, -2, 64, 96, 2) : new Array(94, 62, -2, 32, 64, 2, 30, -2, -2);
        }
        //pad the message depending on the padding parameter
        if (padding == 2)
            message += "        "; //pad the message with spaces
        else if (padding == 1) {
            temp = 8 - (len % 8);
            message += String.fromCharCode(temp, temp, temp, temp, temp, temp, temp, temp);
            if (temp == 8)
                len += 8;
        } //PKCS7 padding
        else if (!padding)
            message += "\0\0\0\0\0\0\0\0"; //pad the message out with null bytes
        //store the result here
        var result = "";
        var tempresult = "";
        if (mode == 1) {
            cbcleft = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);
            cbcright = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);
            m = 0;
        }
        //loop through each 64 bit chunk of the message
        while (m < len) {
            left = (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);
            right = (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);
            //for Cipher Block Chaining mode, xor the message with the previous result
            if (mode == 1) {
                if (encrypt) {
                    left ^= cbcleft;
                    right ^= cbcright;
                }
                else {
                    cbcleft2 = cbcleft;
                    cbcright2 = cbcright;
                    cbcleft = left;
                    cbcright = right;
                }
            }
            //first each 64 but chunk of the message must be permuted according to IP
            temp = ((left >>> 4) ^ right) & 0x0f0f0f0f;
            right ^= temp;
            left ^= (temp << 4);
            temp = ((left >>> 16) ^ right) & 0x0000ffff;
            right ^= temp;
            left ^= (temp << 16);
            temp = ((right >>> 2) ^ left) & 0x33333333;
            left ^= temp;
            right ^= (temp << 2);
            temp = ((right >>> 8) ^ left) & 0x00ff00ff;
            left ^= temp;
            right ^= (temp << 8);
            temp = ((left >>> 1) ^ right) & 0x55555555;
            right ^= temp;
            left ^= (temp << 1);
            left = ((left << 1) | (left >>> 31));
            right = ((right << 1) | (right >>> 31));
            //do this either 1 or 3 times for each chunk of the message
            for (j = 0; j < iterations; j += 3) {
                endloop = looping[j + 1];
                loopinc = looping[j + 2];
                //now go through and perform the encryption or decryption  
                for (i = looping[j]; i != endloop; i += loopinc) {
                    right1 = right ^ keys[i];
                    right2 = ((right >>> 4) | (right << 28)) ^ keys[i + 1];
                    //the result is attained by passing these bytes through the S selection functions
                    temp = left;
                    left = right;
                    right = temp ^ (spfunction2[(right1 >>> 24) & 0x3f] | spfunction4[(right1 >>> 16) & 0x3f]
                        | spfunction6[(right1 >>> 8) & 0x3f] | spfunction8[right1 & 0x3f]
                        | spfunction1[(right2 >>> 24) & 0x3f] | spfunction3[(right2 >>> 16) & 0x3f]
                        | spfunction5[(right2 >>> 8) & 0x3f] | spfunction7[right2 & 0x3f]);
                }
                temp = left;
                left = right;
                right = temp; //unreverse left and right
            } //for either 1 or 3 iterations
            //move then each one bit to the right
            left = ((left >>> 1) | (left << 31));
            right = ((right >>> 1) | (right << 31));
            //now perform IP-1, which is IP in the opposite direction
            temp = ((left >>> 1) ^ right) & 0x55555555;
            right ^= temp;
            left ^= (temp << 1);
            temp = ((right >>> 8) ^ left) & 0x00ff00ff;
            left ^= temp;
            right ^= (temp << 8);
            temp = ((right >>> 2) ^ left) & 0x33333333;
            left ^= temp;
            right ^= (temp << 2);
            temp = ((left >>> 16) ^ right) & 0x0000ffff;
            right ^= temp;
            left ^= (temp << 16);
            temp = ((left >>> 4) ^ right) & 0x0f0f0f0f;
            right ^= temp;
            left ^= (temp << 4);
            //for Cipher Block Chaining mode, xor the message with the previous result
            if (mode == 1) {
                if (encrypt) {
                    cbcleft = left;
                    cbcright = right;
                }
                else {
                    left ^= cbcleft2;
                    right ^= cbcright2;
                }
            }
            tempresult += String.fromCharCode((left >>> 24), ((left >>> 16) & 0xff), ((left >>> 8) & 0xff), (left & 0xff), (right >>> 24), ((right >>> 16) & 0xff), ((right >>> 8) & 0xff), (right & 0xff));
            chunk += 8;
            if (chunk == 512) {
                result += tempresult;
                tempresult = "";
                chunk = 0;
            }
        } //for every 8 characters, or 64 bits in the message
        //return the result as an array
        result += tempresult;
        result = result.replace(/\0*$/g, "");
        return result;
    } //end of des
    //des_createKeys
    //this takes as input a 64 bit key (even though only 56 bits are used)
    //as an array of 2 integers, and returns 16 48 bit keys
    function des_createKeys(key) {
        //declaring this locally speeds things up a bit
        var pc2bytes0 = new Array(0, 0x4, 0x20000000, 0x20000004, 0x10000, 0x10004, 0x20010000, 0x20010004, 0x200, 0x204, 0x20000200, 0x20000204, 0x10200, 0x10204, 0x20010200, 0x20010204);
        var pc2bytes1 = new Array(0, 0x1, 0x100000, 0x100001, 0x4000000, 0x4000001, 0x4100000, 0x4100001, 0x100, 0x101, 0x100100, 0x100101, 0x4000100, 0x4000101, 0x4100100, 0x4100101);
        var pc2bytes2 = new Array(0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808, 0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808);
        var pc2bytes3 = new Array(0, 0x200000, 0x8000000, 0x8200000, 0x2000, 0x202000, 0x8002000, 0x8202000, 0x20000, 0x220000, 0x8020000, 0x8220000, 0x22000, 0x222000, 0x8022000, 0x8222000);
        var pc2bytes4 = new Array(0, 0x40000, 0x10, 0x40010, 0, 0x40000, 0x10, 0x40010, 0x1000, 0x41000, 0x1010, 0x41010, 0x1000, 0x41000, 0x1010, 0x41010);
        var pc2bytes5 = new Array(0, 0x400, 0x20, 0x420, 0, 0x400, 0x20, 0x420, 0x2000000, 0x2000400, 0x2000020, 0x2000420, 0x2000000, 0x2000400, 0x2000020, 0x2000420);
        var pc2bytes6 = new Array(0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002, 0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002);
        var pc2bytes7 = new Array(0, 0x10000, 0x800, 0x10800, 0x20000000, 0x20010000, 0x20000800, 0x20010800, 0x20000, 0x30000, 0x20800, 0x30800, 0x20020000, 0x20030000, 0x20020800, 0x20030800);
        var pc2bytes8 = new Array(0, 0x40000, 0, 0x40000, 0x2, 0x40002, 0x2, 0x40002, 0x2000000, 0x2040000, 0x2000000, 0x2040000, 0x2000002, 0x2040002, 0x2000002, 0x2040002);
        var pc2bytes9 = new Array(0, 0x10000000, 0x8, 0x10000008, 0, 0x10000000, 0x8, 0x10000008, 0x400, 0x10000400, 0x408, 0x10000408, 0x400, 0x10000400, 0x408, 0x10000408);
        var pc2bytes10 = new Array(0, 0x20, 0, 0x20, 0x100000, 0x100020, 0x100000, 0x100020, 0x2000, 0x2020, 0x2000, 0x2020, 0x102000, 0x102020, 0x102000, 0x102020);
        var pc2bytes11 = new Array(0, 0x1000000, 0x200, 0x1000200, 0x200000, 0x1200000, 0x200200, 0x1200200, 0x4000000, 0x5000000, 0x4000200, 0x5000200, 0x4200000, 0x5200000, 0x4200200, 0x5200200);
        var pc2bytes12 = new Array(0, 0x1000, 0x8000000, 0x8001000, 0x80000, 0x81000, 0x8080000, 0x8081000, 0x10, 0x1010, 0x8000010, 0x8001010, 0x80010, 0x81010, 0x8080010, 0x8081010);
        var pc2bytes13 = new Array(0, 0x4, 0x100, 0x104, 0, 0x4, 0x100, 0x104, 0x1, 0x5, 0x101, 0x105, 0x1, 0x5, 0x101, 0x105);
        //how many iterations (1 for des, 3 for triple des)
        var iterations = key.length > 8 ? 3 : 1; //changed by Paul 16/6/2007 to use Triple DES for 9+ byte keys
        //stores the return keys
        var keys = new Array(32 * iterations);
        //now define the left shifts which need to be done
        var shifts = new Array(0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0);
        //other variables
        var lefttemp, righttemp, m = 0, n = 0, temp;
        for (var j = 0; j < iterations; j++) {
            var left = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);
            var right = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);
            var temp = ((left >>> 4) ^ right) & 0x0f0f0f0f;
            right ^= temp;
            left ^= (temp << 4);
            temp = ((right >>> -16) ^ left) & 0x0000ffff;
            left ^= temp;
            right ^= (temp << -16);
            temp = ((left >>> 2) ^ right) & 0x33333333;
            right ^= temp;
            left ^= (temp << 2);
            temp = ((right >>> -16) ^ left) & 0x0000ffff;
            left ^= temp;
            right ^= (temp << -16);
            temp = ((left >>> 1) ^ right) & 0x55555555;
            right ^= temp;
            left ^= (temp << 1);
            temp = ((right >>> 8) ^ left) & 0x00ff00ff;
            left ^= temp;
            right ^= (temp << 8);
            temp = ((left >>> 1) ^ right) & 0x55555555;
            right ^= temp;
            left ^= (temp << 1);
            //the right side needs to be shifted and to get the last four bits of the left side
            temp = (left << 8) | ((right >>> 20) & 0x000000f0);
            //left needs to be put upside down
            left = (right << 24) | ((right << 8) & 0xff0000) | ((right >>> 8) & 0xff00) | ((right >>> 24) & 0xf0);
            right = temp;
            //now go through and perform these shifts on the left and right keys
            for (var i = 0; i < shifts.length; i++) {
                //shift the keys either one or two bits to the left
                if (shifts[i]) {
                    left = (left << 2) | (left >>> 26);
                    right = (right << 2) | (right >>> 26);
                }
                else {
                    left = (left << 1) | (left >>> 27);
                    right = (right << 1) | (right >>> 27);
                }
                left &= -0xf;
                right &= -0xf;
                //now apply PC-2, in such a way that E is easier when encrypting or decrypting
                //this conversion will look like PC-2 except only the last 6 bits of each byte are used
                //rather than 48 consecutive bits and the order of lines will be according to 
                //how the S selection functions will be applied: S2, S4, S6, S8, S1, S3, S5, S7
                lefttemp = pc2bytes0[left >>> 28] | pc2bytes1[(left >>> 24) & 0xf]
                    | pc2bytes2[(left >>> 20) & 0xf] | pc2bytes3[(left >>> 16) & 0xf]
                    | pc2bytes4[(left >>> 12) & 0xf] | pc2bytes5[(left >>> 8) & 0xf]
                    | pc2bytes6[(left >>> 4) & 0xf];
                righttemp = pc2bytes7[right >>> 28] | pc2bytes8[(right >>> 24) & 0xf]
                    | pc2bytes9[(right >>> 20) & 0xf] | pc2bytes10[(right >>> 16) & 0xf]
                    | pc2bytes11[(right >>> 12) & 0xf] | pc2bytes12[(right >>> 8) & 0xf]
                    | pc2bytes13[(right >>> 4) & 0xf];
                temp = ((righttemp >>> 16) ^ lefttemp) & 0x0000ffff;
                keys[n++] = lefttemp ^ temp;
                keys[n++] = righttemp ^ (temp << 16);
            }
        } //for each iterations
        //return the keys we've created
        return keys;
    } //end of des_createKeys
    var CodecString = (function () {
        function CodecString() {
        }
        CodecString.prototype.encode = function (s) {
            return LZString.compress(s);
        };
        CodecString.prototype.decode = function (d) {
            return LZString.decompress(d);
        };
        return CodecString;
    }());
    nn.CodecString = CodecString;
    var CodecUrl = (function () {
        function CodecUrl() {
        }
        CodecUrl.prototype.encode = function (s) {
            return LZString.compressToEncodedURIComponent(s);
        };
        CodecUrl.prototype.decode = function (d) {
            return LZString.decompressFromEncodedURIComponent(d);
        };
        return CodecUrl;
    }());
    nn.CodecUrl = CodecUrl;
    var CrytoString = (function () {
        function CrytoString() {
        }
        Object.defineProperty(CrytoString.prototype, "iv", {
            get: function () {
                return this._iv;
            },
            set: function (s) {
                if (s.length < 7) {
                    nn.fatal("字符串的长度不能小于7");
                    return;
                }
                this._iv = s;
            },
            enumerable: true,
            configurable: true
        });
        CrytoString.prototype.encode = function (s) {
            return des(this.key, s, 1, this._iv ? 1 : 0, this._iv, null);
        };
        CrytoString.prototype.decode = function (d) {
            return des(this.key, d, 0, this.iv ? 1 : 0, this._iv, null);
        };
        return CrytoString;
    }());
    nn.CrytoString = CrytoString;
    var ZipArchiver = (function () {
        function ZipArchiver() {
        }
        ZipArchiver.prototype.load = function (d) {
            if (ZipArchiver.Unavaliable)
                return false;
            this._hdl = new JSZip(d);
            return true;
        };
        ZipArchiver.prototype.file = function (path, type, cb, ctx) {
            var cnt = this._hdl.file(path);
            if (cnt == null) {
                cb.call(ctx, null);
                return;
            }
            switch (type) {
                case nn.ResType.JSON:
                    {
                        var txt = cnt.asText();
                        var obj_2 = JSON.parse(txt);
                        cb.call(ctx, obj_2);
                    }
                    break;
                case nn.ResType.TEXT:
                    {
                        cb.call(ctx, cnt.asText());
                    }
                    break;
            }
        };
        return ZipArchiver;
    }());
    ZipArchiver.Unavaliable = typeof (JSZip) == 'undefined';
    nn.ZipArchiver = ZipArchiver;
    var LzmaArchiver = (function () {
        function LzmaArchiver() {
        }
        LzmaArchiver.prototype.load = function (d) {
            if (LzmaArchiver.Unavaliable)
                return false;
            var r;
            try {
                var buf = void 0;
                if (d instanceof ArrayBuffer)
                    buf = new Int8Array(d);
                else
                    nn.fatal("lzma需要传入一个可以被转换成Int8Array的类型");
                this.plain = LZMA.decompress(buf);
                r = true;
            }
            catch (e) {
                r = false;
            }
            return r;
        };
        LzmaArchiver.prototype.file = function (path, type, cb, ctx) {
            switch (type) {
                case nn.ResType.JSON:
                    {
                        var obj_3 = JSON.parse(this.plain);
                        cb.call(ctx, obj_3);
                    }
                    break;
                case nn.ResType.TEXT:
                    {
                        cb.call(ctx, this.plain);
                    }
                    break;
            }
        };
        return LzmaArchiver;
    }());
    LzmaArchiver.Unavaliable = typeof (LZMA) == 'undefined';
    nn.LzmaArchiver = LzmaArchiver;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var TiledMap = (function (_super) {
        __extends(TiledMap, _super);
        function TiledMap() {
            return _super.call(this) || this;
        }
        TiledMap.prototype.dispose = function () {
            if (this._map) {
                this._map.destory();
                this._map = undefined;
            }
            this._data = undefined;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(TiledMap.prototype, "tiledSource", {
            get: function () {
                return this._tiledSource;
            },
            set: function (ts) {
                if (this._tiledSource == ts)
                    return;
                // 移除旧的
                if (this._map) {
                    this._imp.removeChild(this._map);
                    this._map.destory();
                    this._map = undefined;
                    this._data = undefined;
                }
                this._tiledSource = ts;
                if (ts) {
                    var d = RES.getRes(ts);
                    if (typeof (d) != 'string') {
                        nn.warn('TiledMap 的资源文件类型错误: ' + ts + ' 的类型应该为 text，清通过ResDepo工具修改');
                        return;
                    }
                    this._data = egret.XML.parse(d);
                    this._url = nn.ResManager.getResUrl(ts);
                }
            },
            enumerable: true,
            configurable: true
        });
        TiledMap.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            if (this._data == null)
                return;
            var rc = this.boundsForLayout();
            // 判断是否要重新生成一下
            if (this._map) {
                if (this._map.renderwidth * nn.ScaleFactorDeW != rc.width ||
                    this._map.renderheight * nn.ScaleFactorDeH != rc.height) {
                    this._imp.removeChild(this._map);
                    this._map.destory();
                    this._map = undefined;
                }
            }
            // 生成一个新的map
            if (this._map == null) {
                this._map = new tiled.TMXTilemap(rc.width, rc.height, this._data, this._url);
                this._map.render();
                this._imp.addChild(this._map);
            }
            this.impSetFrame(rc, this._map);
        };
        return TiledMap;
    }(nn.Sprite));
    nn.TiledMap = TiledMap;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var CoreApplication = (function (_super) {
        __extends(CoreApplication, _super);
        function CoreApplication() {
            return _super.call(this) || this;
        }
        Object.defineProperty(CoreApplication.prototype, "root", {
            get: function () {
                return this._gameLayer.root;
            },
            /** 设置根页面 */
            set: function (sp) {
                this._gameLayer.root = sp;
            },
            enumerable: true,
            configurable: true
        });
        return CoreApplication;
    }(nn.EgretApp));
    nn.CoreApplication = CoreApplication;
})(nn || (nn = {}));
var nn;
(function (nn) {
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(state) {
            var _this = _super.call(this) || this;
            _this.touchEnabled = true;
            if (state)
                _this.onChangeState(state);
            return _this;
        }
        Button.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this._slavestates)
                this._slavestates.dispose();
        };
        Object.defineProperty(Button.prototype, "fontSize", {
            get: function () {
                if (this._label)
                    return this._label.fontSize;
                return 0;
            },
            set: function (val) {
                this._getLabel().fontSize = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "textColor", {
            get: function () {
                if (this._label)
                    return this._label.textColor;
                return 0;
            },
            set: function (val) {
                this._getLabel().textColor = nn.GetColorComponent(val)[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "text", {
            get: function () {
                if (this._label)
                    return this._label.text;
                return "";
            },
            set: function (val) {
                this._getLabel().text = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "textAlign", {
            get: function () {
                if (this._label)
                    return this._label.textAlign;
                return "center";
            },
            set: function (val) {
                this._getLabel().textAlign = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "label", {
            get: function () {
                return this._label;
            },
            set: function (lbl) {
                nn.warn("不能直接设置button的title类");
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype._getLabel = function () {
            if (this._label == null) {
                this._label = new nn.Label();
                this._label.textAlign = "center";
                this.addChild(this._label);
            }
            return this._label;
        };
        Object.defineProperty(Button.prototype, "imageView", {
            get: function () {
                return this._imageView;
            },
            set: function (bmp) {
                nn.warn("不能直接设置button的image");
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype._getImageView = function () {
            if (this._imageView == null) {
                this._imageView = new nn.Bitmap();
                this._imageView.fillMode = nn.FillMode.ASPECTSTRETCH;
                this.addChild(this._imageView);
            }
            return this._imageView;
        };
        Object.defineProperty(Button.prototype, "imageSource", {
            get: function () {
                if (this._imageView)
                    return this._imageView.imageSource;
                return null;
            },
            set: function (tex) {
                this._getImageView().imageSource = tex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "imageFillMode", {
            get: function () {
                if (this._imageView)
                    return this._imageView.fillMode;
                return nn.FillMode.ASPECTSTRETCH;
            },
            set: function (mode) {
                this._getImageView().fillMode = mode;
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.bestFrame = function (inrc) {
            var brc = new nn.Rect();
            if (this._label)
                brc.union(this._label.bestFrame());
            return brc.unapplyEdgeInsets(this.edgeInsets);
        };
        Button.prototype.updateLayout = function () {
            _super.prototype.updateLayout.call(this);
            var rc = this.boundsForLayout();
            if (this._label)
                this._label.frame = rc;
            if (this._imageView)
                this._imageView.frame = rc;
        };
        Object.defineProperty(Button.prototype, "stateNormal", {
            get: function () {
                if (this._slavestates)
                    return this._slavestates.get(Button.STATE_NORMAL);
                return null;
            },
            set: function (st) {
                this.slavestates.bind(Button.STATE_NORMAL, st);
                if (!this.disabled) {
                    if (this._slavestates.state == undefined)
                        this._slavestates.state = Button.STATE_NORMAL;
                    this.states.updateData(false);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "stateDisabled", {
            get: function () {
                if (this._slavestates)
                    return this._slavestates.get(Button.STATE_DISABLED);
                return null;
            },
            set: function (st) {
                this.slavestates.bind(Button.STATE_DISABLED, st);
                if (this.disabled) {
                    if (this._slavestates.state == undefined)
                        this._slavestates.state = Button.STATE_DISABLED;
                    this.states.updateData(false);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "stateHighlight", {
            get: function () {
                if (this._slavestates)
                    return this._slavestates.get(Button.STATE_HIGHLIGHT);
                return null;
            },
            set: function (st) {
                this.slavestates.bind(Button.STATE_HIGHLIGHT, st);
                this.states.updateData(false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "stateSelected", {
            get: function () {
                if (this._slavestates)
                    return this._slavestates.get(Button.STATE_SELECTED);
                return null;
            },
            set: function (st) {
                this.slavestates.bind(Button.STATE_SELECTED, st);
                this.states.updateData(false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "slavestates", {
            get: function () {
                if (this._slavestates == null) {
                    this._slavestates = new nn.States();
                    this.signals.connect(nn.SignalTouchBegin, this.__btn_touchdown, this);
                    this.signals.connect(nn.SignalTouchEnd, this.__btn_touchup, this);
                }
                return this._slavestates;
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.onChangeState = function (obj) {
            var state = nn.State.As(obj);
            if (this._slavestates) {
                var slvst = this._slavestates.state;
                if (slvst == Button.STATE_NORMAL) {
                    var st = this._slavestates.get(Button.STATE_NORMAL);
                    st && state.add('normal', st);
                }
                else if (slvst == Button.STATE_DISABLED) {
                    var st = this._slavestates.get(Button.STATE_DISABLED);
                    st && state.add('disabled', st);
                }
                else if (slvst == Button.STATE_SELECTED) {
                    var st = this._slavestates.get(Button.STATE_SELECTED);
                    st && state.add('selected', st);
                }
                else if (slvst == Button.STATE_HIGHLIGHT) {
                    var st = this._slavestates.get(Button.STATE_HIGHLIGHT);
                    st && state.add('highlight', st);
                }
            }
            state.setIn(this);
        };
        Object.defineProperty(Button.prototype, "disabled", {
            get: function () {
                return this._disabled == true;
            },
            set: function (b) {
                if (b == this._disabled)
                    return;
                this._disabled = b;
                if (this._slavestates.changeState(this._disabled ? Button.STATE_DISABLED : Button.STATE_NORMAL))
                    this.states.updateData(false);
                this.touchEnabled = !b;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "touchEnabled", {
            get: function () {
                return this._imp.touchEnabled;
            },
            set: function (b) {
                this._imp.touchEnabled = !this._disabled && b;
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.__btn_touchdown = function () {
            if (this._slavestates == null)
                return;
            if (this._slavestates.changeState(Button.STATE_HIGHLIGHT))
                this.states.updateData(false);
        };
        Button.prototype.__btn_touchup = function () {
            if (this._slavestates == null)
                return;
            if (this._isSelected && this._slavestates.get(Button.STATE_SELECTED)) {
                if (this._slavestates.changeState(Button.STATE_SELECTED))
                    this.states.updateData(false);
            }
            else {
                if (this._slavestates.changeState(this.disabled ? Button.STATE_DISABLED : Button.STATE_NORMAL))
                    this.states.updateData(false);
            }
        };
        Button.prototype.setSelection = function (sel) {
            if (sel == this._isSelected)
                return;
            this._isSelected = sel;
            if (this._isSelected && this._slavestates.get(Button.STATE_SELECTED))
                this._slavestates.state = Button.STATE_SELECTED;
            else
                this._slavestates.state = this.disabled ? Button.STATE_DISABLED : Button.STATE_NORMAL;
            this.states.updateData(false);
            // 抛出状态变化
            this.states.signals.emit(nn.SignalStateChanged);
        };
        return Button;
    }(nn.CButton));
    nn.Button = Button;
    var RadioButton = (function (_super) {
        __extends(RadioButton, _super);
        function RadioButton() {
            var _this = _super.call(this) || this;
            /** 是否支持点击已经选中的来直接反选 */
            _this.allowDeclick = true;
            _this.signals.connect(nn.SignalClicked, _this.__radio_clicked, _this);
            return _this;
        }
        Object.defineProperty(RadioButton.prototype, "selectedState", {
            get: function () {
                return this._selectedState;
            },
            set: function (val) {
                if (this._selectedState == val)
                    return;
                this._selectedState = val;
                this.states.bind("selected", val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadioButton.prototype, "unselectedState", {
            get: function () {
                return this._unselectedState;
            },
            set: function (val) {
                if (this._unselectedState == val)
                    return;
                this._unselectedState = val;
                this.states.bind("unselected", val);
                if (this.states.state == undefined) {
                    this.states.state = "unselected";
                }
            },
            enumerable: true,
            configurable: true
        });
        RadioButton.prototype.setSelection = function (val) {
            if (this._selection == val)
                return;
            this._selection = val;
            this.states.state = val ? "selected" : "unselected";
        };
        RadioButton.prototype.isSelection = function () {
            return this._selection;
        };
        RadioButton.prototype.__radio_clicked = function () {
            if (!this.allowDeclick && this.isSelection())
                return;
            this.setSelection(!this.isSelection());
        };
        return RadioButton;
    }(Button));
    nn.RadioButton = RadioButton;
})(nn || (nn = {}));
