import { SxProps } from "@mui/material";

export const styles = {
  container: {
    mt: 4,
    textAlign: "center",
  } as SxProps,
  boardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 4,
    mt: 4,
    flexWrap: "wrap", // Responsividade para telas menores
  } as SxProps,
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(10, 40px)", // 10 colunas do tabuleiro
    gap: 1,
  } as SxProps,
  cell: {
    width: 40,
    height: 40,
    border: "1px solid #555",
    backgroundColor: "#212121", // Cor padrão para células vazias
    "&.hit": {
      backgroundColor: "#d32f2f", // Vermelho para acerto
    },
    "&.miss": {
      backgroundColor: "#757575", // Cinza para erro
    },
    "&.ship": {
      backgroundColor: "#4caf50", // Verde para navios
    },
    "&.empty": {
      backgroundColor: "#212121", // Preto para vazio
    },
  } as SxProps,
  commandBox: {
    display: "flex",
    justifyContent: "center",
    mt: 4,
    gap: 8, // Espaçamento entre o campo de texto e o botão
    flexWrap: "wrap", // Permite quebra para telas menores
  } as SxProps,
  textField: {
    width: "300px", // Largura do campo de entrada
  } as SxProps,
  button: {
    ml: 2, // Margem à esquerda do botão
  } as SxProps,
  saveLoadContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    marginBottom: 4,
  },
};
