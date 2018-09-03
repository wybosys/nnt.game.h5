import fs = require("fs");

export class Config {
    clean() {
        if (fs.existsSync(".n2~/build"))
            fs.unlinkSync(".n2~/build");
    }
}