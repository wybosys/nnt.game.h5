module nn {

     // 触摸前处理
    export let SignalPreTouch = "::nn::pretouch";

    // 点击前处理
    export let SignalPreClick = "::nn::preclick";
    
    /** 手势的接口 */
    export interface IGesture {
    }

    /** 触摸数据 */
    export abstract class CTouch
    {
        startPosition = new Point();
        lastPosition = new Point();
        currentPosition = new Point();

        /** 点中的对象 */
        target:any;
        currentTarget:any;

        /** 当前的增量 */
        get delta():Point {
            let pt = this.currentPosition.clone();
            return pt.add(-this.lastPosition.x, -this.lastPosition.y);
        }

        /** 移动的距离 */
        get distance():Point {
            return new Point(this.currentPosition.x - this.startPosition.x,
                             this.currentPosition.y - this.startPosition.y);
        }

        // 取消点击
        abstract cancel();

        // 暂停点击
        abstract veto();

        // 获得位于指定view中的位置
        abstract positionInView(v:CComponent):Point;
    }
    
}
