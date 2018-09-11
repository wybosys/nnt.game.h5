Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const config_1 = require("./config");
const gendata_1 = require("./gendata");
const kernel_1 = require("./kernel");
const service_1 = require("./service");
const egret_res_1 = require("./egret-res");
const fs = require("fs-extra");
exports.RESMAKER_BLACKS = [
    /module\.res\.json$/,
    /\.swf$/,
    /\.fla$/,
    /^\./
];
exports.GENRES_BLACKS = exports.RESMAKER_BLACKS.concat(/\.d\/|\.d$/);
exports.AUTOMERGE_BLACKS = exports.GENRES_BLACKS.concat(/\.g\/|\.g$/);
exports.IMAGE_EXTS = ['.jpeg', '.jpg', '.png'];
class EgretGame extends game_1.Game {
    constructor() {
        super();
        this.config = new EgretConfig();
        this.gendata = new gendata_1.Gendata();
        this.service = new service_1.Service();
        this.resource = new egret_res_1.EgretResource();
    }
    clean() {
        super.clean();
        // 清除egret的中间文件
        fs.removeSync("bin-debug");
        fs.removeSync("libs");
        fs.removeSync(".n2~/dist");
        fs.removeSync("dist");
        fs.removeSync("publish");
    }
}
exports.EgretGame = EgretGame;
class EgretConfig extends config_1.Config {
    async refresh() {
        let r = await super.refresh();
        // 比对egretProp是否修改过
        let hash = kernel_1.SimpleHashFile("project/egretProperties.json");
        if (this._cfgdb.get("egret-prop-hash") != hash) {
            this._cfgdb.set("egret-prop-hash", hash);
            console.log("egret的配置更新");
            r = true;
        }
        return r;
    }
}
//# sourceMappingURL=egret.js.map