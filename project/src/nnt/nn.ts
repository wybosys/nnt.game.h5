module nn {

    export const TOOLKIT_AUTHOR = "wybosys@gmail.com";
    export const TOOLKIT_LICENSE = "BSD";
    export const TOOLKIT_REPO = "github.com/wybosys/nnt.game.h5";

    // 是否时https方式访问
    export let ISHTTPS: boolean = location.protocol == "https:";

    // 是否是HTML5模式
    export let ISHTML5: boolean;

    // 是否是本地模式
    export let ISNATIVE: boolean;

    // 是否是小游戏
    export let ISMINGAME: boolean;

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

    // 如果接入了游戏中心，一些数据就从游戏中心取得
    declare let sdks: any;

    // tools编译时会将程序配置生成到app节点上
    let app = document.querySelector('app');
    if (app) {
        APPICON = app.getAttribute('icon');
        APPNAME = app.getAttribute('name');
        ISDEBUG = app.getAttribute('debug') == "true";
        VERBOSE = app.getAttribute('verbose') == "true";
        APPVERSION = app.getAttribute('version');
    } else {
        if (typeof sdks != 'undefined') {
            APPICON = sdks.config.get('GAME_ICON');
            APPNAME = sdks.config.get('GAME_NAME');
            ISDEBUG = sdks.config.get('DEBUG');
            VERBOSE = sdks.config.get('VERBOSE');
            APPVERSION = sdks.config.get('GAME_VERSION');
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
