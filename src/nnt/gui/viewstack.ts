module nn {

    /** 为了支持堆栈控制实体、类 */
    export type StackPageType = InstanceType<CComponent>;

    /** page类，为了能自动记录页面切换的路径 */
    export interface IPage {
        // 页面的路径标记
        pathKey:string;
    }

    /** 实现页面堆栈 */
    export interface IViewStack {
        /** 推入 */
        push(c:StackPageType, animated:boolean):boolean;
        push(c:StackPageType):boolean;

        /** 弹出 */
        pop(c:StackPageType, animated:boolean):boolean;
        pop(c:StackPageType);
        pop();
        
        popTo(c:StackPageType|number, animated:boolean):boolean;
        popTo(c:StackPageType|number):boolean;
        popToRoot();
    }

}
