import {
  FilterIterateeLike,
  RunIterateeLike,
  MapIterateeLike,
  ReduceIterateeLike
} from "../../iterator";
import { AsyncDatasetCore } from "./async-dataset-core";
import { AsyncIterableLike } from "../sync";

export interface AsyncDataset<T, TLike, TFind> extends AsyncDatasetCore<T, TLike, TFind> {

  addAll(quads: AsyncIterableLike<T | TLike>): Promise<void>;
  contains(other: AsyncIterableLike<T | TLike>): Promise<boolean>;
  equals(other: AsyncIterableLike<T | TLike>): Promise<boolean>;
  every(iteratee: FilterIterateeLike<true, T, this>): Promise<boolean>;
  forEach(iteratee: RunIterateeLike<true, T, this>): Promise<void>;
  reduce<Accumulator = T>(iteratee: ReduceIterateeLike<true, T, this, Accumulator>, initialValue?: Accumulator): Promise<Accumulator>;
  some(iteratee: FilterIterateeLike<true, T, this>): Promise<boolean>;

  difference(other: AsyncIterableLike<T | TLike>): AsyncDataset<T, TLike, TFind>;
  import(stream: AsyncIterableLike<T | TLike>): Promise<AsyncDataset<T, TLike, TFind>>;
  intersection(other: AsyncIterableLike<T | TLike>): AsyncDataset<T, TLike, TFind>;
  map(iteratee: MapIterateeLike<true, T, this>): AsyncDataset<T, TLike, TFind>;
  union(quads: AsyncIterableLike<T | TLike>): AsyncDataset<T, TLike, TFind>;
  filter(iteratee: FilterIterateeLike<true, T, this>): AsyncDataset<T, TLike, TFind>;
  except(iteratee: FilterIterateeLike<true, T, this>): AsyncDataset<T, TLike, TFind>;
  match(find: T | TLike | TFind): AsyncDataset<T, TLike, TFind>;

}
