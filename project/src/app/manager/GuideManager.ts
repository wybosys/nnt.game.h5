module app {

    import guid = js.guid;
    export const kSignalShowGuide = '::app::guide::show';

    export class GuideManager
        extends nn.Manager {

        // 让新手模块的dialog位于独立的队列
        queue = new nn.OperationQueue();

        constructor() {
            super();
            this.signals.register(kSignalShowGuide);
        }

        // 启动新手
        start() {
            this._updateValids();
        }

        onLoaded() {
            // pass
        }

        onDataLoaded() {
            // 将配表的新手转换成逻辑的新手
            Data.guides.forEach(e => {
                let g = new data.Guide(new Data.Guide(e));
                this._guidegrps.add(g.gid, g);
                this._guides[g.id] = g;
            });

            // 按照grp从小到达排序，方便之后的处理
            this._guidegrps.keys.sort(nn.Sort.NumberAsc);

            // 演示是从localStorage中读取新手的数据
            this._readedids = nn.Storage.shared.getObject('::nnt::game::h5::sample::guides', []);

            // 设置已经读取过的
            this._readedids.forEach(e => {
                this._guides[e].readed = true;
            });
        }

        // 按照gid整理出的新手表
        private _guidegrps = new nn.MultiMap<number, data.Guide>();

        // 所有新手列表，下标为配表id
        private _guides = new Array<data.Guide>();

        // 计算出的可用新手列表
        private _valids = new Array<data.Guide>();

        // 已经完成的新手
        private _readedids = new Array<number>();

        // 更新当前可用的新手
        private _updateValids() {
            // 按照规则，只能显示所有wid《＝1全部完成的group的导引
            let gid = 0;
            this._guidegrps.iterateEach((k, arr) => {
                gid = k;
                let fnd = nn.ArrayT.QueryObject(arr, e => {
                    return e.wid <= 1 && !e.readed;
                });
                // 找到了没有读过的
                return fnd == null;
            });

            let has = false;
            this._guides.forEach(e => {
                if (e.gid > gid || !e.valid())
                    return;
                e.using = true;
                this._valids.push(e);
                has = true;
            });

            // 激活显示新手的信号
            if (has)
                this.signals.emit(kSignalShowGuide);
        }

        // 设置该新手已经完成
        setReaded(guide: data.Guide) {
            if (guide.readed)
                return;
            guide.readed = true;
            this._readedids.push(guide.id);

            // 保存
            nn.Storage.shared.setObject('::nnt::game::h5::sample::guides', this._readedids);

            // 删除已经再内存中的
            nn.ArrayT.RemoveObjectByFilter(this._valids, e => {
                return e.id == guide.id;
            });

            // 刷新一下新手
            this._updateValids();
        }

        // 根据idr查找guide对象
        findGuide(idr: string): data.Guide {
            let guide = nn.ArrayT.QueryObject(this._valids, e => {
                return e.entryIdr == idr;
            });
            return guide;
        }

    }
}
