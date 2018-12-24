module nn {

    export interface IHud {
        open();

        close();

        delayClose(timeout?: number);
    }

    export class Hud extends Sprite {
        static BackgroundColor = new Color(0xffffff, 0xf0);
        static BackgroundImage: TextureSource;

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
        mode: any;

        protected instanceDesktop(): Desktop {
            let desk = new Desktop(this);
            desk.desktopLayer = CApplication.shared.desktopLayer;
            desk.backgroundColor = null;
            desk.backgroundImage = null;
            return desk;
        }

        protected _desk: Desktop;

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

        static Text(str: any, delay: number = 2): Hud {
            let hud: HudText = <any>CApplication.shared.clazzHudText.instance();
            hud.message = str;
            hud.open();
            Delay(delay, function () {
                hud.close();
            }, this);
            return hud;
        }

        static Error(str: any, delay: number = 2): Hud {
            let hud: HudText = <any>CApplication.shared.clazzHudText.instance();
            hud.message = str;
            hud.mode = false;
            hud.open();
            Delay(delay, function () {
                hud.close();
            }, this);
            return hud;
        }

        static ShowProgress(data?: any): IHudProgress {
            if (HudProgress.__hud_progress_counter++ == 0) {
                if (HudProgress.__hud_progress) {
                    // 已经打开
                } else {
                    let hud = <any>CApplication.shared.clazzHudProgress.instance();
                    hud.data = data;
                    hud.open();
                    HudProgress.__hud_progress = hud;
                }
            }
            // 重新开始计时保护用的定时器
            HudProgress.__hud_progress_closer.start();
            return HudProgress.__hud_progress;
        }

        static HideProgress(force?: boolean) {
            if (force) {
                // 下一步会关闭掉
                HudProgress.__hud_progress_counter = 1;
            }

            // 如果自减到0，代表所有的show都正常hide
            if (--HudProgress.__hud_progress_counter == 0) {
                if (HudProgress.__hud_progress) {
                    // 关闭进度框时需要关闭保护定时器
                    HudProgress.__hud_progress_closer.stop();
                    // 关闭当前的进度对话框
                    HudProgress.__hud_progress.delayClose();
                    HudProgress.__hud_progress = null;
                }
            }

            // 避免意外
            if (HudProgress.__hud_progress_counter < 0)
                HudProgress.__hud_progress_counter = 0;
        }
    }

    export interface IHudText extends IHud {
        message: string;
    }

    export class HudText extends Hud implements IHudText {
        static BackgroundColor = null;
        static BackgroundImage = null;

        constructor() {
            super();
            this.labelMessage.textColor = 0;
            this.labelMessage.textAlign = "center";
            this.addChild(this.labelMessage);
        }

        protected instanceDesktop(): Desktop {
            let desk = super.instanceDesktop();
            desk._addIntoOpening = false;
            return desk;
        }

        labelMessage = new Label();

        get message(): string {
            return this.labelMessage.text;
        }

        set message(s: string) {
            this._setMessage(s);
        }

        protected _setMessage(s: any) {
            this.labelMessage.text = s;
        }

        open() {
            super.open();
            this._desk.touchEnabled = false;
        }

        delayClose(timeout?: number) {
            this.close();
        }

        updateLayout() {
            super.updateLayout();
            this.labelMessage.frame = this.boundsForLayout();
        }

        bestFrame(inrc?: Rect): Rect {
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
        startAnimation(): void;

        /** 停止动画 */
        stopAnimation(): void;

        /** 动画状态 */
        animating: boolean;
    }

    /** 用来实现Progress的接口 */
    export interface IHudProgress extends IHud {

    }

    export class HudProgress
        extends Hud implements IProgress, IHudProgress {

        static BackgroundColor = null;
        static BackgroundImage = null;

        constructor() {
            super();
        }

        // 动画指示，必须实现 IActivity
        private _activity: CComponent;
        get activity(): CComponent {
            return this._activity;
        }

        set activity(val: CComponent) {
            if (this._activity == val)
                return;
            if (this._activity)
                this.removeChild(this._activity);
            this._activity = val;
            if (this._activity)
                this.addChild(val);
        }

        static Current(): IHudProgress {
            return HudProgress.__hud_progress;
        }

        private _progressValue = new Percentage(1, 0);
        get progressValue(): Percentage {
            return this._progressValue;
        }

        set progressValue(v: Percentage) {
            this._progressValue = v;
            this.updateData();
        }

        open() {
            super.open();

            // 记录打开的时间
            this._tmopened = DateTime.Now();

            // 执行动画
            if (this._activity)
                (<IActivity><any>this._activity).startAnimation();
        }

        close() {
            super.close();

            if (this._tmrdelayclose) {
                this._tmrdelayclose.drop();
                this._tmrdelayclose = null;
            }

            if (this._activity)
                (<IActivity><any>this._activity).stopAnimation();
        }

        // 打开的时间
        private _tmopened: number;

        // 打开的定时器
        private _tmrdelayclose: Timer;

        delayClose(timeout?: number) {
            if (timeout == null)
                timeout = HudProgress.DELAY_CLOSE;

            // 清除老的
            if (this._tmrdelayclose) {
                this._tmrdelayclose.drop();
                this._tmrdelayclose = null;
            }

            // 如果打开的时间已经超过了timeout，直接关闭
            if (DateTime.Now() - this._tmopened >= timeout) {
                this.close();
                return;
            }

            // 延迟自动关闭
            this._tmrdelayclose = Delay(timeout, this.doDelayClose, this);
        }

        private doDelayClose() {
            this._tmrdelayclose = null;
            this.close();
        }

        updateLayout() {
            super.updateLayout();
            if (this._activity)
                this._activity.frame = this.boundsForLayout();
        }

        bestFrame(inrc?: Rect): Rect {
            if (this._activity)
                return this._activity.bestFrame();
            return new Rect();
        }

        // 当前弹出的实例
        static __hud_progress: IHudProgress = null;

        // 弹出计数器
        static __hud_progress_counter = 0;

        // 避免progress因为计数器没有归0导致卡死前端逻辑
        static __hud_progress_closer = new Timer(3, 1);

        // 默认自动关闭的时间
        static DELAY_CLOSE = 0.3;
    }

    HudProgress.__hud_progress_closer.signals.connect(SignalDone, () => {
        Hud.HideProgress(true);
    }, null);

}
