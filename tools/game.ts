import {Config} from "./config";
import {Gendata} from "./gendata";

export abstract class Game {

    // 清除不需要的文件
    clean() {
        this.config.clean();
        this.gendata.clean();
    }

    // 游戏配置
    config: Config;

    // 配表生成器
    gendata: Gendata;
}