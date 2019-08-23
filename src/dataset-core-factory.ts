import { Quad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { Dataset } from "./dataset";

export interface DatasetCoreFactory {
  dataset(sequence?: Dataset | Iterable<QuadLike> | QuadLike[]): Dataset;
}
