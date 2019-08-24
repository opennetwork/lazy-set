import { Data, ResultType } from "./dataset-core";
import { IterateeFn } from "./iteratee";

export type RunIterateeFn<R extends ResultType, T extends Data<R>, TLike, This> = IterateeFn<R, T, TLike, This, void>;

export interface RunIteratee<R extends ResultType, T extends Data<R>, TLike> {
  run: RunIterateeFn<R, T, TLike, this>;
}

export type RunIterateeLike<R extends ResultType, T extends Data<R>, TLike, This, Accumulator = TLike> = RunIterateeFn<R, T, TLike, This> | RunIteratee<R, T, TLike>;

