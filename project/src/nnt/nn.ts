module nn {

    export const TOOLKIT_AUTHOR = "wybosys@gmail.com";
    export const TOOLKIT_LICENSE = "BSD";
    export const TOOLKIT_REPO = "github.com/wybosys/nnt.game.h5";

    // 对接游戏中心的sdk
    declare let sdks: any;

    // 如果是egret
    declare let egret: any;

    // 判断版本
    export let ISHTML5 = egret.Capabilities.runtimeType == "web";
    export let ISNATIVE = !ISHTML5;

    // 默写环境下没有location，所以需要模拟一个
    class CLocation {
        protocol = "https:";
    }

    class CDocument {
        domain = "localhost";
        location = new CLocation();

        querySelector(selector: string): any {
            return null;
        }
    }

    class CNavigator {
        platform: string = "native";
        userAgent: string = "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53";
    }

    if (typeof (document) == 'undefined') {
        document = <any>new CDocument();
        navigator = <any>new CNavigator();
    }

    if (typeof (location) == 'undefined') {
        location = <any>new CLocation();
    }

    export let ISHTTPS: boolean = location.protocol == "https:";

    // 测试版标志
    export let ISDEBUG: boolean = false;
    // 打印日志标志
    export let VERBOSE: boolean = false;
    // 版本号
    export let APPVERSION: string = null;
    // 程序图标
    export let APPICON: string = '';
    // 程序名称
    export let APPNAME: string = '';

    // tools编译时会将程序配置生成到app节点上
    let app = document.querySelector('app');
    if (app) {
        APPICON = app.getAttribute('icon');
        APPNAME = app.getAttribute('name');
        ISDEBUG = app.getAttribute('debug') == "true";
        VERBOSE = app.getAttribute('verbose') == "true";
        APPVERSION = app.getAttribute('version');
    } else {
        if (ISNATIVE) {
            APPICON = egret.getOption('icon');
            APPNAME = egret.getOption('name');
            ISDEBUG = egret.getOption('debug') == 'true';
            VERBOSE = egret.getOption('verbose') == 'true';
            APPVERSION = egret.getOption('version');
        } else {
            if (typeof sdks != 'undefined') {
                APPICON = sdks.config.get('GAME_ICON');
                APPNAME = sdks.config.get('GAME_NAME');
                ISDEBUG = sdks.config.get('DEBUG');
                VERBOSE = sdks.config.get('VERBOSE');
                APPVERSION = sdks.config.get('GAME_VERSION');
            }
        }
    }

    // 如果是runtime，需要提供
    /*
      options[@"debug"] = @"true";
      options[@"verbose"] = @"true";
      options[@"version"] = @"1.0.0";
      options[@"publish"] = @"false";
    */

}
