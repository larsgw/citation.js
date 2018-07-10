Central to Citation.js is the `Cite` constructor. This document explains how to use it.

```js
const example = new Cite(data, options)
```

`data` can be any of the input types listed in {@tutorial input_types}. Some of the main ones:

  * DOIs, lists of DOIs, a file with DOIs, or a `doi.org` URL
  * Wikidata IDs, lists of IDs, a file with IDs, a Wikidata API URL, Wikidata JSON response
  * BibTeX entries, JSON representations of BibTeX, Bib.TXT entries
  * BibJSON
  * CSL-JSON
  * Serialized JSON, an array with mixed contents, a plain URL, a jQuery element, a DOM element

`options` is an object with the input options listed in {@tutorial input_options}. These are usually not needed.

> A more in-depth read on the `Cite` constructor and how to use it can be found in {@tutorial cite_constructor}

## Data Methods

> Read more on {@tutorial cite_data}

`Cite` instances have some more functions:

  * `Cite#add(<data>)`: Add data
  * `Cite#reset()`: Remove all data and options
  * `Cite#set(<data>)`: Replace all data with new data
  * `Cite#set()` and `Cite#get()` also have async variants (`Cite#setAsync()` and `Cite#addAsync()`), which return Promises

These functions change the internal data of the references managed in that `Cite` instance.

```js
const example = new Cite({title: 'Thing A'})

console.log(example.data)
// [{title: 'Thing A'}]

example.add([{title: 'Thing B'}, {title: 'Thing C'}])

console.log(example.data)
// [{title: 'Thing A'}, {title: 'Thing B'}, {title: 'Thing C'}]

example.set({title: 'Thing D'})

console.log(example.data)
// [{title: 'Thing D'}]

example.reset()

console.log(example.data)
// []
```

## Version Control Methods

  * `Cite#currentVersion()`: Get current version number
  * `Cite#retrieveVersion(<version number>)`: Retrieve a certain version of the object
  * `Cite#retrieveLastVersion()`: Retrieve the last saved version of the object
  * `Cite#undo(<number>)`: Restore the n to last version (default: `1`)
  * `Cite#save()`: Save the current object

These functions are a limited, opt-in version control.

```js
const example = new Cite({id: 1})

example.add({id: 2})

console.log(example.data)
// [{id: 1}, {id: 2}]

// oops, let's revert that
const new_example = example.undo()

console.log(new_example.data)
// [{id: 1}]

console.log(example.data)
// [{id: 1}, {id: 2}]
```

## Configuration Methods

  * `Cite#options(<options>)`: Change default options

This function changes the default {@tutorial output_options}.

```js
const example = new Cite('Q30000000', {
  // Default options: BibTeX JSON
  output: {
    style: 'bibtex'
  }
})

console.log(example.get())
// [{label: 'Miccadei2002Synergistic', type: 'article', properties: { ... }]

// Change default output options
example.options({
  type: 'string',
  style: 'bibtex'
})

console.log(example.get())
// @article{Miccadei2002Synergistic,
//   journal={Molecular Endocrinology},
//   doi={10.1210/MEND.16.4.0808},
//   number=4,
//   pmid=11923479,
//   title={{The Synergistic Activity of Thyroid Transcription Factor 1 and Pax 8 Relies on the Promoter/Enhancer Interplay}},
//   volume=16,
//   author={Miccadei, Stefania and De Leo, Rossana and Zammarchi, Enrico and Natali, Pier Giorgio and Civitareale, Donato},
//   pages={837--846},
//   date={2002-01-01},
//   year=2002,
//   month=1,
//   day=1,
// }
```

## Sorting Methods

  * `Cite#sort()`: Sort all entries on basis of their BibTeX label

This function sorts the entries, either by:

  1. a custom callback function {@link @Cite~sort}
  2. a list of CSL-JSON props to compare
  3. a label based on the last name of the first author, the year and the first non-noise word

```js
const example = new Cite([{id: 1}, {id: 2}])

console.log(example.data)
// [{id: 1}, {id: 2}]

example.sort(function (entryA, entryB) {
  return entryB.id - entryA.id
})

console.log(example.data)
// [{id: 2}, {id: 1}]

example.sort(['id'])

console.log(example.data)
// [{id: 1}, {id: 2}]
```

> Be carefull with the order of `entryA` and `entryB`; there seems to be something wrong with it

## Output Methods

> Read more on {@tutorial cite_output}

To format data in a `Cite` instance, you use the `Cite#format()` method. First, let's create the `Cite` instance itself:

```js
let example = new Cite('10.5281/zenodo.1005176')
```

Now, we can choose different {@tutorial output_formats output options} as a parameter to `Cite#format()`. For example, to get output in HTML in APA-style:

```js
> example.format('bibliography', {
    format: 'html',
    template: 'apa'
  })

< <div class="csl-bib-body">
    <div data-csl-entry-id="https://doi.org/10.5281/zenodo.1005176" class="csl-entry">Willighagen, L., &#38; Willighagen, E. (2017, October 9). Larsgw/Citation.Js V0.3.3. Zenodo. https://doi.org/10.5281/zenodo.1005176</div>
  </div>
```
