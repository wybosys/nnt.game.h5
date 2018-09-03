import fs = require("fs");
import {EmbededKv, UUID} from "./kernel";

export class Config {
    constructor() {
        this._cfgdb = new EmbededKv(".n2~/build");
        if (!this._cfgdb.contains('uuid'))
            this._cfgdb.set('uuid', UUID());
    }

    clean() {
        if (fs.existsSync(".n2~/build"))
            fs.unlinkSync(".n2~/build");
    }

    // 通过引导建立配置信息
    make() {

    }

    // 检查配置是否修改过
    modified(): boolean {
        return false;
    }

    private _cfgdb: EmbededKv;
}