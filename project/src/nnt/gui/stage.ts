module nn {

    // 当元素添加到舞台上
    export let SignalAddedToStage = "::ui::addedtostage";

    // 请求关闭页面
    export let SignalRequestClose = "::nn::request::close";

    /** zPosition的几个预定的层次 */
    export enum ZPOSITION {
        DEFAULT = 100, // 默认和undefine都代表100
        FRONT = -999,
        NORMAL = 0,
        BACK = 999,
    };

    // 自动资源组加载规范
    export interface IReqResources {
        /** 获得依赖的资源 */
        getReqResources(): Array<ReqResource>;

        /** 动态资源组 */
        reqResources?: Array<ReqResource>;
    }

    /** 资源组管理 */
    export abstract class ReqResources implements IReqResources {
        static __reqResources: Array<ReqResource>;
        reqResources: Array<ReqResource>;

        /** 对象依赖的动态资源组 */
        getReqResources(): Array<ReqResource> {
            return this.reqResources;
        }

        /** 获得依赖的静态资源组 */
        static GetReqResources(): Array<ReqResource> {
            let self = this;
            if (self.__reqResources)
                return self.__reqResources;
            self.__reqResources = [];
            self.ResourcesRequire(self.__reqResources);
            return self.__reqResources;
        }

        /** 通过该函数回调业务层的静态资源组定义 */
        static ResourcesRequire(res: Array<ReqResource>) {
        }

        /** 加载静态资源时现实的进度，默认使用 Application 的 classResourceLoadingView */
        static ClazzResourceProgress: any;

        /** 是否显示资源加载的进度
         @note 静态的资源加载一般都需要显示资源进度 */
        static ShowResourceProgress: boolean = true;
    }

    // 材质的类型
    export class COriginType {
        imp: any;
        static shared = new COriginType();
    }

    export type TextureSource = UriSource | COriginType;

    // 直接用于源类型的对象
    export class SourceVariable<IMPL extends IReference, T> extends RefVariable<IMPL> {
        source: T;

        dispose() {
            super.dispose();
            this.source = undefined;
        }
    }

    // 舞台的大小
    export let StageBounds = new Rect();

}
