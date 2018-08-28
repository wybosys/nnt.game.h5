module nn {

    export let FontFilePattern = /\.(ttf|otf|woff)$/i;
    export let FontKeyPattern = /(.+)_(?:ttf|otf|woff)$/i;

    export class _FontsManager {
        add(name: string, url: string) {
            this._fonts[name] = url;
            this._doAddH5Font(name, url);
        }

        protected _doAddH5Font(name: string, url: string) {
            let res = name.match(FontKeyPattern);
            if (length(res) != 2)
                return;

            let family = res[1];

            // 解析字体信息，插入 CSS3
            let h = "@font-face { font-family:'" + family + "'; src:url(" + url + '); }';
            let n = document.createElement('style');
            n.innerHTML = h;
            let p = document.getElementsByTagName('head')[0];
            p.appendChild(n);
        }

        private _fonts = new KvObject<string, string>();
        private _dfonts = new KvObject<string, string>();

        // 计算出默认的字体组合
        font(name: string): string {
            let fnd = this._dfonts[name];
            if (fnd)
                return fnd;
            if (name == "黑体") {
                if (Device.shared.isIOS || Device.shared.isMac) {
                    fnd = "PingFangSC-Regular";
                } else if (Device.shared.isWin) {
                    fnd = "微软雅黑";
                } else {
                    fnd = "黑体";
                }
            } else if (name == "宋体") {
                if (Device.shared.isIOS || Device.shared.isMac) {
                    fnd = "SimSun";
                } else {
                    fnd = "宋体";
                }
            } else {
                fnd = name;
            }
            this._dfonts[name] = fnd;
            return fnd;
        }
    }

    export let FontsManager = new _FontsManager();

    let WebUriCheckPattern = /^[\w]+:\/\/.+$/i;

    // 支持普通字体和bitmapfont字体
    export class FontConfig {
        /** 字体名称 */
        family: string;
        name: string;

        /** 位图字体的贴图 */
        texture: UriSource;

        /** 位图字体的配置 */
        config: UriSource;

        static Font(family: string): FontConfig {
            let r = new FontConfig();
            r.family = family;
            return r;
        }

        static Bitmap(name: string): FontConfig;
        static Bitmap(texture: string, config: string): FontConfig;
        static Bitmap(...p: string[]): FontConfig {
            let cfg = new FontConfig();
            if (p.length == 1) {
                let s = p[0];
                if (s.indexOf("_fnt") == -1)
                    cfg.name = s + "_fnt";
                else
                    cfg.name = s;
            } else {
                let t = p[0];
                let c = p[1];
                if (t.search(WebUriCheckPattern) != -1)
                    cfg.texture = t;
                else if (t.indexOf("_png") == -1)
                    cfg.texture = t + "_png";
                if (c.search(WebUriCheckPattern) != -1)
                    cfg.config = c;
                else if (c.indexOf("_fnt") != -1)
                    cfg.config = t + "_fnt";
            }
            return cfg;
        }
    }

    export type FontSource = FontConfig | UriSource | COriginType;
}
