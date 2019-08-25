import { ResultType } from "../dataset";
import { IterateeFn } from "./iteratee";

export type RunIterateeFn<R extends ResultType, T, This, ThisValue = This> = IterateeFn<R, T, This, ThisValue, void>;

export interface RunIteratee<R extends ResultType, T, ThisValue> {
  run: RunIterateeFn<R, T, this, ThisValue>;
}

export type RunIterateeLike<R extends ResultType, T, TLike, TFind, This, Accumulator = TLike> = RunIterateeFn<R, T, This, This> | RunIteratee<R, T, This>;

