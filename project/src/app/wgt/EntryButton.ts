module app.wgt {
    interface IEntryButton {
        //slot {
        //slot }
    }

    export class EntryButton
        extends eui.ButtonU
        implements IEntryButton {

        //skin {
        iconDisplay: eui.ImageU;
        labelDisplay: eui.LabelU;
        spBkg: eui.RectU;

        //skin }

        onLoaded() {
            let br = new nn.Brush();
            br.color = nn.Color.Random();
            this.spBkg.brush = br;

            // 如果绑定了entryid
            if (this._dentry) {

                // 处理模块打开
                this.signals.connect(nn.SignalClicked, this._actOpenEntry, this);

                // 处理新手
                manager.guide.signals.connect(kSignalShowGuide, this._updateGuide, this);
                this._updateGuide();
            }
        }

        // 实体标记，用来自动打开
        _dentry: data.Entry;

        public get entryIdr(): string {
            return this._dentry ? this._dentry.entryIdr : null;
        }

        public set entryIdr(v: string) {
            this._dentry = data.Entry.FromIdr(v);
        }

        // 用来显示标记的方向，现在给新手导引用
        public guideDirection: string = null;

        private _actOpenEntry() {
            if (!this._dentry)
                return;

            // 关闭新手
            this.clearGuide();

            // 跳转到模块
            this._dentry.open();
        }

        // 当前的新手数据
        _guide: data.Guide;

        clearGuide() {
            if (this._guide) {
                manager.guide.setReaded(this._guide);
                this._guide = null;
            }
        }

        // 当现实隐藏时，更新新手
        onVisibleChanged() {
            super.onVisibleChanged();
            if (this._guide)
                this._showGuide();
        }

        // 更新新手数据
        protected _updateGuide() {
            let guide = manager.guide.findGuide(this.entryIdr);
            if (guide == this._guide)
                return;
            this._guide = guide;
            this._showGuide();
        }

        // 显示新手
        protected _showGuide() {
            // 当前没有新手数据
            if (!this._guide) {
                return;
            }

            // 如果当前的没有显示在舞台上，则不显示新手
            if (nn.isAppearing(this) == false)
                return;

            // 如果当前打开的desktop不是控件的直接父级，则需要关闭所有的弹出窗口
            if (nn.Desktop.Current() != eui.DesktopU.FromView(this))
                nn.Desktop.CloseAllOpenings();

            let dlg = new guide.Shou(this);
            dlg.data = this._guide;
            dlg.direction = nn.DirectionFromString(this.guideDirection);
            dlg.open(true);
        }
    }
}
