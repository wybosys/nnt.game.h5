module eui {

    let gs_convertpt = new egret.Point();

    // 因为wing的问题自定义类必须位于独立的文件中，混在一起就找不到了
    export interface IEUIExt {
        // skin绑定结束的回调
        onPartBinded(name: string, target: any);
    }

    export class _EUIExt {
        static onPartBinded(self: any, name: string, target: any) {
            // 自动绑定点击, _onNameClicked
            let clicked = '_on' + _EUIExt.Propname(name) + 'Clicked';
            if (clicked in target) {
                self.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
                    target[clicked].call(target);
                    e.stopPropagation();
                });
            }
        }

        // 获得使用大驼峰法定义的属性名称
        static Propname(name: string): string {
            let c = name[0];
            if (c == '_')
                return name;
            c = c.toUpperCase();
            return c + name.substr(1);
        }

        static removeFromParent(self: any) {
            if (self.parent)
                self.parent.removeChild(self);
        }

        static setViewStack(self: any, sck: IViewStack) {
            self._viewStack = sck;
        }

        static getViewStack(self: any): IViewStack {
            if (self._viewStack)
                return self._viewStack;
            let p: any = self.parent;
            if (p && !('viewStack' in p)) {
                while (p) {
                    if ('viewStack' in p)
                        break;
                    p = p.parent;
                }
            }
            return p ? p.viewStack : null;
        }

        /* 返回上一级，采用逐层实现的方式，比如A(B(C(D，调用D的goback，如果D没有实现goback，则使用C，如果C是Dialog，则必然实现了goback方式，如果C没有goback方法（比如标准的eui对象），那继续向上追溯，一般业务中必然会遇到一个扩充后的对象
         */
        static goBack(self: any) {
            // 查找含有goback方法的上级
            let p = nn.queryParent(self, (o: any): any => {
                if (o.goBack != undefined)
                    return o;
                return null;
            });
            // 调用父级元素的回退方法
            p.goBack();
        }

        /* eui提供了基础的visible和includeInLayout，但是业务中会遇到同时操作这两个属性，所以提供一个便捷的设置 */
        static setExhibition(self: any, b: boolean) {
            if (_EUIExt.getExhibition(self) == b)
                return;
            self._exhibition = b;
            self.visible = b;
            self.includeInLayout = b;
        }

        static getExhibition(self: any): boolean {
            return self._exhibition === null || self._exhibition;
        }

        /** 设置遮罩 */
        static setClipbounds(self: any, rc: nn.Rect) {
            self.mask = rc;
        }

        static getClipbounds(self: any): nn.Rect {
            return self.mask;
        }

        // 播放动画相关
        static playAnimate(self: any, ani: Animate, idr?: any): Animate {
            if (idr == null)
                idr = ani.tag ? ani.tag : ani.hashCode;

            if (self._playingAnimates == null)
                self._playingAnimates = new Array<Animate>();
            if (self.findAnimate(idr) != null) {
                nn.warn("动画 " + idr + " 正在运行");
                return null;
            }

            ani = ani.clone();
            ani.tag = idr;
            self._playingAnimates.push(ani);
            ani.complete((s: nn.Slot) => {
                nn.ArrayT.RemoveObject(self._playingAnimates, ani);
            }, self);

            ani.bindDisplayObject(self).play();
            return ani;
        }

        static findAnimate(self: any, idr: any): Animate {
            if (self._playingAnimates)
                return nn.ArrayT.QueryObject(self._playingAnimates, (ani: Animate): boolean => {
                    return ani.tag == idr;
                });
            return null;
        }

        static stopAnimate(self: any, idr: any) {
            if (self._playingAnimates == null)
                return;
            let ani = self.findAnimate(idr);
            if (ani == null)
                return;
            ani.stop();
            nn.ArrayT.RemoveObject(self._playingAnimates, ani);
        }

        static stopAllAnimates(self: any) {
            if (self._playingAnimates) {
                nn.ArrayT.Clear(self._playingAnimates, (ani: Animate) => {
                    ani.stop();
                });
            }
        }

        static MakeAnimate(self: any, cb: (ani: nn.CAnimate) => void): Promise<void> {
            let r = new Animate();
            r.bindDisplayObject(self);
            cb(r);
            return r.play().completep();
        }
    }

    export function ConvertPoint(fromsp: egret.DisplayObject | nn.CComponent, pt: nn.Point, tosp: egret.DisplayObject | nn.CComponent): nn.Point {
        let from: egret.DisplayObject;
        if (fromsp instanceof nn.CComponent)
            from = (<nn.CComponent>fromsp).handle();
        else
            from = <egret.DisplayObject>fromsp;
        let to: egret.DisplayObject;
        if (tosp instanceof nn.CComponent)
            to = (<nn.CComponent>tosp).handle();
        else
            to = <egret.DisplayObject>tosp;
        if (from == null)
            from = (<nn.IComponent><any>nn.CApplication.shared.gameLayer)._imp;
        if (to == null)
            to = (<nn.IComponent><any>nn.CApplication.shared.gameLayer)._imp;
        from.localToGlobal(pt.x, pt.y, gs_convertpt);
        to.globalToLocal(gs_convertpt.x, gs_convertpt.y, gs_convertpt);
        return new nn.Point(gs_convertpt.x, gs_convertpt.y);
    }

    export function ConvertRect(fromsp: egret.DisplayObject | nn.CComponent, rc: nn.Rect, tosp: egret.DisplayObject | nn.CComponent): nn.Rect {
        let from: egret.DisplayObject;
        if (fromsp instanceof nn.CComponent)
            from = (<nn.CComponent>fromsp).handle();
        else
            from = <egret.DisplayObject>fromsp;
        let to: egret.DisplayObject;
        if (tosp instanceof nn.CComponent)
            to = (<nn.CComponent>tosp).handle();
        else
            to = <egret.DisplayObject>tosp;
        if (from == null)
            from = (<nn.IComponent><any>nn.CApplication.shared.gameLayer)._imp;
        if (to == null)
            to = (<nn.IComponent><any>nn.CApplication.shared.gameLayer)._imp;
        from.localToGlobal(rc.x, rc.y, gs_convertpt);
        to.globalToLocal(gs_convertpt.x, gs_convertpt.y, gs_convertpt);
        return new nn.Rect(gs_convertpt.x, gs_convertpt.y,
            rc.width, rc.height);
    }

}
