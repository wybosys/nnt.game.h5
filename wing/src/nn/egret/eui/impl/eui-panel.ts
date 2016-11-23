module eui {

    export class PanelU
    extends eui.Panel
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
    
}
