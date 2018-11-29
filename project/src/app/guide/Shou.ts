module app.guide {
    interface IShou {
        //slot {
        //slot }
    }

    export class Shou
        extends eui.DialogU
        implements IShou {
        //skin {
        //skin }

        constructor(target: eui.UiType) {
            super();
        }

        //data:model.Guide;
        direction: nn.Direction;
        private _target: eui.UiType;
    }
}
