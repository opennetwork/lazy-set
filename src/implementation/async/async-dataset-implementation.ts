import {
  FilterIterateeLike,
  RunIterateeLike,
  MapIterateeLike,
  ReduceIterateeLike
} from "../../iterator";
import {
  AsyncDataset,
  AsyncDatasetContext,
  AsyncIterableLike,
  DatasetCoreFactory
} from "../../dataset/index";
import { AsyncDatasetCoreImplementation } from "./async-dataset-core-implementation";

export class AsyncDatasetImplementation<T, TCreate = T, TFind = TCreate | T> extends AsyncDatasetCoreImplementation<T, TCreate, TFind> implements AsyncDataset<T, TCreate, TFind> {

  constructor(datasetFactory: DatasetCoreFactory<T, TCreate, TFind>, datasetContext: AsyncDatasetContext<T, TCreate, TFind>, values?: AsyncIterableLike<T | TCreate>) {
    super(datasetFactory, datasetContext, values);
  }

  addAll(other: AsyncIterableLike<T | TCreate>) {
    return this.datasetFactory.asyncDataset(other).forEach(
      value => this.add(value)
    );
  }

  contains(other: AsyncIterableLike<T | TCreate>) {
    return this.datasetFactory.asyncDataset(other).every(
      value => this.has(value)
    );
  }

  difference(other: AsyncIterableLike<T | TCreate>) {
    return this.datasetFactory.asyncDataset(other).except(
      value => this.has(value)
    );
  }

  async equals(other: AsyncIterableLike<T | TCreate>) {
    const that = this;
    const otherSet = this.datasetFactory.asyncDataset(other);
    // getSize after, as both sets will be drained then
    // every may return early with false, but getSize can't
    return (
      otherSet.every(value => that.has(value)) &&
      await this.getSize() === await otherSet.getSize()
    );
  }

  async every(iteratee: FilterIterateeLike<true, T, this>) {
    return !await this.except(iteratee).hasAny();
  }

  async forEach(iteratee: RunIterateeLike<true, T, this>) {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.run.bind(iteratee);
    for await (const value of this) {
      await fn(value, this);
    }
  }

  async import(iterable: AsyncIterableLike<T | TCreate>) {
    // Import as async, then grab
    const datastream = this.datasetFactory.asyncDataset(iterable);
    await this.datasetContext.drain(datastream);
    return datastream;
  }

  intersection(other: AsyncIterableLike<T | TCreate>) {
    const that = this;
    return this.datasetFactory.asyncDataset(other).filter({
      test: value => that.has(value)
    });
  }

  map(iteratee: MapIterateeLike<true, T, this>) {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.map.bind(iteratee);
    const that = this;
    const generator = async function *() {
      for await (const value of that) {
        yield await fn(value, that);
      }
    };
    return this.datasetFactory.asyncDataset(generator());
  }

  async reduce<Accumulator = T>(iteratee: ReduceIterateeLike<true, T, this, Accumulator>, initialValue?: Accumulator) {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.run.bind(iteratee);
    let accumulator: Accumulator = initialValue;
    for await (const value of this) {
      if (!accumulator) {
        accumulator = (value as unknown) as Accumulator;
        continue;
      }
      accumulator = await fn(accumulator, value, this);
    }
    return accumulator;
  }

  union(other: AsyncIterableLike<T | TCreate>) {
    const otherDataset = this.datasetFactory.asyncDataset(other);
    const that = this;
    const generator = async function *(): AsyncIterable<T | TCreate> {
      for await (const value of that) {
        yield value;
      }
      for await (const value of otherDataset) {
        yield value;
      }
    };
    return this.datasetFactory.asyncDataset(generator());
  }

  some(iteratee: FilterIterateeLike<true, T, this>) {
    return this.filter(iteratee).hasAny();
  }

  match(find: T | TCreate | TFind) {
    return this.filter(value => this.datasetContext.isMatch(value, find));
  }

  filter(iteratee: FilterIterateeLike<true, T, this>) {
    return this.filterNegatable(iteratee, false);
  }

  except(iteratee: FilterIterateeLike<true, T, this>) {
    return this.filterNegatable(iteratee, true);
  }

  private filterNegatable(iteratee: FilterIterateeLike<true, T, this>, negate: boolean = false) {
    const fn = iteratee instanceof Function ? iteratee.bind(this) : iteratee.test.bind(iteratee);
    function negateIfNeeded(value: boolean) {
      return negate ? !value : value;
    }
    const that = this;
    const generator = async function *(): AsyncIterable<T> {
      for await (const value of that) {
        if (negateIfNeeded(await fn(value, that))) {
          yield value;
        }
      }
    };
    return this.datasetFactory.asyncDataset(generator());
  }

}
