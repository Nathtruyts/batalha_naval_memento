import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./styles/theme"; // Importa o tema

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reseta os estilos básicos */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
