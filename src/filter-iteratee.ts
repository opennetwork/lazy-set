import { Dataset } from "./dataset";
import { Data, ResultType, ResultValue } from "./dataset-core";
import { IterateeFn } from "./iteratee";
import { MapIterateeFn } from "./map-iteratee";

export type FilterIterateeFn<R extends ResultType, T extends Data<R>, TLike, This> = IterateeFn<R, T, TLike, This, unknown>;

export interface FilterIteratee<R extends ResultType, T extends Data<R>, TLike> {
  test: FilterIterateeFn<R, T, TLike, this>;
}

export type FilterIterateeLike<R extends ResultType, T extends Data<R>, TLike, This> = FilterIterateeFn<R, T, TLike, This> | FilterIteratee<R, T, TLike>;
