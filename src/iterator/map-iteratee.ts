import { ResultType } from "./result-type";
import { IterateeFn } from "./iteratee";

export type MapIterateeFn<R extends ResultType, T, This, ThisValue> = IterateeFn<R, T, This, ThisValue>;
