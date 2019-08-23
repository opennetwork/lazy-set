import { DatasetCore } from "./dataset-core";
import { Quad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { QuadFilterIteratee } from "./quad-filter-iteratee";
import { QuadRunIteratee } from "./quad-run-iteratee";
import { QuadMapIteratee } from "./quad-map-iteratee";
import { QuadReduceIteratee } from "./quad-reduce-iteratee";

export interface Dataset extends DatasetCore {

  addAll(quads: Dataset | Iterable<QuadLike> | QuadLike[]): Dataset;
  contains(other: Dataset): boolean;
  deleteMatches(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike): Dataset;
  difference(other: Dataset): Dataset;
  equals(other: Dataset): boolean;
  every(iteratee: QuadFilterIteratee): boolean;
  filter(iteratee: QuadFilterIteratee): Dataset;
  forEach(iteratee: QuadRunIteratee): void;
  import(stream: unknown): Promise<Dataset>;
  intersection(other: Dataset): Dataset;
  map(iteratee: QuadMapIteratee): Dataset;
  reduce<Accumulator = QuadLike>(iteratee: QuadReduceIteratee<Accumulator>, initialValue?: Accumulator): Accumulator extends QuadLike ? Quad : Accumulator;
  some(iteratee: QuadFilterIteratee): boolean;
  toArray(): Quad[];
  toCanonical(): string;
  toStream(): unknown;
  toString(): string;
  union(quads: Dataset): Dataset;

}
