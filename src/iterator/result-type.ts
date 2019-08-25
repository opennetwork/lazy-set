export type ResultType = true | false;
export type ResultValue<R extends ResultType, V, PV = Promise<V>> = R extends true ? PV : V;
