import { QuadLike, TermLike, DefaultDataFactory, isQuad } from "@opennetwork/rdf-data-model";

export function isMatch(quad: QuadLike, subject?: TermLike, predicate?: TermLike, object?: TermLike, graph?: TermLike): boolean {
  const quadInstance = isQuad(quad) ? quad : DefaultDataFactory.fromQuad(quad);
  return (
    (
      !subject || quadInstance.subject.equals(subject)
    ) &&
    (
      !predicate || quadInstance.predicate.equals(predicate)
    ) &&
    (
      !object || quadInstance.object.equals(object)
    ) &&
    (
      !graph || quadInstance.graph.equals(graph)
    )
  );
}
