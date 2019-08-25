import { ResultType } from "../dataset";
import { IterateeFn } from "./iteratee";

export type MapIterateeFn<R extends ResultType, T, TLike, TFind, This> = IterateeFn<R, T, TLike, This, TLike>;

export interface MapIteratee<R extends ResultType, T, TLike, TFind> {
  map: MapIterateeFn<R, T, TLike, TFind, this>;
}

export type MapIterateeLike<R extends ResultType, T, TLike, TFind, This> = MapIterateeFn<R, T, TLike, TFind, This> | MapIteratee<R, T, TLike, TFind>;
