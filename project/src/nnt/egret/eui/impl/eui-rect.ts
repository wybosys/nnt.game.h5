module eui {

    import CBrush = nn.CBrush;

    export class RectU extends eui.Rect {

        onPartBinded(name: string, target: any) {
            _EUIExt.onPartBinded(this, name, target);
        }

        updateCache() {
            this.validateDisplayList();
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

        private _brush: nn.CBrush;

        get brush(): nn.CBrush {
            return this._brush;
        }

        set brush(br: nn.CBrush) {
            this._brush = br;
            this.fillColor = br.color.rgba;
        }

        private _painter: nn.Painter;
        get painter(): nn.Painter {
            if (!this._painter)
                this._painter = new nn.Painter(this.graphics);
            return this._painter;
        }
    }

    export class RoundU extends RectU {
        updateDisplayList(unscaledWidth: number, unscaledHeight: number) {
            let gra = this.graphics;
            gra.clear();
            if (this.fillColor != null) {
                gra.beginFill(this.fillColor, this.fillAlpha);
                gra.drawEllipse(0, 0, unscaledWidth, unscaledHeight);
                gra.endFill();
            }
            if (this.strokeWeight > 0) {
                gra.lineStyle(this.strokeWeight,
                    this.strokeColor,
                    this.strokeAlpha);
                gra.drawEllipse(0, 0, unscaledWidth, unscaledHeight);
            }
        }
    }

}
