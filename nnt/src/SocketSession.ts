module nn {    

    export class SocketModel
    extends SObject
    {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalStart);
            this._signals.register(SignalEnd);
            this._signals.register(SignalSucceed);
            this._signals.register(SignalFailed);
            this._signals.register(SignalTimeout);
        }

        fields():Map<string, any> {
            return this.params;
        }

        /** 请求的时间戳 */
        ts:number;

        /** 显示等待 */
        showWaiting:boolean;

        /** 配置文件 */
        cfg:string;

        /** 请求和返回的类名 */
        name:string;
        dname:string;

        /** 命令的标记 */
        static Command:any;

        /** 参数 */
        params = new Map<string, any>();

        /** 反解析 */
        protected unserialize(rsp:any):boolean {
            if ((<any>this).data) {
                // 反解析数据到data对象
                (<any>this).data.unserialize(rsp);
            }
            return true;
        }

        // 开始拉数据
        __mdl_start() {
            if (this.showWaiting)
                Hud.ShowProgress();            
            this.signals.emit(SignalStart);            
        }

        // 获取数据成功
        __mdl_completed(rsp:any) {
            this.unserialize(rsp);
            this.signals.emit(SignalSucceed);
            this.__mdl_end();
        }        

        // 获取数据失败
        __mdl_failed() {
            this.signals.emit(SignalFailed);
            this.__mdl_end();
        }

        // 处理结束
        __mdl_end() {
            this.signals.emit(SignalEnd);
            
            if (this.showWaiting)
                Hud.HideProgress();

            // 调用完成，析构对象
            this.drop();
        }
    }

    class ProtoBufHeader
    {
        cmd:number;
        seqid:number;
        code:number;

        toString():string {
            return 'header: ' + this.cmd + ' ' + this.seqid + ' ' + this.code;
        }
    }

    class ProtoBufImpl
    {
        classForModel(cfg:string, name:string):any {
            var key = cfg + ':/:' + name;
            if (this._tpls.has(key))
                return this._tpls[key];
            var mdls = this._cfgs[cfg];
            if (mdls == null) {
                var proto = ResManager.getText(cfg + '_dsl', RES.LoadPriority.NORMAL, null, null);
                if (proto == null) {
                    warn('dsl ' + cfg + ' not found');
                    return null;
                }
                // mdls = dcodeIO.ProtoBuf.loadProto(proto);
                this._cfgs[cfg] = mdls;
            }
            var cls = mdls.build(name);
            if (cls == null)
                warn('没有找到数据模型 ' + name);
            this._tpls[key] = cls;
            return cls;
        }        
        
        private _tpls = new Map<string, any>();
        private _cfgs = new Map<string, any>();
    }

    export class WebSocketConnector
    extends CSocketConnector
    {
        open() {
            if (this._hdl)
                return;
            
            this._hdl = new WebSocket(this.host);
            this._hdl.binaryType = "arraybuffer";
            this._hdl.onopen = ()=>{
                this.signals.emit(SignalOpen);
            };
            this._hdl.onclose = ()=>{
                this._hdl = null;
                this.signals.emit(SignalClose);
            };
            this._hdl.onmessage = (e:any)=>{
                this.signals.emit(SignalDataChanged, e.data);
            };
            this._hdl.onerror = (e:any)=>{
                this._hdl = null;
                this.signals.emit(SignalFailed);
            };
        }

        close() {
            if (this._hdl == null)
                return;
            this._hdl.close();
            this._hdl == null;
        }

        isopened():boolean {
            return this._hdl != null;
        }

        write(d:any) {
            this._hdl.send(d);
        }

        protected _hdl:WebSocket;
    }
    
    class _SocketSession
    extends SObject
    {
        constructor() {
            super();
        }
        
        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalOpen);
            this._signals.register(SignalClose);
            this._signals.register(SignalTimeout);
        }

        private _connector:CSocketConnector;
        get connector():CSocketConnector {
            return this._connector;
        }
        set connector(cnt:CSocketConnector) {
            if (this._connector == cnt)
                return;
            if (this._connector)
                drop(this._connector);
            this._connector = cnt;
            if (cnt) {
                cnt.signals.connect(SignalOpen, this.__cnt_connected, this);
                cnt.signals.connect(SignalClose, this.__cnt_disconnected, this);
                cnt.signals.connect(SignalDataChanged, this.__cnt_byteavaliable, this);
            }
        }

        /** 监听服务器发来的一个对象
         */
        watch(mdl:SocketModel,
              cb?:(s?:Slot)=>void, cbctx?:any)
        {
            if (cbctx)                
                mdl.attach(cbctx);            
            if (cb)
                mdl.signals.connect(SignalSucceed, cb, cbctx);

            var cmd = ObjectClass(mdl).Command;
            var arr:Set<SocketModel> = this._ntfMdls[cmd];
            if (arr == null) {
                arr = new Set<SocketModel>();
                this._ntfMdls[cmd] = arr;
            }
            arr.add(mdl);
        }
        
        unwatch(mdl:SocketModel) {
            var cmd = ObjectClass(mdl).Command;
            var arr = this._ntfMdls[cmd];
            if (arr == null) {
                warn('还没有监听该对象 ' + Classname(mdl));
                return;
            }
            
            // 释放
            mdl.drop();
            
            // 从session中移除
            nn.SetT.RemoveObject(arr, mdl);
        }

        /** 获取一个数据
            @param cb, 成功后的回调
            @param cbfail, 失败后的回调
            @param cbend, 结束的回调（不区分成功、失败）
        */
        fetch(mdl:SocketModel,
              cb?:(s?:Slot)=>void, cbctx?:any,
              cbfail?:(s?:Slot)=>void, cbend?:()=>void)
        {
            var cls = this._pb.classForModel(mdl.cfg, mdl.name);
            if (cls == null)
                return;

            mdl.ts = DateTime.Now();

            // 为了防止正在调用 api 时，接受信号的对象析构，保护一下
            if (cbctx)                
                mdl.attach(cbctx);
            
            if (cb)
                mdl.signals.connect(SignalSucceed, cb, cbctx);
            if (cbfail)
                mdl.signals.connect(SignalFailed, cbfail, cbctx);
            if (cbend)
                mdl.signals.connect(SignalEnd, cbend, cbctx);
            
            mdl.__mdl_start();
            
            var m = new cls();
            // 设置参数
            nn.MapT.Foreach(mdl.fields(), (k:string, v:any):boolean=>{
                m['set_' + k](v);
                return true;
            }, this);
            
            // 生成数据
            var buf = new egret.ByteArray();
            buf.endian = egret.Endian.BIG_ENDIAN;
            var seqid = ++this._seqId;
            this.writeHeader(buf, seqid, mdl);
            buf.writeBytes(new egret.ByteArray(m.toArrayBuffer()));

            // 发送出去
            this._seqMdls[seqid] = mdl;
            this.connector.write(buf.buffer);
        }

        // 当前发送的序号
        private _seqId = 0;

        // Req&Response模型对照表, seq => model
        private _seqMdls = new Map<number, SocketModel>();

        // Notify模型对照表, type => [model]
        private _ntfMdls = new Map<number, Set<SocketModel> >();

        /*
          定义为:
          binary.BigEndian.PutUint16(data[0:2], uint16(this.CmdId))
	      binary.BigEndian.PutUint32(data[2:6], uint32(this.TransId))
	      binary.BigEndian.PutUint16(data[6:8], uint16(this.Code))
         */
        protected writeHeader(buf:egret.ByteArray, seqid:number, mdl:SocketModel) {
            buf.writeShort(ObjectClass(mdl).Command);
            buf.writeInt(seqid);
            buf.writeShort(0);
        }

        protected readHeader(buf:egret.ByteArray):ProtoBufHeader {
            if (buf.length < 8)
                return null;
            
            var r = new ProtoBufHeader();
            r.cmd = buf.readShort();
            r.seqid = buf.readInt();
            r.code = buf.readShort();
            return r;
        }

        /** 服务器的地址 */
        host:string;

        /** 打开连接 */
        open() {
            if (this.connector.isopened()) {
                fatal('连接已经打开');
                return;
            }

            this.connector.host = this.host;
            this.connector.open();
        }

        private __cnt_connected() {
            noti('连接服务器 ' + this.host + ' 成功');
            this.signals.emit(SignalOpen);
        }

        private __cnt_disconnected() {
            noti('服务器 ' + this.host + ' 断开连接');
            this.signals.emit(SignalClose);
        }

        private __cnt_byteavaliable(s:Slot) {
            var data = new egret.ByteArray(s.data);
            var header = this.readHeader(data);
            if (header == null) {
                warn('收到了不能解析的头');
                return;
            }
            // 读取协议数据段数据
            var buf = new egret.ByteArray();
            data.readBytes(buf);

            // 处理数据时需要分为ReqRsp和Ntf两种处理

            // 处理 ntf 数据
            var mdls:Set<SocketModel> = this._ntfMdls[header.cmd];
            if (mdls && mdls.size) {
                var arr = this._ntfMdls[header.cmd];

                try {
                    var cls = null;
                    var md = null;
                    arr.forEach((mdl:SocketModel)=>{
                        if (cls == null) {
                            // 成组的对象采用同一份描述
                            cls = this._pb.classForModel(mdl.cfg, mdl.name);
                            if (cls == null) {
                                warn('没有找到模型返回对象的描述类');
                                arr.forEach((mdl:SocketModel)=>{
                                    mdl.__mdl_failed();
                                });
                                return;
                            }
                            md = cls.decode(buf.buffer);
                        }
                        
                        mdl.__mdl_completed(md);
                    }, this);    
                } catch (e) {
                    warn('解析数据失败');
                    arr.forEach((mdl:SocketModel)=>{
                        mdl.__mdl_failed();
                    });    
                }
                return;
            }

            // 处理 reqrsp 数据
            var mdl:SocketModel = this._seqMdls[header.seqid];
            if (mdl)
            {
                // 处理数据
                var cls = this._pb.classForModel(mdl.cfg, mdl.dname);
                if (cls == null) {
                    warn('没有找到模型返回对象的描述类');
                    mdl.__mdl_failed();
                    return;
                }

                try {
                    var md = cls.decode(buf.buffer);
                    mdl.__mdl_completed(md);
                } catch (e) {
                    warn('解析数据失败');
                    mdl.__mdl_failed();
                }
                
                nn.MapT.RemoveKey(this._seqMdls, header.seqid);
                return;
            }
            
            noti('没有找到模型对象 ' + header);
        }

        private _pb = new ProtoBufImpl();
    }

    export var SocketSession = new _SocketSession();
}
