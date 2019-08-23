import { QuadLike } from "@opennetwork/rdf-data-model";
import { Dataset } from "./dataset";

export interface DatasetCoreFactory {
  dataset(sequence?: Iterable<QuadLike>): Dataset;
}
