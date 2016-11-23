/// <reference path="impl/eui-animate.ts" />

module eui {

    // 因为wing的问题自定义类必须位于独立的文件中，混在一起就找不到了
    export interface IEUIExt
    {
        // skin绑定结束的回调
        onPartBinded(name:string, target:any);
    }
    
    export class _EUIExt
    implements IEUIExt
    {
        onPartBinded(name:string, target:any) {
            let self:any = this;
            // 自动绑定点击, _onNameClicked
            let clicked = '_on' + _EUIExt.Propname(name) + 'Clicked';
            if (clicked in target) {
                self.addEventListener(egret.TouchEvent.TOUCH_TAP, (e:egret.TouchEvent)=>{
                    target[clicked].call(target);
                    e.stopPropagation();
                });
            }
        }

        // 获得使用大驼峰法定义的属性名称
        static Propname(name:string):string {
            let c = name[0];
            if (c == '_')
                return name;
            c = c.toUpperCase();
            return c + name.substr(1);
        }        
    }

    export var _EUIExtPROTO = _EUIExt.prototype;        

    export class ItemInfo
    {        
        /** 对应的数据 */
        data:any;
        
        /** 表中的索引 */
        index:number;
        
        /** 渲染用的renderer */
        renderer:eui.IItemRenderer;

        static FromEvent(e:eui.ItemTapEvent):ItemInfo {
            let d = new ItemInfo();
            d.data = e.item;
            d.index = e.itemIndex;
            d.renderer = e.itemRenderer;
            return d;
        }
    }

    /** 换选时带出业务层判断的对象 */
    export class SelectionInfo
    {
        /** 当前选中 */
        selected:ItemInfo;
        
        /** 即将选中 */
        selecting:ItemInfo;
        
        /** 用来取消此次选中 */
        cancel:()=>void;
    }
    
    // 避免wing中使用自定义属性报错
    export function _EUIExtFix(cls:any) {
        let p = cls.prototype;
        if (p.setSkinPart == undefined)
            p.setSkinPart = function(name, instance) {};
    };
}

module nn {

    export function getBounds(e:egret.DisplayObject):hd.Rect {
        return new nn.Rect(0, 0,
                           e.width, e.height);
    }

    export function getFrame(e:egret.DisplayObject):hd.Rect {
        return new nn.Rect(e.x, e.y,
                           e.width, e.height);
    }

    export function setFrame(e:egret.DisplayObject, rc:hd.Rect) {
        e.x = rc.x;
        e.y = rc.y;
        e.width = rc.width;
        e.height = rc.height;
    }

    export function setCenter(e:egret.DisplayObject, pt:hd.Point) {
        let rc = getFrame(e);
        rc.center = pt;
        setFrame(e, rc);
    }

    // 提供eui类似于core的设置anchor而不改变位置的方法
    export function setAnchorPoint(e:egret.DisplayObject, anchor:hd.Point) {
        let rc = getFrame(e);
        e.anchorOffsetX = rc.width * anchor.x;
        e.anchorOffsetY = rc.height * anchor.y;
        e.x = rc.x + e.anchorOffsetX;
        e.y = rc.y + e.anchorOffsetY;
    }
}
