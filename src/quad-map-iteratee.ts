import { Quad, QuadLike } from "@opennetwork/rdf-data-model";
import { Dataset } from "./dataset";

export interface QuadMapIteratee {
  map(quad: Quad, dataset: Dataset): QuadLike;
}
