import { Dataset } from "./dataset";
import { SyncableDatasetIterableTypeLike, ResultType } from "./dataset-core";
import { DatasetContext } from "./dataset-context";

export interface DatasetCoreFactory<R extends ResultType, T, TLike, TFind> extends DatasetContext<R, T, TLike, TFind> {
  dataset(sequence?: SyncableDatasetIterableTypeLike<R, T | TLike>): Dataset<R, T, TLike, TFind>;
}
