import { ResultType, ResultValue } from "./result-type";

export interface ReduceIterateeFn<R extends ResultType, T, This, ThisValue = This, Accumulator = T> {
  (this: This, accumulator: Accumulator, data: T, thisValue: ThisValue): ResultValue<R, Accumulator, Accumulator | Promise<Accumulator>>;
}

export interface ReduceIteratee<R extends ResultType, T, ThisValue, Accumulator = T> {
  run: ReduceIterateeFn<R, T, this, ThisValue, Accumulator>;
}

export type ReduceIterateeLike<R extends ResultType, T, This, Accumulator = T> = ReduceIterateeFn<R, T, This, This, Accumulator> | ReduceIteratee<R, T, This, Accumulator>;
