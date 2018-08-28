// 开发专用的服务
module nn.developer {
    class Connector {
        constructor() {
            this._cnt.host = "ws://127.0.0.1:59001";
            this._cnt.signals.connect(SignalFailed, () => {
                warn("连接开发服务器失败，请使用n2build启动开发服务");
            }, null);
            this._opers.add(new OperationClosure((oper: Operation) => {
                this._cnt.signals.once(SignalOpen, () => {
                    oper.done();
                }, null);
                this._cnt.open();
            }));
        }

        method: string;
        fields: { [key: string]: any };

        fetch(cb: (data: any) => void) {
            this._cnt.signals.once(SignalDataChanged, (d: any) => {
                let data = JSON.parse(d.data);
                cb(data);
            }, null);
            this._opers.add(new OperationClosure((oper: Operation) => {
                this._cnt.write(JSON.stringify({
                    'cmd': "::wswrk::developer",
                    'method': this.method,
                    'fields': this.fields
                }));
                oper.done();
            }));
        }

        private _cnt = new WebSocketConnector();
        private _opers = new OperationQueue();
    }

    export class FileDialog {
        filter: string;

        pathForSave(cb: (ph: string) => void) {
            let cnt = new Connector();
            cnt.method = "::file::dialog::save";
            cnt.fields = {'filter': this.filter};
            cnt.fetch((d: any) => {
                cb(d.path);
            });
        }

        pathForOpen(cb: (ph: string) => void) {
            let cnt = new Connector();
            cnt.method = "::file::dialog::open";
            cnt.fields = {'filter': this.filter};
            cnt.fetch((d: any) => {
                cb(d.path);
            });
        }

        pathForDir(cb: (ph: string) => void) {
            let cnt = new Connector();
            cnt.method = "::file::dialog::dir";
            cnt.fields = {'filter': this.filter};
            cnt.fetch((d: any) => {
                cb(d.path);
            });
        }
    }

    export class FileSystem {
        /** 创建文件夹
         @param p Create intermediate directories as required
         */
        mkdir(path: string, p: boolean, cb: () => void) {
            let cnt = new Connector();
            cnt.method = "::fs::mkdir";
            cnt.fields = {'p': p, 'path': path};
            cnt.fetch((d: any) => {
                cb();
            });
        }
    }

    export class Image
        extends SObject {
        open(path: string, cb: (suc: boolean) => void) {
            let cnt = new Connector();
            cnt.method = "::image::open";
            cnt.fields = {'file': path};
            cnt.fetch((d: any) => {
                this._hdl = d.hdl;
                cb(this._hdl != null);
            });
        }

        save(path: string, cb: (suc: boolean) => void) {
            let cnt = new Connector();
            cnt.method = "::image::save";
            cnt.fields = {'file': path, 'hdl': this._hdl};
            cnt.fetch((d: any) => {
                cb(true);
            });
        }

        scale(x: number, y: number, cb: (img: Image) => void) {
            let cnt = new Connector();
            cnt.method = "::image::scale";
            cnt.fields = {'x': x, 'y': y, 'hdl': this._hdl};
            cnt.fetch((d: any) => {
                let r = new Image();
                r._hdl = d.hdl;
                cb(r);
            });
        }

        subimage(rc: Rect, cb: (sub: Image) => void) {
            let cnt = new Connector();
            cnt.method = "::image::subimage";
            cnt.fields = {'hdl': this._hdl, 'rect': {x: rc.x, y: rc.y, w: rc.width, h: rc.height}};
            cnt.fetch((d: any) => {
                let r = new Image();
                r._hdl = d.hdl;
                cb(r);
            });
        }

        private _hdl: any;
    }
}