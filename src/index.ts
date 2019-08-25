import { SyncPartialDatasetContextOptions, AsyncPartialDatasetContextOptions } from "./implementation/dataset-context-implementation";
import { DatasetCoreFactoryImplementation } from "./implementation/dataset-core-factory-implementation";
import { DatasetCoreFactory } from "./dataset";
import { WithOptionalKeys } from "tsdef";

export * from "./dataset";
export * from "./iterator";

export function dataFactory<T, TLike, TFind>(options: WithOptionalKeys<SyncPartialDatasetContextOptions<T, TLike, TFind>, "async">): DatasetCoreFactory<false, T, TLike, TFind> {
  return new DatasetCoreFactoryImplementation({
    ...options,
    async: false
  });
}

export function asyncDataFactory<T, TLike, TFind>(options: WithOptionalKeys<AsyncPartialDatasetContextOptions<T, TLike, TFind>, "async">): DatasetCoreFactory<true, T, TLike, TFind> {
  return new DatasetCoreFactoryImplementation({
    ...options,
    async: true
  });
}
