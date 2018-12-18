module app.ani {
    interface ISample extends nn.IEntry {
        //slot {
        _actParticle(s?: nn.Slot);
        _actPlayFrameAni(s?: nn.Slot);
        //slot }
    }

    export class Sample
        extends eui.SpriteU
        implements ISample {
        //skin {
        btnLogic: eui.ButtonU;
        test: egret.tween.TweenGroup;
        //skin }

        entrySettings: nn.EntrySettings;

        _actParticle(s?: nn.Slot) {
            let t = new eui.ParticleU();
            t.particleName = "snow";
            t.frame = this.bounds();
            this.addChild(t);
        }

        _actPlayFrameAni(s?: nn.Slot) {
            this.test.play();
        }
    }

    nn.Entries.register(Sample);
}
