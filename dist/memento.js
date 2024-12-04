"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStateCaretaker = exports.Memento = void 0;
class Memento {
    constructor(state) {
        this.state = state;
    }
    getState() {
        return this.state;
    }
}
exports.Memento = Memento;
class GameStateCaretaker {
    constructor() {
        this.mementos = [];
    }
    // Salva o estado atual do jogo
    save(state) {
        this.mementos.push(new Memento(state));
    }
    // Restaura o último estado salvo
    restore() {
        var _a;
        if (this.mementos.length === 0)
            return null;
        return ((_a = this.mementos.pop()) === null || _a === void 0 ? void 0 : _a.getState()) || null;
    }
    // Verifica se há estados salvos
    hasSavedState() {
        return this.mementos.length > 0;
    }
}
exports.GameStateCaretaker = GameStateCaretaker;
