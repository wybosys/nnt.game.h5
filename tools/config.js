Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const kernel_1 = require("./kernel");
const VERSION = "0.0.1";
class Config {
    constructor() {
        this._cfgdb = new kernel_1.EmbededKv(".n2~/build");
        if (!this._cfgdb.contains('uuid'))
            this._cfgdb.set('uuid', kernel_1.UUID());
        this.refresh();
    }
    clean() {
        if (fs.existsSync(".n2~/build"))
            fs.unlinkSync(".n2~/build");
    }
    // 通过引导建立配置信息
    async make() {
        let arr = [['app', 'name', '游戏名称'],
            ['app', 'icon', 'ICON的路径'],
            ['app', 'background', '背景'],
            ['app', 'background-color', '背景颜色'],
            ['app', 'orientation', '方向 [h]ov/[v]ec'],
            ['app', 'resource', '资源的模式 [d]ebug/[p]ublish]'],
            ['app', 'version', '版本号'],
            ['dev', 'genresdb', '自动生成资源数据 [y]es/[n]o'],
            ['dev', 'automerge', '自动合并资源 [y]es/[n]o']];
        for (let i = 0, l = arr.length; i < l; ++i) {
            let e = arr[i];
            let old = this._cfg.get(e[0], e[1], '');
            let n = await kernel_1.CliInput(e[2] + ' 当前(' + old + '):');
            if (n == null) {
                n = old;
            }
            this._cfg.set(e[0], e[1], n);
        }
        this._cfg.save();
    }
    // 检查配置是否修改过
    async refresh() {
        // 如果不存在配置文件，则引导生成
        if (!fs.existsSync(".n2.cfg"))
            await this.make();
        else
            this._cfg = new kernel_1.Ini(".n2.cfg");
        // 比对配置文件是否修改过
        let hash = kernel_1.SimpleHashFile(".n2.cfg");
        let r = false;
        if (this._cfgdb.get("cfghash") != hash) {
            this._cfgdb.set("cfghash", hash);
            console.log("项目配置更新");
            r = true;
        }
        // 比对n2build是否修改过
        if (this._cfgdb.get("version") != VERSION) {
            this._cfgdb.set("version", VERSION);
            console.log("编译工具链更新");
            r = true;
        }
        return r;
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map