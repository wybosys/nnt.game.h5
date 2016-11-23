/// <reference path="service.ts" />

module nn {
    export let Application;
    export let Classname:(c:any)=>string;
}

module injected {

    class ImpSvcApp
    extends nn.ServiceInjected
    {
        constructor() {
            super();
            this.wait(nn.model.NodeList.CMD, this.cmdNodeList, this);
        }

        private cmdNodeList(m:hd.model.NodeList) {
            let c = findElementById(m.id);
            m.children.length = 0;
            if (c) {
                let cr = c.children;
                for (let i = 0; i < cr.length; ++i) {
                    let c = cr[i];                    
                    let node = {
                        id: c.hashCode,
                        name: nn.Classname(c),
                        expandable: c.children.length != 0
                    };

                    m.children.push(node);
                }
            }
        }
    }

    export function findElementById(id:number, parent?:any):any {
        if (id == 0)
            return nn.Application.shared;
        if (parent == null)
            parent = nn.Application.shared;
        let cr = parent.children;
        for (let i = 0; i < cr.length; ++i) {
            let c = cr[i];
            if (c.hashCode == id)
                return c;
            c = findElementById(id, c);
            if (c)
                return c;
        }
        return null;
    }

    let SvcApp = new ImpSvcApp();

}
