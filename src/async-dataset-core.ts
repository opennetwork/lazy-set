import { Quad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { QuadFind } from "./dataset-core";
import { AsyncDataset } from "./async-dataset";

export interface AsyncDatasetCore extends AsyncIterable<Quad> {

  getSize(): Promise<number>;
  add(quad: QuadLike): Promise<void>;
  delete(quad: QuadFind): Promise<void>;
  has(quad: QuadFind): Promise<boolean>;
  match(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike): AsyncDataset;

}
