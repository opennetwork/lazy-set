import {
  FilterIterateeFn,
  MapIterateeFn,
  ReduceIterateeFn
} from "../../iterator";
import {
  AsyncLazySet,
  AsyncIterableLike,
  LazySetContext,
  LazySetCoreFactory
} from "../../lazy-set";
import { AsyncLazySetCoreImplementation } from "./async-lazy-set-core-implementation";
import { drainAsync } from "../../iterator/async-iterator";

export class AsyncLazySetImplementation<T, TCreate = T, TFind = TCreate | T> extends AsyncLazySetCoreImplementation<T, TCreate, TFind> implements AsyncLazySet<T, TCreate, TFind> {

  readonly [Symbol.toStringTag]: string = "AsyncLazySet";

  constructor(lazySetFactory: LazySetCoreFactory<T, TCreate, TFind>, lazySetContext: LazySetContext<T, TCreate, TFind>, values?: AsyncIterableLike<T | TCreate>) {
    super(lazySetFactory, lazySetContext, values);
  }

  addAll(other: AsyncIterableLike<T | TCreate>) {
    return this.lazySetFactory.asyncLazySet(other).forEach(
      value => this.add(value)
    );
  }

  contains(other: AsyncIterableLike<T | TCreate>) {
    return this.lazySetFactory.asyncLazySet(other).every(
      value => this.has(value)
    );
  }

  difference(other: AsyncIterableLike<T | TCreate>) {
    return this.lazySetFactory.asyncLazySet(other).except(
      value => this.has(value)
    );
  }

  async equals(other: AsyncIterableLike<T | TCreate>) {
    const that = this;
    const otherSet = this.lazySetFactory.asyncLazySet(other);
    // getSize after, as both sets will be drained then
    // every may return early with false, but getSize can't
    return (
      otherSet.every(value => that.has(value)) &&
      await this.getSize() === await otherSet.getSize()
    );
  }

  async every<This = this>(fn: FilterIterateeFn<true, T, this, This>, thisValue?: This) {
    return !await this.except(fn).hasAny();
  }

  async import(iterable: AsyncIterableLike<T | TCreate>) {
    const lazySet = this.lazySetFactory.asyncLazySet(iterable);
    // Ensure entire iterable is drained so that the lazySet has everything stored
    await drainAsync(lazySet);
    return lazySet;
  }

  intersection(other: AsyncIterableLike<T | TCreate>) {
    return this.lazySetFactory.asyncLazySet(other).filter(
      value => this.has(value)
    );
  }

  map<This = this>(fn: MapIterateeFn<true, T, this, This>, thisValue?: This) {
    const that = this;
    const generator = async function *() {
      for await (const value of that) {
        yield await fn.call(thisValue || that, value, that);
      }
    };
    return this.lazySetFactory.asyncLazySet(generator());
  }

  async reduce<Accumulator = T, This = this>(fn: ReduceIterateeFn<true, T, this, This, Accumulator>, initialValue?: Accumulator, thisValue?: This) {
    let accumulator: Accumulator = initialValue;
    for await (const value of this) {
      if (!accumulator) {
        accumulator = (value as unknown) as Accumulator;
        continue;
      }
      accumulator = await fn.call(thisValue || this, accumulator, value, this);
    }
    return accumulator;
  }

  union(other: AsyncIterableLike<T | TCreate>) {
    const otherLazySet = this.lazySetFactory.asyncLazySet(other);
    const that = this;
    const generator = async function *(): AsyncIterable<T | TCreate> {
      for await (const value of that) {
        yield value;
      }
      for await (const value of otherLazySet) {
        yield value;
      }
    };
    return this.lazySetFactory.asyncLazySet(generator());
  }

  some<This = this>(fn: FilterIterateeFn<true, T, this, This>, thisValue?: This) {
    return this.filter(fn, thisValue).hasAny();
  }

  match<This = this>(find: T | TCreate | TFind) {
    return this.filter(value => this.lazySetContext.isMatch(value, find));
  }

  filter<This = this>(fn: FilterIterateeFn<true, T, this, This>, thisValue?: This) {
    return this.filterNegatable(fn, false, thisValue);
  }

  except<This = this>(fn: FilterIterateeFn<true, T, this, This>, thisValue?: This) {
    return this.filterNegatable(fn, true, thisValue);
  }

  private filterNegatable<This = this>(fn: FilterIterateeFn<true, T, this, This>, negate: boolean = false, thisValue?: This) {
    function negateIfNeeded(value: boolean) {
      return negate ? !value : value;
    }
    const that = this;
    const generator = async function *(): AsyncIterable<T> {
      for await (const value of that) {
        if (negateIfNeeded(await fn.call(thisValue || that, value, that))) {
          yield value;
        }
      }
    };
    return this.lazySetFactory.asyncLazySet(generator());
  }

}
