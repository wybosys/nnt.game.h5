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
        }

        //data:model.Guide;
        direction: nn.Direction;
        private _target: eui.UiType;
    }
}
