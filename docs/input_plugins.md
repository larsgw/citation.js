With Input Plugins you can register different input types and parsers and overwrite existing ones. To register/overwrite a input type, do this:

```js
Cite.plugins.input.add(type, {
  parse,
  parseAsync,
  parseType: {
    predicate,
    dataType,
    elementConstraint,
    propertyConstraint,
    tokenList,
    extends
  }
})
```
Or with General Plugins, `ref` being the plugin name:

```js
Cite.plugins.add(ref, {
  input: {
    type: {parse, ...}
  }
})
```

## Options

| Option                | Description                                          |
|-----------------------|------------------------------------------------------|
| `type`                | Type name                                            |
| `parse`               | Callback to parse data                               |
| `parseAsync`*         | Async callback to parse data (falls back to `parse`) |
| `predicate`           | Callback to test if data is of given type            |
| `dataType`            | Shorthand type checking (defaults to `'Primitive'`)  |
| `tokenList`*          | Shorthand checking for strings with repeated parts   |
| `elementConstraint`*  | Shorthand element checking                           |
| `propertyConstraint`* | Shorthand property checking                          |
| `extends`*            | Type subclassing                                     |

_*: optional_

> `dataType` defaults to `Primitive` if heuristics don't apply, so be careful for that.

### `type`

The `type` is the name of the {@tutorial input_types}, and are recommended to be in the syntax shown below. Alternative syntaxes include `@scope` and `@scope/format`. Examples:

  * `@bibtex/text` for a series of BibTeX entries
  * `@wikidata/list+string` for a list of Wikidata IDs separated by spaces/newlines/commas
  * `@wikidata/list+object` for an actual array of Wikidata IDs

Actual semantics in this string aren't mandated, but recommended. Scopes aren't reserved,
but try to respect other plugins.

```js
const type = '@scope/type+format'
```

### `parse`

Function to call to parse the input of your input type. Note that this doesn't
directly have to parse to CSL-JSON: for example, the `@bibtex/text` parser parses
entries into an array of objects (`@bibtex/json`). The `@bibtex/json` parser then
parses these objects into CSL-JSON (`@csl/object`).

```js
const parse = input => { ... }
```

### `parseAsync`

Same, but async. May both exist for the same input type. For example, the
`@wikidata/object` parser has both a sync and async variant

```js
const parseAsync = async input => { ... }
```

### `parseType`

The `parseType` object is a collection of functions, object-represented constraints and other configurations helping the parsing engine determine what type the input is.

#### `dataType`

The `dataType` is in what category your input data falls:

  * `String` for strings
  * `Array` for arrays
  * `SimpleObject` for regular objects
  * `ComplexObject` for other and/or custom classes
  * `Primitive` for numbers, undefined, etc., and null

The `dataType`, if not provided, can default to a number of things:

  1. If `predicate` is a regex or `tokenList` is used, it defaults to `String`.
  2. If `elementConstraint` is present, it defaults to `Array`.
  3. Else, it defaults to `Primitive`, which is arguably a quite useless default (how would one get bibliographical data out of a number?). It might change to `SimpleObject` in the future, or some wildcard if that gets implemented.

```js
const dataType = 'String'
```

#### `predicate`

`predicate` is a function to check if any value is of your input type. Note
that this function should account for the input value being undefined, etc.

Alternatively, you can pass a regex that matches if the input string is of
your input type.

```js
const predicate = input => { ... }
const predicate = /.../
```

#### `tokenList`

`tokenList` is a constraint to match strings consisting of a clearly delimited list of patterns (tokens), like a file with a DOI on each line. The delimiter is any amount of whitespace per default, and it normally trims leading and trailing whitespace and mandates that every token matches. However, those options can be configured by passing an object instead of only the pattern.

```js
const tokenList = /.../
const tokenList = {
  token: /.../,
  split: /.../, // /,/ for example, for commas
  every: true,  // `false` for any
  trim: true    // `false` for keeping whitespace
}
```

#### `elementConstraint` & `propertyConstraint`

Instead of or even in combination with `predicate` you can pass the constraints below.

  * `elementConstraint` mandates every element in an array should be of the passed `type`
  * `propertyConstraint` mandates the following:
    * for every/some (`propertyConstraint.match`) prop in `propertyConstraint.props`:
    * assert that the input has that property and
    * if there is a value constraint (`propertyConstraint.value`), assert that
      the value corresponding to that prop is evaluated as `true` when
      passed in the value constraint callback

```js
const elementConstraint = '@scope/type+format'
const propertyConstraint = {
  props: ['a'],   // or simply "props: 'a'"
  match: 'every', // or some
  value: value => { ... }
}
```

#### `extends`

The `extends` option is a bit of an outsider, as it doesn't specify what input should look like; instead, it tells the parsing engine to only test for this type after a certain type has already matched.

Say, for example, there's a `@else/url` format (there is). This format recognizes any URL, and tries to fetch whatever file it points to, and parse the contents. However, in some cases, like with `@doi/api`, which is also a URL, you want to add an `Accept` header to get machine-readable data directly. Because you don't want `@else/url` messing that up, you can say the `@doi/api` type `extends` the `@else/url` type.

This causes the parsing engine to check if it really isn't a `@doi/api` after announcing it matches `@else/url`. Besides being essential in some cases, like the one above, it also slightly improves performance, as the parsing engine now doesn't have to check if it's `@doi/api` if it already knows it isn't `@else/url`.

> Note that it's almost impossible for a plugin author to account for all or any types added through plugins. It is, however, quite useful for builtin types.

To view the hierarchy of formats, determined by the `extends` options, use `Cite.plugins.input.treeTypeParser()`.

## Use

When registered, every input plugin behaves like regular input formats, and can be parsed in the same way.
