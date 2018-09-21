
module app.item {

    interface ITestButton1
    {
        //slot {
        //slot }
    }

    export class TestButton1
    extends eui.SpriteU
    implements ITestButton1
    {
        //skin {
        iconDisplay: eui.ImageU;
        labelDisplay: eui.LabelU;
        //skin }
    }

}
