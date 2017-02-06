(function(platform, qqzone) {
    var tpl = '<div id="notify" style="background-color:#E0E0E0;position:absolute;left:0;top:0;width:100%;height:100%;display:block;"> \
<img src={{img}} style="zoom:{{scale}};margin-top:{{mt}}px;"/> \
</div>';    
    var html = Mustache.render(tpl, {
        img:platform.respath('wanbanotilandscape.png'),
        scale:qqzone.scale < 1 ? qqzone.scale : 1,
        mt:200*qqzone.scale
    });
    platform.notifyscr = $(html);
    $(document.body).append(platform.notifyscr);
})(nn.platform, nn.platform.qqzone);
