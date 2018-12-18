import * as fs from 'fs';
import * as path from 'path';

// nnt fix
let UseEui = false;
let UseDragonBones = false;
let UseParticle = false;
let UsePhysics = false;
let HasData = false;

export class BaidugamePlugin implements plugins.Command {

    constructor() {
    }
    async onFile(file: plugins.File) {
        if (file.extname == '.js') {
            const filename = file.origin;
            if (filename == "libs/modules/promise/promise.js" || filename == 'libs/modules/promise/promise.min.js') {
                return null;
            }
            if (filename == 'libs/modules/egret/egret.js' || filename == 'libs/modules/egret/egret.min.js') {
                let content = file.contents.toString();
                content += `;window.egret = egret;`;
                content = content.replace(/definition = __global/, "definition = window");
                file.contents = new Buffer(content);
            }
            else {
                let content = file.contents.toString();
                if (
                    filename == "libs/modules/res/res.js" ||
                    filename == 'libs/modules/res/res.min.js' ||
                    filename == 'libs/modules/assetsmanager/assetsmanager.min.js' ||
                    filename == 'libs/modules/assetsmanager/assetsmanager.js'
                ) {
                    content += ";window.RES = RES;"
                }
                if (filename == "libs/modules/eui/eui.js" || filename == 'libs/modules/eui/eui.min.js') {
                    content += ";window.eui = eui;"
                    UseEui = true;
                }
                if (filename == 'libs/modules/dragonBones/dragonBones.js' || filename == 'libs/modules/dragonBones/dragonBones.min.js') {
                    content += ';window.dragonBones = dragonBones';
                    UseDragonBones = true;
                }
                if (filename == '3rd/particle/particle.js' || filename == '3rd/particle/particle.min.js') {
                    content += ';window.particle = particle;';
                    UseParticle = true;
                }
                if (filename == '3rd/physics.js' || filename == '3rd/physics/physics.min.js') {
                    content += ';window.physics = physics;';
                    UsePhysics = true;
                }
                if (filename == 'resource/default.data.js' || filename == 'resource/default.data.min.js') {
                    content += ';window.Data = Data;';
                    HasData = true;
                }
                content = "var egret = window.egret;" + content;
                if (filename == 'main.js') {
                    // nnt fix
                    content = "window.app = {}; var app = window.app;" + content;
                    if (UseEui)
                        content = "var eui = window.eui;" + content;
                    if (UseDragonBones)
                        content = "var dragonBones = window.dragonBones;" + content;
                    if (UseParticle)
                        content = "var particle = window.particle;" + content;
                    if (UsePhysics)
                        content = "var physics = window.physics;" + content;
                    if (HasData)
                        content = "var Data = window.Data;" + content;

                    content += "\n;window.Main = Main;"
                }
                file.contents = new Buffer(content);
            }
        }
        return file;
    }

    async onFinish(pluginContext: plugins.CommandContext) {
        //同步 index.html 配置到 game.js
        const gameJSPath = path.join(pluginContext.outputDir, "game.js");
        if(!fs.existsSync(gameJSPath)) {
            console.log(`${gameJSPath}不存在，请先使用 Launcher 发布百度小游戏`);
            return;
        }

        const projectConfig = pluginContext.buildConfig.projectConfig;

        /*
        let gameJSContent = fs.readFileSync(gameJSPath, { encoding: "utf8" });
        const optionStr =
            `entryClassName: ${projectConfig.entryClassName},\n\t\t` +
            `orientation: ${projectConfig.orientation},\n\t\t` +
            `frameRate: ${projectConfig.frameRate},\n\t\t` +
            `scaleMode: ${projectConfig.scaleMode},\n\t\t` +
            `contentWidth: ${projectConfig.contentWidth},\n\t\t` +
            `contentHeight: ${projectConfig.contentHeight},\n\t\t` +
            `showFPS: ${projectConfig.showFPS},\n\t\t` +
            `fpsStyles: ${projectConfig.fpsStyles},\n\t\t` +
            `showLog: ${projectConfig.showLog},\n\t\t` +
            `maxTouches: ${projectConfig.maxTouches},`;
        const reg = /\/\/----auto option start----[\s\S]*\/\/----auto option end----/;
        const replaceStr = '\/\/----auto option start----\n\t\t' + optionStr + '\n\t\t\/\/----auto option end----';
        gameJSContent = gameJSContent.replace(reg, replaceStr);
        fs.writeFileSync(gameJSPath, gameJSContent);
        */

        // 使用游戏编译时生成的代码替换
        let content = TPL_GAMEJS;
        for (let i = 1; i <= 2; ++i) {
            let f = pluginContext.outputDir + "/../.n2/egret/region" + i + ".js";
            if (fs.existsSync(f)) {
                let js = fs.readFileSync(f, {encoding: "utf8"});
                content = content.replace("//REGION_" + i + "//", js);
            }
        }

        // 按照nnt的规则输出启动器
        fs.writeFileSync(gameJSPath, content);

        //修改横竖屏
        let orientation;
        /*
        if (projectConfig.orientation == '"landscape"') {
            orientation = "landscape";
        }
        else {
            orientation = "portrait";
        }
        */
        let g = pluginContext.outputDir + "/../.n2/egret/baidu_config.json";
        let wconfig = fs.readFileSync(g, {encoding: "utf8"});
        orientation = JSON.parse(wconfig).deviceOrientation;

        const gameJSONPath = path.join(pluginContext.outputDir, "game.json");
        let gameJSONContent = JSON.parse(fs.readFileSync(gameJSONPath, { encoding: "utf8" }));
        gameJSONContent.deviceOrientation = orientation;
        fs.writeFileSync(gameJSONPath, JSON.stringify(gameJSONContent, null, "\t"));
    }
}

const TPL_GAMEJS = `require('./swan-game-adapter.js');

//REGION_1//

require('./manifest.js');
require('./egret.swangame.js');

nn.loader.mingamestart(options);

//REGION_2//

// require("egret.min.js")
`;
