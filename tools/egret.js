Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const config_1 = require("./config");
const fs = require("fs");
const del = require("del");
class EgretGame extends game_1.Game {
    constructor() {
        super();
        this.config = new config_1.Config();
    }
    clean() {
        super.clean();
        // 清除egret的中间文件
        if (fs.existsSync("bin-debug"))
            del.sync("bin-debug");
        if (fs.existsSync("libs"))
            del.sync("libs");
    }
}
exports.EgretGame = EgretGame;
