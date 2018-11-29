module eui {

    export class PageStackU extends eui.ViewStack {
        onPartBinded(name: string, target: any) {
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
    _PROTO['showOrHide'] = function (child, visible: boolean) {
        let self = <any>this;
        _FUN.call(self, child, visible);
        if (visible) {
            if (child.onAppeared)
                child.onAppeared();
            ComponentU.ProcessAppeared(child);
        } else {
            if (child.onDisappeared)
                child.onDisappeared();
            ComponentU.ProcessDisppeared(child);
        }
    };

}
