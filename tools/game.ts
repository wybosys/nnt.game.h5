import {Config} from "./config";

export abstract class Game {

    // 清除不需要的文件
    clean() {
        this.config.clean();
    }

    // 游戏配置
    config: Config;
}