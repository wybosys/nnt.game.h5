module eui {

    // 扩展 EXMLParser 以支持自定义的处理
    Js.OverrideFunction(eui.sys.EXMLParser.prototype, 'createIdForNode', function (orifn: (node) => void, node) {
        orifn.call(this, node);
        // 如过支持on的操作，则需要将id放到skinParts中，用以之后的处理
        if (node.attributes["slots"]) {
            let id = node.attributes.id;
            this.skinParts.push(id);
            this.currentClass.addVariable(new sys.EXVariable(id));
        }
    });

}