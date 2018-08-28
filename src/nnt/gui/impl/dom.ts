module nn {

    // 只能用在单player的模式下
    export class Div
        extends CDom {
        constructor() {
            super();

            // 创建dom对象
            let p: any = document.querySelector('.egret-player');
            this._node = document.createElement('div');
            this._node.style.cssText = 'position:absolute;';
            p.appendChild(this._node);
        }

        private _node: any;

        dispose() {
            this._node.remove();
            super.dispose();
        }

        private _html: string;

        get text(): string {
            return this._html;
        }

        set text(text: string) {
            this._html = text;
            this._node.innerHTML = text;

            // 填满
            let f = this._node.children[0];
            if (f) {
                f.style.width = '100%';
                f.style.height = '100%';
            }
        }

        onAppeared() {
            super.onAppeared();
            this._node.style.display = 'block';
        }

        onDisappeared() {
            super.onDisappeared();
            this._node.style.display = 'none';
        }

        updateLayout() {
            super.updateLayout();
            let rc = this.bounds();
            rc = this.convertRectTo(rc, null);

            rc.x *= DomScaleFactorX * ScaleFactorX;
            rc.y *= DomScaleFactorY * ScaleFactorY;
            rc.x += DomOffsetX;
            rc.y += DomOffsetY;
            rc.width *= DomScaleFactorX * ScaleFactorX;
            rc.height *= DomScaleFactorY * ScaleFactorY;

            this._node.style.left = rc.x + 'px';
            this._node.style.top = rc.y + 'px';
            this._node.style.width = rc.width + 'px';
            this._node.style.height = rc.height + 'px';
        }
    }

}