Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const config_1 = require("./config");
const gendata_1 = require("./gendata");
const fs = require("fs");
const del = require("del");
class EgretGame extends game_1.Game {
    constructor() {
        super();
        this.config = new config_1.Config();
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
