/// <reference path="service.ts" />

class ImpSvcApp
extends nn.ServiceContent
{
    constructor() {
        super();
        this.command(nn.model.NodeList.CMD);
    }
}

var SvcApp = new ImpSvcApp();

