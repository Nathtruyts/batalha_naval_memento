import React from "react";
import { Box } from "@mui/material";

interface HeaderProps {
  currentPlayer: number;
  message: string;
}

const Header: React.FC<HeaderProps> = ({ currentPlayer, message }) => {
  return (
    <Box sx={{ textAlign: "center", marginBottom: 2, color: "#fff" }}>
      <h2>Jogador Atual: {currentPlayer}</h2>
      <p>{message}</p>
    </Box>
  );
};

export default Header;
