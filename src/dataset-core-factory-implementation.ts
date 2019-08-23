import { DefaultDataFactory, isQuad, QuadLike } from "@opennetwork/rdf-data-model";
import { Dataset } from "./dataset";
import { DatasetImplementation } from "./dataset-implementation";
import { DatasetCoreFactory } from "./dataset-core-factory";

export class DatasetCoreFactoryImplementation implements DatasetCoreFactory {

  dataset(sequence?: Iterable<QuadLike>): Dataset {
    return new DatasetImplementation(
      this,
      sequence || []
    );
  }
}
