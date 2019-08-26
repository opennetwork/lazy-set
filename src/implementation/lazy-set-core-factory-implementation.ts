import {
  AsyncLazySet,
  AsyncIterableLike,
  LazySet,
  LazySetContext,
  LazySetCoreFactory
} from "../lazy-set";
import { asyncIterable } from "../iterator/async-iterator";
import { LazySetImplementation } from "./sync/lazy-set-implementation";
import { AsyncLazySetImplementation } from "./async/async-lazy-set-implementation";

export class LazySetCoreFactoryImplementation<T, TCreate = T, TFind = TCreate | T> implements LazySetCoreFactory<T, TCreate, TFind> {

  private readonly context: LazySetContext<T, TCreate, TFind>;

  constructor(context: LazySetContext<T, TCreate, TFind>) {
    this.context = context;
  }

  lazySet(sequence?: Iterable<T | TCreate>): LazySet<T, TCreate, TFind> {
    return new LazySetImplementation<T, TCreate, TFind>(
      this,
      this.context,
      sequence
    );
  }

  asyncLazySet(sequence: AsyncIterableLike<T | TCreate>): AsyncLazySet<T, TCreate, TFind> {
    const iterable: AsyncIterable<T | TCreate> | undefined = sequence ? asyncIterable(sequence) : undefined;
    return new AsyncLazySetImplementation<T, TCreate, TFind>(
      this,
      this.context,
      iterable
    );
  }


}
