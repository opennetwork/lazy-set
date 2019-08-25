export interface AsyncDatasetCore<T, TLike, TFind> extends AsyncIterable<T> {

  getSize(): Promise<number>;
  add(value: T | TLike): Promise<void>;
  delete(find: T | TLike | TFind): Promise<void>;
  get(find: T | TLike | TFind): Promise<T | undefined>;
  has(find: T | TLike | TFind): Promise<boolean>;
  hasAny(): Promise<boolean>;
  toSet(): Promise<Set<T>>;
  toArray(): Promise<T[]>;

}
