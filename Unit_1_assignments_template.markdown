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



In some regards this might appear as safe code. The binaryUserSearch function takes a list that's supposably garanteed to be sorted. The Type SortedUserDataList even includes a unique symbol stored in __type_proof, so that it can only be (easily) created using the sortedUserDataList function from sortedUserDataList.ts. Of course you can always use an "**as**" operator and cast a non sorted list to a SortedUserDataList, but most people know that's bad practice (... hopefully). 



**So what's wrong with the code?** 

I would argue that the problem with binaryUserSearch is that it assumes that the incoming SortedUserDataList is sorted in ascending order in regards to the user.name field. This is not clear without reading the code of sortedUserDataList.ts. 

Let's say in the future the sorting function changes to descending, alphanumeric, or in regards to "name+email" instead. We might start seeing different behaviour. 



This is a little bit how the precondition of binaryUserSearch would look like today. Let's denote the list representation of sortedUserDataList as Xs:

```
{ Xs = [x0, x1, ..., xn] where x(i).name < x(i+1).name for all Xs}
```



Which is not gauranteed in the type of SortedUserDataList itself. We just assume it is, because we've read and run the code once. 

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



Now, wether comp is in ascending, descending or alphanumeric order doesn't matter. Becuase it's still something that we don't have to assume, since the comp function is passed with the sortedDataList. 



DISCLAIMER: It might not really make practical sense for binarySearch to require you to pass "data: D" when it's the data you're looking for to begin with. 



## The Design of Software is a Thing Apart.

Imagine a software that displays an inventory of items in a grocery store. You might want to show a table of items is the following matter:

```
Inventory: 
Chicken wing(s): 21
Milk carton(s): 46
Tuna can(s): 87
```



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



However, imagine that we want to improve our flexibility in the code and decide to use Date instead of number for the timestamp, this would not be possible without rewriting ItemCount and disturbing the part of application that counts the number of items in the inventory. 




## Painless Functional Specifications Part 1.
<Your answer goes here>


## Modules Matters Most.
<Your answer goes here>


# Hoare Logic

## 1.
<Your answer goes here>


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
2 y := ( x / 2 ) ∗ 2
3 { }
4 z := x − y
5 { }
6 a := z ∗ 5 + ( 1 − z ) ∗ 12
7 { (( x i s odd ) => a = 5 ) /\ (( x is even ) => a = 12 )}
```




## 4.1.
<Your answer goes here>

## 4.2.
<Your answer goes here>

## 5.
<Your answer goes here>


## 6.
<Your answer goes here>