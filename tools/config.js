Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const kernel_1 = require("./kernel");
class Config {
    constructor() {
        this._cfgdb = new kernel_1.EmbededKv(".n2~/build");
        if (!this._cfgdb.contains('uuid'))
            this._cfgdb.set('uuid', kernel_1.UUID());
    }
    clean() {
        if (fs.existsSync(".n2~/build"))
            fs.unlinkSync(".n2~/build");
    }
    // 通过引导建立配置信息
    make() {
    }
    // 检查配置是否修改过
    modified() {
        return false;
    }
}
exports.Config = Config;
