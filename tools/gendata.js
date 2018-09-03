Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
class Gendata {
    clean() {
        if (fs.existsSync("src/app/~tsc"))
            fs.removeSync("src/app/~tsc");
    }
}
exports.Gendata = Gendata;
