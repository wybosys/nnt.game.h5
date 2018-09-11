module eui {

    export class RadioButtonU extends eui.RadioButton {
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
