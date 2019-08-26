export interface AsyncDatasetCore<T, TCreate = T, TFind = TCreate | T> extends AsyncIterable<T> {

  getSize(): Promise<number>;
  add(value: T | TCreate): Promise<void>;
  delete(find: T | TCreate | TFind): Promise<void>;
  get(find: T | TCreate | TFind): Promise<T | undefined>;
  has(find: T | TCreate | TFind): Promise<boolean>;
  hasAny(): Promise<boolean>;
  toSet(): Promise<Set<T>>;
  toArray(): Promise<T[]>;

}
