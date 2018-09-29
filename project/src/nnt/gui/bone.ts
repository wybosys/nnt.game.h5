module nn {

    /** 骨骼的配置信息 */
    export class BoneConfig implements IReqResources {
        /**
         @name 骨骼动画的名称，如果设置name而不设置其他，则使用 name 和默认规则来生成缺失的文件
         @character 角色名称，通常和name一致
         @skeleton 动作的配置文件，通常为动作名 skeleton_json 结尾
         @place 材质节点的位置配置文件，通常为 texture_json 结尾
         @texture 图片文件，通常为 texture_png 结尾
         */
        constructor(name?: string, character?: string,
                    skeleton?: string, place?: string, texture?: string) {
            this._name = name;
            if (!character)
                this._character = name;
            else
                this._character = character;
            if (!skeleton)
                this._skeleton = name + '_skeleton';
            else
                this._skeleton = skeleton;
            if (!place)
                this._place = name + '_texture_json';
            else
                this._place = place;
            if (!texture)
                this._texture = name + '_texture_png';
            else
                this._texture = texture;
        }

        // 预加载资源组
        resourceGroups: Array<string>;

        protected _skeleton: string;
        protected _place: string;
        protected _texture: string;
        protected _character: string;
        fps: number; // 骨骼的速度

        protected _name: string;
        get name(): string {
            return this._name;
        }

        set name(v: string) {
            this._name = v;
            if (!this._character)
                this._character = name;
            if (!this._skeleton)
                this._skeleton = name + '_skeleton';
            if (!this._place)
                this._place = name + '_texture_json';
            if (!this._texture)
                this._texture = name + '_texture_png';
        }

        set skeleton(v: string) {
            this._skeleton = v;
        }

        get skeleton(): string {
            return this._skeleton;
        }

        set place(v: string) {
            this._place = v;
        }

        get place(): string {
            return this._place;
        }

        set texture(v: string) {
            this._texture = v;
        }

        get texture(): string {
            return this._texture;
        }

        set character(v: string) {
            this._character = v;
        }

        get character(): string {
            return this._character;
        }

        getReqResources(): Array<ReqResource> {
            let r = [];
            r.push(new ResourceEntity(this.skeleton, ResType.BINARY));
            r.push(new ResourceEntity(this.place, ResType.JSON));
            r.push(new ResourceEntity(this.texture, ResType.TEXTURE));
            return r;
        }
    };

    export type BoneSource = BoneData | BoneConfig | UriSource;

    /** 业务使用的骨骼显示类 */
    export abstract class CBones extends Widget {
        constructor() {
            super();
        }

        protected _initSignals() {
            super._initSignals();
            // 骨骼开始播放
            this._signals.register(SignalStart);
            // 一次 motion 结束
            this._signals.register(SignalEnd);
            // 所有循环的结束
            this._signals.register(SignalDone);
            // 骨骼改变，当骨骼资源变更时激发
            this._signals.register(SignalChanged);
            // 骨骼更新，和change的区别在update每一次设置source都会激发
            this._signals.register(SignalUpdated);
        }

        /** 骨骼的配置 */
        boneSource: BoneSource;

        /** 同一批骨骼的大小可能一直，但有效区域不一致，所以可以通过该参数附加调整 */
        additionScale: number = 1;

        /** 骨骼填充的方式，默认为充满 */
        fillMode: FillMode = FillMode.ASPECTSTRETCH;

        /** 对齐位置 */
        clipAlign: POSITION = POSITION.BOTTOM_CENTER;

        /** 具体动作 */
        motion: string;

        abstract pushMotion(val: string);

        abstract popMotion();

        /** 当前含有的所有动作 */
        abstract motions(): Array<string>;

        /** 是否含有该动作 */
        abstract hasMotion(val: string): boolean;

        /** 自动开始播放 */
        autoPlay = true;

        /** 播放次数控制
         -1: 循环
         0: 使用文件设置的次数
         >0: 次数控制
         */
        count: number = -1;

        /** 播放 */
        abstract play();

        /** 停止播放 */
        abstract stop();
    }
}
