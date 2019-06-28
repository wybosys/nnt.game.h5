module nn {

    export abstract class Matrix<T> {

        constructor(def?: T) {
            this._def = def;
        }

        get dim(): number {
            return 1;
        }

        get size(): number {
            return this._arr.length;
        }

        protected _reset(d: number, def: T) {
            this._arr.length = d;
            for (let i = 0; i < d; ++i) {
                this._arr[i] = this._def;
            }
        }

        reset(v: T): this {
            this._reset(this.size, v);
            return this;
        }

        toArray(): T[] {
            return this._arr.concat();
        }

        copyFrom(arr: T[]): this {
            const llen = this._arr.length;
            const rlen = arr.length;
            const mlen = llen < rlen ? llen : rlen;
            for (let i = 0; i < mlen; ++i) {
                this._arr[i] = arr[i];
            }
            if (rlen < llen) {
                for (let i = rlen; i < llen; ++i) {
                    this._arr[i] = this._def;
                }
            }
            return this;
        }

        protected _arr: T[] = [];
        protected _def: T;
    }

    export class Matrix1<T> extends Matrix<T> {

        constructor(d: number, def?: T) {
            super(def);
            this._d = d;
            this._reset(d, def);
        }

        at(idx: number): T {
            return this._arr[idx];
        }

        forEach(proc: (v: T, idx: number) => void) {
            this._arr.forEach(proc);
        }

        protected _d: number;
    }

    export class Matrix2<T> extends Matrix<T> {

        constructor(dx: number, dy: number, def?: T) {
            super();
            this._dx = dx;
            this._dy = dy;
            this._reset(dx * dy, def);
        }

        at(x: number, y: number): T {
            return this._arr[y * this._dx + x];
        }

        forEach(proc: (v: T, x: number, y: number) => void) {
            for (let y = 0; y < this._dy; ++y) {
                for (let x = 0; y < this._dx; ++x) {
                    proc(this._arr[y * this._dx + x], x, y);
                }
            }
        }

        get dim(): number {
            return 2;
        }

        private _dx: number;
        private _dy: number;
    }
}
