import { ResultType, ResultValue } from "./result-type";

export interface ReduceIterateeFn<R extends ResultType, T, This, ThisValue, Accumulator> {
  (this: This, accumulator: Accumulator, data: T, thisValue: ThisValue): ResultValue<R, Accumulator, Accumulator | Promise<Accumulator>>;
}
