"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const board_1 = require("./board");
const memento_1 = require("./memento");
class Game {
    constructor() {
        this.board = new board_1.Board();
        this.caretaker = new memento_1.GameStateCaretaker();
    }
    handleCommand(command) {
        const [action, ...args] = command.split(" ");
        switch (action) {
            case "colocar":
                return this.placeShip(args);
            case "atacar":
                return this.attack(args);
            case "salvar":
                return this.saveGame();
            case "carregar":
                return this.loadGame();
            case "sair":
                return "sair";
            default:
                return "Comando inválido.";
        }
    }
    placeShip(args) {
        const [name, direction, x, y] = args;
        const ship = new board_1.Ship(name, this.getShipSize(name));
        const success = this.board.placeShip(ship, { x: parseInt(x), y: parseInt(y) }, direction);
        return success ? "Navio colocado com sucesso!" : "Erro ao colocar o navio.";
    }
    attack(args) {
        const [x, y] = args.map(Number);
        return this.board.receiveAttack({ x, y });
    }
    saveGame() {
        const state = JSON.stringify(this.board);
        this.caretaker.save(state);
        return "Jogo salvo!";
    }
    loadGame() {
        const state = this.caretaker.restore();
        if (state) {
            this.board = JSON.parse(state);
            return "Jogo carregado!";
        }
        return "Nenhum jogo salvo.";
    }
    getShipSize(name) {
        const sizes = { "porta-aviões": 5, cruzador: 3, submarino: 1 };
        return sizes[name.toLowerCase()] || 0;
    }
}
exports.Game = Game;
