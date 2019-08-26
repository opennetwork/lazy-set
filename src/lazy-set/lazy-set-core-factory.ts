import { LazySet } from "./sync";
import { AsyncLazySet } from "./async";
import { AsyncIterableLike } from "./sync";

export interface LazySetCoreFactory<T, TCreate = T, TFind = TCreate | T> {

  lazySet(sequence?: Iterable<T | TCreate>): LazySet<T, TCreate, TFind>;
  asyncLazySet(sequence: AsyncIterableLike<T | TCreate>): AsyncLazySet<T, TCreate, TFind>;

}
