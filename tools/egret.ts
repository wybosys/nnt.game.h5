import {Game} from "./game";
import {Config} from "./config";
import {Gendata} from "./gendata";
import {SimpleHashFile} from "./kernel";
import fs = require("fs");
import del = require("del");

class EgretConfig extends Config {

    async refresh(): Promise<boolean> {
        let r = await super.refresh();
        // 比对egretProp是否修改过
        let hash = SimpleHashFile("egretProperties.json");
        if (this._cfgdb.get("egret-prop-hash") != hash) {
            this._cfgdb.set("egret-prop-hash", hash);
            console.log("egret的配置更新");
            r = true;
        }
        return r;
    }
}

export class EgretGame extends Game {

    constructor() {
        super();
        this.config = new EgretConfig();
        this.gendata = new Gendata();
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