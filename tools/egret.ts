import {BuildOptions, CompressOptions, Game, MinGameOptions, ProgramHandleType} from "./game";
import {Config, SDKS_CONFIG} from "./config";
import {Gendata} from "./gendata";
import {ArrayT, DateTime, DirAtChild, IndexedObject, ListFiles, RunInBash, SimpleHashFile} from "./kernel";
import {Service} from "./service";
import {EgretResource} from "./egret-res";
import {EgretEui} from "./egret-eui";
import {EgretTs} from "./egret-ts";
import fs = require("fs-extra");
import mustache = require("mustache");
import os = require("os");
import execa = require("execa");
import UglifyJS = require("uglify-js");
import path = require("path");

export const IMAGE_EXTS = ['.jpeg', '.jpg', '.png'];
const PUBLISH_FIX_IMAGESOURCE = new RegExp("imageSource = ([a-zA-Z0-9:/_.\\- ]+);", "g");

const EGRET_CMD = os.type() == 'Windows_NT' ? 'egret.cmd' : 'egret';

// 生成入口文件时可以配置的数据
interface IndexOptions {
    SCALEMODE?: string;
    APPSCRIPT?: string;
    APPNAME?: string;
    APPORI?: string;
    APPANGLE?: string;
    APPCONTENT?: string;
    BACKGROUND?: string;
    BACKGROUNDCOLOR?: string;
    APPSTYLE?: string;
    FILESLIST?: string;
    BEFORESTART?: string;
    AFTERSTART?: string;
}

export class EgretGame extends Game {

    constructor() {
        super();
        this.config = new EgretConfig(this);
        this.gendata = new Gendata(this);
        this.service = new Service(this);
        this.resource = new EgretResource(this);

        fs.ensureDirSync(".n2/egret");
    }

    // egret自己实现的资源生成器
    resource: EgretResource;

    async clean() {
        await super.clean();

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

    async build(opts: BuildOptions): Promise<boolean> {
        // 去除publish引起的egret混乱
        fs.removeSync('publish');
        this.clean_channel();

        // 生成引导用的json，具体原因查阅 egret-app.ts
        if (!fs.existsSync("project/resource/default.boot.json"))
            fs.outputFileSync("project/resource/default.boot.json", TPL_BOOTJSON);

        // 生成基础配置
        this.makeConfig({TARGET: "web"});

        return opts.debug ?
            await this.build_debug(opts) :
            await this.build_release(opts);
    }

    protected async build_debug(opts: BuildOptions): Promise<boolean> {
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

        // 编译一下
        this.egret('build');

        // 生成测试用的入口文件
        this.makeDebugIndex(opts);

        // 复制测试需要的第三方类库
        if (!fs.existsSync('project/bin-debug/vconsole.min.js')) {
            fs.copyFileSync('tools/vconsole.jslib', 'project/bin-debug/vconsole.min.js');
        }

        return true;
    }

    protected async build_release(opts: BuildOptions): Promise<boolean> {
        console.log("构建release版本");

        // 新生成一下当前项目中依赖的数据
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
        this.makeReleaseIndex(opts);

        return true;
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

    commands(program: ProgramHandleType) {
        program
            .command('genskin')
            .description('刷新皮肤')
            .action(() => {
                this._eui.fix();
                this._eui.build();
            });
    }

    // 生成基础的配置
    private makeConfig(tpl: IndexedObject) {
        let content = fs.readFileSync('project/egretProperties.template.json', {encoding: 'utf8'});
        content = mustache.render(content, tpl);
        fs.writeFileSync('project/egretProperties.json', content, {encoding: 'utf8'});
    }

    // 生成测试版的index.html
    private makeDebugIndex(opts: BuildOptions, tpl: IndexOptions = {}) {
        console.log("生成debug版index.html");

        if (!tpl.SCALEMODE)
            tpl.SCALEMODE = "showAll";
        if (!tpl.APPNAME)
            tpl.APPNAME = this.config.get('app', 'name');
        if (!tpl.APPORI)
            tpl.APPORI = this.config.get('app', 'orientation') == 'h' ? 'landscape' : 'portrait';
        if (!tpl.APPCONTENT)
            tpl.APPCONTENT = 'debug=true verbose=true';
        if (!tpl.APPANGLE)
            tpl.APPANGLE = this.config.get('app', 'orientation') == 'h' ? '90' : '0';
        if (!tpl.BACKGROUND) {
            let bkg: string = this.config.get('app', 'background');
            if (bkg.indexOf("assets://"))
                bkg = bkg.replace('assets://', 'resource/assets');
            tpl.BACKGROUND = bkg;
        }
        if (!tpl.BACKGROUNDCOLOR) {
            tpl.BACKGROUNDCOLOR = this.config.get('app', 'background-color');
        }
        if (!tpl.APPSTYLE)
            tpl.APPSTYLE = '';
        if (!tpl.APPSCRIPT)
            tpl.APPSCRIPT = '';
        if (!tpl.FILESLIST) {
            // 读取游戏的js文件列表
            const manifest = fs.readJsonSync('project/manifest.json');
            let files: string[] = [];
            ArrayT.Merge(manifest.initial, manifest.game).forEach(e => {
                files.push('<script src="' + e + '"></script>');
            });
            tpl.FILESLIST = files.join('\n\t');
        }
        if (!tpl.BEFORESTART) {
            tpl.BEFORESTART = '';
        }
        if (!tpl.AFTERSTART) {
            tpl.AFTERSTART = '';
        }

        // 如果传了渠道，则需要根据不同渠道修改生成options的信息
        if (opts.channel)
            this.channel_index(opts, tpl);

        // 生成html文件
        const content = mustache.render(TPL_INDEX_DEBUG, tpl);
        fs.outputFileSync('project/index.html', content);

        // 为了支持插件调试模式，需要描述一下当前项目的信息
        const debug = mustache.render(TPL_DEBUG, {
            PATH: process.cwd().replace(/\\/g, '\\\\'),
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
            APPCONTENT: 'version="' + this.config.get('app', 'version') + '"',
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

    // 根据渠道的不同，修改生成入口的信息
    private channel_index(opts: BuildOptions, tpl: IndexOptions) {
        if (opts.channel == 'sdks' || opts.channel == 'dsdks') {
            if (opts.subchannel == 'test') {
                let jss = tpl.FILESLIST;
                if ('DEVOPS_RELEASE' in process.env) {
                    jss = `<script src="//${SDKS_CONFIG.RELEASE_HOST}/platform/sdks/ver/cur/script.es5.js"></script>\n\t` + jss;
                } else {
                    jss = `<script src="//${SDKS_CONFIG.DEVELOP_HOST}/platform/sdks/ver/cur/script.es5.js"></script>\n\t` + jss;
                }
                tpl.FILESLIST = jss;
                tpl.BEFORESTART += `
        sdks.config.set('CHANNEL_ID', ${SDKS_CONFIG.CHANNELID_TEST});
        sdks.config.set('SDK_LANG', 'es5');
        sdks.config.set('GAME_VERSION', "${this.config.get('app', 'version')}"); 
        `;
            } else if (opts.subchannel == 'package') {
                let jss = tpl.FILESLIST;
                jss = `<script src="//${SDKS_CONFIG.PACKAGE_HOST}/platform/sdks/ver/cur/script.es5.js"></script>\n\t` + jss;
                tpl.FILESLIST = jss;
                tpl.BEFORESTART += `
        sdks.config.set('CHANNEL_ID', ${SDKS_CONFIG.CHANNELID_PACKAGE});
        sdks.config.set('SDK_LANG', 'es5');
        sdks.config.set('GAME_VERSION', "${this.config.get('app', 'version')}"); 
        `;
            } else {
                let jss = tpl.FILESLIST;
                jss = `<script src="//${SDKS_CONFIG.CHANNELID_PACKAGE}/platform/sdks/ver/cur/script.es6.min.js"></script>\n\t` + jss;
                tpl.FILESLIST = jss;
            }
        }
    }

    async mingame(opts: MinGameOptions): Promise<boolean> {
        console.log("构建小程序版本");
        this.clean_channel();

        // 处理渠道
        if (opts.channel) {
            if (!await this.channel_mingame(opts))
                return false;
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
        this.makeDebugIndex(opts, {
            SCALEMODE: "fixedWidth"
        });

        return true;
    }

    // 清理带渠道生成的临时文件
    private clean_channel() {
        fs.removeSync(".n2/egret/region1.js");
        fs.removeSync(".n2/egret/region2.js");
    }

    // 小游戏的渠道特殊处理
    private async channel_mingame(opts: MinGameOptions): Promise<boolean> {
        if (opts.channel == 'sdks' || opts.channel == 'dsdks') {
            if (opts.subchannel == 'readygo') {
                return this.mingame_readygo(opts);
            } else if (opts.subchannel == 'baidu') {
                return this.mingame_baidu(opts);
            }
        }
        return false;
    }

    // 渠道特殊处理
    private async mingame_readygo(opts: MinGameOptions): Promise<boolean> {
        fs.ensureDirSync('project_wxgame');

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
        optcs.sdkUrl = opts.channel == 'sdks' ? SDKS_CONFIG.RELEASE_HOST : SDKS_CONFIG.DEVELOP_HOST;
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
sdks.config.set('CHANNEL_ID', ${SDKS_CONFIG.CHANNELID_READYGO});
sdks.config.set('URL', '${optcs.sdkUrl}');
sdks.config.set('GAME_VERSION', '${optcs.version}');
let options = {orientation:'${optcs.orientation}',frameRate:${optcs.frameRate}};
        `;
        //微信小游戏的一些配置
        let region2 = `{"deviceOrientation":"${optcs.orientation}","navigatelist":"${dsp.appids}"}`;
        fs.writeFileSync(".n2/egret/region1.js", region1);
        fs.writeFileSync(".n2/egret/wx_config.json", region2);

        fs.copySync("app.json", "project_wxgame/app.json");

        return true;
    }

    private async mingame_baidu(opts: MinGameOptions): Promise<boolean> {
        fs.ensureDirSync('project_baidugame');

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
        optcs.sdkUrl = opts.channel == 'sdks' ? SDKS_CONFIG.RELEASE_HOST : SDKS_CONFIG.DEVELOP_HOST;
        let region1 = `require('./sdks.js');
require('./baidu.js');
sdks.config.set('CHANNEL_ID', ${SDKS_CONFIG.CHANNELID_BAIDU});
sdks.config.set('URL', '${optcs.sdkUrl}');
sdks.config.set('GAME_VERSION', '${optcs.version}');
let options = {orientation:'${optcs.orientation}',frameRate:${optcs.frameRate}};
        `;
        //微信小游戏的一些配置
        let region2 = `{"deviceOrientation":"${optcs.orientation}"}`;
        fs.writeFileSync(".n2/egret/region1.js", region1);
        fs.writeFileSync(".n2/egret/baidu_config.json", region2);

        fs.copySync("app.json", "project_baidugame/app.json");

        return true;
    }

    async compress(opts: CompressOptions): Promise<boolean> {
        // 获取项目目录
        let projectdir: string;
        if (opts.mingame) {
            if (opts.subchannel == 'baidu') {
                projectdir = 'project_baidugame';
            } else {
                projectdir = 'project_wxgame';
            }
        } else {
            projectdir = 'publish';
        }

        if (!fs.existsSync(projectdir)) {
            console.error(`${projectdir}不存在`);
            return false;
        }

        let dir = path.resolve("./").replace(/\\/g, '/');

        // 合并输出的图片
        if (opts.mergeimages) {
            let cmd = dir + "/tools/imagemerger " + dir + "/" + projectdir + "/resource/assets/";
            console.log(cmd)
            RunInBash(cmd);

            // 生成合并后的图片资源列表
            if (!await this.resource.refreshIn(projectdir + "/"))
                return false;
        }

        // 压缩图片
        if (opts.compressimages) {
            let cmd = dir + "/tools/imagecompress " + dir + "/" + projectdir + "/resource/assets/";
            console.log(cmd);
            RunInBash(cmd);
        }

        // 压缩输出的js文件
        if (opts.compressscripts) {
            let files = ListFiles(projectdir, null, [/\.min\.js$/], [/\.js$/], 2);
            files.forEach(file => {
                console.log('compress ' + file);
                let content = fs.readFileSync(file, {encoding: 'utf8'});
                let res = UglifyJS.minify(content);
                if (res.error) {
                    if (opts.verbose)
                        console.error(res.error);
                } else {
                    fs.writeFileSync(file, res.code, {encoding: 'utf8'});
                }
            });
        }

        return true;
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
<app {{&APPCONTENT}}></app>
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
    id="egret-player"    
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
<app {{&APPCONTENT}} icon="{{APPICON}}" name="{{APPNAME}}"></app>
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
    id="egret-player"     
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
