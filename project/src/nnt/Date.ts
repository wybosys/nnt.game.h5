module nn {

    /** 时间日期 */
    export class DateTime {
        constructor(ts?: number) {
            if (ts === undefined)
                ts = DateTime.Timestamp();
            this.timestamp = ts;
        }

        /** 当前的时间 */
        static Now(): number {
            return new Date().getTime() / 1000;
        }

        /** 当前的时间戳 */
        static Timestamp(): number {
            return (new Date().getTime() / 1000) >> 0;
        }

        /** 从开始运行时过去的时间 */
        static Pass(): number {
            return IMP_TIMEPASS();
        }

        /** 一段时间 */
        static Interval(ts: number): DateTime {
            // 偏移GMT, -2880000是 GMT8 1970/1/1 0:0:0
            return new DateTime(ts - 2880000);
        }

        /** 从字符串转换 */
        static parse(s: string): DateTime {
            let v = Date.parse(s);
            // safari下日期必须用/分割，但是chrome支持-或者/的格式，所以如果是NaN，则把所有的-转换成/
            if (isNaN(v)) {
                if (s.indexOf('-') != -1) {
                    s = s.replace(/-/g, '/');
                    v = Date.parse(s);
                }
            }
            return new DateTime(v / 1000);
        }

        /** 未来 */
        future(ts: number): this {
            this.timestamp += ts;
            return this;
        }

        /** 过去 */
        past(ts: number): this {
            this.timestamp -= ts;
            return this;
        }

        /** 计算间隔 */
        diff(r: DateTime): DateTime {
            return new DateTime(r._timestamp - this._timestamp);
        }

        private _changed = false;
        private _date = new Date();
        private _timestamp: number;
        get timestamp(): number {
            if (this._changed) {
                this._timestamp = this._date.getTime() / 1000;
                this._changed = false;
            }
            return this._timestamp;
        }

        set timestamp(val: number) {
            if (this._timestamp === val)
                return;
            this._timestamp = val;
            this._date.setTime(this._timestamp * 1000);
        }

        get year(): number {
            return this._date.getFullYear();
        }

        set year(val: number) {
            this._changed = true;
            this._date.setFullYear(val);
        }

        get month(): number {
            return this._date.getMonth();
        }

        set month(val: number) {
            this._changed = true;
            this._date.setMonth(val);
        }

        get day(): number {
            return this._date.getDate();
        }

        set day(val: number) {
            this._changed = true;
            this._date.setDate(val);
        }

        get hyear(): number {
            return this.year;
        }

        set hyear(val: number) {
            this.year = val;
        }

        get hmonth(): number {
            return this.month + 1;
        }

        set hmonth(val: number) {
            this.month = val - 1;
        }

        get hday(): number {
            return this.day;
        }

        set hday(val: number) {
            this.day = val;
        }

        get hour(): number {
            return this._date.getHours();
        }

        set hour(val: number) {
            this._changed = true;
            this._date.setHours(val);
        }

        get minute(): number {
            return this._date.getMinutes();
        }

        set minute(val: number) {
            this._changed = true;
            this._date.setMinutes(val);
        }

        get second(): number {
            return this._date.getSeconds();
        }

        set second(val: number) {
            this._changed = true;
            this._date.setSeconds(val);
        }

        /**
         * 对Date的扩展，将 Date 转化为指定格式的String
         * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
         * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         * eg:
         * ("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
         * ("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
         * ("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
         * ("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
         * ("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
         */
        toString(fmt?: any): string {
            if (fmt)
                return (<any>this._date).pattern(fmt);
            return this._date.toString();
        }

        static MINUTE = 60;
        static MINUTE_5 = 300;
        static MINUTE_15 = 900;
        static MINUTE_30 = 1800;
        static HOUR = 3600;
        static HOUR_2 = 7200;
        static HOUR_6 = 21600;
        static HOUR_12 = 43200;
        static DAY = 86400;
        static MONTH = 2592000;
        static YEAR = 31104000;

        static Dyears(ts: number, up: boolean = true) {
            return Math.floor(ts / this.YEAR);
        }

        static Dmonths(ts: number, up: boolean = true) {
            let v;
            if (up) {
                v = ts % this.YEAR;
                v = Math.floor(v / this.MONTH);
            } else {
                v = Math.floor(ts / this.MONTH);
            }
            return v;
        }

        static Ddays(ts: number, up: boolean = true) {
            let v;
            if (up) {
                v = ts % this.MONTH;
                v = Math.floor(v / this.DAY);
            } else {
                v = Math.floor(ts / this.DAY);
            }
            return v;
        }

        static Dhours(ts: number, up: boolean = true) {
            let v;
            if (up) {
                v = ts % this.DAY;
                v = Math.floor(v / this.HOUR);
            } else {
                v = Math.floor(ts / this.HOUR);
            }
            return v;
        }

        static Dminutes(ts: number, up: boolean = true) {
            let v;
            if (up) {
                v = ts % this.HOUR;
                v = Math.floor(v / this.MINUTE);
            } else {
                v = Math.floor(ts / this.MINUTE);
            }
            return v;
        }

        static Dseconds(ts: number, up: boolean = true) {
            let v;
            if (up) {
                v = ts % this.MINUTE;
            } else {
                v = ts;
            }
            return v;
        }

        /** 计算diff-year，根绝suffix的类型返回对应的类型 */
        dyears(up: boolean = true, suffix: any | string = 0): any {
            let v = DateTime.Dyears(this._timestamp, up);
            if (typeof (suffix) == 'string')
                return v ? v + suffix : '';
            return v + suffix;
        }

        /** 计算diff-months */
        dmonths(up: boolean = true, suffix: any | string = 0): any {
            let v = DateTime.Dmonths(this._timestamp, up);
            if (typeof (suffix) == 'string')
                return v ? v + suffix : '';
            return v + suffix;
        }

        /** 计算diff-days */
        ddays(up: boolean = true, suffix: any | string = 0): any {
            let v = DateTime.Ddays(this._timestamp, up);
            if (typeof (suffix) == 'string')
                return v ? v + suffix : '';
            return v + suffix;
        }

        /** 计算diff-hours */
        dhours(up: boolean = true, suffix: any | string = 0): any {
            let v = DateTime.Dhours(this._timestamp, up);
            if (typeof (suffix) == 'string')
                return v ? v + suffix : '';
            return v + suffix;
        }

        /** 计算diff-mins */
        dminutes(up: boolean = true, suffix: any | string = 0): any {
            let v = DateTime.Dminutes(this._timestamp, up);
            if (typeof (suffix) == 'string')
                return v ? v + suffix : '';
            return v + suffix;
        }

        /** 计算diff-secs */
        dseconds(up: boolean = true, suffix: any | string = 0): any {
            let v = DateTime.Dseconds(this._timestamp, up);
            if (typeof (suffix) == 'string')
                return v ? v + suffix : '';
            return v + suffix;
        }

        isSameDay(r: DateTime): boolean {
            return this.year == r.year &&
                this.month == r.month &&
                this.day == r.day;
        }
    }

}
