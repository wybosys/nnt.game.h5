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
var fs = require("fs");
var path = require("path");
// nnt fix
var UseEui = false;
var UseDragonBones = false;
var UseParticle = false;
var UsePhysics = false;
var HasData = false;
var WxgamePlugin = /** @class */ (function () {
    function WxgamePlugin() {
    }
    WxgamePlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, content, content;
            return __generator(this, function (_a) {
                if (file.extname == '.js') {
                    filename = file.origin;
                    if (filename == "libs/modules/promise/promise.js" || filename == 'libs/modules/promise/promise.min.js') {
                        return [2 /*return*/, null];
                    }
                    if (filename == 'libs/modules/egret/egret.js' || filename == 'libs/modules/egret/egret.min.js') {
                        content = file.contents.toString();
                        content += ";window.egret = egret;";
                        content = content.replace(/definition = __global/, "definition = window");
                        file.contents = new Buffer(content);
                    }
                    else {
                        content = file.contents.toString();
                        if (filename == "libs/modules/res/res.js" ||
                            filename == 'libs/modules/res/res.min.js' ||
                            filename == 'libs/modules/assetsmanager/assetsmanager.min.js' ||
                            filename == 'libs/modules/assetsmanager/assetsmanager.js') {
                            content += ";window.RES = RES;";
                        }
                        if (filename == "libs/modules/eui/eui.js" || filename == 'libs/modules/eui/eui.min.js') {
                            content += ";window.eui = eui;";
                            UseEui = true;
                        }
                        if (filename == 'libs/modules/dragonBones/dragonBones.js' || filename == 'libs/modules/dragonBones/dragonBones.min.js') {
                            content += ';window.dragonBones = dragonBones;';
                            UseDragonBones = true;
                        }
                        if (filename == '3rd/particle/particle.js' || filename == '3rd/particle/particle.min.js') {
                            content += ';window.particle = particle;';
                            UseParticle = true;
                        }
                        if (filename == '3rd/physics.js' || filename == '3rd/physics/physics.min.js') {
                            content += ';window.physics = physics;';
                            UsePhysics = true;
                        }
                        if (filename == 'resource/default.data.js' || filename == 'resource/default.data.min.js') {
                            content += ';window.Data = Data;';
                            HasData = true;
                        }
                        content = "var egret = window.egret;" + content;
                        if (filename == 'main.js') {
                            // nnt fix
                            content = "window.app = {}; var app = window.app;" + content;
                            if (UseEui)
                                content = "var eui = window.eui;" + content;
                            if (UseDragonBones)
                                content = "var dragonBones = window.dragonBones;" + content;
                            if (UseParticle)
                                content = "var particle = window.particle;" + content;
                            if (UsePhysics)
                                content = "var physics = window.physics;" + content;
                            if (HasData)
                                content = "var Data = window.Data;" + content;
                            content += "\n;window.Main = Main;";
                        }
                        file.contents = new Buffer(content);
                    }
                }
                return [2 /*return*/, file];
            });
        });
    };
    WxgamePlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            var gameJSPath, projectConfig, content, i, f, js, orientation, g, wconfig, gameJSONPath, gameJSONContent;
            return __generator(this, function (_a) {
                gameJSPath = path.join(pluginContext.outputDir, "game.js");
                if (!fs.existsSync(gameJSPath)) {
                    console.log(gameJSPath + "\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u4F7F\u7528 Launcher \u53D1\u5E03\u5FAE\u4FE1\u5C0F\u6E38\u620F");
                    return [2 /*return*/];
                }
                projectConfig = pluginContext.buildConfig.projectConfig;
                content = TPL_GAMEJS;
                for (i = 1; i <= 2; ++i) {
                    f = pluginContext.outputDir + "/../.n2/egret/region" + i + ".js";
                    if (fs.existsSync(f)) {
                        js = fs.readFileSync(f, { encoding: "utf8" });
                        content = content.replace("//REGION_" + i + "//", js);
                    }
                }
                // 按照nnt的规则输出启动器
                fs.writeFileSync(gameJSPath, content);
                g = pluginContext.outputDir + "/../.n2/egret/wx_config.json";
                wconfig = fs.readFileSync(g, { encoding: "utf8" });
                orientation = JSON.parse(wconfig).deviceOrientation;
                gameJSONPath = path.join(pluginContext.outputDir, "game.json");
                gameJSONContent = JSON.parse(fs.readFileSync(gameJSONPath, { encoding: "utf8" }));
                gameJSONContent.deviceOrientation = orientation;
                fs.writeFileSync(gameJSONPath, JSON.stringify(gameJSONContent, null, "\t"));
                return [2 /*return*/];
            });
        });
    };
    return WxgamePlugin;
}());
exports.WxgamePlugin = WxgamePlugin;
var TPL_GAMEJS = "require('./weapp-adapter.js');\nrequire('./platform.js');\nrequire('./manifest.js');\nrequire('./egret.wxgame.js');\n\n// \u542F\u52A8\u5FAE\u4FE1\u5C0F\u6E38\u620F\u672C\u5730\u7F13\u5B58\uFF0C\u5982\u679C\u5F00\u53D1\u8005\u4E0D\u9700\u8981\u6B64\u529F\u80FD\uFF0C\u53EA\u9700\u6CE8\u91CA\u5373\u53EF\n// \u53EA\u6709\u4F7F\u7528 assetsmanager \u7684\u9879\u76EE\u53EF\u4EE5\u4F7F\u7528\nif(window.RES && RES.processor) {\n    require('./library/image.js');\n    require('./library/text.js');\n    require('./library/sound.js');\n    require('./library/binary.js');\n}\n\n//REGION_1//\nnn.loader.mingamestart(options);\n\n\n//REGION_2//\n\n// require(\"egret.min.js\")\n";
