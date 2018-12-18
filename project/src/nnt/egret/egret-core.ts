module egret {
    export var VERSION_5_0_0 = MAKE_VERSION(5, 0, 0);
}

module nn {

    IMP_TIMEPASS = (): number => {
        return egret.getTimer() * 0.001;
    };

    IMP_CREATE_TIMER = (duration: number, count: number): egret.Timer => {
        return new egret.Timer(duration * 1000, count);
    };

    IMP_START_TIMER = (tmr: egret.Timer, cb: () => void, ctx: any) => {
        tmr.addEventListener(egret.TimerEvent.TIMER, cb, ctx);
        tmr.start();
    };

    IMP_STOP_TIMER = (tmr: egret.Timer, cb: () => void, ctx: any) => {
        tmr.stop();
        tmr.removeEventListener(egret.TimerEvent.TIMER, cb, ctx);
    };

    // 需要判断一下是使用LocalStorage还是使用SessionStorage
    let _storageMode = ((): number => {
        let key = "::n2::test::localstorage::mode";
        if (window && window.localStorage) {
            window.localStorage.setItem(key, "test");
            if (window.localStorage.getItem(key) == "test") {
                window.localStorage.removeItem(key);
                return 0;
            }
        }
        if (window && window.sessionStorage) {
            try {
                window.sessionStorage.setItem(key, "test");
                window.sessionStorage.removeItem(key);
                return 1;
            } catch (e) {
            } // 不支持sessionStorage
        }
        return -1;
    })();

    if (_storageMode == 0) {
        IMP_STORAGE_GET = IS_MINGAME ? window.localStorage.getItem : egret.localStorage.getItem;
        IMP_STORAGE_SET = IS_MINGAME ? window.localStorage.setItem : egret.localStorage.setItem;
        IMP_STORAGE_DEL = IS_MINGAME ? window.localStorage.removeItem : egret.localStorage.removeItem;
        IMP_STORAGE_CLEAR = IS_MINGAME ? window.localStorage.clear : egret.localStorage.clear;
    }
    else if (_storageMode == 1) {
        IMP_STORAGE_GET = (k: string): string => {
            return window.sessionStorage.getItem(k);
        };
        IMP_STORAGE_SET = (k: string, v: string) => {
            window.sessionStorage.setItem(k, v);
        };
        IMP_STORAGE_DEL = (k: string) => {
            window.sessionStorage.removeItem(k);
        };
        IMP_STORAGE_CLEAR = () => {
            window.sessionStorage.clear();
        };
    }
    else {
        let __g_storage = {};
        IMP_STORAGE_GET = (key: string): string => {
            return __g_storage[key];
        };
        IMP_STORAGE_SET = (key: string, v: string) => {
            __g_storage[key] = v;
        };
        IMP_STORAGE_DEL = (key: string) => {
            delete __g_storage[key];
        };
        IMP_STORAGE_CLEAR = () => {
            __g_storage = {};
        };
    }

    Defer = (cb: Function, ctx: any, ...p: any[]) => {
        egret.callLater.apply(null, [cb, ctx].concat(p));
    };

    // 将point伪装成egret.point
    let __PROTO: any = Point.prototype;
    __PROTO.setTo = function (x: number, y: number) {
        this.x = x;
        this.y = y;
    };

    /*
    // 解决egret-inspector显示的是实现类而不是业务类的名称
    Js.OverrideFunction(egret, 'getQualifiedClassName', (orifn: (value: any) => string, value: any): string => {
        if ('_fmui' in value)
            return value._fmui.descriptionName;
        return orifn(value);
    });
    */

    /**
     * 解决wxgame触摸滑动卡顿的问题
     */
    if (IS_WEIXIN_MINGAME) {
        let _PROTO: any = egret.sys.TouchHandler.prototype;
        _PROTO.onTouchMove = function (t, e, i) {
            if (null != this.touchDownTarget[i] && (this.lastTouchX != t || this.lastTouchY != e)) {
                this.lastTouchX = t, this.lastTouchY = e;
                //var r = this.findTarget(t, e); // 锁定在之前判定过的对象上
                var r = this.touchDownTarget[i];
                egret.TouchEvent.dispatchTouchEvent(r, egret.TouchEvent.TOUCH_MOVE, !0, !0, t, e, i, !0)
            }
        }
    }
}
