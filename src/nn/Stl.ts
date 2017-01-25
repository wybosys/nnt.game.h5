module nn {

    declare var Map;
    declare var Set;
    var ECMA6_NATIVE:boolean = true;
    if (typeof(Map) == 'undefined')
        ECMA6_NATIVE = false;

    export class CMap <K, V> {

        constructor() {
            if (ECMA6_NATIVE)
                this._imp = new Map();
            else
                this._imp = {};
        }

        private _imp:any;

        private _n_clear() {
            this._imp.clear();
        }

        private _i_clear() {
            this._imp = {};
        }

        clear:()=>void = ECMA6_NATIVE ? this._n_clear : this._i_clear;        

        private _n_delete(k:K) {
            this._imp.delete(k);
        }

        private _i_delete(k:K) {
            delete this._imp[<any>k];
        }

        delete:(k:K)=>void = ECMA6_NATIVE ? this._n_delete : this._i_delete;
        
        private _n_foreach(cb:(k:K, v:V)=>void, ctx?:any) {
            this._imp.forEach((v:V, k:K)=>{
                cb.call(ctx, k, v);
            });
        }

        private _i_foreach(cb:(k:K, v:V)=>void, ctx?:any) {
            var ks = Object.keys(this._imp);
            ks.forEach(function(k) {
                cb.call(ctx, k, this._imp[k]);
            }, this);            
        }

        forEach:(cb:(k:K, v:V)=>void, ctx?:any)=>void = ECMA6_NATIVE ? this._n_foreach : this._i_foreach;

        private _n_has(k:K):boolean {
            return this._imp.has(k);
        }

        private _i_has(k:K):boolean {
            return this._imp.hasOwnProperty(<any>k);
        }

        has:(k:K)=>boolean = ECMA6_NATIVE ? this._n_has : this._i_has;

        private _n_length():number {
            return this._imp.size;
        }

        private _i_length():number {
            return Object.keys(this._imp).length;
        }
        
        get length():number {
            return ECMA6_NATIVE ? this._n_length() : this._i_length();
        }

        private _n_set(k:K, v:V) {
            this._imp.set(k, v);
        }

        private _i_set(k:K, v:V) {
            this._imp[<any>k] = v;
        }

        set:(k:K, v:V)=>void = ECMA6_NATIVE ? this._n_set : this._i_set;
        
        private _n_get(k:K):V {
            return this._imp.get(k);
        }

        private _i_get(k:K):V {
            return this._imp[<any>k];
        }

        get:(k:K)=>V = ECMA6_NATIVE ? this._n_get : this._i_get;        
    }


}
