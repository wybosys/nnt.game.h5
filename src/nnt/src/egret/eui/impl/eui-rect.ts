module eui {

    export class RectU
        extends eui.Rect {
        onPartBinded(name: string, target: any) {
            _EUIExt.onPartBinded(this, name, target);
        }

        onAppeared() {
        }

        onDisappeared() {
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
    }

    export class RoundU
        extends RectU {
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
