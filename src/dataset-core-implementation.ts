import { DatasetCore, QuadFind } from "./dataset-core";
import { Quad, QuadLike, DefaultDataFactory, TermLike, isQuad } from "@opennetwork/rdf-data-model";
import { isMatch } from "./match";
import { DatasetCoreFactory } from "./dataset-core-factory";



export class DatasetCoreImplementation implements DatasetCore {

  protected datasetFactory: DatasetCoreFactory;

  protected quads: Set<Quad>;

  get size() {
    return this.quads.size;
  }

  constructor(datasetFactory: DatasetCoreFactory, quads?: Iterable<QuadLike>) {
    this.datasetFactory = datasetFactory;
    this.replace(quads || []);
  }

  protected replace(quads: Iterable<QuadLike>): this {
    this.quads = new Set<Quad>();
    for (const quad of quads) {
      this.add(quad);
    }
    return this;
  }

  add(quad: QuadLike) {
    if (!this.has(quad)) {
      this.quads.add(
        isQuad(quad) ? quad : DefaultDataFactory.fromQuad(quad)
      );
    }
    return this;
  }

  delete(find: QuadFind) {
    for (const quad of this.iterableMatch(find)) {
      this.quads.delete(quad);
    }
    return this;
  }

  has(find: QuadFind) {
    const iterable = this.iterableMatch(find);
    const iterator = iterable[Symbol.iterator]();
    return !!iterator.next().value;
  }

  protected *iterableMatch(find: QuadFind): Iterable<Quad> {
    for (const quad of this) {
      if (isMatch(quad, find.subject, find.predicate, find.object, find.graph)) {
        yield quad;
      }
    }
  }

  match(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike) {
    const matches = new Set<Quad>();
    for (const quad of this.iterableMatch({
      subject,
      predicate,
      object,
      graph
    })) {
      matches.add(quad);
    }
    return this.datasetFactory.dataset(matches);
  }

  [Symbol.iterator]() {
    return this.quads[Symbol.iterator]();
  }

}
