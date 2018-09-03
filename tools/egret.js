Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const fs = require("fs");
const del = require("del");
class EgretGame extends game_1.Game {
    clean() {
        super.clean();
        // 清除egret的中间文件
        if (fs.existsSync("bin-debug"))
            del.sync("bin-debug");
    }
}
exports.EgretGame = EgretGame;
