type NonEmptyArray<T> = [T, ...T[]];

function isGameFinished(
  game: FinishedGame | OngoingGame
): game is FinishedGame {
  return Math.random() > 0.5; // TODO implement
}

function isEmptyGame(game: EmptyGame | OngoingGame): game is EmptyGame {
  return game.moves == [];
}

function isPositionEqual(p1: Pos, p2: Pos) {
    return p1.col == p2.col && p1.row == p2.row;
}

type Pos = {
  col: 0 | 1 | 2;
  row: 0 | 1 | 2;
};

type Move = {player: Player, pos: Pos}

type Moves<T> = {
  moves: T;
};

type Player = "X" | "O";

type EmptyGame = Moves<[]>;
type FinishedGame = Moves<NonEmptyArray<Move>>;
type OngoingGame = Moves<NonEmptyArray<Move>>;

type GameResult = `Player ${Player} wins` | "Game draw";

const move =
  (game: EmptyGame | OngoingGame) =>
  (move: Move): OngoingGame | FinishedGame => {
    isPositionOccupied()
    
  };

const takeMoveBack = (
  game: OngoingGame | FinishedGame
): EmptyGame | OngoingGame => {
  const [latest, rest] = game.moves;
  if (rest == undefined) {
    return { moves: [] };
  }
  return { moves: rest };
};

const whoWonOrDraw = (game: FinishedGame): GameResult => {
  return "Player O wins";
};

const isPositionOccupied =
  (game: OngoingGame | FinishedGame) =>
  (pos: Pos): boolean => {
    return game.moves.some((move) => isPositionEqual(move.pos, pos));
  };

export { isGameFinished };