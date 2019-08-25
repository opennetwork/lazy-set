import { ResultType } from "./result-type";
import { IterateeFn } from "./iteratee";

export type MapIterateeFn<R extends ResultType, T, This, ThisValue = This> = IterateeFn<R, T, This, ThisValue>;

export interface MapIteratee<R extends ResultType, T, ThisValue> {
  map: MapIterateeFn<R, T, this, ThisValue>;

}

export type MapIterateeLike<R extends ResultType, T, This> = MapIterateeFn<R, T, This, This> | MapIteratee<R, T, This>;
