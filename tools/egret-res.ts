import {Game} from "./game";
import {IsFile, ListDirs, ListFiles} from "./kernel";
import {Resource} from "./resource";
import fs = require("fs-extra");
import path = require("path");

const RESMAKER_BLACKS = [
    /module\.res\.json$/,
    /\.swf$/,
    /\.fla$/,
    /^\./
];

const GENRES_BLACKS = RESMAKER_BLACKS.concat(/\.d\/|\.d$/);
const AUTOMERGE_BLACKS = GENRES_BLACKS.concat(/\.g\/|\.g$/);

export class EgretResource extends Resource {
    static ASSETS = "resource/assets/";
    static FILE = "resource/default.res.json";

    async refresh(): Promise<boolean> {
        // 遍历所有的子文件，找出png\jpg\json，生成default.res.json文件并生成对应的group
        let jsobj = {
            'groups': new Array<{ name: string, keys: string }>(),
            'resources': new Array<{ url: string, name: string, type: string, subkeys: string }>()
        };
        // 第一级的资源为不加入group中的
        ListFiles(EgretResource.ASSETS, null, GENRES_BLACKS, null, 1).forEach(file => {
            let info = new EgretFileInfo();
            if (!info.parse(file))
                return;
            jsobj.resources.push({
                url: file.replace('resource/', ''),
                name: info.name,
                type: info.type,
                subkeys: info.subkeys
            });
        });
        // 处理其他2级资源
        ListDirs(EgretResource.ASSETS, null, GENRES_BLACKS, null, 2).forEach(subdir => {
            let keys = new Array<string>();
            ListFiles(subdir, null, GENRES_BLACKS, null, 1).forEach(file => {
                let info = new EgretFileInfo();
                if (!info.parse(file))
                    return;
                keys.push(info.name);
                jsobj.resources.push({
                    url: file.replace('resource/', ''),
                    name: info.name,
                    type: info.type,
                    subkeys: info.subkeys
                });
            });
            jsobj.groups.push({
                name: subdir.replace('resource/', ''),
                keys: keys.join(',')
            });
        });
        fs.writeJSONSync(EgretResource.FILE, jsobj);
        return true;
    }

    async publish(): Promise<boolean> {
        fs.removeSync("publish");
        console.log("拷贝资源");
        fs.copySync("resource", "publish/resource");
        if (Game.shared.config.get('dev', 'automerge') == 'y') {
            console.log("自动合并");
        }
        return true;
    }

    async dist(): Promise<boolean> {
        return true;
    }
}

class EgretFileInfo {

    subkeys: string;
    name: string;
    type: string;

    parse(file: string): boolean {
        let info = path.parse(file);
        this.name = info.name;
        if (info.name.indexOf('_automerged_') != -1) {
            if (info.ext == 'png')
                return false;
            this.name = info.name + '_json';
            this.type = 'json';
            // 读取subkeys
            let jsobj = fs.readJSONSync(file);
            let frmobjs = jsobj["frames"];
            this.subkeys = frmobjs.keys.join(',');
        }
        else if (info.ext == '.png') {
            if (IsFile(info.dir + '/' + info.name + ".json") || IsFile(info.dir + '/' + info.name + ".fnt")) {
                this.name = info.name + '_png';
            }
            this.type = 'image';
        }
        else if (info.ext == '.jpg') {
            this.type = 'image';
        }
        else if (info.ext == '.json') {
            // 如过同时存在 file_png 和 file_json 的队列，则认为是特殊资源，需要保持命名
            if (IsFile(info.dir + '/' + info.name + '.png')) {
                this.name = info.name + '_json';
            }
            this.type = 'json';
        }
        else if (info.ext == '.ttf') {
            this.name = info.name + '_ttf';
            this.type = 'font';
        }
        else if (info.ext == '.fnt') {
            this.name = info.name + '_fnt';
            this.type = 'font';
        }
        else {
            this.type = 'bin';
        }
        return true;
    }
}