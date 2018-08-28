module nn {

    /** 用来管理所有自动生成的位于 resource/assets/~tsc/ 中的数据 */
    export class _DatasManager
        extends nn.SObject {
        constructor() {
            super();
        }

        // 读取所有数据，由application自动调用
        _load() {

        }
    }

    export let DatasManager = new _DatasManager();
}
