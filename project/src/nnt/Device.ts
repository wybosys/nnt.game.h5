module nn {

    /** 设备信息 */
    export class Device extends SObject implements IShared {
        constructor() {
            super();
            this.detectEnv();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalOrientationChanged);
        }

        detectEnv() {
            let self = this;
            self.platform = navigator.platform;
            self.agent = navigator.userAgent;

            self.isMac = (self.platform == "Mac68K") ||
                (self.platform == "MacPPC") ||
                (self.platform == "Macintosh") ||
                (self.platform == "MacIntel");
            self.isWin = (self.platform == "Win32") ||
                (self.platform == "Windows");
            self.isUnix = (self.platform == "X11") &&
                !self.isMac && !self.isWin;
            self.isLinux = self.platform.indexOf("Linux") != -1;

            self.isIOS = /(iPhone|iPad|iPod|iOS)/i.test(self.agent);
            self.isAndroid = /android/i.test(self.agent);
            self.isMobile = self.isIOS || self.isAndroid;
            self.isPC = !self.isMobile || self.isMac || self.isWin || self.isUnix || self.isLinux;
            self.isPurePC = !self.isMobile && (self.isMac || self.isWin || self.isUnix || self.isLinux);

            self.isHighPerfomance = !self.isAndroid;
            self.isMinGame = nn.ISMINGAME;
        }

        platform: string;
        agent: string;

        isMac: boolean;
        isWin: boolean;
        isUnix: boolean;
        isLinux: boolean;
        isIOS: boolean;
        isAndroid: boolean;
        isMobile: boolean;
        isPC: boolean;
        isPurePC: boolean;

        /** 小程序模式 */
        isMinGame: boolean = false;

        /** canvas模式 */
        isCanvas: boolean = true;

        /** 高性能设备 */
        isHighPerfomance: boolean;

        /** 支持自动播放音效 */
        supportAutoSound: boolean = true;

        /** 屏幕的尺寸 */
        screenFrame = new Rect();

        /** 页面的尺寸 */
        screenBounds = new Rect();

        /** 屏幕的方向 */
        screenOrientation = new Angle();

        /** 屏幕尺寸的类型，对应于 android 的归类 */
        screenType: ScreenType = ScreenType.NORMAL;

        _updateScreen() {
            let browserSize = js.getBrowserSize();
            let screenSize = js.getScreenSize();

            // 需要保护一下browser定义必须小于screen，但是有些渠道发现刚好相反
            /*
            if (Rect.Area(browserSize) > Rect.Area(screenSize))
                Rect.Swap(browserSize, screenSize);
            */

            this.screenBounds.reset(0, 0, browserSize.width, browserSize.height);
            this.screenFrame.reset(0, 0, screenSize.width, screenSize.height);

            let browserOri = js.getBrowserOrientation();
            if (this.screenOrientation.angle != browserOri) {
                this.screenOrientation.angle = browserOri;
                this.signals.emit(SignalOrientationChanged, this.screenOrientation);
            }
        }

        static shared = new Device();
    }
}
