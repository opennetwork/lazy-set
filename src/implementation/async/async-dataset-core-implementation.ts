import {
  AsyncDatasetContext,
  AsyncDatasetCore, AsyncIterableLike, Dataset,
  DatasetContext,
  DatasetCore,
  DatasetCoreFactory
} from "../../dataset/index";
import { asyncIterator } from "../../iterator";

export class AsyncDatasetCoreImplementation<T, TCreate extends T = T, TFind extends (TCreate | T) = (TCreate | T)> implements AsyncDatasetCore<T, TCreate, TFind> {

  protected datasetFactory: DatasetCoreFactory<T, TCreate, TFind>;
  protected datasetContext: AsyncDatasetContext<T, TCreate, TFind>;

  protected dataset: Dataset<T, TCreate, TFind>;
  protected initialValues?: AsyncIterator<T | TCreate>;

  constructor(datasetFactory: DatasetCoreFactory<T, TCreate, TFind>, datasetContext: AsyncDatasetContext<T, TCreate, TFind>, values?: AsyncIterableLike<T | TCreate>) {
    this.datasetFactory = datasetFactory;
    this.datasetContext = datasetContext;
    this.replace(values);
  }

  protected replace(values?: AsyncIterableLike<T | TCreate>): this {
    this.dataset = this.datasetFactory.dataset();
    this.initialValues = values ? asyncIterator(values) : undefined;
    return this;
  }

  async getSize() {
    await this.drain();
    return this.dataset.getSize();
  }

  private async drain() {
    return this.datasetContext.drain(this.drainYield());
  }

  private async *drainYield(): AsyncIterable<T> {
    if (!this.initialValues) {
      return;
    }
    let next: IteratorResult<T | TCreate>;
    do {
      next = await this.initialValues.next();
      if (next.value) {
        const value = this.datasetContext.is(next.value) ? next.value : this.datasetContext.create(next.value);
        await this.addNoDrain(value);
        yield value;
      }
    } while (!next.done);
    this.initialValues = undefined;
  }

  private addNoDrain(value: T | TCreate) {
    if (!this.datasetContext.is(value)) {
      value = this.datasetContext.create(value);
    }
    if (!this.datasetContext.isFind(value)) {
      throw new Error("Value instance is not findable");
    }
    if (this.dataset.has(value)) {
      return;
    }
    this.addNoDrainNoHas(value);
  }

  private addNoDrainNoHas(value: T | TCreate) {
    if (!this.datasetContext.is(value)) {
      value = this.datasetContext.create(value);
    }
    this.dataset.add(value);
  }

  async add(value: T | TCreate) {
    if (!this.datasetContext.is(value)) {
      value = this.datasetContext.create(value);
    }
    if (!this.datasetContext.isFind(value)) {
      throw new Error("Value instance is not findable");
    }
    if (!await this.has(value)) {
      await this.addNoDrainNoHas(value);
    }
  }

  async delete(find: T | TCreate | TFind) {
    const value = await this.get(find);
    if (!this.datasetContext.is(value)) {
      return;
    }
    this.dataset.delete(value);
  }

  async get(find: T | TCreate | TFind) {
    const match = this.datasetFactory.asyncDataset(this).match(find);
    const iterator = match[Symbol.asyncIterator]();
    const result = await iterator.next();
    return result.value;
  }

  async has(find: T | TCreate | TFind) {
    return this.datasetFactory.asyncDataset(this).match(find).hasAny();
  }

  async hasAny() {
    const iterator = this[Symbol.asyncIterator]();
    const result = await iterator.next();
    return !!result.value;
  }

  async toSet() {
    await this.drain();
    return this.dataset.toSet();
  }

  async toArray() {
    const array: T[] = [];
    for await (const value of this) {
      array.push(value);
    }
    return array;
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    for (const value of this.dataset) {
      yield value;
    }
    for await (const value of this.drainYield()) {
      yield value;
    }
  }

}
