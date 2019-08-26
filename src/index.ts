import {
  LazySetCoreFactoryImplementation
} from "./implementation/lazy-set-core-factory-implementation";
import { LazySetContext, LazySetCoreFactory } from "./lazy-set";

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

export function primitiveLazySetFactory<P extends PrimitiveTypeString>(type: P) {
  type T = PrimitiveTypes[P];
  return basicLazySetFactory(
    function is(value: unknown): value is T {
      return typeof value === type;
    },
    basicEquals
  );
}
