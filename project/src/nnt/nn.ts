module nn {

    export let COPYRIGHT: string = "WYBOSYS";
    export let AUTHOR: string = "WYBOSYS@GMAIL.COM";

    // 判断版本
    export let ISHTML5 = egret.Capabilities.runtimeType == "web";
    export let ISNATIVE = !ISHTML5;

    // 如果对接游戏中心的sdk
    declare let sdks: any;

    class CLocation {
        protocol: string = "https:";
    }

    class CDocument {
        domain: string = "localhost";
        location: CLocation = new CLocation();

        getElementsByTagName(name: string): any[] {
            return [];
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

    declare let __tag_debug;
    declare let __tag_verbose;
    declare let __tag_version;
    declare let __tag_publish;

    export let APPICON: string;
    export let APPNAME: string;

    let app: any = document.getElementsByTagName('app');
    if (app.length) {
        app = app[0];

        APPICON = app.getAttribute('icon');
        APPNAME = app.getAttribute('name');

        let parseContent = function (content) {
            if (content == undefined)
                return;
            let sets = content.replace(/ /g, '').split(',');
            sets.forEach(function (set) {
                if (set.indexOf('=') == -1) {
                    this['__tag_' + set] = true;
                } else {
                    let p = set.split('=');
                    this['__tag_' + p[0]] = p[1];
                }
            });
        };

        parseContent(app.getAttribute('content'));
        let children = app.children;
        let def, matched;
        for (let i = 0; i < children.length; ++i) {
            let node = children[i];
            let url = node.getAttribute('url');
            if (url && document.domain.match(url)) {
                matched = true;
                parseContent(node.getAttribute('content'));
            } else if (url == undefined) {
                def = node.getAttribute('content');
            }
        }

        if (!matched)
            parseContent(def);
    } else {
        if (ISNATIVE) {
            let p;
            if (p = egret.getOption('debug'))
                __tag_debug = p == 'true';
            if (p = egret.getOption('verbose'))
                __tag_verbose = p == 'true';
            if (p = egret.getOption('version'))
                __tag_version = p;
            if (p = egret.getOption('publish'))
                __tag_publish = p == 'true';
        } else {
            if (typeof sdks != 'undefined') {
                __tag_debug = sdks.config.get('DEBUG');
                __tag_verbose = sdks.config.get('VERBOSE');
                __tag_version = sdks.config.get('GAME_VERSION');
                __tag_publish = true;
            }
        }
    }

    // 测试版标志
    export let ISDEBUG: boolean = typeof (__tag_debug) == 'undefined' ? false : __tag_debug;
    // 打印日志标志
    export let VERBOSE: boolean = typeof (__tag_verbose) == 'undefined' ? false : __tag_verbose;
    // 版本号
    export let APPVERSION: string = typeof (__tag_version) == 'undefined' ? '' : __tag_version;
    // 发布版本标志
    export let PUBLISH: boolean = typeof (__tag_publish) == 'undefined' ? false : __tag_publish;

    // 如果是runtime，需要提供
    /*
      options[@"debug"] = @"true";
      options[@"verbose"] = @"true";
      options[@"version"] = @"1.0.0";
      options[@"publish"] = @"false";
    */

}
