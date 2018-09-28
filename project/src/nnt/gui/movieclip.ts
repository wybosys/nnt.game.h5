module nn {

    export type ClipSource = ClipConfig;

    export abstract class CMovieClip extends Widget {
        constructor() {
            super();
            //this.backgroundColor = Color.Red;
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalStart);
            this._signals.register(SignalChanged);
            this._signals.register(SignalUpdated);
            this._signals.register(SignalEnd);
            this._signals.register(SignalDone);
        }

        /** 播放次数，-1代表循环，默认为一次*/
        count = 1;

        /** 帧率 */
        fps: number;

        /** 切换clipSource时清空原来的clip */
        clearOnChanging: boolean = true;

        /** 序列帧资源 */
        clipSource: ClipSource;

        /** 目标序列帧的名称 */
        clip: string;

        /** 序列帧播放的位置 */
        location: number;

        // 需要在disap的时候暂停count＝－1的动画
        onAppeared() {
            super.onAppeared();
            if (this.__autopaused) {
                this.__autopaused = false;
                this.play();
            }
        }

        private __autopaused: boolean;

        onDisappeared() {
            super.onDisappeared();
            if (this.isPlaying() && this.count == -1) {
                this.__autopaused = true;
                this.stop();
            }
        }

        /** 是否自动播放 */
        autoPlay: boolean = true;

        /** 是否正在播放 */
        abstract isPlaying(): boolean;

        /** 暂停动画 */
        abstract stop();

        /** 播放动画 */
        abstract play();

        /** 附加缩放 */
        additionScale: number = 1;

        /** 填充方式 */
        fillMode: FillMode = FillMode.ASPECTSTRETCH;

        /** 反方向播放 */
        reverseMode: boolean;

        /** 序列帧的对齐位置 */
        clipAlign: POSITION = POSITION.CENTER;

        /** flashMode 采用 flash 标记的锚点来显示动画
         @note 这种模式下请设置 fillMode 为 CENTER
         */
        flashMode: boolean;

        /** flashAnchor flash模式下使用的锚点信息 */
        flashAnchorPoint: Point;
    }

    export class ClipConfig implements IReqResources {

        /**
         @name 资源名称，资源由 json\bmp 组成，如过传入的时候没有带后缀，则自动加上后缀
         @res 动作文件，通常为 _json
         @tex 素材平成，通常为 _png
         */
        constructor(name?: string, res?: string, tex?: string) {
            this._name = name;
            this._frame = nonnull1st(null, res, name);
            this._texture = nonnull1st(null, tex, res, name);
        }

        private _frame: UriSource; // 帧配置文件
        private _texture: UriSource; // 素材配置文件

        set frame(frm: UriSource) {
            this._frame = frm;
        }

        get frame(): UriSource {
            let src = this._frame;
            if (src) {
                // 如过是普通key，则需要判断有没有加后缀，不存在需要自动补全
                if (src.indexOf('://') == -1) {
                    if (src.indexOf('_json') == -1)
                        src += '_json';
                }
            }
            return src;
        }

        set texture(tex: UriSource) {
            this._texture = tex;
        }

        get texture(): UriSource {
            let src = this._texture;
            if (src) {
                if (src.indexOf('://') == -1) {
                    if (src.indexOf('_png') == -1)
                        src += '_png';
                }
            }
            return src;
        }

        /** 名字 */
        private _name: string;
        get name(): string {
            return this._name;
        }

        set name(n: string) {
            this._name = n;
            if (this._frame == null)
                this._frame = n;
            if (this._texture == null)
                this._texture = n;
        }

        /** OPT 帧速 */
        fps: number;

        /** OPT 依赖的资源组 */
        resourceGroups: Array<string>;

        /** OPT 附加缩放 */
        additionScale: number;

        /** OPT 是否为独立数据，否则同一个资源公用一份帧数据 */
        key: string = '';

        get hashCode(): number {
            return StringT.Hash(this.name + "::" + this._frame + "::" + this._texture + '::' + this.key);
        }

        isEqual(r: this): boolean {
            return this.name == r.name &&
                this._frame == r._frame &&
                this._texture == r._texture &&
                this.fps == r.fps &&
                this.additionScale == r.additionScale &&
                this.key == r.key;
        }

        getReqResources(): Array<ReqResource> {
            let r = [];
            r.push(new ResourceEntity(this.frame, ResType.JSON));
            r.push(new ResourceEntity(this.texture, ResType.TEXTURE));
            return r;
        }

        toString(): string {
            return [this.name, this._frame, this._texture, this.key].join("\n");
        }
    }

}
