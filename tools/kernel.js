Object.defineProperty(exports, "__esModule", { value: true });
const lowdb = require("lowdb");
const lowdbFileSync = require("lowdb/adapters/FileSync");
const uuidv4 = require("uuid/v4");
class EmbededKv {
    constructor(file) {
        let adapter = new lowdbFileSync(file);
        this._db = lowdb(adapter);
    }
    contains(key) {
        return this._db.get(key).value() != undefined;
    }
    get(key) {
        return this._db.get(key).value();
    }
    set(key, value) {
        this._db.set(key, value).write();
    }
}
exports.EmbededKv = EmbededKv;
function UUID() {
    return uuidv4().replace(/-/g, "");
}
exports.UUID = UUID;
class IpcLocker {
}
exports.IpcLocker = IpcLocker;
