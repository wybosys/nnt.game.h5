Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const config_1 = require("./config");
const gendata_1 = require("./gendata");
const kernel_1 = require("./kernel");
const fs = require("fs");
const del = require("del");
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
class EgretGame extends game_1.Game {
    constructor() {
        super();
        this.config = new EgretConfig();
        this.gendata = new gendata_1.Gendata();
    }
    clean() {
        super.clean();
        // 清除egret的中间文件
        if (fs.existsSync("bin-debug"))
            del.sync("bin-debug");
        if (fs.existsSync("libs"))
            del.sync("libs");
        if (fs.existsSync(".n2~/dist"))
            del.sync(".n2~/dist");
    }
}
exports.EgretGame = EgretGame;
