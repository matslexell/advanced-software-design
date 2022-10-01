export { Pos, TicTacToe, startNewGame };
/**
 * In an implementation I would also add __type_proof, to all types, and include
 * functions like isOngoingGame, isFinishedGame, isEmptyGame etc.
 */

const WINNING_NUMBER = 3;
const SIZE = 3;
type Pos = {
  col: 0 | 1 | 2;
  row: 0 | 1 | 2;
};

type TicTacToe = EmptyGame | OngoingGame | FinishedGame;
type EmptyGame = {
  move: (pos: Pos) => OngoingGame;
};
type OngoingGame = {
  move: (pos: UnoccupiedPosition) => OngoingGame | FinishedGame;
  takeMoveBack: () => OngoingGame | EmptyGame;
  isPositionUnoccupied: ReturnType<typeof isPositionUnoccupied>;
};
type FinishedGame = {
  takeMoveBack: () => OngoingGame;
  whoWonOrDraw: () => GameResult;
};
type Player = "X" | "O";
type GameResult = Player | "DRAW";
type Move = { player: Player; pos: Pos };
const validpos = Symbol();
type UnoccupiedPosition = {
  __type_proof: typeof validpos;
} & Pos;


const startNewGame = (): EmptyGame => {
  const firstMove = (pos: Pos): OngoingGame =>
    move([])(pos as UnoccupiedPosition) as OngoingGame;

  return {
    move: firstMove,
  };
};

// I decided to use isPositionUnoccupied instead of isPositionOccupied, so that
// I could use the typeguard at the same time.
const isPositionUnoccupied =
  (moves: Move[]) =>
  (pos: Pos): pos is UnoccupiedPosition =>
    !moves.some((p) => p.pos.col == pos.col && p.pos.row == pos.row);

const move =
  (allGameMoves: Move[]) =>
  (pos: UnoccupiedPosition): OngoingGame | FinishedGame => {
    const newMove: Move = {
      player: allGameMoves.length % 2 == 0 ? "X" : "O",
      pos: {...pos},
    };

    const newMoves = [newMove, ...allGameMoves];
    const gameState = calcGameState(newMoves);

    const getOngoingGame = (moves: Move[]): OngoingGame => {
      return {
        move: move(moves),
        takeMoveBack: () => {
          const latestMoveRemoved = moves.slice(1);
          return latestMoveRemoved.length == 0
            ? startNewGame()
            : getOngoingGame(latestMoveRemoved);
        },
        isPositionUnoccupied: isPositionUnoccupied(moves),
      };
    };

    return gameState == "STILL_PLAYING"
      ? getOngoingGame(newMoves)
      : {
          takeMoveBack: () => getOngoingGame(newMoves.slice(1)),
          whoWonOrDraw: () => gameState,
        };
  };

const calcGameState = (moves: Move[]): GameResult | "STILL_PLAYING" => {
  // calculate the winner, or if still playing here
  return "DRAW";
};
