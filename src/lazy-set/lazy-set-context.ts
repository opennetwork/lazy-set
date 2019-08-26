export type AsyncIterableLike<T> = Iterable<T> | AsyncIterable<T>;

export interface LazySetContext<T, TCreate = T, TFind = TCreate | T> {
  isMatch(value: T, find: T | TCreate | TFind): boolean;
  is(value: unknown): value is T;
  isCreate(value: unknown): value is TCreate;
  isFind(value: unknown): value is TFind;
  create(value: TCreate): T;
}
