export interface LazySetCore<T, TCreate = T, TFind = TCreate | T> extends Set<T> {

  readonly [Symbol.toStringTag]: string;
  readonly size: number;

  getSize(): number;
  add(value: T | TCreate): this;
  delete(find: T | TCreate | TFind): boolean;
  get(find: T | TCreate | TFind): T | undefined;
  has(find: T | TCreate | TFind): boolean;
  clear(): void;
  hasAny(): boolean;
  toSet(): Set<T>;
  toArray(): T[];

  forEach<This = this>(callbackfn: (this: This, value: T, value2: T, set: this) => void, thisArg?: This): void;

  // To match Set
  entries(): IterableIterator<[T, T]>;
  keys(): IterableIterator<T>;
  values(): IterableIterator<T>;

}
