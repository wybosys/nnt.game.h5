module nn {

    // 应用设置fillMode导致scaleFactor！=1，所以需要对egret的画法进行修正
    egret.sys.BitmapNode['$updateTextureDataWithScale9Grid'] = function (node, image, scale9Grid, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH, sourceWidth, sourceHeight, smoothing) {
        node.smoothing = smoothing;
        node.image = image;
        node.imageWidth = sourceWidth;
        node.imageHeight = sourceHeight;

        var imageWidth = bitmapWidth;
        var imageHeight = bitmapHeight;
        destW = destW - (textureWidth - bitmapWidth * egret.$TextureScaleFactor);
        destH = destH - (textureHeight - bitmapHeight * egret.$TextureScaleFactor);
        var targetW0 = scale9Grid.x - offsetX;
        var targetH0 = scale9Grid.y - offsetY;
        var sourceW0 = targetW0 / egret.$TextureScaleFactor;
        var sourceH0 = targetH0 / egret.$TextureScaleFactor;
        var sourceW1 = scale9Grid.width / egret.$TextureScaleFactor;
        var sourceH1 = scale9Grid.height / egret.$TextureScaleFactor;
        //防止空心的情况出现。
        if (sourceH1 == 0) {
            sourceH1 = 1;
            if (sourceH0 >= imageHeight) {
                sourceH0--;
            }
        }
        if (sourceW1 == 0) {
            sourceW1 = 1;
            if (sourceW0 >= imageWidth) {
                sourceW0--;
            }
        }

        // sf
        targetW0 *= ScaleFactorW;
        targetH0 *= ScaleFactorH;

        var sourceX0 = bitmapX;
        var sourceX1 = sourceX0 + sourceW0;
        var sourceX2 = sourceX1 + sourceW1;
        var sourceW2 = imageWidth - sourceW0 - sourceW1;
        var sourceY0 = bitmapY;
        var sourceY1 = sourceY0 + sourceH0;
        var sourceY2 = sourceY1 + sourceH1;
        var sourceH2 = imageHeight - sourceH0 - sourceH1;
        var targetW2 = sourceW2 * egret.$TextureScaleFactor;
        var targetH2 = sourceH2 * egret.$TextureScaleFactor;
        if ((sourceW0 + sourceW2) * egret.$TextureScaleFactor > destW || (sourceH0 + sourceH2) * egret.$TextureScaleFactor > destH) {
            node.drawImage(bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, destW, destH);
            return;
        }

        // sf
        targetW2 *= ScaleFactorW;
        targetH2 *= ScaleFactorH;

        var targetX0 = offsetX;
        var targetX1 = targetX0 + targetW0;
        var targetX2 = targetX0 + (destW - targetW2);
        var targetW1 = destW - targetW0 - targetW2;
        var targetY0 = offsetY;
        var targetY1 = targetY0 + targetH0;
        var targetY2 = targetY0 + destH - targetH2;
        var targetH1 = destH - targetH0 - targetH2;
        //
        //             x0     x1     x2
        //          y0 +------+------+------+
        //             |      |      |      | h0(s)
        //             |      |      |      |
        //          y1 +------+------+------+
        //             |      |      |      | h1
        //             |      |      |      |
        //          y2 +------+------+------+
        //             |      |      |      | h2(s)
        //             |      |      |      |
        //             +------+------+------+
        //                w0(s)     w1     w2(s)
        //
        if (sourceH0 > 0) {
            if (sourceW0 > 0)
                node.drawImage(sourceX0, sourceY0, sourceW0, sourceH0, targetX0, targetY0, targetW0, targetH0);
            if (sourceW1 > 0)
                node.drawImage(sourceX1, sourceY0, sourceW1, sourceH0, targetX1, targetY0, targetW1, targetH0);
            if (sourceW2 > 0)
                node.drawImage(sourceX2, sourceY0, sourceW2, sourceH0, targetX2, targetY0, targetW2, targetH0);
        }
        if (sourceH1 > 0) {
            if (sourceW0 > 0)
                node.drawImage(sourceX0, sourceY1, sourceW0, sourceH1, targetX0, targetY1, targetW0, targetH1);
            if (sourceW1 > 0)
                node.drawImage(sourceX1, sourceY1, sourceW1, sourceH1, targetX1, targetY1, targetW1, targetH1);
            if (sourceW2 > 0)
                node.drawImage(sourceX2, sourceY1, sourceW2, sourceH1, targetX2, targetY1, targetW2, targetH1);
        }
        if (sourceH2 > 0) {
            if (sourceW0 > 0)
                node.drawImage(sourceX0, sourceY2, sourceW0, sourceH2, targetX0, targetY2, targetW0, targetH2);
            if (sourceW1 > 0)
                node.drawImage(sourceX1, sourceY2, sourceW1, sourceH2, targetX1, targetY2, targetW1, targetH2);
            if (sourceW2 > 0)
                node.drawImage(sourceX2, sourceY2, sourceW2, sourceH2, targetX2, targetY2, targetW2, targetH2);
        }
    };
}
