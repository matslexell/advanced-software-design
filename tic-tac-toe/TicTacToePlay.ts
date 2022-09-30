import {
  startNewGame,
  Pos,
  TicTacToe,
  isEmptyGame,
  isOngoingGame,
  isFinishedGame,
} from "./TicTacToeImpl";

const input = require("prompt-sync")();

let game: TicTacToe = startNewGame();

const inputPosition = () => {
  const rowCol = input("Enter [row] [col]");
  const [row, col] = rowCol
    .trim()
    .split(" ")
    .map((n) => parseInt(n.trim()));
  return { row: parseInt(row), col: parseInt(col) } as Pos;
};

const playTurn = (game: TicTacToe) => {
  console.log(game.toString());

  if (isEmptyGame(game)) {
    const pos = inputPosition();
    game = game.move(pos);
  } else if (isOngoingGame(game)) {
    const pos = inputPosition();
    if (game.isPositionUnoccupied(pos)) {
      game = game.move(pos);
    } else {
      console.log("Position is occupied: ", pos);
    }
  }

  return game;
};

while (true) {
  game = playTurn(game);
  if (isFinishedGame(game)) {
    console.log("Game finished! Result is: ", game.whoWonOrDraw());
    break;
  }
}
