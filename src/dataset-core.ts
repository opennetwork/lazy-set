import { Quad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { Dataset } from "./dataset";

export interface DatasetCore extends Iterable<Quad> {

  readonly size: number;

  add(quad: QuadLike): this;
  delete(quad: QuadLike): this;
  has(quad: QuadLike): boolean;
  match(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike): Dataset;

}
