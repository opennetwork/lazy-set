import { Dataset } from "./dataset";
import { Data, ResultType, ResultValue } from "./dataset-core";

export interface IterateeFn<R extends ResultType, T extends Data<R>, TLike, This, V = void> {
  (this: This, data: T, dataset: Dataset<R, T, TLike>): ResultValue<R, V>;
}
