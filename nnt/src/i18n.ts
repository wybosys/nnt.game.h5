module nn {

    /** 转换标记到本地字符串 */
    export function T(str:string):string {
        return str;
    }
    
    export class _i18n {
        
        constructor() {            
        }
        
        // 默认的数据来自data/i18n.xls的配置
        data:any;
        
    }

    export var i18n = new _i18n();
    
}
