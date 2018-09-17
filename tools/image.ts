import sharp = require("sharpkit");
import path = require("path");
import {ArrayT, ListFiles, MD5, Rect, Size} from "./kernel";

export type Image = sharp.SharpInstance;

class MergingFileInfo {
    // 源文件地址
    src: string;

    // 临时存放地址
    dest: string;

    // 源图片包围
    bbx = new Rect();

    // 计算文件位置
    static Dest(src: string): string {
        return ".n2/resmerger/" + MD5(src, "hex") + ".png";
    }
}

export class ImageMerge {

    constructor(dir: string, name: string) {
        this._dir = dir;
        this._name = name.replace('/', '_').toLowerCase();
    }

    private _dir: string;
    private _name: string;

    async process() {
        console.log("自动合并 " + this._dir);
        // 只合并独立的png，其他的比如序列帧、字体也会用到png，需要被跳过
        let files = ListFiles(this._dir, null, null, null, 1);
        files.concat().forEach(file => {
            let info = path.parse(file);
            if (info.ext == ".json" || info.ext == ".fnt") {
                // 移除对应的png
                let tgt = file.replace(info.ext, '.png');
                ArrayT.RemoveObject(files, tgt);
                ArrayT.RemoveObject(files, file);
            }
        });
        console.log("找到了 " + files.length + " 个图片");
        if (!files.length)
            return;
        // 打包找到的文件
        this.doMerge(files);
    }

    // 由于sharp库的功能，裁剪图片采用先trim到本地文件，再load，获取目标大小以及绘制到指定位置
    protected async doMerge(files: string[]) {
        // 源文件对应输出文件的对照
        let infos: MergingFileInfo[] = [];
        // 获得图片的信息
        for (let i = 0, l = files.length; i < l; ++i) {
            let info = new MergingFileInfo();
            info.src = files[i];
            let img = sharp(info.src);

            // 获得原始图片数据
            const bbx = await img.bbx(10);
            if (bbx.width && bbx.height) {
                info.bbx = new Rect(bbx.left, bbx.top, bbx.width, bbx.height);
                info.dest = MergingFileInfo.Dest(info.src);
                // trim后保存起来
                await img.trim(10).toFile(info.dest);
            } else {
                const meta = await img.metadata();
                info.bbx = new Rect(0, 0, meta.width, meta.height);
                info.dest = info.src;
            }
        }

        // 根据有效面积先排序(从大到小)
        infos.sort((l, r) => {
            return r.bbx.aera() - l.bbx.aera();
        });

        // 处理合并
    }
}
