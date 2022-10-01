import {
  startNewGame,
  Pos,
  TicTacToe,
  isEmptyGame,
  isOngoingGame,
  isFinishedGame,
} from "./TicTacToeImpl";

const scan = (message: string) => {
  const input = require("prompt-sync")();
  return input(message);
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let game: TicTacToe = startNewGame();

const inputPosition = () => {
  const rowCol = scan("Enter [row] [col], or t for takeMoveBack").trim();

  if (rowCol === "hack") {
    return "hack";
  }

  if (rowCol === "t") {
    return "t";
  }

  const [row, col] = rowCol.split(" ").map((n) => parseInt(n.trim()));
  return { row: parseInt(row), col: parseInt(col) } as Pos;
};

const playTurn = (game: TicTacToe) => {
  console.log(game.toString());
  const input = inputPosition();

  if (input == "hack") {
    // Input some hacky stuff here

  } else if (input === "t") {
    if (isOngoingGame(game) || isFinishedGame(game)) {
      game = game.takeMoveBack();
    }
  } else if (isEmptyGame(game)) {
    game = game.move(input);
  } else if (isOngoingGame(game)) {
    if (game.isPositionUnoccupied(input)) {
      game = game.move(input);
    } else {
      console.log("Position is occupied: ", input);
    }
  }

  return game;
};

const playTheGame = () => {
  while (true) {
    game = playTurn(game);
    if (isFinishedGame(game)) {
      console.log("Game finished! Result is: ", game.whoWonOrDraw());
      break;
    }
  }
};

playTheGame();
