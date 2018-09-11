module eui {

    export class ToggleSwitchU extends eui.ToggleSwitch {
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

}
