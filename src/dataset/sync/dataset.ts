import { DatasetCore } from "./dataset-core";
import {
  FilterIterateeLike,
  RunIterateeLike,
  MapIterateeLike,
  ReduceIterateeLike
} from "../../iterator";
import { AsyncIterableLike } from "./dataset-context";

export interface Dataset<T, TCreate = T, TFind = TCreate | T> extends DatasetCore<T, TCreate, TFind> {

  addAll(quads: Iterable<T | TCreate>): void;
  contains(other: Iterable<T | TCreate>): boolean;
  equals(other: Iterable<T | TCreate>): boolean;
  every(iteratee: FilterIterateeLike<false, T, this>): boolean;
  forEach(iteratee: RunIterateeLike<false, T, this>): void;
  reduce<Accumulator = T>(iteratee: ReduceIterateeLike<false, T, this, Accumulator>, initialValue?: Accumulator): Accumulator;
  some(iteratee: FilterIterateeLike<false, T, this>): boolean;

  difference(other: Iterable<T | TCreate>): Dataset<T, TCreate, TFind>;
  import(stream: AsyncIterableLike<T | TCreate>): Promise<Dataset<T, TCreate, TFind>>;
  intersection(other: Iterable<T | TCreate>): Dataset<T, TCreate, TFind>;
  map(iteratee: MapIterateeLike<false, T, this>): Dataset<T, TCreate, TFind>;
  union(quads: Iterable<T | TCreate>): Dataset<T, TCreate, TFind>;
  filter(iteratee: FilterIterateeLike<false, T, this>): Dataset<T, TCreate, TFind>;
  except(iteratee: FilterIterateeLike<false, T, this>): Dataset<T, TCreate, TFind>;
  match(find: T | TCreate | TFind): Dataset<T, TCreate, TFind>;

}
