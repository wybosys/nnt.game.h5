module nn {

    export class Widget extends Component {
        constructor() {
            super();
            this.touchChildren = false;
        }

        protected hitTest(x: number, y: number): any {
            if (this.touchEnabled == false)
                return null;
            return super.hitTest(x, y);
        }
    }

    export class Sprite extends Component implements IPage {

        constructor() {
            super();
        }

        pathKey: string;

        // 重用控件，以避免大量制作成员变量来承载简单控件
        private _reuseUis: KvObject<any, any>;

        reuse(idr: any, cb: () => any, ctx: any): any;
        reuse(idr: any, cls: any): any;
        reuse(idr: any): any;
        reuse(...params: any[]): any {
            if (this._reuseUis == null)
                this._reuseUis = new KvObject<string, any>();
            let obj = this._reuseUis[params[0]];
            if (obj == null) {
                if (params.length == 3) {
                    obj = params[1].call(params[2]);
                } else if (params.length == 2) {
                    let o = params[1];
                    if (typeof(o) == 'function')
                        obj = new params[1]();
                    else
                        obj = o;
                }
                if (obj) {
                    if (obj instanceof CComponent)
                        this.addChild(obj);
                    this._reuseUis[params[0]] = obj;
                }
            }
            return obj;
        }
    }

    export class SpriteWrapper extends Component {
        constructor(cnt?: Component) {
            super();
            if (cnt)
                this.contentView = cnt;
        }

        dispose() {
            super.dispose();
            this.contentView = null;
        }

        _contentView: Component;
        get contentView(): Component {
            return this._contentView;
        }

        set contentView(cnt: Component) {
            if (this._contentView == cnt)
                return;
            if (this._contentView) {
                this.removeChild(this._contentView);
            }
            this._contentView = cnt;
            if (this._contentView) {
                this.addChild(this._contentView);
            }
        }

        updateLayout() {
            super.updateLayout();
            if (this._contentView)
                this._contentView.frame = this.boundsForLayout();
        }
    }

}
