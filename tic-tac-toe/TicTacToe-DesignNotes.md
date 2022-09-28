Requirements:

* These functions are needed: `move`, `takeMoveBack`, `whoWonOrDraw`, and `isPositionOccupied`.

* All functions must be pure (no exceptions, idempotent).
* `move` should not be possible to do on a finished game - **on a type level**!
* `takeMoveBack` should not be possible to do on a game where no moves has been done yet - **on a type level**!
* `whoWonOrDraw` should not be possible to call on a non finished game  - **on a type level**!
* `isPositionOccupied` works (only?) for in-play and completed games (- **also on a type level?**)



Notes: 

This looks like it needs some types representing different states:

* **EmptyGame** - an emtpy board that has zero moves done.

* **FinishedGame** - a board that has three of one kind in a row. This implies that the number of moves can only be between 5 - 9, let's see if this is useful down the line...
* **OngoingGame** - A game that has at least one move made, but has not finished. 
* **Winner** - a type indicating the winner.
* **Col** - an index number between 0 - 2
* **Row** an index number between 0 - 2
* **Pos** position, a row and a col.



The types could look something like this:

```typescript
type EmptyGame {
	
}

type FinishedGame {

}

type OngoingGame {
	
}

type Col = 0 | 1 | 2;
type Row = 0 | 1 | 2;
type Pos = {
	col: Col,
	row: Row
}
type GameResult = "Player 1 wins" | "Player 2 wins" | "Game draw"

const move = (game: EmptyGame | OngoingGame): (OngoingGame | FinishedGame) => (pos: Pos) => { . . . }
const takeMoveBack = (game: OngoingGame | FinishedGame): (EmptyGame | OngoingGame) => { . . . }
const whoWonOrDraw = (game: FinishedGame): GameResult => { . . . }
const isPositionOccupied = (game: OngoingGame | FinishedGame) => (pos: Pos) => boolean
```





