module eui {

    export class ItemInfo {
        /** 对应的数据 */
        data: any;

        /** 表中的索引 */
        index: number;

        /** 渲染用的renderer */
        renderer: eui.IItemRenderer;

        static FromEvent(e: eui.ItemTapEvent): ItemInfo {
            let d = new ItemInfo();
            d.data = e.item;
            d.index = e.itemIndex;
            d.renderer = e.itemRenderer;
            return d;
        }
    }

    /** 换选时带出业务层判断的对象 */
    export class SelectionInfo {
        /** 当前选中 */
        selected: ItemInfo;

        /** 即将选中 */
        selecting: ItemInfo;

        /** 用来取消此次选中 */
        cancel: () => void;
    }

    // 避免wing中使用自定义属性报错
    export function _EUIExtFix(cls: any) {
        let p = cls.prototype;
        if (p.setSkinPart == undefined)
            p.setSkinPart = function (name, instance) {
            };
    };
}

module nn {

    export function getBounds(e: egret.DisplayObject): nn.Rect {
        return new nn.Rect(0, 0,
            e.width, e.height);
    }

    export function getFrame(e: egret.DisplayObject): nn.Rect {
        return new nn.Rect(e.x, e.y,
            e.width, e.height);
    }

    export function setFrame(e: egret.DisplayObject, rc: nn.Rect) {
        e.x = rc.x;
        e.y = rc.y;
        e.width = rc.width;
        e.height = rc.height;
    }

    export function setCenter(e: egret.DisplayObject, pt: nn.Point) {
        let rc = getFrame(e);
        rc.center = pt;
        setFrame(e, rc);
    }

    // 提供eui类似于core的设置anchor而不改变位置的方法
    export function setAnchorPoint(e: egret.DisplayObject, anchor: nn.Point) {
        let rc = getFrame(e);
        e.anchorOffsetX = rc.width * anchor.x;
        e.anchorOffsetY = rc.height * anchor.y;
        e.x = rc.x + e.anchorOffsetX;
        e.y = rc.y + e.anchorOffsetY;
    }
}
