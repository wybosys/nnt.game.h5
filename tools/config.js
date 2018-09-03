Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Config {
    clean() {
        if (fs.existsSync(".n2~/build"))
            fs.unlinkSync(".n2~/build");
    }
}
exports.Config = Config;
