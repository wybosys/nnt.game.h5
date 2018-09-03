#!/usr/bin/env node

import program = require("commander");
import fs = require("fs");
import path = require("path");
import {Game} from "./game";
import {EgretGame} from "./egret";

function main() {
    // 当前文件的上一级目录即为项目目录
    process.chdir(path.dirname(__dirname));

    // 建立代码执行目录
    if (!fs.existsSync(".n2~"))
        fs.mkdirSync(".n2~");

    // 根据项目特征选用游戏模板
    let game: Game;
    if (fs.existsSync("egretProperties.json"))
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
        .description("编译项目")
        .action(() => {

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
        .version("1.0.0")
        .parse(process.argv);
}

main();
