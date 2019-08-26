import {
  FilterIterateeLike,
  RunIterateeLike,
  MapIterateeLike,
  ReduceIterateeLike
} from "../../iterator";
import { AsyncDatasetCore } from "./async-dataset-core";
import { AsyncIterableLike } from "../sync";

export interface AsyncDataset<T, TCreate = T, TFind = TCreate | T> extends AsyncDatasetCore<T, TCreate, TFind> {

  addAll(quads: AsyncIterableLike<T | TCreate>): Promise<void>;
  contains(other: AsyncIterableLike<T | TCreate>): Promise<boolean>;
  equals(other: AsyncIterableLike<T | TCreate>): Promise<boolean>;
  every(iteratee: FilterIterateeLike<true, T, this>): Promise<boolean>;
  forEach(iteratee: RunIterateeLike<true, T, this>): Promise<void>;
  reduce<Accumulator = T>(iteratee: ReduceIterateeLike<true, T, this, Accumulator>, initialValue?: Accumulator): Promise<Accumulator>;
  some(iteratee: FilterIterateeLike<true, T, this>): Promise<boolean>;

  difference(other: AsyncIterableLike<T | TCreate>): AsyncDataset<T, TCreate, TFind>;
  import(stream: AsyncIterableLike<T | TCreate>): Promise<AsyncDataset<T, TCreate, TFind>>;
  intersection(other: AsyncIterableLike<T | TCreate>): AsyncDataset<T, TCreate, TFind>;
  map(iteratee: MapIterateeLike<true, T, this>): AsyncDataset<T, TCreate, TFind>;
  union(quads: AsyncIterableLike<T | TCreate>): AsyncDataset<T, TCreate, TFind>;
  filter(iteratee: FilterIterateeLike<true, T, this>): AsyncDataset<T, TCreate, TFind>;
  except(iteratee: FilterIterateeLike<true, T, this>): AsyncDataset<T, TCreate, TFind>;
  match(find: T | TCreate | TFind): AsyncDataset<T, TCreate, TFind>;

}
