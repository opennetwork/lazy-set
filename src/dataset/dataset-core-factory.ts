import { Dataset } from "./sync";
import { AsyncDataset } from "./async";
import { ResultType, ResultValue } from "../iterator/result-type";
import { AsyncIterableLike } from "./sync";

export type DatasetCoreFactorySequence<Async extends ResultType, T> = ResultValue<Async, Iterable<T>, AsyncIterableLike<T>>;

export interface DatasetCoreFactory<T, TCreate = T, TFind = TCreate | T> {

  dataset(sequence?: Iterable<T | TCreate>): Dataset<T, TCreate, TFind>;
  asyncDataset(sequence: AsyncIterableLike<T | TCreate>): AsyncDataset<T, TCreate, TFind>;

}
