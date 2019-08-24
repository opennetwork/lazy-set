import { QuadLike } from "@opennetwork/rdf-data-model";
import { AsyncDataset } from "./async-dataset";

export interface AsyncDatasetCoreFactory {
  dataset(sequence?: Iterable<QuadLike> | AsyncIterable<QuadLike>): AsyncDataset;
}
