export abstract class Resource {

    // 刷新资源
    abstract async refresh(): Promise<boolean>;

    // 发布资源
    abstract async publish(): Promise<boolean>;

    // 打包资源
    abstract async dist(): Promise<boolean>;
}