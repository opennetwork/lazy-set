import { Quad, QuadLike } from "@opennetwork/rdf-data-model";
import { AsyncDataset } from "./async-dataset";

export interface AsyncQuadMapIteratee {
  map(quad: Quad, dataset: AsyncDataset): Promise<QuadLike>;
}
