import { DatasetCoreFactoryImplementation } from "./dataset-core-factory-implementation";

export { isQuadFind, QuadFind } from "./dataset-core";
export { isMatch } from "./match";
export { DatasetCore } from "./dataset-core";
export { Dataset } from "./dataset";
export { DatasetCoreFactory } from "./dataset-core-factory";
export { AsyncDatasetCore } from "./async-dataset-core";
export { AsyncDataset } from "./async-dataset";
export { AsyncDatasetCoreFactory } from "./async-dataset-core-factory";
export * from "./quad-filter-iteratee";
export * from "./quad-map-iteratee";
export * from "./quad-reduce-iteratee";
export * from "./quad-run-iteratee";

export const DatasetFactory = new DatasetCoreFactoryImplementation();

