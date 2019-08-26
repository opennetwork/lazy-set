import {
  LazySetContext,
  LazySetCore,
  LazySetCoreFactory
} from "../../lazy-set";
import { drain } from "../../iterator/async-iterator";

export class LazySetCoreImplementation<T, TCreate = T, TFind = TCreate | T> implements LazySetCore<T, TCreate, TFind> {

  protected lazySetFactory: LazySetCoreFactory<T, TCreate, TFind>;
  protected lazySetContext: LazySetContext<T, TCreate, TFind>;

  protected set: Set<T>;
  protected initialValues?: Iterator<T | TCreate>;

  constructor(lazySetFactory: LazySetCoreFactory<T, TCreate, TFind>, lazySetContext: LazySetContext<T, TCreate, TFind>, values?: Iterable<T | TCreate>) {
    this.lazySetFactory = lazySetFactory;
    this.lazySetContext = lazySetContext;
    this.replace(values);
  }

  protected replace(values?: Iterable<T | TCreate>): this {
    this.set = new Set<T>();
    this.initialValues = values ? values[Symbol.iterator]() : undefined;
    return this;
  }

  readonly [Symbol.toStringTag]: string = "LazySetCore";

  get size() {
    return this.getSize();
  }

  getSize() {
    this.drain();
    return this.set.size;
  }

  private drain() {
    return drain(this.drainYield());
  }

  private *drainYield(): Iterable<T> {
    if (!this.initialValues) {
      return;
    }
    const values = this.initialValues;
    let next: IteratorResult<T | TCreate>;
    do {
      next = values.next();
      if (next.value) {
        const value = this.lazySetContext.is(next.value) ? next.value : this.lazySetContext.create(next.value);
        this.addNoDrain(value);
        yield value;
      }
    } while (!next.done && this.initialValues === values);
    if (this.initialValues === values) {
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
    if (this.lazySetFactory.lazySet(this.set).has(value)) {
      return;
    }
    this.addNoDrainNoHas(value);
  }

  private addNoDrainNoHas(value: T | TCreate) {
    if (!this.lazySetContext.is(value)) {
      value = this.lazySetContext.create(value);
    }
    this.set.add(value);
  }

  add(value: T | TCreate) {
    if (!this.lazySetContext.is(value)) {
      value = this.lazySetContext.create(value);
    }
    if (!this.lazySetContext.isFind(value)) {
      throw new Error("Value instance is not findable");
    }
    if (!this.has(value)) {
      this.addNoDrainNoHas(value);
    }
    return this;
  }

  delete(find: T | TCreate | TFind) {
    const value = this.get(find);
    if (!this.lazySetContext.is(value)) {
      return false;
    }
    return this.set.delete(value);
  }

  get(find: T | TCreate | TFind) {
    const match = this.lazySetFactory.lazySet(this).match(find);
    const iterator = match[Symbol.iterator]();
    return iterator.next().value;
  }

  has(find: T | TCreate | TFind) {
    return this.lazySetFactory.lazySet(this).match(find).hasAny();
  }

  hasAny() {
    const iterator = this[Symbol.iterator]();
    return !!iterator.next().value;
  }

  forEach<This = this>(callbackfn: (this: This, value: T, value2: T, set: this) => void, thisArg?: This) {
    for (const value of this) {
      callbackfn.call(thisArg || this, value, value, this);
    }
  }

  clear() {
    this.replace(undefined);
  }

  toSet() {
    return new Set(this.set);
  }

  toArray() {
    return Array.from(this);
  }

  *entries(): IterableIterator<[T, T]> {
    for (const value of this) {
     yield [value, value];
    }
  }

  keys() {
    return this.values();
  }

  *values() {
    for (const value of this) {
      yield value;
    }
  }

  *[Symbol.iterator]() {
    for (const value of this.set) {
      yield value;
    }
    for (const value of this.drainYield()) {
      yield value;
    }
  }

}
