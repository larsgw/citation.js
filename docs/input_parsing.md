Here's how input is parsed internally in Citation.js.

> This section will be expanded later

## `Cite.parse()`

You can parse input data with `Cite.parse()`, which returns CSL-JSON:

```js
const json = Cite.parse('10.5281/zenodo.1005176')

> json
< [{title: 'Citation.js', DOI: '10.5281/zenodo.1005176', ...}]
```

There is also an async variant, `Cite.parseAsync()`, that returns a `Promise`.
