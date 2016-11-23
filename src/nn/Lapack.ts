module nn {

    export class Vector2d
    extends Point
    {
        applyTransform(tfm:Transform2d):this {
            (<any>tfm)._mat.transformPoint(this.x, this.y, this);
            return this;
        }
    }

    export class Rect2d
    extends Rect
    {
        applyTransform(tfm:Transform2d):this {
            let pt = new Vector2d(this.x, this.y);
            pt.applyTransform(tfm);
            this.x = pt.x;
            this.y = pt.y;
            return this;
        }
    }

    // 放射变换
    export class Transform2d
    {
        scale(vec:Vector2d):this {
            this._mat.scale(vec.x, vec.y);
            return this;
        }
        
        rotate(ang:Angle):this {
            this._mat.rotate(ang.rad);
            return this;
        }

        translate(vec:Vector2d):this {
            this._mat.translate(vec.x, vec.y);
            return this;
        }

        invert():this {
            this._mat.invert();
            return this;
        }

        identity():this {
            this._mat.identity();
            return this;
        }
        
        protected _mat = new egret.Matrix();
    }

    export class Vector3d
    {
        constructor(x = 0, y = 0, z = 0, w = 1) {
            this._v[0] = x;
            this._v[1] = y;
            this._v[2] = z;
            this._v[3] = w;
        }
        
        get x():number {
            return this._v[0];
        }
        set x(v:number) {
            this._v[0] = v;
        }

        get y():number {
            return this._v[1];
        }
        set y(v:number) {
            this._v[1] = v;
        }

        get z():number {
            return this._v[2];
        }
        set z(v:number) {
            this._v[2] = v;
        }

        get w():number {
            return this._v[3];
        }
        set w(v:number) {
            this._v[3] = v;
        }
        
        protected _v:number[];
    }
    
    // 4元组变换
    export class Transform3d
    {
    }    
}