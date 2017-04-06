module nn {

    export class Pen {
    }

    export class Brush {
    }

    // 先采用直绘模式，以后有需求再修改成命令组的模式
    export abstract class CGraphics
    {           
        abstract clear():void;
    }
    
}