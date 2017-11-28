Create a new instance of `Cite`:

```js
new Cite(data[, options])
```

* `data` can be any of the input types listed in {@tutorial input_types}
* `options` is an optional object with the input options listed in {@tutorial input_options}

## Example

```js
const example = new Cite('10.5281/zenodo.1005176')
```

> The optional second `options` argument is omitted here

You can access the parsed data like this:

```js
> example.data
< [{title: 'Citation.js', DOI: '10.5281/zenodo.1005176', ...}]
```

You can also iterate over the data with a `for...of` loop:

```js
const result = []
for (const entry of example) {
  result.push(entry.DOI)
}

> result
< ['10.5281/zenodo.1005176']
```

## `Cite.async()`

You can also create a `Cite` instance asynchronously with a callback. This is recommended when parsing data that requires using APIs, like Wikidata IDs, Wikidata JSON, DOIs and URLs.

```js
Cite.async('10.5281/zenodo.1005176', function (example) {
  example.data // [{DOI: '10.5281/zenodo.1005176', ...}]
})
```

If you omit the callback, `Cite.async()` returns a `Promise`:

```js
const example = await Cite.async('10.5281/zenodo.1005176')

// or

Cite.async('10.5281/zenodo.1005176').then(function (example) {
  example.data
})
```

You can use pass options to `Cite.async()` too, like this:

```js
Cite.async('10.5281/zenodo.1005176', options, function (example) {
  example.data // [{DOI: '10.5281/zenodo.1005176', ...}]
})

// or

const example = await Cite.async('10.5281/zenodo.1005176', options)

// or

Cite.async('10.5281/zenodo.1005176', options).then(function (example) {
  example.data
})
```
