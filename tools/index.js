"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
function main() {
    let app = commander.version("1.0.0");
    app.parse(process.argv);
}
main();
