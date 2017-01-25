module nn {

    export interface IDatasManager {        
    }

    /** 用来管理所有自动生成的位于 resource/assets/~tsc/ 中的数据 */
    class _DatasManager
    extends nn.SObject
    implements IDatasManager
    {
        constructor() {
            super();
        }

        // 读取所有数据，由application自动调用
        _load() {
            
        }
    }

    export var DatasManager:IDatasManager = new _DatasManager();
    
}
