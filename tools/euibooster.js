"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};

/**
 * Created by jackyanjiaqi on 16/7/4.
 */
//import xml = require("./xml/index")
const CONFIG = require("./config");
const path = require("path");
//全局配置项目根目录
CONFIG.setDir(path.join(__dirname, "../"));
const file = require("./file");
// import euiParser = require("./parser");
const exml_service = require("./exml-service/componentScanner");
const themeParser = require("./themeParser");
const exmlParser = require("./eui/parser/EXMLParser");
var parser = new exmlParser.EXMLParser();

//hackparser
const cfg = require("./eui/parser/EXMLConfig");
var OLD_ADDIDS = parser.addIds;
parser.addIds = function(items) {
    //遍历所有的items，处理含有slots节点的
    if (items) {
        for (var i = 0, len = items.length; i < len; ++i) {
            var node = items[i];
            if (node.namespace == cfg.NS_W || !node.localName) {
            }
            else if (this.isProperty(node)) {
            }
            else if (node.nodeType === 1) {
                var id = node.attributes["id"];
                if (id == null) {
                    var slots = node.attributes["slots"];
                    if (slots)
                        this.createIdForNode(node);
                }
            }
        }
    }
    OLD_ADDIDS.call(this, items);
};

function run() {
   return __awaiter(this, void 0, void 0, function* () {
        console.log(__dirname);
        //解析参数
        let args = process.argv.slice(2);
        if ("clean" === args[0]) {
            CONFIG.isClean = true;
            args = args.slice(1);
        }
        //配置egret项目目录
        let projectDir = args[0];
        if (file.exists(path.join(CONFIG.getDir(), projectDir))) {
            projectDir = path.join(CONFIG.getDir(), projectDir);
        }
        CONFIG.setProjectDir(projectDir);
        args = args.slice(1);
        //配置游戏发布目录
        let releaseDir = args[0];
        if (!file.exists(releaseDir)) {
            releaseDir = path.join(CONFIG.getProjectDir(), releaseDir);
        }
        CONFIG.setReleaseDir(releaseDir);
        args = args.slice(1);
        //配置config(或动态解析)
        if (!CONFIG.isClean && !CONFIG.get()) {
            let configFilePath = null;
            if (args[0]) {
                configFilePath = args[0];
                CONFIG.set(configFilePath);
            }
            else {
                let config = yield exml_service.run(CONFIG.getProjectDir());
                console.log(`config generated!`);
                //测试用
                // let date:Date = new Date();
                // configFilePath = path.join(CONFIG.getDir(),`test/config_gen_${date.toDateString()}.json`);
                // file.save(configFilePath,JSON.stringify(config,null,4));
                // console.log(`Config file generated!Save to ${configFilePath}`);
                CONFIG.set(config);
            }
        }
        // let content = file.read(inputFilePath);
        // var returnObj  = xml.parse(content);
        let themes = themeParser.read();
        if (themes && themes.length > 0) {
            let ishandled = false;
            themes.forEach(theme => {
                for (let i = 0; i < theme.exmls.length; i++) {
                    let exmlItem = theme.exmls[i];
                    // var xmlString = file.read(exmlItem.content);
                    if (CONFIG.isClean) {
                        delete exmlItem.gjs;
                        delete exmlItem.className;
                        //恢复exmlItem.content
                        if (!exmlItem.content) {
                            exmlItem.content = file.read(path.join(CONFIG.getProjectDir(), exmlItem.path));
                        }
                        ishandled = true;
                    }
                    else {
                        console.log("parsing:", exmlItem.path);
                        exmlItem.gjs = parser.parse(exmlItem.content);
                        //测试用
                        // if(
                        //     // exmlItem.path.indexOf("TPanel.exml")!==-1 ||
                        //     exmlItem.path.indexOf("SendToDesktopAlertSkin.exml")!==-1
                        // ){
                        //     console.log(exmlItem.gjs);
                        // }
                        exmlItem.className = parser.className;
                        delete exmlItem.content;
                        ishandled = true;
                    }
                }
            });
            themeParser.save();
            if (ishandled) {
                console.log("Done!");
            }
        }
        // let inputFilePath = process.argv[2];
        // if(!file.exists(inputFilePath)){
        //     inputFilePath = path.join(CONFIG.getDir(),inputFilePath);
        // }
        // console.log(inputFilePath);
        // var xmlString = file.read(inputFilePath);
        // return {
        //     text: parser.parse(xmlString),
        //     className: parser.className
        // };
    });
}
exports.run = run;
// run();
run().catch(error => console.log(error));
//# sourceMappingURL=../sourcemap/index.js.map
