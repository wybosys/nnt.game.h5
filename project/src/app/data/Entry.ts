module app.data {

    export class Entry {

        static FromIdr(idr: string): Entry {
            let cfg = Data.Entry.Get(idr);
            if (!cfg)
                return null;

            let r = new Entry();
            r._idr = idr;
            r._cfg = cfg;
            if (r._cfg.feature) {
                r._feature = new Feature(r._cfg.feature);
                //     getManager().feature.check(r._feature, null);
            }
            return r;
        }

        get entryIdr(): string {
            return this._idr;
        }

        private _idr: string;
        private _cfg: Data.Entry;
        private _feature: Feature;

        // 打开本模块
        open(ext?: any) {
            if (!this._cfg || !this._cfg.launcherIdr) {
                nn.warn("模块定义的数据不全");
                return;
            }

            // 判断是否满足打开条件
            if (this._feature && !this._feature.opening) {
                // 显示提示信息
                return;
            }

            // 启动模块
            let lcfg = Data.Entry.Get(this._cfg.launcherIdr);
            nn.Entries.invoke(this._cfg.clazz, lcfg.clazz, ext);
        }


        get feature(): Feature {
            return this._feature;
        }
    }

    export class Feature {

        constructor(id?: string) {
            if (id) {
                this._cfg = Data.Feature.Get(id);
                this.unopenTips.fmt = this._cfg.message;
            }
        }

        get id(): string {
            return this._cfg.id;
        }

        // 是否可以开启
        opening = true;

        // 是否有新的通知（红点）
        newing = false;

        // 没开放的提示
        unopenTips = new nn.FormatString();

        // 是否被禁
        private _disabled = false;
        set disabled(b: boolean) {
            this._disabled = b;
        }

        get disabled(): boolean {
            if (this._disabled)
                return true;

            if (!this.opening && !this._cfg.visible)
                return true;

            return false;
        }

        private _cfg: Data.Feature;
    }
}
