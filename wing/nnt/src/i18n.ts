module nn {

    /** 转换标记到本地字符串 */
    export function T(str:string):string {
        return str;
    }

    export interface I18N {
    }
    
    class _i18n implements I18N {
        
        constructor() {            
        }
        
        // 默认的数据来自data/i18n.xls的配置
        data:any;
        
    }

    export var i18n:I18N = new _i18n();
    
}
