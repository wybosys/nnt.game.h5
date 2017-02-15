module nn {
    
    export class _FramesManager
    extends CFramesManager
    {
        launch(c:egret.DisplayObject) {
            EventHook(c, egret.Event.ENTER_FRAME, this.onRendering, this);
            EventHook(c, egret.Event.RENDER, this.onPrepare, this);
        }

        protected onPrepare() {
            this.__invalidating = false;
            super.onPrepare();
            // 如过更新的同时又加入了新的，则需要再一次刷新
            if (this.__invalidating)
                egret.callLater(this.invalidate, this);
        }

        private __invalidating:boolean;
        invalidate() {            
            this.__invalidating = true;
            egret.MainContext.instance.stage.invalidate();            
        }
    }

    loader.InBoot(()=>{
        FramesManager = new _FramesManager();
    });

}
