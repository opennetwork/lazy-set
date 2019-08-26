export interface AsyncLazySetCore<T, TCreate = T, TFind = TCreate | T> extends AsyncIterable<T> {

  readonly [Symbol.toStringTag]: string;

  getSize(): Promise<number>;
  add(value: T | TCreate): Promise<void>;
  delete(find: T | TCreate | TFind): Promise<boolean>;
  get(find: T | TCreate | TFind): Promise<T | undefined>;
  has(find: T | TCreate | TFind): Promise<boolean>;
  hasAny(): Promise<boolean>;
  clear(): Promise<void>;
  toSet(): Promise<Set<T>>;
  toArray(): Promise<T[]>;

  forEach<This = this>(callbackfn: (this: This, value: T, value2: T, set: this) => void | Promise<void>, thisArg?: This): Promise<void>;

  // To match Set, but async
  entries(): AsyncIterableIterator<[T, T]>;
  keys(): AsyncIterableIterator<T>;
  values(): AsyncIterableIterator<T>;

}
