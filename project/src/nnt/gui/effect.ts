module nn {

    export abstract class AbstractEffect {

        // 提供引擎实现将通用设定转换成引擎支持得对象
        _instance(): any {
            return null;
        }
    }

    export class BlurEffect extends AbstractEffect {

        constructor(x: byte = 0, y: byte = 0) {
            super();

            this.x = x;
            this.y = y;
        }

        // 模糊量
        x: byte;
        y: byte;
    }

    export class GlowEffect extends AbstractEffect {

        constructor(x: byte = 0, y: byte = 0, color: Color = Color.Yellow) {
            super();
            this.x = x;
            this.y = y;
            this.color = color;
        }

        x: byte;
        y: byte;
        color: Color;
        strength: byte = 0; // 对比度
        inner: boolean = false; // 内发光
        hollow: boolean = false; // 挖空
    }

    export class ShadowEffect extends AbstractEffect {

        constructor(x: byte = 0, y: byte = 0, color: Color = Color.Black, angle: Angle = Angle.ANGLE(30)) {
            super();
            this.x = x;
            this.y = y;
            this.color = color;
            this.angle = angle;
        }

        distance: number = 0; // 距离
        angle: Angle; // 角度
        color: Color;
        x: byte;
        y: byte;
        strength: byte = 0; // 对比度
        inner: boolean = false; // 内阴影
        hollow: boolean = false; // 挖空
        onlyShadow: boolean = false; // 只有阴影可见
    }
}