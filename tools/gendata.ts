import fs = require("fs-extra");
import {CombineFile, EmbededKv, ListFiles, SimpleHashFile} from "./kernel";

const PAT_EXCEL = [/\.xlsx$/];
const PAT_EXCEL_IGNORE = [/^~/, /^#/]; // office文件打开会产生临时文件
const PAT_JS = [/\.js$/];

export class Gendata {

    constructor() {
        this._cfgdb = new EmbededKv(".n2~/src/gendata");
    }

    clean() {
        fs.removeSync(".n2~/src/gendata");
    }

    // 处理项目中的excel文件
    build() {
        fs.ensureDirSync(".n2~/src/gendata");
        // 处理所有的excel文件
        const files = ListFiles('project/src/app', null, PAT_EXCEL_IGNORE, PAT_EXCEL, 999);
        files.forEach(file=>{
            const hash = SimpleHashFile(file);
            const key = file.replace('/', '_');
            if (this._cfgdb.get(key) == hash)
                return;
            this.buildOneXlsx(file);
            this._cfgdb.set(key, hash);
        });
        // 合并处理过的js
        const jsfiles = ListFiles('.n2~/src', null, null, PAT_JS);
        CombineFile(jsfiles, 'resource/default.data.js');
    }

    protected buildOneXlsx(file:string) {

    }

    protected _cfgdb: EmbededKv;
}
