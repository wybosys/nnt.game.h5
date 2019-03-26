module nn {

    export interface IHud {

        // 打开
        open();

        // 关闭
        close();

        // 延迟关闭
        delayClose(timeout?: number);
    }

    export abstract class Hud {

        // 浮窗显示文字
        static Text(str: any, delay: number = 2): Hud {
            let hud: IHudText = <any>CApplication.shared.clazzHudText.instance();
            hud.data = str;
            hud.textType = HudTextType.TEXT;
            hud.open();
            Delay(delay, () => {
                hud.close();
            });
            return hud;
        }

        // 浮窗显示错误信息
        static Error(str: any, delay: number = 2): Hud {
            let hud: IHudText = <any>CApplication.shared.clazzHudText.instance();
            hud.data = str;
            hud.textType = HudTextType.ERROR;
            hud.open();
            Delay(delay, () => {
                hud.close();
            });
            return hud;
        }

        // 显示进度
        static ShowProgress(data?: any): IHudProgress {
            if (this.__hud_progress_counter++ == 0) {
                if (this.__hud_progress) {
                    // 已经打开
                } else {
                    let hud = <any>CApplication.shared.clazzHudProgress.instance();
                    hud.data = data;
                    hud.open();
                    this.__hud_progress = hud;
                }
            }
            // 重新开始计时保护用的定时器
            this.__hud_progress_closer.start();
            return this.__hud_progress;
        }

        // 隐藏进度
        static HideProgress(force?: boolean) {
            if (force) {
                // 下一步会关闭掉
                this.__hud_progress_counter = 1;
            }

            // 如果自减到0，代表所有的show都正常hide
            if (--this.__hud_progress_counter == 0) {
                if (this.__hud_progress) {
                    // 关闭进度框时需要关闭保护定时器
                    this.__hud_progress_closer.stop();
                    // 关闭当前的进度对话框
                    this.__hud_progress.delayClose();
                    this.__hud_progress = null;
                }
            }

            // 避免意外
            if (this.__hud_progress_counter < 0)
                this.__hud_progress_counter = 0;
        }

        // 当前弹出的实例
        static __hud_progress: IHudProgress = null;

        // 弹出计数器
        static __hud_progress_counter = 0;

        // 避免progress因为计数器没有归0导致卡死前端逻辑
        static __hud_progress_closer = new Timer(5, 1);

        // 延迟关闭，避免界面上连续多个waiting或者短时间开关waiting造成的闪烁感
        static DELAY_CLOSE = 0.3;
    }

    // 当progress超时后自动隐藏
    Hud.__hud_progress_closer.signals.connect(SignalDone, () => {
        Hud.HideProgress(true);
    }, null);

    // 使用基础gui实现的浮窗信息展示
    export abstract class AbstractHud
        extends Sprite
        implements IHud {

        // 背景颜色
        static BackgroundColor = new Color(0xffffff, 0xf0);

        // 背景图片
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

        delayClose(timeout?: number) {
            Delay(timeout, () => {
                this.close();
            });
        }
    }

    export enum HudTextType {
        TEXT = 0, // 普通文字
        ERROR = 1, // 错误信息
    }

    // 文字浮窗
    export interface IHudText extends IHud {

        // 显示的内容
        data: any;

        // 当前文字类型
        textType?: HudTextType;
    }

    export class HudText
        extends AbstractHud
        implements IHudText {

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

        get data(): string {
            return this.labelMessage.text;
        }

        set data(s: string) {
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

    // 用来显示活动状态的接口
    export interface IActivity {

        // 开始动画
        startAnimation(): void;

        // 停止动画
        stopAnimation(): void;

        // 动画状态
        animating: boolean;
    }

    // 用来实现Progress的接口
    export interface IHudProgress extends IHud {

        // 用来显示进度的组件
        activity?: CComponent;

        // 当前进度
        progressValue?: Percentage;
    }

    // 显示进度浮窗
    export class HudProgress
        extends AbstractHud
        implements IProgress, IHudProgress {

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
            return Hud.__hud_progress;
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
                timeout = Hud.DELAY_CLOSE;

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
            this._tmrdelayclose = Delay(timeout, () => {
                this._tmrdelayclose = null;
                this.close();
            });
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
    }
}
