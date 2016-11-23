var nn;
(function(nn){
    var platform = {version:'0.1.1', debug:false, url:'http://g.hgame.com/pt/'};
    platform.debug && (platform.url = 'http://game.hd.com/platform/');
    nn.platform = platform;
    var respath = function(f,v) {
        return platform.url + f + '?' + (v ? v : platform.version);
    };
    platform.respath = respath;
    var loadScript = function(js, v) {
        var s = document.createElement('script');
        s.async = false;
        s.src = respath(js, v);
        document.body.appendChild(s);
    };
    platform.loadScript = loadScript;
    loadScript(platform.debug?'zepto.js':'zepto.min.js', '0.0.1');
    loadScript(platform.debug?'mustache.js':'mustache.min.js', ' ');
    function getTagValue(name,attr,def) {
        var tag = document.getElementsByTagName(name)[0];
        var v = tag.getAttribute(attr);
        return v ? v : def;
    };
    platform.onorientationchanged = function(ori) {
        if (ori != platform.orientation) {
            var notify = platform.orientation == 0 ? platform.portraitnotify : platform.landscapenotify;
            notify && notify();
        } else if (platform.notifyscr) {
            platform.notifyscr.hide();
        }
    };
    platform.orientation = 0;
    platform.landscapenotify = null;
    platform.portraitnotify = null;
    var loader;
    (function(loader){
        var domain = document.domain;
        var ua = navigator.userAgent;
        var channel = 'wybosys';
        if (/myqcloud.com/i.test(domain)) {
            if (ua.indexOf("qzone") >= 0) {
                channel = 'qqzone';
            } else {
                channel = 'empty';
            }
        }
        var icon = getTagValue('app', 'icon', 'http://g.hgame.com/pt/wybosys.png');
        loader.channel = channel;
        loader.icon = icon;
        var splashstart = function(){
            switch(channel) {
            case 'qqzone':{
                loadScript('qqzone.js');
            } break;
            case 'wybosys': {
                loadScript('wybosyslogo.js');
            } break;
            default: {
                loadScript('default.js');
            } break;
            }
            // 保护一下业务js先加载好导致launch不能及时关掉
            var funwd = function() {
                if (nn.Application == null || nn.Application.shared == null) {
                    setTimeout(funwd, 200);
                    return;
                }
                var launchdiv = document.getElementById('launchDiv');
                if (launchdiv) {
                    launchdiv.parentElement.removeChild(launchdiv);
                    return;
                }
            };
            setTimeout(funwd, 200);
        };
        loader.splashstart = splashstart;
    })(loader = nn.loader || (nn.loader = {}));
})(nn || (nn = {}));

nn.loader.splashstart();

