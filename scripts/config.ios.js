"use strict";
/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>
var built_in_1 = require("built-in");
var defaultConfig = require("./config");
var config = {
    buildConfig: function (params) {
        var target = params.target, command = params.command, projectName = params.projectName, version = params.version;
        var outputDir = "../" + projectName + "_ios/assets/game";
        return {
            outputDir: outputDir,
            commands: [
                new built_in_1.CompilePlugin({ libraryType: "debug", defines: { DEBUG: false, RELEASE: true } }),
                new built_in_1.ExmlPlugin('commonjs'),
                new built_in_1.CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                new built_in_1.UglifyPlugin([{
                        sources: ["main.js"],
                        target: "main.min.js"
                    }]),
                new built_in_1.ManifestPlugin({ output: 'manifest.json' })
            ]
        };
    },
    mergeSelector: defaultConfig.mergeSelector,
    typeSelector: defaultConfig.typeSelector
};
module.exports = config;
