(function wybosyslogo() {
    var tpl = '<div id="launchDiv" \
style="position:fixed;width:100%;height:100%;background-color:white;"> \
<img src="http://g.hgame.com/pt/wybosyslogo.png" \
style="position:absolute;top:50%;width:30%;" \
/> \
</div>';
    var e = $(tpl);
    $(document.body).append(e);
    var img = e.find('img');
    img.height(296 / 244 * img.width());
    img.css('margin-top', -img.height()/2);
    img.css('margin-left', -img.width()/2);
})();
