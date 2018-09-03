import commander = require("commander");
import fs = require("fs");
import {CWD} from "./kernel";

function main() {
    // 当前文件的上一级目录即为项目目录
    CWD = __dirname;

    // 建立代码执行目录
    if (!fs.existsSync(CWD + "/.n2~"))
        fs.mkdirSync(CWD + "/.n2~")

    let app = commander.version("1.0.0");
    app.parse(process.argv);
}

main();
