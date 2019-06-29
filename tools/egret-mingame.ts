import {Game, MinGameOptions} from "./game";
import {SDKS_CONFIG} from "./config";
import fs = require("fs-extra");

// 微信小程序
export async function MingameWechat(game: Game, opts: MinGameOptions): Promise<boolean> {
    fs.ensureDirSync('project_wxgame');

    if (!fs.existsSync("sdks/embeded.js")) {
        console.error("没有找到渠道sdk，请从游戏中心下载到 sdks/embeded.js");
        return false;
    }
    if (!fs.existsSync("sdks/wechat.js")) {
        console.error("没有找到渠道sdk，请从游戏中心下载到 sdks/wechat.js");
        return false;
    }

    // 游戏中心的js
    fs.copySync("sdks/embeded.js", "project_wxgame/embeded.js");
    fs.copySync("sdks/wechat.js", "project_wxgame/wechat.js");

    //一些游戏配置参数
    let optcs: any = {};
    optcs.orientation = game.config.get('app', 'orientation') == 'v' ? "portrait" : "landscape";
    optcs.frameRate = game.config.get('app', 'frameRate') ? game.config.get('app', 'frameRate') : 60;
    optcs.version = game.config.get('app', 'version') ? game.config.get('app', 'version') : "";
    optcs.sdkUrl = opts.channel == 'sdks' ? SDKS_CONFIG.SDKS_HOST : SDKS_CONFIG.SDKS_DEBUG_HOST;
    let dsp: any = {};
    dsp.appids = game.config.get('wechat', 'appids');
    let region1 = `require('./embeded.js');
require('./wechat.js');
sdks.config.set('URL', '${optcs.sdkUrl}');
sdks.config.set('GAME_VERSION', '${optcs.version}');
let options = {orientation:'${optcs.orientation}',frameRate:${optcs.frameRate}};
        `;
    //微信小游戏的一些配置
    let region2 = `{"deviceOrientation":"${optcs.orientation}","navigatelist":"${dsp.appids}"}`;
    fs.writeFileSync(".n2/egret/region1.js", region1);
    fs.writeFileSync(".n2/egret/wx_config.json", region2);

    fs.copySync("app.config.json", "project_wxgame/app.config.json");

    return true;
}

// 头条小程序
export async function MingameToutiao(game: Game, opts: MinGameOptions): Promise<boolean> {
    fs.ensureDirSync('project_wxgame');

    if (!fs.existsSync("sdks/embeded.js")) {
        console.error("没有找到渠道sdk，请从游戏中心下载到 sdks/embeded.js");
        return false;
    }
    if (!fs.existsSync("sdks/toutiao.js")) {
        console.error("没有找到渠道sdk，请从游戏中心下载到 sdks/toutiao.js");
        return false;
    }

    // 游戏中心的js
    fs.copySync("sdks/embeded.js", "project_wxgame/embeded.js");
    fs.copySync("sdks/toutiao.js", "project_wxgame/toutiao.js");

    //一些游戏配置参数
    let optcs: any = {};
    optcs.orientation = game.config.get('app', 'orientation') == 'v' ? "portrait" : "landscape";
    optcs.frameRate = game.config.get('app', 'frameRate') ? game.config.get('app', 'frameRate') : 60;
    optcs.version = game.config.get('app', 'version') ? game.config.get('app', 'version') : "";
    optcs.sdkUrl = opts.channel == 'sdks' ? SDKS_CONFIG.SDKS_HOST : SDKS_CONFIG.SDKS_DEBUG_HOST;
    let dsp: any = {};
    dsp.appids = game.config.get('toutiao', 'appids');
    let region1 = `require('./embeded.js');
require('./toutiao.js');
sdks.config.set('DEBUG', true);
sdks.config.set('URL', '${optcs.sdkUrl}');
sdks.config.set('GAME_VERSION', '${optcs.version}');
let options = {orientation:'${optcs.orientation}',frameRate:${optcs.frameRate}};
        `;
    //微信小游戏的一些配置
    let region2 = `{"deviceOrientation":"${optcs.orientation}","navigatelist":"${dsp.appids}"}`;
    fs.writeFileSync(".n2/egret/region1.js", region1);
    fs.writeFileSync(".n2/egret/wx_config.json", region2);

    fs.copySync("app.config.json", "project_wxgame/app.config.json");

    return true;
}

// ReadyGo渠道
export async function MingameReadygo(game: Game, opts: MinGameOptions): Promise<boolean> {
    fs.ensureDirSync('project_wxgame');

    if (!fs.existsSync("sdks/embeded.js")) {
        console.error("没有找到渠道sdk，请从游戏中心下载到 sdks/embeded.js");
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
    fs.copySync("sdks/embeded.js", "project_wxgame/embeded.js");
    fs.copySync("sdks/readygo.js", "project_wxgame/readygo.js");

    // 星汉分配游戏的js
    fs.copySync("sdks/readygo-sdk.js", "project_wxgame/readygo-sdk.js");
    fs.copySync("sdks/readygo-stat-sdk.js", "project_wxgame/readygo-stat-sdk.js");
    fs.copySync("sdks/readygo-dsp-sdk.js", "project_wxgame/readygo-dsp-sdk.js");

    //一些游戏配置参数
    let optcs: any = {};
    optcs.orientation = game.config.get('app', 'orientation') == 'v' ? "portrait" : "landscape";
    optcs.frameRate = game.config.get('app', 'frameRate') ? game.config.get('app', 'frameRate') : 60;
    optcs.version = game.config.get('app', 'version') ? game.config.get('app', 'version') : "";
    optcs.sdkUrl = opts.channel == 'sdks' ? SDKS_CONFIG.SDKS_HOST : SDKS_CONFIG.SDKS_DEBUG_HOST;
    let dsp: any = {};
    dsp.appids = game.config.get('readygo', 'appids');
    let region1 = `require('./embeded.js');
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
sdks.config.set('URL', '${optcs.sdkUrl}');
sdks.config.set('GAME_VERSION', '${optcs.version}');
let options = {orientation:'${optcs.orientation}',frameRate:${optcs.frameRate}};
        `;
    //微信小游戏的一些配置
    let region2 = `{"deviceOrientation":"${optcs.orientation}","navigatelist":"${dsp.appids}"}`;
    fs.writeFileSync(".n2/egret/region1.js", region1);
    fs.writeFileSync(".n2/egret/wx_config.json", region2);

    fs.copySync("app.config.json", "project_wxgame/app.config.json");

    return true;
}

// 百度小程序
export async function MingameBaidu(game: Game, opts: MinGameOptions): Promise<boolean> {
    fs.ensureDirSync('project_baidugame');

    if (!fs.existsSync("sdks/embeded.js")) {
        console.error("没有找到渠道sdk，请从游戏中心下载到 sdks/embeded.js");
        return false;
    }
    if (!fs.existsSync("sdks/baidu.js")) {
        console.error("没有找到渠道sdk，请从游戏中心下载到 sdks/baidu.js");
        return false;
    }

    fs.copySync("sdks/embeded.js", "project_baidugame/embeded.js");
    fs.copySync("sdks/baidu.js", "project_baidugame/baidu.js");

    //一些游戏配置参数
    let optcs: any = {};
    optcs.orientation = game.config.get('app', 'orientation') == 'v' ? "portrait" : "landscape";
    optcs.frameRate = game.config.get('app', 'frameRate') ? game.config.get('app', 'frameRate') : 60;
    optcs.version = game.config.get('app', 'version') ? game.config.get('app', 'version') : "";
    optcs.sdkUrl = opts.channel == 'sdks' ? SDKS_CONFIG.SDKS_HOST : SDKS_CONFIG.SDKS_DEBUG_HOST;
    let region1 = `
require('./manifest.js');
require('./egret.baidugame.js');
require('./embeded.js');
require('./baidu.js');

sdks.config.set('URL', '${optcs.sdkUrl}');
sdks.config.set('GAME_VERSION', '${optcs.version}');
let options = {orientation:'${optcs.orientation}',frameRate:${optcs.frameRate}};
        `;
    //微信小游戏的一些配置
    let region2 = `{"deviceOrientation":"${optcs.orientation}"}`;
    fs.writeFileSync(".n2/egret/region1.js", region1);
    fs.writeFileSync(".n2/egret/baidu_config.json", region2);

    fs.copySync("app.config.json", "project_baidugame/app.config.json");

    return true;
}