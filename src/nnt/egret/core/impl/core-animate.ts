module nn {

    TimeFunction.Pow = (pow:any, inout?:number):Function => {
        if (inout == TimeFunction.INOUT)
            return egret.Ease.getPowInOut(pow);
        else if (inout == TimeFunction.OUT)
            return egret.Ease.getPowOut(pow);
        return egret.Ease.getPowIn(pow);
    };

    TimeFunction.Quad = (inout?:number):Function => {
        if (inout == TimeFunction.INOUT)
            return egret.Ease.quadInOut;
        else if (inout == TimeFunction.OUT)
            return egret.Ease.quadOut;
        return egret.Ease.quadIn;
    }

    TimeFunction.Bounce = (inout?:number):Function => {
        if (inout == TimeFunction.INOUT)
            return egret.Ease.bounceInOut;
        else if (inout == TimeFunction.OUT)
            return egret.Ease.bounceOut;
        return egret.Ease.bounceIn;
    }

    TimeFunction.Elastic = (amplitude?:any, period?:any, inout?:number):Function => {
        if (amplitude == null && period == null) {
            if (inout == TimeFunction.INOUT)
                return egret.Ease.elasticInOut;
            else if (inout == TimeFunction.OUT)
                return egret.Ease.elasticOut;
            return egret.Ease.elasticIn;
        }
        if (inout == TimeFunction.INOUT)
            return egret.Ease.getElasticInOut(amplitude, period);
        else if (inout == TimeFunction.OUT)
            return egret.Ease.getElasticOut(amplitude, period);
        return egret.Ease.getElasticIn(amplitude, period);
    };

    TimeFunction.Circ = (inout?:number):Function => {
        if (inout == TimeFunction.INOUT)
            return egret.Ease.circInOut;
        else if (inout == TimeFunction.OUT)
            return egret.Ease.circOut;
        return egret.Ease.circIn;
    }
    
    TimeFunction.Back = (amount?:number, inout?:number):Function => {
        if (amount == null) {
            if (inout == TimeFunction.INOUT)
                return egret.Ease.backInOut;
            else if (inout == TimeFunction.OUT)
                return egret.Ease.backOut;
            return egret.Ease.backIn;
        }
        
        if (inout == TimeFunction.INOUT)
            return egret.Ease.getBackInOut(amount);
        else if (inout == TimeFunction.OUT)
            return egret.Ease.getBackOut(amount);
        return egret.Ease.getBackIn(amount);
    }

    interface DAnimateStep
    {
        preprops:{}; // 变化前
        props:{}; // 变化后
        duration?:number; // 持续时间
        time:Function; // 时间函数
        payload?:any; // 附加数据
        workfun?:Function; // 启动的中间函数
        workctx?:any; // 中间函数的上下文
        opt?:any;
    }

    export class Animate
    extends CAnimate
    {
        constructor() {
            super();
        }

        dispose() {
            super.dispose();
        }
        
        bind(tgt:CComponent):this {
            this._targets.add(tgt.handle());
            return this;
        }

        unbind(tgt:CComponent) {
            this._targets.delete(tgt.handle());
        }

        unbindAll() {
            nn.SetT.Clear(this._targets);
        }
        
        clear() {
            this.stop();
            nn.ArrayT.Clear(this._steps);
            return this;
        }

        stop() {
            this._targets.forEach((o:egret.DisplayObject):boolean=>{
                egret.Tween.removeTweens(o);
                return true;
            });
        }
        
        next(props:any, duration:number, tf?:Function):this {
            this._steps.push({preprops:{}, props:props, duration:duration, time:tf});
            return this;
        }

        to(duration:number, tf:Function, cb:(animator:Animator)=>void, ctx?:any):this {
            var a = new Animator();
            cb.call(ctx, a);
            this._steps.push({preprops:a._preproperties, props:a._properties, duration:duration, time:tf});
            return this;
        }

        wait(duration:number, passive?:boolean):this {
            this._steps.push({preprops:{}, props:{}, duration:duration, time:null, opt:passive});
            return this;
        }

        invoke(fun:Function, ctx?:any):this {
            this._steps.push({preprops:{}, props:{}, workfun:fun, workctx:ctx, time:null});
            return this;
        }

        private __ani_ended = 0;
        protected _doPlay(reverse:boolean) {
            var self = this;
            self.__ani_ended = 0;
            // 动画每一步
            self._targets.forEach((ui:egret.DisplayObject) => {
                var tw = egret.Tween.get(ui, {'loop':self.count < 1 });
                
                self._steps.forEach((step:DAnimateStep)=>{
                    var pprops:any = step.preprops;
                    var props:any = step.props;

                    // 设置旧值
                    var cntpprops = nn.MapT.Length(pprops);
                    if (cntpprops) {
                        var sets = {};
                        nn.MapT.Foreach(pprops, (k:any, v:any):boolean=>{
                            if (reverse)
                                v = -v;
                            switch (k) {
                            case 'dx': sets['x'] = ui.x + v * ScaleFactorW; break;
                            case 'dy': sets['y'] = ui.y + v * ScaleFactorH; break;
                            case 'dsx': sets['scaleX'] = ui.scaleX + v; break;
                            case 'dsy': sets['scaleY'] = ui.scaleY + v; break;
                            case 'dxs': sets['x'] = ui.x + ui.width * v; break;
                            case 'dys': sets['y'] = ui.y + ui.height * v; break;
                            case 'alpha': sets['alpha'] = v; break;
                            case 'dangle': sets['rotation'] = ui.rotation + v; break;
                            default: sets[k] = ui[k] + v; break;
                            }
                            return true;
                        });
                        tw.to(sets, 0, null);
                    }

                    // 设置新值
                    var cntprops = nn.MapT.Length(props);
                    if (cntprops) {
                        var sets = {};
                        nn.MapT.Foreach(props, (k:any, v:any):boolean=>{
                            if (reverse)
                                v = -v;
                            switch (k) {
                            case 'x': sets['x'] = v * ScaleFactorX + ui.anchorOffsetX; break;
                            case 'y': sets['y'] = v * ScaleFactorY + ui.anchorOffsetY; break;
                            case 'dx': sets['x'] = ui.x + v * ScaleFactorW; break;
                            case 'dy': sets['y'] = ui.y + v * ScaleFactorH; break;
                            case 'dsx': sets['scaleX'] = ui.scaleX + v; break;
                            case 'dsy': sets['scaleY'] = ui.scaleY + v; break;
                            case 'dxs': sets['x'] = ui.x + ui.width * v; break;
                            case 'dys': sets['y'] = ui.y + ui.height * v; break;
                            case 'alpha': sets['alpha'] = v; break;
                            case 'dangle': sets['rotation'] = ui.rotation + v; break;
                            default: sets[k] = v; break;
                            }
                            return true;
                        }, this);
                        tw.to(sets, step.duration * 1000, step.time);
                    }

                    if (cntpprops == 0 && cntprops == 0)
                    {
                        if (step.duration) {
                            // 如过都是空的，代表等待
                            tw.wait(step.duration * 1000, step.opt);
                        } else if (step.workfun) {
                            // 代表中途回调
                            step.workfun.call(step.workctx);
                        }
                    }

                    // 自动恢复
                    if (self.autoReset && cntprops) {
                        var sets = {};
                        nn.MapT.Foreach(props, (k:any, v:any):boolean=>{
                            switch (k) {
                            case 'dx': sets['x'] = ui.x; break;
                            case 'dy': sets['y'] = ui.y; break;
                            case 'dsx': sets['scaleX'] = ui.scaleX; break;
                            case 'dsy': sets['scaleY'] = ui.scaleY; break;
                            case 'dxs': sets['x'] = ui.x; break;
                            case 'dys': sets['y'] = ui.y; break;
                            case 'alpha': sets['alpha'] = ui.alpha; break;
                            case 'dangle': sets['rotation'] = ui.rotation; break;
                            default: sets[k] = ui[v]; break;
                            }
                            return true;
                        }, this);
                        tw.to(sets, 0, null);
                    }

                    // end for each tw & target
                }, this);
                
                // 监听结束
                tw.call((o:[egret.Tween, any])=>{                    
                    if (++self.__ani_ended == self._targets.size) {
                        // 重置计数器
                        self.__ani_ended = 0;
                        
                        // 一批动画结束
                        self._signals && self._signals.emit(SignalEnd);                            
                        // 一次动画都结束了
                        if (self.count > 0) {                            
                            if (++self._firedCount >= self.count)
                            {
                                // 释放所有动画
                                self.stop();
                                
                                // 激发结束
                                self._signals && self._signals.emit(SignalDone);
                                
                                // 检查一下是否需要释放
                                if (self.autoUnbind)
                                    self.unbindAll();
                                if (self.autoDrop)
                                    self = drop(self);
                            }
                            else
                            {
                                // 播放下一次
                                self._doPlay(reverse);
                            }
                        }
                    }
                }, self, [ui]);
            }, self);
        }

        play(reverse?:boolean):this {
            let self = this;
            self._firedCount = 0;

            let mark = false;
            // 如果存在对象和步数代表可以动画
            if (self._targets.size != 0 || self._steps.length != 0) {
                self._doPlay(reverse);
                mark = true;
            }
            
            // 如果存在命中的动画需要抛出开始事件
            if (mark && self._signals)
                self._signals.emit(SignalStart);

            return self;
        }

        private _paused = false;
        pause() {
            if (this._paused)
                return;
            this._paused = true;
            this._targets.forEach((o:egret.DisplayObject)=>{
                egret.Tween.pauseTweens(o);
            });
        }

        resume() {
            if (this._paused == false)
                return;
            this._paused = false;
            this._targets.forEach((o:egret.DisplayObject)=>{
                egret.Tween.resumeTweens(o);
            });            
        }

        isPaused():boolean {
            return this._paused;
        }

        clone():this {
            var obj:any = super.clone();
            obj._targets = nn.SetT.Clone(this._targets);            
            obj._steps = nn.ArrayT.Clone(this._steps);
            return obj;
        }

        // uiobj
        private _targets = new CSet<egret.DisplayObject>();
        // 变化前、变化后、持续、时间函数、附加数据
        private _steps = new Array<DAnimateStep>();

        static Stop(tgt:CComponent) {
            egret.Tween.removeTweens(tgt.handle());
        }
    }

    export class Tween
    extends CTween
    {
        static Get(c:CComponent, props?:any):egret.Tween {
            return egret.Tween.get(c.handle(), props);
        }

        static Stop(c:CComponent) {
            egret.Tween.removeTweens(c.handle());
        }
    }    

    /** 同时播放一堆动画 */
    export class Animates
    extends SObject
    {
        constructor() {
            super();
        }

        dispose() {
            super.dispose();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalDone);
        }
        
        add(ani:CAnimate):this {
            this._list.push(ani);
            ani.signals.connect(SignalDone, this._cb_aniend, this);
            return this;
        }
        
        play():this {
            this._counter = 0;
            this._list.forEach((ani:CAnimate)=>{
                ani.play();
            });
            return this;
        }
        
        complete(cb:()=>void, ctx?:any):this {
            this.signals.connect(SignalDone, cb, ctx);
            return this;
        }
        
        private _counter:number;
        private _cb_aniend() {
            if (++this._counter != this._list.length)
                return;
            this.signals.emit(SignalDone);
        }
        
        private _list = new Array<CAnimate>();
    }

    /** 用来接管一组的动画 */
    export class AnimateGroup
    extends SObject
    {        
        constructor() {
            super();
        }

        dispose() {
            this.clear();
            super.dispose();
        }
        
        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalDone);
        }
        
        /** 同时播放 */
        add(ani:CAnimate):this {
            this._current().add(ani);
            return this;
        }

        /** 之后播放 */
        next(ani:CAnimate):this {
            this._next().add(ani);
            return this;
        }

        /** 播放动画组 */
        play():this {
            if (this._animates.length == 0) {
                this._signals && this._signals.emit(SignalDone);
                this.drop();
                return;
            }
            
            let first = this._animates[0];
            let last = this._animates[this._animates.length - 1];
            last.complete(()=>{
                this._signals && this._signals.emit(SignalDone);
                this.drop();
            }, this);
            first.play();
            return this;
        }

        complete(cb:()=>void, ctx?:any):this {
            this.signals.connect(SignalDone, cb, ctx);
            return this;
        }

        clear() {
            ArrayT.Clear(this._animates, (as:Animates)=>{
                as.drop();
            });
        }

        protected _current():Animates {
            if (this.__current)
                return this.__current;
            this.__current = new Animates();
            this._animates.push(this.__current);
            return this.__current;
        }

        protected _next():Animates {
            let old = this.__current;
            this.__current = new Animates();
            if (old)
                old.complete(this.__current.play, this.__current);
            this._animates.push(this.__current);
            return this.__current;
        }

        private __current:Animates;
        private _animates = new Array<Animates>();
    }

    /** 多个UI之间的过渡动画
     */
    export class Transition
    extends SObject
    implements ITransition
    {
        constructor(a?:CAnimate, d?:CAnimate) {
            super();            
            this.appear = a;
            this.disappear = d;
        }

        dispose() {
            this.appear = undefined;
            this.disappear = undefined;
            super.dispose();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalDone);
        }

        /** 反转 */
        reverse:boolean;
        
        appear:CAnimate;        
        disappear:CAnimate;
        
        play(appear:CComponent, disappear:CComponent) {
            this._ani_step = 0;
            this._ani_cnt = 0;

            // 先修改成直接play，而不是把play合到一个地方，简化一下写法，业务中如过用到了transition，一般是不是播放一个0持续的动画
            if (this.appear && appear) {
                ++this._ani_cnt;
                let ani = this.appear.clone();
                ani.signals.connect(SignalDone, this.__cbani_end, this);
                ani.bind(appear).play(this.reverse);
            }
            
            if (this.disappear && disappear) {
                ++this._ani_cnt;
                let ani = this.disappear.clone();
                ani.signals.connect(SignalDone, this.__cbani_end, this);
                ani.bind(disappear).play(this.reverse);
            }
            
            // 没有可用的动画直接代表完成
            if (this._ani_cnt == 0) {
                this.signals.emit(SignalDone);

                // 完成即释放
                this.drop();
            }
        }

        private _ani_step:number = 0;
        private _ani_cnt:number  = 0;
        private __cbani_end() {
            ++this._ani_step;
            if (this._ani_step == this._ani_cnt)
            {
                // 释放绑定的动画的链接
                if (this.appear) {                    
                    this.appear.signals.disconnect(SignalDone, this.__cbani_end, this);
                    this.appear.unbindAll();
                }
                if (this.disappear) {
                    this.disappear.signals.disconnect(SignalDone, this.__cbani_end, this);
                    this.disappear.unbindAll();
                }
                
                // 完成所有的动画
                this.signals.emit(SignalDone);
                
                // 完成即释放
                this.drop();
            }
        }
    }
}
