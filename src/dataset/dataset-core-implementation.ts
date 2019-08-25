import {
  Dataset,
  DatasetCore,
  DatasetIterator,
  ResultType,
  ResultValue,
  DatasetCoreIterable,
  SyncableDatasetIterableTypeLike,
  DatasetCoreFactory
} from "./types";
import {
  getDatasetIterator,
  FilterIterateeLike
} from "../iterator";

export class DatasetCoreImplementation<R extends ResultType, T, TLike, TFind> implements DatasetCore<R, T, TLike, TFind> {

  protected datasetFactory: DatasetCoreFactory<R, T, TLike, TFind>;

  protected set: Set<T>;
  protected initialValues?: DatasetIterator<R, T | TLike>;

  constructor(datasetFactory: DatasetCoreFactory<R, T, TLike, TFind>, values?: SyncableDatasetIterableTypeLike<R, T | TLike>) {
    this.datasetFactory = datasetFactory;
    this.replace(values);

    // Remove the reverse one completely so it's not possible to hit the wrong one
    if (this.datasetFactory.async) {
      this[Symbol.iterator] = undefined;
    } else {
      this[Symbol.asyncIterator] = undefined;
    }
  }

  protected replace(values?: SyncableDatasetIterableTypeLike<R, T | TLike>): this {
    this.set = new Set<T>();
    this.initialValues = getDatasetIterator(values);
    return this;
  }

  get size() {
    return this.datasetFactory.value(
      (): number => {
        return this.set.size;
      },
      () => {
        throw new Error("Attempted to use sync context in an async context");
      }
    );
  }

  getSize() {
    return this.datasetFactory.value(
      () => this.set.size,
      async() => {
        await this.drain();
        return this.set.size;
      },
      this
    );
  }

  private drain() {
    return this.datasetFactory.drain(this.drainYield());
  }

  private *drainYield(): DatasetCoreIterable<R, T> {
    if (!this.initialValues) {
      return;
    }
    let next: IteratorResult<ResultValue<R, T | TLike>>;
    do {
      next = this.initialValues.next();
      if (next.value) {
        const value = this.datasetFactory.create(next.value);
        yield this.datasetFactory.value(
          () => {
            if (!this.datasetFactory.is(value)) {
              throw new Error("Expected instance to be returned from create");
            }
            this.addDirectly(value);
            return value;
          },
          async () => {
            const resolvedValue = await value;
            if (resolvedValue == undefined) {
              return undefined;
            }
            if (!this.datasetFactory.is(resolvedValue)) {
              throw new Error("Expected instance to be returned from create");
            }
            this.addDirectly(resolvedValue);
            return resolvedValue;
          },
          this
        );
      }
    } while (!next.done);
    this.initialValues = undefined;
  }

  private addDirectly(value: T) {
    if (!this.datasetFactory.is(value)) {
      throw new Error("Expected instance to be returned from create");
    }
    this.set.add(value);
  }

  add(value: T | TLike) {
    return this.datasetFactory.value(
      () => {
        if (!this.has(value)) {
          this.addDirectly(this.datasetFactory.create(value) as T);
        }
      },
      async () => {
        if (!await this.has(value)) {
          this.addDirectly((await this.datasetFactory.create(value)) as T);
        }
      }
    );
  }

  delete(find: T | TLike | TFind) {
    return this.datasetFactory.value(
      () => {
        const value = this.get(find);
        if (!this.datasetFactory.is(value)) {
          return;
        }
        this.set.delete(value);
      },
      async () => {
        const value = await this.get(find);
        if (!this.datasetFactory.is(value)) {
          return;
        }
        this.set.delete(value);
      },
      this
    );
  }

  get(find: T | TLike | TFind) {
    const match = this.datasetFactory.dataset(this).match(find);
    return this.datasetFactory.value(
      () => {
        const iterator = match[Symbol.iterator]();
        return iterator.next().value;
      },
      async () => {
        const iterator = match[Symbol.asyncIterator]();
        const next = await iterator.next();
        return next.value;
      }
    );
  }

  has(find: T | TLike | TFind) {
    return this.datasetFactory.dataset(this).match(find).hasAny();
  }

  hasAny() {
    return this.datasetFactory.value(
      () => {
        const iterator = this[Symbol.iterator]();
        return !!iterator.next().value;
      },
      async () => {
        const iterator = this[Symbol.asyncIterator]();
        const next = await iterator.next();
        return !!next.value;
      },
      this
    );
  }

  *[Symbol.iterator](): Iterator<T> {
    if (this.datasetFactory.async) {
      throw new Error("Attempted to use an async context in a sync context");
    }
    for (const value of this.set) {
      if (!this.datasetFactory.is(value)) {
        throw new Error("Found value in set that does not match context type");
      }
      yield value;
    }
    for (const value of this.drainYield()) {
      if (!this.datasetFactory.is(value)) {
        throw new Error("Found value in set that does not match context type");
      }
      yield value;
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    for (const value of this.set) {
      const resolvedValue = await value;
      if (resolvedValue == undefined) {
        // Check if it is a null or undefined value, means the promise was the
        // "done" promise
        continue;
      }
      if (!this.datasetFactory.is(resolvedValue)) {
        throw new Error("Found value in set that does not match context type");
      }
      yield resolvedValue;
    }
    for await (const value of this.drainYield()) {
      const resolvedValue = await value;
      if (resolvedValue == undefined) {
        // Check if it is a null or undefined value, means the promise was the
        // "done" promise
        continue;
      }
      if (!this.datasetFactory.is(resolvedValue)) {
        throw new Error("Found value in set that does not match context type");
      }
      yield resolvedValue;
    }
  }

}
