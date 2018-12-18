module app {

    // 游戏中心定义的sdks
    declare let sdks: any;

    export class SdkManager
        extends nn.Manager {

        onLoaded() {
            if (typeof sdks == "undefined") {
                nn.warn("没有加载sdk");
            } else {
                this._sdks = sdks;
                sdks.config.set('GAME_ID', 100);
            }
        }

        async init() {
            if (!this._sdks)
                return;
            await this._sdks.init();
        }

        private _sdks: any;
    }
}
