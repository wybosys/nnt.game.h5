module eui {

    export class PanelU
    extends eui.Panel
    {
        protected onPartBinded = _EUIExtPROTO.onPartBinded;

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