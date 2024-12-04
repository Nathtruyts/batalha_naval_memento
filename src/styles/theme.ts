import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Azul claro
    },
    secondary: {
      main: "#f48fb1", // Rosa claro
    },
    background: {
      default: "#121212", // Fundo escuro
      paper: "#1e1e1e", // Papéis escuros
    },
    text: {
      primary: "#ffffff", // Texto principal branco
      secondary: "#aaaaaa", // Texto secundário cinza
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h3: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

export default theme;
