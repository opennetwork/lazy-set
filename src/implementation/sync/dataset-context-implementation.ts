import {
  AsyncIterableLike,
  DatasetContext
} from "../../dataset";
import { ResultType, ResultValue } from "../../iterator/result-type";
import { isAsyncIterable, isIterable } from "../../iterator";

export type PartialDatasetContextOptions<Async extends ResultType, T, TCreate extends T = T, TFind extends (TCreate | T) = (TCreate | T)> = & Omit<DatasetContext<Async, T, TCreate, TFind>, "drain">;

export class DatasetContextImplementation<Async extends ResultType, T, TCreate extends T = T, TFind extends (TCreate | T) = (TCreate | T), DrainType extends AsyncIterableLike<any> = Iterable<any>> implements DatasetContext<Async, T, TCreate, TFind, DrainType> {

  get async() {
    return this.context.async;
  }

  readonly context: Readonly<PartialDatasetContextOptions<Async, T, TCreate, TFind>>;

  constructor(options: PartialDatasetContextOptions<Async, T, TCreate, TFind>) {
    this.context = Object.freeze({
      ...options
    });
  }

  isMatch(value: T, find: T | TCreate | TFind) {
    return this.context.isMatch(value, find);
  }

  is(value: unknown): value is T {
    return this.context.is(value);
  }

  isFind(value: unknown): value is TFind {
    return this.context.isFind(value);
  }

  isCreate(value: unknown): value is TCreate {
    return this.context.isCreate(value);
  }

  create(value: TCreate) {
    return this.context.create(value);
  }

  drain(iterable: DrainType): ResultValue<Async, boolean> {
    if (this.async) {
      throw new Error("Expected drain to be implemented in AsyncDatasetContextImplementation");
    }
    if (isAsyncIterable(iterable)) {
      throw new Error("Async iterable found in sync context");
    }
    if (!isIterable(iterable)) {
      throw new Error("Non iterable given to drain");
    }
    const iterator = iterable[Symbol.iterator]();
    let next: IteratorResult<any>;
    do {
      next = iterator.next();
    } while (next && !next.done);
    return !!(next && next.value) as ResultValue<Async, boolean>;
  }

}
