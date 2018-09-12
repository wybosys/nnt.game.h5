import fs = require("fs-extra");
import {CliInput, EmbededKv, Ini, SimpleHashFile, UUID} from "./kernel";

const VERSION = "0.0.1";

export class Config {

    constructor() {
        this._cfgdb = new EmbededKv(".n2~/build");
        if (!this._cfgdb.contains('uuid'))
            this._cfgdb.set('uuid', UUID());
        this.refresh();
    }

    clean() {
        fs.removeSync(".n2~/build");
    }

    get(sec: string, key: string): any {
        return this._cfg.get(sec, key, null);
    }

    get uuid(): string {
        return this._cfgdb.get('uuid');
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
            let n = await CliInput(e[2] + ' 当前(' + old + '):');
            if (n == null) {
                n = old;
            }
            this._cfg.set(e[0], e[1], n);
        }
        this._cfg.save();
    }

    // 检查配置是否修改过
    async refresh(): Promise<boolean> {
        // 如果不存在配置文件，则引导生成
        if (!fs.existsSync(".n2.cfg"))
            await this.make();
        else
            this._cfg = new Ini(".n2.cfg");
        // 比对配置文件是否修改过
        let hash = SimpleHashFile(".n2.cfg");
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

    protected _cfg: Ini;
    protected _cfgdb: EmbededKv;
}