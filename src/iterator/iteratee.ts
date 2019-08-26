import { ResultType, ResultValue } from "./result-type";

export interface IterateeFn<R extends ResultType, T, This, ThisValue, V = void, PV = V | Promise<V>> {
  (this: This, data: T, thisValue: ThisValue): ResultValue<R, V, PV>;
}
