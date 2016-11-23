/// <reference path="n2dev.d.ts" />
var app;
(function (app) {
    var dev;
    (function (dev) {
        function main(node) {
            node.css = "width:100%;height:100%;";
            webix.ui({
                rows: [
                    { cols: [
                            { view: 'label', label: '物品索引', width: 100, height: 30 },
                            { view: 'text', value: '', width: 100, height: 30 },
                            { view: 'label', label: '数量', width: 100, height: 30 },
                            { view: 'text', value: '', width: 100, height: 30 },
                        ] },
                    { view: 'button', value: 'Execute' }
                ],
                container: node.node
            });
        }
        dev.main = main;
    })(dev = app.dev || (app.dev = {}));
})(app || (app = {}));
