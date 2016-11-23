module eui {

    export class ToggleSwitchU
    extends eui.ToggleSwitch
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