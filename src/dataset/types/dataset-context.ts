import { DatasetCoreIterable, DatasetIterable, DatasetIterator, ResultType, ResultValue } from "./dataset-core";

export type DatasetContextValueSyncFn<R extends ResultType, T, TLike, TFind, V, This> = (this: This & DatasetContext<undefined, T, TLike, TFind>) => V;
export type DatasetContextValueAsyncFn<R extends ResultType, T, TLike, TFind, V, PV, This> = (this: This & DatasetContext<Promise<any>, T, TLike, TFind>) => PV;

export type DatasetCreateValue<R extends ResultType, T, TLike> = T | TLike | ResultValue<R, T | TLike, Promise<T | TLike> | T | TLike>;

export interface DatasetContext<R extends ResultType, T, TLike, TFind, TCreate = DatasetCreateValue<R, T, TLike>> {
  readonly async: ResultValue<R, false, true>;
  isMatch(value: T, find: T | TLike | TFind): ResultValue<R, boolean>;
  is(value: unknown): value is T;
  isLike(value: unknown): value is TLike;
  create(value: TCreate): ResultValue<R, T>;
  drain(iterator: DatasetIterator<R, T> | DatasetCoreIterable<R, T>): ResultValue<R, boolean>;
  value<V, PV = V, This = this>(sync: DatasetContextValueSyncFn<R, T, TLike, TFind, V, This>, async: DatasetContextValueAsyncFn<R, T, TLike, TFind, V, PV, This>, thisValue?: This): ResultValue<R, V, PV>;
}

export interface DatasetContextOptions<R extends ResultType, T, TLike, TFind, TCreate = DatasetCreateValue<R, T, TLike>> extends DatasetContext<R, T, TLike, TFind, TCreate> {
  initialValues?: DatasetIterable<R, TLike>;
}
