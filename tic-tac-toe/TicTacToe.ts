type NonEmptyArray<T> = [T, ...T[]];

type Player = "X" | "O";
const nextPlayer = (player: Player): Player => (player == "X" ? "O" : "X");

type XMove = {
    player: "X",
    pos: Pos
}

type OMove = {
    player: "O",
    pos: Pos
}

type Pos = {
  col: 0 | 1 | 2;
  row: 0 | 1 | 2;
};

type Move = XMove | OMove;

type Moves<T> = {
  moves: T;
};

type EmptyGame = Moves<[]>;

type FinishedGame = Moves<NonEmptyArray<Move>>;

type OngoingGame = Moves<NonEmptyArray<Move>>;

type GameResult = `Player ${Player} wins` | "Game draw";


const move =
  (game: EmptyGame | OngoingGame) =>
  (move: Move): OngoingGame | FinishedGame => {
    return {};
  };

const takeMoveBack = (
  game: OngoingGame | FinishedGame
): EmptyGame | OngoingGame => {
  const derp: OngoingGame = { moves: [{ col: 2, row: 1 }] };
  return { moves: [] };
};

const whoWonOrDraw = (game: FinishedGame): GameResult => {
  return "Player O wins";
};

const isPositionOccupied =
  (game: OngoingGame | FinishedGame) =>
  (pos: Pos): boolean => {
    return true;
  };
