namespace Js {

    export var siteUrl: string = location.href;

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

    function str_repeat(i, m) {
        for (var o = []; m > 0; o[--m] = i) ;
        return o.join('');
    }

    export var printf = function () {
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
                    throw('Too few arguments.');
                }
                if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
                    throw('Expecting number but found ' + typeof(a));
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
                throw('Huh ?!');
            }
            f = f.substring(m[0].length);
        }
        return o.join('');
    }

    export var guid = function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    export var uuid = function (len, radix) {
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

    export var getBrowserSize = function () {
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

        return {
            width: intW,
            height: intH
        };
    }

    export var getScreenSize = function () {
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

    export var getBrowserOrientation = function () {
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

    export var hashKey = function (o) {
        if (o == null)
            return null;
        var tp = typeof(o);
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
    };

    export function exitFullscreen() {
        var e: any = document;
        if (e.exitFullscreen) {
            e.exitFullscreen();
        } else if (e.mozCancelFullScreen) {
            e.mozCancelFullScreen();
        } else if (e.webkitExitFullscreen) {
            e.webkitExitFullscreen();
        }
    };

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
    };

    declare var Base64;
    declare var btoa;
    declare var atob;
    declare var utob;
    declare var btou;

    // base64
    (function (global: any) {
        'use strict';
        // existing version for noConflict()
        var _Base64 = global.Base64;
        var version = "2.1.9";
        // constants
        var b64chars
            = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var b64tab = function (bin) {
            var t = {};
            for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
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
            } else {
                var cc: any = 0x10000
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
            var padlen = [0, 2, 1][ccc.length % 3],
                ord = ccc.charCodeAt(0) << 16
                    | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
                    | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
                chars = [
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
            : function (u) {
                return btoa(utob(u));
            }
        ;
        var encode = function (u, urisafe) {
            return !urisafe
                ? _encode(String(u))
                : _encode(String(u)).replace(/[+\/]/g, function (m0) {
                    return m0 == '+' ? '-' : '_';
                }).replace(/=/g, '');
        };
        var encodeURI = function (u) {
            return encode(u, true);
        };
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
                        | (0x3f & cccc.charCodeAt(3)),
                        offset = cp - 0x10000;
                    return (fromCharCode((offset >>> 10) + 0xD800)
                        + fromCharCode((offset & 0x3FF) + 0xDC00));
                case 3:
                    return fromCharCode(
                        ((0x0f & cccc.charCodeAt(0)) << 12)
                        | ((0x3f & cccc.charCodeAt(1)) << 6)
                        | (0x3f & cccc.charCodeAt(2))
                    );
                default:
                    return fromCharCode(
                        ((0x1f & cccc.charCodeAt(0)) << 6)
                        | (0x3f & cccc.charCodeAt(1))
                    );
            }
        };
        var btou = function (b) {
            return b.replace(re_btou, cb_btou);
        };
        var cb_decode = function (cccc) {
            var len = cccc.length,
                padlen = len % 4,
                n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
                    | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
                    | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0)
                    | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
                chars = [
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
            : function (a) {
                return btou(atob(a));
            };
        var decode = function (a) {
            return _decode(
                String(a).replace(/[-_]/g, function (m0) {
                    return m0 == '-' ? '+' : '/';
                })
                    .replace(/[^A-Za-z0-9\+\/]/g, '')
            );
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
                return {value: v, enumerable: false, writable: true, configurable: true};
            };
            global.Base64.extendString = function () {
                Object.defineProperty(
                    String.prototype, 'fromBase64', noEnum(function () {
                        return decode(this);
                    }));
                Object.defineProperty(
                    String.prototype, 'toBase64', noEnum(function (urisafe) {
                        return encode(this, urisafe);
                    }));
                Object.defineProperty(
                    String.prototype, 'toBase64URI', noEnum(function () {
                        return encode(this, true);
                    }));
            };
        }

        // that's it!
        if (global['Meteor']) {
            Base64 = global.Base64; // for normal export in Meteor.js
        }

        if (typeof(btoa) == 'undefined')
            btoa = global.Base64.btoa;
        if (typeof(atob) == 'undefined')
            atob = global.Base64.atob;
        if (typeof(utob) == 'undefined')
            utob = global.Base64.utob;
        if (typeof(btou) == 'undefined')
            btou = global.Base64.btou;
    })({});

    export function loadScripts(list, cb, ctx) {
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

    export function loadScript(src, cb, ctx) {
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

    export function loadStyles(list, cb, ctx) {
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

    export function loadStyle(src, cb, ctx) {
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

    export const enum SOURCETYPE {
        JS = 0,
        CSS = 1,
    };

    export function loadSources(list, cb, ctx) {
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

    export function loadSource(src, cb, ctx) {
        if (src[1] == 0)
            loadScript(src[0], cb, ctx);
        else if (src[1] == 1)
            loadStyle(src[0], cb, ctx);
        else
            cb.call(ctx);
    }

    export function stacktrace() {
        var callstack = [];
        var isCallstackPopulated = false;
        try {
            var i: any = null;
            i.dont.exist += 0; //doesn't exist- that's the point
        } catch (e) {
            var win: any = window;
            if (e.stack) {
                var lines = e.stack.split('\n');
                for (var i: any = 0, len = lines.length; i < len; i++) {
                    var res = lines[i].match("at (.+)$");
                    if (res && res.length == 2) {
                        callstack.push(res[1]);
                    }
                }
                callstack.shift();
                isCallstackPopulated = true;
            }
            else if (win.opera && e.message) { //Opera
                var lines = e.message.split('\n');
                for (var i: any = 0, len = lines.length; i < len; i++) {
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

declare var wx: any;
export let IS_WEIXIN_MINGAME = typeof wx != "undefined";

// 如果是微信平台，则需要实现alert
if (IS_WEIXIN_MINGAME) {
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
}
