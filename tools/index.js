#!/usr/bin/env node
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const fs = require("fs");
const path = require("path");
const egret_1 = require("./egret");
function main() {
    // 当前文件的上一级目录即为项目目录
    process.chdir(path.dirname(__dirname));
    // 建立代码执行目录
    if (!fs.existsSync(".n2~"))
        fs.mkdirSync(".n2~");
    // 根据项目特征选用游戏模板
    let game;
    if (fs.existsSync("project/egretProperties.json"))
        game = new egret_1.EgretGame();
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
//# sourceMappingURL=index.js.map