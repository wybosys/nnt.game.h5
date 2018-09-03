export class ServiceItem {
    pid: number;

    toString(): string {
        return this.pid.toString();
    }
}

export class Service {

    constructor() {

    }

    stop() {

    }

    all(): ServiceItem[] {
        let r = new Array<ServiceItem>();
        return r;
    }
}