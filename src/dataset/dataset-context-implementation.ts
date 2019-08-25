import {
  DatasetContext,
  DatasetContextOptions,
  DatasetContextValueAsyncFn,
  DatasetContextValueSyncFn,
  DatasetCoreIterable,
  DatasetCreateValue,
  ResultType,
  ResultValue
} from "./types";
import { NilableProps } from "tsdef";

export type PartialDatasetContextOptions<R extends ResultType, T, TLike, TFind> =
  & Omit<DatasetContextOptions<undefined, T, TLike, TFind, T | TLike>, "async" | "drain" | "value">
  & NilableProps<Pick<DatasetContextOptions<R, T, TLike, TFind, T | TLike>, "drain" | "value">>
  & Pick<DatasetContextOptions<R, T, TLike, TFind, T | TLike>, "async">;

export type AsyncDefinedPartialDatasetContextOptions<R extends ResultType, T, TLike, TFind, Async extends boolean> = Omit<PartialDatasetContextOptions<R, T, TLike, TFind>, "async"> & { async: Async };
export type AsyncPartialDatasetContextOptions<T, TLike, TFind> = AsyncDefinedPartialDatasetContextOptions<Promise<any>, T, TLike, TFind, true>;
export type SyncPartialDatasetContextOptions<T, TLike, TFind> = AsyncDefinedPartialDatasetContextOptions<undefined, T, TLike, TFind, false>;

export class DatasetContextImplementation<R extends ResultType, T, TLike, TFind> implements DatasetContext<R, T, TLike, TFind, DatasetCreateValue<R, T, TLike>> {

  get async() {
    return this.context.async;
  }

  readonly context: Readonly<PartialDatasetContextOptions<R, T, TLike, TFind>>;

  constructor(options: PartialDatasetContextOptions<R, T, TLike, TFind>) {
    this.context = Object.freeze({
      ...options
    });
  }

  isMatch(value: T, find: T | TLike | TFind) {
    const result = this.context.isMatch(value, find);
    return this.value(() => result, async () => result);
  }

  is(value: unknown): value is T {
    return this.context.is(value);
  }

  isLike(value: unknown): value is TLike {
    return this.context.isLike(value);
  }

  create(value: T | TLike | ResultValue<R, T | TLike, Promise<T | TLike> | T | TLike>) {
    return this.value(
      () => {
        if (value instanceof Promise) {
          throw new Error("Attempted to use an async context in a sync context");
        }
        if (!(this.is(value) || this.isLike(value))) {
          throw new Error("Found value in set that does not match context type or like type");
        }
        const returnedValue = this.context.create(value);
        if (!this.is(returnedValue)) {
          throw new Error("Found value in set that does not match context type");
        }
        return returnedValue;
      },
      async () => {
        const resolvedValue = await value;
        if (!(this.is(resolvedValue) || this.isLike(resolvedValue))) {
          throw new Error("Found value in set that does not match context type or like type");
        }
        const returnedValue = await this.context.create(resolvedValue);
        if (!this.is(returnedValue)) {
          throw new Error("Found value in set that does not match context type");
        }
        return returnedValue;
      },
      this
    );
  }

  drain(iterable: DatasetCoreIterable<R, T>) {
    if (this.context.drain) {
      return this.context.drain;
    }
    const iterator = iterable[Symbol.iterator]();
    let next: IteratorResult<any>;
    const values: any[] = [];
    do {
      next = iterator.next();
      if (next.value) {
        values.push(next.value);
      }
    } while (next.done);
    return this.value(
      () => !!next.value,
      async () => {
        const resultingValues = await Promise.all(values);
        const resultingValue = resultingValues.find(value => value);
        return this.is(resultingValue) || this.isLike(resultingValue);
      },
      this
    );
  }

  value<V, PV = V, This = this>(sync: DatasetContextValueSyncFn<R, T, TLike, TFind, V, This>, async: DatasetContextValueAsyncFn<R, T, TLike, TFind, V, PV, This>, thisValue?: This) {
    if (this.context.value) {
      return this.context.value(sync, async, thisValue);
    }
    if (this.async) {
      return async.call(thisValue || this);
    } else {
      return sync.call(thisValue || this);
    }
  }

}
