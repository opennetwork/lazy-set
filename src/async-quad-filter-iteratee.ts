import { Quad } from "@opennetwork/rdf-data-model";
import { AsyncDataset } from "./async-dataset";

export interface AsyncQuadFilterIteratee {
  test(quad: Quad, dataset: AsyncDataset): Promise<boolean>;
}
