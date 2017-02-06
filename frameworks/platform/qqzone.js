(function(platform, qqzone) {
    var landscape = $(window).width() > $(window).height();
    var tpl = "\
  <div id='launchDiv' style='position:fixed;width:100%;height:100%;background-color:#f7f7f7;'>\
    <div style='display:block;margin:0 auto;position:relative;left:50%;width:640px;height:960px;margin-top:{{sp0}}px;margin-left:-320px;'>\
        <img id='qqzone_icon' style='width:180px;height:180px;margin:0 auto;margin-top:{{sp0}}px;margin-bottom:{{sp1}}px;'/>\
        <img style='display:block;margin:0 auto;margin-bottom:{{sp2}}px;width:319px;height:64px;'\
             src='http://g.hgame.com/pt/wanbatext.jpg' />\
        <img style='display:block;margin:0 auto;margin-bottom:{{sp3}}px;width:333px;height:27px;'\
             src='http://g.hgame.com/pt/wanbatips.png' />\
        <div style='height:7px;'>\
             <div style='width:366px;height:100%;background-color:#8c8c8c;border-radius:4px;margin:0 auto;'>\
                  <div id='qqzone_value' style='width:0;height:100%;background-color:#f2c03e;border-radius:4px;'>\
                       <img id='qqzone_star' class='cw' style='display:block;position:relative;top:-10px;left:-10px;'\
                            src='http://g.hgame.com/pt/wanbastar.png' />\
                  </div>\
             </div>\
        </div>\
  <style>\
    .cw {\
    -webkit-animation-name:'ani_cw';\
	-webkit-animation-duration:1s;\
	-webkit-animation-timing-function:linear;\
	-webkit-animation-iteration-count:infinite;\
    }\
    @-webkit-keyframes 'ani_cw' {\
    from {}\
    to {\
    -webkit-transform:rotate(360deg);\
    }\
    }\
    #launchDiv div {\
    position:relative;\
}\
  </style>\
  </div>";
    
    qqzone.scale = Math.min($(window).width(), $(window).height()) / 640;
    var p = landscape?
            {sp0:90*qqzone.scale,
             sp1:30,
             sp2:100,
             sp3:20}:
        {sp0:184*qqzone.scale,
         sp1:40,
         sp2:190,
         sp3:24};
    var scr = $(Mustache.render(tpl, p));
    if (qqzone.scale < 1)
        scr.css('zoom', qqzone.scale);
    $(document.body).append(scr);
    
    var icon = $('#qqzone_icon')[0];
    icon.src = nn.loader.icon;
    
    function qqzone_progress(value) {
        var nv = $('#qqzone_value');
        nv.width(value * 100 + '%');
        var ns = $('#qqzone_star');
        ns.css('left', -10 + nv.width() + 'px');
    }

    var pos=0;
    function ani() {
        qqzone_progress(pos);
        if (pos <= 1) {
            pos+=0.01;
            setTimeout(ani, 10);
        }
    }
    ani();

    platform.landscapenotify = function() {
        if (platform.notifyscr == null)
            platform.loadScript('qqzone_landscapenotify.js');
        else
            platform.notifyscr.show();
    };
    platform.portraitnotify = function() {
        if (platform.notifyscr == null)
            platform.loadScript('qqzone_portraitnotify.js');
        else
            platform.notifyscr.show();
    };
})(nn.platform, nn.platform.qqzone || (nn.platform.qqzone = {}));
