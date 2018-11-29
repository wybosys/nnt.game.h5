module app.guide {
    interface IShou {
        //slot {
        //slot }
    }

    export class Shou
        extends eui.DialogU
        implements IShou {
        //skin {
        idrBottom: eui.LabelU;
        idrLeft: eui.LabelU;
        idrRight: eui.LabelU;
        idrTop: eui.LabelU;
        mcShou: eui.MovieClipU;

        //skin }

        constructor(target: eui.UiType) {
            super();
            this.clickedToClose = true;
            this.onlyFiltersTouchEnabled = true;
            this.queue = manager.guide.queue;
            this._target = target;
            this.addFilter(this._target);
        }

        data: data.Guide;
        direction: nn.Direction;
        private _target: eui.UiType;

        onLoaded() {
            super.onLoaded();
            this.mcShou.play();
            this.updateData();
        }

        updateData() {
            super.updateData();

            if (this.direction)
                this.currentState = nn.DirectionToString(this.direction);
            else
                this.currentState = 'none';

            let idr: eui.LabelU;
            switch (this.direction) {
                case nn.Direction.UP:
                    idr = this.idrTop;
                    break;
                case nn.Direction.DOWN:
                    idr = this.idrBottom;
                    break;
                case nn.Direction.LEFT:
                    idr = this.idrLeft;
                    break;
                case nn.Direction.RIGHT:
                    idr = this.idrRight;
                    break;
            }

            if (idr) {
                idr.visible = true;
                idr.text = this.data.desc;
            }
        }

        updateLayout() {
            super.updateLayout();
            this.updateFilters();
        }

        bestPosition(): nn.Point {
            let tcenter = eui.ConvertPoint(this._target, nn.getBounds(this._target).center, null);
            return tcenter;
        }
    }
}
