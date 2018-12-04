module nn {

    export abstract class CParticle extends Widget {

        constructor() {
            super();
        }

        dispose() {
            this.stop();
            super.dispose();
        }

        protected _initSignals() {
            super._initSignals();
            this._signals.register(SignalStart);
            this._signals.register(SignalDone);
            this._signals.register(SignalUpdated);
            this._signals.register(SignalChanged);
        }

        /** 自动播放 **/
        autoPlay: boolean = true;

        /** 启动 **/
        abstract start();

        /** 停止 **/
        abstract stop();

        /** 是否正在播放 **/
        abstract isPlaying(): boolean;

        onAppeared() {
            super.onAppeared();
            if (this.__autopaused) {
                this.__autopaused = false;
                this.start();
            }
        }

        onDisappeared() {
            super.onDisappeared();
            if (this.isPlaying()) {
                this.__autopaused = true;
                this.stop();
            }
        }

        private __autopaused: boolean;
    }

    export class ParticleSource implements IReqResources {

        /**
         @name 资源名称，资源由 json\tex 组成，如过传入的时候没有带后缀，则自动加上后缀
         @res 动作文件，通常为 _json
         @tex 素材平成，通常为 _png
         */
        constructor(name?: string, config?: string, tex?: string) {
            this._name = name;
            this._config = nonnull1st(null, config, name);
            this._texture = nonnull1st(null, tex, config, name);
        }

        private _config: UriSource; // 帧配置文件
        private _texture: UriSource; // 素材配置文件

        /** 名字 */
        private _name: string;
        get name(): string {
            return this._name;
        }

        set name(n: string) {
            this._name = n;
            if (this._config == null)
                this._config = n;
            if (this._texture == null)
                this._texture = n;
        }

        set config(cfg: UriSource) {
            this._config = cfg;
        }

        get config(): UriSource {
            let src = this._config;
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

        get hashCode(): number {
            return StringT.Hash(this.name + "::" + this._config + "::" + this._texture + '::' + this.key);
        }

        isEqual(r: this): boolean {
            return this.name == r.name &&
                this._config == r._config &&
                this._texture == r._texture &&
                this.key == r.key;
        }

        getReqResources(): Array<ReqResource> {
            let r = [];
            r.push(new ResourceEntity(this.config, ResType.JSON));
            r.push(new ResourceEntity(this.texture, ResType.TEXTURE));
            return r;
        }

        toString(): string {
            return [this.name, this._config, this._texture, this.key].join("\n");
        }

        /** OPT 是否为独立数据，否则同一个资源公用一份帧数据 */
        key: string = '';
    }
}
