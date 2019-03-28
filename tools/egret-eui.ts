import fs = require("fs-extra");
import mustache = require("mustache");
import path = require("path");
import execa = require("execa");
import watch = require("watch");
import {
    ArrayT,
    IsMatch,
    LinesReplace,
    ListFiles,
    LoadXmlFile,
    ObjectT,
    ReadFileLines,
    SaveXmlFile,
    SetT,
    static_cast,
    StringT,
    toJson,
    toJsonObject,
    XmlNode
} from "./kernel";
import {IService, Service} from "./service";

const PAT_EXML = [/Skin\.exml$/];

// ui的特殊处理
export class EgretEui implements IService {

    clean() {
        fs.removeSync("project/resource/default.thm.json");
    }

    // 刷新eui皮肤组件列表以及和代码的对应
    build() {
        // 列出所有的exml文件
        const skins = ListFiles('project/resource/eui_skins/app', null, null, PAT_EXML, -1);
        // 生成对应的实现文件
        let thms = [
            '"eui.ButtonU":"resource/eui_skins/wgt/ButtonSkin.exml"',
            '"eui.CheckBoxU":"resource/eui_skins/wgt/CheckBoxSkin.exml"',
            '"eui.ToggleSwitchU":"resource/eui_skins/wgt/ToggleSwitchSkin.exml"',
            '"eui.TextInputU":"resource/eui_skins/wgt/TextInputSkin.exml"',
            '"eui.ScrollerU":"resource/eui_skins/wgt/ScrollerSkin.exml"',
            '"eui.ItemRendererU":"resource/eui_skins/wgt/ItemRendererSkin.exml"',
            '"eui.VScrollBar":"resource/eui_skins/wgt/VScrollBarSkin.exml"',
            '"eui.HScrollBar":"resource/eui_skins/wgt/HScrollBarSkin.exml"',
            '"eui.ProgressBarU":"resource/eui_skins/wgt/ProgressBarSkin.exml"'
        ];
        skins.forEach(skin => {
            let cls = this.buildOneSkin(skin);
            if (cls)
                thms.push('"' + cls + '":"' + skin.replace('project/', '') + '"');
        });
        // 重新生成default.thm.json
        let content = mustache.render(TPL_THM, {
            SKINS: thms.join(',\n')
        });
        // json格式化
        content = toJson(toJsonObject(content), null, 8);
        fs.writeFileSync('project/resource/default.thm.json', content);
    }

    // 规范所有皮肤文件
    fix() {
        // 列出所有的exml文件
        const skins = ListFiles('project/resource/eui_skins/app', null, null, PAT_EXML, -1);
        skins.forEach(skin => {
            this.fixOneSkin(skin);
        });
    }

    // 规范一个皮肤文件
    fixOneSkin(exml: string) {
        let autoid = 0;
        let modified = false;

        let doc = LoadXmlFile(exml);
        let slotsnodes = xml_getElementsByAttributeName(doc.documentElement, 'slots');
        slotsnodes.forEach(e => {
            if (e.getAttributeNode('id') == null) {
                // 自动生成一个id
                e.setAttribute('id', `__auto_${autoid++}`);
                modified = true;
            }
        });

        if (modified) {
            // 将修改写回
            SaveXmlFile(doc, exml);
        }
    }

    // 构建制定文件，返回对应的类名
    buildOneSkin(exml: string): string {
        let doc = LoadXmlFile(exml);
        const nodes = xml_getElementsByAttributeName(doc.documentElement, 'id');
        let slots = xml_getAttributesByName(doc.documentElement, 'slots');
        // 提交变量
        let props: string[] = [];
        nodes.forEach(node => {
            const id = node.getAttribute('id');
            // 如果id是自动生成得，跳过生成变量，eui得setSkinPart需要id，所以当fix得时候会自动生成一个
            if (id.indexOf('__auto_') == 0)
                return;

            const ns = node.namespaceURI;
            let cls = node.localName;
            const e = node.prefix;
            if (e != 'e') {
                cls = ns.replace('*', cls);
            } else {
                cls = 'eui.' + cls;
            }
            props.push('        ' + id + ': ' + cls + ';');
        });
        // 排序
        slots.sort();
        props.sort();
        // 处理对应的实现文件
        // 提取名称
        let tscls = StringT.SubStr(exml, exml.indexOf('resource/'))
            .replace('resource/eui_skins/', '')
            .replace('Skin.exml', '');
        let tsfile = 'project/src/' + tscls + '.ts';
        // 如果不存在，则需要根据模版生成新的文件
        if (!fs.pathExistsSync(tsfile)) {
            let mdnm = path.dirname(tscls).replace(/\//g, '.');
            let dir = path.dirname(tsfile);
            fs.ensureDirSync(dir);
            let content = mustache.render(TPL_SKINCLASS, {
                MODULE: mdnm,
                CLASS: path.basename(tscls)
            });
            fs.writeFileSync(tsfile, content);
        } else {
            // 生成interface需要的函数
            let funs = new Set<string>();
            slots.forEach(slot => {
                slot.value.split(';').forEach(each => {
                    each = each.trim();
                    if (!each.length)
                        return;
                    let a = each.split('=>');
                    if (a.length != 2)
                        return;
                    funs.add('        _' + a[1] + '(s?: nn.Slot);');
                });
            });
            // 读取文件，插入对应的变量
            let lines = ReadFileLines(tsfile);
            lines = LinesReplace(lines, /\/\/skin {/, /\/\/skin }/, props);
            lines = LinesReplace(lines, /\/\/slot {/, /\/\/slot }/, SetT.ToArray(funs).sort());
            fs.writeFileSync(tsfile, lines.join('\n'));
        }

        return tscls.replace(/\//g, '.');
    }

    removeSkin(exml: string) {
        // 移出不出现在配置文件中的部分，用来之后的比对
        let path = exml.replace('project/', '');
        let thms = fs.readJsonSync('project/resource/default.thm.json');
        ArrayT.RemoveObject(thms.exmls, path);
        ObjectT.RemoveKeyByFilter(thms.skins, val => {
            return val == path;
        });
        // 直接保存
        fs.writeJsonSync('project/resource/default.thm.json', thms);
    }

    addSkin(exml: string) {
        if (this._processingExmls.has(exml))
            return;
        this._processingExmls.add(exml);

        let path = exml.replace('project/', '');

        let thms = fs.readJsonSync('project/resource/default.thm.json');
        let fnd = ArrayT.QueryObject(thms.exmls, e => e == path);
        if (!fnd)
            thms.exmls.push(path);

        // 检查文件正确性
        this.fixOneSkin(exml);

        // 编译文件到ts
        let cls = this.buildOneSkin(exml);

        // 重新添加theme
        ObjectT.RemoveKeyByFilter(thms.skins, val => {
            return val == path;
        });
        thms.skins[cls] = path;

        // 更新egret主题对照表
        fs.writeJsonSync('project/resource/default.thm.json', thms);

        this._processingExmls.delete(exml);
    }

    async startWatch(svc: Service) {
        if (!Service.Locker('egret-eui').trylock())
            return;

        // 检查exml得正确性
        this.fix();

        // 编译文件
        this.build();

        let res = execa('node', ['tools/egret-eui.js'], {
            detached: true,
            stdio: 'ignore'
        });
        res.unref();
        svc.add(res, 'egret-eui');
    }

    private _processingExmls = new Set<string>();
}

function xml_getElementsByAttributeName(node: HTMLElement, name: string, arr?: HTMLElement[]): HTMLElement[] {
    if (arr == null)
        arr = [];
    if (!node)
        return arr;
    for (let iter = node.firstChild; iter != null; iter = <any>iter.nextSibling) {
        if (iter.nodeType != XmlNode.ELEMENT_NODE)
            continue;
        let element = static_cast<HTMLElement>(iter);
        if (element.hasAttribute(name))
            arr.push(element);
        xml_getElementsByAttributeName(element, name, arr);
    }
    return arr;
}

function xml_getAttributesByName(node: HTMLElement, name: string, arr?: Attr[]): Attr[] {
    if (arr == null)
        arr = [];
    if (!node)
        return arr;
    if (node.nodeType != XmlNode.ELEMENT_NODE)
        return arr;
    if (node.hasAttribute(name))
        arr.push(node.getAttributeNode(name));
    for (let iter = node.firstChild; iter != null; iter = <any>iter.nextSibling) {
        if (node.nodeType != XmlNode.ELEMENT_NODE)
            continue;
        let element = static_cast<HTMLElement>(iter);
        xml_getAttributesByName(element, name, arr);
    }
    return arr;
}

const TPL_THM = `{
    "autoGenerateExmlsList": true,
    "exmls": [],
    "skins": {
{{&SKINS}}
    }
}`;

const TPL_SKINCLASS = `module {{MODULE}} {
    interface I{{CLASS}}
    {
        //slot {
        //slot }
    }

    export class {{CLASS}}
    extends eui.SpriteU
    implements I{{CLASS}}
    {
        //skin {
        //skin }
    }
}`;

if (path.basename(process.argv[1]) == 'egret-eui.js') {
    Service.Locker('egret-eui').acquire();

    let eui = new EgretEui();
    watch.createMonitor('project/resource/eui_skins', monitor => {
        monitor.on('created', (f: string, stat) => {
            if (IsMatch(f, PAT_EXML))
                eui.addSkin(f.replace(/\\/g, '/'));
        });
        monitor.on('changed', (f: string, stat) => {
            if (IsMatch(f, PAT_EXML))
                eui.addSkin(f.replace(/\\/g, '/'));
        });
        monitor.on('removed', (f: string, stat) => {
            if (IsMatch(f, PAT_EXML))
                eui.removeSkin(f.replace(/\\/g, '/'));
        });
    });
}
