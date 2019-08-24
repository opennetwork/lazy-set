import { QuadFind } from "./dataset-core";
import { Dataset } from "./dataset";
import { AsyncDatasetCore } from "./async-dataset-core";
import { DefaultDataFactory, isQuad, Quad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { DatasetCoreFactory } from "./dataset-core-factory";
import { AsyncDatasetCoreFactory } from "./async-dataset-core-factory";
import { isMatch, isSingleMatcher } from "./match";
import { asyncIterator, isAsyncIterable } from "./async-iterator";

/**
 * @param iterator
 * @returns true when something was drained
 */
async function drain(iterator: AsyncIterator<any>): Promise<boolean> {
  let next: IteratorResult<QuadLike>;
  do {
    next = await iterator.next();
  } while (next.done);
  return !!next.value;
}

export class AsyncDatasetCoreImplementation implements AsyncDatasetCore {

  protected datasetFactory: DatasetCoreFactory;
  protected asyncDatasetFactory: AsyncDatasetCoreFactory;
  protected dataset: Dataset;
  protected initialQuads?: AsyncIterator<QuadLike>;

  constructor(datasetFactory: DatasetCoreFactory, asyncDatasetFactory: AsyncDatasetCoreFactory, quads?: Iterable<QuadLike> | AsyncIterable<QuadLike>) {
    this.datasetFactory = datasetFactory;
    this.asyncDatasetFactory = asyncDatasetFactory;
    this.replace(quads);
  }

  async getSize() {
    await this.drain();
    return this.dataset.size;
  }

  private drain(): Promise<boolean> {
    return drain(this.drainYield());
  }

  private async *drainYield() {
    if (!this.initialQuads) {
      return;
    }
    let next: IteratorResult<QuadLike>;
    do {
      next = await this.initialQuads.next();
      if (next.value) {
        const quad = isQuad(next.value) ? next.value : DefaultDataFactory.fromQuad(next.value);
        this.dataset.add(quad);
        yield quad;
      }
    } while (!next.done);
    this.initialQuads = undefined;
  }

  protected replace(quads?: Iterable<QuadLike> | AsyncIterable<QuadLike>): this {
    if (isAsyncIterable(quads)) {
      this.dataset = this.datasetFactory.dataset();
      this.initialQuads = asyncIterator(quads);
    } else {
      this.dataset = this.datasetFactory.dataset(quads);
      this.initialQuads = undefined;
    }
    return this;
  }

  async add(quad: QuadLike) {
    this.dataset.add(quad);
  }

  async delete(find: QuadFind) {
    // Avoid unneeded complete drain by first checking, can delete early, or check the complete iterable for an instance
    let quad: Quad | undefined;
    if (quad = await this.get(find)) {
      this.dataset.delete(quad);
    }
  }

  private async get(find: QuadFind): Promise<Quad> {
    const iterable = this.iterableMatch(find);
    const iterator = iterable[Symbol.asyncIterator]();
    const next = await iterator.next();
    return next.value;
  }

  async has(find: QuadFind) {
    return !!await this.get(find);
  }

  protected async *iterableMatch(find: QuadFind): AsyncIterable<Quad> {
    for await (const quad of this) {
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
    return this.asyncDatasetFactory.dataset(
      this.iterableMatch({
        subject,
        predicate,
        object,
        graph
      })
    );
  }

  [Symbol.asyncIterator]() {
    const that = this;
    return (async function *() {
      for (const value of that.dataset) {
        yield value;
      }
      for await (const value of that.drainYield()) {
        yield value;
      }
    })();
  }

}
