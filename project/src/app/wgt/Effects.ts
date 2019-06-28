module app {

    export class TextShadow extends nn.ShadowEffect {
        constructor() {
            super();
            this.color = nn.Color.Random();
        }
    }
}
