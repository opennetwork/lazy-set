import { Quad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { QuadFilterIteratee } from "./quad-filter-iteratee";
import { QuadRunIteratee } from "./quad-run-iteratee";
import { QuadMapIteratee } from "./quad-map-iteratee";
import { QuadReduceIteratee } from "./quad-reduce-iteratee";
import { DatasetCoreImplementation } from "./dataset-core-implementation";
import { Dataset } from "./dataset";
import { DatasetCoreFactory } from "./dataset-core-factory";

export class DatasetImplementation extends DatasetCoreImplementation implements Dataset {

  constructor(datasetFactory: DatasetCoreFactory, quads: Iterable<QuadLike>) {
    super(datasetFactory, quads);
  }

  addAll(quads: Iterable<QuadLike>): Dataset {
    for (const quad of quads) {
      this.add(quad);
    }
    return this;
  }

  contains(other: Dataset): boolean {
    return other.every({
      test: quad => this.has(quad)
    });
  }

  deleteMatches(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike): this {
    // delete accepts QuadFind, which allows partial
    return this.delete({ subject, predicate, object, graph });
  }

  difference(other: Dataset): Dataset {
    return this.filter({
      test: quad => !other.has(quad)
    });
  }

  equals(other: Dataset): boolean {
    return (
      this.size === other.size &&
      this.every({
        test: quad => other.has(quad)
      })
    );
  }

  every(iteratee: QuadFilterIteratee): boolean {
    for (const quad of this) {
      if (!iteratee.test(quad, this)) {
        return false;
      }
    }
    return true;
  }

  filter(iteratee: QuadFilterIteratee): Dataset {
    const set = new Set<Quad>();
    for (const quad of this) {
      if (iteratee.test(quad, this)) {
        set.add(quad);
      }
    }
    return this.datasetFactory.dataset(set);
  }

  forEach(iteratee: QuadRunIteratee): void {
    for (const quad of this) {
      iteratee.run(quad, this);
    }
  }

  import(stream: unknown): Promise<Dataset> {
    throw new Error("Not implemented");
  }

  intersection(other: Dataset): Dataset {
    return this.filter({
      test: quad => other.has(quad)
    });
  }

  map(iteratee: QuadMapIteratee): Dataset {
    const dataset = this.datasetFactory.dataset();
    for (const quad of this) {
      dataset.add(iteratee.map(quad, this));
    }
    return dataset;
  }

  reduce<Accumulator extends QuadLike = QuadLike>(iteratee: QuadReduceIteratee<Accumulator>, initialValue?: Accumulator): Accumulator {
    let accumulator: Accumulator = initialValue;
    for (const quad of this) {
      if (!accumulator) {
        accumulator = (quad as unknown) as Accumulator;
        continue;
      }
      accumulator = iteratee.run(accumulator, quad, this);
    }
    return accumulator;
  }

  some(iteratee: QuadFilterIteratee): boolean {
    for (const quad of this) {
      if (iteratee.test(quad, this)) {
        return true;
      }
    }
    return false;
  }

  toArray(): Quad[] {
    return Array.from(this);
  }

  toCanonical(): string {
    throw new Error("Not implemented");
  }

  toStream(): unknown {
    throw new Error("Not implemented");
  }

  toString(): string {
    throw new Error("Not implemented");
  }

  union(quads: Dataset): Dataset {
    return quads.filter({
      test: quad => this.has(quad)
    });
  }

}
