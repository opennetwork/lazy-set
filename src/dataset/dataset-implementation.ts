import {
  FilterIterateeLike,
  RunIterateeLike,
  MapIterateeLike,
  ReduceIterateeLike,
  asyncIterable,
  isDatasetIterable
} from "../iterator";
import { DatasetCoreImplementation } from "./dataset-core-implementation";
import {
  Dataset,
  DatasetCoreFactory,
  ResultType,
  SyncableDatasetIterableTypeLike
} from "./types";

export class DatasetImplementation<R extends ResultType, T, TLike, TFind> extends DatasetCoreImplementation<R, T, TLike, TFind> implements Dataset<R, T, TLike, TFind> {

  constructor(datasetFactory: DatasetCoreFactory<R, T, TLike, TFind>, quads: SyncableDatasetIterableTypeLike<R, T | TLike>) {
    super(datasetFactory, quads);
  }

  addAll(other: SyncableDatasetIterableTypeLike<R, T | TLike>) {
    return this.datasetFactory.dataset(other).forEach(
      value => this.add(value)
    );
  }

  contains(other: SyncableDatasetIterableTypeLike<R, T | TLike>) {
    return this.datasetFactory.dataset(other).every(
      value => this.has(value)
    );
  }

  difference(other: SyncableDatasetIterableTypeLike<R, T | TLike>): Dataset<R, T, TLike, TFind> {
    const that = this;
    return this.datasetFactory.dataset(other).filter(
      value => that.has(value),
      true
    );
  }

  equals(other: SyncableDatasetIterableTypeLike<R, T | TLike>) {
    const that = this;
    return this.datasetFactory.dataset(other).every(value => that.has(value));
  }

  every(iteratee: FilterIterateeLike<R, T, TLike, TFind, this>) {
    const resultValue = this.filter(iteratee, true).hasAny();
    return this.datasetFactory.value(() => !resultValue, async () => !await resultValue);
  }

  forEach(iteratee: RunIterateeLike<R, T, TLike, TFind, this>) {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.run.bind(iteratee);
    const that = this;
    return this.datasetFactory.value(
      () => {
        for (const value of that) {
          fn(value, that);
        }
      },
      async () => {
        for await (const value of that) {
          await fn(value, that);
        }
      }
    );
  }

  import(stream: unknown): Promise<Dataset<R, T, TLike, TFind>> {
    throw new Error("Not implemented");
  }

  intersection(other: SyncableDatasetIterableTypeLike<R, T | TLike>): Dataset<R, T, TLike, TFind> {
    const that = this;
    return this.datasetFactory.dataset(other).filter({
      test: value => that.has(value)
    });
  }

  map(iteratee: MapIterateeLike<R, T, TLike, TFind, this>): Dataset<R, T, TLike, TFind> {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.map.bind(iteratee);
    const that = this;
    return this.datasetFactory.dataset(
      this.datasetFactory.value(
        function *() {
          for (const value of that) {
            yield fn(value, that);
          }
        },
        async function *() {
          for await (const value of that) {
            yield await fn(value, that);
          }
        }
      )
    );
  }

  reduce<Accumulator = T>(iteratee: ReduceIterateeLike<R, T, TLike, TFind, this, Accumulator>, initialValue?: Accumulator) {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.run.bind(iteratee);
    let accumulator: Accumulator = initialValue;
    const that = this;
    return this.datasetFactory.value(
      () => {
        for (const value of this) {
          if (!accumulator) {
            accumulator = (value as unknown) as Accumulator;
            continue;
          }
          accumulator = fn(accumulator, value, that);
        }
        return accumulator;
      },
      async () => {
        for await (const value of this) {
          if (!accumulator) {
            accumulator = (value as unknown) as Accumulator;
            continue;
          }
          accumulator = await fn(accumulator, value, that);
        }
        return accumulator;
      }
    );
  }

  toArray() {
    return this.datasetFactory.value(
      () => Array.from(this),
      async () => {
        const array: T[] = [];
        for await (const value of this) {
          array.push(value);
        }
        return array;
      }
    );
  }

  union(other: SyncableDatasetIterableTypeLike<R, T | TLike>): Dataset<R, T, TLike, TFind> {
    return this.datasetFactory.dataset(
      this.datasetFactory.value(
        function *(): Iterable<T | TLike> {
          if (!isDatasetIterable(other)) {
            throw new Error("Attempted to use an async context in a sync context");
          }
          for (const value of this) {
            yield value;
          }
          for (const value of other) {
            yield value;
          }
        },
        async function *(): AsyncIterable<T | TLike> {
          for await (const value of this) {
            yield value;
          }
          for await (const value of asyncIterable(other)) {
            yield value;
          }
        },
        this
      )
    );
  }

}
