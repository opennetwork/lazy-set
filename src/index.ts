import { DatasetCoreFactoryImplementation } from "./dataset/dataset-core-factory-implementation";
import { Quad, isQuad, QuadLike, DefaultDataFactory, isQuadLike } from "@opennetwork/rdf-data-model";
import { isMatch, QuadFind } from "./match";

export * from "./dataset";
export * from "./iterator";

export const QuadDatasetFactory = new DatasetCoreFactoryImplementation<undefined, Quad, QuadLike, QuadFind>({
  async: false,
  isMatch,
  is: isQuad,
  isLike: isQuadLike,
  create: DefaultDataFactory.fromQuad
});

export const AsyncQuadDatasetFactory = new DatasetCoreFactoryImplementation<Promise<any>, Quad, QuadLike, QuadFind>({
  async: true,
  isMatch,
  is: isQuad,
  isLike: isQuadLike,
  create: DefaultDataFactory.fromQuad
});


