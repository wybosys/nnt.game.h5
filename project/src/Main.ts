class Main
    extends nn.EuiApplication {
    constructor() {
        super();
        this.backgroundColor = nn.Color.Random();
    }

    protected onLoaded() {
        super.onLoaded();
        this.root = new app.main.MainScene();
    }

    static BestFrame(): nn.Rect {
        return new nn.Rect(0, 0, 720, 1080);
    }

    static ScreenFillMode(): nn.FillMode {
        return nn.FillMode.CENTER | nn.FillMode.NOBORDER;
    }
}
