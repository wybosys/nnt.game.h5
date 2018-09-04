import lowdb = require("lowdb");
import lowdbFileSync = require("lowdb/adapters/FileSync");
import uuidv4 = require('uuid/v4');
import fs = require("fs-extra");
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
        fs.writeFileSync(this._file, ini.stringify(this._config), "utf-8");
    }

    private _config: any;
    private _file: string;
}

export function UUID(): string {
    return uuidv4().replace(/-/g, "");
}

export async function CliInput(msg: string): Promise<string> {
    let r: any = await inquirer.prompt<string>({name: "wait", message: msg});
    let v = r["wait"];
    return v == '' ? null : v;
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

export function IsFile(path: string): boolean {
    let r = false;
    try {
        let st = fs.statSync(path);
        r = st.isFile();
    } catch (e) {
        // pass
    }
    return r;
}

export function IsDirectory(path: string): boolean {
    let r = false;
    try {
        let st = fs.statSync(path);
        r = st.isDirectory();
    } catch (e) {
        // pass
    }
    return r;
}

// 列出文件夹下所有文件，黑名单为rex
export function ListFiles(dir: string, rets: string[] = null, blacklist: RegExp[] = null, whitelist: RegExp[] = null, depth = 1, fullpath = true, curdir = ''): string[] {
    if (rets == null)
        rets = new Array<string>();
    if (depth == 0)
        return rets;
    else if (depth != -1)
        depth -= 1;
    if (!fs.statSync(dir).isDirectory())
        return rets;
    if (!dir.endsWith('/'))
        dir += '/';
    fs.readdirSync(dir).forEach(entry => {
        let full = dir + entry;
        let stat = fs.statSync(full);
        if (stat.isDirectory()) {
            ListFiles(full, rets, blacklist, whitelist, depth, fullpath, curdir + '/' + entry);
        }
        else if (stat.isFile()) {
            // 黑名单过滤
            let fnd = blacklist && blacklist.some(e => {
                return entry.match(e) != null;
            });
            if (fnd)
                return;
            // 白名单匹配
            if (whitelist) {
                fnd = whitelist.some(e => {
                    return entry.match(e) != null;
                });
                if (!fnd)
                    return;
            }
            // 找到一个符合规则的
            rets.push(fullpath ? full : curdir + '/' + entry);
        }
    });
    return rets;
}

export function ListDirs(dir: string, rets: string[] = null, blacklist: RegExp[] = null, whitelist: RegExp[] = null, depth = 1, fullpath = true, curdir = ''): string[] {
    if (rets == null)
        rets = new Array<string>();
    if (depth == 0)
        return rets;
    else if (depth != -1)
        depth -= 1;
    if (!fs.statSync(dir).isDirectory())
        return rets;
    if (!dir.endsWith('/'))
        dir += '/';
    fs.readdirSync(dir).forEach(entry => {
        let full = dir + entry;
        let stat = fs.statSync(full);
        if (stat.isDirectory()) {
            // 黑名单过滤
            let fnd = blacklist && blacklist.some(e => {
                return entry.match(e) != null;
            });
            if (fnd)
                return;
            // 白名单匹配
            if (whitelist) {
                fnd = whitelist.some(e => {
                    return entry.match(e) != null;
                });
                if (!fnd)
                    return;
            }
            // 找到一个符合规则的
            rets.push(fullpath ? full : curdir + '/' + entry);
            ListDirs(full, rets, blacklist, whitelist, depth, fullpath, curdir + '/' + entry);
        }
    });
    return rets;
}

export class ArrayT {
    /** 使用筛选器来删除对象 */
    static RemoveObjectByFilter<T>(arr: T[], filter: (o: T, idx: number) => boolean, ctx?: any): T {
        if (arr) {
            for (let i = 0; i < arr.length; ++i) {
                let e = arr[i];
                if (filter.call(ctx, e, i)) {
                    arr.splice(i, 1);
                    return e;
                }
            }
        }
        return null;
    }

    static RemoveObjectsByFilter<T>(arr: T[], filter: (o: T, idx: number) => boolean, ctx?: any): T[] {
        let r = new Array();
        if (!arr)
            return r;
        let res = arr.filter((o, idx): boolean => {
            if (filter.call(ctx, o, idx)) {
                r.push(o);
                return false
            }
            return true;
        }, this);
        if (arr.length == res.length)
            return r;
        ArrayT.Set(arr, res);
        return r;
    }

    /** 使用另一个数组来填充当前数组 */
    static Set<T>(arr: T[], r: T[]) {
        arr.length = 0;
        r.forEach((o) => {
            arr.push(o);
        }, this);
    }

    /** 删除一个对象 */
    static RemoveObject<T>(arr: T[], obj: T): boolean {
        if (obj == null || arr == null)
            return false;
        let idx = arr.indexOf(obj);
        if (idx == -1)
            return false;
        arr.splice(idx, 1);
        return true;
    }
}

export class StringT {
    // 标准的substr只支持正向，这里实现的支持两个方向比如，substr(1, -2)
    static SubStr(str: string, pos: number, len?: number): string {
        if (len == null || len >= 0)
            return str.substr(pos, len);
        if (pos < 0)
            pos = str.length + pos;
        pos += len;
        let of = 0;
        if (pos < 0) {
            of = pos;
            pos = 0;
        }
        return str.substr(pos, -len + of);
    }
}