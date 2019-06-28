module app {

    export class TextShadow extends nn.ShadowEffect {
        constructor() {
            super();
            this.distance = 10;
            this.x = 30;
            this.y = 30;
            this.color = nn.Color.Random();
        }
    }
}
