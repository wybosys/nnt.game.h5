import child_process = require("child_process");
import {EmbededKv, FileLocker} from "./kernel";
import fs = require("fs-extra");

export class ServiceItem {
    pid: number;
    desc: string;

    toString(): string {
        return this.desc + ':' + this.pid;
    }
}

export class Service {

    // 生成锁
    static Locker(name: string): FileLocker {
        fs.ensureDirSync(".n2/lockers.fd");
        return new FileLocker(".n2/lockers.fd/" + name);
    }

    add(child: child_process.ChildProcess, desc?: string) {
        // 保存pid到数据库
        this._pids.set(child.pid.toString(), desc);
    }

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
