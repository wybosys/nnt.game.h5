Object.defineProperty(exports, "__esModule", { value: true });
const lowdb = require("lowdb");
const lowdbFileSync = require("lowdb/adapters/FileSync");
const uuidv4 = require("uuid/v4");
const fs = require("fs");
const crypto = require("crypto");
const ini = require("ini");
const inquirer = require("inquirer");
class EmbededKv {
    constructor(file) {
        let adapter = new lowdbFileSync(file);
        this._db = lowdb(adapter);
    }
    contains(key) {
        return this._db.get(key).value() != undefined;
    }
    get(key) {
        return this._db.get(key).value();
    }
    set(key, value) {
        this._db.set(key, value).write();
    }
}
exports.EmbededKv = EmbededKv;
class Ini {
    constructor(file) {
        this._file = file;
        if (fs.existsSync(file))
            this._config = ini.parse(fs.readFileSync(file, "utf-8"));
        else
            this._config = Object.create(null);
    }
    get(section, key, def = undefined) {
        if (section in this._config) {
            let obj = this._config[section];
            return obj[key];
        }
        return def;
    }
    set(section, key, value) {
        if (!(section in this._config)) {
            this._config[section] = Object.create(null);
        }
        this._config[section][key] = value;
    }
    save() {
        fs.writeFileSync(this._file, ini.stringify(this._config), "utf-8");
    }
}
exports.Ini = Ini;
function UUID() {
    return uuidv4().replace(/-/g, "");
}
exports.UUID = UUID;
async function CliInput(msg) {
    let r = await inquirer.prompt({ name: "wait", message: msg });
    let v = r["wait"];
    return v == '' ? null : v;
}
exports.CliInput = CliInput;
// 通过文件修改记录来快速生成文件的hash
function SimpleHashFile(file) {
    let st = fs.statSync(file);
    let str = [st.size, st.mtime, st.ctime].join(":");
    return MD5(str);
}
exports.SimpleHashFile = SimpleHashFile;
function MD5(str) {
    let hdl = crypto.createHash('md5').update(str);
    return hdl.digest().toString("base64");
}
exports.MD5 = MD5;
// 列出文件夹下所有文件，黑名单为rex
function ListFiles(dir, rets = null, blacklist = null, whitelist = null, depth = 1) {
    if (rets == null)
        rets = new Array();
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
            ListFiles(full, rets, blacklist, whitelist, depth);
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
            rets.push(full);
        }
    });
    return rets;
}
exports.ListFiles = ListFiles;
function ListDirs(dir, rets = null, blacklist = null, whitelist = null, depth = 1) {
    if (rets == null)
        rets = new Array();
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
            rets.push(full);
            ListDirs(full, rets, blacklist, whitelist, depth);
        }
    });
    return rets;
}
exports.ListDirs = ListDirs;
