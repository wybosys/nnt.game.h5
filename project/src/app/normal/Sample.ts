module app.normal {
    interface ISample extends nn.IEntry
    {
        //slot {
        _actTouchMoved(s?: nn.Slot);
        //slot }
    }

    export class Sample
    extends eui.SpriteU
    implements ISample
    {
        //skin {
        sp_touch: eui.GroupU;
        //skin }

        entrySettings: nn.EntrySettings;

        _actTouchMoved(s?: nn.Slot) {
            nn.info(s.data.currentPosition);
        }
    }

    nn.Entries.register(Sample);
}
