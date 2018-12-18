/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/embeded.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/embeded.ts":
/*!************************!*\
  !*** ./src/embeded.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var launcher_1 = __webpack_require__(/*! ./launcher */ "./src/launcher.ts");
var service_1 = __webpack_require__(/*! ./sdk/service */ "./src/sdk/service.ts");
var log_1 = __webpack_require__(/*! ./sdk/log */ "./src/sdk/log.ts");
var Embeded = (function (_super) {
    __extends(Embeded, _super);
    function Embeded() {
        var _this = _super.call(this) || this;
        _this.config.override({
            HOST: 'develop.91egame.com',
            HOSTNAME: '91yigame.com',
            URL: '91yigame.com',
            PROTOCOL: 'http:'
        });
        return _this;
    }
    Embeded.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var module, resp, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, service_1.Fetch('platform/open', 'channel.info', {
                                channelid: this.config.get('CHANNEL_ID'),
                                gameid: this.config.get('GAME_ID')
                            })];
                    case 1:
                        resp = _a.sent();
                        module = resp.name;
                        this.config.set('CHANNEL', module);
                        return [3, 3];
                    case 2:
                        err_1 = _a.sent();
                        this.log.error("sdk:init:" + err_1.code);
                        return [3, 3];
                    case 3: return [4, this.instanceChannel()];
                    case 4:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Embeded.prototype.require = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                log_1.log.error("embeded版SDK不能动态require模块 " + model);
                return [2];
            });
        });
    };
    return Embeded;
}(launcher_1.Launcher));
window["sdks"] = new Embeded();


/***/ }),

/***/ "./src/launcher.ts":
/*!*************************!*\
  !*** ./src/launcher.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __webpack_require__(/*! ./sdk/config */ "./src/sdk/config.ts");
var log_1 = __webpack_require__(/*! ./sdk/log */ "./src/sdk/log.ts");
var specific_1 = __webpack_require__(/*! ./sdk/specific */ "./src/sdk/specific.ts");
var Launcher = (function () {
    function Launcher() {
        this.config = config_1.config;
        this.log = log_1.log;
        this.specific = specific_1.specific;
    }
    Launcher.prototype.instanceChannel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var clazz;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clazz = window['CHANNEL_MODULE'];
                        this._channel = new clazz();
                        this._channel.launcher = this;
                        return [4, this._channel.init()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Object.defineProperty(Launcher.prototype, "channel", {
        get: function () {
            return this._channel;
        },
        enumerable: true,
        configurable: true
    });
    Launcher.prototype.userBriefInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this._channel.userBriefInfo()];
            });
        });
    };
    Launcher.prototype.userDetailInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this._channel.userDetailInfo()];
            });
        });
    };
    Launcher.prototype.share = function (m) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this._channel.share(m)];
            });
        });
    };
    Launcher.prototype.recharge = function (m) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this._channel.recharge(m)];
            });
        });
    };
    Launcher.prototype.feature = function (m) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, null];
            });
        });
    };
    return Launcher;
}());
exports.Launcher = Launcher;


/***/ }),

/***/ "./src/sdk/config.ts":
/*!***************************!*\
  !*** ./src/sdk/config.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = __webpack_require__(/*! ./core/global */ "./src/sdk/core/global.ts");
var Config = (function () {
    function Config() {
        this._cur = {};
    }
    Config.prototype.override = function (cfg) {
        for (var k in cfg) {
            this[k] = this._cur[k] = cfg[k];
        }
    };
    Config.prototype.host = function (host, cfg) {
        if (!this.HOSTNAME || !this.HOSTNAME.match(host))
            return;
        for (var k in cfg) {
            this[k] = this._cur[k] = cfg[k];
        }
    };
    Config.prototype.get = function (key, def) {
        return key in this._cur ? this._cur[key] : def;
    };
    Config.prototype.set = function (key, val) {
        this[key] = this._cur[key] = val;
    };
    Config.prototype.delete = function (key) {
        if (key in this._cur) {
            delete this._cur[key];
            delete this[key];
        }
    };
    Config.prototype.contains = function (key) {
        return key in this._cur;
    };
    return Config;
}());
exports.config = global_1.GlobalDeclare("config.ts", function () {
    var r = new Config();
    r.override({
        HOST: '<SDKHOST>',
        DEBUG: true,
        CHANNEL_ID: null,
        CHANNEL: null,
        GAME_ID: null,
        HOSTNAME: null,
        URL: null,
        PROTOCOL: "https:",
        VERSION: 'dev',
        USER_ACCOUNT: null,
        USER_ID: null,
        USER_TOKEN: null,
        USER_SID: null
    });
    return r;
});


/***/ }),

/***/ "./src/sdk/core/global.ts":
/*!********************************!*\
  !*** ./src/sdk/core/global.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function GlobalOnce(id, func) {
    var key = 'sdks_global_' + id;
    if (window[key] == null) {
        func();
        window[key] = true;
    }
}
exports.GlobalOnce = GlobalOnce;
function GlobalDeclare(id, func) {
    var key = 'sdks_global_var_' + id;
    var t = window[key];
    if (!t) {
        t = func();
        window[key] = t;
    }
    return t;
}
exports.GlobalDeclare = GlobalDeclare;


/***/ }),

/***/ "./src/sdk/log.ts":
/*!************************!*\
  !*** ./src/sdk/log.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = __webpack_require__(/*! ./core/global */ "./src/sdk/core/global.ts");
var Log = (function () {
    function Log() {
        this.log = function (msg) {
            console.log(msg);
        };
        this.error = function (msg) {
            alert(msg);
        };
    }
    return Log;
}());
exports.log = global_1.GlobalDeclare("log.ts", function () {
    return new Log();
});


/***/ }),

/***/ "./src/sdk/rest.ts":
/*!*************************!*\
  !*** ./src/sdk/rest.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function Get(url, params, cbsuc, cberr) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function (ev) {
        switch (req.readyState) {
            case XMLHttpRequest.DONE:
                {
                    cbsuc(JSON.parse(req.response));
                }
                break;
        }
    };
    req.onerror = function (ev) {
        cberr && cberr(new Error(url + " 获取数据失败"));
    };
    var subs = [];
    for (var k in params) {
        subs.push(k + '=' + params[k]);
    }
    if (url.indexOf('?') == -1)
        url += "?";
    else
        url += "&";
    url += subs.join('&');
    req.open('GET', url, true);
    req.send(null);
}
exports.Get = Get;
function Post(url, params, cbsuc, cberr) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function (ev) {
        switch (req.readyState) {
            case XMLHttpRequest.DONE:
                {
                    cbsuc(JSON.parse(req.response));
                }
                break;
        }
    };
    req.onerror = function (ev) {
        cberr && cberr(new Error(url + " 获取数据失败"));
    };
    var form = new FormData();
    for (var k in params) {
        form.append(k, params[k]);
    }
    req.open('POST', url, true);
    req.send(form);
}
exports.Post = Post;


/***/ }),

/***/ "./src/sdk/service.ts":
/*!****************************!*\
  !*** ./src/sdk/service.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var rest_1 = __webpack_require__(/*! ./rest */ "./src/sdk/rest.ts");
var config_1 = __webpack_require__(/*! ./config */ "./src/sdk/config.ts");
var storage_1 = __webpack_require__(/*! ./storage */ "./src/sdk/storage.ts");
var CodeError = (function (_super) {
    __extends(CodeError, _super);
    function CodeError(code, msg) {
        var _this = _super.call(this, msg) || this;
        _this.code = code;
        return _this;
    }
    return CodeError;
}(Error));
exports.CodeError = CodeError;
function DoFetch(domain, action, params) {
    return new Promise(function (resolve, reject) {
        var hasfile;
        if (typeof File != "undefined") {
            for (var k in params) {
                if (params[k] instanceof File) {
                    hasfile = true;
                    break;
                }
            }
        }
        var url = config_1.config.get('PROTOCOL') + '//' + config_1.config.HOST + '/' + domain + '/?action=' + action;
        if (!config_1.config.DEVOPS_RELEASE)
            url += '&_skippermission=1';
        var sid = storage_1.storage.get('USER_SID');
        if (sid)
            url += '&_sid=' + sid;
        if (hasfile) {
            rest_1.Post(url, params, function (resp) {
                if (resp.code == 0)
                    resolve(resp.data);
                else
                    reject(new CodeError(resp.code));
            }, function (err) {
                reject(err);
            });
        }
        else {
            rest_1.Get(url, params, function (resp) {
                if (resp.code == 0)
                    resolve(resp.data);
                else
                    reject(new CodeError(resp.code));
            }, function (err) {
                reject(new CodeError(-1, err.message));
            });
        }
    });
}
function Get(domain, action, params) {
    return DoFetch(domain, action, params).catch();
}
exports.Get = Get;
function Fetch(domain, action, params) {
    return DoFetch(domain, action, params);
}
exports.Fetch = Fetch;


/***/ }),

/***/ "./src/sdk/specific.ts":
/*!*****************************!*\
  !*** ./src/sdk/specific.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = __webpack_require__(/*! ./core/global */ "./src/sdk/core/global.ts");
var Specific = (function () {
    function Specific() {
    }
    return Specific;
}());
exports.specific = global_1.GlobalDeclare("specific.ts", function () {
    return new Specific();
});


/***/ }),

/***/ "./src/sdk/storage.ts":
/*!****************************!*\
  !*** ./src/sdk/storage.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __webpack_require__(/*! ./config */ "./src/sdk/config.ts");
var global_1 = __webpack_require__(/*! ./core/global */ "./src/sdk/core/global.ts");
var ExtStorage = (function () {
    function ExtStorage() {
        this.prefix = "sdks_";
        this._store = {};
    }
    ExtStorage.prototype.get = function (key, def) {
        if (def === void 0) { def = null; }
        if (config_1.config.contains(key)) {
            var fnd = config_1.config.get(key);
            if (fnd !== null)
                return fnd;
        }
        key = this.prefix + key;
        if (typeof localStorage != "undefined" && localStorage) {
            var fnd = localStorage.getItem(key);
            if (fnd !== null)
                return fnd;
        }
        if (typeof sessionStorage != "undefined" && sessionStorage) {
            var fnd = sessionStorage.getItem(key);
            if (fnd !== null)
                return fnd;
        }
        if (key in this._store)
            return this._store[key];
        return def;
    };
    ExtStorage.prototype.set = function (key, val) {
        if (config_1.config.contains(key)) {
            config_1.config.set(key, val);
        }
        key = this.prefix + key;
        if (typeof localStorage != "undefined" && localStorage) {
            localStorage.setItem(key, val);
            return;
        }
        if (typeof sessionStorage != "undefined" && sessionStorage) {
            sessionStorage.setItem(key, val);
            return;
        }
        this._store[key] = val;
    };
    ExtStorage.prototype.delete = function (key) {
        if (config_1.config.contains(key)) {
            config_1.config.delete(key);
            return;
        }
        key = this.prefix + key;
        if (typeof localStorage != "undefined" && localStorage) {
            localStorage.removeItem(key);
            return;
        }
        if (typeof sessionStorage != "undefined" && sessionStorage) {
            sessionStorage.removeItem(key);
            return;
        }
        delete this._store[key];
    };
    ExtStorage.prototype.contains = function (key) {
        if (config_1.config.contains(key)) {
            return true;
        }
        key = this.prefix + key;
        if (typeof localStorage != "undefined" && localStorage) {
            var fnd = localStorage.getItem(key);
            if (fnd !== null)
                return true;
        }
        if (typeof sessionStorage != "undefined" && sessionStorage) {
            var fnd = sessionStorage.getItem(key);
            if (fnd !== null)
                return true;
        }
        if (key in this._store)
            return true;
        return false;
    };
    return ExtStorage;
}());
exports.storage = global_1.GlobalDeclare("storage.ts", function () {
    return new ExtStorage();
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VtYmVkZWQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xhdW5jaGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9zZGsvY29uZmlnLnRzIiwid2VicGFjazovLy8uL3NyYy9zZGsvY29yZS9nbG9iYWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Nkay9sb2cudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Nkay9yZXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9zZGsvc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2RrL3NwZWNpZmljLnRzIiwid2VicGFjazovLy8uL3NyYy9zZGsvc3RvcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsY0FBYyxnQkFBZ0Isc0NBQXNDLGlCQUFpQixFQUFFO0FBQ3ZGLDZCQUE2Qix1REFBdUQ7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLG1DQUFtQyxNQUFNLDZCQUE2QixFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ2pHLGtDQUFrQyxNQUFNLGlDQUFpQyxFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ3BHLCtCQUErQixpRUFBaUUsdUJBQXVCLEVBQUUsNEJBQTRCO0FBQ3JKO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxhQUFhLDZCQUE2QiwwQkFBMEIsYUFBYSxFQUFFLHFCQUFxQjtBQUN4RyxnQkFBZ0IscURBQXFELG9FQUFvRSxhQUFhLEVBQUU7QUFDeEosc0JBQXNCLHNCQUFzQixxQkFBcUIsR0FBRztBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkMsa0NBQWtDLFNBQVM7QUFDM0Msa0NBQWtDLFdBQVcsVUFBVTtBQUN2RCx5Q0FBeUMsY0FBYztBQUN2RDtBQUNBLDZHQUE2RyxPQUFPLFVBQVU7QUFDOUgsZ0ZBQWdGLGlCQUFpQixPQUFPO0FBQ3hHLHdEQUF3RCxnQkFBZ0IsUUFBUSxPQUFPO0FBQ3ZGLDhDQUE4QyxnQkFBZ0IsZ0JBQWdCLE9BQU87QUFDckY7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBLFNBQVMsWUFBWSxhQUFhLE9BQU8sRUFBRSxVQUFVLFdBQVc7QUFDaEUsbUNBQW1DLFNBQVM7QUFDNUM7QUFDQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVELGlCQUFpQixtQkFBTyxDQUFDLHFDQUFZO0FBQ3JDLGdCQUFnQixtQkFBTyxDQUFDLDJDQUFlO0FBQ3ZDLFlBQVksbUJBQU8sQ0FBQyxtQ0FBVztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBLENBQUM7QUFDRDs7Ozs7Ozs7Ozs7OztBQ3ZHYTtBQUNiO0FBQ0E7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IsaUVBQWlFLHVCQUF1QixFQUFFLDRCQUE0QjtBQUNySjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBYSw2QkFBNkIsMEJBQTBCLGFBQWEsRUFBRSxxQkFBcUI7QUFDeEcsZ0JBQWdCLHFEQUFxRCxvRUFBb0UsYUFBYSxFQUFFO0FBQ3hKLHNCQUFzQixzQkFBc0IscUJBQXFCLEdBQUc7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDLGtDQUFrQyxTQUFTO0FBQzNDLGtDQUFrQyxXQUFXLFVBQVU7QUFDdkQseUNBQXlDLGNBQWM7QUFDdkQ7QUFDQSw2R0FBNkcsT0FBTyxVQUFVO0FBQzlILGdGQUFnRixpQkFBaUIsT0FBTztBQUN4Ryx3REFBd0QsZ0JBQWdCLFFBQVEsT0FBTztBQUN2Riw4Q0FBOEMsZ0JBQWdCLGdCQUFnQixPQUFPO0FBQ3JGO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQSxTQUFTLFlBQVksYUFBYSxPQUFPLEVBQUUsVUFBVSxXQUFXO0FBQ2hFLG1DQUFtQyxTQUFTO0FBQzVDO0FBQ0E7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RCxlQUFlLG1CQUFPLENBQUMseUNBQWM7QUFDckMsWUFBWSxtQkFBTyxDQUFDLG1DQUFXO0FBQy9CLGlCQUFpQixtQkFBTyxDQUFDLDZDQUFnQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0EsQ0FBQztBQUNEOzs7Ozs7Ozs7Ozs7O0FDM0dhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsZUFBZSxtQkFBTyxDQUFDLCtDQUFlO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDdERZO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbkJhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsZUFBZSxtQkFBTyxDQUFDLCtDQUFlO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDaEJZO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRGE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxjQUFjLGdCQUFnQixzQ0FBc0MsaUJBQWlCLEVBQUU7QUFDdkYsNkJBQTZCLHVEQUF1RDtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBLENBQUM7QUFDRCw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMsaUNBQVE7QUFDN0IsZUFBZSxtQkFBTyxDQUFDLHFDQUFVO0FBQ2pDLGdCQUFnQixtQkFBTyxDQUFDLHVDQUFXO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzFFYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGVBQWUsbUJBQU8sQ0FBQywrQ0FBZTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ1ZZO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsZUFBZSxtQkFBTyxDQUFDLHFDQUFVO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQywrQ0FBZTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6ImVtYmVkZWQuZXM1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvZW1iZWRlZC50c1wiKTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgbGF1bmNoZXJfMSA9IHJlcXVpcmUoXCIuL2xhdW5jaGVyXCIpO1xudmFyIHNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL3Nkay9zZXJ2aWNlXCIpO1xudmFyIGxvZ18xID0gcmVxdWlyZShcIi4vc2RrL2xvZ1wiKTtcbnZhciBFbWJlZGVkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoRW1iZWRlZCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBFbWJlZGVkKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5jb25maWcub3ZlcnJpZGUoe1xuICAgICAgICAgICAgSE9TVDogJ2RldmVsb3AuOTFlZ2FtZS5jb20nLFxuICAgICAgICAgICAgSE9TVE5BTUU6ICc5MXlpZ2FtZS5jb20nLFxuICAgICAgICAgICAgVVJMOiAnOTF5aWdhbWUuY29tJyxcbiAgICAgICAgICAgIFBST1RPQ09MOiAnaHR0cDonXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEVtYmVkZWQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtb2R1bGUsIHJlc3AsIGVycl8xO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCwgc2VydmljZV8xLkZldGNoKCdwbGF0Zm9ybS9vcGVuJywgJ2NoYW5uZWwuaW5mbycsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbm5lbGlkOiB0aGlzLmNvbmZpZy5nZXQoJ0NIQU5ORUxfSUQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZWlkOiB0aGlzLmNvbmZpZy5nZXQoJ0dBTUVfSUQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZSA9IHJlc3AubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLnNldCgnQ0hBTk5FTCcsIG1vZHVsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDNdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJfMSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKFwic2RrOmluaXQ6XCIgKyBlcnJfMS5jb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMywgM107XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFs0LCB0aGlzLmluc3RhbmNlQ2hhbm5lbCgpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBFbWJlZGVkLnByb3RvdHlwZS5yZXF1aXJlID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBsb2dfMS5sb2cuZXJyb3IoXCJlbWJlZGVk54mIU0RL5LiN6IO95Yqo5oCBcmVxdWlyZeaooeWdlyBcIiArIG1vZGVsKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIEVtYmVkZWQ7XG59KGxhdW5jaGVyXzEuTGF1bmNoZXIpKTtcbndpbmRvd1tcInNka3NcIl0gPSBuZXcgRW1iZWRlZCgpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGNvbmZpZ18xID0gcmVxdWlyZShcIi4vc2RrL2NvbmZpZ1wiKTtcbnZhciBsb2dfMSA9IHJlcXVpcmUoXCIuL3Nkay9sb2dcIik7XG52YXIgc3BlY2lmaWNfMSA9IHJlcXVpcmUoXCIuL3Nkay9zcGVjaWZpY1wiKTtcbnZhciBMYXVuY2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTGF1bmNoZXIoKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnXzEuY29uZmlnO1xuICAgICAgICB0aGlzLmxvZyA9IGxvZ18xLmxvZztcbiAgICAgICAgdGhpcy5zcGVjaWZpYyA9IHNwZWNpZmljXzEuc3BlY2lmaWM7XG4gICAgfVxuICAgIExhdW5jaGVyLnByb3RvdHlwZS5pbnN0YW5jZUNoYW5uZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjbGF6ejtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXp6ID0gd2luZG93WydDSEFOTkVMX01PRFVMRSddO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbm5lbCA9IG5ldyBjbGF6eigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbm5lbC5sYXVuY2hlciA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQsIHRoaXMuX2NoYW5uZWwuaW5pdCgpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTGF1bmNoZXIucHJvdG90eXBlLCBcImNoYW5uZWxcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFubmVsO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBMYXVuY2hlci5wcm90b3R5cGUudXNlckJyaWVmSW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgdGhpcy5fY2hhbm5lbC51c2VyQnJpZWZJbmZvKCldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTGF1bmNoZXIucHJvdG90eXBlLnVzZXJEZXRhaWxJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCB0aGlzLl9jaGFubmVsLnVzZXJEZXRhaWxJbmZvKCldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTGF1bmNoZXIucHJvdG90eXBlLnNoYXJlID0gZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgdGhpcy5fY2hhbm5lbC5zaGFyZShtKV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBMYXVuY2hlci5wcm90b3R5cGUucmVjaGFyZ2UgPSBmdW5jdGlvbiAobSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCB0aGlzLl9jaGFubmVsLnJlY2hhcmdlKG0pXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIExhdW5jaGVyLnByb3RvdHlwZS5mZWF0dXJlID0gZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gTGF1bmNoZXI7XG59KCkpO1xuZXhwb3J0cy5MYXVuY2hlciA9IExhdW5jaGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9jb3JlL2dsb2JhbFwiKTtcbnZhciBDb25maWcgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbmZpZygpIHtcbiAgICAgICAgdGhpcy5fY3VyID0ge307XG4gICAgfVxuICAgIENvbmZpZy5wcm90b3R5cGUub3ZlcnJpZGUgPSBmdW5jdGlvbiAoY2ZnKSB7XG4gICAgICAgIGZvciAodmFyIGsgaW4gY2ZnKSB7XG4gICAgICAgICAgICB0aGlzW2tdID0gdGhpcy5fY3VyW2tdID0gY2ZnW2tdO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDb25maWcucHJvdG90eXBlLmhvc3QgPSBmdW5jdGlvbiAoaG9zdCwgY2ZnKSB7XG4gICAgICAgIGlmICghdGhpcy5IT1NUTkFNRSB8fCAhdGhpcy5IT1NUTkFNRS5tYXRjaChob3N0KSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgZm9yICh2YXIgayBpbiBjZmcpIHtcbiAgICAgICAgICAgIHRoaXNba10gPSB0aGlzLl9jdXJba10gPSBjZmdba107XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENvbmZpZy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSwgZGVmKSB7XG4gICAgICAgIHJldHVybiBrZXkgaW4gdGhpcy5fY3VyID8gdGhpcy5fY3VyW2tleV0gOiBkZWY7XG4gICAgfTtcbiAgICBDb25maWcucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgICAgICB0aGlzW2tleV0gPSB0aGlzLl9jdXJba2V5XSA9IHZhbDtcbiAgICB9O1xuICAgIENvbmZpZy5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoa2V5IGluIHRoaXMuX2N1cikge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2N1cltrZXldO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXNba2V5XTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ29uZmlnLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleSBpbiB0aGlzLl9jdXI7XG4gICAgfTtcbiAgICByZXR1cm4gQ29uZmlnO1xufSgpKTtcbmV4cG9ydHMuY29uZmlnID0gZ2xvYmFsXzEuR2xvYmFsRGVjbGFyZShcImNvbmZpZy50c1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHIgPSBuZXcgQ29uZmlnKCk7XG4gICAgci5vdmVycmlkZSh7XG4gICAgICAgIEhPU1Q6ICc8U0RLSE9TVD4nLFxuICAgICAgICBERUJVRzogdHJ1ZSxcbiAgICAgICAgQ0hBTk5FTF9JRDogbnVsbCxcbiAgICAgICAgQ0hBTk5FTDogbnVsbCxcbiAgICAgICAgR0FNRV9JRDogbnVsbCxcbiAgICAgICAgSE9TVE5BTUU6IG51bGwsXG4gICAgICAgIFVSTDogbnVsbCxcbiAgICAgICAgUFJPVE9DT0w6IFwiaHR0cHM6XCIsXG4gICAgICAgIFZFUlNJT046ICdkZXYnLFxuICAgICAgICBVU0VSX0FDQ09VTlQ6IG51bGwsXG4gICAgICAgIFVTRVJfSUQ6IG51bGwsXG4gICAgICAgIFVTRVJfVE9LRU46IG51bGwsXG4gICAgICAgIFVTRVJfU0lEOiBudWxsXG4gICAgfSk7XG4gICAgcmV0dXJuIHI7XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gR2xvYmFsT25jZShpZCwgZnVuYykge1xuICAgIHZhciBrZXkgPSAnc2Rrc19nbG9iYWxfJyArIGlkO1xuICAgIGlmICh3aW5kb3dba2V5XSA9PSBudWxsKSB7XG4gICAgICAgIGZ1bmMoKTtcbiAgICAgICAgd2luZG93W2tleV0gPSB0cnVlO1xuICAgIH1cbn1cbmV4cG9ydHMuR2xvYmFsT25jZSA9IEdsb2JhbE9uY2U7XG5mdW5jdGlvbiBHbG9iYWxEZWNsYXJlKGlkLCBmdW5jKSB7XG4gICAgdmFyIGtleSA9ICdzZGtzX2dsb2JhbF92YXJfJyArIGlkO1xuICAgIHZhciB0ID0gd2luZG93W2tleV07XG4gICAgaWYgKCF0KSB7XG4gICAgICAgIHQgPSBmdW5jKCk7XG4gICAgICAgIHdpbmRvd1trZXldID0gdDtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG59XG5leHBvcnRzLkdsb2JhbERlY2xhcmUgPSBHbG9iYWxEZWNsYXJlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9jb3JlL2dsb2JhbFwiKTtcbnZhciBMb2cgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIExvZygpIHtcbiAgICAgICAgdGhpcy5sb2cgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVycm9yID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgYWxlcnQobXNnKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIExvZztcbn0oKSk7XG5leHBvcnRzLmxvZyA9IGdsb2JhbF8xLkdsb2JhbERlY2xhcmUoXCJsb2cudHNcIiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgTG9nKCk7XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gR2V0KHVybCwgcGFyYW1zLCBjYnN1YywgY2JlcnIpIHtcbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIChldikge1xuICAgICAgICBzd2l0Y2ggKHJlcS5yZWFkeVN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFhNTEh0dHBSZXF1ZXN0LkRPTkU6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjYnN1YyhKU09OLnBhcnNlKHJlcS5yZXNwb25zZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmVxLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgY2JlcnIgJiYgY2JlcnIobmV3IEVycm9yKHVybCArIFwiIOiOt+WPluaVsOaNruWksei0pVwiKSk7XG4gICAgfTtcbiAgICB2YXIgc3VicyA9IFtdO1xuICAgIGZvciAodmFyIGsgaW4gcGFyYW1zKSB7XG4gICAgICAgIHN1YnMucHVzaChrICsgJz0nICsgcGFyYW1zW2tdKTtcbiAgICB9XG4gICAgaWYgKHVybC5pbmRleE9mKCc/JykgPT0gLTEpXG4gICAgICAgIHVybCArPSBcIj9cIjtcbiAgICBlbHNlXG4gICAgICAgIHVybCArPSBcIiZcIjtcbiAgICB1cmwgKz0gc3Vicy5qb2luKCcmJyk7XG4gICAgcmVxLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgcmVxLnNlbmQobnVsbCk7XG59XG5leHBvcnRzLkdldCA9IEdldDtcbmZ1bmN0aW9uIFBvc3QodXJsLCBwYXJhbXMsIGNic3VjLCBjYmVycikge1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgIHN3aXRjaCAocmVxLnJlYWR5U3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgWE1MSHR0cFJlcXVlc3QuRE9ORTpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNic3VjKEpTT04ucGFyc2UocmVxLnJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXEub25lcnJvciA9IGZ1bmN0aW9uIChldikge1xuICAgICAgICBjYmVyciAmJiBjYmVycihuZXcgRXJyb3IodXJsICsgXCIg6I635Y+W5pWw5o2u5aSx6LSlXCIpKTtcbiAgICB9O1xuICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgZm9yICh2YXIgayBpbiBwYXJhbXMpIHtcbiAgICAgICAgZm9ybS5hcHBlbmQoaywgcGFyYW1zW2tdKTtcbiAgICB9XG4gICAgcmVxLm9wZW4oJ1BPU1QnLCB1cmwsIHRydWUpO1xuICAgIHJlcS5zZW5kKGZvcm0pO1xufVxuZXhwb3J0cy5Qb3N0ID0gUG9zdDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciByZXN0XzEgPSByZXF1aXJlKFwiLi9yZXN0XCIpO1xudmFyIGNvbmZpZ18xID0gcmVxdWlyZShcIi4vY29uZmlnXCIpO1xudmFyIHN0b3JhZ2VfMSA9IHJlcXVpcmUoXCIuL3N0b3JhZ2VcIik7XG52YXIgQ29kZUVycm9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQ29kZUVycm9yLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIENvZGVFcnJvcihjb2RlLCBtc2cpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbXNnKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5jb2RlID0gY29kZTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gQ29kZUVycm9yO1xufShFcnJvcikpO1xuZXhwb3J0cy5Db2RlRXJyb3IgPSBDb2RlRXJyb3I7XG5mdW5jdGlvbiBEb0ZldGNoKGRvbWFpbiwgYWN0aW9uLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2YXIgaGFzZmlsZTtcbiAgICAgICAgaWYgKHR5cGVvZiBGaWxlICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGsgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtc1trXSBpbnN0YW5jZW9mIEZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzZmlsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgdXJsID0gY29uZmlnXzEuY29uZmlnLmdldCgnUFJPVE9DT0wnKSArICcvLycgKyBjb25maWdfMS5jb25maWcuSE9TVCArICcvJyArIGRvbWFpbiArICcvP2FjdGlvbj0nICsgYWN0aW9uO1xuICAgICAgICBpZiAoIWNvbmZpZ18xLmNvbmZpZy5ERVZPUFNfUkVMRUFTRSlcbiAgICAgICAgICAgIHVybCArPSAnJl9za2lwcGVybWlzc2lvbj0xJztcbiAgICAgICAgdmFyIHNpZCA9IHN0b3JhZ2VfMS5zdG9yYWdlLmdldCgnVVNFUl9TSUQnKTtcbiAgICAgICAgaWYgKHNpZClcbiAgICAgICAgICAgIHVybCArPSAnJl9zaWQ9JyArIHNpZDtcbiAgICAgICAgaWYgKGhhc2ZpbGUpIHtcbiAgICAgICAgICAgIHJlc3RfMS5Qb3N0KHVybCwgcGFyYW1zLCBmdW5jdGlvbiAocmVzcCkge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwLmNvZGUgPT0gMClcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwLmRhdGEpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBDb2RlRXJyb3IocmVzcC5jb2RlKSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3RfMS5HZXQodXJsLCBwYXJhbXMsIGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3AuY29kZSA9PSAwKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3AuZGF0YSk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IENvZGVFcnJvcihyZXNwLmNvZGUpKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IENvZGVFcnJvcigtMSwgZXJyLm1lc3NhZ2UpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBHZXQoZG9tYWluLCBhY3Rpb24sIHBhcmFtcykge1xuICAgIHJldHVybiBEb0ZldGNoKGRvbWFpbiwgYWN0aW9uLCBwYXJhbXMpLmNhdGNoKCk7XG59XG5leHBvcnRzLkdldCA9IEdldDtcbmZ1bmN0aW9uIEZldGNoKGRvbWFpbiwgYWN0aW9uLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gRG9GZXRjaChkb21haW4sIGFjdGlvbiwgcGFyYW1zKTtcbn1cbmV4cG9ydHMuRmV0Y2ggPSBGZXRjaDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vY29yZS9nbG9iYWxcIik7XG52YXIgU3BlY2lmaWMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNwZWNpZmljKCkge1xuICAgIH1cbiAgICByZXR1cm4gU3BlY2lmaWM7XG59KCkpO1xuZXhwb3J0cy5zcGVjaWZpYyA9IGdsb2JhbF8xLkdsb2JhbERlY2xhcmUoXCJzcGVjaWZpYy50c1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBTcGVjaWZpYygpO1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBjb25maWdfMSA9IHJlcXVpcmUoXCIuL2NvbmZpZ1wiKTtcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2NvcmUvZ2xvYmFsXCIpO1xudmFyIEV4dFN0b3JhZ2UgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEV4dFN0b3JhZ2UoKSB7XG4gICAgICAgIHRoaXMucHJlZml4ID0gXCJzZGtzX1wiO1xuICAgICAgICB0aGlzLl9zdG9yZSA9IHt9O1xuICAgIH1cbiAgICBFeHRTdG9yYWdlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5LCBkZWYpIHtcbiAgICAgICAgaWYgKGRlZiA9PT0gdm9pZCAwKSB7IGRlZiA9IG51bGw7IH1cbiAgICAgICAgaWYgKGNvbmZpZ18xLmNvbmZpZy5jb250YWlucyhrZXkpKSB7XG4gICAgICAgICAgICB2YXIgZm5kID0gY29uZmlnXzEuY29uZmlnLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKGZuZCAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gZm5kO1xuICAgICAgICB9XG4gICAgICAgIGtleSA9IHRoaXMucHJlZml4ICsga2V5O1xuICAgICAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSkge1xuICAgICAgICAgICAgdmFyIGZuZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICAgICAgICBpZiAoZm5kICE9PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBmbmQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzZXNzaW9uU3RvcmFnZSAhPSBcInVuZGVmaW5lZFwiICYmIHNlc3Npb25TdG9yYWdlKSB7XG4gICAgICAgICAgICB2YXIgZm5kID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgICAgICAgaWYgKGZuZCAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gZm5kO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXkgaW4gdGhpcy5fc3RvcmUpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmVba2V5XTtcbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9O1xuICAgIEV4dFN0b3JhZ2UucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgICAgICBpZiAoY29uZmlnXzEuY29uZmlnLmNvbnRhaW5zKGtleSkpIHtcbiAgICAgICAgICAgIGNvbmZpZ18xLmNvbmZpZy5zZXQoa2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgICAgIGtleSA9IHRoaXMucHJlZml4ICsga2V5O1xuICAgICAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2Vzc2lvblN0b3JhZ2UgIT0gXCJ1bmRlZmluZWRcIiAmJiBzZXNzaW9uU3RvcmFnZSkge1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3RvcmVba2V5XSA9IHZhbDtcbiAgICB9O1xuICAgIEV4dFN0b3JhZ2UucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKGNvbmZpZ18xLmNvbmZpZy5jb250YWlucyhrZXkpKSB7XG4gICAgICAgICAgICBjb25maWdfMS5jb25maWcuZGVsZXRlKGtleSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAga2V5ID0gdGhpcy5wcmVmaXggKyBrZXk7XG4gICAgICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9IFwidW5kZWZpbmVkXCIgJiYgbG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2Vzc2lvblN0b3JhZ2UgIT0gXCJ1bmRlZmluZWRcIiAmJiBzZXNzaW9uU3RvcmFnZSkge1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9zdG9yZVtrZXldO1xuICAgIH07XG4gICAgRXh0U3RvcmFnZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChjb25maWdfMS5jb25maWcuY29udGFpbnMoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAga2V5ID0gdGhpcy5wcmVmaXggKyBrZXk7XG4gICAgICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9IFwidW5kZWZpbmVkXCIgJiYgbG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICAgICB2YXIgZm5kID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICAgICAgICAgIGlmIChmbmQgIT09IG51bGwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzZXNzaW9uU3RvcmFnZSAhPSBcInVuZGVmaW5lZFwiICYmIHNlc3Npb25TdG9yYWdlKSB7XG4gICAgICAgICAgICB2YXIgZm5kID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgICAgICAgaWYgKGZuZCAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5IGluIHRoaXMuX3N0b3JlKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIHJldHVybiBFeHRTdG9yYWdlO1xufSgpKTtcbmV4cG9ydHMuc3RvcmFnZSA9IGdsb2JhbF8xLkdsb2JhbERlY2xhcmUoXCJzdG9yYWdlLnRzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IEV4dFN0b3JhZ2UoKTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==