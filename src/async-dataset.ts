import { AsyncDatasetCore } from "./async-dataset-core";
import { Quad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { AsyncQuadFilterIteratee } from "./async-quad-filter-iteratee";
import { AsyncQuadRunIteratee } from "./async-quad-run-iteratee";
import { AsyncQuadMapIteratee } from "./async-quad-map-iteratee";
import { AsyncQuadReduceIteratee } from "./async-quad-reduce-iteratee";
import { Dataset } from "./dataset";

export interface AsyncDataset extends AsyncDatasetCore {

  addAll(quads: Iterable<QuadLike> | AsyncIterable<QuadLike>): Promise<void>;
  contains(other: Dataset | AsyncDataset): Promise<boolean>;
  deleteMatches(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike): Promise<void>;
  difference(other: Dataset | AsyncDataset): AsyncDataset;
  equals(other: Dataset | AsyncDataset): Promise<boolean>;
  every(iteratee: AsyncQuadFilterIteratee): Promise<boolean>;
  filter(iteratee: AsyncQuadFilterIteratee): AsyncDataset;
  forEach(iteratee: AsyncQuadRunIteratee): Promise<void>;
  import(stream: unknown): Promise<Dataset>;
  intersection(other: Dataset | AsyncDataset): AsyncDataset;
  map(iteratee: AsyncQuadMapIteratee): AsyncDataset;
  reduce<Accumulator extends QuadLike = QuadLike>(iteratee: AsyncQuadReduceIteratee<Accumulator>, initialValue?: Accumulator): Promise<Accumulator>;
  some(iteratee: AsyncQuadFilterIteratee): Promise<boolean>;
  toArray(): Promise<Quad[]>;
  union(quads: Dataset | AsyncDataset): AsyncDataset;

}
