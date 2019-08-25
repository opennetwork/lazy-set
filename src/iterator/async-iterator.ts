import { AsyncIterableLike } from "../dataset/sync";

export function isAsyncIterable<T>(value: AsyncIterableLike<T>): value is AsyncIterable<T> {
  function isAsyncIterableInstance(value: AsyncIterableLike<T>): value is AsyncIterable<T> {
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

export function isIterable<T>(value: AsyncIterableLike<T>): value is Iterable<T> {
  function isAsyncIterableInstance(value: AsyncIterableLike<T>): value is Iterable<T> {
    return !!(
      value &&
      value.hasOwnProperty(Symbol.iterator)
    );
  }
  return !!(
    isAsyncIterableInstance(value) &&
    value[Symbol.iterator] instanceof Function
  );
}

export function asyncIterator<T>(value: AsyncIterableLike<T>): AsyncIterator<T> {
  return asyncIterable(value)[Symbol.asyncIterator]();
}

export function asyncIterable<T>(value: AsyncIterableLike<T>): AsyncIterable<T> {
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
