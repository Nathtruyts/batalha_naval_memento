import React, { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import Header from "./components/Header";
import BoardDisplay from "./components/BoardDisplay";
import CommandInput from "./components/CommandInput";
import SaveLoadButtons from "./components/SaveLoadButtons";
import { styles } from "./styles/gameStyles";

const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [boards, setBoards] = useState({
    1: Array(10).fill(Array(10).fill("empty")),
    2: Array(10).fill(Array(10).fill("empty")),
  });

  // Função para salvar o jogo
  const handleSaveGame = async (fileName: string) => {
    try {
      const response = await fetch("http://localhost:5000/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName,
          state: { boards, currentPlayer },
        }),
      });

      const data = await response.json();
      setMessage(data.message || "Jogo salvo com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar o jogo:", error);
      setMessage("Erro ao salvar o jogo.");
    }
  };

  // Função para carregar o jogo
  const handleLoadGame = async (file: File) => {
    try {
      const response = await fetch(`http://localhost:5000/load/${file.name.replace(".json", "")}`);
      const data = await response.json();
  
      if (response.ok) {
        setBoards({
          1: data.state.boards[1] || Array(10).fill(Array(10).fill("empty")),
          2: data.state.boards[2] || Array(10).fill(Array(10).fill("empty")),
        });
        setCurrentPlayer(data.state.currentPlayer); // Atualiza corretamente o turno
        setMessage("Jogo carregado com sucesso.");
      } else {
        setMessage(data.message || "Erro ao carregar o jogo.");
      }
    } catch (error) {
      console.error("Erro ao carregar o jogo:", error);
      setMessage("Erro ao carregar o jogo.");
    }
  };
  
  

  // Função para enviar comandos
  const handleCommand = async (command: string) => {
    try {
      const response = await fetch("http://localhost:5000/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command,
          player: currentPlayer,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
  
        // Atualiza o estado do jogo após um comando
        fetch("http://localhost:5000/commands")
          .then((res) => res.json())
          .then((gameData) => {
            setBoards({
              1: gameData.boards[1] || Array(10).fill(Array(10).fill("empty")),
              2: gameData.boards[2] || Array(10).fill(Array(10).fill("empty")),
            });
  
            // Alterna o turno
            setCurrentPlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1));
          });
      } else {
        setMessage(data.message || "Erro ao processar o comando.");
      }
    } catch (error) {
      console.error("Erro ao enviar comando:", error);
      setMessage("Erro ao enviar comando.");
    }
  };
  

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <SaveLoadButtons
        onSave={handleSaveGame}
        onLoad={handleLoadGame}
      />
      <Box sx={styles.boardContainer}>
        <BoardDisplay
          board={boards[1]}
          isCurrentPlayer={currentPlayer === 1}
          label="Tabuleiro do Jogador 1"
        />
        <BoardDisplay
          board={boards[2]}
          isCurrentPlayer={currentPlayer === 2}
          label="Tabuleiro do Jogador 2"
        />
      </Box>
      <CommandInput onCommand={handleCommand} currentPlayer={currentPlayer} />
    </Container>
  );
};

export default App;
