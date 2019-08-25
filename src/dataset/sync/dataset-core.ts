export interface DatasetCore<T, TCreate extends T = T, TFind extends (TCreate | T) = (TCreate | T)> extends Iterable<T> {

  readonly size: number;

  getSize(): number;
  add(value: T | TCreate): void;
  delete(find: T | TCreate | TFind): void;
  get(find: T | TCreate | TFind): T | undefined;
  has(find: T | TCreate | TFind): boolean;
  hasAny(): boolean;
  toSet(): Set<T>;
  toArray(): T[];

}
