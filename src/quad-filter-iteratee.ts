import { Quad } from "@opennetwork/rdf-data-model";
import { Dataset } from "./dataset";

export interface QuadFilterIteratee {
  test(quad: Quad, dataset: Dataset): boolean;
}
