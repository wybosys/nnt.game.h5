module nn {

    export class Navigation
    extends ViewStack
    {
        constructor() {
            super();
        }

        protected _addPage(page:StackPageType, aschild:boolean) {
            let p = page.obj;
            p.signals.register(SignalRequestClose);
            p.signals.connect(SignalRequestClose, ()=>{
                this.pop();
            } , this);
            super._addPage(page, aschild);
        }

        get pages():Array<StackPageType> {
            return this._views;            
        }
        set pages(v:Array<StackPageType>) {
            fatal("不能直接设置navi的pages");
        }
    }

    /** 用来进行导航的过渡特效，推进和推出 */
    export class TransitionNavigation
    extends Transition
    {
        constructor(duration:number = Animate.Duration) {
            super();

            let ani = new Animate();
            ani.autoReset = true;
            ani.inTo(duration, (ani:Animator)=>{
                ani.backMode = true;
                ani.stranslate(new Point(-1, 0));
            });
            this.appear = ani;

            ani = new Animate();
            ani.autoReset = true;
            ani.outTo(duration, (ani:Animator)=>{
                ani.stranslate(new Point(-1, 0));
            });
            this.disappear = ani;
        }
    }

    /** 淡入淡出交替的过渡特效 */
    export class TransitionFade
    extends Transition
    {
        constructor(duration:number = Animate.Duration) {
            super();

            let ani = new Animate();
            ani.autoReset = true;
            ani.inTo(duration, (ani:Animator)=>{
                ani.backMode = true;
                ani.fadeIn();
            });
            this.appear = ani;

            ani = new Animate();
            ani.autoReset = true;
            ani.outTo(duration, (ani:Animator)=>{
                ani.fadeOut();
            });
            this.disappear = ani;
        }
    }
    
}