module nn {

    export type TiledSource = string;
    
    export class TiledMap
    extends Sprite
    {
        constructor() {
            super();
        }

        dispose() {
            if (this._map) {
                this._map.destory();
                this._map = undefined;
            }
            this._data = undefined;            
            super.dispose();
        }

        protected _map:tiled.TMXTilemap;
        private _data:any;
        private _url:string;

        private _tiledSource:TiledSource;
        get tiledSource():TiledSource {
            return this._tiledSource;
        }
        set tiledSource(ts:TiledSource) {
            if (this._tiledSource == ts)
                return;
            // 移除旧的
            if (this._map) {                
                this._imp.removeChild(this._map);
                this._map.destory();
                this._map = undefined;
                this._data = undefined;
            }
            this._tiledSource = ts;
            if (ts) {
                var d:any = RES.getRes(ts);
                if (typeof(d) != 'string') {
                    warn('TiledMap 的资源文件类型错误: ' + ts + ' 的类型应该为 text，清通过ResDepo工具修改');
                    return;
                }
                this._data = egret.XML.parse(d);
                this._url = ResManager.getResUrl(ts);
            }
        }

        updateLayout() {
            super.updateLayout();
            if (this._data == null)
                return;
            var rc = this.boundsForLayout();
            // 判断是否要重新生成一下
            if (this._map) {
                if (this._map.renderwidth * ScaleFactorDeW != rc.width ||
                    this._map.renderheight * ScaleFactorDeH != rc.height)
                {
                    this._imp.removeChild(this._map);
                    this._map.destory();
                    this._map = undefined;
                }
            }
            // 生成一个新的map
            if (this._map == null) {
                this._map = new tiled.TMXTilemap(rc.width, rc.height, this._data, this._url);
                this._map.render();
                this._imp.addChild(this._map);
            }
            this.impSetFrame(rc, this._map);
        }
    }
    
}
