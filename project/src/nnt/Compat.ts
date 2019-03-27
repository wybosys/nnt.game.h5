var __PROTO: any = Date.prototype;
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

// 微信
declare var wx: any;
let IS_WEIXIN_MINGAME = typeof wx != "undefined";

// 百度
declare var swan: any;
let IS_BAIDU_MINGAME = typeof swan != "undefined";

// 是否是小游戏
let IS_MINGAME = IS_WEIXIN_MINGAME || IS_BAIDU_MINGAME;

module js {

    export let siteUrl = location.href;

    export function str_repeat(i, m) {
        for (var o = []; m > 0; o[--m] = i) ;
        return o.join('');
    }

    export function printf() {
        var i = 0, a;

        // 转换一下传入得数据，避免类型不匹配报错
        let args = [];
        if (arguments.length) {
            let t = arguments[0];
            args.push(t == null ? '' : t.toString());
            for (let i = 1, l = arguments.length; i < l; ++i) {
                args.push(arguments[i].valueOf());
            }
        } else {
            return;
        }

        var f = args[i++];
        var o = [], m, p, c, x, s = '';
        while (f) {
            if ((m = /^[^\x25]+/.exec(f))) {
                o.push(m[0]);
            } else if ((m = /^\x25{2}/.exec(f))) {
                o.push('%');
            } else if ((m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f))) {
                if (((a = args[m[1] || i++]) == null) || (a == undefined)) {
                    throw('Too few arguments.');
                }
                if (/[^s]/.test(m[7]) && (typeof (a) != 'number')) {
                    throw('Expecting number but found ' + typeof (a));
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
            } else {
                throw('Huh ?!');
            }
            f = f.substring(m[0].length);
        }
        return o.join('');
    }

    export function guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    export function uuid(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
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
    }

    export function getBrowserSize() {
        if (nn.ISNATIVE) {
            return {
                width: 720,
                height: 1280
            };
        }

        var intH = 0;
        var intW = 0;
        if (document.documentElement &&
            (document.documentElement.clientWidth ||
                document.documentElement.clientHeight)) {
            intH = document.documentElement.clientHeight;
            intW = document.documentElement.clientWidth;
        } else if (document.body &&
            (document.body.clientWidth || document.body.clientHeight)) {
            if (document.body.scrollHeight > document.body.clientHeight) {
                intH = document.body.scrollHeight;
                intW = document.body.scrollWidth;
            } else {
                intH = document.body.clientHeight;
                intW = document.body.clientWidth;
            }
        } else if (typeof window.innerWidth == 'number') {
            intH = window.innerHeight;
            intW = window.innerWidth;
        }

        return {
            width: intW,
            height: intH
        };
    }

    export function getScreenSize() {
        if (nn.ISNATIVE) {
            return {
                width: 720,
                height: 1280
            };
        }

        if (typeof window.screen == 'undefined')
            return getBrowserSize();
        var intW = window.screen.width;
        var intH = window.screen.height;
        return {
            width: intW,
            height: intH
        };
    }

    export function getBrowserOrientation() {
        var orientation;
        //orientation = window.orientation;
        //if (orientation == undefined) {
        var sz = getBrowserSize();
        if (sz.width >= sz.height)
            orientation = 90;
        else
            orientation = 0;
        //}
        return orientation;
    }

    export function hashKey(o) {
        if (o == null)
            return null;
        var tp = typeof (o);
        if (tp == 'string' || tp == 'number' || tp == 'function')
            return o;
        if (o.hashCode)
            return o.hashCode;
        return o.toString();
    }

    export function GetArguments(arg) {
        var r = [];
        var l = arg.length;
        for (var i = 0; i < l; ++i)
            r.push(arg[i]);
        return r;
    }

    export function OverrideGetSet(cls, name, oset, ounset) {
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

    export function OverrideFunction(cls, funm, of) {
        var impl = cls[funm];
        cls[funm] = function () {
            return of.apply(this, [impl].concat(GetArguments(arguments)));
        };
    }

    export function enterFullscreen(e: any) {
        if (e.requestFullscreen) {
            e.requestFullscreen();
        } else if (e.mozRequestFullScreen) {
            e.mozRequestFullScreen();
        } else if (e.webkitRequestFullscreen) {
            e.webkitRequestFullscreen();
        } else if (e.msRequestFullscreen) {
            e.msRequestFullscreen();
        }
    }

    export function exitFullscreen() {
        var e: any = document;
        if (e.exitFullscreen) {
            e.exitFullscreen();
        } else if (e.mozCancelFullScreen) {
            e.mozCancelFullScreen();
        } else if (e.webkitExitFullscreen) {
            e.webkitExitFullscreen();
        }
    }

    export function isFullscreen() {
        var e: any = document;
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

    export function loadScripts(list, cb, ctx) {
        var loaded = 0;
        var loadNext = function () {
            loadScript(list[loaded], function () {
                loaded++;
                if (loaded >= list.length) {
                    cb.call(ctx);
                } else {
                    loadNext();
                }
            }, this);
        };
        loadNext();
    }

    export function loadScript(src, cb, ctx) {
        if (IS_MINGAME) {
            console.info("小程序不支持通过url动态加载JS代码，请确保已经打包到项目中: " + src);
            cb.call(ctx);
        } else {
            var s: any = document.createElement('script');
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
    }

    export function loadStyles(list, cb, ctx) {
        var loaded = 0;
        var loadNext = function () {
            loadStyle(list[loaded], function () {
                loaded++;
                if (loaded >= list.length) {
                    cb.call(ctx);
                } else {
                    loadNext();
                }
            }, this);
        };
        loadNext();
    }

    export function loadStyle(src, cb, ctx) {
        if (IS_MINGAME) {
            console.info("小程序不支持动态加载样式 " + src);
        } else {
            var s: any = document.createElement('link');
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
    }

    export const enum SOURCETYPE {
        JS = 0,
        CSS = 1,
    }

    export function loadSources(list, cb, ctx) {
        var loaded = 0;
        var loadNext = function () {
            loadSource(list[loaded], function () {
                loaded++;
                if (loaded >= list.length) {
                    cb.call(ctx);
                } else {
                    loadNext();
                }
            }, this);
        };
        loadNext();
    }

    export function loadSource(src, cb, ctx) {
        if (src[1] == 0)
            loadScript(src[0], cb, ctx);
        else if (src[1] == 1)
            loadStyle(src[0], cb, ctx);
        else
            cb.call(ctx);
    }
}

class Multimap<K, V> {

    get(k: K): Array<V> {
        return this._store.get(k);
    }

    set(k: K, arr: V[]) {
        this._store.set(k, arr);
    }

    push(k: K, v: V) {
        let arr = this._store.get(k);
        if (arr == null) {
            arr = new Array<V>();
            this._store.set(k, arr);
        }
        arr.push(v);
    }

    forEach(proc: (vs: V[], k: K) => void) {
        this._store.forEach(proc);
    }

    clear() {
        this._store.clear();
    }

    keys(): Iterator<K> {
        return this._store.keys();
    }

    entries(): Iterator<[K, Array<V>]> {
        return this._store.entries();
    }

    private _store = new Map<K, Array<V>>();
}

// 微信兼容层
if (IS_WEIXIN_MINGAME) {

    // 实现alert
    window.alert = (msg: string) => {
        wx.showModal({
            title: '警告',
            content: msg,
            success: function (res) {
                if (res.confirm) {
                    // pass
                }
            }
        });
    };

    // 实现localstorage
    window.localStorage.getItem = (key: string): string => {
        try {
            return wx.getStorageSync(key);
        } catch (e) {
        }
        return undefined;
    };

    window.localStorage.setItem = (key: string, val: any) => {
        try {
            wx.setStorageSync(key, val);
        } catch (e) {
        }
    };

    window.localStorage.removeItem = (key: string) => {
        try {
            wx.removeStorageSync(key);
        } catch (e) {
        }
    };

    window.localStorage.clear = () => {
        try {
            wx.clearStorageSync();
        } catch (e) {
        }
    };
}

// 百度兼容层
if (IS_BAIDU_MINGAME) {

    // 实现alert
    window.alert = (msg: string) => {
        swan.showModal({
            title: '警告',
            content: msg,
            success: function (res) {
                if (res.confirm) {
                    // pass
                }
            }
        });
    };

    // 实现localstorage
    window.localStorage.getItem = (key: string): string => {
        try {
            return swan.getStorageSync(key);
        } catch (e) {
        }
        return undefined;
    };

    window.localStorage.setItem = (key: string, val: any) => {
        try {
            swan.setStorageSync(key, val);
        } catch (e) {
        }
    };

    window.localStorage.removeItem = (key: string) => {
        try {
            swan.removeStorageSync(key);
        } catch (e) {
        }
    };

    window.localStorage.clear = () => {
        try {
            swan.clearStorageSync();
        } catch (e) {
        }
    };

}
