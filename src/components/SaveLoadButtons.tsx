import React from "react";
import { Button, Box, TextField } from "@mui/material";
import { styles } from "../styles/gameStyles";

interface SaveLoadButtonsProps {
  onSave: (fileName: string) => void;
  onLoad: (file: File) => void;
}

const SaveLoadButtons: React.FC<SaveLoadButtonsProps> = ({ onSave, onLoad }) => {
  const [fileName, setFileName] = React.useState("");

  return (
    <Box sx={styles.saveLoadContainer}>
      <TextField
        label="Nome do Arquivo para Salvar"
        variant="outlined"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        sx={{ marginRight: 2 }}
      />
      <Button
        variant="contained"
        sx={styles.button}
        onClick={() => onSave(fileName)}
      >
        SALVAR JOGO
      </Button>
      <Button
        variant="contained"
        sx={styles.button}
        component="label"
      >
        CARREGAR JOGO
        <input
          type="file"
          hidden
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onLoad(e.target.files[0]);
            }
          }}
        />
      </Button>
    </Box>
  );
};

export default SaveLoadButtons;
