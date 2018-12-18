#!/usr/bin/env node

import program = require("commander");
import fs = require("fs-extra");
import path = require("path");
import {Game} from "./game";
import {EgretGame} from "./egret";

function main() {
    // 当前文件的上一级目录即为项目目录
    process.chdir(path.dirname(__dirname));

    // 建立代码执行目录
    fs.ensureDirSync('.n2');

    // 根据项目特征选用游戏模板
    let game: Game;
    if (fs.existsSync("project/wingProperties.json"))
        game = new EgretGame();

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
        .command("build [channel]")
        .description("生成调试项目")
        .action((channel) => {
            game.build({
                debug: true,
                channel: channel
            });
        });

    program
        .command("publish [special-channel]")
        .description("生成正式项目")
        .option("-c, --compress", "图片压缩")
        .option("-m, --merge", "图片合并")
        .action((channel) => {
            game.build({
                release: true,
                noservice: true,
                merge_images: program.merge,
                compress_images: program.compress,
                channel: channel
            });
        });

    program
        .command("dist [special-channel]")
        .description("发布项目")
        .action((channel) => {
            game.build({
                distribution: true,
                noservice: true,
                merge_images: false,
                compress_images: false,
                compress_scripts: true,
                channel: channel
            });
        });

    program
        .command("mingame <special-channel>")
        .description("打包微信小游戏")
        .option("-d, --debug", "测试")
        .action((channel, opts) => {
            game.mingame({
                channel: channel,
                publish: !opts.debug
            });
        });

    program
        .command("compress")
        .description("压缩输出的项目")
        .action(() => {
            game.compress();
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
        .option("-c, --compress", "图片压缩")
        .option("-m, --merge", "图片合并")
        .action((act) => {
            let opts = {
                merge: program.merge,
                compress: program.compress
            };
            if (act == "pub") {
                game.resource.publish(opts);
            } else if (act == "dist") {
                game.resource.publish({
                    merge: true,
                    compress: true
                });
            } else {
                game.resource.refresh();
            }
        });

    // 添加程序命令
    game.commands(program);

    program
        .version("1.0.0")
        .parse(process.argv);
}

main();
