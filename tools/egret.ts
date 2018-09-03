import {Game} from "./game";
import {Config} from "./config";
import {Gendata} from "./gendata";
import {SimpleHashFile} from "./kernel";
import {Service} from "./service";
import {Resource} from "./resource";
import fs = require("fs-extra");

export class EgretGame extends Game {

    constructor() {
        super();
        this.config = new EgretConfig();
        this.gendata = new Gendata();
        this.service = new Service();
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

class EgretResource extends Resource {
    assets = "resource/assets/";
    file = "resource/default.res.json";

    async refresh(): Promise<boolean> {
        return true;
    }

    async publish(): Promise<boolean> {
        return true;
    }

    async dist(): Promise<boolean> {
        return true;
    }
}