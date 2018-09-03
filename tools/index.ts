#!/usr/bin/env node

import program = require("commander");
import fs = require("fs");

function main() {
    // 当前文件的上一级目录即为项目目录
    process.chdir(__dirname);

    // 建立代码执行目录
    if (!fs.existsSync(".n2~"))
        fs.mkdirSync(".n2~");

    program
        .version("1.0.0")
        .parse(process.argv);
}

main();
