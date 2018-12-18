module app.list {

    export interface ListButtonData {
        label:string;
    }

    export class ListButton
        extends wgt.EntryButton {

        data: ListButtonData;

        updateData() {
            super.updateData();
            this.label = this.data.label;
        }
    }
}
