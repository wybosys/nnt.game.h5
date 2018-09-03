Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const del = require("del");
class Gendata {
    clean() {
        if (fs.existsSync("src/app/~tsc"))
            del.sync("src/app/~tsc");
    }
}
exports.Gendata = Gendata;
