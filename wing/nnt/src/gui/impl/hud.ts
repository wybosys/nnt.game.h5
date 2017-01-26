module nn {

    export class Hud
    extends Sprite
    {
        static BackgroundColor = new Color(0xffffff, 0xf0);
        static BackgroundImage:TextureSource;
        
        constructor() {
            super();

            if (ObjectClass(this).BackgroundColor)
                this.backgroundColor = ObjectClass(this).BackgroundColor;
            if (ObjectClass(this).BackgroundImage)
                this.backgroundImage = ObjectClass(this).BackgroundImage;
            
            this.edgeInsets = new EdgeInsets(30, 30, 30, 30);
            this.visible = false;
        }

        onAppeared() {
            super.onAppeared();
            this.visible = true;
        }

        // 提供业务层用来绑定数据
        mode:any;

        protected instanceDesktop():Desktop {
            let desk = new Desktop(this);
            desk.desktopLayer = CApplication.shared.desktopLayer;
            desk.backgroundColor = null;
            desk.backgroundImage = null;
            return desk;
        }

        protected _desk:Desktop;
        open() {
            if (this._desk)
                return;
            this._desk = this.instanceDesktop();
            this._desk.open();
        }

        close() {
            if (!this._desk)
                return;
            this._desk.close();
            this._desk = null;
        }
        
        static Text(str:any, delay:number = 2):Hud {
            let hud:HudText = <any>CApplication.shared.clazzHudText.instance();
            hud.message = str;
            hud.open();
            Delay(delay, function() {
                hud.close();
            }, this);
            return hud;
        }
        
        static Error(str:any, delay:number = 2):Hud {
            let hud:HudText = <any>CApplication.shared.clazzHudText.instance();
            hud.message = str;
            hud.mode = false;
            hud.open();
            Delay(delay, function() {
                hud.close();
            }, this);
            return hud;
        }

        static ShowProgress():Hud {
            HudProgress.__hud_progress_counter += 1;
            if (HudProgress.__hud_progress) {
                HudProgress.__hud_progress.open();
                return;
            }
            let hud:HudProgress = <any>CApplication.shared.clazzHudProgress.instance();
            hud.open();
            return hud;
        }

        static HideProgress() {
            HudProgress.__hud_progress_counter -= 1;
            if (HudProgress.__hud_progress_counter == 0) {
                HudProgress.__hud_progress.delayClose();
            }
            if (ISDEBUG && HudProgress.__hud_progress_counter < 0) {
                fatal("HudProgress 的计数器 <0， 正常逻辑下必须 >=0，可能执行了不匹配的 Show/Hide 过程");
            }
        }
    }

    export class HudText
    extends Hud
    {
        static BackgroundColor = null;
        static BackgroundImage = null;

        constructor() {
            super();
            this.labelMessage.textColor = 0;
            this.labelMessage.textAlign = "center";
            this.addChild(this.labelMessage);
        }

        protected instanceDesktop():Desktop {
            let desk = super.instanceDesktop();
            desk._addIntoOpening = false;
            return desk;
        }

        labelMessage = new Label();

        get message():string {
            return this.labelMessage.text;
        }
        set message(s:string) {
            this._setMessage(s);
        }
        
        protected _setMessage(s:any) {
            this.labelMessage.text = s;
        }
        
        open() {
            super.open();
            this._desk.touchEnabled = false;
        }

        updateLayout() {
            super.updateLayout();
            this.labelMessage.frame = this.boundsForLayout();
        }

        bestFrame(inrc?:Rect):Rect {
            let w = StageBounds.width * 0.9; //业务中还是希望文字可用区域宽一些
            //let w = StageBounds.width * 0.617;
            //let h = StageBounds.height * 0.617;
            //let bsz = Font.sizeFitString(this.labelMessage.text, this.labelMessage.fontSize, w, 0, this.labelMessage.lineSpacing);
            //w = Math.min(bsz.width, w);
            //h = Math.min(bsz.height, h);
            let bsz = this.labelMessage.bestFrame(new Rect(0, 0, w, 0));
            //return new Rect(0, 0, w, h).unapplyEdgeInsets(this.edgeInsets);
            bsz = bsz.unapplyEdgeInsets(this.edgeInsets);
            bsz.x = bsz.y = 0; // unei会引起偏移
            return bsz;
        }
    }

    /** 用来显示活动状态的接口 */
    export interface IActivity {
        /** 开始动画 */
        startAnimation():void;
        
        /** 停止动画 */
        stopAnimation():void;
        
        /** 动画状态 */
        animating:boolean;
    }   

    export class HudProgress
    extends Hud
    implements IProgress
    {
        static BackgroundColor = null;
        static BackgroundImage = null;
        
        constructor() {
            super();
        }

        // 动画指示，必须实现 IActivity
        private _activity:CComponent;
        get activity():CComponent {
            return this._activity;
        }
        set activity(val:CComponent) {
            if (this._activity == val)
                return;
            if (this._activity)
                this.removeChild(this._activity);
            this._activity = val;
            if (this._activity)                
                this.addChild(val);
        }

        static Current():HudProgress {
            return HudProgress.__hud_progress;
        }

        private _progressValue = new Percentage(1, 0);
        get progressValue():Percentage {
            return this._progressValue;
        }
        set progressValue(v:Percentage) {
            this._progressValue = v;
            this.updateData();
        }
        
        open() {
            if (this.__tmrdc) {
                egret.clearTimeout(this.__tmrdc);
                this.__tmrdc = 0;
            }
            
            if (HudProgress.__hud_progress)
                return;
            
            HudProgress.__hud_progress = this;            
            super.open();
            this.__tmropen = egret.getTimer();

            if (this._activity)
                (<IActivity><any>this._activity).startAnimation();
        }

        close() {
            super.close();
            if (HudProgress.__hud_progress == this)
                HudProgress.__hud_progress = null;

            if (this._activity)
                (<IActivity><any>this._activity).stopAnimation();
        }

        private __tmropen:number;
        private __tmrdc:number;
        delayClose(timeout:number = 0.3) {
            if (this.__tmrdc)
                egret.clearTimeout(this.__tmrdc);
            
            if ((egret.getTimer() - this.__tmropen) * 0.001 > timeout) {
                this.close();
                return;
            }
            
            this.__tmrdc = egret.setTimeout(this.doDelayClose, this, timeout * 1000);
        }

        private doDelayClose() {
            egret.clearTimeout(this.__tmrdc);
            this.__tmrdc = 0;
            this.close();
        }

        updateLayout() {
            super.updateLayout();
            if (this._activity)
                this._activity.frame = this.boundsForLayout();
        }
        
        bestFrame(inrc?:Rect):Rect {
            if (this._activity)
                return this._activity.bestFrame();
            return new Rect();
        }

        static __hud_progress:HudProgress = null;
        static __hud_progress_counter = 0;
    }
    
}
