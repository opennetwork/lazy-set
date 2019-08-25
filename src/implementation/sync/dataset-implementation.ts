import {
  FilterIterateeLike,
  RunIterateeLike,
  MapIterateeLike,
  ReduceIterateeLike
} from "../../iterator";
import { DatasetCoreImplementation } from "./dataset-core-implementation";
import {
  AsyncIterableLike,
  Dataset, DatasetContext,
  DatasetCoreFactory
} from "../../dataset/index";

export class DatasetImplementation<T, TCreate extends T = T, TFind extends (TCreate | T) = (TCreate | T)> extends DatasetCoreImplementation<T, TCreate, TFind> implements Dataset<T, TCreate, TFind> {

  constructor(datasetFactory: DatasetCoreFactory<T, TCreate, TFind>, datasetContext: DatasetContext<false, T, TCreate, TFind>, values?: Iterable<T | TCreate>) {
    super(datasetFactory, datasetContext, values);
  }

  addAll(other: Iterable<TCreate>) {
    return this.datasetFactory.dataset(other).forEach(
      value => this.add(value)
    );
  }

  contains(other: Iterable<TCreate>) {
    return this.datasetFactory.dataset(other).every(
      value => this.has(value)
    );
  }

  difference(other: Iterable<TCreate>): Dataset<T, TCreate, TFind> {
    return this.datasetFactory.dataset(other).except(
      value => this.has(value)
    );
  }

  equals(other: Iterable<TCreate>) {
    const that = this;
    return this.datasetFactory.dataset(other).every(value => that.has(value));
  }

  every(iteratee: FilterIterateeLike<false, T, this>) {
    return !this.except(iteratee).hasAny();
  }

  forEach(iteratee: RunIterateeLike<false, T, this>) {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.run.bind(iteratee);
    for (const value of this) {
      fn(value, this);
    }
  }

  async import(iterable: AsyncIterableLike<TCreate>): Promise<Dataset<T, TCreate, TFind>> {
    const datastream = this.datasetFactory.asyncDataset(iterable);
    return this.datasetFactory.dataset(await datastream.toSet());
  }

  intersection(other: Iterable<TCreate>): Dataset<T, TCreate, TFind> {
    const that = this;
    return this.datasetFactory.dataset(other).filter({
      test: value => that.has(value)
    });
  }

  map(iteratee: MapIterateeLike<false, T, this>): Dataset<T, TCreate, TFind> {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.map.bind(iteratee);
    const generator = function *() {
      for (const value of this) {
        yield fn(value, this);
      }
    };
    return this.datasetFactory.dataset(generator());
  }

  reduce<Accumulator = T>(iteratee: ReduceIterateeLike<false, T, this, Accumulator>, initialValue?: Accumulator) {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.run.bind(iteratee);
    let accumulator: Accumulator = initialValue;
    for (const value of this) {
      if (!accumulator) {
        accumulator = (value as unknown) as Accumulator;
        continue;
      }
      accumulator = fn(accumulator, value, this);
    }
    return accumulator;
  }

  union(other: Iterable<TCreate>): Dataset<T, TCreate, TFind> {
    const otherDataset = this.datasetFactory.dataset(other);
    const generator = function *(): Iterable<T | TCreate> {
      for (const value of this) {
        yield value;
      }
      for (const value of otherDataset) {
        if (!this.has(value)) {
          yield value;
        }
      }
    };
    return this.datasetFactory.dataset(generator());
  }

  some(iteratee: FilterIterateeLike<false, T, this>): boolean {
    return this.filter(iteratee).hasAny();
  }

  match(find: T | TCreate | TFind) {
    return this.filter(value => this.datasetContext.isMatch(value, find));
  }

  filter(iteratee: FilterIterateeLike<false, T, this>) {
    return this.filterNegatable(iteratee, false);
  }

  except(iteratee: FilterIterateeLike<false, T, this>) {
    return this.filterNegatable(iteratee, true);
  }

  private filterNegatable(iteratee: FilterIterateeLike<false, T, this>, negate: boolean = false): Dataset<T, TCreate, TFind> {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.test.bind(iteratee);
    function negateIfNeeded(value: boolean) {
      return negate ? !value : value;
    }
    const generator = function *(): Iterable<T> {
      for (const value of this) {
        if (negateIfNeeded(fn(value, this))) {
          yield value;
        }
      }
    };
    return this.datasetFactory.dataset(generator());
  }

}
