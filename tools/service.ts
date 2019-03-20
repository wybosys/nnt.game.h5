import child_process = require("child_process");
import fs = require("fs-extra");
import {EmbededKv, FileLocker} from "./kernel";
import {Worker} from "./worker";
import {Game} from "./game";

// 每一个服务
export class ServiceItem {
    pid: number;
    desc: string;

    toString(): string {
        return this.desc + ':' + this.pid;
    }
}

export class Service extends Worker {

    constructor(game: Game) {
        super(game);
    }

    // 使用文件锁来禁止重复打开同一个服务
    static Locker(name: string): FileLocker {
        fs.ensureDirSync(".n2/lockers.fd");
        return new FileLocker(".n2/lockers.fd/" + name);
    }

    // 记录子服务
    add(child: child_process.ChildProcess, desc?: string) {
        // 保存pid到数据库
        this._pids.set(child.pid.toString(), desc);
    }

    // 停止所有服务
    stop() {
        this._pids.forEach((val, key) => {
            try {
                process.kill(parseInt(key), 'SIGTERM');
            } catch (exc) {
                // pass
            }
        });
        this._pids.clear();
        fs.removeSync(".n2/lockers.fd");
    }

    // 当前运行的服务
    all(): ServiceItem[] {
        let ret: ServiceItem[] = [];
        this._pids.forEach((val, key) => {
            let t = new ServiceItem();
            t.pid = parseInt(key);
            t.desc = val;
            ret.push(t);
        });
        return ret;
    }

    toString(): string {
        let strs: string[] = [];
        this.all().forEach(e => {
            strs.push(e.toString());
        });
        return strs.join('\n');
    }

    // pids 数据
    private _pids = new EmbededKv(".n2/pids");
}

// 服务接口
export interface IService {

    // 启动服务监听
    startWatch(svc: Service): Promise<void>;
}
