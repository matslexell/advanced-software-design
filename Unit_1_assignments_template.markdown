# Hidden Layer of Logic: Readings

## The Three Levels of Software.

Consider the following piece of code, imagine it's available in the module *sortedUserDataList.ts*:

```typescript
const sortedArraySym = Symbol();

type UserData = {
  name: string;
  age: number;
  email: string;
};

export type SortedUserDataList = {
  __type_proof: typeof sortedArraySym;
  get: (idx: number) => UserData;
  length: () => number;
};

export const sortedUserDataList = (
  userData: UserData[]
): SortedUserDataList => {
  const sort = (userData: UserData[]) =>
    userData.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  const sortedList = sort([...userData]);

  return {
    __type_proof: sortedArraySym,
    get: (idx: number) => sortedList[idx],
    length: () => sortedList.length,
  };
};
```



Now imagine we have the following piece of code in another part of the the application, module named *search.ts*:

```TypeScript
const binaryUserSearch =
  (sortedUserDataList: SortedUserDataList) =>
  (name: string): UserData | undefined => {
    let start = 0;
    let end = sortedUserDataList.length();
    let middle = Math.trunc((start + end) / 2);
    let user = sortedUserDataList.get(middle);

    while (start < end && user.name !== name) {
      if (name < user.name) {
        end = middle - 1;
      } else if (name > user.name) {
        start = middle + 1;
      }
      middle = Math.trunc((start + end) / 2);
      user = sortedUserDataList.get(middle);
    }

    return user.name == name ? user : undefined;
  };
```



In some regards this might appear as safe code. The binaryUserSearch function takes a list that's supposedly guaranteed to be sorted. The Type SortedUserDataList even includes a unique symbol stored in __type_proof, so that it can only be (easily) created using the sortedUserDataList function from sortedUserDataList.ts. Of course you can always use an "**as**" operator and cast a non sorted list to a SortedUserDataList, but most people know that's bad practice (... hopefully). 



**So what's wrong with the code?** 

I would argue that the problem with binaryUserSearch is that it assumes that the incoming SortedUserDataList is sorted in ascending order in regards to the user.name field. This is not clear without reading the code of sortedUserDataList.ts. 

Let's say in the future the sorting function changes to descending, alphanumeric, or in regards to user.email instead. We will most likely start seeing different behavior. 



This is a little bit how the precondition of binaryUserSearch would look like today. Let's denote the list representation of sortedUserDataList as Xs:

```
{ Xs = [x0, x1, ..., xn] where x(i).name < x(i+1).name for all Xs}
```



Which is not guaranteed in the type of SortedUserDataList itself. We just assume it is, because we've read and run the code once. 

We could however make the precondition stronger by including a comparator in the SortedList type. See example:



```typescript
export type SortedDataList<D> = {
  __type_proof: typeof sortedArraySym;
  get: (idx: number) => D;
  length: () => number;
  comp: (a: D, b: D) => number
};

export const sortedDataList =  <D>(
  data: D[],
  comp: (a: D, b: D) => number
): SortedDataList<D> => {
  const sort = (userData: D[]) =>
    userData.sort(comp);

  const sortedList = sort([...data]);

  return {
    __type_proof: sortedArraySym,
    get: (idx: number) => sortedList[idx],
    length: () => sortedList.length,
    comp
  };
};

// ---------------------------------------------------------------
// ----ANOTHER PART OF THE APPLICATION ---------------------------
// ---------------------------------------------------------------

// a function that binary searches through a sorted list
const binarySearch =
  <D>(sortedDataList: SortedDataList<D>) =>
  (findThis: D): D | undefined => {
    let start = 0;
    let end = sortedDataList.length();
    let middle = Math.trunc((start + end) / 2);
    let data = sortedDataList.get(middle);
    const comp = sortedDataList.comp;

    while (start < end && comp(findThis, data) !== 0) {
      if (comp(findThis, data) == -1) {
        end = middle - 1;
      } else if (comp(findThis, data)) {
        start = middle + 1;
      }
      middle = Math.trunc((start + end) / 2);
      data = sortedDataList.get(middle);
    }

    return comp(findThis, data) === 0 ? data : undefined;
  };
```



Now we know that whatever is being sorted is being sorted in accordance to the comparator method. The precondition is easier to hold now:

```
{ Xs = [x0, x1, ..., xn] where comp(x(i), x(i+1)) = -1 | comp(x(i), x(i+1)) = 0 for all Xs}
```



Whether comp is in ascending, descending or alphanumeric order doesn't matter. Whatever the comp function does to the list the precondition will hold true if comp has been applied



## The Design of Software is a Thing Apart.

Imagine an admin software for a grocery store that displays an inventory of items in the following manner: 

```
Inventory count: 
Chicken wing(s): 21
Milk carton(s): 46
Tuna can(s): 87
```

I.e the name of the item followed by a count of how many is in the store. 



The data types might look something this:

```typescript
type Item = {name: String, price: Price}
type ItemCount = {item: Item, count: number}
```



We then start storing the expiry date of each items, as timestamps, and we realise we can use the same code, since it's also number. It it also kind of "counts" something.  We reuse the the ItemCount at first and might get an output like this:

```
Inventory w/expiry date: 
Chicken Wing: 1662474768
Chicken Wing: 1662474768
Chicken Wing: 1662474768
Chicken Wing: 1662816768
Chicken Wing: 1662816768
.
.
.
Tuna can: 1662989568
Tuna can: 1662989568
```



However, imagine that we want to improve our flexibility in the code and decide to use Date instead of number for the timestamp, this would not be possible without rewriting ItemCount and disturbing the part of application that counts the number of items in the inventory. So inventory count and inventory expiry date would be better of using different data types. 




## Painless Functional Specifications Part 1.
The way I understand Joel Spolsky in the article is that having a well written design spec before starting to code is good because: 

* Mainly the quality of the code increases - Less technical debt because of more clarity before starting to write code.
* Testing becomes more reliable. Tests are supposed to make sure the code works as the design of the application. 
* The program/product itself usually gets better - No compromise between the "wrong design and the ideal design", since wrong design decisions are avoided by having a spec to follow.
* Technical manuals improve, since they become easier to write when there is a clear explanation in the spec of how the product is supposed to work.

So the artifacts would be code, test code, overall product, and technical manuals. 



Furthermore, a well written design specs also improves the work for scheduling, marketing, and business development. However, I'm not sure these are considered "artifacts".




## Modules Matters Most.
<Your answer goes here>


# Hoare Logic

## 1.

How the code currently looks like:

```
{ t r u e }
x = 1 0;
{ x > 1 }
y = 4 2;
{ x > 1 , y > 1 }
z = x + y ;
{ z > 1 }
```





Without altering the postcondition the code could be changed quite a bit. For example to this:

```
{ t r u e }
x = 2;
{ x > 1 }
y = 2;
{ x > 1 , y > 1 }
z = x + y ;
{ z > 1 }
```



If we look at the program above as two separate programs:

```
Program A:
{ t r u e }
x = 1 0;
{ x = 10 }
y = 42;
{ x > 1 , y > 1 }
```



```
Program B:
{ x > 1 , y > 1 }, 
z = x + y ;
{ z > 1 }
```



The strongest postcondition of A would be { x = 10 , y = 42 }, and it is stronger than the weakest pre condition of B*. This gives us modularity in the sense that we can change program A a lot without changing B. We can change the programs a lot here since both y and x can assume values between 1 and inf without the precondition being violated in program B. 

**(actually for z > 1 I would argue this is the weakest precondition `{ x > 1 /\ y >= 0 or x >= 0 /\ y > 1 }`, since z = x + y still fulfills the postcondition, only one of addends needs to be bigger than 1. However if you do this you could keep going with examples such as `{ x > 2 /\ y >= -1 or x >= -1 /\ y > 2 }`, so I don't know if this is correct.*



Lets say the postcondition was stronger, like `{ z = 42 }`. Then the weakest precondition would look something like this:

```
{ y = 42 - x }, 
z = x + y ;
{ z = 42 }
```



You would have to be more specific in the way you change your program A in order for the precondition to still hold.

```
Program A:
{ t r u e }
x = 5;
{ x = 5 }
y = 47;
{ y = 42 - x } //
```

 The strongest post condition in the above code is { x = 5 , y = 47 }, and is stronger than { y = 42 - x }, so we have some modularity in the sense that we can change the code to example { x = 20 , y = 62 } etc, but it is not as modular as the first example.




## 2.
```
1 { a = 0 }
2 b := 2 − a
3 { b = 2 }
4 c := b ∗ 2
5 { c = 4 }
6 d := c + 1
7 {d = 5}
```


## 3.
```
1 { x > 0 }
2 y := ( (x > 0) / 2 ) * 2
3 { (x is odd => y = x - 1) /\ (x is even => y = x) }
4 z := x − y
5 { (x is odd => z = 1) /\ (x is even => z = 0) }
6 a := z * 5 + ( 1 − z ) * 12
7 { (( x is odd ) => a = 5 ) /\ (( x is even ) => a = 12 )}
```




## 4.1.
```
1 { true }
2 d := ( 2 − (a+1)/a ) / 2 ;
3 { a <= 0 => d = 1 /\ a > 0 => d = 0}
4 m := d * 2 + (1−d) * 3 ; 
5 { a <= 0 => m = 2 /\ a > 0 => m = 3 } 
6 x := b * 2;
7 { x = b * 2, a <= 0 => m = 2 /\ a > 0 => m = 3 }
8 x := x * 2 ;
9 { x = b * 4, a <= 0 => m = 2 /\ a > 0 => m = 3 }
10 x := m * x ;
11 { (( a <= 0 ) => x = 8*b) /\ (( a > 0 ) => x = 12*b) }
12 x := x + 1 ;
13 { (( a <= 0 ) => x = 8*b+1) /\ (( a > 0 ) => x = 12*b+1) }
```



## 4.2.
The conditional is wether ***a*** is a positive or negative integer. 



## 5.
```
 1  { true }
 2  x := b * 2;
 3  { x = b * 2 }
 4  x := x * 2 ;
 5  { x = b * 4 }
 6  x := m * x ;
 7  { x =  m * b * 4 }
 8  x := x + 1 ;
 9  { x = m * b * 4 + 1 }
10  m := d * 2 + (1−d) * 3; // Simpler form is m = 3 - d 
11  { x = 12*b - 4*b*d + 1} // expanded from (3-d)*4*b + 1
12  d := ( 2 − (a+1)/a ) / 2 ;
13  { (( a <= 0 ) => x = 8*b+1) /\ (( a > 0 ) => x = 12*b+1) }
```






## 6.
<Your answer goes here>