module eui {

    // 查看eui.js，会把ItemRenderSkinName的值保存在$DataGroup[13]
    const DATAGROUP_ITEMRENDERERSKINNAME = 13;

    export class _EUIDataGroupExt {

        static onPartBinded(self: any, name: string, target: any) {
            _EUIExt.onPartBinded(self, name, target);

            let Name = _EUIExt.Propname(name);

            // 如果提供条目点击
            let itemTap = '_on' + Name + 'ItemClicked';
            if (itemTap in target) {
                self.addEventListener(eui.ItemTapEvent.ITEM_TAP, (e: eui.ItemTapEvent) => {
                    target[itemTap].call(target, ItemInfo.FromEvent(e));
                }, self);
            }

            // 选中变化
            let seled = '_on' + Name + 'SelectionChanged';
            if (seled in target) {
                self.addEventListener(egret.Event.CHANGE, (e: egret.Event) => {
                    target[seled].call(target);
                }, self);
            }
            let seling = '_on' + Name + 'SelectionChanging';
            if (seling in target) {
                self.addEventListener(egret.Event.CHANGING, (e: egret.Event) => {
                    let info = _EUIDataGroupExt.GetChanging(self);
                    info.cancel = () => {
                        e.preventDefault();
                    };
                    target[seling].call(target, info);
                }, self);
            }

            // 是否绑定了条目渲染类型
            let itemRenderer = name + 'Item';

            // 如果业务的类手动定义了 xxxItem，则直接绑定
            if (itemRenderer in target) {
                self.itemRenderer = target[itemRenderer];
            } else {
                // 获得设置的ItemSkin，转换成对应的类，自动绑定
                let clz = getAppClazzForSkin(self.$DataGroup[DATAGROUP_ITEMRENDERERSKINNAME]);
                self.itemRenderer = clz;
            }

            // 顺手定义一下get/set方法使得可以动态的绑定item类型
            Object.defineProperty(target, itemRenderer, {
                get: function () {
                    return self.itemRenderer;
                },
                set: function (o) {
                    self.itemRenderer = o;
                }
            });

            // 使用override的方式动态在业务中获得数据
            let rendererForData = name + 'ItemForData';
            if (rendererForData in target) {
                self.itemRendererFunction = (d: any): any => {
                    return target[rendererForData](d);
                };
            }

            // 使用约定的方式 _onXxxItemUpdate 回调业务层的刷新
            let itemUpdate = '_on' + Name + 'ItemUpdate';
            if (itemUpdate in target) {
                self.__imp_updateitem = target[itemUpdate];
            }
        }

        private __imp_updateitem: any;

        // 即将选中的
        static Selecting(tgt: any): ItemInfo {
            let d = new ItemInfo();
            d.data = tgt.selectedItem;
            d.index = tgt.selectedIndex;
            d.renderer = nn.ArrayT.QueryObject<any>(tgt.$indexToRenderer, (e): boolean => {
                return e.itemIndex == d.index;
            });
            return d;
        }

        // 当前选中的
        static Selected(tgt: any): ItemInfo {
            let rd = nn.ArrayT.QueryObject<any>(tgt.$indexToRenderer, (e): boolean => {
                return e.selected;
            });
            let d = new ItemInfo();
            d.data = rd.data;
            d.index = rd.itemIndex;
            d.renderer = rd;
            return d;
        }

        // 填充changing对象
        static GetChanging(tgt: any): SelectionInfo {
            let d = new SelectionInfo();
            d.selected = this.Selected(tgt);
            d.selecting = this.Selecting(tgt);
            return d;
        }
    }

}
