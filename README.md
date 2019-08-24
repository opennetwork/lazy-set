# RDF Dataset

In memory implementation of [https://rdf.js.org/dataset-spec/](https://rdf.js.org/dataset-spec/)

This implementation differs from spec by:

- Not implementing the `toStream` method, a dataset is already an `Iterable<Quad>`
- Not implementing the `toString` or `toCanonical` methods (Yet)
