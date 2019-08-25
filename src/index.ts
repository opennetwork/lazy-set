import { DatasetCoreFactoryImplementation } from "./dataset/dataset-core-factory-implementation";
import { SyncPartialDatasetContextOptions, AsyncPartialDatasetContextOptions } from "./dataset/dataset-context-implementation";
import { DatasetCoreFactory } from "./dataset/types";
import { WithOptionalKeys } from "tsdef";

export * from "./dataset";
export * from "./iterator";

export function dataFactory<T, TLike, TFind>(options: WithOptionalKeys<SyncPartialDatasetContextOptions<T, TLike, TFind>, "async">): DatasetCoreFactory<undefined, T, TLike, TFind> {
  return new DatasetCoreFactoryImplementation({
    ...options,
    async: false
  });
}

export function asyncDataFactory<T, TLike, TFind>(options: WithOptionalKeys<AsyncPartialDatasetContextOptions<T, TLike, TFind>, "async">): DatasetCoreFactory<Promise<any>, T, TLike, TFind> {
  return new DatasetCoreFactoryImplementation({
    ...options,
    async: true
  });
}
