module eui {

    export class PageStackU
    extends eui.ViewStack
    {
        onPartBinded(name:string, target:any) {
            _EUIExt.onPartBinded(this, name, target);
        }
        
        dispose() {
        }

        drop() {
            this.dispose();
        }

        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.drop();
        }
    }

    let _PROTO = PageStackU.prototype;
    let _FUN = _PROTO['showOrHide'];
    _PROTO['showOrHide'] = function (child:egret.DisplayObject, visible:boolean) {
        let self = <any>this;
        _FUN.call(self, child, visible);
        if (visible)
            ComponentU._ProcessAppeared(child);
        else
            ComponentU._ProcessDisppeared(child);
    };
 
}
