var Data;
(function (Data) {
    var t;
    var Bet_button_role = /** @class */ (function () {
        function Bet_button_role(d) {
            this.cfg = d;
        }
        Object.defineProperty(Bet_button_role.prototype, "id", {
            //ID
            get: function () { return this.cfg[0]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bet_button_role.prototype, "low_gold", {
            //金币量下限
            get: function () { return this.cfg[1]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bet_button_role.prototype, "high_gold", {
            //金币量上限
            get: function () { return this.cfg[2]; },
            enumerable: true,
            configurable: true
        });
        Bet_button_role.Get = function (key) { return key in _bet_button_roleMap ? new Bet_button_role(_bet_button_roleMap[key]) : null; };
        Bet_button_role.INDEX_ID = 0;
        Bet_button_role.INDEX_LOW_GOLD = 1;
        Bet_button_role.INDEX_HIGH_GOLD = 2;
        Bet_button_role.ONE = 0;
        Bet_button_role.TWO = 1;
        Bet_button_role.THREE = 2;
        Bet_button_role.FOUR = 3;
        return Bet_button_role;
    }());
    Data.Bet_button_role = Bet_button_role;
    Data.bet_button_roles = [
        [0, 0, 100000], [1, 100000, 2000000], [2, 2000000, 20000000], [3, 20000000, -1], [0, 0, 0]
    ];
    t = Data.bet_button_roles;
    var _bet_button_roleMap = {
        0: t[0], 1: t[1], 2: t[2], 3: t[3], 4: t[4]
    };
})(Data || (Data = {}));
