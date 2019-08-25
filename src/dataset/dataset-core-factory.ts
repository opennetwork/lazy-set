import { Dataset } from "./sync";
import { AsyncDataset } from "./async";
import { ResultType, ResultValue } from "../iterator/result-type";
import { AsyncIterableLike } from "./sync";

export type DatasetCoreFactorySequence<Async extends ResultType, T> = ResultValue<Async, Iterable<T>, AsyncIterableLike<T>>;

export interface DatasetCoreFactory<T, TCreate extends T = T, TFind extends (TCreate | T) = (TCreate | T)> {

  dataset(sequence?: Iterable<T>): Dataset<T, TCreate, TFind>;
  asyncDataset(sequence: AsyncIterableLike<T>): AsyncDataset<T, TCreate, TFind>;

}
