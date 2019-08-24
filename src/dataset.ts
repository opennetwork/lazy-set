import { Data, DatasetCore, DatasetIterable, ResultType, ResultValue } from "./dataset-core";
import { QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { FilterIterateeLike } from "./filter-iteratee";
import { RunIterateeLike } from "./run-iteratee";
import { MapIterateeLike } from "./map-iteratee";
import { ReduceIterateeLike } from "./reduce-iteratee";

export interface Dataset<R extends ResultType, T extends Data<R>, TLike = Data<R>> extends DatasetCore<R, T> {
  (initialValues: DatasetIterable<R, T>): Dataset<R, T>;

  constructor(initialValues: DatasetIterable<R, T>): Dataset<R, T>;
  addAll(quads: DatasetIterable<R, TLike>): ResultValue<R, void>;
  contains(other: DatasetIterable<R, TLike>): ResultValue<R, boolean>;
  deleteMatches(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike): ResultValue<R, void>;
  difference(other: DatasetIterable<R, TLike>): Dataset<R, T>;
  equals(other: DatasetIterable<R, TLike>): ResultValue<R, boolean>;
  every(iteratee: FilterIterateeLike<R, T, TLike, this>): ResultValue<R, void>;
  filter(iteratee: FilterIterateeLike<R, T, TLike, this>): Dataset<R, T>;
  forEach(iteratee: RunIterateeLike<R, T, TLike, this>): ResultValue<R, void>;
  import(stream: DatasetIterable<Promise<any>, TLike> | DatasetIterable<undefined, TLike>): Promise<Dataset<R, T, TLike>>;
  intersection(other: DatasetIterable<R, T>): Dataset<R, T, TLike>;
  map(iteratee: MapIterateeLike<R, T, TLike, this>): Dataset<R, T, TLike>;
  reduce<Accumulator extends QuadLike = QuadLike>(iteratee: ReduceIterateeLike<R, T, TLike, this, Accumulator>, initialValue?: Accumulator): ResultValue<R, Accumulator>;
  some(iteratee: FilterIterateeLike<R, T, TLike, this>): ResultValue<R, boolean>;
  toArray(): ResultValue<R, T[]>;
  toCanonical(): ResultValue<R, string>;
  union(quads: DatasetIterable<R, T>): Dataset<R, T, TLike>;

}
