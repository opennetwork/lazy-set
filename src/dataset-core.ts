import { isQuad, isTermLike, Quad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { Dataset } from "./dataset";
import { AsyncDataset } from "./async-dataset";

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

export type ResultType = Promise<any> | undefined;
export type ResultValue<R extends ResultType, V, PV = Promise<V>> = Promise<any> extends R ? PV : V;

export interface Data<R extends ResultType> {
  equals(value: unknown): ResultValue<R, boolean>;
}

export interface DatasetIterable<R extends ResultType, T> {
  [Symbol.iterator]: ResultValue<R, () => Iterator<T>, unknown>;
  [Symbol.asyncIterator]: ResultValue<R, unknown, () => AsyncIterator<T>>;
}

export interface DatasetCore<R extends ResultType, T extends Data<R>> extends DatasetIterable<R, T> {

  readonly size: ResultValue<R, number, never>;

  getSize(): ResultValue<R, number>;
  add(quad: QuadLike): ResultValue<R, void>;
  delete(quad: QuadFind): ResultValue<R, void>;
  has(quad: QuadFind): ResultValue<R, boolean>;
  match(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike): ResultValue<R, Dataset<R, T>, AsyncDataset>;

}
