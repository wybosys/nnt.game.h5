import sharp = require("sharpkit");
import path = require("path");
import {ArrayT, IndexedObject, ListFiles, MD5, Point, Rect, Size} from "./kernel";
import fs = require("fs-extra");

export type Image = sharp.SharpInstance;

class MergingFileInfo {
    // 源文件地址
    src: string;

    // 源文件名
    filename: string;

    // 临时存放地址
    dest: string;

    // 源图片包围
    bbx: Rect;

    // 原图的大小
    size: Size;

    // 合图后的位置
    postion: Point;

    // 计算文件位置
    static Dest(src: string): string {
        return ".n2/resmerger/" + MD5(src, "hex") + ".png";
    }
}

const TEXTURE_WIDTH = 2048;
const TEXTURE_HEIGHT = 2048;

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
        let infos: MergingFileInfo[] = [];
        files.forEach(file => {
            let t = path.parse(file);
            let info = new MergingFileInfo();
            info.src = file;
            info.filename = t.name;
            infos.push(info);
        });
        // 打包找到的文件
        this.doMerge(infos);
    }

    // 由于sharp库的功能，裁剪图片采用先trim到本地文件，再load，获取目标大小以及绘制到指定位置
    protected async doMerge(infos: MergingFileInfo[]) {
        // 源文件对应输出文件的对照
        // 获得图片的信息
        for (let i = 0, l = infos.length; i < l; ++i) {
            let info = infos[i];
            let img = sharp(info.src);

            // 获得原始图片数据
            const meta = await img.metadata();
            info.size = new Size(meta.width, meta.height);
            const bbx = await img.bbx(10);
            if (bbx.width && bbx.height && (bbx.width != meta.width || bbx.height != meta.height)) {
                info.bbx = new Rect(bbx.left, bbx.top, bbx.width, bbx.height);
                info.dest = MergingFileInfo.Dest(info.src);
                // trim后保存起来
                await img.trim(10).toFile(info.dest);
            } else {
                info.bbx = new Rect(0, 0, meta.width, meta.height);
                info.dest = info.src;
            }
        }

        // 根据有效面积先排序(从大到小)
        infos.sort((l, r) => {
            return r.bbx.aera() - l.bbx.aera();
        });

        // 处理合并
        for (let workid = 0; ; ++workid) {
            // 新建画布
            let work = new ImageMergeResult();
            const res = await this.doMergeImages(work, infos, new Rect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT));

            // 保存合并后的图
            let file = this._dir + '/' + this._name + '_automerged_' + workid + '.png';
            work.image.toBuffer((err, buf) => {
                // 保存合并的图片
                sharp(buf).png().trim().toFile(file);
            });
            // 保存合并的索引数据文件
            let jsframes: IndexedObject = Object.create(null);
            work.result.forEach(e => {
                jsframes[e.filename] = {
                    x: e.postion.x,
                    y: e.postion.y,
                    w: e.bbx.width,
                    h: e.bbx.height,
                    offX: e.bbx.x,
                    offY: e.bbx.y,
                    sourceW: e.size.width,
                    sourceH: e.size.height
                };
            });
            let jsobj: IndexedObject = {
                file: this._name + '_automerged_' + workid + '.png',
                frames: jsframes
            };
            fs.writeJsonSync(this._dir + '/' + this._name + '_automerged_' + workid + '.json', jsobj);

            // 合并成功代表所有图片都已经完成
            // false代表存在还没有合并的，进入下一轮
            if (res)
                break;
        }
    }

    protected async doMergeImages(work: ImageMergeResult, infos: MergingFileInfo[], rc: Rect): Promise<boolean> {
        if (infos.length == 0)
            return true;
        // 查找可以填充的
        let fnd = ArrayT.RemoveObjectByFilter(infos, e => {
            return e.bbx.width <= rc.width && e.bbx.height <= rc.height;
        });
        if (!fnd)
            return false;
        work.result.push(fnd);
        fnd.postion = new Point(rc.x, rc.y);
        work.image.overlayWith(fnd.dest, {
            left: rc.x,
            top: rc.y
        });
        // 保存到buf，并用buf重新构造work
        let buf = await work.image.toBuffer();
        work.image = sharp(buf).png();
        // 删除合并过了的
        fs.removeSync(fnd.dest);
        // 添加下一张
        let res = await this.doMergeImages(work, infos, new Rect(rc.x + fnd.bbx.width, rc.y, rc.width - fnd.bbx.width, rc.height));
        if (res)
            return true;
        return this.doMergeImages(work, infos, new Rect(rc.x, rc.y + fnd.bbx.height, rc.width, rc.height - fnd.bbx.height));
    }
}

export class ImageMergeResult {
    constructor() {
        this.image = sharp(<any> {
            create: {
                width: TEXTURE_WIDTH,
                height: TEXTURE_HEIGHT,
                channels: 4,
                background: {r: 0, g: 0, b: 0, alpha: 0}
            }
        }).png();
    }

    image: Image;
    result: MergingFileInfo[] = [];
}
