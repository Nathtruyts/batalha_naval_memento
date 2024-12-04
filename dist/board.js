"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = exports.Ship = void 0;
class Ship {
    constructor(name, size) {
        this.name = name;
        this.size = size;
        this.positions = [];
        this.hits = 0;
    }
    isSunk() {
        return this.hits >= this.size;
    }
}
exports.Ship = Ship;
class Board {
    constructor(size = 10) {
        this.grid = Array.from({ length: size }, () => Array(size).fill("empty"));
        this.ships = [];
    }
    placeShip(ship, start, direction) {
        const positions = [];
        for (let i = 0; i < ship.size; i++) {
            const x = direction === "horizontal" ? start.x + i : start.x;
            const y = direction === "vertical" ? start.y + i : start.y;
            if (x >= this.grid.length || y >= this.grid[0].length || this.grid[x][y] !== "empty") {
                return false;
            }
            positions.push({ x, y });
        }
        positions.forEach(pos => (this.grid[pos.x][pos.y] = "ship"));
        ship.positions = positions;
        this.ships.push(ship);
        return true;
    }
    receiveAttack(position) {
        const cell = this.grid[position.x][position.y];
        if (cell === "ship") {
            this.grid[position.x][position.y] = "hit";
            this.ships.forEach(ship => {
                if (ship.positions.some(pos => pos.x === position.x && pos.y === position.y)) {
                    ship.hits++;
                }
            });
            return "hit";
        }
        else if (cell === "empty") {
            this.grid[position.x][position.y] = "miss";
            return "miss";
        }
        else {
            return "already attacked";
        }
    }
    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }
}
exports.Board = Board;
