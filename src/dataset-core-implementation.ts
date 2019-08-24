import { DatasetCore, QuadFind } from "./dataset-core";
import { Quad, QuadLike, DefaultDataFactory, TermLike, isQuad } from "@opennetwork/rdf-data-model";
import { isMatch, isSingleMatcher } from "./match";
import { DatasetCoreFactory } from "./dataset-core-factory";

/**
 * @param iterator
 * @returns true when something was drained
 */
function drain(iterator: Iterator<any>): boolean {
  let next: IteratorResult<QuadLike>;
  do {
    next = iterator.next();
  } while (next.done);
  return !!next.value;
}

export class DatasetCoreImplementation implements DatasetCore<undefined, Quad> {

  protected datasetFactory: DatasetCoreFactory;

  protected quads: Set<Quad>;
  protected initialQuads?: Iterator<QuadLike>;

  get size() {
    this.drain();
    return this.quads.size;
  }

  getSize() {
    return this.size;
  }

  constructor(datasetFactory: DatasetCoreFactory, quads?: Iterable<QuadLike>) {
    this.datasetFactory = datasetFactory;
    this.replace(quads);
  }

  private drain() {
    return drain(this.drainYield());
  }

  private *drainYield() {
    let next: IteratorResult<QuadLike>;
    do {
      next = this.initialQuads.next();
      if (next.value) {
        const quad = isQuad(next.value) ? next.value : DefaultDataFactory.fromQuad(next.value);
        this.quads.add(quad);
        yield quad;
      }
    } while (!next.done);
    if (next.done) {
      this.initialQuads = undefined;
    }
  }

  protected replace(quads?: Iterable<QuadLike>): this {
    this.quads = new Set<Quad>();
    this.initialQuads = quads ? quads[Symbol.iterator]() : undefined;
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
    // Avoid unneeded complete drain by first checking, can delete early, or check the complete iterable for an instance
    let quad: Quad | undefined;
    if (quad = this.get(find)) {
      this.quads.delete(quad);
    }
    return this;
  }

  private get(find: QuadFind): Quad {
    const iterable = this.iterableMatch(find);
    const iterator = iterable[Symbol.iterator]();
    return iterator.next().value;
  }

  has(find: QuadFind) {
    return !!this.get(find);
  }

  protected *iterableMatch(find: QuadFind): Iterable<Quad> {
    for (const quad of this) {
      if (isMatch(quad, find.subject, find.predicate, find.object, find.graph)) {
        yield quad;
      }
      // We're finished
      if (isSingleMatcher(find.subject, find.predicate, find.object, find.graph)) {
        break;
      }
    }
  }

  match(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike) {
    return this.datasetFactory.dataset(
      this.iterableMatch({
        subject,
        predicate,
        object,
        graph
      })
    );
  }

  [Symbol.iterator]() {
    const that = this;
    return (function *() {
      for (const value of that.quads) {
        yield value;
      }
      for (const value of that.drainYield()) {
        yield value;
      }
    })();
  }

  [Symbol.asyncIterator]: never;

}
