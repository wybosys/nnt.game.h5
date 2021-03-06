import {ArrayT, IsFile, ListDirs, ListFiles, RunInBash} from "./kernel";
import {Resource, ResourceOptions} from "./resource";
import {BLACKS_GENRES} from "./image";
import {IService, Service} from "./service";
import {EgretGame} from "./egret";
import fs = require("fs-extra");
import path = require("path");
import watch = require("watch");
import execa = require("execa");

export class EgretResource extends Resource implements IService {

    async refresh(): Promise<boolean> {
        return this.refreshIn('project/');
    }

    async clean() {
        fs.removeSync("publish/resource");
        fs.removeSync("project/resource/default.res.json");
    }

    async refreshIn(dir: string): Promise<boolean> {
        // 读取主包配置
        let maingroups = this.game.config.get('app', 'maingroups').split(',');

        // 遍历所有的子文件，找出png\jpg\json，生成default.res.json文件并生成对应的group
        let defaultres = {
            'groups': new Array<{ name: string, keys: string }>(),
            'resources': new Array<{ url: string, name: string, type: string, subkeys: string }>()
        };
        let subres = {
            'groups': new Array<{ name: string, keys: string }>(),
            'resources': new Array<{ url: string, name: string, type: string, subkeys: string }>()
        };

        // 第一级的资源为不加入group中的, 野生资源
        ListFiles(dir + 'resource/assets', null, BLACKS_GENRES, null, 1).forEach(file => {
            let info = new EgretFileInfo();
            if (!info.parse(file))
                return;
            defaultres.resources.push({
                url: file.replace(dir + 'resource/', ''),
                name: info.name,
                type: info.type,
                subkeys: info.subkeys
            });
        });

        // 处理其他2级资源
        ListDirs(dir + 'resource/assets', null, BLACKS_GENRES, null, 2).forEach(subdir => {
            let keys = new Array<string>();

            let subpackage = path.basename(subdir);
            let res = ArrayT.Contains(maingroups, subpackage) ? defaultres : subres;

            ListFiles(subdir, null, BLACKS_GENRES, null, 1).forEach(file => {
                let info = new EgretFileInfo();
                if (!info.parse(file))
                    return;
                keys.push(info.name);
                res.resources.push({
                    url: file.replace(dir + 'resource/', ''),
                    name: info.name,
                    type: info.type,
                    subkeys: info.subkeys
                });
            });

            res.groups.push({
                name: subdir.replace(dir + 'resource/assets/', '').replace('/', '_'),
                keys: keys.join(',')
            });
        });

        fs.writeJSONSync(dir + 'resource/default.res.json', defaultres);
        fs.writeJSONSync(dir + 'resource/sub.res.json', subres);

        return true;
    }

    async publishIn(dir: string, opts: ResourceOptions): Promise<boolean> {
        let cwd = path.resolve("./").replace(/\\/g, '/');

        // 合并图片
        if (opts.merge) {
            let cmd = `${cwd}/tools/imagemerger ${cwd}/${dir}/resource/assets/`;
            console.log(cmd)
            RunInBash(cmd);

            if (!await this.refreshIn(dir))
                return false;
        }

        // 压缩图片
        if (opts.compress) {
            let cmd = `${cwd}/tools/imagecompress ${cwd}/${dir}/resource/assets/`;
            console.log(cmd);
            RunInBash(cmd);
        }

        return true;
    }

    // 发布图片
    async publish(opts: ResourceOptions): Promise<boolean> {
        // 移除之前的老资源
        fs.removeSync("publish");
        console.log("拷贝资源");
        fs.copySync("project/resource", "publish/resource");

        return this.publishIn('publish/', opts);
    }

    async startWatch(svc: Service) {
        if (!Service.Locker('egret-res').trylock())
            return;

        await this.refresh();

        let res = execa('node', ['tools/egret-res.js'], {
            detached: true,
            stdio: 'ignore'
        });
        res.unref();
        svc.add(res, 'egret-res');
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
            if (info.ext == '.png')
                return false;
            this.name = info.name + '_json';
            this.type = 'sheet';
            // 读取subkeys
            let jsobj = fs.readJSONSync(file);
            let frmobjs = jsobj["frames"];
            this.subkeys = Object.keys(frmobjs).join(',');
        } else if (info.ext == '.png') {
            if (IsFile(info.dir + '/' + info.name + ".json") || IsFile(info.dir + '/' + info.name + ".fnt")) {
                this.name = info.name + '_png';
            }
            this.type = 'image';
        } else if (info.ext == '.jpg') {
            this.type = 'image';
        } else if (info.ext == '.json') {
            // 如过同时存在 file_png 和 file_json 的队列，则认为是特殊资源，需要保持命名
            if (IsFile(info.dir + '/' + info.name + '.png')) {
                this.name = info.name + '_json';
            }
            this.type = 'json';
        } else if (info.ext == '.ttf') {
            this.name = info.name + '_ttf';
            this.type = 'font';
        } else if (info.ext == '.fnt') {
            this.name = info.name + '_fnt';
            this.type = 'font';
        } else if (info.ext == '.mp3' || info.ext == '.aac') {
            this.type = 'sound';
        } else {
            this.type = 'bin';
        }
        return true;
    }
}

// 建立服务时会被独立调用，所以无法下端点进行调试，只能通过单独增加调试配置来调试服务
if (path.basename(process.argv[1]) == 'egret-res.js') {
    console.log('启动egret-res服务');
    Service.Locker('egret-res').acquire();

    let game = new EgretGame();
    game.init().then(() => {
        let res = new EgretResource(game);
        watch.createMonitor('project/resource/assets', moniter => {
            moniter.on('created', (f, stat) => {
                console.log('created:' + f);
                res.refresh();
            });
            moniter.on('changed', (f, stat) => {
                console.log('changed:' + f);
                res.refresh();
            });
            moniter.on('removed', (f, stat) => {
                console.log('removed:' + f);
                res.refresh();
            });
        });
    });
}
