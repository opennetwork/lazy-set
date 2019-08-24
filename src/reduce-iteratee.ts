import { Data, ResultType } from "./dataset-core";
import { IterateeFn } from "./iteratee";

export type ReduceIterateeFn<R extends ResultType, T extends Data<R>, TLike, This, Accumulator = TLike> = IterateeFn<R, T, TLike, This, Accumulator>;

export interface ReduceIteratee<R extends ResultType, T extends Data<R>, TLike, Accumulator = TLike> {
  run: ReduceIterateeFn<R, T, TLike, this, Accumulator>;
}

export type ReduceIterateeLike<R extends ResultType, T extends Data<R>, TLike, This, Accumulator = TLike> = ReduceIterateeFn<R, T, TLike, This, Accumulator> | ReduceIteratee<R, T, TLike, Accumulator>;
