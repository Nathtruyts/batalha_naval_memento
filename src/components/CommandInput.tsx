import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { styles } from "../styles/gameStyles";

interface CommandInputProps {
  onCommand: (command: string) => void;
  currentPlayer: number; // Adiciona o tipo da prop currentPlayer
}

const CommandInput: React.FC<CommandInputProps> = ({ onCommand, currentPlayer }) => {
  const [command, setCommand] = useState("");

  const handleCommandSubmit = async () => {
    if (!command) return;

    try {
      const response = await fetch("http://localhost:5000/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command,
          player: currentPlayer, // Usa o jogador atual passado como prop
        }),
      });

      const data = await response.json();
      onCommand(data.message);
      setCommand(""); // Limpa o campo após envio
    } catch (error) {
      console.error("Erro ao enviar comando:", error);
      onCommand("Erro ao processar o comando.");
    }
  };

  return (
    <Box sx={styles.commandBox}>
      <TextField
        label="Comando"
        variant="outlined"
        sx={styles.textField}
        value={command}
        onChange={(e) => setCommand(e.target.value)}
      />
      <Button 
        variant="contained" 
        sx={styles.button} 
        onClick={handleCommandSubmit}
      >
        Enviar
      </Button>
    </Box>
  );
};

export default CommandInput;
