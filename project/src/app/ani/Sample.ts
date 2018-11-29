module app.ani {
    interface ISample extends nn.IEntry {
        //slot {
        //slot }
    }

    export class Sample
        extends eui.SpriteU
        implements ISample {
        //skin {
        //skin }
    }

    nn.Entries.register(Sample);
}
