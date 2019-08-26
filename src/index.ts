import {
  LazySetCoreFactoryImplementation
} from "./implementation/lazy-set-core-factory-implementation";
import { AsyncIterableLike, LazySetContext, LazySetCoreFactory } from "./lazy-set";
import { LazySetImplementation } from "./implementation/sync/lazy-set-implementation";
import { AsyncLazySetImplementation } from "./implementation/async/async-lazy-set-implementation";

export * from "./lazy-set";
export * from "./iterator";

function basicEquals(left: unknown, right: unknown): boolean {
  return left === right;
}

export function lazySetFactory<T, TCreate = T, TFind = TCreate | T>(options: LazySetContext<T, TCreate, TFind>): LazySetCoreFactory<T, TCreate, TFind> {
  return new LazySetCoreFactoryImplementation(options);
}

export function basicLazySetFactory<T>(is: (value: unknown) => value is T, equals: (left: T, right: T) => boolean = basicEquals): LazySetCoreFactory<T, T, T> {
  return lazySetFactory({
    isCreate: is,
    is,
    isFind: is,
    isMatch: equals,
    create: (value: T) => value
  });
}

export type PrimitiveTypes = {
  boolean: boolean;
  string: string;
  number: number;
};
export type PrimitiveTypeString = keyof PrimitiveTypes;

export function primitiveLazySetFactory<P extends PrimitiveTypeString, T extends PrimitiveTypes[P] = PrimitiveTypes[P]>(type: P, equals: (left: T, right: T) => boolean = basicEquals) {
  return basicLazySetFactory(
    function is(value: unknown): value is T {
      return typeof value === type;
    },
    equals
  );
}

function isAny(value: unknown): value is any {
  return true;
}

function getContext<T>(): LazySetContext<T> {
  return {
    isCreate: isAny,
    is: isAny,
    isFind: isAny,
    isMatch: basicEquals,
    create: (value: T) => value
  };
}

export class LazySet<T> extends LazySetImplementation<T, T, T> {

  constructor(iterable?: Iterable<T>) {
    super(lazySetFactory(getContext()), getContext(), iterable);
  }

}

export class AsyncLazySet<T> extends AsyncLazySetImplementation<T, T, T> {

  constructor(iterable?: AsyncIterableLike<T>) {
    super(lazySetFactory(getContext()), getContext(), iterable);
  }

}
