import {Config} from "./config";
import {Gendata} from "./gendata";
import {Service} from "./service";
import {Resource} from "./resource";
import program = require("commander");

// 编译参数
export interface BuildOptions {

    // 调试模式
    debug?: boolean;

    // 正式版模式
    release?: boolean;

    // 发布模式
    distribution?: boolean;

    // 不打开服务监听
    noservice?: boolean;

    // 渠道
    channel?: string;

    // 二级渠道名
    subchannel?: string;
}

// 打包小程序的参数
export interface MinGameOptions {

    // 渠道名
    channel?: string;

    // 二级渠道名
    subchannel?: string;

    // 项目代号
    projectcode?: string;
}

// 压缩用的参数
export interface CompressOptions {

    // 渠道名
    channel?: string;

    // 二级渠道名
    subchannel?: string;

    // 是否时小程序
    mingame?: boolean;

    // 压缩代码
    compressscripts?: boolean;

    // 压缩图片
    compressimages?: boolean;

    // 合并小图
    mergeimages?: boolean;

    // 是否显示处理中的提示
    verbose?: boolean;
}

// 用来组装命令行对象
export type ProgramHandleType = program.Command;

// 编译使用的基类，要求业务接口都为async，避免不同引擎对编译流程的同步异步要求不同
export abstract class Game {

    constructor() {
        Game.shared = this;
    }

    static shared: Game;

    // 初始化
    async init() {
        await this.config.refresh();
    }

    // 清除不需要的文件
    async clean() {
        await this.config.clean();
        await this.gendata.clean();
        await this.service.stop();
        await this.resource.clean();
    }

    // 添加交互命令
    abstract commands(program: ProgramHandleType): void;

    // 构建版本
    abstract async build(opts: BuildOptions): Promise<boolean>;

    // 打包小游戏
    abstract async mingame(opts: MinGameOptions): Promise<boolean>;

    // 压缩游戏
    abstract compress(opts: CompressOptions): Promise<boolean>;

    // 游戏配置
    config: Config;

    // 配表生成器
    gendata: Gendata;

    // 服务管理
    service: Service;

    // 资源管理
    resource: Resource;
}
