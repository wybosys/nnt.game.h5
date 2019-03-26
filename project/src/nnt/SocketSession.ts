module nn {

    // connect解析返回数据时必须实现的接口
    export interface ISocketResponse {

        // model发送时标记自己的序号
        _cmid: number;

        // 静默
        quiet: boolean;
    }

    export class WebSocketConnector extends CSocketConnector {
        open() {
            if (this._hdl)
                return;

            let hdl = new WebSocket(this.host);
            hdl.binaryType = "arraybuffer";
            hdl.onopen = e => {
                this._hdl = hdl;
                this.onOpen(e);
            };
            hdl.onclose = e => {
                this._hdl = null;
                this.onClose(e);
            };
            hdl.onmessage = e => {
                let data = this.parseData(e.data);
                this.onMessage(data, e);
            };
            hdl.onerror = e => {
                this._hdl = null;
                this.onError(e);
            };
        }

        close() {
            if (this._hdl == null)
                return;
            this._hdl.close();
            this._hdl == null;
        }

        isopened(): boolean {
            return this._hdl != null;
        }

        write(d: any) {
            let str = toJson(d);
            this._hdl.send(str);
        }

        watch(d: any, on: boolean) {
            fatal("不支持监听操作");
        }

        protected parseData(data: ArrayBuffer): any {
            let str = StringT.FromArrayBuffer(data);
            return toJsonObject(str);
        }

        protected onOpen(e: Event) {
            this.signals.emit(SignalOpen);
        }

        protected onClose(e: CloseEvent) {
            this.signals.emit(SignalClose);
        }

        protected onMessage(data: any, e: MessageEvent) {
            this.signals.emit(SignalDataChanged, data);
        }

        protected onError(e: Event) {
            this.signals.emit(SignalFailed);
        }

        private _hdl: WebSocket;
        private _session: ISocketSession;

        get session(): ISocketSession {
            return this._session;
        }
    }

    export interface ISocketSession extends ISObject {
        // 连接器
        connector: CSocketConnector;

        // 监听模型
        watch(mdl: Model, cb?: (s?: Slot) => void, cbctx?: any);

        // 取消监听模型
        unwatch(mdl: Model);

        // 获取模型数据
        fetch(mdl: Model, cb?: (s?: Slot) => void, cbctx?: any, cbfail?: (s?: Slot) => void, cbend?: () => void);

        // 服务器地址
        host: string;

        // sessionId
        SID: string;

        // 打开连接
        open();
    }

    /**
     * WebSocket的服务，和Rest不同，ws不能根据model的url来切换连接，所以不同的url需要实例不同的session
     */
    export class SocketSession extends SObject implements ISocketSession {
        constructor(host?: string) {
            super();
            this.host = host;
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalOpen);
            this._signals.register(SignalConnected);
            this._signals.register(SignalClose);
            this._signals.register(SignalTimeout);
            this._signals.register(SignalEnd);
            this._signals.register(SignalSucceed);
            this._signals.register(SignalFailed);
        }

        private _connector: CSocketConnector;

        get connector(): CSocketConnector {
            return this._connector;
        }

        /**
         * 不同的服务器对连接的要求是不一样的，所以需要实现对应的连接器，在open之前设置
         */
        set connector(cnt: CSocketConnector) {
            if (this._connector == cnt)
                return;
            if (this._connector) {
                (<any>this._connector)._session = null;
            }
            this._connector = cnt;
            if (cnt) {
                (<any>cnt)._session = this;
                cnt.signals.connect(SignalOpen, this.__cnt_open, this);
                cnt.signals.connect(SignalClose, this.__cnt_disconnected, this);
                cnt.signals.connect(SignalDataChanged, this.__cnt_gotmessage, this);
            }
        }

        /**
         * 可选的登录用户SID信息，会自动附加到请求数据中
         */
        SID: string;

        /**
         * 在服务器上监听该对象
         */
        watch(mdl: Model,
              cb?: (s?: Slot) => void, cbctx?: any) {
            if (this._listenings.has(mdl.hashCode))
                return;
            mdl.session = null;

            if (cbctx)
                mdl.attach(cbctx);
            if (cb)
                mdl.signals.connect(SignalSucceed, cb, cbctx);

            this._listenings.set(mdl.hashCode, mdl);
            if (this.connector && this.connector.isopened())
                this.connector.watch(mdl, true);
        }

        // 正在监听的对象集，用来当服务器回数据时激发，或者重新建立监听时使用
        private _listenings = new CMap<number, Model>();

        unwatch(mdl: Model) {
            if (!this._listenings.has(mdl.hashCode))
                return;

            // 释放
            if (this.connector && this.connector.isopened())
                this.connector.watch(mdl, false);
            mdl.drop();

            // 从session中移除
            this._listenings.delete(mdl.hashCode);
        }

        // 正在等待类rest访问的模型，收到访问或超时后就会被移除
        private _fetchings = new CMap<number, Model>();

        /** 获取一个数据
         @param cb, 成功后的回调
         @param cbfail, 失败后的回调
         @param cbend, 结束的回调（不区分成功、失败）
         */
        fetch(mdl: Model,
              cb?: (s?: Slot) => void, cbctx?: any,
              cbfail?: (s?: Slot) => void, cbend?: () => void) {
            if (!this.connector || !this.connector.isopened()) {
                if (cbfail)
                    cbfail.call(cbctx);
                if (cbend)
                    cbend.call(cbctx);
                return;
            }

            // 为了防止正在调用 api 时，接受信号的对象析构，保护一下
            if (cbctx)
                mdl.attach(cbctx);

            if (cb)
                mdl.signals.connect(SignalSucceed, cb, cbctx);
            if (cbfail)
                mdl.signals.connect(SignalFailed, cbfail, cbctx);
            if (cbend)
                mdl.signals.connect(SignalEnd, cbend, cbctx);

            this._fetchings.set(mdl.hashCode, mdl);
            mdl.session = this;
            mdl.__mdl_start();
            this.connector.write(mdl);
        }

        /** 服务器的地址 */
        host: string;

        /** 打开连接 */
        open() {
            if (!this.connector) {
                fatal("没有设置connector");
                return;
            }

            if (this.connector.isopened()) {
                fatal('连接已经打开');
                return;
            }

            this.connector.host = this.host;
            this.connector.open();
        }

        is_connected() {
            return this.connector.isopened();
        }

        private __cnt_open() {
            noti('打开服务器 ' + this.host + ' 成功');

            // 初始化连接
            let m = new Model();
            m.action = "socket.init";
            this.fetch(m, () => {
                noti('连接服务器 ' + this.host + ' 成功');
                this.signals.emit(SignalOpen);

                // 重新建立监听
                this._listenings.forEach(mdl => {
                    this.connector.watch(mdl, true);
                });

                this._tmrPing = Repeat(30, () => {
                    let m = new Model();
                    m.action = "socket.ping";
                    this.fetch(m);
                });
            });
        }

        private __cnt_disconnected() {
            noti('服务器 ' + this.host + ' 断开连接');
            this.signals.emit(SignalClose);

            if (this._tmrPing) {
                this._tmrPing.drop();
                this._tmrPing = null;
            }
        }

        private _tmrPing: CTimer;

        private __cnt_gotmessage(s: Slot) {
            let data: ISocketResponse = s.data;

            // 判断是否是fetch
            if (this._fetchings.has(data._cmid)) {
                // 解析对象
                let mdl = this._fetchings.get(data._cmid);
                // 后处理
                mdl.quiet = data.quiet;
                mdl.response = data;
                mdl.processResponse();
                mdl.__mdl_end();
                this._fetchings.delete(data._cmid);
            }

            // 判断是否是watch请求
            if (this._listenings.has(data._cmid)) {
                let mdl = this._listenings.get(data._cmid);
                mdl.quiet = data.quiet;
                mdl.response = data;
                mdl.processResponse();
            }
        }
    }
}

// 实现和nnt.logic服务器配合的socket连接器
namespace nn.logic {

    export class SocketConnector extends WebSocketConnector {

        // 自动重连
        autoReconnect = true;

        protected onClose(e: CloseEvent) {
            super.onClose(e);

            if (e && e.code == 4000) {
                // 服务端主动断开的链接，不能进行重连
                let reason = <any>toJsonObject(e.reason);
                switch (reason.code) {
                    case -859:
                        log("没有登录，所以服务器主动断开了连接");
                        break;
                    case -860:
                        log("请求了错误的ws协议");
                        break;
                    case -858:
                        log("服务器关闭");
                        break;
                    case -4:
                        log("多端登录");
                        break;
                }
                return;
            } else {
                // 尝试重连
                if (this.autoReconnect) {
                    this.signals.emit(SignalReopen);
                    Delay(1, () => {
                        this.doReconnect();
                    });
                }
            }
        }

        protected onError(e: ErrorEvent) {
            super.onError(e);
            log(e.message);

            if (this.autoReconnect) {
                Delay(1, () => {
                    this.doReconnect();
                });
            }
        }

        protected doReconnect() {
            log("尝试重新连接");
            this.open();
        }

        protected onMessage(data: any, e: MessageEvent) {
            // 需要对data进行处理，把服务端的IMPMessage结构数据提取出来
            super.onMessage({
                _cmid: data.d,
                code: data.s === undefined ? 0 : data.s,
                data: data.p,
                quiet: data.q
            }, e);
        }

        write(d: Model) {
            let params = {
                _cmid: d.hashCode,
                _sid: this.session.SID,
                _cid: nn.CApplication.shared.uniqueId,
                _ts: DateTime.Now(),
                action: d.action,
            };
            let fields = d.fields();
            for (let k in fields) {
                params[k] = fields[k];
            }
            super.write(params);
        }

        watch(d: Model, on: boolean) {
            let params = {
                _cmid: d.hashCode,
                _sid: this.session.SID,
                _cid: nn.CApplication.shared.uniqueId,
                _ts: DateTime.Now(),
                _listen: on ? 1 : 2, // 对应于服务器设置的 ListenMode.LISTEN/UNLISTEN
                action: d.action,
            };
            let fields = d.fields();
            for (let k in fields) {
                params[k] = fields[k];
            }
            super.write(params);
        }
    }
}
