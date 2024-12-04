export type Position = { x: number; y: number };
export type Command = "colocar" | "atacar" | "sair" | "salvar" | "carregar";
export type Direction = "horizontal" | "vertical";
export type Cell = "empty" | "hit" | "miss" | "ship";
