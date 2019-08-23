import { Quad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { Dataset } from "./dataset";

export type QuadFind = Partial<
  | QuadLike
  | {
  subject: TermLike;
  predicate: TermLike;
  object: TermLike;
  graph: TermLike;
}
  >;

export interface DatasetCore extends Iterable<Quad> {

  readonly size: number;

  add(quad: QuadLike): this;
  delete(quad: QuadFind): this;
  has(quad: QuadFind): boolean;
  match(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike): Dataset;

}
