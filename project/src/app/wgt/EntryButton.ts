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
        }
    }
}
