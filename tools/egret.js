Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const config_1 = require("./config");
const gendata_1 = require("./gendata");
const kernel_1 = require("./kernel");
const service_1 = require("./service");
const resource_1 = require("./resource");
const fs = require("fs-extra");
class EgretGame extends game_1.Game {
    constructor() {
        super();
        this.config = new EgretConfig();
        this.gendata = new gendata_1.Gendata();
        this.service = new service_1.Service();
        this.resource = new EgretResource();
    }
    clean() {
        super.clean();
        // 清除egret的中间文件
        if (fs.existsSync("bin-debug"))
            fs.removeSync("bin-debug");
        if (fs.existsSync("libs"))
            fs.removeSync("libs");
        if (fs.existsSync(".n2~/dist"))
            fs.removeSync(".n2~/dist");
    }
}
exports.EgretGame = EgretGame;
class EgretConfig extends config_1.Config {
    async refresh() {
        let r = await super.refresh();
        // 比对egretProp是否修改过
        let hash = kernel_1.SimpleHashFile("egretProperties.json");
        if (this._cfgdb.get("egret-prop-hash") != hash) {
            this._cfgdb.set("egret-prop-hash", hash);
            console.log("egret的配置更新");
            r = true;
        }
        return r;
    }
}
const RESMAKER_BLACKS = [
    /module\.res\.json$/,
    /\.swf$/,
    /\.fla$/,
    /^\./
];
const GENRES_BLACKS = RESMAKER_BLACKS.concat(/\.d\/|\.d$/);
class EgretResource extends resource_1.Resource {
    async refresh() {
        // 遍历所有的子文件，找出png\jpg\json，生成default.res.json文件并生成对应的group
        let jsobj = { 'groups': [], 'resources': [] };
        // 第一级的资源为不加入group中的
        kernel_1.ListFiles(EgretResource.ASSETS, null, GENRES_BLACKS, null, 1).forEach(file => {
            console.log(file);
        });
        // 处理其他级别的资源
        kernel_1.ListDirs(EgretResource.ASSETS, null, GENRES_BLACKS, null, 2).forEach(subdir => {
            console.log(subdir);
        });
        return true;
    }
    async publish() {
        return true;
    }
    async dist() {
        return true;
    }
}
EgretResource.ASSETS = "resource/assets/";
EgretResource.FILE = "resource/default.res.json";
