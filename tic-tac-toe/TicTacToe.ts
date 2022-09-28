type NonEmptyArray<T> = [T, ...T[]];

type Player = "X" | "O";
type AlterSub<A, B> = [A] | [A, AlterSub<B, A> | [B]];
type AlternatingList<A, B> = AlterSub<A, B> | AlterSub<B, A>;

function isFinishedGame(
  game: FinishedGame | OngoingGame
): game is FinishedGame {
  return Math.random() > 0.5; // TODO implement
}

function isEmptyGame(game: EmptyGame | OngoingGame): game is EmptyGame {
  return game.moves == [];
}

function isOngoingGame(game: EmptyGame | OngoingGame): game is OngoingGame {
  return game.moves != [];
}

function isXMove(move: XMove | OMove): move is XMove {
  return move.player == "X";
}

function isOMove(move: XMove | OMove): move is OMove {
  return move.player == "O";
}

// const alterBool: AlternatingList<true, false> = [true];

type Pos = {
  col: 0 | 1 | 2;
  row: 0 | 1 | 2;
};

type Move = { pos: Pos };

type XMove = { player: "X" } & Move;
type OMove = { player: "O" } & Move;

type Moves = {
  moves: AlternatingList<XMove, OMove>;
};

type EmptyGame = { moves: [] };

type FinishedGame = Moves;
type OngoingGame = Moves;

type GameResult = `Player ${Player} wins` | "Game draw";

const getNextMove = (
  latestMove: XMove | OMove,
  newMovePos: Pos
): XMove | OMove => {
  return { player: latestMove.player == "X" ? "O" : "X", pos: newMovePos };
};

const move =
  (game: EmptyGame | OngoingGame) =>
  (move: Move): OngoingGame | FinishedGame => {
    if (isEmptyGame(game)) {
    } else if (isOngoingGame(game)) {
      const [latest, rest] = game.moves;

      if (isXMove(latest)) {
        const nextMove = getNextMove(latest, move.pos);
        if (isOMove(nextMove)) {
            return { moves: [nextMove, game.moves] };
        }

        return isOMove(nextMove) ? { moves: [nextMove, game.moves] };

      } else if (isOMove(latest)) {
        const nextMove = getNextMove(latest, move.pos);
        return { moves: [nextMove, game.moves] };
      }
    }
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
    return true;
  };
