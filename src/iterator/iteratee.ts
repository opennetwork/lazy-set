import { Dataset, ResultType, ResultValue } from "../dataset";

export interface IterateeFn<R extends ResultType, T, TLike, TFind, This, V = void, PV = Promise<V>> {
  (this: This, data: T, dataset: Dataset<R, T, TLike, TFind>): ResultValue<R, V, PV>;
}
