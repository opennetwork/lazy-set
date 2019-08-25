import { IterateeFn } from "./iteratee";
import { ResultType } from "./result-type";

export type FilterIterateeFn<R extends ResultType, T, This, ThisValue = This> = IterateeFn<R, T, This, ThisValue, unknown>;

export interface FilterIteratee<R extends ResultType, T, ThisValue> {
  test: FilterIterateeFn<R, T, this, ThisValue>;
}

export type FilterIterateeLike<R extends ResultType, T, This> = FilterIterateeFn<R, T, This, This> | FilterIteratee<R, T, This>;
