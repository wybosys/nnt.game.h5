/// <reference path="n2dev.d.ts" />

module app.api {
    
}

module app.dev {
    
    export function main(node:nn.dom.DomObject) {
        node.css = "width:100%;height:100%;";
        webix.ui({
            rows:[
                {cols:[
                    {view:'label', label:'物品索引', width:100, height:30},
                    {view:'text', value:'', width:100, height:30},
                    {view:'label', label:'数量', width:100, height:30},
                    {view:'text', value:'', width:100, height:30},
                ]},
                {id:'::dt::btn::execute', view:'button', value:'Execute'}
            ],
            container:node.node
        });
        // 调用api
        let btn = $$('::dt::btn::execute').attachEvent('onItemClick', ()=>{
            
        });
    }
    
}