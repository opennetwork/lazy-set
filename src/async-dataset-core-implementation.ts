import { QuadFind } from "./dataset-core";
import { Dataset } from "./dataset";
import { AsyncDatasetCore } from "./async-dataset-core";
import { DefaultDataFactory, isQuad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { DatasetCoreFactory } from "./dataset-core-factory";
import { AsyncDatasetCoreFactory } from "./async-dataset-core-factory";
import { Quad } from "@opennetwork/rdf-data-model";
import { isMatch } from "./match";

export class AsyncDatasetCoreImplementation implements AsyncDatasetCore {

  protected datasetFactory: DatasetCoreFactory;
  protected asyncDatasetFactory: AsyncDatasetCoreFactory;
  protected dataset: Dataset;
  protected initialQuads?: Iterable<QuadLike> | AsyncIterable<QuadLike>;

  constructor(datasetFactory: DatasetCoreFactory, asyncDatasetFactory: AsyncDatasetCoreFactory, quads?: Iterable<QuadLike> | AsyncIterable<QuadLike>) {
    this.datasetFactory = datasetFactory;
    this.asyncDatasetFactory = asyncDatasetFactory;
    this.dataset = datasetFactory.dataset();
    this.initialQuads = quads;
  }

  async getSize() {
    if (this.initialQuads) {
      await this.readAll();
    }
    return this.dataset.size;
  }

  private async readAll() {
    for await (const value of this.initialQuads) {
      this.dataset.add(value);
    }
    this.initialQuads = undefined;
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

  match(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike) {
    const initialQuads = this.initialQuads;
    const dataset = this.dataset;
    const that = this;
    return this.asyncDatasetFactory.dataset(
      (async function *() {
        for (const value of that.dataset) {
          if (isMatch(value, subject, predicate, object, graph)) {
            yield value;
          }
        }
        if (!initialQuads) {
          return;
        }
        for await (const value of that.initialQuads) {
          // Add to our own dataset
          dataset.add(value);
          if (isMatch(value, subject, predicate, object, graph)) {
            yield value;
          }
        }
        that.initialQuads = undefined;
      })()
    );
  }

  [Symbol.asyncIterator]() {
    const dataset = this.dataset;
    return (async function *() {
      for (const value of dataset) {
        yield value;
      }
    })();
  }

}
