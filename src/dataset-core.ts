import { isQuad, isTermLike, Quad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
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

export function isQuadFind(value: unknown): value is QuadFind {
  function isQuadFindLike(value: unknown): value is QuadFind {
    return typeof value === "object";
  }
  return (
    isQuadFindLike(value) &&
    (
      !value.subject || isTermLike(value.subject)
    ) &&
    (
      !value.predicate || isTermLike(value.predicate)
    ) &&
    (
      !value.object || isTermLike(value.object)
    ) &&
    (
      !value.graph || isTermLike(value.graph)
    )
  );
}

export interface DatasetCore extends Iterable<Quad> {

  readonly size: number;

  add(quad: QuadLike): this;
  delete(quad: QuadFind): this;
  has(quad: QuadFind): boolean;
  match(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike): Dataset;

}
