module nn {

    // 配置
    class _Config {
        // 设置配置
        override(cfg: IndexedObject) {
            for (let k in cfg) {
                this[k] = this._cur[k] = cfg[k];
            }
        }

        // 添加根据客户端访问的url来设置
        url(url: RegExp, cfg: IndexedObject) {
            if (!this.get('URL') || !this.get('URL').match(url))
                return;
            for (let k in cfg) {
                this[k] = this._cur[k] = cfg[k];
            }
        }

        get(key: string, def?: any): any {
            return key in this._cur ? this._cur[key] : def;
        }

        set(key: string, val: any) {
            this[key] = this._cur[key] = val;
        }

        delete(key: string) {
            if (key in this._cur) {
                delete this._cur[key];
                delete this[key];
            }
        }

        contains(key: string): boolean {
            return key in this._cur;
        }

        private _cur: IndexedObject = {};
    }

    export let config = new _Config();
    config.override({
        URL: location.href
    });
}
