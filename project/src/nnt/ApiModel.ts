module nn {

    // 网络连接错误
    export let ERROR_NETWORK_FAILED = -0xFFFFFFFE;

    /* 用法
       let m = new app.model.Test();
       m.message = "hello";
       m.signals.connect(nn.Model.SignalDone, function(e:nn.Slot) {
       nn.msgbox(m.result);
       }, this);
       nn.RestSession.fetch(m);
    */

    export class Model extends SObject implements ISerializable, ICacheObject {
        constructor() {
            super();
        }

        dispose() {
            this.response = undefined;
            this.params = null;
            super.dispose();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalStart);
            this._signals.register(SignalEnd);
            this._signals.register(SignalSucceed);
            this._signals.register(SignalFailed);
            this._signals.register(SignalTimeout);
        }

        // 实现 mc 接口
        cacheFlush: boolean;
        cacheUpdated: boolean;
        cacheTime: number;

        keyForCache(): string {
            return this.host + '|' + this.action + '|' + JSON.stringify(this.paramsForCache());
        }

        paramsForCache(): KvObject<string> {
            return this.params;
        }

        valueForCache(): any {
            return this.response;
        }

        /** 动作 */
        action: string = '';

        /** 参数 */
        params: KvObject<string> = {};

        /** 域 */
        host: string = '';

        /** 返回的数据 */
        response: any;

        /** 需要自动带上授权信息 */
        withCredentials: boolean = true;

        /** 由哪个session发起的请求 */
        session: SObject;

        // 为了解决跨域的问题，服务端需要收到 mcb 后，通过调用此函数回调数据
        /*
          @code php
          $res = json_encode(['code' => 0, 'data' => $message]);
          if (isset($_GET['modelcallback'])) {
          $cb = $_GET['modelcallback'];
          return "{$cb}({$res})";
          }
         */
        private _modelcallback: string;
        set modelcallback(val: string) {
            this._modelcallback = val;
            this.params['modelcallback'] = val;
        }

        get modelcallback(): string {
            return this._modelcallback;
        }

        static HTTP: string = "http://" + document.domain;
        static HTTPS: string = "https://" + document.domain;

        /** 获得请求的类型 */
        method: HttpMethod = HttpMethod.GET;

        /** 是否跨域 */
        iscross(): boolean {
            // 使用服务器转向来解决跨域的问题
            if (this.useproxy())
                return false;
            return this.host.indexOf(Model.HTTP) == -1 &&
                this.host.indexOf(Model.HTTPS) == -1;
        }

        /** 是否使用代理 */
        useproxy(): boolean {
            return ISDEBUG;
        }

        /** 全路径 */
        url(): string {
            return this.host + this.action;
        }

        /** 可用的参数 */
        fields(): KvObject<string> {
            return this.params;
        }

        /** 是否获取成功 */
        isSucceed(): boolean {
            return this.code === 0;
        }

        /** 保存成功或失败的状态 */
        succeed: boolean;

        /** 调试模式，即使错误也同样激活成功的消息 */
        isDebug = false;

        /** 是否显示 wait */
        showWaiting: boolean;

        /** 是否显示错误信息 */
        showError = false;

        /** 处理结果数据 */
        serialize(respn: any): boolean {
            return false;
        }

        unserialize(respn: any): boolean {
            return true;
        }

        /** 返回的数据 */
        code: number;
        message: string;

        /** 超时 s，默认不使用改特性 */
        timeout: Interval = 0;
        private _tmr_timeout: any;

        /** 超时当作失败，因为默认的超时有可能是因为这个接口本来就跑的很久，并且通常的超时提示用户也没什么意义，所以先设计为由业务层设置该功能，如果为 true，则当超时时会发送 SignalFailed */
        timeoutAsFailed: boolean;

        // 静默
        quiet: boolean;

        /** 用于调试的数据 */
        protected urlForLog(): string {
            return this.url();
        }

        protected fieldsForLog(): KvObject<string> {
            return this.fields();
        }

        // 开始拉数据
        __mdl_start() {
            // 输出日志
            if (VERBOSE) {
                let str = this.urlForLog();
                let flds = this.fieldsForLog();
                if (nn.ObjectT.IsEmpty(flds) == false) {
                    str += ' >> ' + URL.MapToField(flds);
                }
                log("API " + this.action + " 请求 " + str);
            }

            if (this.showWaiting)
                Hud.ShowProgress();

            // 启动超时计时器
            if (this.timeout) {
                this._tmr_timeout = Delay(this.timeout, () => {
                    this.__mdl_timeout();
                });
            }

            this.signals.emit(SignalStart);
        }

        // 获取数据成功
        __mdl_completed(e: any) {
            let data = this._urlreq ? this._urlreq.data : e;

            // 判断是否需要从 json 转换回来
            if (typeof (data) == 'string') {
                try {
                    this.response = JSON.parse(data);
                } catch (err) {
                    exception(err);
                }
            } else {
                this.response = data;
            }

            this.processResponse();
            this.__mdl_end();
        }

        // 获取数据失败
        __mdl_failed(e: Slot) {
            // 设置网路错误的id
            this.code = ERROR_NETWORK_FAILED;

            let tn = new SlotTunnel();
            this.signals.emit(SignalFailed, e.data, tn);
            if (!tn.veto && this.session)
                this.session.signals.emit(SignalFailed, this, tn);

            // 如果业务层阻塞掉该信号，则不转发
            if (!tn.veto && this.showError) {
                let str = ISDEBUG ?
                    'API ' + this.action + ' 请求服务器失败' :
                    '请检查网络设置';
                Hud.Error(str);
            }

            this.__mdl_end();
        }

        __mdl_timeout() {
            if (VERBOSE)
                log('API ' + this.action + ' 超时');

            if (this.isDebug) {
                this.signals.emit(SignalSucceed);
                if (this.session)
                    this.session.signals.emit(SignalSucceed, this);
            } else {
                if (this.timeoutAsFailed) {
                    this.signals.emit(SignalFailed);
                    if (this.session)
                        this.session.signals.emit(SignalFailed, this);
                }

                this.signals.emit(SignalTimeout);
                if (this.session)
                    this.session.signals.emit(SignalTimeout, this);
            }

            this.__mdl_end();
        }

        // 处理结束
        __mdl_end() {
            this.clear();

            this.signals.emit(SignalEnd);
            if (this.session)
                this.session.signals.emit(SignalEnd, this);

            if (this.showWaiting)
                Hud.HideProgress();

            // 调用完成，析构对象
            this.drop();
        }

        responseCode(): number {
            if ('code' in this.response)
                return this.response.code;
            else if ('1' in this.response)
                return this.response[1];
            return -1;
        }

        responseMessage(): string {
            if ('message' in this.response)
                return this.response.message;
            else if ('2' in this.response)
                return this.response[2];
            return "从服务器没有获取到数据";
        }

        // 处理接收到的数据
        processResponse() {
            this.code = this.responseCode();
            this.message = this.responseMessage();

            if (VERBOSE)
                log('API ' + this.action + ' 返回 ' + JSON.stringify(this.response));

            this.cacheUpdated = false;
            if ((this.succeed = this.isSucceed())) {
                if (VERBOSE)
                    log('API ' + this.action + ' 请求成功');

                if (this.cacheTime && this.cacheFlush) {
                    this.cacheUpdated = true;
                    // 添加到缓存中
                    Memcache.shared.cache(this);
                }

                this.unserialize(this.response);
                if (!this.quiet) {
                    this.signals.emit(SignalSucceed, this);
                    if (this.session)
                        this.session.signals.emit(SignalSucceed, this);
                }
            } else {
                warn('API ' + this.action + ' ' + asString(this.message));

                let tn = new SlotTunnel();
                if (this.isDebug) {
                    if (!this.quiet) {
                        this.signals.emit(SignalSucceed, this);
                        if (this.session)
                            this.session.signals.emit(SignalSucceed, this);
                    }
                } else {
                    this.signals.emit(SignalFailed, this, tn);
                    if (!tn.veto && this.session)
                        this.session.signals.emit(SignalFailed, this, tn);
                }

                // 业务层可以拦截处理
                if (!tn.veto && this.showError && this.message)
                    Hud.Error(this.message);
            }
        }

        protected clear() {
            // 释放连接
            this._urlreq = drop(this._urlreq);
            this._urlreq = undefined;

            // 释放超时判定
            if (this._tmr_timeout) {
                this._tmr_timeout.stop();
                this._tmr_timeout = undefined;
            }

            this.session = null;
        }

        _urlreq: CHttpConnector;

        /** 调用的时间 */
        ts: number;
    }

    /** 支持分页的model */
    export class PagedModel<ItemT> {
        constructor() {
        }

        // 添加页数据
        add(page: any, items: Array<ItemT>) {
            this.changed = false;
            if (this._items.contains(page))
                return;
            // 如果items为空，则也不加入，为了下一次同页面刷新
            if (items.length == 0)
                return;
            this.changed = true;
            this._items.add(page, items);
            this.page = page;
        }

        // 是否页面数据发生改变
        changed: boolean;

        // 当前页的标记
        page: any = 0;

        // 所有分页的数据
        private _items = new nn.IndexedMap<any, Array<ItemT>>();

        // 获得当前页面的items
        get items(): Array<ItemT> {
            return this._items.objectForKey(this.page);
        }

        // 所有页面的对象
        get allItems(): Array<ItemT> {
            let r = [];
            this._items.forEach((k: any, o: Array<ItemT>) => {
                nn.ArrayT.PushObjects(r, o);
            });
            return r;
        }

        // 前一页面
        previous(): boolean {
            let idx = this._items.indexOfKey(this.page);
            if (idx == 0)
                return false;
            this.page = this._items.keyForIndex(idx - 1);
            return true;
        }

        // 后一页，如果返回false，则需要去查询有没有后一页
        next(): boolean {
            let idx = this._items.indexOfKey(this.page);
            let k = this._items.keyForIndex(idx + 1);
            if (k == null)
                return false;
            this.page = k;
            return true;
        }
    }
}

// 支持nnt.logic导出的模型

namespace app.models {

    // 用int来表示float
    export class IntFloat {

        constructor(ori: number = 0, s: number = 1) {
            this._ori = ori | 0;
            this._s = s;
            this._value = ori / s;
        }

        static Money(ori: number = 0): IntFloat {
            return new IntFloat(ori, 100);
        }

        static Percentage(ori: number = 0): IntFloat {
            return new IntFloat(ori, 10000);
        }

        static Origin(ori: intfloat): number {
            if (ori instanceof IntFloat)
                return ori.origin;
            throw new Error('对一个不是IntFloat的数据请求Origin');
        }

        static From(ori: intfloat, scale: number): IntFloat {
            if (ori instanceof IntFloat) {
                return new IntFloat(ori.origin, scale);
            }
            return new IntFloat(ori, scale);
        }

        static FromValue(val: intfloat, scale: number): IntFloat {
            if (val instanceof IntFloat) {
                return new IntFloat(val.origin, scale);
            }
            return new IntFloat(0, scale).setValue(val);
        }

        static Multiply(l: intfloat, r: number): intfloat {
            if (l instanceof IntFloat) {
                return l.clone().multiply(r);
            }
            throw new Error('对一个不是IntFloat的数据进行multiply操作');
        }

        static Add(l: intfloat, r: number): intfloat {
            if (l instanceof IntFloat) {
                return l.clone().add(r);
            }
            throw new Error('对一个不是IntFloat的数据进行multiply操作');
        }

        valueOf(): number {
            return this._value;
        }

        toString(): string {
            return this._value.toString();
        }

        // 缩放后的数据，代表真实值
        get value(): number {
            return this._value;
        }

        set value(v: number) {
            this._value = v;
            this._ori = (v * this._s) | 0;
        }

        setValue(v: number): IntFloat {
            this.value = v;
            return this;
        }

        // 缩放前的数据
        get origin(): number {
            return this._ori;
        }

        set origin(ori: number) {
            this._ori = ori | 0;
            this._value = ori / this._s;
        }

        get scale(): number {
            return this._s;
        }

        toNumber(): number {
            return this.value;
        }

        toDouble(): number {
            return this.value;
        }

        toInt(): number {
            return this.value | 0;
        }

        toBoolean(): boolean {
            return this.value != 0;
        }

        add(r: number): this {
            this.value += r;
            return this;
        }

        multiply(r: number): this {
            this.value *= r;
            return this;
        }

        clone(): IntFloat {
            return new IntFloat(this._ori, this._s);
        }

        private _value: number; // 最终表示的float
        private _ori: number; // 当前的int
        private _s: number; // 缩放数值
    }

    export type intfloat = IntFloat | number;
}

namespace app.models.logic {


    import toInt = nn.toInt;
    import MapString = nn.MapString;
    import MapNumber = nn.MapNumber;
    import MapBoolean = nn.MapBoolean;
    type Class<T> = { new(...args: any[]): T, [key: string]: any };
    type AnyClass = Class<any>;
    type clazz_type = AnyClass | string;
    type IndexedObject = { [key: string]: any };

    interface FieldOption {
        // 唯一序号，后续类似pb的协议会使用id来做数据版本兼容
        id: number;

        // 默认值
        val?: any;

        // 可选
        optional: boolean;

        // 读取控制
        input: boolean;
        output: boolean;

        // 类型标签
        array?: boolean;
        map?: boolean;
        multimap?: boolean;
        string?: boolean;
        integer?: boolean;
        double?: boolean;
        number?: boolean;
        boolean?: boolean;
        enum?: boolean;
        file?: boolean;
        json?: boolean;
        intfloat?: number;

        // 注释
        comment?: string;

        // 关联类型
        keytype?: clazz_type;
        valtype?: clazz_type;
    }

    const FP_KEY = "__fieldproto";

    function CloneFps(fps: IndexedObject): IndexedObject {
        let r: IndexedObject = {};
        for (let k in fps) {
            r[k] = LightClone(fps[k]);
        }
        return r;
    }

    function LightClone(tgt: any): any {
        let r: IndexedObject = {};
        for (let k in tgt) {
            r[k] = tgt[k];
        }
        return r;
    }

    function DefineFp(target: any, key: string, fp: FieldOption) {
        let fps: IndexedObject;
        if (target.hasOwnProperty(FP_KEY)) {
            fps = target[FP_KEY];
        } else {
            if (FP_KEY in target) {
                fps = CloneFps(target[FP_KEY]);
                for (let k in fps) {
                    let fp: FieldOption = fps[k];
                    fp.id *= 100;
                }
            } else {
                fps = {};
            }
            Object.defineProperty(target, FP_KEY, {
                enumerable: false,
                get: () => {
                    return fps;
                }
            });
        }
        fps[key] = fp;
        Object.defineProperty(target, key, {
            value: fp.val,
            writable: true
        });
        // 生成get/set方法，便于客户端连写
        let proto = target.constructor.prototype;
        let nm = nn.StringT.UpcaseFirst(key);
        proto["get" + nm] = function () {
            return this[key];
        };
        proto["set" + nm] = function (val: any) {
            this[key] = val;
            return this;
        };
    }

    // 从base中copy
    const string_t = "string";
    const integer_t = "integer";
    const double_t = "double";
    const number_t = "number";
    const boolean_t = "boolean";

    function toBoolean(v: any): boolean {
        if (v == "true")
            return true;
        else if (v == "false")
            return false;
        return !!v;
    }

    // 填数据
    function Decode(mdl: any, params: any) {
        let fps = mdl[FP_KEY];
        if (!fps)
            return;
        for (let key in params) {
            let fp: FieldOption = fps[key];
            if (fp == null) // 注意这边和core/proto有些不同，不去判断input的类型
                continue;
            let val = params[key];
            if (fp.valtype) {
                if (fp.array) {
                    let arr = new Array();
                    if (val) {
                        if (typeof (fp.valtype) == "string") {
                            if (fp.valtype == string_t) {
                                val.forEach(e => {
                                    arr.push(nn.asString(e));
                                });
                            } else if (fp.valtype == integer_t) {
                                val.forEach(e => {
                                    arr.push(nn.toInt(e));
                                });
                            } else if (fp.valtype == double_t) {
                                val.forEach(e => {
                                    arr.push(nn.toDouble(e));
                                });
                            } else if (fp.valtype == number_t) {
                                val.forEach(e => {
                                    arr.push(nn.toNumber(e));
                                });
                            } else if (fp.valtype == boolean_t) {
                                val.forEach(e => {
                                    arr.push(!!e);
                                });
                            }
                        } else {
                            if (fp.valtype == Object) {
                                val.forEach(e => {
                                    arr.push(e);
                                });
                            } else {
                                let clz: any = fp.valtype;
                                val.forEach(e => {
                                    if (e == null) {
                                        arr.push(null);
                                    } else {
                                        let t = new clz();
                                        Decode(t, e);
                                        arr.push(t);
                                    }
                                });
                            }
                        }
                    }
                    mdl[key] = arr;
                } else if (fp.map) {
                    let keyconv = (v: any) => {
                        return v
                    };
                    if (fp.keytype == integer_t)
                        keyconv = nn.toInt;
                    else if (fp.keytype == double_t)
                        keyconv = nn.toDouble;
                    else if (fp.keytype == number_t)
                        keyconv = nn.toNumber;
                    let map: any;
                    if (val) {
                        if (typeof (fp.valtype) == "string") {
                            if (fp.valtype == string_t) {
                                map = new MapString();
                                for (let ek in val) {
                                    let ev = val[ek];
                                    map.set(keyconv(ek), nn.asString(ev));
                                }
                            } else if (fp.valtype == integer_t) {
                                map = new MapNumber();
                                for (let ek in val) {
                                    let ev = val[ek];
                                    map.set(keyconv(ek), nn.toInt(ev));
                                }
                            } else if (fp.valtype == double_t) {
                                map = new MapNumber();
                                for (let ek in val) {
                                    let ev = val[ek];
                                    map.set(keyconv(ek), nn.toDouble(ev));
                                }
                            } else if (fp.valtype == number_t) {
                                map = new MapNumber();
                                for (let ek in val) {
                                    let ev = val[ek];
                                    map.set(keyconv(ek), nn.toNumber(ev));
                                }
                            } else if (fp.valtype == boolean_t) {
                                map = new MapBoolean();
                                for (let ek in val) {
                                    let ev = val[ek];
                                    map.set(keyconv(ek), !!ev);
                                }
                            }
                        } else {
                            map = new Map();
                            let clz: any = fp.valtype;
                            for (let ek in val) {
                                let ev = val[ek];
                                if (ev == null) {
                                    map.set(keyconv(ek), null);
                                } else {
                                    let t = new clz();
                                    Decode(t, ev);
                                    map.set(keyconv(ek), t);
                                }
                            }
                        }
                    } else {
                        map = new Map();
                    }
                    mdl[key] = map;
                } else if (fp.multimap) {
                    let keyconv = (v: any) => {
                        return v
                    };
                    if (fp.keytype == integer_t)
                        keyconv = nn.toInt;
                    else if (fp.keytype == double_t)
                        keyconv = nn.toDouble;
                    else if (fp.keytype == number_t)
                        keyconv = nn.toNumber;
                    let mmap = new nn.MultiMap<any, any>();
                    if (val) {
                        if (typeof (fp.valtype) == "string") {
                            if (fp.valtype == string_t) {
                                for (let ek in val) {
                                    let ev = val[ek];
                                    mmap.set(keyconv(ek), nn.ArrayT.Convert(ev, e => nn.asString(e)));
                                }
                            } else if (fp.valtype == integer_t) {
                                for (let ek in val) {
                                    let ev = val[ek];
                                    mmap.set(keyconv(ek), nn.ArrayT.Convert(ev, e => nn.toInt(e)));
                                }
                            } else if (fp.valtype == double_t) {
                                for (let ek in val) {
                                    let ev = val[ek];
                                    mmap.set(keyconv(ek), nn.ArrayT.Convert(ev, e => nn.toDouble(e)));
                                }
                            } else if (fp.valtype == number_t) {
                                for (let ek in val) {
                                    let ev = val[ek];
                                    mmap.set(keyconv(ek), nn.ArrayT.Convert(ev, e => nn.toNumber(e)));
                                }
                            } else if (fp.valtype == boolean_t) {
                                for (let ek in val) {
                                    let ev = val[ek];
                                    mmap.set(keyconv(ek), nn.ArrayT.Convert(ev, e => !!e));
                                }
                            }
                        } else {
                            let clz: any = fp.valtype;
                            for (let ek in val) {
                                let ev = val[ek];
                                mmap.set(keyconv(ek), nn.ArrayT.Convert(ev, e => {
                                    let t = new clz();
                                    Decode(t, e);
                                    return t;
                                }));
                            }
                        }
                    }
                    mdl[key] = mmap;
                } else if (fp.enum) {
                    mdl[key] = val ? parseInt(val) : 0;
                } else if (fp.valtype == Object) {
                    mdl[key] = val;
                } else if (val) {
                    let clz: any = fp.valtype;
                    let t = new clz();
                    Decode(t, val);
                    mdl[key] = t;
                }
            } else {
                if (fp.string)
                    mdl[key] = nn.asString(val);
                else if (fp.integer)
                    mdl[key] = nn.toInt(val);
                else if (fp.double)
                    mdl[key] = nn.toDouble(val);
                else if (fp.number)
                    mdl[key] = nn.toNumber(val);
                else if (fp.boolean)
                    mdl[key] = toBoolean(val);
                else if (fp.json)
                    mdl[key] = val;
                else if (fp.file)
                    mdl[key] = val;
                else if (fp.intfloat)
                    mdl[key] = IntFloat.From(toInt(val), fp.intfloat);
            }
        }
        // 处理内置参数
        if ("_mid" in params)
            mdl["_mid"] = params["_mid"];
    }

    // 把所有input的数据拿出来
    function Encode(mdl: any): any {
        let fps = mdl[FP_KEY];
        if (fps == null)
            return null;
        let r: IndexedObject = {};
        for (let key in fps) {
            let fp: FieldOption = fps[key];
            if (!fp.input || !mdl.hasOwnProperty(key))
                continue;
            let v = mdl[key];
            if (v == null)
                continue;
            // 如果是对象，则需要在encode一次
            if (fp.valtype && !fp.enum && typeof fp.valtype != "string") {
                r[key] = JSON.stringify(Encode(v));
            } else if (fp.intfloat) {
                r[key] = IntFloat.FromValue(v, fp.intfloat).origin;
            } else {
                r[key] = v;
            }
        }
        return r;
    }

    // 收集model的输出
    function Output(mdl: any): any {
        if (!mdl)
            return {};
        let fps = mdl[FP_KEY];
        let r: IndexedObject = {};
        for (let fk in fps) {
            let fp: FieldOption = fps[fk];
            if (!fp.output)
                continue;
            let val = mdl[fk];
            if (fp.valtype) {
                if (fp.array) {
                    // 通用类型，则直接可以输出
                    if (typeof (fp.valtype) == "string") {
                        r[fk] = val;
                    } else {
                        // 特殊类型，需要迭代进去
                        let arr = new Array();
                        val && val.forEach(e => {
                            arr.push(Output(e));
                        });
                        r[fk] = arr;
                    }
                } else if (fp.map) {
                    let m: IndexedObject = {};
                    if (val) {
                        if (typeof (fp.valtype) == "string") {
                            val.forEach((v, k) => {
                                m[k] = v;
                            });
                        } else {
                            val.forEach((v, k) => {
                                m[k] = Output(v);
                            });
                        }
                    }
                    r[fk] = m;
                } else if (fp.multimap) {
                    let m: IndexedObject = {};
                    if (val) {
                        if (typeof (fp.valtype) == "string") {
                            val.forEach((v, k) => {
                                m[k] = v;
                            });
                        } else {
                            val.forEach((v, k) => {
                                m[k] = nn.ArrayT.Convert(v, e => Output(e));
                            });
                        }
                    }
                    r[fk] = m;
                } else if (fp.valtype == Object) {
                    r[fk] = val;
                } else {
                    r[fk] = Output(val);
                }
            } else if (fp.intfloat) {
                r[fk] = IntFloat.Origin(val);
            } else {
                r[fk] = val;
            }
        }
        return r;
    }

    export abstract class Base extends nn.Model {

        // --------------从core.proto中移植过来的
        static string_t = "string";
        static integer_t = "integer";
        static double_t = "double";
        static number_t = "number";
        static boolean_t = "boolean";

        // 可选的参数
        static optional = "optional";

        // 必须的参数，不提供则忽略
        static required = "required";

        // 输入输出
        static input = "input";
        static output = "output";

        static field(id: number, opts: string[], comment?: string): FieldOption {
            return {
                id: id,
                input: opts.indexOf(Base.input) != -1,
                output: opts.indexOf(Base.output) != -1,
                optional: opts.indexOf(Base.optional) != -1,
                comment: comment
            };
        }

        static string(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
            let fp = this.field(id, opts, comment);
            fp.string = true;
            return (target: any, key: string) => {
                DefineFp(target, key, fp);
            };
        }

        static boolean(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
            let fp = this.field(id, opts, comment);
            fp.boolean = true;
            return (target: any, key: string) => {
                DefineFp(target, key, fp);
            };
        }

        static integer(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
            let fp = this.field(id, opts, comment);
            fp.integer = true;
            return (target: any, key: string) => {
                DefineFp(target, key, fp);
            };
        }

        static double(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
            let fp = this.field(id, opts, comment);
            fp.double = true;
            return (target: any, key: string) => {
                DefineFp(target, key, fp);
            };
        }

        static number(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
            let fp = this.field(id, opts, comment);
            fp.number = true;
            return (target: any, key: string) => {
                DefineFp(target, key, fp);
            };
        }

        static intfloat(id: number, scale: number, opts: string[], comment?: string): (target: any, key: string) => void {
            let fp = this.field(id, opts, comment);
            fp.intfloat = scale;
            return (target: any, key: string) => {
                DefineFp(target, key, fp);
            };
        }

        // 定义数组
        static array(id: number, clz: clazz_type, opts: string[], comment?: string): (target: any, key: string) => void {
            let fp = this.field(id, opts, comment);
            fp.array = true;
            fp.valtype = clz;
            return (target: any, key: string) => {
                DefineFp(target, key, fp);
            };
        }

        // 定义映射表
        static map(id: number, keytyp: clazz_type, valtyp: clazz_type, opts: string[], comment?: string): (target: any, key: string) => void {
            let fp = this.field(id, opts, comment);
            fp.map = true;
            fp.keytype = keytyp;
            fp.valtype = valtyp;
            return (target: any, key: string) => {
                DefineFp(target, key, fp);
            };
        }

        static multimap(id: number, keytyp: clazz_type, valtyp: clazz_type, opts: string[], comment?: string): (target: any, key: string) => void {
            let fp = this.field(id, opts, comment);
            fp.multimap = true;
            fp.keytype = keytyp;
            fp.valtype = valtyp;
            return (target: any, key: string) => {
                DefineFp(target, key, fp);
            };
        }

        // json对象
        static json(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
            let fp = this.field(id, opts, comment);
            fp.json = true;
            return (target: any, key: string) => {
                DefineFp(target, key, fp);
            };
        }

        // 使用其他类型
        static type(id: number, clz: clazz_type, opts: string[], comment?: string): (target: any, key: string) => void {
            let fp = this.field(id, opts, comment);
            fp.valtype = clz;
            return (target: any, key: string) => {
                DefineFp(target, key, fp);
            };
        }

        // 枚举
        static enumerate(id: number, clz: any, opts: string[], comment?: string): (target: any, key: string) => void {
            let fp = this.field(id, opts, comment);
            fp.enum = true;
            fp.valtype = clz;
            return (target: any, key: string) => {
                DefineFp(target, key, fp);
            };
        }

        // 文件类型
        static file(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
            let fp = this.field(id, opts, comment);
            fp.file = true;
            return (target: any, key: string) => {
                DefineFp(target, key, fp);
            };
        }

        fields(): nn.KvObject<string> {
            return Encode(this);
        }

        unserialize(respn: any): boolean {
            Decode(this, respn.data || {});
            return true;
        }

        responseCode(): number {
            return this.response.code;
        }

        responseMessage(): string {
            return this.response.data;
        }
    }
}

namespace app.api {

    // 构造一个请求对象
    export function NewRequest<T extends models.logic.Base>(req: any): T {
        let clz: any = req[1];
        let r = new clz();
        r.action = req[0];
        return r;
    }
}
