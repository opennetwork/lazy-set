import { DatasetCore } from "./dataset-core";
import { Quad, QuadLike, DefaultDataFactory, TermLike } from "@opennetwork/rdf-data-model";
import { isMatch } from "./match";
import { DatasetCoreFactory } from "./dataset-core-factory";

export class DatasetCoreImplementation implements DatasetCore {

  protected datasetFactory: DatasetCoreFactory;
  protected quads: ReadonlyArray<Quad>;

  get size() {
    return this.quads.length;
  }

  constructor(datasetFactory: DatasetCoreFactory, quads: Quad[]) {
    this.quads = Object.freeze(quads);
    this.datasetFactory = datasetFactory;
  }

  add(quad: QuadLike) {
    return this.replace(
      this.quads.concat(DefaultDataFactory.fromQuad(quad))
    );
  }

  delete(quad: QuadLike) {
    return this.replace(
      this.quads.filter(other => other.equals(quad))
    );
  }

  protected replace(quads: Quad[]): this {
    this.quads = Object.freeze(quads);
    return this;
  }

  has(quad: QuadLike) {
    return this.quads.some(other => other.equals(quad));
  }

  match(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike) {
    const matches = this.quads.filter(
      quad => isMatch(quad, subject, predicate, object, graph)
    );
    return this.datasetFactory.dataset(matches);
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.quads.length; i += 1) {
      yield this.quads[i];
    }
  }

}
