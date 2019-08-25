import { DatasetIterable, DatasetIterator, ResultType, SyncableDatasetIterableTypeLike } from "../dataset";

export function isAsyncIterable<T>(value: Iterable<T> | AsyncIterable<T>): value is AsyncIterable<T> {
  function isAsyncIterableInstance(value: Iterable<T> | AsyncIterable<T>): value is AsyncIterable<T> {
    return !!(
      value &&
      value.hasOwnProperty(Symbol.asyncIterator)
    );
  }
  return !!(
    isAsyncIterableInstance(value) &&
    value[Symbol.asyncIterator] instanceof Function
  );
}

export function asyncIterator<T>(value: Iterable<T> | AsyncIterable<T>): AsyncIterator<T> {
  return asyncIterable(value)[Symbol.asyncIterator]();
}

export function asyncIterable<T>(value: Iterable<T> | AsyncIterable<T>): AsyncIterable<T> {
  if (isAsyncIterable(value)) {
    return value;
  }
  return {
    [Symbol.asyncIterator]: async function *() {
      for (const item of value) {
        yield item;
      }
    }
  };
}

export function isAsyncDatasetIterable<R extends ResultType, T>(datasetIterable: SyncableDatasetIterableTypeLike<any, T>): datasetIterable is DatasetIterable<true, T> {
  function isAsyncIterableInstance(datasetIterable: SyncableDatasetIterableTypeLike<any, T>): datasetIterable is DatasetIterable<true, T> {
    return typeof datasetIterable === "object";
  }
  return !!(
    isAsyncIterableInstance(datasetIterable) &&
    datasetIterable[Symbol.asyncIterator] instanceof Function
  );
}

export function isDatasetIterable<T, TLike>(datasetIterable: SyncableDatasetIterableTypeLike<any, T>): datasetIterable is DatasetIterable<false, T> {
  function isIterableInstance(datasetIterable: SyncableDatasetIterableTypeLike<any, T>): datasetIterable is DatasetIterable<false, T> {
    return typeof datasetIterable === "object";
  }
  return !!(
    isIterableInstance(datasetIterable) &&
    datasetIterable[Symbol.iterator] instanceof Function
  );
}

/**
 * When this function is used, each promise is resolved externally in a sequential order
 */
function *asyncDatasetIterator<T>(datasetIterable: DatasetIterable<true, T>): DatasetIterator<true, T> {
  const iterator: AsyncIterator<T> = datasetIterable[Symbol.asyncIterator]();
  let currentPromise: Promise<T> = undefined,
    done: boolean = false;
  do {
    currentPromise = (currentPromise || Promise.resolve(undefined))
      .then(async () => {
        const result = await iterator.next();
        if (result.done) {
          done = true;
        }
        return result.value;
      })
      .catch(error => {
        done = true;
        throw error;
      });
    yield currentPromise;
  } while (!done);
  return;
}

export function getAsyncDatasetIterator<T>(datasetIterable: DatasetIterable<true, T>): DatasetIterator<true, T> {
  return asyncDatasetIterator(datasetIterable);
}

export function getDatasetIterator<R extends ResultType, T, TLike>(datasetIterable: SyncableDatasetIterableTypeLike<R, T>): DatasetIterator<R, T> {
  if (isDatasetIterable(datasetIterable)) {
    return datasetIterable[Symbol.iterator]() as DatasetIterator<R, T>;
  }
  if (isAsyncDatasetIterable(datasetIterable)) {
    return getAsyncDatasetIterator(datasetIterable) as DatasetIterator<R, T>;
  }
  return undefined;
}
