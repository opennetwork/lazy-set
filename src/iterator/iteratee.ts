import { ResultType, ResultValue } from "./result-type";

export interface IterateeFn<R extends ResultType, T, This, ThisValue = This, V = void, PV = V | Promise<V>> {
  (this: This, data: T, thisValue: ThisValue): ResultValue<R, V, PV>;
}
