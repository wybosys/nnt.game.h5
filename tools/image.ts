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
        files.forEach(file => {
            let info = path.parse(file);
            if (info.ext == ".json" || info.ext == ".fnt") {
                // 移除对应的png
                let tgt = file.replace(info.ext, '.png');
                ArrayT.RemoveObject(files, tgt);
            }
        });
        console.log("找到了 " + files.length + " 个图片");
        console.log(files);
    }
}

export class ImageCompress {

}