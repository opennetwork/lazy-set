import { Quad, QuadLike } from "@opennetwork/rdf-data-model";
import { AsyncDataset } from "./async-dataset";

export interface AsyncQuadReduceIteratee<Accumulator = QuadLike> {
  run(accumulator: Accumulator, quad: Quad, dataset: AsyncDataset): Promise<Accumulator>;
}
