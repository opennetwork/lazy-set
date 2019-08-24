import { Data, ResultType } from "./dataset-core";
import { IterateeFn } from "./iteratee";

export type MapIterateeFn<R extends ResultType, T extends Data<R>, TLike, This> = IterateeFn<R, T, TLike, This, TLike>;

export interface MapIteratee<R extends ResultType, T extends Data<R>, TLike> {
  map: MapIterateeFn<R, T, TLike, this>;
}

export type MapIterateeLike<R extends ResultType, T extends Data<R>, TLike, This> = MapIterateeFn<R, T, TLike, This> | MapIteratee<R, T, TLike>;
