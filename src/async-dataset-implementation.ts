import { Quad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { AsyncQuadFilterIteratee } from "./async-quad-filter-iteratee";
import { AsyncQuadRunIteratee } from "./async-quad-run-iteratee";
import { AsyncQuadMapIteratee } from "./async-quad-map-iteratee";
import { AsyncQuadReduceIteratee } from "./async-quad-reduce-iteratee";
import { Dataset } from "./dataset";
import { DatasetCoreFactory } from "./dataset-core-factory";
import { AsyncDatasetCoreImplementation } from "./async-dataset-core-implementation";
import { AsyncDataset } from "./async-dataset";
import { AsyncDatasetCoreFactory } from "./async-dataset-core-factory";
import { asyncIterable } from "./async-iterator";

export class AsyncDatasetImplementation extends AsyncDatasetCoreImplementation implements AsyncDataset {

  constructor(datasetFactory: DatasetCoreFactory, asyncDatasetFactory: AsyncDatasetCoreFactory, quads?: Iterable<QuadLike> | AsyncIterable<QuadLike>) {
    super(datasetFactory, asyncDatasetFactory, quads);
  }

  async addAll(quads: Iterable<QuadLike> | AsyncIterable<QuadLike>): Promise<void> {
    for await (const value of asyncIterable(quads)) {
      await this.add(value);
    }
  }

  contains(other: Dataset | AsyncDataset) {
    return this.asyncDatasetFactory.dataset(other).every({
      test: async quad => this.has(quad)
    });
  }

  deleteMatches(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike) {
    // delete accepts QuadFind, which allows partial
    return this.delete({ subject, predicate, object, graph });
  }

  difference(other: Dataset): AsyncDataset {
    const asyncOther = this.asyncDatasetFactory.dataset(other);
    return this.filter({
      test: async quad => !await asyncOther.has(quad)
    });
  }

  async equals(other: Dataset | AsyncDataset): Promise<boolean> {
    const asyncOther = this.asyncDatasetFactory.dataset(other);
    const [otherSize, size] = await Promise.all([
      asyncOther.getSize(),
      this.getSize()
    ]);
    return (
      otherSize === size &&
      this.every({
        test: async quad => other.has(quad)
      })
    );
  }

  async every(iteratee: AsyncQuadFilterIteratee): Promise<boolean> {
    for await (const quad of this) {
      if (!iteratee.test(quad, this)) {
        return false;
      }
    }
    return true;
  }

  filter(iteratee: AsyncQuadFilterIteratee): AsyncDataset {
    const dataset = this.dataset;
    const asyncDataset: AsyncDataset = this;
    return this.asyncDatasetFactory.dataset(
      (function *() {
        for (const value of dataset) {
          if (iteratee.test(value, asyncDataset)) {
            yield value;
          }
        }
      })()
    );
  }

  async forEach(iteratee: AsyncQuadRunIteratee) {
    for await (const quad of this) {
      await iteratee.run(quad, this.dataset);
    }
  }

  import(stream: unknown): Promise<Dataset> {
    throw new Error("Not implemented");
  }

  intersection(other: Dataset | AsyncDataset): AsyncDataset {
    return this.filter({
      test: async quad => other.has(quad)
    });
  }

  map(iteratee: AsyncQuadMapIteratee): AsyncDataset {
    const dataset = this.dataset;
    const asyncDataset: AsyncDataset = this;
    return this.asyncDatasetFactory.dataset(
      (async function *() {
        for await (const value of dataset) {
          yield iteratee.map(value, asyncDataset);
        }
      })()
    );
  }

  async reduce<Accumulator extends QuadLike = QuadLike>(iteratee: AsyncQuadReduceIteratee<Accumulator>, initialValue?: Accumulator): Promise<Accumulator> {
    let accumulator: Accumulator = initialValue;
    for await (const quad of this) {
      if (!accumulator) {
        accumulator = (quad as unknown) as Accumulator;
        continue;
      }
      accumulator = await iteratee.run(accumulator, quad, this);
    }
    return accumulator;
  }

  async some(iteratee: AsyncQuadFilterIteratee): Promise<boolean> {
    for await (const quad of this) {
      if (iteratee.test(quad, this)) {
        return true;
      }
    }
    return false;
  }

  async toArray(): Promise<Quad[]> {
    return Array.from(this.dataset);
  }

  toCanonical(): Promise<string> {
    throw new Error("Not implemented");
  }

  toStream(): Promise<unknown> {
    throw new Error("Not implemented");
  }

  union(quads: Dataset | AsyncDataset): AsyncDataset {
    const asyncQuads = this.asyncDatasetFactory.dataset(quads);
    return asyncQuads.filter({
      test: async quad => this.has(quad)
    });
  }

}
