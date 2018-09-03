import {Game} from "./game";
import fs = require("fs");
import del = require("del");

export class EgretGame extends Game {

    clean() {
        super.clean();

        /*
        // 清除egret的中间文件
        if (fs.existsSync("bin-debug"))
            del.sync("bin-debug/**");
            */
    }
}