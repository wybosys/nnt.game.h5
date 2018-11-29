module app.data {

    export class Guide {

        constructor(cfg: Data.Guide) {
            this._cfg = cfg;
        }

        private _cfg: Data.Guide;

        // 正在使用
        using = false;

        // 配表
        get id(): number {
            return this._cfg.id;
        }

        // 组id
        get gid(): number {
            return this._cfg.gid;
        }

        // 层级id
        get wid(): number {
            return this._cfg.wid;
        }

        // 描述
        get desc(): string {
            return nn.val(this._cfg.desc, '');
        }

        // 对应的模块id
        get entryIdr(): string {
            return this._cfg.entry;
        }

        // 获取已读状态
        readed: boolean;

        // 计算当前是否可用
        valid(): boolean {
            return !this.readed && !this.using;
        }
    }
}
