import {Game, GameBuildOptions, ProgramHandleType} from "./game";
import {Config} from "./config";
import {Gendata} from "./gendata";
import {ArrayT, DateTime, DirAtChild, SimpleHashFile} from "./kernel";
import {Service} from "./service";
import {EgretResource} from "./egret-res";
import {EgretEui} from "./egret-eui";
import fs = require("fs-extra");
import dot = require("dot");
import os = require("os");
import execa = require("execa");

export const IMAGE_EXTS = ['.jpeg', '.jpg', '.png'];
const PUBLISH_FIX_IMAGESOURCE = new RegExp("imageSource = ([a-zA-Z0-9:/_.\\- ]+);", "g");

const EGRET_CMD = os.type() == 'Windows_NT' ? 'egret.cmd' : 'egret';

export class EgretGame extends Game {

    constructor() {
        super();
        this.config = new EgretConfig();
        this.gendata = new Gendata();
        this.service = new Service();
        this.resource = new EgretResource();
    }

    resource: EgretResource;

    clean() {
        super.clean();

        // 清除egret的中间文件
        fs.removeSync("project/index.html");
        fs.removeSync("project/bin-debug");
        fs.removeSync("project/bin-release");
        fs.removeSync("project/libs");
        fs.removeSync(".n2/dist");
        fs.removeSync("dist");
        fs.removeSync("publish");
        fs.removeSync("project/app.json");
        fs.removeSync("project/manifest.json");

        // 清理其他
        this._eui.clean();
    }

    async build(opts: GameBuildOptions) {
        // 去除publish引起的egret混乱
        fs.removeSync('publish');

        if (opts.debug) {
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
            }

            // 判断使用何种编译
            this.egret('build');
            // 生成测试入口
            this.makeDebugIndex();
            return;
        }

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
            if (file.indexOf('js/default.data') == 0) {
                fs.moveSync(binweb + '/' + file, 'publish/resource/default.data.js');
            }
            else if (file.indexOf('js/default.thm') == 0) {
                // 修正编译皮肤编译错的属性
                let content = fs.readFileSync(binweb + '/' + file, {encoding: 'utf8'});
                content = content.replace(PUBLISH_FIX_IMAGESOURCE, 'imageSource = "$1";');
                gamejss.push(content);
            }
            else {
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
        this.makeReleaseIndex();
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
        return '';
    }

    commands(program: ProgramHandleType) {
        program
            .command('genskin')
            .description('刷新皮肤')
            .action(() => {
                this._eui.build();
            });
    }

    // 生成测试版的index.html
    makeDebugIndex() {
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
        const index = dot.template(TPL_INDEX_DEBUG)({
            APPNAME: this.config.get('app', 'name'),
            APPORI: this.config.get('app', 'orientation') == 'h' ? 'landscape' : 'portrait',
            APPANGLE: this.config.get('app', 'orientation') == 'h' ? '90' : '0',
            APPCONTENT: 'version=0.0.1, debug, verbose' + (this.config.get('app', 'resource') == 'p' ? 'publish' : ''),
            BACKGROUND: bkg,
            BACKGROUNDCOLOR: bkgcolor,
            APPSTYLE: '',
            APPLAUNCH: '',
            APPSCRIPT: '',
            FILESLIST: files.join('\n\t')
        });
        fs.outputFileSync('project/index.html', index);
        // 为了支持插件调试模式，需要描述一下当前项目的信息
        const debug = dot.template(TPL_DEBUG)({
            PATH: process.cwd(),
            UUID: this.config.uuid,
            CONFIG: fs.pathExistsSync('~debug.json'),
            BUILDDATE: DateTime.Current()
        });
        fs.outputFileSync('project/bin-debug/app/~debug.js', debug);
    }

    // 生成正式版的index.html
    makeReleaseIndex() {
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
        const index = dot.template(TPL_INDEX_RELEASE)({
            APPNAME: this.config.get('app', 'name'),
            APPORI: this.config.get('app', 'orientation') == 'h' ? 'landscape' : 'portrait',
            APPANGLE: this.config.get('app', 'orientation') == 'h' ? '90' : '0',
            APPCONTENT: 'version=' + this.config.get('app', 'version') + this.config.get('app', 'resource') == 'p' ? 'publish' : '',
            APPVERSION: this.config.get('app', 'version'),
            APPICON: this.config.get('app', 'icon'),
            BACKGROUND: bkg,
            BACKGROUNDCOLOR: bkgcolor,
            APPSTYLE: '',
            APPLAUNCH: '',
            APPSCRIPT: '',
            FILESLIST: [
                '<script src="engine.min.js?v=' + this.config.get('app', 'version') + '"></script>',
                '<script src="main.min.js?v=' + this.config.get('app', 'version') + '"></script>'
            ].join('\n\t')
        });
        fs.writeFileSync('publish/index.html', index);
    }

    protected _eui = new EgretEui();
}

class EgretConfig extends Config {

    async refresh(): Promise<boolean> {
        let r = await super.refresh();
        // 比对egretProp是否修改过
        let hash = SimpleHashFile("project/egretProperties.json");
        if (this._cfgdb.get("egret-prop-hash") != hash) {
            this._cfgdb.set("egret-prop-hash", hash);
            console.log("egret的配置更新");
            r = true;
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
    <title>{{=it.APPNAME}}</title>    
    <meta name="viewport"
content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="screen-orientation" content="{{=it.APPORI}}"/>
<meta name="x5-orientation" content="{{=it.APPORI}}"/>
<meta name="full-screen" content="true"/>
<meta name="x5-fullscreen" content="true"/>
<meta name="360-fullscreen" content="true"/>
<meta name="renderer" content="webkit"/>
<meta name="browsermode" content="application"/>
<meta name="x5-page-mode" content="app"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<app content="{{=it.APPCONTENT}}">
    </app>
    <style>
    html, body {
    -ms-touch-action:none;
    padding:0;
    border:0;
    margin:0;
    height:100%;
    background:{{=it.BACKGROUNDCOLOR}}
        }
#launchDiv {
    position:absolute;
    left:0;
    top:0;
    text-align:center;
    width:100%;
    height:100%;
    background:url({{=it.BACKGROUND}}) top center no-repeat;
    background-size:auto 100%;
}
</style>
{{=it.APPSTYLE}}
</head>
<body>
<div id="launchDiv">
    {{=it.APPLAUNCH}}
    </div>
    {{=it.APPSCRIPT}}
    <div style="margin:auto;width:100%;height:100%;" class="egret-player"
data-entry-class="Main"
data-orientation="auto"
data-scale-mode="showAll"
data-multi-fingered="2"
data-frame-rate="60"
    >
    </div>
    <!-- debug信息 -->
    <script src="bin-debug/app/~debug.js"></script>
    <!-- dev工具 -->
    <script src="tools/devtools/devtools.js" type="text/javascript"></script>
    <!-- 加载的文件列表 -->
    {{=it.FILESLIST}}
    <script>
var document_orientation = {{=it.APPANGLE}};
nn.loader.webstart();
</script>
</body>
</html>`;

const TPL_INDEX_RELEASE = `
<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8">
    <title>{{=it.APPNAME}}</title>
    <meta name="viewport"
content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="screen-orientation" content="{{=it.APPORI}}"/>
<meta name="x5-orientation" content="{{=it.APPORI}}"/>
<meta name="full-screen" content="true"/>
<meta name="x5-fullscreen" content="true"/>
<meta name="360-fullscreen" content="true"/>
<meta name="renderer" content="webkit"/>
<meta name="browsermode" content="application"/>
<meta name="x5-page-mode" content="app"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<app content="{{=it.APPCONTENT}}"
icon="{{=it.APPICON}}"
name="{{=it.APPNAME}}">
    </app>
    <style>
    html, body {
    -ms-touch-action:none;
    padding:0;
    border:0;
    margin:0;
    height:100%;
    background:{{=it.BACKGROUNDCOLOR}}
        }
#launchDiv {
    position:absolute;
    left:0;
    top:0;
    text-align:center;
    width:100%;
    height:100%;
    background:url({{=it.BACKGROUND}}) top center no-repeat;
    background-size:auto 100%;
}
</style>
{{=it.APPSTYLE}}
</head>
<body>
<div id="launchDiv">
    {{=it.APPLAUNCH}}
    </div>
    {{=it.APPSCRIPT}}
    <div style="margin:auto;width:100%;height:100%;" class="egret-player"
data-entry-class="Main"
data-orientation="auto"
data-scale-mode="showAll"
data-multi-fingered="2"
data-frame-rate="60"
    >
    </div>
    {{=it.FILESLIST}}
    <script>
var document_orientation = {{=it.APPANGLE}};
nn.loader.webstart();
</script>
</body>
</html>`;

const TPL_DEBUG = `
var app = {};
app.debug = {
    PATH:"{{=it.PATH}}",
    UUID:"{{=it.UUID}}",
    CONFIG:{{=it.CONFIG}},
    BUILDDATE:{{=it.BUILDDATE}}
};`;
