import fs = require("fs");
import del = require("del");

export class Gendata {
    clean() {
        if (fs.existsSync("src/app/~tsc"))
            del.sync("src/app/~tsc");
    }
}
