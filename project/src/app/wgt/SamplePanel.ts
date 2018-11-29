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
            this.goBack();
        }
    }
}
