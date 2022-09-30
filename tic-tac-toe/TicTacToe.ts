export {
  Pos,
  TicTacToe,
  startNewGame,
  isEmptyGame,
  isOngoingGame,
  isFinishedGame,
};
const WINNING_NUMBER = 3;
const SIZE = 3;
type Pos = {
  col: 0 | 1 | 2;
  row: 0 | 1 | 2;
};

type TicTacToe = EmptyGame | OngoingGame | FinishedGame;
const isEmptyGame = (game: TicTacToe): game is EmptyGame =>
  game.__type_proof == emptygame;
const isOngoingGame = (game: TicTacToe): game is OngoingGame =>
  game.__type_proof == ongoingGame;
const isFinishedGame = (game: TicTacToe): game is FinishedGame =>
  game.__type_proof == finishedGame;

const emptygame = Symbol();
type EmptyGame = {
  __type_proof: typeof emptygame;
  move: (pos: Pos) => OngoingGame;
  toString: () => string;
};

const validpos = Symbol();
type UnoccupiedPosition = {
  __type_proof: typeof validpos;
} & Pos;
const ongoingGame = Symbol();
type OngoingGame = {
  __type_proof: typeof ongoingGame;
  move: (pos: UnoccupiedPosition) => OngoingGame | FinishedGame;
  takeMoveBack: () => OngoingGame | EmptyGame;
  isPositionUnoccupied: ReturnType<typeof isPositionUnoccupied>;
  toString: () => string;
};

const startNewGame = (): EmptyGame => {
  const firstMove = (pos: Pos) =>
    move([])(pos as UnoccupiedPosition) as OngoingGame;

  return {
    move: firstMove,
    __type_proof: emptygame,
    toString: () => toString([]),
  };
};

type Player = "X" | "O";
type GameResult = Player | "DRAW";
const finishedGame = Symbol();
type FinishedGame = {
  __type_proof: typeof finishedGame;
  takeMoveBack: () => OngoingGame;
  whoWonOrDraw: () => GameResult;
  toString: () => string;
};

// function isEmptyGame(
//   game: EmptyGame | OngoingGame | FinishedGame
// ): game is EmptyGame {
//   return game.__type_proof == emptygame;
// }

// function isOngoingGame(
//   game: EmptyGame | OngoingGame | FinishedGame
// ): game is EmptyGame {
//   return game.__type_proof == ongoingGame;
// }

type Move = { player: Player; pos: Pos };
const isPositionUnoccupied =
  (moves: Move[]) =>
  (pos: Pos): pos is UnoccupiedPosition =>
    !moves.some((p) => p.pos.col == pos.col && p.pos.row == pos.row);

const toString = (moves: Move[]): string => {
  const matrix: string[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => " ")
  );

  moves.forEach((move) => {
    matrix[move.pos.row][move.pos.col] = move.player;
  });
  return matrix.map((row) => row.toString()).join("\n");
};

const move =
  (allGameMoves: Move[]) =>
  (pos: UnoccupiedPosition): OngoingGame | FinishedGame => {
    const newMove: Move = {
      player: allGameMoves.length % 2 == 0 ? "X" : "O",
      pos,
    };

    const newMoves = [newMove, ...allGameMoves];
    const gameState = calcGameState(newMoves);

    const getOngoingGame = (moves: Move[]): OngoingGame => {
      return {
        move: move(moves),
        takeMoveBack: () => {
          const move1Removed = moves.slice(1);
          return move1Removed.length == 0
            ? startNewGame()
            : getOngoingGame(move1Removed);
        },
        isPositionUnoccupied: isPositionUnoccupied(moves),
        toString: () => toString(moves),
        __type_proof: ongoingGame,
      };
    };

    return gameState == "STILL_PLAYING"
      ? getOngoingGame(newMoves)
      : {
          takeMoveBack: () => getOngoingGame(newMoves.slice(1)),
          whoWonOrDraw: () => gameState,
          toString: () => toString(newMoves),
          __type_proof: finishedGame,
        };
  };

// #########################################################
// #########################################################
// ####### CALCULATE GAMESTATE / WINNER POSITION ###########
// #########################################################
// #########################################################

const calcGameState = (moves: Move[]): GameResult | "STILL_PLAYING" => {
  const posOf = (player: Player) =>
    moves.filter((move) => move.player == player).map((move) => move.pos);

  return hasWinningPosition(posOf("X"))
    ? "X"
    : hasWinningPosition(posOf("O"))
    ? "O"
    : moves.length === SIZE * SIZE
    ? "DRAW"
    : "STILL_PLAYING";
};

type PosNumber = {
  col: number;
  row: number;
};
const nextPosition = {
  DOWN: (pos: PosNumber): PosNumber => ({ col: pos.col, row: pos.row + 1 }),
  RIGHT: (pos: PosNumber): PosNumber => ({ col: pos.col + 1, row: pos.row }),
  DIAGONAL_DOWN_RIGHT: (pos: PosNumber): PosNumber => ({
    col: pos.col + 1,
    row: pos.row + 1,
  }),
  DIAGONAL_DOWN_LEFT: (pos: PosNumber): PosNumber => ({
    col: pos.col - 1,
    row: pos.row + 1,
  }),
};
type Direction = keyof typeof nextPosition;

const hasWinningPosition = (positions: Pos[], index = 0): boolean => {
  if (index == positions.length) {
    return false;
  }

  const isDirectionFromPositionWinning = (direction: Direction) =>
    countConsecutivePositions(positions[index], positions, direction) >=
    WINNING_NUMBER;

  const directions: Direction[] = Object.keys(nextPosition) as Direction[];

  return (
    directions.some(isDirectionFromPositionWinning) ||
    hasWinningPosition(positions, index + 1)
  );
};

const countConsecutivePositions = (
  currentPos: PosNumber,
  positions: Pos[],
  direction: Direction
): number => {
  const next = nextPosition[direction](currentPos);
  if (positions.some((pos) => pos.col == next.col && pos.row == next.row)) {
    return 1 + countConsecutivePositions(next, positions, direction);
  }
  return 1;
};