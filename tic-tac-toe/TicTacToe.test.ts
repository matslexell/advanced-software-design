import { isArgumentsObject } from "util/types";
import { describe, expect, test } from "@jest/globals";
import { strict as assert } from 'assert';

import {
  isGameFinished,
  isOngoingGame,
  EmptyGame,
  FinishedGame,
  OngoingGame,
  move,
  startNewGame,
  isEmptyGame,
  whoWonOrDraw,
  winningPositionSub
} from "./TicTacToe";

type Pos = {
  col: 0 | 1 | 2;
  row: 0 | 1 | 2;
};

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

const playGame = (positions: Pos[]): OngoingGame | FinishedGame | EmptyGame => {
  let game: EmptyGame | OngoingGame | FinishedGame = startNewGame();
  positions.forEach((pos) => {
    if (!isGameFinished(game)) {
      game = move(game)(pos);
    }
  });

  return game;
};

const pos1winning: Pos[] = [
  { col: 1, row: 0 },
  { col: 2, row: 1 },
  { col: 1, row: 1 },
  { col: 0, row: 2 },
  { col: 1, row: 1 },
  { col: 1, row: 2 },
];

const pos2loosing: Pos[] = [
  { col: 0, row: 0 },
  { col: 2, row: 1 },
  { col: 1, row: 1 },
  { col: 0, row: 2 },
  { col: 1, row: 1 },
  { col: 1, row: 2 },
];

const pos3winning: Pos[] = [
  { col: 0, row: 0 },
  { col: 2, row: 1 },
  { col: 1, row: 1 },
  { col: 0, row: 2 },
  { col: 1, row: 1 },
  { col: 2, row: 2 },
];

fillMatrixAndPrintSame(pos1winning);
fillMatrixAndPrintSame(pos2loosing);
fillMatrixAndPrintSame(pos3winning);

assert(winningPositionSub(pos1winning));
assert(!winningPositionSub(pos2loosing));
assert(winningPositionSub(pos3winning));

describe("isGameFinished", () => {
  it("Game 1", () => {
    const game1Played = playGame(game1);
    expect(isGameFinished(game1Played)).toBe(true);
    if (isGameFinished(game1Played)) {
      expect(whoWonOrDraw(game1Played)).toBe("X");
    }
  });
  it("Game 2", () => {
    const game2Played = playGame(game2);
    expect(isGameFinished(game2Played)).toBe(true);
    if (isGameFinished(game2Played)) {
      expect(whoWonOrDraw(game2Played)).toBe("O");
    }
  });
  it("Game 3", () => {
    const game3Played = playGame(game3);
    expect(isGameFinished(game3Played)).toBe(true);
    if (isGameFinished(game3Played)) {
      expect(whoWonOrDraw(game3Played)).toBe("X");
    }
  });
  it("Game 4", () => {
    const game4Played = playGame(game4);
    expect(isGameFinished(game4Played)).toBe(true);
    if (isGameFinished(game4Played)) {
      expect(whoWonOrDraw(game4Played)).toBe("DRAW");
    }
  });
  it("Game 5", () => {
    const game5Played = playGame(game5);
    expect(isGameFinished(game5Played)).toBe(false);
    expect(isOngoingGame(game5Played)).toBe(true);
  });
});
