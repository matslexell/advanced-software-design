const finishedGame = Symbol();
const ongoingGame = Symbol();
const emptygame = Symbol();

type NonEmptyArray<T> = [T, ...T[]];

function isGameFinished(
  game: EmptyGame | OngoingGame | FinishedGame
): game is FinishedGame {
  return game.__type_proof == finishedGame;
}

function isEmptyGame(game: EmptyGame | OngoingGame | FinishedGame): game is EmptyGame {
  return game.__type_proof == emptygame;
}

function isOngoingGame(game: EmptyGame | OngoingGame | FinishedGame): game is EmptyGame {
    return game.__type_proof == ongoingGame;
  }

function isPositionEqual(p1: Pos, p2: Pos) {
  return p1.col == p2.col && p1.row == p2.row;
}

type Pos = {
  col: 0 | 1 | 2;
  row: 0 | 1 | 2;
};

type Move = { player: Player; pos: Pos };

type Moves<T> = {
  moves: T;
};

type Player = "X" | "O";

type EmptyGame = Moves<[]> & { __type_proof: typeof emptygame };
type OngoingGame = Moves<NonEmptyArray<Move>> & {
  __type_proof: typeof ongoingGame;
};
type FinishedGame = { result: GameResult } & Moves<NonEmptyArray<Move>> & {
    __type_proof: typeof finishedGame;
  };

type GameResult = Player | "DRAW";

const startNewGame = (): EmptyGame => {
  return { moves: [], __type_proof: emptygame };
};

const move =
  (game: EmptyGame | OngoingGame) =>
  (pos: Pos): OngoingGame | FinishedGame => {
    if (isEmptyGame(game)) {
      return { moves: [{ player: "X", pos }], __type_proof: ongoingGame };
    } else if (!isPositionOccupied(game)(pos)) {
      const [head] = game.moves;
      const player = head.player == "X" ? "O" : "X";
      return { moves: [{ player, pos }, ...game.moves], __type_proof: ongoingGame };
    } else {
      return game;
    }
  };

// const takeMoveBack = (
//   game: OngoingGame | FinishedGame
// ): EmptyGame | OngoingGame => {
//   const [latest, rest] = game.moves;
//   if (rest == undefined) {
//     return { moves: [] };
//   }
//   return { moves: rest };
// };

const whoWonOrDraw = (game: FinishedGame): GameResult => {
  return "X";
};

const isPositionOccupied =
  (game: OngoingGame | FinishedGame) =>
  (pos: Pos): boolean => {
    return game.moves.some((move) => isPositionEqual(move.pos, pos));
  };

export {
  isGameFinished,
  EmptyGame,
  OngoingGame,
  FinishedGame,
  move,
  startNewGame,
  whoWonOrDraw,
  isPositionOccupied,
  isOngoingGame,
  isEmptyGame,
};
