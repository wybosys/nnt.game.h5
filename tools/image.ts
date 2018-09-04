import sharp = require("sharpkit");
import path = require("path");
import {ArrayT, ListFiles} from "./kernel";

export type Image = sharp.SharpInstance;

export class ImageMerge {

    constructor(dir: string, name: string) {
        this._dir = dir;
        this._name = name.replace('/', '_').toLowerCase();
    }

    private _dir: string;
    private _name: string;

    async process() {
        console.log("自动合并 " + this._dir);
        // 只合并独立的png
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

    protected async doMerge(files: string[]) {
        // 获得图片的信息
        for (let i = 0, l = files.length; i < l; ++i) {
            let file = files[i];
            let img = sharp(file);
            let info = await img.metadata();
        }
    }
}

export class ImageCompress {

}