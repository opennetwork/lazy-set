import {
  AsyncDataset,
  AsyncIterableLike,
  Dataset,
  DatasetContext,
  DatasetCoreFactory
} from "../dataset";
import { asyncIterable } from "../iterator";
import { DatasetImplementation } from "./sync/dataset-implementation";
import { AsyncDatasetImplementation } from "./async/async-dataset-implementation";
import { DatasetContextImplementation, PartialDatasetContextOptions } from "./sync/dataset-context-implementation";
import { AsyncDatasetContextImplementation } from "./async/async-dataset-context-implementation";

export type DatasetCoreFactoryOptions<T, TCreate = T, TFind = TCreate | T> = Omit<PartialDatasetContextOptions<false, T, TCreate, TFind>, "async">;

export class DatasetCoreFactoryImplementation<T, TCreate = T, TFind = TCreate | T> implements DatasetCoreFactory<T, TCreate, TFind> {

  private readonly syncContext: DatasetContext<false, T, TCreate, TFind, Iterable<any>>;
  private readonly asyncContext: DatasetContext<true, T, TCreate, TFind, AsyncIterable<any>>;

  constructor(options: DatasetCoreFactoryOptions<T, TCreate, TFind>) {
    this.syncContext = new DatasetContextImplementation({
      ...options,
      async: false
    });
    this.asyncContext = new AsyncDatasetContextImplementation({
      ...options,
      async: true
    });
  }

  dataset(sequence?: Iterable<T | TCreate>): Dataset<T, TCreate, TFind> {
    return new DatasetImplementation<T, TCreate, TFind>(
      this,
      this.syncContext,
      sequence
    );
  }

  asyncDataset(sequence: AsyncIterableLike<T | TCreate>): AsyncDataset<T, TCreate, TFind> {
    const iterable: AsyncIterable<T | TCreate> | undefined = sequence ? asyncIterable(sequence) : undefined;
    return new AsyncDatasetImplementation<T, TCreate, TFind>(
      this,
      this.asyncContext,
      iterable
    );
  }


}
