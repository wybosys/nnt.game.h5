import {Worker} from './worker';
import {Game} from "./game";

export interface ResourceOptions {
    // 合并小图
    merge?: boolean;

    // 压缩图片
    compress?: boolean;
}

export abstract class Resource extends Worker {

    constructor(game: Game) {
        super(game);
    }

    // 刷新资源
    abstract async refresh(): Promise<boolean>;

    // 发布资源
    abstract async publish(opts: ResourceOptions): Promise<void>;

    // 清理
    abstract clean(): void;
}
