import { Cell, Direction, Position } from "./types";

class Ship {
    name: string;
    size: number;
    positions: Position[];
    hits: number;

    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
        this.positions = [];
        this.hits = 0;
    }

    isSunk(): boolean {
        return this.hits >= this.size;
    }
}

class Board {
    private grid: string[][]; // Representa o tabuleiro
    private ships: { x: number; y: number; length: number; direction: "horizontal" | "vertical"; hits: number }[]; // Lista de navios
  
    constructor(size = 10) {
      // Inicializa o tabuleiro com células vazias ("empty")
      this.grid = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => "empty")
      );
      this.ships = [];
    }
  
    // Retorna o tabuleiro atual
    getGrid(): string[][] {
      return this.grid;
    }
  
    placeShip(x: number, y: number, length: number, direction: "horizontal" | "vertical"): boolean {
      if (direction === "horizontal") {
        if (x + length > this.grid[0].length) return false; // Verifica se o navio cabe horizontalmente
        for (let i = 0; i < length; i++) {
          if (this.grid[y][x + i] !== "empty") return false; // Verifica se a posição está livre
        }
        for (let i = 0; i < length; i++) {
          this.grid[y][x + i] = "ship";
        }
      } else if (direction === "vertical") {
        if (y + length > this.grid.length) return false; // Verifica se o navio cabe verticalmente
        for (let i = 0; i < length; i++) {
          if (this.grid[y + i][x] !== "empty") return false; // Verifica se a posição está livre
        }
        for (let i = 0; i < length; i++) {
          this.grid[y + i][x] = "ship";
        }
      }
  
      // Adiciona o navio à lista
      this.ships.push({ x, y, length, direction, hits: 0 });
      return true;
    }
  
    // Processa um ataque no tabuleiro
    receiveAttack({ x, y }: { x: number; y: number }): string {
      if (this.grid[y][x] === "ship") {
        this.grid[y][x] = "hit"; // Marca como acertado
        this.updateShipHit(x, y);
        return "hit"; // Retorna "hit" para indicar acerto
      } else if (this.grid[y][x] === "empty") {
        this.grid[y][x] = "miss"; // Marca como erro
        return "miss"; // Retorna "miss" para indicar erro
      } else {
        return "already"; // Indica que a posição já foi atacada
      }
    }
  
    // Atualiza o estado do navio ao receber um acerto
    private updateShipHit(x: number, y: number): void {
      for (const ship of this.ships) {
        if (ship.direction === "horizontal") {
          if (y === ship.y && x >= ship.x && x < ship.x + ship.length) {
            ship.hits++;
          }
        } else if (ship.direction === "vertical") {
          if (x === ship.x && y >= ship.y && y < ship.y + ship.length) {
            ship.hits++;
          }
        }
      }
    }
  
    // Verifica se todos os navios foram afundados
    allShipsSunk(): boolean {
      return this.ships.every((ship) => ship.hits === ship.length);
    }
  }
  

export { Board, Ship };
