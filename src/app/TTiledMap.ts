class TTiledMap
extends nn.Sprite
{
    constructor() {
        super();
        this.resourceGroups = ['tiled'];

        this.addChild(this._map);
    }

    updateResource() {
        super.updateResource();
        this._map.tiledSource = 'village_tmx';
    }

    updateLayout() {
        super.updateLayout();
        this._map.frame = this.boundsForLayout();
    }

    _map = new nn.TiledMap();
}
