Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const kernel_1 = require("./kernel");
class ImageMerge {
    constructor(dir, name) {
        this._dir = dir;
        this._name = name.replace('/', '_').toLowerCase();
    }
    async process() {
        console.log("自动合并 " + this._dir);
        // 只合并独立的png
        let files = kernel_1.ListFiles(this._dir, null, null, null, 1);
        files.forEach(file => {
            let info = path.parse(file);
            if (info.ext == ".json" || info.ext == ".fnt") {
                // 移除对应的png
                let tgt = file.replace(info.ext, '.png');
                kernel_1.ArrayT.RemoveObject(files, tgt);
            }
        });
        console.log("找到了 " + files.length + " 个图片");
        console.log(files);
    }
}
exports.ImageMerge = ImageMerge;
class ImageCompress {
}
exports.ImageCompress = ImageCompress;
//# sourceMappingURL=image.js.map