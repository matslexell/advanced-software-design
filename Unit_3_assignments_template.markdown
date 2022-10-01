# Representable/Valid Principle: Readings Questions

## Applying the Linus Torvalds "Good Taste" coding requirement.
<Your answer goes here>


## Bugs and Battleships.
<Your answer goes here>


## The Most Dangerous Code in the World.
<Your answer goes here>


## Where to Draw the Boundary.
<Your answer goes here>


# Restricting APIs

## 1.1.

1. The easiest way to call this method wrong is to mess up the order of the input params. Maybe I want to run the washing machine for 90 minutes in 30 degrees and call `.run(30, 90, ...)` - now I'm running it in 30 minutes in 90 degrees. 
2. Is the temperature in Fahrenheit or degrees? The int doesn't tell so you might write an app assuming it's one or the other and be wrong.
3. Is the time in minutes or seconds? Same as above, you might be wrong about the unit.
4. The mode is easy to set to the wrong value by mistake, since it's just a number. They might be available statically, but they are defined as private which means that you cannot do for example `.run(..., ..., WashingMachine.LAUNDRY_MODE_MEDIUM)` outside of the class, forcing you to keep track of these settings yourself. 
5. The mode is a bit unclear what it is, but sure, there would probably be some docs available explaining what it does. It seems though that Low, Medium, High are settings related to time and temperature making me think that if mode is defined time and temperature will be disregarded and instead use some predefined setting. If so this is quite ambiguous and error prone. 
6. What happens if you call run when the laundry-machine is off? Does it turn on the machine and start it? This is a bit vague. 



I would rewrite the API to be something like the following: 

```Java
public enum WashingMachineMode {
	LAUNDRY_MODE_LOW, LAUNDRY_MODE_MEDIUM, LAUNDRY_MODE_HIGH
}

public void run( Minutes minutes, Temperature temperature, WashingMachineMode mode ) { . . . }
```



The temperature could be something like:

```Java
public interface Temperature {
    public void setFahrenheit(double fahrenheit);
    public void setCelsius(double celsius);
    public double getFahrenheit();
    public double getCelsius();
}
```

Using conversions to one unit internally... However it might even be better to just restrict to using either Fahrenheit or Celsius . 



If running shouldn't be possible unless the washing machine is turned on you could do something like this:

```Java
public enum WashingMachineMode {
	LAUNDRY_MODE_LOW, LAUNDRY_MODE_MEDIUM, LAUNDRY_MODE_HIGH
}

public Optional<WashingMachineRunner> getRunner( Minutes minutes, Temperature temperature, WashingMachineMode mode ) { . . . }

------------
class WashingMachineRunner {
  ...
	public void run() { . . . }
}


```



This way the optional would return Optional.empty() if the machine is turned off. 



There might be situations where params are in contrast to each other, like for example: If mode is defined the temperature and minutes should be disregarded. In that case I would create a configuration as it's own object:

```Java

public void run( WahingMachineRunningConfiguration config ) { . . . }

-------------

class WahingMachineRunningConfiguration {
	// Use an either type clarifying it's one or the other. (In java you would have to write one yourself, but it's pretty straightforward)
	private Either<MinutesAndTemp, WashingMachineMode> configuration;
	
	... // appropriate constructors, getters and setters for this.
}

---------------

public enum WashingMachineMode {
	LAUNDRY_MODE_LOW, LAUNDRY_MODE_MEDIUM, LAUNDRY_MODE_HIGH
}

class MinutesAndTemp{
	private Minutes minutes;
	private Temperature temperature;
	...
}
```





## 1.2.
First solution I can come up with is to set all the access modifiers to either protected or private for WashingMachine, all but `isOn()` which will be boolean. 

Second solution would be to create a wrapper that only contains the isOn function. 

```Java
public class WashingMachineState {
	private WashingMachine washingMachine;
. . .
	public boolean isOn ( ) { return  washingMachine.isOn()}
}

public class Laundromat {
	private final List<WashingMachineState> washers;
. . .
}
```



But maybe even the opposite is better, having washing machine being very restricted, and using another class internally for the additional functionality:

```Java
public class LaundryDisplay { // Or is it Laundromat?
	private final List<WashingMachine> washers;
	. . .
}

public class WashingMachine {
	public boolean isOn ( ) { . . . }
. . .
}

// Use this internally for WashingMachine: 
public class WashingMachineExt extends WashingMachine {
	private final static int LAUNDRY_MODE_LOW;
	private final static int LAUNDRY_MODE_MEDIUM;
	private final static int LAUNDRY_MODE_HIGH;
	public void run ( int time , int tempera ture , int mode ) { . . . }
	public void turnOff ( ) { . . . }

	public int getWeightO fClothes InWasher ( ) ;
	public int getCurrentTempera ture ( ) ;
	public int getNumberO fQuarters ( ) ;
. . .
}
```



An interface could also be used for the outwards facing API.



## 1.3.

I'm thinking that Laundromat would have a function that returns isOn based on an id here:

```Java

public class LaundryDisplay { // Or is it Laundromat?
	private final List<WashingMachine> washers;
	public boolean isOn(int machineIdx) {
		return washers.get(machineIdx).isOn();
	}
}
```



However I'm unsure if I like that idea. How would one know which id a machine has? 

Maybe the same solution, restricting the API of WashingMachine from the source is the most appropriate way to go even in this case. 

## 2.1.
```Typescript
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
      pos: { col: pos.col, row: pos.row },
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
```



## 2.2. Extra Challenge 1
I think the above code will do that if implemented in javascript, since the methods are added only to the appropriate types. 

## 2.3. Extra challenge 2
This is achieved by having to pass `pos: UnoccupiedPosition`, and having the type guard `isPositionUnoccupied` .

# Simpler and More Correct

## 1.1.

Even though there's a lot to do by making this code safer, you could start by replacing Strings by appropriate types:

````java
import java.time.DayOfWeek;

public class Discount {
    private final double discountPercent;
    private CustomerTypeDiscount customerTypeDiscount;
    private Item itemDiscount;
    private DayOfWeek dayOfWeekDiscount;

    public Discount(double discountPercent) {
        this.discountPercent = discountPercent;
    }

    public boolean doesDiscountApply(Customer c, Item item) {
        if (customerTypeDiscount != null) {
            if (customerTypeDiscount == CustomerTypeDiscount.STUDENT) return c.isStudent();
            else if (customerTypeDiscount == CustomerTypeDiscount.EMPLOYEE) return c.isEmployee();
        }
        if (itemDiscount != null) {
            return itemDiscount == item;
        }
        if (dayOfWeekDiscount != null) {
            return DateUtils.getDayOfWeek().equals(dayOfWeekDiscount);
        }
        return false;
    }

    public double applyDiscount(double price) {
        return price * (1 - discountPercent);
    }

    public enum CustomerTypeDiscount {
        STUDENT, EMPLOYEE
    }

}
````



## 1.2.
With the DayOfWeek, it won't be possible to pass in "Weekend", see code above. 

However, if VETERAN is added to the CustomerTypeDiscount, the programmer might forget to update the code in doesDiscountApply. 

To battle this, we can instead use abstract class for CustomerTypeDiscount, like this:

```java
    public boolean doesDiscountApply(Customer c, Item item) {
        if (customerTypeDiscount != null) {
            return customerTypeDiscount.discountApplies(c);
        }
        if (itemDiscount != null) {
            return itemDiscount == item;
        }
        if (dayOfWeekDiscount != null) {
            return DateUtils.getDayOfWeek().equals(dayOfWeekDiscount);
        }
        return false;
    }

  .
  .
  .
    
    public abstract class CustomerTypeDiscount {
        public abstract boolean discountApplies(Customer c);
    }

    public class StudentDiscount extends CustomerTypeDiscount {

        @Override
        public boolean discountApplies(Customer c) {
            return c.isStudent();
        }
    }

    public class Employee extends CustomerTypeDiscount {

        @Override
        public boolean discountApplies(Customer c) {
            return c.isEmployee();
        }
    }

    public class Veteran extends CustomerTypeDiscount {

        @Override
        public boolean discountApplies(Customer c) {
            return c.isVeteran();
        }
    }
```



## 1.3.
I would just have the item itself as the discount at `private Item itemDiscount;`.



## 1.4.
<Your answer goes here>

## 1.5. (Optional)
<Your answer goes here>

## 2.
<Your answer goes here>