namespace app.models {






    export class Echoo extends Model {
    
        @Model.string(1, [Model.input], "输入")
        input:string;
    
        @Model.string(2, [Model.output], "输出")
        output:string;
    
        @Model.integer(3, [Model.output], "服务器时间")
        time:number;
    
        @Model.json(4, [Model.output], "当天的时间段")
        today:Object;
    
    }

    export class Login extends Model {
    
        @Model.string(1, [Model.input], "随便输入一个用户id")
        uid:string;
    
        @Model.string(2, [Model.output])
        sid:string;
    
    }

    export class User extends Model {
    
        @Model.string(1, [Model.output], "当前用户id")
        uid:string;
    
    }

    export class Message extends Model {
    
        @Model.string(1, [Model.output], "消息体")
        content:string;
    
    }

}

namespace app.routers {

    export let SampleEcho = ["sample.echo", models.Echoo, ""];

    export let SampleLogin = ["sample.login", models.Login, ""];

    export let SampleUser = ["sample.user", models.User, ""];

    export let SampleMessage = ["sample.message", models.Message, "监听消息炸弹"];

}

namespace app.api {

    export function SampleEcho():models.Echoo {
    return NewRequest(routers.SampleEcho);
    }

    export function SampleLogin():models.Login {
    return NewRequest(routers.SampleLogin);
    }

    export function SampleUser():models.User {
    return NewRequest(routers.SampleUser);
    }

    export function SampleMessage():models.Message {
    return NewRequest(routers.SampleMessage);
    }

}

