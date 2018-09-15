import child_process = require("child_process");
import {EmbededKv} from "./kernel";

export class ServiceItem {
    pid: number;
    desc: string;

    toString(): string {
        return this.desc + '(' + this.pid + ')';
    }
}

export class Service {

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

    // pids 数据
    private _pids = new EmbededKv(".n2/pids");
}
