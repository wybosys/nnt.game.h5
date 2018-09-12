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
    fs.ensureDirSync('.n2/src');

    // 根据项目特征选用游戏模板
    let game: Game;
    if (fs.existsSync("project/egretProperties.json"))
        game = new EgretGame();

    program
        .option("-t, --test", "不开服务运行");

    program
        .command("clean")
        .description("清理项目")
        .action(() => {
            game.clean();
        });

    program
        .command("build")
        .description("生成调试项目")
        .action(() => {
            game.build({
                debug: true
            });
        });

    program
        .command("publish")
        .description("生成正式项目")
        .option("-c, --compress", "启用图片压缩")
        .action(() => {
            game.build({
                release: true
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
                console.log(game.service.all());
        });

    program
        .command("res <up|pub|dist>")
        .description("项目资源控制")
        .action((act) => {
            if (act == "pub")
                game.resource.publish();
            else if (act == "dist")
                game.resource.dist();
            else
                game.resource.refresh();
        });

    // 添加程序命令
    game.commands(program);

    program
        .version("1.0.0")
        .parse(process.argv);
}

main();
