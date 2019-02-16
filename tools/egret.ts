import {Game, GameBuildOptions, MinGameBuildOptions, ProgramHandleType} from "./game";
import {Config} from "./config";
import {Gendata} from "./gendata";
import {ArrayT, DateTime, DirAtChild, IndexedObject, ListFiles, SimpleHashFile} from "./kernel";
import {Service} from "./service";
import {EgretResource} from "./egret-res";
import {EgretEui} from "./egret-eui";
import fs = require("fs-extra");
import mustache = require("mustache");
import os = require("os");
import execa = require("execa");
import {EgretTs} from "./egret-ts";
import UglifyJS = require("uglify-js");
import path = require("path");

export const IMAGE_EXTS = ['.jpeg', '.jpg', '.png'];
const PUBLISH_FIX_IMAGESOURCE = new RegExp("imageSource = ([a-zA-Z0-9:/_.\\- ]+);", "g");
export const WHITES_JS = [/\.js$/];

const EGRET_CMD = os.type() == 'Windows_NT' ? 'egret.cmd' : 'egret';

export class EgretGame extends Game {

    constructor() {
        super();
        this.config = new EgretConfig(this);
        this.gendata = new Gendata(this);
        this.service = new Service(this);
        this.resource = new EgretResource(this);

        fs.ensureDirSync(".n2/egret");
    }

    resource: EgretResource;

    clean() {
        super.clean();

        // 清除egret的中间文件
        fs.removeSync(".n2/egret");
        fs.removeSync("project/index.html");
        fs.removeSync("project/bin-debug");
        fs.removeSync("project/bin-release");
        fs.removeSync("project/libs");
        fs.removeSync(".n2/dist");
        fs.removeSync("dist");
        fs.removeSync("publish");
        fs.removeSync("project/app.json");
        fs.removeSync("project/manifest.json");
        fs.removeSync("project/resource/default.boot.json");
        fs.removeSync("project/egretProperties.json");

        // 清理渠道编译
        this.clean_channel();

        // 清理其他
        this._eui.clean();
    }

    async build(opts: GameBuildOptions) {
        // 去除publish引起的egret混乱
        fs.removeSync('publish');

        // 生成引导用的json，具体原因查阅 egret-app.ts
        if (!fs.existsSync("project/resource/default.boot.json"))
            fs.outputFileSync("project/resource/default.boot.json", TPL_BOOTJSON);

        // 生成配置文件
        this.makeConfig({TARGET: "web"});

        // 生成index的参数
        let indexOptions: IndexedObject = {
            channel: opts.channel,
            debug: opts.debug
        };

        if (opts.debug) {
            await this.build_debug(opts, indexOptions);
        } else {
            await this.build_release(opts, indexOptions);
        }
    }

    protected async build_debug(opts: GameBuildOptions, indexOptions: IndexedObject) {
        console.log("构建debug版本");
        fs.copySync('app.json', 'project/app.json');

        // 启动服务并生成第一波资源
        if (!opts.noservice) {
            // 监听添加了新的配表
            await this.gendata.startWatch(this.service);
            // 监听eui的改变，刷新代码
            await this._eui.startWatch(this.service);
            // 监听资源的改变，刷新资源数据表
            await this.resource.startWatch(this.service);
            // 启动自动编译
            await this._ts.startWatch(this.service);
        }

        // 判断使用何种编译
        this.egret('build');

        // 生成测试入口
        this.makeDebugIndex(indexOptions);

        // 复制需要的第三方类库
        if (!fs.existsSync('project/bin-debug/vconsole.min.js'))
            fs.copyFileSync('tools/vconsole.jslib', 'project/bin-debug/vconsole.min.js');
    }

    protected async build_release(opts: GameBuildOptions, indexOptions: IndexedObject) {
        console.log("构建release版本");

        // 准备附加数据文件
        await this.gendata.build();
        await this._eui.build();
        await this.resource.refresh();

        // 先编译下基础debug版本
        this.egret('build');

        // 清理老的并编译
        fs.removeSync('project/bin-release');
        this.egret('publish --compressjson');

        // 整理release出的文件，放到publish下面
        fs.ensureDirSync('publish');

        const binweb = DirAtChild('project/bin-release/web', 0, true);

        // 处理资源
        fs.moveSync(binweb + '/resource', 'publish/resource');
        await this.resource.publishIn('publish/', {
            merge: opts.merge_images,
            compress: opts.compress_images
        });

        // 读取生成的manifest，将属于引擎的代码打包
        const jsobj = fs.readJSONSync(binweb + '/manifest.json');

        // 打包基础类
        let libjss: string[] = [];
        jsobj.initial.forEach((file: string) => {
            libjss.push(fs.readFileSync(binweb + '/' + file, {encoding: 'utf8'}));
        });
        fs.writeFileSync('publish/engine.min.js', libjss.join('\n'));

        // 打包游戏类
        let gamejss: string[] = [];
        jsobj.game.forEach((file: string) => {
            if (file.indexOf('js/default.data') != -1) {
                fs.moveSync(binweb + '/' + file, 'publish/resource/default.data.js');
            } else if (file.indexOf('js/default.thm') != -1) {
                // 修正编译皮肤编译错的属性
                let content = fs.readFileSync(binweb + '/' + file, {encoding: 'utf8'});
                content = content.replace(PUBLISH_FIX_IMAGESOURCE, 'imageSource = "$1";');
                gamejss.push(content);
            } else {
                gamejss.push(fs.readFileSync(binweb + '/' + file, {encoding: 'utf8'}));
            }
        });
        fs.writeFileSync('publish/main.min.js', gamejss.join('\n'));

        // 兼容老版本的theme打包机制
        fs.writeJsonSync('publish/resource/default.thm.json', '{}');

        // 复制配置
        fs.copyFileSync('app.json', 'publish/app.json');

        // 删除老的
        fs.removeSync('project/bin-release');

        // 生成index
        this.makeReleaseIndex(indexOptions);
    }

    protected egret(cmd: string): string {
        let old = process.cwd();
        let ret = '';
        process.chdir('project');
        try {
            let res = execa.shellSync(EGRET_CMD + " " + cmd);
            ret = res.stdout;
        } catch (err) {
            console.warn(err.toString());
        }
        process.chdir(old);
        return ret;
    }

    protected cygwin(cmd: string): string {
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

    commands(program: ProgramHandleType) {
        program
            .command('genskin')
            .description('刷新皮肤')
            .action(() => {
                this._eui.build();
            });
    }

    // 生成项目配置文件
    makeConfig(tpl: IndexedObject) {
        let content = fs.readFileSync('project/egretProperties.template.json', {encoding: 'utf8'});
        content = mustache.render(content, tpl);
        fs.writeFileSync('project/egretProperties.json', content, {encoding: 'utf8'});
    }

    // 生成测试版的index.html
    makeDebugIndex(tpl?: IndexedObject) {
        console.log("生成debug版index.html");
        let bkg: string = this.config.get('app', 'background');
        let bkgcolor: string = this.config.get('app', 'background-color');
        if (bkg.indexOf("assets://"))
            bkg = bkg.replace('assets://', 'resource/assets');
        // 读取游戏的js文件列表
        const manifest = fs.readJsonSync('project/manifest.json');
        let files: string[] = [];
        ArrayT.Merge(manifest.initial, manifest.game).forEach(e => {
            files.push('<script src="' + e + '"></script>');
        });

        let scaleMode = "showAll";
        let appScript = '';
        if (tpl) {
            if (tpl["scaleMode"])
                scaleMode = tpl["scaleMode"];
            if (tpl["APPSCRIPT"])
                appScript = tpl["APPSCRIPT"];
        }

        let indexOptions = {
            APPNAME: this.config.get('app', 'name'),
            APPORI: this.config.get('app', 'orientation') == 'h' ? 'landscape' : 'portrait',
            APPANGLE: this.config.get('app', 'orientation') == 'h' ? '90' : '0',
            APPCONTENT: 'version=0.0.1, debug, verbose' + (this.config.get('app', 'resource') == 'p' ? 'publish' : ''),
            BACKGROUND: bkg,
            BACKGROUNDCOLOR: bkgcolor,
            SCALEMODE: scaleMode,
            APPSTYLE: '',
            APPSCRIPT: appScript,
            FILESLIST: files.join('\n\t'),
            BEFORESTART: '',
            AFTERSTART: ''
        };

        // 如果传了渠道，则需要根据不同渠道修改生成options的信息
        if (tpl && tpl.channel)
            this.channel_index(tpl, indexOptions);

        const index = mustache.render(TPL_INDEX_DEBUG, indexOptions);
        fs.outputFileSync('project/index.html', index);

        // 为了支持插件调试模式，需要描述一下当前项目的信息
        const debug = mustache.render(TPL_DEBUG, {
            PATH: process.cwd(),
            UUID: this.config.uuid,
            CONFIG: fs.pathExistsSync('~debug.json'),
            BUILDDATE: DateTime.Current()
        });
        fs.outputFileSync('project/bin-debug/app/~debug.js', debug);
    }

    // 生成正式版的index.html
    makeReleaseIndex(tpl?: IndexedObject) {
        console.log("生成release版index.html");
        fs.ensureDirSync('publish');
        let bkg: string = this.config.get('app', 'background');
        let bkgcolor: string = this.config.get('app', 'background-color');
        if (bkg.indexOf("assets://")) {
            if (this.config.get('app', 'resource') == 'p') {
                bkg = bkg.replace('assets://', 'resource_' + this.config.get('app', 'version') + '/assets/');
            } else {
                bkg = bkg.replace('assets://', 'resource/assets');
            }
        }

        let appScript = '';
        if (tpl) {
            if (tpl["APPSCRIPT"])
                appScript = tpl["APPSCRIPT"];
        }

        let indexOptions: IndexedObject = {
            APPNAME: this.config.get('app', 'name'),
            APPORI: this.config.get('app', 'orientation') == 'h' ? 'landscape' : 'portrait',
            APPANGLE: this.config.get('app', 'orientation') == 'h' ? '90' : '0',
            APPCONTENT: 'version=' + this.config.get('app', 'version') + (this.config.get('app', 'resource') == 'p' ? 'publish' : ''),
            APPVERSION: this.config.get('app', 'version'),
            APPICON: this.config.get('app', 'icon'),
            BACKGROUND: bkg,
            BACKGROUNDCOLOR: bkgcolor,
            APPSTYLE: '',
            APPSCRIPT: appScript,
            FILESLIST: [
                '<script src="engine.min.js?v=' + this.config.get('app', 'version') + '"></script>',
                '<script src="main.min.js?v=' + this.config.get('app', 'version') + '"></script>'
            ].join('\n\t'),
            BEFORESTART: '',
            AFTERSTART: ''
        };

        // 如果传了渠道，则需要根据不同渠道修改生成options的信息
        if (tpl && tpl.channel)
            this.channel_index(tpl, indexOptions);

        const index = mustache.render(TPL_INDEX_RELEASE, indexOptions);
        fs.writeFileSync('publish/index.html', index);
    }

    protected channel_index(tpl: IndexedObject, index: IndexedObject) {
        if (tpl.channel == 'test') {
            // 渠道特殊处理
            this.channel_test(index);
        } else if (tpl.channel == 'sdks') {
            let jss = index.FILESLIST;
            jss = '<script src="//apps.91yigame.com/platform/sdks/ver/cur/script.es6.min.js"></script>\n\t' + jss;
            index.FILESLIST = jss;
        }
    }

    async mingame(opts: MinGameBuildOptions) {
        console.log("构建小程序" + (opts.publish ? "发布" : '') + "版本");
        fs.ensureDirSync('project_wxgame');
        this.clean_channel();

        // 处理渠道
        if (opts.channel) {
            let suc = true;
            switch (opts.channel) {
                case 'readygo': {
                    suc = await this.channel_readygo(opts);
                    fs.copySync("app.json", "project_wxgame/app.json");
                }
                    break;
                case 'baidu': {
                    suc = await this.channel_baidu(opts);
                    fs.copySync("app.json", "project_baidugame/app.json");
                }
                    break;
                default: {
                    console.warn("未知渠道 " + opts.channel)
                }
                    break;
            }
            if (!suc)
                return;
        }

        // 准备附加数据文件
        await this.gendata.build();
        await this._eui.build();
        await this.resource.refresh();

        // 先编译下基础debug版本
        this.makeConfig({TARGET: "wxgame"});

        // 编译普通版本，输出时再使用compress压缩代码
        this.egret('build');

        // 生成测试入口
        this.makeDebugIndex({
            scaleMode: "fixedWidth"
        });
    }

    protected clean_channel() {
        fs.removeSync(".n2/egret/region1.js");
        fs.removeSync(".n2/egret/region2.js");
    }

    protected async channel_test(index: IndexedObject): Promise<boolean> {
        let jss = index.FILESLIST;
        if ('DEVOPS_RELEASE' in process.env) {
            jss = '<script src="https://wxgames.91yigame.com/platform/sdks/ver/cur/script.es5.js"></script>\n\t' + jss;
        } else {
            jss = '<script src="http://develop.91egame.com/platform/sdks/ver/cur/script.es5.js"></script>\n\t' + jss;
        }
        index.FILESLIST = jss;
        index.BEFORESTART += `
        sdks.config.set('CHANNEL_ID', 1800);
        sdks.config.set('SDK_LANG', 'es5');
        sdks.config.set('GAME_VERSION', "${this.config.get('app', 'version')}"); 
        `;
        return true;
    }

    // 渠道特殊处理
    protected async channel_readygo(opts: MinGameBuildOptions): Promise<boolean> {
        if (!fs.existsSync("sdks/sdks.js")) {
            console.error("没有找到渠道sdk，请从游戏中心下载到 sdks/sdks.js");
            return false;
        }
        if (!fs.existsSync("sdks/readygo.js")) {
            console.error("没有找到渠道sdk，请从游戏中心下载到 sdks/readygo.js");
            return false;
        }
        if (!fs.existsSync("sdks/readygo-sdk.js")) {
            console.error("没有找到星汉SDK，请从星汉下载并改名到 sdks/readygo-sdk.js");
            return false;
        }
        if (!fs.existsSync("sdks/readygo-stat-sdk.js")) {
            console.error("没有找到星汉数据SDK，请从星汉下载并改名到 sdks/readygo-stat-sdk.js");
            return false;
        }
        if (!fs.existsSync("sdks/readygo-dsp-sdk.js")) {
            console.error("没有找到星汉DSPSDK，请从星汉下载并改名到 sdks/readygo-dsp-sdk.js");
            return false;
        }

        // 游戏中心的js
        fs.copySync("sdks/sdks.js", "project_wxgame/sdks.js");
        fs.copySync("sdks/readygo.js", "project_wxgame/readygo.js");

        // 星汉分配游戏的js
        fs.copySync("sdks/readygo-sdk.js", "project_wxgame/readygo-sdk.js");
        fs.copySync("sdks/readygo-stat-sdk.js", "project_wxgame/readygo-stat-sdk.js");
        fs.copySync("sdks/readygo-dsp-sdk.js", "project_wxgame/readygo-dsp-sdk.js");

        //一些游戏配置参数
        let optcs: any = {};
        optcs.orientation = this.config.get('app', 'orientation') == 'v' ? "portrait" : "landscape";
        optcs.frameRate = this.config.get('app', 'frameRate') ? this.config.get('app', 'frameRate') : 60;
        optcs.version = this.config.get('app', 'version') ? this.config.get('app', 'version') : "";
        optcs.sdkUrl = opts.publish ? 'wxgames.91yigame.com' : 'develop.91egame.com';
        let dsp: any = {};
        dsp.appids = this.config.get('readygo', 'appids');
        let region1 = `require('./sdks.js');
require('./readygo.js');
import XH_MINIPRO_SDK from './readygo-sdk.js';
import XH_MINIPRO_STATISTIC from './readygo-stat-sdk.js';
import XH_MINIPRO_DSP from './readygo-dsp-sdk.js';
window["readygo"] = XH_MINIPRO_SDK;
window["XH_MINIPRO_SDK"] = XH_MINIPRO_SDK;
window["readygo_stat"] = XH_MINIPRO_STATISTIC;
window["XH_MINIPRO_STATISTIC"] = XH_MINIPRO_STATISTIC;
window["readygo_dsp"] = XH_MINIPRO_DSP;
window["XH_MINIPRO_DSP"] = XH_MINIPRO_DSP;
sdks.config.set('CHANNEL_ID', 1802);
sdks.config.set('URL', '${optcs.sdkUrl}');
sdks.config.set('GAME_VERSION', '${optcs.version}');
let options = {orientation:'${optcs.orientation}',frameRate:${optcs.frameRate}};
        `;
        //微信小游戏的一些配置
        let region2 = `{"deviceOrientation":"${optcs.orientation}","navigatelist":"${dsp.appids}"}`;
        fs.writeFileSync(".n2/egret/region1.js", region1);
        fs.writeFileSync(".n2/egret/wx_config.json", region2);

        return true;
    }

    protected async channel_baidu(opts: MinGameBuildOptions): Promise<boolean> {
        if (!fs.existsSync("sdks/sdks.js")) {
            console.error("没有找到渠道sdk，请从游戏中心下载到 sdks/sdks.js");
            return false;
        }
        if (!fs.existsSync("sdks/baidu.js")) {
            console.error("没有找到渠道sdk，请从游戏中心下载到 sdks/baidu.js");
            return false;
        }

        fs.copySync("sdks/sdks.js", "project_baidugame/sdks.js");
        fs.copySync("sdks/baidu.js", "project_baidugame/baidu.js");

        //一些游戏配置参数
        let optcs: any = {};
        optcs.orientation = this.config.get('app', 'orientation') == 'v' ? "portrait" : "landscape";
        optcs.frameRate = this.config.get('app', 'frameRate') ? this.config.get('app', 'frameRate') : 60;
        optcs.version = this.config.get('app', 'version') ? this.config.get('app', 'version') : "";
        optcs.sdkUrl = opts.publish ? 'wxgames.91yigame.com' : 'develop.91egame.com';
        let region1 = `require('./sdks.js');
require('./baidu.js');
sdks.config.set('CHANNEL_ID', 1806);
sdks.config.set('URL', '${optcs.sdkUrl}');
sdks.config.set('GAME_VERSION', '${optcs.version}');
let options = {orientation:'${optcs.orientation}',frameRate:${optcs.frameRate}};
        `;
        //微信小游戏的一些配置
        let region2 = `{"deviceOrientation":"${optcs.orientation}"}`;
        fs.writeFileSync(".n2/egret/region1.js", region1);
        fs.writeFileSync(".n2/egret/baidu_config.json", region2);

        return true;
    }

    async compress(channel: string) {
        let project_channel;
        switch (channel) {
            case 'readygo':
                project_channel = 'project_wxgame';
                break;
            case 'baidu':
                project_channel = 'project_baidugame';
                break;
            default:
                console.warn("未知渠道 " + channel)
                break;
        }
        if (!project_channel)
            return;

        if (fs.existsSync(project_channel)) {
            let dir = path.resolve("./").replace(/\\/g, '/');

            // 合并输出的图片
            let cmd = dir + "/tools/imagemerger " + dir + "/" + project_channel + "/resource/assets/";
            console.log(cmd)
            this.cygwin(cmd);

            // 生成合并后的图片资源列表
            await this.resource.refreshIn(project_channel + "/");

            // 压缩图片
            cmd = dir + "/tools/imagecompress " + dir + "/" + project_channel + "/resource/assets/";
            this.cygwin(cmd);

            // 压缩输出的js文件
            ListFiles(project_channel, null, null, WHITES_JS, 2).forEach(file => {
                let content = fs.readFileSync(file, {encoding: 'utf8'});
                let res = UglifyJS.minify(content);
                if (res.error)
                    console.error(res.error);
                else
                    fs.writeFileSync(file, res.code, {encoding: 'utf8'});
            });
        }
    }

    protected _eui = new EgretEui();
    protected _ts = new EgretTs();
}

class EgretConfig extends Config {

    async refresh(): Promise<boolean> {
        let r = await super.refresh();
        if (fs.existsSync("project/egretProperties.json")) {
            // 比对egretProp是否修改过
            let hash = SimpleHashFile("project/egretProperties.json");
            if (this._cfgdb.get("egret-prop-hash") != hash) {
                this._cfgdb.set("egret-prop-hash", hash);
                console.log("egret的配置更新");
                r = true;
            }
        }
        return r;
    }
}

const TPL_INDEX_DEBUG = `
<!DOCTYPE HTML>
<html>
    <head>
    <meta charset="utf-8">
    <base href="project">
    <title>{{APPNAME}}</title>    
    <meta name="viewport"
content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="screen-orientation" content="{{APPORI}}"/>
<meta name="x5-orientation" content="{{APPORI}}"/>
<meta name="full-screen" content="true"/>
<meta name="x5-fullscreen" content="true"/>
<meta name="360-fullscreen" content="true"/>
<meta name="renderer" content="webkit"/>
<meta name="browsermode" content="application"/>
<meta name="x5-page-mode" content="app"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<app content="{{&APPCONTENT}}"></app>
<style>
    html, body {
    -ms-touch-action:none;
    padding:0;
    border:0;
    margin:0;
    height:100%;
    background:{{BACKGROUNDCOLOR}}
    }
</style>
{{APPSTYLE}}
</head>
<body>
    <div style="margin:auto;width:100%;height:100%;"
    class="egret-player"
    data-entry-class="Main"
    data-orientation="auto"
    data-scale-mode="{{SCALEMODE}}"
    data-multi-fingered="2"
    data-frame-rate="60"
    ></div>    
    <script src="bin-debug/app/~debug.js"></script>
    <script src="bin-debug/vconsole.min.js"></script>
    {{&APPSCRIPT}}
    <!-- 游戏 -->
    {{&FILESLIST}}
<script>
    {{&BEFORESTART}}
    var document_orientation = {{APPANGLE}};
    nn.loader.webstart();
    {{&AFTERSTART}}
</script>
</body>
</html>`;

const TPL_INDEX_RELEASE = `
<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8">
    <title>{{APPNAME}}</title>
    <meta name="viewport"
content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="screen-orientation" content="{{APPORI}}"/>
<meta name="x5-orientation" content="{{APPORI}}"/>
<meta name="full-screen" content="true"/>
<meta name="x5-fullscreen" content="true"/>
<meta name="360-fullscreen" content="true"/>
<meta name="renderer" content="webkit"/>
<meta name="browsermode" content="application"/>
<meta name="x5-page-mode" content="app"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<app content="{{&APPCONTENT}}"
icon="{{APPICON}}"
name="{{APPNAME}}"></app>
<style>
    html, body {
    -ms-touch-action:none;
    padding:0;
    border:0;
    margin:0;
    height:100%;
    background:{{BACKGROUNDCOLOR}}
    }
</style>
{{APPSTYLE}}
</head>
<body>
    <div style="margin:auto;width:100%;height:100%"
    class="egret-player" 
    data-entry-class="Main"
    data-orientation="auto"
    data-scale-mode="showAll"
    data-multi-fingered="2"
    data-frame-rate="60"
    ></div>
    {{&APPSCRIPT}}
    {{&FILESLIST}}
<script>
    {{&BEFORESTART}}
    var document_orientation = {{APPANGLE}};
    nn.loader.webstart();
    {{&AFTERSTART}}
</script>
</body>
</html>`;

const TPL_DEBUG = `
var app = {};
app.debug = {
    PATH:"{{PATH}}",
    UUID:"{{UUID}}",
    CONFIG:{{CONFIG}},
    BUILDDATE:{{BUILDDATE}}
};`;

const TPL_BOOTJSON = `{
  "groups": [],
  "resources": []
}`;
