namespace app.models {






    export class Echoo extends Model {
    
        @Model.string(1, [Model.input], "输入")
        input:string;
    
        @Model.string(2, [Model.output], "输出")
        output:string;
    
    }

}

namespace app.routers {

    export let SampleEcho = ["sample.echo", models.Echoo, ""];

}

namespace app.api {

    export function SampleEcho():models.Echoo {
    return NewRequest(routers.SampleEcho);
    }

}

