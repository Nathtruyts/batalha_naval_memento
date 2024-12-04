const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Configuração do middleware
app.use(cors());
app.use(bodyParser.json());

// Pasta onde os arquivos JSON serão salvos
const SAVE_DIR = path.join(__dirname, "saves");
if (!fs.existsSync(SAVE_DIR)) {
  fs.mkdirSync(SAVE_DIR);
}

// Armazena os comandos e o estado do jogo em memória
let commands = [];
let gameState = {
  boards: {
    1: createEmptyBoard(),
    2: createEmptyBoard(),
  },
  currentPlayer: 1,
  ships: {
    1: [],
    2: [],
  },
};

// Função para criar um tabuleiro vazio
function createEmptyBoard() {
  return Array.from({ length: 10 }, () => Array(10).fill("empty"));
}

// Função para verificar se todos os navios foram destruídos
function allShipsSunk(player) {
  return gameState.ships[player].every((ship) => ship.hits === ship.size);
}

// Endpoint para salvar o estado do jogo
app.post("/save", (req, res) => {
  const { fileName, state } = req.body;

  if (!fileName || !state) {
    return res.status(400).json({ message: "Nome do arquivo e estado são obrigatórios." });
  }

  const filePath = path.join(SAVE_DIR, `${fileName}.json`);
  fs.writeFile(filePath, JSON.stringify(state, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao salvar o arquivo." });
    }
    res.json({ message: `Jogo salvo como ${fileName}.json` });
  });
});

// Endpoint para carregar o estado do jogo
app.get("/load/:fileName", (req, res) => {
  const { fileName } = req.params; // Obtém o nome do arquivo a partir dos parâmetros da URL
  const filePath = path.join(SAVE_DIR, `${fileName}.json`); // Caminho completo do arquivo

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Arquivo não encontrado." }); // Arquivo inexistente
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao ler o arquivo." });
    }

    try {
      const state = JSON.parse(data); // Tenta parsear o conteúdo do arquivo
      gameState = state; // Atualiza o estado do jogo no servidor
      res.json({ state }); // Retorna o estado do jogo
    } catch (parseError) {
      console.error(parseError);
      res.status(500).json({ message: "Erro ao interpretar o arquivo JSON." });
    }
  });
})

// Endpoint para processar comandos
app.post("/command", (req, res) => {
  const { command, player } = req.body;

  if (!command || !player) {
    return res.status(400).json({ message: "Comando e jogador são obrigatórios." });
  }

  // Valida e executa o comando
  const result = processCommand(command, player);

  // Apenas alterna o turno se o comando foi processado com sucesso
  if (result.success) {
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1; // Alterna o jogador atual
  }

  res.json(result);
});

function processCommand(command, player) {
  const [action, ...args] = command.split(" ");

  let result;

  switch (action.toLowerCase()) {
    case "place":
      if (args.length < 4) {
        return { message: "Comando inválido. Use: place <nome_do_navio> <direção> <x> <y>" };
      }
      const [name, direction, x, y] = args;
      result = placeShip(player, name, direction, parseInt(x), parseInt(y));
      break;

    case "attack":
      if (args.length < 2) {
        return { message: "Comando inválido. Use: attack <x> <y>" };
      }
      const [targetX, targetY] = args;
      result = attack(player, parseInt(targetX), parseInt(targetY));
      break;

    default:
      result = { message: "Comando desconhecido." };
  }

  // Troca de turno apenas se o comando for válido
  if (
    result &&
    (result.message.includes("sucesso") ||
      result.message.includes("acertou") ||
      result.message.includes("errou"))
  ) {
    gameState.currentPlayer = player === 1 ? 2 : 1; // Alterna entre os jogadores
  }

  return result;
}

// Atualizar o endpoint /commands
app.get("/commands", (req, res) => {
  res.json({
    commands,
    boards: gameState.boards,
    currentPlayer: gameState.currentPlayer, // Retorna o jogador atual
  });
});

// Função para posicionar navios
function placeShip(player, name, direction, x, y) {
  const shipSizes = {
    destroyer: 5,
    cruzador: 3,
    submarino: 1,
  };

  const size = shipSizes[name.toLowerCase()];
  if (!size) {
    return { message: "Tipo de navio inválido." };
  }

  // Validações
  if (
    (direction === "horizontal" && x + size > 10) ||
    (direction === "vertical" && y + size > 10)
  ) {
    return { message: "O navio não cabe no tabuleiro nessa posição." };
  }

  // Verificar sobreposição
  for (let i = 0; i < size; i++) {
    const targetX = direction === "horizontal" ? x + i : x;
    const targetY = direction === "vertical" ? y + i : y;

    if (gameState.boards[player][targetY][targetX] !== "empty") {
      return { message: "Posição inválida. Há um navio sobreposto." };
    }
  }

  // Posicionar o navio
  for (let i = 0; i < size; i++) {
    const targetX = direction === "horizontal" ? x + i : x;
    const targetY = direction === "vertical" ? y + i : y;

    gameState.boards[player][targetY][targetX] = "ship";
  }

  gameState.ships[player].push({ name, size, hits: 0 });
  return { message: `Navio ${name} posicionado com sucesso!` };
}

// Função para realizar ataques
function attack(player, x, y) {
  const opponent = player === 1 ? 2 : 1;
  const cell = gameState.boards[opponent][y][x];

  if (cell === "empty") {
    gameState.boards[opponent][y][x] = "miss";
    return { message: `Jogador ${player} atacou (${x}, ${y}) e errou.` };
  } else if (cell === "ship") {
    gameState.boards[opponent][y][x] = "hit";

    // Registrar o acerto no navio
    const ship = gameState.ships[opponent].find(
      (s) =>
        s.name ===
        Object.keys(shipSizes).find((key) => shipSizes[key] === cell.size)
    );
    if (ship) {
      ship.hits += 1;
    }

    if (allShipsSunk(opponent)) {
      return { message: `Jogador ${player} venceu o jogo!` };
    }

    return { message: `Jogador ${player} atacou (${x}, ${y}) e acertou!` };
  } else if (cell === "hit" || cell === "miss") {
    return { message: "Essa célula já foi atacada." };
  }

  return { message: "Erro inesperado." };
}

// Endpoint para listar comandos
app.get("/commands", (req, res) => {
  res.json({
    commands,
    boards: gameState.boards, // Certifique-se de que o estado do jogo contém os tabuleiros
  });
});
// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
