module app.main {
    interface IMainScene
    {
        //slot {
        //slot }
    }

    export class MainScene
    extends eui.SpriteU
    implements IMainScene
    {
        //skin {
        viewStack: eui.NavigationU;
        //skin }

        onLoaded() {
            this.viewStack.push(new Sample());
        }
    }
}
