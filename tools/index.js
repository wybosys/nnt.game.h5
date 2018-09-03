Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const fs = require("fs");
const kernel_1 = require("./kernel");
function main() {
    // 当前文件的上一级目录即为项目目录
    kernel_1.Env.CWD = __dirname;
    // 建立代码执行目录
    if (!fs.existsSync(kernel_1.Env.CWD + "/.n2~"))
        fs.mkdirSync(kernel_1.Env.CWD + "/.n2~");
    program
        .version("1.0.0")
        .parse(process.argv);
}
main();
