import { Quad } from "@opennetwork/rdf-data-model";
import { Dataset } from "./dataset";

export interface AsyncQuadRunIteratee {
  run(quad: Quad, dataset: Dataset): Promise<void>;
}
