import {
  FilterIterateeFn,
  MapIterateeFn,
  ReduceIterateeFn
} from "../../iterator";
import { LazySetCoreImplementation } from "./lazy-set-core-implementation";
import {
  AsyncIterableLike,
  LazySet, LazySetContext,
  LazySetCoreFactory
} from "../../lazy-set";

export class LazySetImplementation<T, TCreate = T, TFind = TCreate | T> extends LazySetCoreImplementation<T, TCreate, TFind> implements LazySet<T, TCreate, TFind> {

  readonly [Symbol.toStringTag]: string = "LazySet";

  constructor(lazySetFactory: LazySetCoreFactory<T, TCreate, TFind>, lazySetContext: LazySetContext<T, TCreate, TFind>, values?: Iterable<T | TCreate>) {
    super(lazySetFactory, lazySetContext, values);
  }

  addAll(other: Iterable<T | TCreate>) {
    return this.lazySetFactory.lazySet(other).forEach(
      value => this.add(value)
    );
  }

  contains(other: Iterable<TCreate>) {
    return this.lazySetFactory.lazySet(other).every(
      value => this.has(value)
    );
  }

  difference(other: Iterable<TCreate>): LazySet<T, TCreate, TFind> {
    return this.lazySetFactory.lazySet(other).except(
      value => this.has(value)
    );
  }

  equals(other: Iterable<TCreate>) {
    const that = this;
    return this.lazySetFactory.lazySet(other).every(value => that.has(value));
  }

  every<This = this>(fn: FilterIterateeFn<false, T, this, This>, thisValue?: This) {
    return !this.except(fn, thisValue).hasAny();
  }

  async import(iterable: AsyncIterableLike<TCreate>): Promise<LazySet<T, TCreate, TFind>> {
    const datastream = this.lazySetFactory.asyncLazySet(iterable);
    return this.lazySetFactory.lazySet(await datastream.toSet());
  }

  intersection(other: Iterable<TCreate>): LazySet<T, TCreate, TFind> {
    const that = this;
    return this.lazySetFactory.lazySet(other).filter(value => that.has(value));
  }

  map<This = this>(fn: MapIterateeFn<false, T, this, This>, thisValue?: This): LazySet<T, TCreate, TFind> {
    const that = this;
    const generator = function *() {
      for (const value of that) {
        yield fn.call(thisValue || that, value, that);
      }
    };
    return this.lazySetFactory.lazySet(generator());
  }

  reduce<Accumulator = T, This = this>(fn: ReduceIterateeFn<false, T, this, This, Accumulator>, initialValue?: Accumulator, thisValue?: This) {
    let accumulator: Accumulator = initialValue;
    for (const value of this) {
      if (!accumulator) {
        accumulator = (value as unknown) as Accumulator;
        continue;
      }
      accumulator = fn.call(thisValue || this, accumulator, value, this);
    }
    return accumulator;
  }

  union(other: Iterable<TCreate>): LazySet<T, TCreate, TFind> {
    const otherLazySet = this.lazySetFactory.lazySet(other);
    const that = this;
    const generator = function *(): Iterable<T | TCreate> {
      for (const value of that) {
        yield value;
      }
      for (const value of otherLazySet) {
        yield value;
      }
    };
    return this.lazySetFactory.lazySet(generator());
  }

  some<This = this>(fn: FilterIterateeFn<false, T, this, This>, thisValue?: This): boolean {
    return this.filter(fn, thisValue).hasAny();
  }

  match(find: T | TCreate | TFind) {
    return this.filter(value => this.lazySetContext.isMatch(value, find));
  }

  filter<This = this>(fn: FilterIterateeFn<false, T, this, This>, thisValue?: This) {
    return this.filterNegatable(fn, false, thisValue);
  }

  except<This = this>(fn: FilterIterateeFn<false, T, this, This>, thisValue?: This) {
    return this.filterNegatable(fn, true, thisValue);
  }

  private filterNegatable<This = this>(fn: FilterIterateeFn<false, T, this, This>, negate: boolean, thisValue?: This): LazySet<T, TCreate, TFind> {
    function negateIfNeeded(value: boolean) {
      return negate ? !value : value;
    }
    const that = this;
    const generator = function *(): Iterable<T> {
      for (const value of that) {
        if (negateIfNeeded(fn.call(thisValue || that, value, that))) {
          yield value;
        }
      }
    };
    return this.lazySetFactory.lazySet(generator());
  }

}
