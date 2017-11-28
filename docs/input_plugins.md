With Input Plugins you can register different input types and parsers and overwrite existing ones. To register/overwrite a input type, do this:

```js
Cite.parse.add(type, options)
```

## Options

| Option                | Description                                          |
|-----------------------|------------------------------------------------------|
| `type`                | Type name                                            |
| `parse`               | Callback to parse data                               |
| `parseAsync`*         | Async callback to parse data (falls back to `parse`) |
| `parseType`           | Callback to test if data is of given type            |
| `dataType`*           | Shorthand type checking                              |
| `elementConstraint`*  | Shorthand element checking                           |
| `propertyConstraint`* | Shorthand property checking                          |

_*: optional_

> `parse` and `parseType` are optional too for registering, but are pretty useful when actually using it

> `parse`, `parseAsync`, and the type-related options can be passed independently, in separate function calls, but `parseType` and its shorthands (`dataType`, `elementConstraint`, and `propertyConstraint`) should always be passed together.

### `type`

The `type` is the name of the {@tutorial input_type}, and should be in the syntax shown below. Alternative syntaxes include `@scope` and `@scope/format`. Examples:

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

`parseType` is a function to check if any value is of your input type. Note
that this function should account for the input value being undefined, etc.

Alternatively, you can pass a regex that matches if the input string is of
your input type.

```js
const parseType = input => { ... }
const parseType = /.../
```

### `dataType`

The `dataType` is in what category your input data falls:

  * `String` for strings
  * `Array` for arrays
  * `SimpleObject` for regular objects
  * `ComplexObject` for other and/or custom classes
  * `Primitive` for numbers, undefined, etc., and null

Note: if `parseType` is a regex, `dataType` defaults to `String`

```js
const dataType = ''
```

### `elementConstraint` & `propertyConstraint`

Instead of or even in combination with `parseType` you can pass the constraints below.

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
  props: ['a'], // or simply "props: 'a'"
  match: 'every', // or some
  value: value => { ... }
}
```

## Use

When registered, every input plugin behaves like regular input formats, and can be parsed in the same way.
