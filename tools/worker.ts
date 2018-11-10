import {Game} from "./game";

export abstract class Worker {
    constructor(game: Game) {
        this.game = game;
    }

    protected game: Game;
}
