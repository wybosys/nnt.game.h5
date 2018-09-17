import {Config} from "./config";
import {Gendata} from "./gendata";
import {Service} from "./service";
import {Resource} from "./resource";
import program = require("commander");

export interface GameBuildOptions {

    // 调试模式
    debug?: boolean;

    // 正式版模式
    release?: boolean;

    // 发布模式
    distribution?: boolean;

    // 压缩代码
    compress_scripts?: boolean;

    // 压缩图片
    compress_images?: boolean;

    // 合并小图
    merge_images?: boolean;

    // 不打开服务
    noservice?: boolean;
}

export type ProgramHandleType = program.Command;

export abstract class Game {

    constructor() {
        Game.shared = this;
    }

    static shared: Game;

    // 清除不需要的文件
    clean() {
        this.config.clean();
        this.gendata.clean();
        this.service.stop();
        this.resource.clean();
    }

    // 编译
    abstract build(opts: GameBuildOptions): void;

    // 添加命令
    abstract commands(program: ProgramHandleType): void;

    // 游戏配置
    config: Config;

    // 配表生成器
    gendata: Gendata;

    // 服务管理
    service: Service;

    // 资源管理
    resource: Resource;
}
