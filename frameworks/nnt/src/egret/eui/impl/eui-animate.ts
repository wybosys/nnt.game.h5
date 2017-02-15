module eui {

    export class Animate
    {
        bind(ui:egret.DisplayObject):this {
            this._ani.bind(nn.BridgedComponent.Wrapper(ui));
            return this;
        }
        
        clone():this {
            let obj = nn.InstanceNewObject(this);
            obj._ani = this._ani.clone();
            return obj;
        }

        get tag():any {
            return this._ani.tag;
        }
        set tag(v:any) {
            this._ani.tag = v;
        }

        get hashCode():number {
            return this._ani.hashCode;
        }
        
        private _ani = new nn.Animate();

        next(props:any, duration:number, tf:Function):this {
            this._ani.next(props, duration, tf);
            return this;
        }
        
        to(duration:number, tf:Function, ani:(ani:nn.Animator)=>void, ctx?:any):this {
            this._ani.to(duration, tf, ani, ctx);
            return this;
        }
        
        then(ani:(ani:nn.Animator)=>void, ctx = null, duration = nn.CAnimate.Duration, tf:Function = null):this {
            this._ani.then(ani, ctx, duration, tf);
            return this;
        }

        stop() {
            this._ani.stop();
        }

        complete(cb:(s:nn.Slot)=>void, ctx?:any):this {
            this._ani.complete(cb, ctx);
            return this;
        }

        repeat(count:number):this {
            this._ani.repeat(count);
            return this;
        }

        play():this {
            this._ani.play();
            return this;
        }

        pause() {
            this._ani.pause();
        }

        resume() {
            this._ani.resume();
        }
    }
    
}