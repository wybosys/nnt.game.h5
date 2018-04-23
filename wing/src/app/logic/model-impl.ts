namespace app.models {

    export class Model extends logic.Base {

        constructor() {
            super();
            this.host = "http://localhost:8090/";
            this.withCredentials = false;
        }

        iscross(): boolean {
            return false;
        }

        url(): string {
            return this.host + "?action=" + this.action;
        }
    }
}