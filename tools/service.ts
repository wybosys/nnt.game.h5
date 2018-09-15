import child_process = require("child_process");

export class ServiceItem {
    pid: number;

    toString(): string {
        return this.pid.toString();
    }
}

export class Service {

    constructor() {

    }

    add(child: child_process.ChildProcess) {

    }

    stop() {

    }

    all(): ServiceItem[] {
        let r = new Array<ServiceItem>();
        return r;
    }
}
