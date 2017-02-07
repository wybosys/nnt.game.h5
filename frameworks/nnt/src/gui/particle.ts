module nn {

    export abstract class CParticle
    extends Widget
    {
        constructor() {
            super();
        }

        name:string;

        abstract start();
        abstract stop();
    }

}
