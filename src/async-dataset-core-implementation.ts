import { QuadFind } from "./dataset-core";
import { Dataset } from "./dataset";
import { AsyncDatasetCore } from "./async-dataset-core";
import { DefaultDataFactory, isQuad, Quad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { DatasetCoreFactory } from "./dataset-core-factory";
import { AsyncDatasetCoreFactory } from "./async-dataset-core-factory";
import { isMatch, isSingleMatcher } from "./match";
import { asyncIterator, isAsyncIterable } from "./async-iterator";

async function drain(iterator: AsyncIterator<any>) {
  let next: IteratorResult<QuadLike>;
  do {
    next = await iterator.next();
  } while (next.done);
}

export class AsyncDatasetCoreImplementation implements AsyncDatasetCore {

  protected datasetFactory: DatasetCoreFactory;
  protected asyncDatasetFactory: AsyncDatasetCoreFactory;
  protected dataset: Dataset;
  protected initialQuads?: AsyncIterator<QuadLike>;

  constructor(datasetFactory: DatasetCoreFactory, asyncDatasetFactory: AsyncDatasetCoreFactory, quads?: Iterable<QuadLike> | AsyncIterable<QuadLike>) {
    this.datasetFactory = datasetFactory;
    this.asyncDatasetFactory = asyncDatasetFactory;
    if (isAsyncIterable(quads)) {
      this.dataset = datasetFactory.dataset();
      this.initialQuads = asyncIterator(quads);
    } else {
      this.dataset = datasetFactory.dataset(quads);
    }
  }

  async getSize() {
    if (this.initialQuads) {
      await this.readAll();
    }
    return this.dataset.size;
  }

  private async readAll() {
    await drain(this.readAllYield());
    this.initialQuads = undefined;
  }

  private async *readAllYield() {
    let next: IteratorResult<QuadLike>;
    do {
      next = await this.initialQuads.next();
      if (next.value) {
        const quad = isQuad(next.value) ? next.value : DefaultDataFactory.fromQuad(next.value);
        this.dataset.add(quad);
        yield quad;
      }
    } while (!next.done);
    if (next.done) {
      this.initialQuads = undefined;
    }
  }

  protected replace(quads: Iterable<QuadLike>): this {
    this.initialQuads = undefined;
    this.dataset.delete({});
    this.dataset.addAll(quads);
    return this;
  }

  async add(quad: QuadLike) {
    this.dataset.add(quad);
  }

  async delete(find: QuadFind) {
    if (this.initialQuads) {
      await this.readAll();
    }
    this.dataset.delete(find);
  }

  async has(find: QuadFind) {
    if (this.dataset.has(find)) {
      return true;
    }
    if (!this.initialQuads) {
      return false;
    }
    await this.readAll();
    return this.dataset.has(find);
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
      if (!that.initialQuads) {
        return;
      }
      for await (const value of that.readAllYield()) {
        yield value;
      }
    })();
  }

}
