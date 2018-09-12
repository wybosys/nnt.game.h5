import fs = require("fs-extra");

export class EgretEui {

    clean() {
        fs.removeSync("project/resource/default.thm.json");
    }

    // 刷新eui皮肤组件列表以及和代码的对应
    build() {
        // 列出所有的exml文件
        
    }
}