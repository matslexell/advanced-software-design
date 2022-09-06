const sortedArraySym = Symbol(); // not exported from module

export type SortedArray<A> = {
  __type_proof: typeof sortedArraySym;
  getArray: () => Array<A>;
};

export const mkSortedArray = <A,>(arr: Array<A>): SortedArray<A> =>
  [...arr].sort() as unknown as SortedArray<A>;



const sorted = mkSortedArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

