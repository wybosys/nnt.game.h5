declare module Data {
    class Bet_button_role {
        readonly id: number;
        readonly low_gold: number;
        readonly high_gold: number;
        static INDEX_ID: number;
        static INDEX_LOW_GOLD: number;
        static INDEX_HIGH_GOLD: number;
        static ONE: number;
        static TWO: number;
        static THREE: number;
        static FOUR: number;
        static Get(key: number): Bet_button_role;
        constructor(d: any);
        cfg: any;
    }
    const bet_button_roles: Array<any>;
}
