import { LazySetCore } from "./lazy-set-core";
import {
  FilterIterateeFn,
  MapIterateeFn,
  ReduceIterateeFn
} from "../../iterator";
import { AsyncIterableLike } from "../lazy-set-context";

export interface LazySet<T, TCreate = T, TFind = TCreate | T> extends LazySetCore<T, TCreate, TFind> {

  addAll(quads: Iterable<T | TCreate>): void;
  contains(other: Iterable<T | TCreate>): boolean;
  equals(other: Iterable<T | TCreate>): boolean;

  difference(other: Iterable<T | TCreate>): LazySet<T, TCreate, TFind>;
  intersection(other: Iterable<T | TCreate>): LazySet<T, TCreate, TFind>;
  map<This = this>(iteratee: MapIterateeFn<false, T, this, This>, thisValue?: This): LazySet<T, TCreate, TFind>;
  union(quads: Iterable<T | TCreate>): LazySet<T, TCreate, TFind>;
  filter<This = this>(iteratee: FilterIterateeFn<false, T, this, This>, thisValue?: This): LazySet<T, TCreate, TFind>;
  except<This = this>(iteratee: FilterIterateeFn<false, T, this, This>, thisValue?: This): LazySet<T, TCreate, TFind>;
  match(find: T | TCreate | TFind): LazySet<T, TCreate, TFind>;

  every<This = this>(iteratee: FilterIterateeFn<false, T, this, This>, thisValue?: This): boolean;
  reduce<Accumulator = T, This = this>(iteratee: ReduceIterateeFn<false, T, this, This, Accumulator>, initialValue?: Accumulator, thisValue?: This): Accumulator;
  some<This = this>(iteratee: FilterIterateeFn<false, T, this, This>, thisValue?: This): boolean;

  import(stream: AsyncIterableLike<T | TCreate>): Promise<LazySet<T, TCreate, TFind>>;

}
