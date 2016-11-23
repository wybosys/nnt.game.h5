module eui {

    export class RadioButtonU
    extends eui.RadioButton
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