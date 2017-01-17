module egret {
    export var VERSION_2_5_6 = MAKE_VERSION(2, 5, 6);
}

module nn {
    
    IMP_TIMEPASS = ():number => {
        return egret.getTimer() * 0.001;
    }

    IMP_CREATE_TIMER = (duration:number, count:number):egret.Timer => {
        return new egret.Timer(duration * 1000, count);
    };
    
    IMP_START_TIMER = (tmr:egret.Timer, cb:()=>void, ctx:any) => {
        tmr.addEventListener(egret.TimerEvent.TIMER, cb, ctx);
        tmr.start();
    };

    IMP_STOP_TIMER = (tmr:egret.Timer, cb:()=>void, ctx:any) => {
        tmr.stop();
        tmr.removeEventListener(egret.TimerEvent.TIMER, cb, ctx);
    };

    // 需要判断一下是使用LocalStorage还是使用SessionStorage
    let _storageMode = (():number=>{
        let key = "::n2::test::localstorage::mode";
        if (egret.localStorage.setItem(key, "test")) {
            egret.localStorage.removeItem(key);
            return 0;
        }
        if (window && window.sessionStorage) {
            try {
                window.sessionStorage.setItem(key, "test");
                window.sessionStorage.removeItem(key);
                return 1;
            } catch (e) {} // 不支持sessionStorage
        }
        return -1;
    })();

    if (_storageMode == 0)
    {
        IMP_STORAGE_GET = egret.localStorage.getItem;
        IMP_STORAGE_SET = egret.localStorage.setItem;
        IMP_STORAGE_DEL = egret.localStorage.removeItem;
        IMP_STORAGE_CLEAR = egret.localStorage.clear;
    }
    else if (_storageMode == 1)
    {
        IMP_STORAGE_GET = (k:string):string=>{
            return window.sessionStorage.getItem(k);
        };
        IMP_STORAGE_SET = (k:string, v:string)=>{
            window.sessionStorage.setItem(k, v);
        };
        IMP_STORAGE_DEL = (k:string)=>{
            window.sessionStorage.removeItem(k);
        };
        IMP_STORAGE_CLEAR = ()=>{
            window.sessionStorage.clear();
        };
    }
    else
    {
        let __g_storage = {};
        IMP_STORAGE_GET = (key:string):string=>{
            return __g_storage[key];
        };
        IMP_STORAGE_SET = (key:string, v:string)=>{
            __g_storage[key] = v;
        };
        IMP_STORAGE_DEL = (key:string)=>{
            delete __g_storage[key];
        };
        IMP_STORAGE_CLEAR = ()=>{
            __g_storage = {};
        };
    }

    Defer = (cb:Function, ctx:any, ...p:any[]) => {
        egret.callLater.apply(null, [cb, ctx].concat(p));
    }

    // 将point伪装成egret.point
    let __PROTO:any = Point.prototype;
    __PROTO.setTo = function (x:number, y:number) {
        this.x = x;
        this.y = y;
    };
    
    // 解决egret-inspector显示的是实现类而不是业务类的名称
    Js.OverrideFunction(egret, 'getQualifiedClassName', (orifn:(value:any)=>string, value:any):string => {
        if ('_fmui' in value)
            return value._fmui.descriptionName;
        return orifn(value);
    });    
}

module egret.web {    
    if (nn.ISHTML5) {        
        let FUNC_TEXTHOOK = egret.web['$cacheTextAdapter'];
        egret.web['$cacheTextAdapter'] = function(adapter, stage, container, canvas) {
            FUNC_TEXTHOOK(adapter, stage, container, canvas);
            let s = adapter._simpleElement;
            let m = adapter._multiElement;
            function FUNC_TEXTONPRESS(e) {
                let textfield = adapter._stageText.$textfield;
                if (textfield) {
                    let ui = textfield.parent;
                    if (ui._need_fix_textadapter && ui._signals) {
                        if (ui.keyboard == null)
                            ui.keyboard = new nn.CKeyboard();
                        ui.keyboard.key = e.key;
                        ui.keyboard.code = e.keyCode;
                        ui._signals.emit(nn.SignalKeyPress, ui.keyboard);
                    }
                }
            };
            if (s && s.onkeypress != FUNC_TEXTHOOK)
                s.onkeypress = FUNC_TEXTONPRESS;
            if (m && m.onkeypress != FUNC_TEXTHOOK)
                m.onkeypress = FUNC_TEXTONPRESS;
        };            
    }        
}
