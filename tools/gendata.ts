import fs = require("fs-extra");

export class Gendata {
    clean() {
        if (fs.existsSync("src/app/~tsc"))
            fs.removeSync("src/app/~tsc");
    }
}
