import fs = require("fs-extra");
import tpl = require("dustjs-linkedin");
import xlsx = require("xlsx");
import execa = require("execa");
import {
    ArrayT,
    asString,
    AsyncQueue,
    IsMatch,
    ListFiles,
    NotMatch,
    static_cast,
    StringT,
    toJson,
    toJsonObject
} from "./kernel";
import {Service} from "./service";
import path = require("path");
import watch = require("watch");

const PAT_EXCEL = [/\.xlsx$/];
const PAT_EXCEL_IGNORE = [/^~/, /^#/]; // office文件打开会产生临时文件
const PAT_JS = [/\.js$/];

export class Gendata {

    clean() {
        fs.removeSync(".n2/gendata");
        fs.removeSync("project/resource/default.data.js");
        fs.removeSync("project/resource/default.data.d.ts");
    }

    // 处理项目中的excel文件
    async build() {
        fs.ensureDirSync(".n2/gendata");

        // 所有的excel文件
        const paths = ListFiles('project/src/app/data', null, PAT_EXCEL_IGNORE, PAT_EXCEL, -1);

        // 提取有效的
        const files = ReadFiles(paths, {client: true});

        // 转换
        new AsyncQueue()
            .add(next => {
                let tplcfg = (<any>tpl).config;
                let old = tplcfg.whitespace;
                tplcfg.whitespace = true;
                let compiled = tpl.compile(TPL_CONFIGS, "configs-generator");
                tplcfg.whitespace = old;
                tpl.loadSource(compiled);
                next();
            })
            .add(next => {
                tpl.render("configs-generator", {files: files}, (err, out) => {
                    if (err)
                        out = err.toString();
                    fs.writeFileSync('.n2/gendata/data.ts', out);
                    next();
                });
            })
            .add(next => {
                execa.shellSync('tsc -d -t es5 .n2/gendata/data.ts');
                fs.moveSync('.n2/gendata/data.js', 'project/resource/default.data.js', {overwrite: true});
                fs.moveSync('.n2/gendata/data.d.ts', 'project/resource/default.data.d.ts', {overwrite: true});
                fs.removeSync('.n2/gendata/data.ts');
            })
            .run();
    }

    async startWatch(svc: Service) {
        if (!Service.Locker('gendata').trylock())
            return;

        // 第一次运行，执行构建
        await this.build();

        let res = execa('node', ['tools/gendata.js'], {
            detached: true,
            stdio: 'ignore'
        });
        res.unref();
        svc.add(res, 'gendata');
    }
}

export let TPL_CONFIGS = "module Data {~lb}\n" +
    "\n" +
    "type undecl = string;\n" +
    "type rowindex = number;\n" +
    "let t:any;\n" +
    "\n" +
    "interface pair <K, V> {k:K;v:V;}\n" +
    "\n" +
    "{#files}{#.sheets}\n" +
    "    export class {.clazzname} {~lb}\n" +
    "        {#.fields}{?.}{?.comment}//{.comment}{/.comment}\n" +
    "        get {.name}():{.typestring|s} {~lb} return this.cfg[{.index}]; {~rb} {/.}\n" +
    "        {/.fields}\n" +
    "        {#.fields}{?.}static {.indexName} = {.index};{/.}\n" +
    "        {/.fields}\n" +
    "        {#.consts}static {.name} = {.value|s};\n" +
    "        {/.consts}\n" +
    "        static Get(key:{.keytype}):{.clazzname} {~lb}return key in _{.name}Map ? new {.clazzname}(_{.name}Map[key]) : null;{~rb}\n" +
    "        constructor(d:any) {~lb} this.cfg = d; {~rb}\n" +
    "        cfg:any;\n" +
    "    {~rb}\n" +
    "{/.sheets}{/files}\n" +
    "{#files}{#.sheets}\n" +
    "    export const {.name}s:Array<any> = [\n" +
    "        {.datastring|s}\n" +
    "        ];\n" +
    "{/.sheets}{/files}\n" +
    "{#files}{#.sheets}\n" +
    "        t = {.name}s;\n" +
    "        let _{.name}Map:any = {\n" +
    "        {.mapstring|s}\n" +
    "        };\n" +
    "{/.sheets}{/files}\n" +
    "\n" +
    "{~rb}\n";

/*
* 生成的是完整的ts代码，包含定义以及数据段
* 列子：
* export module configs {
* export interface Test {
* }
* export const tests:Test[] = [
* {....},
* {....}
* ];
* }
* */

export interface ConfigCfg {
    in: string, // excel目录
    server: string; // 输出服务器用的文件
    client: string; // 输出客户端用的文件
}


let ROW_COMMENT = 0;
let ROW_DEF = 1;
let ROW_TYPE = 2;
let ROW_DATA = 3;

class Type {
    config: string;
    client: boolean;
    server: boolean;
}

export interface Processor {
    // 转换后的类型
    string?: boolean;
    number?: boolean;
    type?: string;

    // 数值转换
    convert(value: string): string;
}

// 提供给业务层注册对自定义类型的处理器
export function RegisterConfigProcessor(config: string, proc: Processor) {
    processors.set(config, proc);
}

let processors = new Map<string, Processor>();

class Field {

    private _name: string;
    pname: string;

    get name(): string {
        return this._name;
    }

    set name(str: string) {
        this._name = str;
        this.pname = str.toLowerCase();
    }

    // 字段的类型
    number?: boolean;
    string?: boolean;

    index: number;
    comment: string;

    // 生成field的index名称
    get indexName(): string {
        return "INDEX_" + this.name.toUpperCase();
    }

    // 获得类型字符串
    get typestring(): string {
        if (this.type && this.type.config) {
            let proc = processors.get(this.type.config);
            if (proc) {
                if (proc.string)
                    return "string";
                if (proc.number)
                    return "number";
                if (proc.type)
                    return proc.type;
            }
        }
        if (this.string)
            return "string";
        if (this.number)
            return "number";
        return "undecl";
    }

    type: Type; // field可以明确设置类型，也用来留给业务层自定义配置字段来使用
}

class Const {
    name: string;
    value: any;
}

let PFIELDS = ['const'];

class Sheet {
    name: string;
    fields = new Array<Field>(); // 可用的fields
    pfields = new Array<Field>(); // 预留的fields
    datas = new Array(); // 所有的数据
    consts = new Array<Const>(); // 配置的静态key

    get keytype(): string {
        let fp = ArrayT.QueryObject(this.fields, e => {
            return e.name == "id";
        });
        if (fp) {
            if (fp.number)
                return "number";
            if (fp.string)
                return "string";
            if (fp.type && fp.type.config) {
                let fnd = processors.get(fp.type.config);
                if (fnd)
                    return fnd.type;
            }
        }
        return "rowindex";
    }

    get clazzname(): string {
        return StringT.UpcaseFirst(this.name);
    }

    get datastring(): string {
        let strs = new Array();
        this.datas.forEach((row: Array<any>) => {
            let d = new Array();
            for (let i = 0, l = row.length; i < l; ++i) {
                let e = row[i];
                let f = this.fields[i];
                if (!f) {
                    d.push("");
                    continue;
                }
                // 确保e不是空
                if (e == null) {
                    if (f.number)
                        e = 0;
                    else
                        e = "";
                }
                let val: string;
                if (f.type && f.type.config) {
                    let proc = processors.get(f.type.config);
                    if (!proc) {
                        console.log("没有找到 " + this.name + " 自定义配置 " + f.type.config);
                    }
                    else {
                        e = proc.convert(e.toString());
                        if (proc.string)
                            val = '"' + e + '"';
                        else if (e != null)
                            val = e;
                        else
                            val = "";
                    }
                }
                else {
                    if (f.string)
                        val = '"' + e + '"';
                    else
                        val = e;
                }
                d.push(val);
            }
            strs.push('[' + d.join(",") + ']');
        });
        return strs.join(",");
    }

    get mapdatas(): Array<{ key: any, val: number }> {
        // 在fields里面查找名字为id的栏位，查不到则使用行号
        let fp = ArrayT.QueryObject(this.fields, e => {
            return e.name == "id";
        });
        let r = new Array();
        this.datas.forEach((row, idx) => {
            let key: any;
            if (fp == null) {
                key = idx;
            }
            else {
                if (fp.string)
                    key = '"' + row[fp.index] + '"';
                else
                    key = row[fp.index];
            }
            if (key == null)
                key = idx; // 如果漏掉，为了不报错，自动以row为准
            // 如果key是数字，并且key<0，则需要加上引号
            if (key < 0)
                key = "\"" + key + "\"";
            r.push({key: key, val: idx})
        });
        return r;
    }

    get mapstring(): string {
        let m = this.mapdatas;
        let r = new Array();
        m.forEach(e => {
            r.push(e.key + ":t[" + e.val + "]");
        });
        return r.join(",");
    }
}

class File {
    path: string;
    sheets = new Array<Sheet>();
}

interface ParseOption {
    server?: boolean;
    client?: boolean;
}

function ReadFiles(files: string[], opt: ParseOption): File[] {
    let ret = new Array<File>();
    files.forEach(file => {
        let f = ParseFile(file, opt);
        ret.push(f);
    });
    // 检查数据结构
    let clazzes = new Set();
    for (let i = 0; i < ret.length; ++i) {
        let f = ret[i];
        for (let i = 0; i < f.sheets.length; ++i) {
            let s = f.sheets[i];
            if (clazzes.has(s.clazzname)) {
                console.warn("数据表中出现了重复的名称 " + s.name + " " + f.path);
                return [];
            }
            clazzes.add(s.clazzname);
        }
    }
    return ret;
}

function ParseFile(path: string, opt: ParseOption): File {
    let r = new File();
    let file = xlsx.readFile(path, {
        type: 'file',
        cellStyles: true,
        cellNF: true
    });
    file.SheetNames.forEach(e => {
        let s = ParseSheet(e, file.Sheets[e], opt);
        if (!s) {
            console.log("跳过处理 " + e + "@" + path);
            return;
        }
        r.sheets.push(s);
    });
    r.path = path;
    return r;
}

function ParseSheet(nm: string, s: xlsx.WorkSheet, opt: ParseOption): Sheet {
    let pat = /Sheet\d+/;
    if (nm.match(pat))
        return null; //

    let r = new Sheet();
    r.name = nm.toLowerCase();
    // 读取字段表
    let aoa = xlsx.utils.sheet_to_json(s, {header: 1});
    let rowdef = static_cast<Array<any>>(aoa[ROW_DEF]);
    if (rowdef == null) {
        console.log("没有找到 " + nm + " 的定义段");
        return null;
    }
    let rowtype = static_cast<Array<any>>(aoa[ROW_TYPE]);
    // 通过从数据行开始的数据来确定field的类型
    let rowcmt: any = aoa[ROW_COMMENT]; // 注释
    rowdef.forEach((e, idx) => {
        if (e == null)
            return;

        let f = FieldOfColumn(s, aoa, idx);
        f.name = e;
        f.comment = rowcmt[idx];

        // 字段类型
        let ftype: string = rowtype[idx];
        if (ftype) {
            let fts = ftype.split(",");
            let t = new Type();
            fts.forEach(e => {
                switch (e) {
                    case "C":
                        t.client = true;
                        break;
                    case "S":
                        t.server = true;
                        break;
                    default:
                        t.config = e;
                        break;
                }
            });
            f.type = t;
        }

        // 加入到字段组
        if (PFIELDS.indexOf(f.pname) == -1) {
            // 如果不是当前需要处理的类型，掠过
            if (f.type) {
                if (f.type.client) {
                    if (opt.client)
                        r.fields.push(f);
                }
                else if (f.type.server) {
                    if (opt.server)
                        r.fields.push(f);
                }
                else {
                    r.fields.push(f);
                }
            }
            else
                r.fields.push(f);
        }
        else {
            r.pfields.push(f);
        }
    });

    // 没有找到可用的字段
    if (r.fields.length == 0) {
        console.log("没有找到可用的数据段");
        return null;
    }

    // 查找id的定义
    let idfp = ArrayT.QueryObject(r.fields, e => {
        return e.name == "id";
    });
    // 从第三行开始读取数据
    for (let i = ROW_DATA; i < aoa.length; ++i) {
        let row = <any[]>aoa[i];
        // 提取并删除预留的数据
        r.pfields.forEach(f => {
            let v = row[f.index];
            if (v) {
                if (f.pname == "const") {
                    let c = new Const();
                    c.name = v.replace(/\./g, "_").toUpperCase();
                    if (idfp) {
                        let cv = row[idfp.index];
                        if (idfp.string)
                            cv = '"' + cv + '"';
                        c.value = cv;
                    }
                    else {
                        c.value = r.datas.length;
                    }
                    r.consts.push(c);
                }
            }
        });
        // 只保留需要得数据
        let nrow = new Array();
        r.fields.forEach(e => {
            let data = row[e.index];
            if (data && e.string) {
                if (typeof data != "string")
                    data = asString(data);
                // 处理换行
                data = data.replace(/\n/g, "\\n");
            }
            nrow.push(data);
        });
        r.datas.push(nrow);
    }
    // 重新设置field的索引
    r.fields.forEach((e, idx) => {
        e.index = idx;
    });
    return r;
}

function FieldOfColumn(s: xlsx.WorkSheet, aoa: any[], idx: number): Field {
    let r = new Field();
    r.index = idx;
    // 从数据行开始找第一个可以探知类型的
    for (let i = ROW_DATA; i < aoa.length; ++i) {
        let row = aoa[i];
        let cell = row[idx];
        if (cell == null)
            continue;
        let nm = xlsx.utils.encode_cell({c: idx, r: i});
        let style = s[nm];
        switch (style.t) {
            case 'n':
                r.number = true;
                break;
            case 's':
                r.string = true;
                break;
        }
        break;
    }
    return r;
}

// 服务
if (path.basename(process.argv[1]) == 'gendata.js') {
    Service.Locker('gendata').acquire();

    let gd = new Gendata();
    watch.createMonitor('project/src/app/data', moniter => {
        moniter.on('created', (f: string, stat) => {
            if (!NotMatch(f, PAT_EXCEL_IGNORE) && IsMatch(f, PAT_EXCEL))
                gd.build();
        });
        moniter.on('changed', (f: string, stat) => {
            if (!NotMatch(f, PAT_EXCEL_IGNORE) && IsMatch(f, PAT_EXCEL))
                gd.build();
        });
        moniter.on('removed', (f: string, stat) => {
            if (!NotMatch(f, PAT_EXCEL_IGNORE) && IsMatch(f, PAT_EXCEL))
                gd.build();
        });
    });
}

// 注册自定义的配置项生成器
class IntProcessor implements Processor {
    type = "number";

    convert(val: string): string {
        return val;
    }
}

RegisterConfigProcessor("Int", new IntProcessor());

class StrProcessor implements Processor {
    type = "string";

    convert(val: string): string {
        return '"' + val + '"';
    }
}

RegisterConfigProcessor("Str", new StrProcessor());

class ItemProcessor implements Processor {
    type = "pair<number, number>";

    convert(val: string): string {
        return ItemProcessor.Convert(val.toString());
    }

    static Convert(val: string): string {
        let sp = val.split(":");
        if (sp.length != 2)
            return "";
        return '{k:' + sp[0] + ", v:" + sp[1] + '}';
    }
}

RegisterConfigProcessor("Item", new ItemProcessor());

class ItemsProcessor implements Processor {
    type = "pair<number, number>[]";

    convert(val: string): string {
        let sp = val.split(",");
        let arr = new Array();
        sp.forEach(e => {
            if (!e)
                return;
            arr.push(ItemProcessor.Convert(e));
        });
        return '[' + arr.join(",") + ']';
    }
}

RegisterConfigProcessor("Items", new ItemsProcessor());

class IntsProcessor implements Processor {
    type = "number[]";

    convert(val: string): string {
        return '[' + val + ']';
    }
}

RegisterConfigProcessor("Ints", new IntsProcessor());

class StrsProcessor implements Processor {
    type = "string[]";

    convert(val: string): string {
        let sp = val.split(",");
        let arr = new Array();
        sp.forEach(e => {
            arr.push('"' + e + '"');
        });
        return '[' + arr.join(',') + ']';
    }
}

RegisterConfigProcessor("Strs", new IntsProcessor());

class IntssProcessor implements Processor {
    type = "number[][]";

    convert(val: string): string {
        return IntssProcessor.Convert(val.toString());
    }

    static Convert(val: string): string {
        let arr = new Array();
        val.split(";").forEach(e => {
            if (!e)
                arr.push('[]');
            else
                arr.push('[' + e + ']');
        });
        return '[' + arr.join(",") + ']';
    }
}

RegisterConfigProcessor("Intss", new IntssProcessor());

class FormulaProcessor implements Processor {
    type = "string";

    convert(val: string): string {
        return '"' + val.toUpperCase() + '"';
    }
}

RegisterConfigProcessor("Formula", new FormulaProcessor());

class JsonProcessor implements Processor {
    type = "any";

    convert(val: string): string {
        if (val.trim().length == 0)
            return "null";
        return toJson(toJsonObject(val));
    }
}

RegisterConfigProcessor("Json", new JsonProcessor());
