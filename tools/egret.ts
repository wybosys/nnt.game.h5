import {Game} from "./game";
import {Config} from "./config";
import {Gendata} from "./gendata";
import {IndexedObject, ListDirs, ListFiles, SimpleHashFile} from "./kernel";
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

const RESMAKER_BLACKS = [
    /module\.res\.json$/,
    /\.swf$/,
    /\.fla$/,
    /^\./
];

const GENRES_BLACKS = RESMAKER_BLACKS.concat(/\.d\/|\.d$/);

class EgretResource extends Resource {
    static ASSETS = "resource/assets/";
    static FILE = "resource/default.res.json";

    async refresh(): Promise<boolean> {
        // 遍历所有的子文件，找出png\jpg\json，生成default.res.json文件并生成对应的group
        let jsobj: IndexedObject = {'groups': [], 'resources': []};
        // 第一级的资源为不加入group中的
        ListFiles(EgretResource.ASSETS, null, GENRES_BLACKS, null, 1).forEach(file => {
            console.log(file);
        });
        // 处理其他级别的资源
        ListDirs(EgretResource.ASSETS, null, GENRES_BLACKS, null, 2).forEach(subdir => {
            console.log(subdir);
        });
        return true;
    }

    async publish(): Promise<boolean> {
        return true;
    }

    async dist(): Promise<boolean> {
        return true;
    }
}