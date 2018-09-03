import {Game} from "./game";
import {Config} from "./config";
import fs = require("fs");
import del = require("del");

export class EgretGame extends Game {

    constructor() {
        super();
        this.config = new Config();
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