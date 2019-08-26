import { ResultType, ResultValue } from "../../iterator/result-type";

export type AsyncIterableLike<T> = Iterable<T> | AsyncIterable<T>;
export type AsyncDrainType<T> = AsyncIterableLike<T>;

export interface DatasetContext<Async extends ResultType, T, TCreate = T, TFind = TCreate | T, DrainType extends AsyncDrainType<any> = Iterable<any>> {
  readonly async: Async;
  isMatch(value: T, find: T | TCreate | TFind): boolean;
  is(value: unknown): value is T;
  isCreate(value: unknown): value is TCreate;
  isFind(value: unknown): value is TFind;
  create(value: TCreate): T;
  drain(iterator: DrainType): ResultValue<Async, boolean>;
}
