module nn {

    // network
    export class HttpConnector
    extends CHttpConnector
    {
        constructor() {
            super();
            //暴露到外部设置
            //this._imp.withCredentials = true;

            EventHook(this._imp, egret.Event.COMPLETE, this.__cnt_completed, this);
            EventHook(this._imp, egret.IOErrorEvent.IO_ERROR, this.__cnt_error, this);
        }

        dispose() {
            super.dispose();
            this._imp = undefined;
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.delegate = this;
        }

        _signalConnected(sig:string, s?:Slot) {
            if (sig == SignalChanged)
                EventHook(this._imp, egret.ProgressEvent.PROGRESS, this.__cnt_progress, this);
        }
        
        private _imp = new egret.HttpRequest();

        start() {
            this.data = null;
            if (this.method == HttpMethod.GET)
            {
                this._imp.open(this.fullUrl(), egret.HttpMethod.GET);
                this._imp.send();
            }
            else
            {                
                this._imp.open(this.url, egret.HttpMethod.POST);
                if (this.fields) {
                    this._imp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
                    let d = URL.MapToField(this.fields);
                    this._imp.send(d);
                } else {
                    this._imp.send();
                }
            }
        }

        useCredentials() {
            this._imp.withCredentials = true;
        }

        private __cnt_completed(e:egret.Event) {
            this.data = this._imp ? this._imp.response : null;
            this.signals.emit(SignalDone, this.data);
            this.signals.emit(SignalEnd);
        }

        private __cnt_error(e:egret.IOErrorEvent) {
            this.signals.emit(SignalFailed, new Failed(-1, "网络连接失败"));
            this.signals.emit(SignalEnd);
        }

        private _prg = new Percentage();
        private __cnt_progress(e:egret.ProgressEvent) {
            this._prg.max = e.bytesTotal;
            this._prg.value = e.bytesLoaded;
            this.signals.emit(SignalChanged, this._prg);
        }
    }

}
