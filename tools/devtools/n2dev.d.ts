declare module nn {

    function IsInherit(type:Function, parent:Function):boolean;
    function toInt(v:any):number;
    function toNumber(v:any):number;
    function asString(v:any):string;    

    class ArrayT {
        static Convert<L, R>(arr:L[], convert:(o:L, idx?:number)=>R, ctx?:any):R[];
        static QueryObject<K, V>(m:Map<K, V>, fun:(k:K, v:V)=>boolean, ctx?:any):[K, V];
        static QueryObjects<K, V>(m:Map<K, V>, fun:(k:K, v:V)=>boolean, ctx?:any):Map<K, V>;
    }
    
    module dom {        
        class DomObject {
            id:string;
            node:any;
            css:string;
            width:number;
            height:number;
        }        
    }

    class Model {
    }

    class Slot {
    }

    class RestSession {
        static fetch(m:Model, cb:(s?:Slot)=>void, ctx?:any);
    }

    class Hud {
        static Text(msg:string);
    }
}

declare module app {
    
    module api {
        let _;
    }
    
}

declare let webix:any;
declare let $$:any;