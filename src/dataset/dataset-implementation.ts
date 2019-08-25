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
  ResultType, ResultValue,
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

  every(iteratee: FilterIterateeLike<R, T, this>) {
    const resultValue = this.filter(iteratee, true).hasAny();
    return this.datasetFactory.value(() => !resultValue, async () => !await resultValue);
  }

  forEach(iteratee: RunIterateeLike<R, T, TLike, TFind, this>) {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.run.bind(iteratee);
    return this.datasetFactory.value(
      () => {
        for (const value of this) {
          fn(value, this);
        }
      },
      async () => {
        for await (const value of this) {
          await fn(value, this);
        }
      },
      this
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

  map(iteratee: MapIterateeLike<R, T, this>): Dataset<R, T, TLike, TFind> {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.map.bind(iteratee);
    return this.datasetFactory.dataset(
      this.datasetFactory.value(
        function *() {
          for (const value of this) {
            yield fn(value, this);
          }
        },
        async function *() {
          for await (const value of this) {
            yield await fn(value, this);
          }
        },
        this
      )
    );
  }

  reduce<Accumulator = T>(iteratee: ReduceIterateeLike<R, T, this, Accumulator>, initialValue?: Accumulator) {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.run.bind(iteratee);
    let accumulator: Accumulator = initialValue;
    return this.datasetFactory.value(
      function () {
        for (const value of this) {
          if (!accumulator) {
            accumulator = (value as unknown) as Accumulator;
            continue;
          }
          accumulator = fn(accumulator, value, this);
        }
        return accumulator;
      },
      async function () {
        for await (const value of this) {
          if (!accumulator) {
            accumulator = (value as unknown) as Accumulator;
            continue;
          }
          accumulator = await fn(accumulator, value, this);
        }
        return accumulator;
      },
      this
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
            if (!this.has(value)) {
              yield value;
            }
          }
        },
        async function *(): AsyncIterable<T | TLike> {
          for await (const value of this) {
            yield value;
          }
          for await (const value of asyncIterable(other)) {
            if (!await this.has(value)) {
              yield value;
            }
          }
        },
        this
      )
    );
  }

  some(iteratee: FilterIterateeLike<R, T, this>): ResultValue<R, boolean> {
    return this.filter(iteratee).hasAny();
  }

  match(find: T | TLike | TFind) {
    return this.filter(value => this.datasetFactory.isMatch(value, find));
  }

  filter(iteratee: FilterIterateeLike<R, T, this>, negate: boolean = false): Dataset<R, T, TLike, TFind> {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.test.bind(iteratee);
    function negateIfNeeded(value: boolean) {
      return negate ? !value : value;
    }
    return this.datasetFactory.dataset(
      this.datasetFactory.value(
        function *(): Iterable<T> {
          for (const value of this) {
            if (negateIfNeeded(fn(value, this))) {
              yield value;
            }
          }
        },
        async function *(): AsyncIterable<T> {
          for await (const value of this) {
            if (negateIfNeeded(await fn(value, this))) {
              yield value;
            }
          }
        },
        this
      )
    );
  }

}
