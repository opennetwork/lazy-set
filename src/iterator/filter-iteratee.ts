import { ResultType } from "../dataset";
import { IterateeFn } from "./iteratee";

export type FilterIterateeFn<R extends ResultType, T, TLike, TFind, This> = IterateeFn<R, T, TLike, TFind, This, unknown>;

export interface FilterIteratee<R extends ResultType, T, TLike, TFind> {
  test: FilterIterateeFn<R, T, TLike, TFind, this>;
}

export type FilterIterateeLike<R extends ResultType, T, TLike, TFind, This> = FilterIterateeFn<R, T, TLike, TFind, This> | FilterIteratee<R, T, TLike, TFind>;
