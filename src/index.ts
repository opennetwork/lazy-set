import {
  DatasetCoreFactoryImplementation,
  DatasetCoreFactoryOptions
} from "./implementation/dataset-core-factory-implementation";
import { DatasetCoreFactory } from "./dataset";

export * from "./dataset";
export * from "./iterator";

export function dataFactory<T, TCreate = T, TFind = TCreate | T>(options: DatasetCoreFactoryOptions<T, TCreate, TFind>): DatasetCoreFactory<T, TCreate, TFind> {
  return new DatasetCoreFactoryImplementation(options);
}
