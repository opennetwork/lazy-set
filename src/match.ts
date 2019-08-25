import { QuadLike, TermLike, DefaultDataFactory, isQuad } from "@opennetwork/rdf-data-model";


export declare type QuadFind = Partial<QuadLike | {
  subject: TermLike;
  predicate: TermLike;
  object: TermLike;
  graph: TermLike;
}>;

export function isSingleMatcher(find: QuadFind): boolean {
  return !!(
    find.subject &&
    find.predicate &&
    find.object &&
    find.graph
  );
}

export function isMatch(quad: QuadLike, find: QuadFind): boolean {
  const quadInstance = isQuad(quad) ? quad : DefaultDataFactory.fromQuad(quad);
  return (
    (
      !find.subject || quadInstance.subject.equals(find.subject)
    ) &&
    (
      !find.predicate || quadInstance.predicate.equals(find.predicate)
    ) &&
    (
      !find.object || quadInstance.object.equals(find.object)
    ) &&
    (
      !find.graph || quadInstance.graph.equals(find.graph)
    )
  );
}
