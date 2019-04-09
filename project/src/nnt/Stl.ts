// 提供一个类型，用来声明利用Object来模拟Map的类型
// ps：当KvObject位于nn空间内，egret4.0.1编译出的代码会漏掉nn名域，所以干错KvObject暴露到全局
module nn {

    declare let Map;
    declare let Set;
    export let ECMA6_NATIVE: boolean = true;
    if (typeof (Map) == 'function')
        ECMA6_NATIVE = false;

    export class CMap<K, V> {

        constructor() {
            if (ECMA6_NATIVE)
                this._imp = new Map();
            else
                this._imp = {};
        }

        private _imp: any;

        private _n_clear() {
            this._imp.clear();
        }

        private _i_clear() {
            this._imp = {};
        }

        clear: () => void = ECMA6_NATIVE ? this._n_clear : this._i_clear;

        private _n_delete(k: K) {
            this._imp.delete(k);
        }

        private _i_delete(k: K) {
            delete this._imp[<any>k];
        }

        delete: (k: K) => void = ECMA6_NATIVE ? this._n_delete : this._i_delete;

        private _n_foreach(cb: (v: V, k: K) => void, ctx?: any) {
            this._imp.forEach((v: V, k: K) => {
                cb.call(ctx, v, k);
            });
        }

        private _i_foreach(cb: (v: V, k: K) => void, ctx?: any) {
            let ks = Object.keys(this._imp);
            ks.forEach(function (k) {
                cb.call(ctx, this._imp[k], k);
            }, this);
        }

        forEach: (cb: (v: V, k: K) => void, ctx?: any) => void = ECMA6_NATIVE ? this._n_foreach : this._i_foreach;

        private _n_has(k: K): boolean {
            return this._imp.has(k);
        }

        private _i_has(k: K): boolean {
            return this._imp.hasOwnProperty(<any>k);
        }

        has: (k: K) => boolean = ECMA6_NATIVE ? this._n_has : this._i_has;

        private _n_length(): number {
            return this._imp.size;
        }

        private _i_length(): number {
            return Object.keys(this._imp).length;
        }

        get length(): number {
            return ECMA6_NATIVE ? this._n_length() : this._i_length();
        }

        get size(): number {
            return this.length;
        }

        private _n_set(k: K, v: V) {
            this._imp.set(k, v);
        }

        private _i_set(k: K, v: V) {
            this._imp[<any>k] = v;
        }

        set: (k: K, v: V) => void = ECMA6_NATIVE ? this._n_set : this._i_set;

        private _n_get(k: K): V {
            return this._imp.get(k);
        }

        private _i_get(k: K): V {
            return this._imp[<any>k];
        }

        get: (k: K) => V = ECMA6_NATIVE ? this._n_get : this._i_get;
    }


    export class CSet<V> {

        constructor() {
            if (ECMA6_NATIVE) {
                this._imp = new Set();
            } else {
                this._map = new CMap<any, V>();
                this._arr = new Array<V>();
            }
        }

        private _imp: any;
        private _map: CMap<any, V>;
        private _arr: Array<V>;

        private _n_add(o: V): boolean {
            return this._imp.add(o);
        }

        private _i_add(o: V): boolean {
            let k = js.hashKey(o);
            if (this._map[k] != undefined)
                return false;
            this._map[k] = true;
            this._arr.push(o);
            return true;
        }

        add: (o: V) => boolean = ECMA6_NATIVE ? this._n_add : this._i_add;

        private _n_has(o: V): boolean {
            return this._imp.has(o);
        }

        private _i_has(o: V): boolean {
            let k = js.hashKey(o);
            return this._map[k] != undefined;
        }

        has: (o: V) => boolean = ECMA6_NATIVE ? this._n_has : this._i_has;

        private _n_delete(o: V): boolean {
            return this._imp.delete(o);
        }

        private _i_delete(o: V): boolean {
            let k = js.hashKey(o);
            if (this._map[k] == undefined)
                return false;
            this._map.delete(k);
            let idx = this._arr.indexOf(o);
            this._arr.splice(idx, 1);
            return true;
        }

        delete: (o: V) => boolean = ECMA6_NATIVE ? this._n_delete : this._i_delete;

        private _n_size(): number {
            return this._imp.size;
        }

        private _i_size(): number {
            return this._arr.length;
        }

        get size(): number {
            return ECMA6_NATIVE ? this._n_size() : this._i_size();
        }

        private _n_clear() {
            this._imp.clear();
        }

        private _i_clear() {
            if (this._arr.length) {
                this._map.clear();
                this._arr.length = 0;
            }
        }

        clear: () => void = ECMA6_NATIVE ? this._n_clear : this._i_clear;

        private _n_foreach(cb: (o: V) => void, ctx?: any) {
            this._imp.forEach(cb, ctx);
        }

        private _i_foreach(cb: (o: V) => void, ctx?: any) {
            if (this._arr.length)
                this._arr.forEach(cb, ctx);
        }

        forEach: (cb: (o: V) => void, ctx?: any) => void = ECMA6_NATIVE ? this._n_foreach : this._i_foreach;
    }

    /** 使用索引的 map，可以按照顺序来获取元素 */
    export class IndexedMap<K, T> {
        constructor() {
        }

        /** 添加 */
        add(k: K, v: T) {
            if (<any>k in this._map) {
                let idx = this._keys.indexOf(k);
                this._keys[idx] = k;
                this._vals[idx] = v;
            } else {
                this._keys.push(k);
                this._vals.push(v);
            }

            this._map[<any>k] = v;
        }

        /** 替换 */
        replace(k: K, v: T) {
            if (<any>k in this._map) {
                let idx = this._keys.indexOf(k);
                this._vals[idx] = v;
            } else {
                this._keys.push(k);
                this._vals.push(v);
            }

            this._map[<any>k] = v;
        }

        /** 删除 */
        remove(k: K): T {
            if (!(<any>k in this._map))
                return null;

            // k和v是1-1，所以indexOfKey和indexOfVal一致
            let idx = this._keys.indexOf(k);
            let val = this._vals[idx];
            ArrayT.RemoveObjectAtIndex(this._keys, idx);
            ArrayT.RemoveObjectAtIndex(this._vals, idx);

            delete this._map[<any>k];
            return val;
        }

        /** 获得大小 */
        get length(): number {
            return this._keys.length;
        }

        /** 清空 */
        clear() {
            this._keys.length = 0;
            this._vals.length = 0;
            this._map = {};
        }

        /** 遍历 */
        forEach(cb: (v: T, k: K) => void) {
            this._keys.forEach((k: K, idx: number) => {
                let v = this._vals[idx];
                cb(v, k);
            }, this);
        }

        iterateEach(cb: (v: T, k: K) => boolean) {
            for (let i = 0, len = this._keys.length; i < len; ++i) {
                let k = this._keys[i];
                let v = this._vals[i];
                if (!cb(v, k))
                    break;
            }
        }

        /** 是否存在k */
        contains(k: K): boolean {
            return <any>k in this._map;
        }

        /** 取得k的下标 */
        indexOfKey(k: K): number {
            return this._keys.indexOf(k);
        }

        /** 使用下标取得数据 */
        objectForKey(k: K): T {
            return this._map[<any>k];
        }

        objectForIndex(idx: number): T {
            let k: any = this._keys[idx];
            return this._map[k];
        }

        keyForIndex(idx: number): K {
            return this._keys[idx];
        }

        get keys(): Array<K> {
            return this._keys.concat();
        }

        get values(): Array<T> {
            return this._vals;
        }

        private _map = {};
        private _keys = new Array<K>();
        private _vals = new Array<T>();
    }

    export class IndexedMapT {

        static RemoveObjectByFilter<K, T>(map: IndexedMap<K, T>, filter: (v: T, k: K) => boolean): [K, T] {
            let keys = map.keys;
            for (let i = 0, len = keys.length; i < len; ++i) {
                let k = keys[i];
                let v = map.objectForKey(k);
                if (filter(v, k)) {
                    map.remove(k);
                    return [k, v];
                }
            }
            return null;
        }

        static RemoveObjectsByFilter<K, T>(map: IndexedMap<K, T>, filter: (v: T, k: K) => boolean): Array<[K, T]> {
            let r = new Array<[K, T]>();
            let keys = map.keys;
            for (let i = 0, len = keys.length; i < len; ++i) {
                let k = keys[i];
                let v = map.objectForKey(k);
                if (filter(v, k)) {
                    map.remove(k);
                    r.push([k, v]);
                }
            }
            return r;
        }

        static QueryObject<K, T>(map: IndexedMap<K, T>, query: (v: T, k: K) => boolean): T {
            let keys = map.keys;
            for (let i = 0, len = keys.length; i < len; ++i) {
                let k = keys[i];
                let v = map.objectForKey(k);
                if (query(v, k))
                    return v;
            }
            return null;
        }

        static Convert<K, T, V>(arr: Array<V>, convert: (v: V) => [K, T]): IndexedMap<K, T> {
            let r = new IndexedMap<K, T>();
            arr.forEach((e: V) => {
                let o = convert(e);
                r.add(o[0], o[1]);
            });
            return r;
        }
    }

    /** 多索引map */
    export class MultiMap<K, V> {
        add(k: K, v: V): this {
            let arr = this._map.objectForKey(k);
            if (arr == null) {
                arr = new Array<V>();
                this._map.add(k, arr);
            }
            arr.push(v);
            return this;
        }

        set(k: K, vs: V[]): this {
            this._map.add(k, vs);
            return this;
        }

        replace(k: K, v: Array<V>) {
            this._map.replace(k, v);
        }

        objectForKey(k: K): V[] {
            return this._map.objectForKey(k);
        }

        remove(k: K): V[] {
            return this._map.remove(k);
        }

        forEach(proc: (arr: V[], k: K) => void) {
            this._map.forEach(proc);
        }

        iterateEach(proc: (arr: V[], k: K) => boolean) {
            this._map.iterateEach(proc);
        }

        get keys(): Array<K> {
            return this._map.keys;
        }

        private _map = new IndexedMap<K, Array<V>>();
    }

    // 步进array，每次取，均从上一次的下一个开始
    export class StepArray<T> {

        constructor(arr: T[] = []) {
            this._arr = arr;
        }

        push(v: T): this {
            this._arr.push(v);
            return this;
        }

        get position(): number {
            return this._cur;
        }

        set position(pos: number) {
            this._cur = pos % this._arr.length;
        }

        moveto(pos: number): this {
            this.position = pos;
            return this;
        }

        at(idx: number): T {
            this._cur = idx % this._arr.length;
            return this.get();
        }

        get(): T {
            let r = this._arr[this._cur];
            if (++this._cur == this._arr.length)
                this._cur = 0;
            return r;
        }

        get length(): number {
            return this._arr.length;
        }

        clear() {
            this._arr.length = 0;
        }

        clone(): StepArray<T> {
            let r = new StepArray<T>();
            r._arr = this._arr.concat();
            r._cur = this._cur;
            return r;
        }

        reverse(): this {
            this._arr.reverse();
            return this;
        }

        forEach(proc: (v: T, idx?: number) => void) {
            this._arr.forEach(proc);
        }

        valueOf(): T[] {
            return this._arr;
        }

        private _cur: number = 0;
        private _arr: T[];
    }
}
