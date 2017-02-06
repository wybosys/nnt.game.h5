module nn {    
    export interface ISnapshot
    {
        /** 快照出一个数据 */
        snapshot():Object;
    }
}

module nn.journal {
        
    export interface JournalRecord
    {
        time:DateTime;
        snapshot:Object;
        reason:string;
        stack:string;
    }

    let _records = new Array<JournalRecord>();
    
    /** 添加一个日志 */
    export function add(reason:string, obj:ISnapshot) {
        _records.push({
            time:new DateTime(),
            snapshot:obj.snapshot(),
            reason:reason,
            stack:Js.stacktrace()
        });
    }

    /** 查找满足条件的日志 */
    export function query(keypath:string, val:any):Array<JournalRecord> {
        return nn.ArrayT.QueryObjects(_records, (e:JournalRecord):boolean=>{
            return nn.ObjectT.GetValueByKeyPath(e.snapshot, keypath) == val;
        });
    }

    function recordStringify(rcd:JournalRecord, sb:StringBuilder) {
        sb.add(rcd.time.toString("HH:mm:ss "));
        sb.add(rcd.reason).add(" ");
        sb.add(vardump(rcd.snapshot));
        sb.line();
    }

    /** 打印日志 */
    export function recordsStringify(rcds = _records):string {
        let sb = new StringBuilder();
        rcds.forEach((e:JournalRecord)=>{
            recordStringify(e, sb);
        });
        return sb.toString();
    }

    export class ArrayT
    {
        static RemoveObjectByFilter<T extends ISnapshot>
            (reason:string, arr:T[], filter:(o:T, idx:number)=>boolean, ctx?:any):T
        {
            let obj = nn.ArrayT.RemoveObjectByFilter(arr, filter, ctx);
            if (obj)
                add(reason, obj);
            return obj;
        }
        
        static RemoveObjectsByFilter<T extends ISnapshot>
            (reason:string, arr:T[], filter:(o:T, idx:number)=>boolean, ctx?:any):T[]
        {
            let objs = nn.ArrayT.RemoveObjectsByFilter(arr, filter, ctx);
            objs.forEach((e:T)=>{
                add(reason, e);
            });
            return objs;
        }

        static Convert<L, R extends ISnapshot>
            (reason:string, arr:L[], convert:(o:L, idx?:number)=>R, ctx?:any):R[]
        {
            let objs = nn.ArrayT.Convert(arr, convert, ctx);
            objs.forEach((e:R)=>{
                add(reason, e);
            });
            return objs;            
        }
    }

    export class IndexedMapT
    {
        static RemoveObjectByFilter<K,T extends ISnapshot>
            (reason:string, map:IndexedMap<K,T>, filter:(k:K, v:T)=>boolean, ctx?:any):[K,T]
        {
            let obj = nn.IndexedMapT.RemoveObjectByFilter(map, filter, ctx);
            if (obj)
                add(reason, obj[1]);
            return obj;
        }

        static RemoveObjectsByFilter<K,T extends ISnapshot>
            (reason:string, map:IndexedMap<K,T>, filter:(k:K, v:T)=>boolean, ctx?:any):Array<[K,T]>
        {
            let objs = nn.IndexedMapT.RemoveObjectsByFilter(map, filter, ctx);
            objs.forEach((e:[K,T])=>{
                add(reason, e[1]);
            });
            return objs;
        }

        static Convert<K,T extends ISnapshot,V>
            (reason:string, arr:Array<V>, convert:(v:V)=>[K,T], ctx?:any):IndexedMap<K,T>
        {
            let map = nn.IndexedMapT.Convert(arr, convert, ctx);
            map.forEach((k:K, v:T)=>{
                add(reason, v);
            });
            return map;
        }
    }
}
