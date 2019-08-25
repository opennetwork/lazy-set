import {
  DatasetContext,
  DatasetCore,
  DatasetCoreFactory
} from "../../dataset/index";

export class DatasetCoreImplementation<T, TCreate extends T = T, TFind extends (TCreate | T) = (TCreate | T)> implements DatasetCore<T, TCreate, TFind> {

  protected datasetFactory: DatasetCoreFactory<T, TCreate, TFind>;
  protected datasetContext: DatasetContext<false, T, TCreate, TFind>;

  protected set: Set<T>;
  protected initialValues?: Iterator<T | TCreate>;

  constructor(datasetFactory: DatasetCoreFactory<T, TCreate, TFind>, datasetContext: DatasetContext<false, T, TCreate, TFind>, values?: Iterable<T | TCreate>) {
    this.datasetFactory = datasetFactory;
    this.datasetContext = datasetContext;
    this.replace(values);
  }

  protected replace(values?: Iterable<T | TCreate>): this {
    this.set = new Set<T>();
    this.initialValues = values ? values[Symbol.iterator]() : undefined;
    return this;
  }

  get size() {
    return this.getSize();
  }

  getSize() {
    this.drain();
    return this.set.size;
  }

  private drain() {
    return this.datasetContext.drain(this.drainYield());
  }

  private *drainYield(): Iterable<T> {
    if (!this.initialValues) {
      return;
    }
    let next: IteratorResult<T | TCreate>;
    do {
      next = this.initialValues.next();
      if (next.value) {
        const value = this.datasetContext.is(next.value) ? next.value : this.datasetContext.create(next.value);
        this.addNoDrain(value);
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
    if (this.datasetFactory.dataset(this.set).has(value)) {
      return;
    }
    this.addNoDrainNoHas(value);
  }

  private addNoDrainNoHas(value: T | TCreate) {
    if (!this.datasetContext.is(value)) {
      value = this.datasetContext.create(value);
    }
    this.set.add(value);
  }

  add(value: T | TCreate) {
    if (!this.datasetContext.is(value)) {
      value = this.datasetContext.create(value);
    }
    if (!this.datasetContext.isFind(value)) {
      throw new Error("Value instance is not findable");
    }
    if (!this.has(value)) {
      this.addNoDrainNoHas(value);
    }
  }

  delete(find: T | TCreate | TFind) {
    const value = this.get(find);
    if (!this.datasetContext.is(value)) {
      return;
    }
    this.set.delete(value);
  }

  get(find: T | TCreate | TFind) {
    const match = this.datasetFactory.dataset(this).match(find);
    const iterator = match[Symbol.iterator]();
    return iterator.next().value;
  }

  has(find: T | TCreate | TFind) {
    return this.datasetFactory.dataset(this).match(find).hasAny();
  }

  hasAny() {
    const iterator = this[Symbol.iterator]();
    return !!iterator.next().value;
  }

  toSet() {
    return new Set(this.set);
  }

  toArray() {
    return Array.from(this);
  }

  *[Symbol.iterator](): Iterator<T> {
    for (const value of this.set) {
      yield value;
    }
    for (const value of this.drainYield()) {
      yield value;
    }
  }

}
