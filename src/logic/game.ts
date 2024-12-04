import { Board } from "./board";
import { GameStateCaretaker } from "./memento";

class Game {
    private boards: { [player: number]: Board };
    private currentPlayer: number;
    private opponentPlayer: number;
    private caretaker: GameStateCaretaker;

    constructor() {
        this.boards = {
            1: new Board(),
            2: new Board(),
        };
        this.currentPlayer = 1;
        this.opponentPlayer = 2;
        this.caretaker = new GameStateCaretaker();
    }

    saveGame(fileName: string): void {
        const state = JSON.stringify({
            boards: this.boards,
            currentPlayer: this.currentPlayer,
            opponentPlayer: this.opponentPlayer,
        });
        this.caretaker.save(state, fileName);
    }

    async loadGame(file: File): Promise<void> {
        const savedState = await this.caretaker.load(file);
        const { boards, currentPlayer, opponentPlayer } = JSON.parse(savedState);
        this.boards = {
            1: Object.assign(new Board(), boards[1]),
            2: Object.assign(new Board(), boards[2]),
        };
        this.currentPlayer = currentPlayer;
        this.opponentPlayer = opponentPlayer;
    }

    getBoard(player: number): Board {
        return this.boards[player];
    }

    loadGameFromState(boards: any, currentPlayer: number): void {
        this.boards = {
          1: Object.assign(new Board(), boards[1]),
          2: Object.assign(new Board(), boards[2]),
        };
        this.currentPlayer = currentPlayer;
        this.opponentPlayer = currentPlayer === 1 ? 2 : 1;
      }

    getCurrentPlayer(): number {
        return this.currentPlayer;
    }
}

export { Game };
