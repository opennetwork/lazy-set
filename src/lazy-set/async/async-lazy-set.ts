import {
  FilterIterateeFn,
  MapIterateeFn,
  ReduceIterateeFn
} from "../../iterator";
import { AsyncLazySetCore } from "./async-lazy-set-core";
import { AsyncIterableLike } from "../sync";

export interface AsyncLazySet<T, TCreate = T, TFind = TCreate | T> extends AsyncLazySetCore<T, TCreate, TFind> {

  addAll(quads: AsyncIterableLike<T | TCreate>): Promise<void>;
  contains(other: AsyncIterableLike<T | TCreate>): Promise<boolean>;
  equals(other: AsyncIterableLike<T | TCreate>): Promise<boolean>;

  difference(other: AsyncIterableLike<T | TCreate>): AsyncLazySet<T, TCreate, TFind>;
  intersection(other: AsyncIterableLike<T | TCreate>): AsyncLazySet<T, TCreate, TFind>;
  map<This = this>(iteratee: MapIterateeFn<true, T, this, This>, thisValue?: This): AsyncLazySet<T, TCreate, TFind>;
  union(quads: AsyncIterableLike<T | TCreate>): AsyncLazySet<T, TCreate, TFind>;
  filter<This = this>(iteratee: FilterIterateeFn<true, T, this, This>, thisValue?: This): AsyncLazySet<T, TCreate, TFind>;
  except<This = this>(iteratee: FilterIterateeFn<true, T, this, This>, thisValue?: This): AsyncLazySet<T, TCreate, TFind>;
  match(find: T | TCreate | TFind): AsyncLazySet<T, TCreate, TFind>;

  every<This = this>(iteratee: FilterIterateeFn<true, T, this, This>, thisValue?: This): Promise<boolean>;
  reduce<Accumulator = T, This = this>(iteratee: ReduceIterateeFn<true, T, this, This, Accumulator>, initialValue?: Accumulator, thisValue?: This): Promise<Accumulator>;
  some<This = this>(iteratee: FilterIterateeFn<true, T, this, This>, thisValue?: This): Promise<boolean>;

  import(stream: AsyncIterableLike<T | TCreate>): Promise<AsyncLazySet<T, TCreate, TFind>>;

}
