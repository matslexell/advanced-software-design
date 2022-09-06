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

// ---------------------------------------------------------------
// ----ANOTHER PART OF THE APPLICATION ---------------------------
// ---------------------------------------------------------------

// a function that binary searches through a sorted list
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

const userData = [
  { name: "J1", age: 43, email: "jhonny1@gmail.com" },
  { name: "J2", age: 43, email: "jhonny2@gmail.com" },
  { name: "J11", age: 43, email: "johnny11@gmail.com" },
  { name: "John", age: 43, email: "john@gmail.com" },
  { name: "Jane", age: 23, email: "jane@gmail.com" },
  { name: "Albert", age: 36, email: "albert@gmail.com" },
  { name: "Joe", age: 28, email: "joe@gmail.com" },
];

const sortedList = sortedUserDataList(userData);

console.log(sortedList.toString());

const search = binaryUserSearch(sortedList);

console.log(search("A"));

// ---------------------------------------------------------------
// ----BETTER VERSION----------------- ---------------------------
// ---------------------------------------------------------------

export type SortedDataList<D> = {
  __type_proof: typeof sortedArraySym;
  get: (idx: number) => D;
  length: () => number;
  comp: (a: D, b: D) => number;
};

export const sortedDataList = <D>(
  data: D[],
  comp: (a: D, b: D) => number
): SortedDataList<D> => {
  const sort = (userData: D[]) => userData.sort(comp);

  const sortedList = sort([...data]);

  return {
    __type_proof: sortedArraySym,
    get: (idx: number) => sortedList[idx],
    length: () => sortedList.length,
    comp,
  };
};

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
