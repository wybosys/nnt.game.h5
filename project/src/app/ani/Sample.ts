module app.ani {
    interface ISample extends nn.IEntry {
        //slot {
        _actParticle(s?: nn.Slot);
        //slot }
    }

    export class Sample
        extends eui.SpriteU
        implements ISample {
        //skin {
        //skin }

        entrySettings: nn.EntrySettings;

        _actParticle(s?: nn.Slot) {
            let t = new eui.ParticleU();
            t.particleName = "snow";
            t.frame = this.bounds();
            this.addChild(t);
        }
    }

    nn.Entries.register(Sample);
}
