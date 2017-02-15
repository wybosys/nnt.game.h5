module eui {

    export class WrapperU
    extends eui.ComponentU
    {
        private _content:ComponentU;
        get content():ComponentU {
            return this._content;
        }
        set content(c:ComponentU) {
            if (this._content == c)
                return;
            if (this._content)
                this.removeChild(this._content);
            this._content = c;
            if (c) {
                c.left = c.right = 0;
                c.top = c.bottom = 0;
                this.addChild(c);
            }
        }
    }    
    
}