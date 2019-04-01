import lowdb = require("lowdb");
import lowdbFileSync = require("lowdb/adapters/FileSync");
import uuidv4 = require('uuid/v4');
import fs = require("fs-extra");
import crypto = require("crypto");
import ini = require("ini");
import inquirer = require("inquirer");
import async = require("async");
import xmldom = require("xmldom");
import fsext = require("fs-ext");
import execa = require("execa");
import os = require("os");

export type IndexedObject = { [key: string]: any };

export class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    move(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    x: number;
    y: number;
}

export class Size {
    constructor(w = 0, h = 0) {
        this.width = w;
        this.height = h;
    }

    resize(w = 0, h = 0) {
        this.width = w;
        this.height = h;
    }

    width: number;
    height: number;

    aera(): number {
        return this.width * this.height;
    }
}

export class Rect extends Size {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        super(w, h);
        this.x = x;
        this.y = y;
    }

    moveto(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    x: number;
    y: number;
}

export class EmbededKv {

    constructor(file: string) {
        let adapter = new lowdbFileSync(file);
        this._db = lowdb(adapter);
        if (this._db.has('data').value()) {
            this._obj = this._db.get('data').value();
        } else {
            this._obj = Object.create(null);
            this._db.set('data', this._obj).write();
        }
    }

    contains(key: string): boolean {
        return key in this._obj;
    }

    get(key: string) {
        return this._obj[key];
    }

    set(key: string, value: any) {
        this._obj[key] = value;
        this._db.set('data', this._obj).write();
    }

    clear() {
        this._obj = Object.create(null);
        this._db.set('data', this._obj).write();
    }

    forEach(proc: (val: any, key: string) => void) {
        for (let k in this._obj)
            proc(this._obj[k], k);
    }

    private _obj: IndexedObject;
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

export function MD5(str: string, method = "base64"): string {
    let hdl = crypto.createHash('md5').update(str);
    return hdl.digest().toString(method);
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
        } else if (stat.isFile()) {
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

export function DirAtChild(dir: string, childidx: number, full?: boolean): string {
    let children = fs.readdirSync(dir);
    let r = children[childidx];
    if (full)
        r = dir + '/' + r;
    return r;
}

export function CombineFile(paths: string[], output: string) {
    let buf = '';
    paths.forEach(e => {
        buf += fs.readFileSync(e);
    });
    fs.writeFileSync(output, buf);
}

export function ReadFileLines(file: string): string[] {
    let content = fs.readFileSync(file, {encoding: 'utf-8'});
    return content.split('\n');
}

export function LinesReplace(lines: string[], begin: RegExp, end: RegExp, rep: string[]): string[] {
    let idxbeg = -1, idxend = -1;
    for (let i = 0, l = lines.length; i < l; ++i) {
        const line = lines[i];
        if (idxbeg == -1 && line.match(begin)) {
            idxbeg = i;
            continue;
        }
        if (idxend == -1 && line.match(end)) {
            idxend = i;
            break;
        }
    }
    if (idxbeg == -1 || idxend == -1)
        return lines;
    let l = ArrayT.RangeOf(lines, 0, idxbeg + 1);
    let r = ArrayT.RangeOf(lines, idxend);
    return ArrayT.Merge(l, rep, r);
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

    static Merge<T>(...arr: Array<Array<T>>): T[] {
        let r = new Array<T>();
        arr && arr.forEach(e => {
            if (e)
                r = r.concat(e);
        });
        return r;
    }

    static QueryObject<T>(arr: Array<T>, filter: (e: T, idx?: number) => boolean): T {
        if (arr)
            for (let i = 0, l = arr.length; i < l; ++i) {
                let e = arr[i];
                if (filter(e, i))
                    return e;
            }
        return null;
    }

    /** 使用比较函数来判断是否包含元素 */
    static Contains<L, R>(arr: L[], o: R): boolean {
        return arr.some((each: any): boolean => {
            return each == o;
        }, this);
    }

    /** 取得一段 */
    static RangeOf<T>(arr: Array<T>, pos: number, len?: number): Array<T> {
        let n = arr.length;
        if (pos < 0) {
            pos = n + pos;
            if (pos < 0)
                return arr;
        }
        if (pos >= n)
            return [];
        let c = len == null ? n : pos + len;
        return arr.slice(pos, c);
    }
}

export class SetT {

    static ToArray<T>(s: Set<T>): T[] {
        let r: T[] = [];
        s.forEach(e => {
            r.push(e);
        });
        return r;
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

    static UpcaseFirst(str: string): string {
        if (!str || !str.length)
            return "";
        return str[0].toUpperCase() + str.substr(1);
    }
}

export class ObjectT {
    static RemoveKeyByFilter(obj: IndexedObject, filter: (val: any, key: any) => boolean): IndexedObject {
        let keys = Object.keys(obj);
        for (let i = 0, l = keys.length; i < l; ++i) {
            let key = keys[i];
            let val = obj[key];
            if (filter(val, key)) {
                delete obj[key];
                let r = Object.create(null);
                r[key] = val;
                return r;
            }
        }
        return null;
    }
}

export class DateTime {
    static Current(): number {
        return (new Date().getTime() / 1000) >> 0;
    }
}

/** 转换到字符串 */
export function asString(o: any, def = ''): string {
    if (o == null)
        return def;
    let tp = typeof (o);
    if (tp == 'string')
        return <string>o;
    if (tp == 'number')
        return SafeNumber(o).toString();
    if (o.toString) {
        let t = o.toString();
        if (t != "[object Object]")
            return t;
    }
    // 转换成json
    let r: string;
    try {
        r = JSON.stringify(o);
    } catch (err) {
        r = def;
    }
    return r;
}

function SafeNumber(o: any, def = 0): number {
    return isNaN(o) ? def : o;
}


/** 带保护的判断对象是不是 0 */
export function isZero(o: any): boolean {
    if (o == null || o == 0)
        return true;
    if (o.length)
        return o.length == 0;
    return false;
}

/** 转换到 float */
export function toDouble(o: any, def = 0): number {
    if (o == null)
        return def;
    let tp = typeof (o);
    if (tp == 'number')
        return SafeNumber(o, def);
    if (tp == 'string') {
        let v = parseFloat(o);
        return SafeNumber(v, def);
    }
    if (o.toNumber)
        return o.toNumber();
    return def;
}

/** 转换到 int */
export function toInt(o: any, def = 0): number {
    if (o == null)
        return def;
    let tp = typeof (o);
    if (tp == 'number' || tp == 'string') {
        let v = parseInt(o);
        return SafeNumber(v, def);
    }
    if (o.toNumber)
        return o.toNumber() >> 0;
    return def;
}

/** 转换到数字
 @brief 如果对象不能直接转换，会尝试调用对象的 toNumber 进行转换
 */
export function toNumber(o: any, def = 0): number {
    if (o == null)
        return def;
    let tp = typeof (o);
    if (tp == 'number')
        return SafeNumber(o, def);
    if (tp == 'string') {
        let v = Number(<string>o);
        return SafeNumber(v, def);
    }
    if (o.toNumber)
        return o.toNumber();
    return def;
}

export type QueueCallback = (next: () => void) => void;

export class AsyncQueue {

    add(func: QueueCallback): AsyncQueue {
        this._store.push(func);
        return this;
    }

    done(cb: QueueCallback): AsyncQueue {
        this._done = cb;
        return this;
    }

    run() {
        async.forEach(this._store, (cb, err) => {
            cb(err);
        }, this._done);
    }

    private _store = new Array<QueueCallback>();
    private _done: QueueCallback;
}

export function static_cast<T>(l: any): T {
    return <T>l;
}

export function LoadXmlFile(file: string): Document {
    let content = fs.readFileSync(file, {encoding: 'utf-8'});
    let parser = new xmldom.DOMParser();
    let doc = parser.parseFromString(content);
    return doc;
}

export function SaveXmlFile(doc: Document, file: string) {
    let ser = new xmldom.XMLSerializer();
    let content = ser.serializeToString(doc);
    fs.writeFileSync(file, content, {encoding: 'utf-8'});
}

export enum XmlNode {
    ELEMENT_NODE = 1,
    TEXT_NODE = 3,
    CDATA_SECTION_NODE = 4,
    PROCESSING_INSTRUCTION_NODE = 7,
    COMMENT_NODE = 8,
    DOCUMENT_NODE = 9,
    DOCUMENT_TYPE_NODE = 10,
    DOCUMENT_FRAGMENT_NODE = 11
}

export class FileLocker {

    constructor(file: string) {
        this._fd = fsext.openSync(file, 'w');
    }

    acquire(): boolean {
        let r = true;
        try {
            fsext.flockSync(this._fd, "exnb");
        } catch (ex) {
            r = false;
        }
        return r;
    }

    release() {
        try {
            fsext.flockSync(this._fd, "un");
        } catch (ex) {
        }
    }

    trylock(): boolean {
        if (this.acquire()) {
            this.release();
            return true;
        }
        return false;
    }

    private _fd: number;
}

export function toJson(o: IndexedObject, def: string = null, space?: number) {
    let r: string;
    try {
        if (space)
            r = JSON.stringify(o, null, space);
        else
            r = JSON.stringify(o);
    } catch (err) {
        r = def;
    }
    return r;
}

export function toJsonObject(o: any, def: any = null): IndexedObject {
    let t = typeof (o);
    if (t == 'string') {
        if (o == "undefined" || o == "null")
            return def;
        let r: any;
        try {
            r = JSON.parse(o as string);
        } catch (err) {
            console.warn(o + " " + err);
            r = def;
        }
        return r;
    } else if (t == 'object')
        return <any>o;
    return def;
}

export function NotMatch(str: string, pat: RegExp[]): RegExp {
    for (let i = 0, l = pat.length; i < l; ++i) {
        if (str.match(pat[i]) == null)
            return pat[i];
    }
    return null;
}

export function IsMatch(str: string, pat: RegExp[]): RegExp {
    for (let i = 0, l = pat.length; i < l; ++i) {
        if (str.match(pat[i]))
            return pat[i];
    }
    return null;
}

function cygwin(cmd: string): string {
    let old = process.cwd();
    let ret = '';
    if (fs.existsSync("c:/cygwin"))
        process.chdir('c:/cygwin/bin');
    else
        process.chdir('c:/cygwin64/bin');
    try {
        let res = execa.shellSync('bash --login -i -c  "' + cmd + '"');
        ret = res.stdout;
    } catch (err) {
        console.warn(err.toString());
    }
    process.chdir(old);
    return ret;
}

const IS_WINDOWS = os.type() == 'Windows_NT';

export function RunInBash(file: string): string {
    if (IS_WINDOWS)
        return cygwin(file);

    try {
        let res = execa.shellSync(file);
        return res.stdout;
    } catch (err) {
        console.warn(err.toString());
    }
    return null;
}
