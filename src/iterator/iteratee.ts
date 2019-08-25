import { ResultType, ResultValue } from "../dataset";

export interface IterateeFn<R extends ResultType, T, This, ThisValue = This, V = void, PV = Promise<V>> {
  (this: This, data: T, thisValue: ThisValue): ResultValue<R, V, PV>;
}
