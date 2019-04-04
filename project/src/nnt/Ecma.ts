module nn {

// 为了让ecma.ts位于kernel.ts加载之前加载
    export function Ecma() {
        // pass
    }
}

// 提供兼容性的map
class CompatMap<K, V> {

    clear() {
        this._obj = {};
        this._keys.clear();
    }

    delete(k: K): boolean {
        if (<any>k in this._obj) {
            delete this._obj[<any>k];
            this._keys.delete(k);
            return true;
        }
        return false;
    }

    forEach(cb: (v: V, k: K) => void, ctx?: any) {
        this._keys.forEach(k => {
            cb.call(ctx, this._obj[<any>k], k);
        });
    }

    get(k: K): V | undefined {
        return this._obj[<any>k];
    }

    has(k: K): boolean {
        return <any>k in this._obj;
    }

    set(k: K, v: V): this {
        this._keys.add(k);
        this._obj[<any>k] = v;
        return this;
    }

    get size(): number {
        return this._keys.size;
    }

    private _keys = new CompatSet<K>();
    private _obj = {};
}

class CompatSet<V> {

    add(v: V): this {
        if (this.has(v))
            return this;
        this._arr.push(v);
        return this;
    }

    clear() {
        this._arr.length = 0;
    }

    delete(v: V): boolean {
        let idx = this._arr.indexOf(v);
        if (idx == -1)
            return false;
        this._arr.splice(idx, 1);
        return true;
    }

    forEach(cb: (v: V) => void, ctx?: any) {
        this._arr.forEach(v => {
            cb.call(ctx, v);
        });
    }

    has(v: V): boolean {
        let idx = this._arr.indexOf(v);
        return idx != -1;
    }

    get size(): number {
        return this._arr.length;
    }

    private _arr: V[] = [];
}

if (typeof window['Map'] == 'undefined')
    window['Map'] = CompatMap;
window['CompatMap'] = CompatMap;

if (typeof window['Set'] == 'undefined')
    window['Set'] = CompatSet;
window['CompatSet'] = CompatSet;

