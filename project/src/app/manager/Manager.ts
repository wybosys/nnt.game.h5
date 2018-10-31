module app {

    class Manager extends nn.Managers {

        // 负责和sdk之间的通信
        sdk = this.register(new SdkManager());
    }

    export let manager: Manager;

    // 程序加载成功后初始化manager
    nn.CApplication.InBoot(() => {
        manager = new Manager();
        manager.onLoaded();
    });
}
