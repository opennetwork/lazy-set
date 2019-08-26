import {
  AsyncDatasetContext, AsyncIterableLike
} from "../../dataset";
import { DatasetContextImplementation } from "../sync/dataset-context-implementation";
import { asyncIterator } from "../../iterator";

export class AsyncDatasetContextImplementation<T, TCreate = T, TFind = TCreate | T, DrainType extends AsyncIterable<any> = AsyncIterable<any>> extends DatasetContextImplementation<true, T, TCreate, TFind, DrainType> implements AsyncDatasetContext<T, TCreate, TFind> {

  async drain(iterable: AsyncIterableLike<any>) {
    const iterator = asyncIterator(iterable);
    let next: IteratorResult<any>;
    do {
      next = await iterator.next();
    } while (next && !next.done);
    return !!(next && next.value);
  }

}
