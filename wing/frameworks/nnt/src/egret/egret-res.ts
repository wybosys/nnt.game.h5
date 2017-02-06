
// 对egret的RES模块进行功能扩展
module RES {

    // RES为单线程模型，所以可以直接扩展来进行加载的排序控制
    // 增加优先级的定义：普通UI资源 > Clip(Bone) 的加载
    
    export enum LoadPriority {
        NORMAL = 0,
        CLIP = 1
    };

    // 不需要做Stack的模式，因为所有获取资源的地方必须传入priority的定义
    export let CurrentPriority = LoadPriority.NORMAL;
    
    class ExtResourceItem
    extends ResourceItem
    {
        constructor(name: string, url: string, type: string) {
            super(name, url, type);
        }

        _priority:LoadPriority = CurrentPriority;
    }

    class ExtLazyLoadList
    {
        push(item:ExtResourceItem) {
            let arr = this.items[item._priority];
            arr.push(item);
            ++this.length;
        }
        
        pop():ExtResourceItem {
            if (this.length == 0)
                return null;
            let arr = this.items[LoadPriority.NORMAL];
            let poped = arr.pop();
            if (poped == null) {
                arr = this.items[LoadPriority.CLIP];
                poped = arr.pop();
            }
            --this.length;
            return poped;
        }

        length:number = 0;

        // 不通的等级定义不同的队列
        items:Array<Array<ExtResourceItem> > = [
            new Array<ExtResourceItem>(),
            new Array<ExtResourceItem>()
        ];
    }    

    RES.ResourceItem = ExtResourceItem;

    // 使用ext换掉原来的lazy以提供附加的优先级控制
    let lazyLoadListChanged:boolean;
    let PROTO = ResourceLoader.prototype;
    let funcLoadItem = PROTO.loadItem;
    PROTO.loadItem = function (resItem:ResourceItem) {
        let self:any = this;
        if (!lazyLoadListChanged) {
            if (self.lazyLoadList == null)
                nn.fatal("Egret引擎升级RES的LazyLoadList方法，请检查引擎修改");
            self.lazyLoadList = new ExtLazyLoadList();
            lazyLoadListChanged = true;
        }
        funcLoadItem.call(self, resItem);
    };
}