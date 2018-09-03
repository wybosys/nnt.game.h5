import program = require("commander");
import fs = require("fs");
import {Env} from "./kernel";

function main() {
    // 当前文件的上一级目录即为项目目录
    Env.CWD = __dirname;

    // 建立代码执行目录
    if (!fs.existsSync(Env.CWD + "/.n2~"))
        fs.mkdirSync(Env.CWD + "/.n2~");

    program
        .version("1.0.0")
        .parse(process.argv);
}

main();
