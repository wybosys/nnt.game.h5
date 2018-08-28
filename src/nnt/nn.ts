module nn {

    export var COPYRIGHT: string = "WYBOSYS";
    export var AUTHOR: string = "WYBOSYS@GMAIL.COM";

    // 判断版本
    export var ISHTML5 = egret.Capabilities.runtimeType == "web";
    export var ISNATIVE = !ISHTML5;

    class CLocation {
        protocol: string = "http:";
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

    if (ISNATIVE && typeof(document) == 'undefined') {
        document = <any> new CDocument();
        navigator = <any> new CNavigator();
    }

    export var ISHTTPS: boolean = document.location.protocol == "https:";

    declare var __tag_debug;
    declare var __tag_verbose;
    declare var __tag_version;
    declare var __tag_publish;

    export var APPICON: string;
    export var APPNAME: string;

    var app: any = document.getElementsByTagName('app');
    if (app.length) {
        app = app[0];

        APPICON = app.getAttribute('icon');
        APPNAME = app.getAttribute('name');

        var parseContent = function (content) {
            if (content == undefined)
                return;
            var sets = content.replace(/ /g, '').split(',');
            sets.forEach(function (set) {
                if (set.indexOf('=') == -1) {
                    this['__tag_' + set] = true;
                }
                else {
                    var p = set.split('=');
                    this['__tag_' + p[0]] = p[1];
                }
            });
        };

        parseContent(app.getAttribute('content'));
        var children = app.children;
        var def, matched;
        for (var i = 0; i < children.length; ++i) {
            var node = children[i];
            var url = node.getAttribute('url');
            if (url && document.domain.match(url)) {
                matched = true;
                parseContent(node.getAttribute('content'));
            } else if (url == undefined) {
                def = node.getAttribute('content');
            }
        }
        ;
        if (!matched)
            parseContent(def);
    } else {
        if (ISNATIVE) {
            var p;
            if (p = egret.getOption('debug'))
                __tag_debug = p == 'true';
            if (p = egret.getOption('verbose'))
                __tag_verbose = p == 'true';
            if (p = egret.getOption('version'))
                __tag_version = p;
            if (p = egret.getOption('publish'))
                __tag_publish = p == 'true';
        }
        else {
            alert("没有配置 app 的基础信息");
        }
    }

    // 测试版标志
    export var ISDEBUG: boolean = typeof(__tag_debug) == 'undefined' ? false : __tag_debug;
    // 打印日志标志
    export var VERBOSE: boolean = typeof(__tag_verbose) == 'undefined' ? false : __tag_verbose;
    // 版本号
    export var APPVERSION: string = typeof(__tag_version) == 'undefined' ? '' : __tag_version;
    // 发布版本标志
    export var PUBLISH: boolean = typeof(__tag_publish) == 'undefined' ? false : __tag_publish;

    // 如果是runtime，需要提供
    /*
      options[@"debug"] = @"true";
      options[@"verbose"] = @"true";
      options[@"version"] = @"1.0.0";
      options[@"publish"] = @"false";   
    */

}
