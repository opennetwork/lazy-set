import { Quad } from "@opennetwork/rdf-data-model";
import { Dataset } from "./dataset";

export interface QuadRunIteratee {
  run(quad: Quad, dataset: Dataset): void;
}
