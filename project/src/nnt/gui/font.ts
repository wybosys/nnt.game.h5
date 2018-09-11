module nn {

    export class Font {
        // 计算单行文字大小
        static sizeOfString(str: string, fontSize: number, width: number, height: number): Size {
            let w = 0, h = fontSize;
            w = (str.length ? str.length + 1 : 0) * fontSize;
            if (width) {
                h = Math.ceil(w / width) * fontSize;
                if (height && h > height)
                    h = height;
                w = Math.min(w, width);
                return new Size(w, h);
            }
            if (height) {
                if (fontSize > height)
                    h = height;
                return new Size(w, h);
            }
            return new Size(w, h);
        }

        // 计算多行文字大小
        static sizeFitString(str: string, fontSize: number, width: number, height: number, lineSpacing: number): Size {
            if (!str || !str.length)
                return new Size();
            let r = new Size();
            let lns = str.split('\n');
            lns.forEach((s: string) => {
                let sz = Font.sizeOfString(s, fontSize, width, height);
                r.width = Math.max(r.width, sz.width);
                r.height += sz.height;
            });
            r.height += lns.length * lineSpacing;
            return r;
        }
    }

}
