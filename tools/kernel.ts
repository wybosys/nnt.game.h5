import lowdb = require("lowdb");
import lowdbFileSync = require("lowdb/adapters/FileSync");
import uuidv4 = require('uuid/v4');
import fs = require("fs");
import crypto = require("crypto");
import ini = require("ini");
import inquirer = require("inquirer");

export type IndexedObject = { [key: string]: any };

export class EmbededKv {

    constructor(file: string) {
        let adapter = new lowdbFileSync(file);
        this._db = lowdb(adapter);
    }

    contains(key: string): boolean {
        return this._db.get(key).value() != undefined;
    }

    get(key: string) {
        return this._db.get(key).value();
    }

    set(key: string, value: any) {
        this._db.set(key, value).write();
    }

    private _db: any;
}

export class Ini {

    constructor(file: string) {
        this._file = file;
        if (fs.existsSync(file))
            this._config = ini.parse(fs.readFileSync(file, "utf-8"));
        else
            this._config = Object.create(null);
    }

    get(section: string, key: string, def: any = undefined): any {
        if (section in this._config) {
            let obj = this._config[section];
            return obj[key];
        }
        return def;
    }

    set(section: string, key: string, value: any) {
        if (!(section in this._config)) {
            this._config[section] = Object.create(null);
        }
        this._config[section][key] = value;
    }

    save() {
        fs.writeFileSync(ini.stringify(this._config), "utf-8");
    }

    private _config: any;
    private _file: string;
}

export function UUID(): string {
    return uuidv4().replace(/-/g, "");
}

export async function CliInput(msg: string): Promise<string> {
    return inquirer.prompt<string>({message: msg, default: null});
}

// 通过文件修改记录来快速生成文件的hash
export function SimpleHashFile(file: string): string {
    let st = fs.statSync(file);
    let str = [st.size, st.mtime, st.ctime].join(":");
    return MD5(str);
}

export function MD5(str: string): string {
    let hdl = crypto.createHash('md5').update(str);
    return hdl.digest().toString("base64");
}

export class IpcLocker {

}