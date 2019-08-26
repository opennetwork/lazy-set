import {
  AsyncLazySetCore,
  AsyncIterableLike,
  LazySet,
  LazySetContext,
  LazySetCoreFactory
} from "../../lazy-set/index";
import { asyncIterator, drainAsync } from "../../iterator/async-iterator";

export class AsyncLazySetCoreImplementation<T, TCreate = T, TFind = TCreate | T> implements AsyncLazySetCore<T, TCreate, TFind> {

  readonly [Symbol.toStringTag]: string = "AsyncLazySetCore";

  protected lazySetFactory: LazySetCoreFactory<T, TCreate, TFind>;
  protected lazySetContext: LazySetContext<T, TCreate, TFind>;

  protected lazySet: LazySet<T, TCreate, TFind>;
  protected initialValues?: AsyncIterator<T | TCreate>;

  constructor(lazySetFactory: LazySetCoreFactory<T, TCreate, TFind>, lazySetContext: LazySetContext<T, TCreate, TFind>, values?: AsyncIterableLike<T | TCreate>) {
    this.lazySetFactory = lazySetFactory;
    this.lazySetContext = lazySetContext;
    this.replace(values);
  }

  protected replace(values?: AsyncIterableLike<T | TCreate>): this {
    this.lazySet = this.lazySetFactory.lazySet();
    this.initialValues = values ? asyncIterator(values) : undefined;
    return this;
  }

  async getSize() {
    await this.drain();
    return this.lazySet.getSize();
  }

  private async drain() {
    return drainAsync(this.drainYield());
  }

  private async *drainYield(): AsyncIterable<T> {
    if (!this.initialValues) {
      return;
    }
    const values = this.initialValues;
    let next: IteratorResult<T | TCreate>;
    do {
      next = await values.next();
      if (values !== this.initialValues) {
        break;
      }
      if (next.value) {
        const value = this.lazySetContext.is(next.value) ? next.value : this.lazySetContext.create(next.value);
        this.addNoDrain(value);
        yield value;
      }
    } while (!next.done && values === this.initialValues);
    if (values === this.initialValues) {
      this.initialValues = undefined;
    }
  }

  private addNoDrain(value: T | TCreate) {
    if (!this.lazySetContext.is(value)) {
      value = this.lazySetContext.create(value);
    }
    if (!this.lazySetContext.isFind(value)) {
      throw new Error("Value instance is not findable");
    }
    if (this.lazySet.has(value)) {
      return;
    }
    this.addNoDrainNoHas(value);
  }

  private addNoDrainNoHas(value: T | TCreate) {
    if (!this.lazySetContext.is(value)) {
      value = this.lazySetContext.create(value);
    }
    this.lazySet.add(value);
  }

  async add(value: T | TCreate) {
    if (!this.lazySetContext.is(value)) {
      value = this.lazySetContext.create(value);
    }
    if (!this.lazySetContext.isFind(value)) {
      throw new Error("Value instance is not findable");
    }
    if (!await this.has(value)) {
      await this.addNoDrainNoHas(value);
    }
  }

  async delete(find: T | TCreate | TFind) {
    const value = await this.get(find);
    if (!this.lazySetContext.is(value)) {
      return false;
    }
    return this.lazySet.delete(value);
  }

  async get(find: T | TCreate | TFind) {
    const match = this.lazySetFactory.asyncLazySet(this).match(find);
    const iterator = match[Symbol.asyncIterator]();
    const result = await iterator.next();
    return result.value;
  }

  async has(find: T | TCreate | TFind) {
    return this.lazySetFactory.asyncLazySet(this).match(find).hasAny();
  }

  async hasAny() {
    const iterator = this[Symbol.asyncIterator]();
    const result = await iterator.next();
    return !!result.value;
  }

  async forEach<This = this>(callbackfn: (this: This, value: T, value2: T, set: this) => (void | Promise<void>), thisArg?: This) {
    for await (const value of this) {
      await callbackfn.call(thisArg || this, value, value, this);
    }
  }

  async clear() {
    await this.replace(undefined);
  }

  async toSet() {
    await this.drain();
    return this.lazySet.toSet();
  }

  async toArray() {
    const array: T[] = [];
    for await (const value of this) {
      array.push(value);
    }
    return array;
  }

  async *entries(): AsyncIterableIterator<[T, T]> {
    for await (const value of this) {
      yield [value, value];
    }
  }

  keys() {
    return this.values();
  }

  async *values() {
    for await (const value of this) {
      yield value;
    }
  }

  async *[Symbol.asyncIterator]() {
    for (const value of this.lazySet) {
      yield value;
    }
    for await (const value of this.drainYield()) {
      yield value;
    }
  }

}
