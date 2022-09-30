import { isArgumentsObject } from "util/types";
import { describe, expect, test } from "@jest/globals";
import { strict as assert } from "assert";

import {
  startNewGame,
  Pos,
  TicTacToe,
  isEmptyGame,
  isOngoingGame,
  isFinishedGame,
} from "./TicTacToeImpl";

const game1: Pos[] = [
  { col: 1, row: 1 },
  { col: 1, row: 0 },
  { col: 2, row: 2 },
  { col: 1, row: 2 },
  { col: 0, row: 0 },
];

const game2: Pos[] = [
  { col: 0, row: 0 },
  { col: 1, row: 0 },
  { col: 0, row: 1 },
  { col: 1, row: 1 },
  { col: 2, row: 2 },
  { col: 1, row: 2 },
];

const game3: Pos[] = [
  { col: 0, row: 0 },
  { col: 2, row: 0 },
  { col: 2, row: 1 },
  { col: 1, row: 0 },
  { col: 0, row: 2 },
  { col: 2, row: 2 },
  { col: 1, row: 2 },
  { col: 1, row: 1 },
  { col: 0, row: 1 },
];

const game4: Pos[] = [
  { col: 0, row: 0 },
  { col: 2, row: 1 },
  { col: 2, row: 2 },
  { col: 1, row: 0 },
  { col: 2, row: 0 },
  { col: 0, row: 2 },
  { col: 1, row: 2 },
  { col: 1, row: 1 },
  { col: 0, row: 1 },
];

const game5: Pos[] = [
  { col: 2, row: 1 },
  { col: 0, row: 2 },
  { col: 0, row: 1 },
  { col: 1, row: 1 },
  { col: 2, row: 2 },
  { col: 0, row: 1 },
  { col: 1, row: 2 },
  { col: 1, row: 1 },
];

// function that takes in a position array and fills a 3x3 matrix with the positions, alterning between values x and o
const fillMatrixAndPrint = (posArray: Pos[]) => {
  const matrix: string[][] = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];
  let i = 0;
  posArray.forEach((pos) => {
    if (matrix[pos.row][pos.col] == " ") {
      if (i % 2 === 0) {
        matrix[pos.row][pos.col] = "x";
      } else {
        matrix[pos.row][pos.col] = "o";
      }
      i++;
    }
  });
  matrix.forEach((row) => {
    console.log(row);
  });
  console.log();
  return matrix;
};

const fillMatrixAndPrintSame = (posArray: Pos[]) => {
  const matrix: string[][] = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];
  let i = 0;
  posArray.forEach((pos) => {
    matrix[pos.row][pos.col] = "x";
  });
  matrix.forEach((row) => {
    console.log(row);
  });
  console.log();
  return matrix;
};

fillMatrixAndPrint(game1);
fillMatrixAndPrint(game2);
fillMatrixAndPrint(game3);
fillMatrixAndPrint(game4);
fillMatrixAndPrint(game5);

const playGame = (positions: Pos[]): TicTacToe => {
  let game: TicTacToe = startNewGame();

  positions.forEach((pos) => {
    if (isEmptyGame(game)) {
      game = game.move(pos);
    } else if (isOngoingGame(game) && game.isPositionUnoccupied(pos)) {
      game = game.move(pos);
    }
  });

  return game;
};

describe("isGameFinished", () => {
  it("Game 1", () => {
    const game1Played = playGame(game1);
    console.log(game1Played.toString());
    expect(isFinishedGame(game1Played)).toBe(true);
    if (isFinishedGame(game1Played)) {
      expect(game1Played.whoWonOrDraw()).toBe("X");
    }
  });
  it("Game 2", () => {
    const game2Played = playGame(game2);
    console.log(game2Played.toString());
    expect(isFinishedGame(game2Played)).toBe(true);
    if (isFinishedGame(game2Played)) {
      expect(game2Played.whoWonOrDraw()).toBe("O");
    }
  });
  it("Game 3", () => {
    const game3Played = playGame(game3);
    console.log(game3Played.toString());
    expect(isFinishedGame(game3Played)).toBe(true);
    if (isFinishedGame(game3Played)) {
      expect(game3Played.whoWonOrDraw()).toBe("X");
    }
  });
  it("Game 4", () => {
    const game4Played = playGame(game4);
    console.log(game4Played.toString());
    expect(isFinishedGame(game4Played)).toBe(true);
    if (isFinishedGame(game4Played)) {
      expect(game4Played.whoWonOrDraw()).toBe("DRAW");
    }
  });
  it("Game 5", () => {
    const game5Played = playGame(game5);
    console.log(game5Played.toString());
    expect(isFinishedGame(game5Played)).toBe(false);
    expect(isOngoingGame(game5Played)).toBe(true);
  });
});
