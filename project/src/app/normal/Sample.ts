module app.normal {
    interface ISample extends nn.IEntry {
        //slot {
        _actEnter(s?: nn.Slot);
        _actOpenLink(s?: nn.Slot);
        _actTouchMoved(s?: nn.Slot);
        //slot }
    }

    export class Sample
        extends eui.SpriteU
        implements ISample {
        //skin {
        lblHtml: eui.HtmlLabelU;
        lblInp: eui.TextInputU;
        sp_touch: eui.GroupU;
        //skin }

        entrySettings: nn.EntrySettings;

        _actTouchMoved(s?: nn.Slot) {
            nn.info(s.data.currentPosition);
        }

        _actEnter(s?: nn.Slot) {
            let inp: eui.TextInputU = s.sender;
            this.lblHtml.value = inp.value;
        }

        _actOpenLink(s?: nn.Slot) {
            nn.noti(s.data);
        }
    }

    nn.Entries.register(Sample);
}
