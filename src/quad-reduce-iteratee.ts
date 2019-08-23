import { Quad, QuadLike } from "@opennetwork/rdf-data-model";
import { Dataset } from "./dataset";

export interface QuadReduceIteratee<Accumulator = QuadLike> {
  run(accumulator: Accumulator, quad: Quad, dataset: Dataset): Accumulator;
}
