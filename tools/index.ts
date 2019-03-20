#!/usr/bin/env node

import program = require("commander");
import fs = require("fs-extra");
import path = require("path");
import {Game} from "./game";
import {EgretGame} from "./egret";

async function main() {
    // 当前文件的上一级目录即为项目目录
    process.chdir(path.dirname(__dirname));

    // 建立代码执行目录
    fs.ensureDirSync('.n2');

    // 根据项目特征选用游戏模板
    let game: Game;
    if (fs.existsSync("project/egretProperties.template.json")) {
        game = new EgretGame();
    } else {
        throw new Error('没有找到合适的编译配置');
    }
    await game.init();

    // 初始化命令提示
    program
        .command("clean")
        .description("清理项目")
        .action(() => {
            try {
                game.clean();
            } catch (err) {
            }
        });

    program
        .command("build <channel> <subchannel>")
        .description("生成调试项目")
        .action((channel, subchannel) => {
            game.build({
                debug: true,
                channel: channel,
                subchannel: subchannel
            });
        });

    program
        .command("publish <channel> <subchannel>")
        .description("生成正式项目")
        .action((channel, subchannel) => {
            game.build({
                release: true,
                noservice: true,
                channel: channel,
                subchannel: subchannel
            });
        });

    program
        .command("dist <channel> <subchannel>")
        .description("发布项目")
        .action(async (channel, subchannel) => {
            await game.build({
                distribution: true,
                noservice: true,
                channel: channel,
                subchannel: subchannel
            });
            await game.compress({
                channel: channel,
                subchannel: subchannel,
                mergeimages: true,
                compressimages: true,
                compressscripts: true
            });
        });

    program
        .command("mingame <channel> <subchannel>")
        .description("打包微信小游戏")
        .action((channel, subchannel, opts) => {
            game.mingame({
                channel: channel,
                subchannel: subchannel
            });
        });

    program
        .command("compress <channel> <subchannel>")
        .description("压缩输出的项目")
        .option("-m, --mingame", "小游戏")
        .action((channel, subchannel, opts) => {
            game.compress({
                channel: channel,
                subchannel: subchannel,
                mingame: opts.mingame,
                mergeimages: true,
                compressimages: true,
                compressscripts: true
            });
        });

    program
        .command("gendata")
        .description("生成数据文件")
        .action(() => {
            game.gendata.build();
        });

    program
        .command("config")
        .description("更新配置文件")
        .action(() => {
            game.config.make();
        });

    program
        .command("service [stop|list]")
        .description("控制编译环境启动的服务")
        .action((act) => {
            if (act == "stop")
                game.service.stop();
            else if (act == "list")
                console.log(game.service.toString());
        });

    program
        .command("res <up|pub|dist>")
        .description("项目资源控制")
        .action((act) => {
            if (act == "pub") {
                game.resource.publish({});
            } else if (act == "dist") {
                game.resource.publish({
                    merge: true,
                    compress: true
                });
            } else {
                game.resource.refresh();
            }
        });

    // 添加编译工具提供的命令
    game.commands(program);

    program
        .version("1.0.0")
        .parse(process.argv);
}

main();
