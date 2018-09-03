import lowdb = require("lowdb");
import lowdbFileSync = require("lowdb/adapters/FileSync");
import uuidv4 = require('uuid/v4');
import fs = require("fs");
import crypto = require("crypto");

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

    protected _db: any;
}

export function UUID(): string {
    return uuidv4().replace(/-/g, "");
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