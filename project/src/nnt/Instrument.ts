module app.dev {
    export declare function main(node: nn.dom.DomObject);
}

module nn {

    // 提供底层用来从egret获取一些必要的数据
    export let COLLECT_INSTRUMENT = false;
    export let COLLECT_FPS: number;
    export let COLLECT_COST: number;
    export let COLLECT_DRAWS: number;
    export let COLLECT_DIRTYR: number;

    export class IPLabel
        extends dom.Label {
        constructor() {
            super();
        }
    }

    export class ProfilerPanel extends dom.Sprite {
        constructor() {
            super();

            this.add(this.lblDrawed).br();
            this.add(this.lblCost).br();
            this.add(this.lblFps).br();
            this.add(this.lblDirty).br();
        }

        lblDrawed = new IPLabel();
        lblCost = new IPLabel();
        lblFps = new IPLabel();
        lblDirty = new IPLabel();

        start() {
            COLLECT_INSTRUMENT = true;
        }

        stop() {
            COLLECT_INSTRUMENT = false;
        }

        updateData() {
            super.updateData();
            this.lblDrawed.content = (Device.shared.isCanvas ? 'Canvas' : 'WebGL') + " Drawed: " + COLLECT_DRAWS;
            this.lblCost.content = "Cost: " + COLLECT_COST;
            this.lblFps.content = "FPS: " + COLLECT_FPS;
            this.lblDirty.content = "Dirty: " + COLLECT_DIRTYR + '%';
        }
    }

    export class SystemInfoPanel extends dom.Sprite {
        constructor() {
            super();

            this.add(this.lblOrientation).br();
            this.add(this.lblEnvSize).br();
            this.add(this.lblNavi).br();

            CApplication.shared.signals.connect(SignalFrameChanged, this.updateData, this);
        }

        lblOrientation = new IPLabel();
        lblEnvSize = new IPLabel();
        lblNavi = new IPLabel();

        updateData() {
            super.updateData();

            this.lblOrientation.content = 'Orientation: ' + Js.getBrowserOrientation() + ((<any>window).orientation != undefined ? ' SUPPORT' : '');

            let brwsz = Js.getBrowserSize();
            let scrsz = Js.getScreenSize();
            let stgsz = StageBounds.size;
            this.lblEnvSize.content = 'BrowserSize: ' + brwsz.width + ',' + brwsz.height
                + ' ScreenSize: ' + scrsz.width + ',' + scrsz.height
                + ' StageSize: ' + stgsz.width * ScaleFactorW + ',' + stgsz.height * ScaleFactorH + ' Resource: ' + ResManager.directory;

            this.lblNavi.content = navigator.userAgent;
        }
    }

    export class InstrumentPanel extends dom.Sprite {
        constructor() {
            super();
        }

        protected preload(cb: () => void, ctx?: any) {
            cb.call(ctx);
        }

        onLoaded() {
            super.onLoaded();
        }

        pnlSysinfo = new SystemInfoPanel();
        pnlProfiler = new ProfilerPanel();
        pnlDebug = new DebugPanel();

        open() {
            this.pnlSysinfo.updateData();
            this.pnlProfiler.start();
        }

        close() {
            this.pnlProfiler.stop();
        }

        updateData() {
            super.updateData();
            this.pnlProfiler.updateData();
        }
    }

    export class DebugPanel extends dom.Sprite {
        constructor() {
            super();
        }

        // 加载外部的debug工具脚本
        onLoaded() {
            super.onLoaded();
            if (app.dev.main != null)
                app.dev.main(this);
        }
    }

    export class Instrument extends SObject {
        constructor() {
            super();
        }

        panel = new InstrumentPanel();

        static shared: Instrument;

        static run() {
            // 当前利用dom来实现测试器，不支持原生模式
            if (ISNATIVE)
                return;

            if (Instrument.shared == null)
                Instrument.shared = new Instrument();
            return Instrument.shared;
        }

        open() {
            if (this.panel.parent == null) {
                Dom.add(this.panel);
            }

            this.panel.visible = true;
            this.panel.open();
        }

        close() {
            this.panel.visible = false;
            this.panel.close();
        }

        updateData() {
            this.panel.updateData();
        }
    }

    CApplication.InBoot(() => {
        if (ISDEBUG)
            Instrument.run();
    });

}
