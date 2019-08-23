import { DefaultDataFactory, isQuad, QuadLike } from "@opennetwork/rdf-data-model";
import { Dataset } from "./dataset";
import { DatasetImplementation } from "./dataset-implementation";
import { DatasetCoreFactory } from "./dataset-core-factory";

export class DatasetCoreFactoryImplementation implements DatasetCoreFactory {

  dataset(sequence?: Dataset | Iterable<QuadLike> | QuadLike[]): Dataset {
    return new DatasetImplementation(
      this,
      Array.from(sequence || [])
        .map(quad => isQuad(quad) ? quad : DefaultDataFactory.fromQuad(quad))
        .filter(
          (quad, index, array) => {
            const before = array.slice(0, index);
            // Only if its not already contained
            return !before.some(other => other.equals(quad));
          }
        )
    );
  }
}
