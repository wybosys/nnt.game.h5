module app.wgt {
    interface IEntryButton {
        //slot {
        //slot }
    }

    export class EntryButton
        extends eui.ButtonU
        implements IEntryButton {

        //skin {
        iconDisplay: eui.ImageU;
        labelDisplay: eui.LabelU;
        spBkg: eui.RectU;
        //skin }

        onLoaded() {
            let br = new nn.Brush();
            br.color = nn.Color.Random();
            this.spBkg.brush = br;

            this.signals.connect(nn.SignalClicked, this._actOpenEntry, this);
        }

        // 实体标记，用来自动打开
        _dentry: data.Entry;

        public get entryIdr(): string {
            return this._dentry ? this._dentry.entryIdr : null;
        }

        public set entryIdr(v: string) {
            this._dentry = data.Entry.FromIdr(v);
        }

        private _actOpenEntry() {
            if (!this._dentry)
                return;

            // 跳转到模块
            this._dentry.open();
        }
    }
}
