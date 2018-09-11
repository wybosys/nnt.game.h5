
class Main
extends nn.EuiApplication
{
    constructor() {
        super();
        this.backgroundColor = nn.Color.Random();
        //new nn.XHBServices().setAsDefault();
    }
    
    protected onLoaded() {
        super.onLoaded();
        this.root = new app.MainScene();
    }    
}
