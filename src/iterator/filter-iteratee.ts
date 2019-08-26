import { IterateeFn } from "./iteratee";
import { ResultType } from "./result-type";

export type FilterIterateeFn<R extends ResultType, T, This, ThisValue> = IterateeFn<R, T, This, ThisValue, unknown>;
