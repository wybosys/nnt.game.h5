module app.wgt {
    interface ISamplePanel {
        //slot {
        _actBack(s?: nn.Slot);
        //slot }
    }

    export class SamplePanel
        extends eui.SpriteU
        implements ISamplePanel {
        //skin {
        //skin }

        _actBack(s?: nn.Slot) {
            // 清楚按钮的新手
            let btn: EntryButton = s.sender;
            btn.clearGuide();

            // 返回上一页
            this.goBack();
        }
    }
}
