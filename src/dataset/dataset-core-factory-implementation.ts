import {
  Dataset,
  DatasetCoreFactory,
  ResultType,
  SyncableDatasetIterableTypeLike
} from "./types";
import { isAsyncIterable } from "../iterator";
import { DatasetImplementation } from "./dataset-implementation";
import { DatasetContextImplementation } from "./dataset-context-implementation";

export class DatasetCoreFactoryImplementation<R extends ResultType, T, TLike, TFind> extends DatasetContextImplementation<R, T, TLike, TFind> implements DatasetCoreFactory<R, T, TLike, TFind> {

  dataset(sequence?: SyncableDatasetIterableTypeLike<R, T | TLike>): Dataset<R, T, TLike, TFind> {
    if (isAsyncIterable(sequence) && !this.async) {
      throw new Error("Attempted to use async iterator in a sync context");
    }
    return new DatasetImplementation<R, T, TLike, TFind>(this, sequence);
  }

}
