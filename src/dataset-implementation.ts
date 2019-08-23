import { DefaultDataFactory, isQuad, isQuadLike, Quad, QuadLike, TermLike } from "@opennetwork/rdf-data-model";
import { QuadFilterIteratee } from "./quad-filter-iteratee";
import { QuadRunIteratee } from "./quad-run-iteratee";
import { QuadMapIteratee } from "./quad-map-iteratee";
import { QuadReduceIteratee } from "./quad-reduce-iteratee";
import { DatasetCoreImplementation } from "./dataset-core-implementation";
import { Dataset } from "./dataset";
import { isMatch } from "./match";
import { DatasetCoreFactory } from "./dataset-core-factory";

function getQuadInstance(quad: QuadLike): Quad {
  return isQuad(quad) ? quad : DefaultDataFactory.fromQuad(quad);
}

export class DatasetImplementation extends DatasetCoreImplementation implements Dataset {

  constructor(datasetFactory: DatasetCoreFactory, quads: Quad[]) {
    super(datasetFactory, quads);
  }

  addAll(quads: Dataset | Iterable<QuadLike> | QuadLike[]): Dataset {
    return this.replace(
      this.quads.concat(Array.from(quads).map(quad => {
        if (isQuad(quad)) {
          return quad;
        }
        return DefaultDataFactory.fromQuad(quad);
      }))
    );
  }

  contains(other: Dataset): boolean {
    return other.every({
      test: quad => this.has(quad)
    });
  }

  deleteMatches(subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike): this {
    return this.replace(
      this.quads.filter(quad => !isMatch(quad, subject, predicate, object, graph))
    );
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
    return this.quads.every(
      quad => iteratee.test(quad, this)
    );
  }

  filter(iteratee: QuadFilterIteratee): Dataset {
    return this.datasetFactory.dataset(
      this.quads.filter(
        quad => iteratee.test(quad, this)
      )
    );
  }

  forEach(iteratee: QuadRunIteratee): void {
    this.quads.forEach(
      quad => iteratee.run(quad, this)
    );
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
    return this.datasetFactory.dataset(
      this.quads.map(quad => {
        const result = iteratee.map(quad, this);
        return getQuadInstance(result);
      })
    );
  }

  reduce<Accumulator = QuadLike>(iteratee: QuadReduceIteratee<Accumulator>, initialValue?: Accumulator): Accumulator extends QuadLike ? Quad : Accumulator {
    function reduce(values: ReadonlyArray<Quad>, initialValue: Quad | Accumulator) {
      return this.quads.reduce(
        (accumulator: Accumulator, next: Quad) => {
          const result = iteratee.run(accumulator, next, this);
          if (isQuadLike(result)) {
            return getQuadInstance(result);
          }
          return result;
        },
        initialValue
      );
    }
    if (!this.quads.length) {
      return (isQuadLike(initialValue) ? getQuadInstance(initialValue) : initialValue) as Accumulator extends QuadLike ? Quad : Accumulator;
    }
    if (typeof initialValue !== "undefined") {
      return reduce(this.quads, isQuadLike(initialValue) ? getQuadInstance(initialValue) : initialValue);
    }
    // Force use of first value
    return reduce(this.quads.slice(1), this.quads[0]);
  }

  some(iteratee: QuadFilterIteratee): boolean {
    return this.quads.some(
      quad => iteratee.test(quad, this)
    );
  }

  toArray(): Quad[] {
    return this.quads.slice();
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
    return this.datasetFactory.dataset(
      this.quads.concat(quads.toArray())
    );
  }

}
