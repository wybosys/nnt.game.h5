import {Game, GameBuildOptions, ProgramHandleType} from "./game";
import {Config} from "./config";
import {Gendata} from "./gendata";
import {SimpleHashFile} from "./kernel";
import {Service} from "./service";
import {EgretResource} from "./egret-res";
import fs = require("fs-extra");
import multiline = require("multiline");

export const RESMAKER_BLACKS = [
    /module\.res\.json$/,
    /\.swf$/,
    /\.fla$/,
    /^\./
];

export const GENRES_BLACKS = RESMAKER_BLACKS.concat(/\.d\/|\.d$/);
export const AUTOMERGE_BLACKS = GENRES_BLACKS.concat(/\.g\/|\.g$/);
export const IMAGE_EXTS = ['.jpeg', '.jpg', '.png'];

export class EgretGame extends Game {

    constructor() {
        super();
        this.config = new EgretConfig();
        this.gendata = new Gendata();
        this.service = new Service();
        this.resource = new EgretResource();
    }

    clean() {
        super.clean();

        // 清除egret的中间文件
        fs.removeSync("bin-debug");
        fs.removeSync("libs");
        fs.removeSync(".n2~/dist");
        fs.removeSync("dist");
        fs.removeSync("publish");
    }

    build(opts: GameBuildOptions) {

    }

    commands(program: ProgramHandleType) {
        // pass
    }

    // 生成测试版的index.html
    makeDebugIndex() {

    }

    // 生成正式版的index.html
    makeReleaseIndex() {

    }
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

const TPL_INDEX_DEBUG = multiline.stripIndent(() => {/*
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
    <script src="src/app/~debug.js"></script>
    <!-- dev工具 -->
    <script src="tools/devtools/devtools.js" type="text/javascript"></script>
    <!-- 加载的文件列表 -->
    {{=it.FILESLIST}}
    <script>
var document_orientation = {{=it.APPANGLE}};
nn.loader.webstart();
</script>
</body>
</html>
*/
});

const TPL_INDEX_RELEASE = multiline.stripIndent(() => {/*
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
</html>
*/
});
