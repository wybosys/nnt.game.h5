import fs = require("fs-extra");
import mustache = require("mustache");
import {
    AsyncQueue,
    LinesReplace,
    ListFiles,
    LoadXmlFile,
    ReadFileLines,
    SetT,
    static_cast,
    StringT,
    XmlNode
} from "./kernel";
import path = require("path");

const PAT_EXML = [/\.exml$/];

export class EgretEui {

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
        const content = mustache.render(TPL_THM, {
            SKINS: thms.join(',\n')
        });
        fs.writeFileSync('project/resource/default.thm.json', content);
    }

    // 构建制定文件，返回对应的类名
    protected buildOneSkin(exml: string): string {
        let doc = LoadXmlFile(exml);
        const nodes = xml_getElementsByAttributeName(doc.documentElement, 'id');
        let slots = xml_getAttributesByName(doc.documentElement, 'slots');
        // 提交变量
        let props: string[] = [];
        nodes.forEach(node => {
            const id = node.getAttribute('id');
            const ns = node.namespaceURI;
            let cls = node.localName;
            const e = node.prefix;
            if (e != 'e') {
                cls = ns.replace('*', cls);
            } else {
                cls = 'eui.' + cls;
            }
            props.push('        ' + id + ':' + cls + ';');
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
        }
        else {
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
                    funs.add('        _' + a[1] + '(s?:nn.Slot);');
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
}

function xml_getElementsByAttributeName(node: HTMLElement, name: string, arr?: HTMLElement[]): HTMLElement[] {
    if (arr == null)
        arr = [];
    for (let iter = node.firstChild; iter != null; iter = iter.nextSibling) {
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
    if (node.nodeType != XmlNode.ELEMENT_NODE)
        return arr;
    if (node.hasAttribute(name))
        arr.push(node.getAttributeNode(name));
    for (let iter = node.firstChild; iter != null; iter = iter.nextSibling) {
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
