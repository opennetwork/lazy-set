export type ResultType = true | false;
export type ResultValue<R extends ResultType, V, PV = Promise<V>> = R extends true ? PV : V;

export type DatasetIterableType<R extends ResultType, T> = ResultValue<R, Iterable<T>, AsyncIterable<T>>;
export type SyncableDatasetIterableTypeLike<R extends ResultType, T> = DatasetIterableType<R, T> | DatasetIterableType<undefined, T>;

export interface DatasetIterable<R extends ResultType, T> {
  [Symbol.iterator](): Iterator<T>;
  [Symbol.asyncIterator](): AsyncIterator<T>;
}

export type DatasetIterator<R extends ResultType, T> = Iterator<ResultValue<R, T>>;
export type DatasetCoreIterable<R extends ResultType, T> = Iterable<ResultValue<R, T>>;

export interface DatasetCore<R extends ResultType, T, TLike, TFind> extends DatasetIterable<R, T> {

  readonly size: ResultValue<R, number, unknown>;

  getSize(): ResultValue<R, number>;
  add(value: T | TLike): ResultValue<R, void>;
  delete(find: T | TLike | TFind): ResultValue<R, void>;
  get(find: T | TLike | TFind): ResultValue<R, T | undefined>;
  has(find: T | TLike | TFind): ResultValue<R, boolean>;
  hasAny(): ResultValue<R, boolean>;

}
