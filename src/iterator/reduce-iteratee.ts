import { ResultType, ResultValue, Dataset } from "../dataset";

export interface ReduceIterateeFn<R extends ResultType, T, TLike, TFind, This, Accumulator = TLike> {
  (this: This, accumulator: Accumulator, data: T, dataset: Dataset<R, T, TLike, TFind>): ResultValue<R, Accumulator, Accumulator | Promise<Accumulator>>;
}

export interface ReduceIteratee<R extends ResultType, T, TLike, TFind, Accumulator = TLike> {
  run: ReduceIterateeFn<R, T, TLike, TFind, this, Accumulator>;
}

export type ReduceIterateeLike<R extends ResultType, T, TLike, TFind, This, Accumulator = TLike> = ReduceIterateeFn<R, T, TLike, TFind, This, Accumulator> | ReduceIteratee<R, T, TLike, TFind, Accumulator>;
