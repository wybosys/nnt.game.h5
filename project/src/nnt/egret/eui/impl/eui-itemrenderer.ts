module eui {

    export class ItemRendererU extends eui.ItemRenderer {
        public slots: string = null;
        public tag: any = null;

        onPartBinded(name: string, target: any) {
            _EUIExt.onPartBinded(this, name, target);
        }

        goBack() {
            _EUIExt.goBack(this);
        }

        /** 隶属于的控件，可以方便业务层的数据穿透 */
        belong: any;

        dispose() {
            this.belong = null;
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
