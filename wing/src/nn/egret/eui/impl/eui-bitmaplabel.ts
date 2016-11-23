module eui {

    export class BitmapLabelU
    extends eui.BitmapLabel
    {
        protected onPartBinded = _EUIExtPROTO.onPartBinded;

        set exhibition(b:boolean) {
            _EUIBaseExtPROTO.setExhibition.call(this, b);
        }
        get exhibition():boolean {
            return _EUIBaseExtPROTO.getExhibition.call(this);
        }

        private _value:any;
        get value():any {
            return this._value;
        }
        set value(v:any) {
            this._value = v;
            if (v == null) {
                this.text = '';
                return;
            }
            if (this._format) {
                let args = nn.ArrayT.Concat([this._format], nn.ArrayT.ToArray(v));
                this.text = nn.formatString.apply(null, args);
            } else {
                this.text = nn.asString(v);
            }
        }

        private _format:string = null;
        public get format():string {
            return this._format;
        }
        public set format(fmt:string) {
            this._format = fmt;
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