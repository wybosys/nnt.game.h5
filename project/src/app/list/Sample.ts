module app.list {
    interface ISample extends nn.IEntry {
        //slot {
        _actLstClick(s?: nn.Slot);
        //slot }
    }

    export class Sample
        extends eui.SpriteU
        implements ISample {
        //skin {
        lstClick: eui.ListU;
        lstGen: eui.ListU;
        //skin }

        // 注意需要手动绑定listitem的实现类，否则无法更新数据
        lstClickItem = ListButton;
        lstGenItem = ListButton;

        entrySettings: nn.EntrySettings;

        onLoaded() {
            super.onLoaded();

            let lstgendata: ListButtonData[] = [];
            for (let i = 0; i < 100; ++i) {
                lstgendata.push({
                    label: '点击' + i
                });
            }
            this.lstGen.data = lstgendata;
        }

        _actLstClick(s?: nn.Slot) {
            let ii: eui.ItemInfo = s.data;
            let btn = <ListButton>ii.renderer;
            nn.Hud.Text(btn.data.label);
        }
    }

    nn.Entries.register(Sample);
}
