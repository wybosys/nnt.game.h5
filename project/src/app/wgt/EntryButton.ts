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

    }
}
