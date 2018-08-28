module nn {

    /** 找到所有的父对象 */
    export function getParents(ui: any): Array<any> {
        let r = [];
        let p = ui;
        while (p) {
            r.push(p);
            p = p.parent;
        }
        return r;
    }

    /** 获取每一个 view 的 supers，做两个 arr 的交集，取得第一个返回 */
    export function findAncestorView(l: any, r: any): any {
        let ls = getParents(l);
        let rs = getParents(r);
        let s = nn.ArrayT.ArrayInArray(ls, rs);
        return s.length ? s[0] : null;
    }

    /** 根据类型找父对象 */
    export function findParentByType(l: any, cls: any, def?: any): any {
        let p = l.parent;
        while (p) {
            if (p instanceof cls)
                return p;
            p = p.parent;
        }
        return def;
    }

    /** 根据自定义条件查找满足条件的父对象 */
    export function queryParent(l: any, query: (o: any) => any, ctx?: any): any {
        let p: any = l.parent;
        while (p) {
            let r = query.call(ctx, p);
            if (r)
                return r;
            p = p.parent;
        }
        return null;
    }

    /** 使用tag查找所有子元素 */
    export function findElementsByTag(l: any, tag: any): Array<any> {
        let arr = [];
        l.children.forEach((c: CComponent) => {
            if (c.tag == tag)
                arr.push(c);
            let sba = findElementsByTag(c, tag);
            nn.ArrayT.Concat(arr, sba);
        }, this);
        return arr;
    }

    /** 判断是否在屏幕上显示 */
    export function isAppearing<T>(obj: T): boolean {
        if (!obj)
            return true;
        if (egret.is(obj, "egret.Stage"))
            return true;
        if (!(<any>obj).visible)
            return false;
        return isAppearing((<any>obj).parent);
    }

}
