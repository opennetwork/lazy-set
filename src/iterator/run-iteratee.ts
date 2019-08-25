import { ResultType } from "../dataset";
import { IterateeFn } from "./iteratee";

export type RunIterateeFn<R extends ResultType, T, TLike, TFind, This> = IterateeFn<R, T, TLike, TFind, This, void>;

export interface RunIteratee<R extends ResultType, T, TLike, TFind> {
  run: RunIterateeFn<R, T, TLike, TFind, this>;
}

export type RunIterateeLike<R extends ResultType, T, TLike, TFind, This, Accumulator = TLike> = RunIterateeFn<R, T, TLike, TFind, This> | RunIteratee<R, T, TLike, TFind>;

