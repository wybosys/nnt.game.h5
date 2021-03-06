module app {

    class Manager extends nn.Managers {

        // 负责和sdk之间的通信
        sdk = this.register(new SdkManager());

        // 负责管理新手展示
        guide = this.register(new GuideManager());
    }

    export let manager: Manager;

    // 程序加载成功
    nn.CApplication.InBoot(() => {
        manager = new Manager();
        manager.onLoaded();
    });

    // 数据加载成功
    nn.CApplication.InData(() => {
        manager.onDataLoaded();
    });
}
