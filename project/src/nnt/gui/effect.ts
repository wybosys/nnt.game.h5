module nn {

    let _EFF_FACTORIES = new Map<string, any>();

    export abstract class AbstractEffect {

        // 提供引擎实现将通用设定转换成引擎支持得对象
        _instance(): any {
            return null;
        }

        static Unserialize(str: string): AbstractEffect {
            return null;
        }

        protected static UnserializeConfig(str: string): any[] {
            let sp = str.split('=');
            return StringT.Split(sp[1], ',');
        }

        static Unserializes(str: string): AbstractEffect[] {
            let sp = StringT.Split(str, ';');
            return ArrayT.SafeConvert(sp, e => {
                let sp1 = e.split('=');
                let clazz = _EFF_FACTORIES.get(sp1[0]);
                if (!clazz) {
                    fatal(`不支持该特效或特效配置错误 ${e}`);
                    return null;
                }
                let ret = clazz.Unserialize(e);
                if (!ret) {
                    fatal(`特效配置错误 ${e}`);
                    return null;
                }
                return ret;
            });
        }
    }

    // 字符串配置: blur=x,y
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

    _EFF_FACTORIES.set('blur', BlurEffect);

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

    _EFF_FACTORIES.set('glow', GlowEffect);

    export class ShadowEffect extends AbstractEffect {

        constructor(x: byte = 5, y: byte = 5, color: Color = Color.Black, angle: Angle = Angle.ANGLE(30)) {
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
        strength: byte = 2; // 对比度
        inner: boolean = false; // 内阴影
        hollow: boolean = false; // 挖空
        onlyShadow: boolean = false; // 只有阴影可见
    }

    _EFF_FACTORIES.set('shadow', ShadowEffect);
}