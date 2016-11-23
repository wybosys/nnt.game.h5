module eui {

    export class ProgressBarU
    extends eui.ProgressBar
    {
        protected onPartBinded = _EUIExtPROTO.onPartBinded;

        private _percent:hd.Percentage;
        get percent():hd.Percentage {
            if (this._percent == null)
                this._percent = new nn.Percentage();
            this._percent.max = this.maximum;
            this._percent.value = this.value;
            return this._percent;
        }
        set percent(p:hd.Percentage) {
            if (this._percent == null)
                this._percent = new nn.Percentage();
            this._percent.max = p.max;
            this._percent.value = p.value;
            this.maximum = p.max;
            this.value = p.value;
        }

        /** 通过设置一个格式化脚本来设置显示的文字格式 */
        private _format:string = null;
        public get format():string {
            return this._format;
        }
        public set format(fmt:string) {
            let name = tmp.rtname() + '_euiprogressbarlabelfunc';
            let exp = `
            tmp.${name} = function (value, max) {
                return ${fmt};
            }
            `;
            eval(exp);
            this.labelFunction = tmp[name];
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

        protected _data:any;
        get data():any {
            return this._data;
        }
        set data(d:any) {
            this._data = d;
            this.updateData();
        }

        updateData() {
        }
    }

}