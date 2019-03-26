module nn {

    // 首屏加载得实现
    export interface ILoadingScreen extends Component {

        // 进度
        progressValue: Percentage;

        // 加载完成
        complete();
    }

    // 基于基础GUI实现的加载屏
    export class LoadingScreen
        extends Sprite
        implements IProgress, ILoadingScreen {

        constructor() {
            super();

            this.labelProgress.textColor = 0;
            this.labelProgress.textAlign = "center";
            this.addChild(this.labelProgress);

            this.labelVersion.textColor = 0;
            this.labelVersion.textAlign = "center";
            this.labelVersion.text = "版本:" + APPVERSION;
            this.addChild(this.labelVersion);
        }

        dispose() {
            super.dispose();
        }

        protected _initSignals() {
            super._initSignals();
            // 进度条前期工作已经准备完成，可以开始进行资源的加载
            this._signals.register(SignalStart);
            // 进度条整体资源已经加载完成，可以进行下一步（通常加载主界面）
            this._signals.register(SignalDone);
        }

        labelProgress = new Label();
        labelVersion = new Label();

        updateLayout() {
            super.updateLayout();
            new VBox(this).setRect(this.bounds())
                .addFlex(1)
                .addPixel(30, this.labelProgress)
                .addFlex(1)
                .addPixel(30, this.labelVersion)
                .apply();
        }

        protected _progressValue = new Percentage();

        get progressValue(): Percentage {
            return this._progressValue;
        }

        set progressValue(v: Percentage) {
            this._progressValue = v;
            this.updateData();
        }

        updateData() {
            super.updateData();
            this.labelProgress.bringFront();
            this.labelVersion.bringFront();

            this.labelProgress.text = "正在加载" +
                this._progressValue.value + "/" +
                this._progressValue.max;
        }

        onLoaded() {
            super.onLoaded();
            this.prepare();
        }

        /** 完成主界面的加载 override */
        complete() {
            this.close();
        }

        /** 关闭当前页面 */
        protected close() {
            this.signals.emit(SignalDone);
        }

        /** 完成加载前的准备 override */
        prepare() {
            this.start();
        }

        protected start() {
            this.signals.emit(SignalStart);
        }
    }

}
