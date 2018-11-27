module app.wgt {
    interface IEntryButton
    {
        //slot {
        //slot }
    }

    export class EntryButton
    extends eui.SpriteU
    implements IEntryButton
    {
        //skin {
        iconDisplay: eui.ImageU;
        labelDisplay: eui.LabelU;
        //skin }
    }
}
