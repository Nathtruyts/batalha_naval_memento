import React from "react";
import { Box, Typography } from "@mui/material";

interface BoardDisplayProps {
  board: string[][];
  isCurrentPlayer: boolean;
  label: string;
}

const BoardDisplay: React.FC<BoardDisplayProps> = ({ board, isCurrentPlayer, label }) => {
  return (
    <Box sx={{ textAlign: "center", m: 2 }}>
      <Typography variant="h6" gutterBottom>
        {label} {isCurrentPlayer ? "(Sua vez)" : ""}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${board[0].length}, 1fr)`, // Tamanho proporcional
          gap: "2px", // Espaçamento entre as células
          backgroundColor: "#333", // Cor de fundo do tabuleiro
          padding: "5px", // Espaço ao redor do tabuleiro
          borderRadius: "5px", // Bordas arredondadas
          border: "2px solid #444", // Borda externa do tabuleiro
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Box
              key={`${rowIndex}-${colIndex}`}
              sx={{
                width: "40px",
                height: "40px",
                backgroundColor:
                  cell === "ship" ? "green" : cell === "hit" ? "red" : cell === "miss" ? "gray" : "lightblue",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "black",
                border: "1px solid #000", // Borda fina nas células
              }}
            >
              {cell === "ship" ? "🚢" : cell === "hit" ? "💥" : cell === "miss" ? "❌" : ""}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default BoardDisplay;
