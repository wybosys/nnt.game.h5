Object.defineProperty(exports, "__esModule", { value: true });
class Game {
    // 清除不需要的文件
    clean() {
        this.config.clean();
        this.gendata.clean();
    }
    // 添加命令
    commands(program) {
        // pass
    }
}
exports.Game = Game;
