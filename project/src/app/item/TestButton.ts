
module app.item {

    interface ITestButton
    {
        //slot {
        //slot }
    }

    export class TestButton
    extends eui.SpriteU
    implements ITestButton
    {
        //skin {
        iconDisplay:eui.ImageU;
        labelDisplay:eui.LabelU;
        //skin }
    }

}
