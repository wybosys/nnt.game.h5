var manifest = JSON.parse(egret_native.readFileSync("manifest.json"));
var game_file_list = manifest.initial.concat(manifest.game);

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        //Control whether some optimization options are open
        var result = egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};
