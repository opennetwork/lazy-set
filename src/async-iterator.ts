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
