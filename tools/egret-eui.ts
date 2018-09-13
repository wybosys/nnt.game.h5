import fs = require("fs-extra");
import dot = require("dot");
import {AsyncQueue, ListFiles} from "./kernel";
import xmldom = require("xmldom");

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
        let q = new AsyncQueue();
        skins.forEach(skin => {
            q.add(next => {
                this.buildOneSkin(skin).then(cls => {
                    if (cls)
                        thms.push('"' + cls + '":"' + skin.replace('project/', '') + '"');
                    next();
                });
            });
        });
        q.done(() => {
            // 重新生成default.thm.json
            const content = dot.template(TPL_THM)({SKINS: thms.join('\n')});
            fs.writeJsonSync('project/resource/default.thm.json', content);
        });
        q.run();
    }

    // 构建制定文件，返回对应的类名
    protected async buildOneSkin(exml: string): string {
        let parser = new xmldom.DOMParser();
        const doc = parser.parseFromString(fs.readFileSync(exml, {encoding: 'utf-8'}));
        const root = doc.documentElement;
        return '';
    }
}

const TPL_THM = `
{
    "autoGenerateExmlsList": true,
    "exmls": [],
    "skins": {{=it.SKINS}}
}`;

const TPL_SKINCLASS = `
module {{=it.MODULE}} {
    interface I{{=it.CLASS}}
    {
        //slot {
        //slot }
    }

    export class {{=it.CLASS}}
    extends eui.SpriteU
    implements I{{=it.CLASS}}
    {
        //skin {
        //skin }
    }
}`;