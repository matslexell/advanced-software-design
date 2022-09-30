const finishedGame = Symbol();
const ongoingGame = Symbol();
const emptygame = Symbol();

type NonEmptyArray<T> = [T, ...T[]];

function isGameFinished(
  game: EmptyGame | OngoingGame | FinishedGame
): game is FinishedGame {
  return game.__type_proof == finishedGame;
}

function isEmptyGame(
  game: EmptyGame | OngoingGame | FinishedGame
): game is EmptyGame {
  return game.__type_proof == emptygame;
}

function isOngoingGame(
  game: EmptyGame | OngoingGame | FinishedGame
): game is EmptyGame {
  return game.__type_proof == ongoingGame;
}

function isPositionEqual(p1: Pos, p2: Pos) {
  return p1.col == p2.col && p1.row == p2.row;
}

type Pos = {
  col: 0 | 1 | 2;
  row: 0 | 1 | 2;
};
const WINNING_NUMBER = 3;
const SIZE = 3;

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

const getWinningPosition = (moves: Move[]): Player | "None" => {
  const xMoves = moves
    .filter((move) => move.player == "X")
    .map((move) => move.pos);

  if (winningPositionSub(xMoves)) {
    return "X";
  }

  const oMoves = moves
    .filter((move) => move.player == "O")
    .map((move) => move.pos);

  if (winningPositionSub(oMoves)) {
    return "O";
  }

  return "None";
};

const winningPositionSub = (positions: Pos[]): boolean => {
  if (positions.length == 0) {
    return false;
  }
  const [head, ...rest] = positions;
  const horizontal = 1 + count(head, rest, "RIGHT") + count(head, rest, "LEFT");
  if (horizontal >= WINNING_NUMBER) {
    return true;
  }
  const vertical = 1 + count(head, rest, "UP") + count(head, rest, "DOWN");
  if (vertical >= WINNING_NUMBER) {
    return true;
  }
  const diagonal1 =
    1 +
    count(head, rest, "DIAGONAL_UP_RIGHT") +
    count(head, rest, "DIAGONAL_DOWN_LEFT");
  if (diagonal1 >= WINNING_NUMBER) {
    return true;
  }
  const diagonal2 =
    1 +
    count(head, rest, "DIAGONAL_UP_LEFT") +
    count(head, rest, "DIAGONAL_DOWN_RIGHT");
  if (diagonal2 >= WINNING_NUMBER) {
    return true;
  }
  return winningPositionSub(rest);
};

type PosNumber = {
  col: number;
  row: number;
};
const nextPosition = {
  UP: (pos: PosNumber): PosNumber => ({ col: pos.col, row: pos.row - 1 }),
  DOWN: (pos: PosNumber): PosNumber => ({ col: pos.col, row: pos.row + 1 }),
  LEFT: (pos: PosNumber): PosNumber => ({ col: pos.col - 1, row: pos.row }),
  RIGHT: (pos: PosNumber): PosNumber => ({ col: pos.col + 1, row: pos.row }),
  DIAGONAL_UP_LEFT: (pos: PosNumber): PosNumber => ({
    col: pos.col - 1,
    row: pos.row - 1,
  }),
  DIAGONAL_DOWN_RIGHT: (pos: PosNumber): PosNumber => ({
    col: pos.col + 1,
    row: pos.row + 1,
  }),
  DIAGONAL_UP_RIGHT: (pos: PosNumber): PosNumber => ({
    col: pos.col + 1,
    row: pos.row - 1,
  }),
  DIAGONAL_DOWN_LEFT: (pos: PosNumber): PosNumber => ({
    col: pos.col - 1,
    row: pos.row + 1,
  }),
};

type Direction = keyof typeof nextPosition;

const count = (
  currentPos: PosNumber,
  positions: Pos[],
  direction: Direction
): number => {
  const nextPos = nextPosition[direction](currentPos);
  if (
    positions.some((pos) => pos.col == nextPos.col && pos.row == nextPos.row)
  ) {
    return 1 + count(nextPos, positions, direction);
  } else {
    return 0;
  }
};

const move =
  (game: EmptyGame | OngoingGame) =>
  (pos: Pos): OngoingGame | FinishedGame => {
    if (isEmptyGame(game)) {
      return { moves: [{ player: "X", pos }], __type_proof: ongoingGame };
    } else if (isPositionOccupied(game)(pos)) {
      return game;
    }

    const newMove: Move = {
      player: game.moves[0].player == "X" ? "O" : "X",
      pos,
    };
    const moves: NonEmptyArray<Move> = [newMove, ...game.moves];
    const winningPosition = getWinningPosition(moves);

    if (SIZE * SIZE == moves.length || winningPosition != "None") {
      // Game finished
      return {
        moves,
        result: winningPosition == "None" ? "DRAW" : winningPosition,
        __type_proof: finishedGame,
      };
    } else {
      // Game ongoing
      return {
        moves,
        __type_proof: ongoingGame,
      };
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
  return game.result;
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
  winningPositionSub,
};
