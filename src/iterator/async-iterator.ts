import { AsyncIterableLike } from "../lazy-set";

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
      if (!isIterable(value)) {
        return;
      }
      for (const item of value) {
        yield item;
      }
    }
  };
}

export async function drainAsync(iterable: AsyncIterableLike<unknown>) {
  const iterator = asyncIterator(iterable);
  let next: IteratorResult<unknown>;
  do {
    next = await iterator.next();
  } while (next && !next.done);
  return !!(next && next.value);
}

export function drain(iterable: Iterable<unknown>) {
  if (!isIterable(iterable)) {
    throw new Error("Non iterable given to drain");
  }
  const iterator = iterable[Symbol.iterator]();
  let next: IteratorResult<unknown>;
  do {
    next = iterator.next();
  } while (next && !next.done);
  return !!(next && next.value);
}
