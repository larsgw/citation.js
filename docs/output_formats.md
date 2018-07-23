Here are the output formats supported natively in Citation.js.

| Plugin | Description |
|--------|-------------|
| bibtex | BibTeX      |
| bibtxt | Bib.TXT     |
| bibliography | CSL Bibliography |
| citation | CSL Citation |
| ris    | RIS         |
| label  | `authorTitleYear` |
| data   | JSON        |

## Options

For references to dictionaries, see {@tutorial output_plugins_dict}.

### BibTeX & Bib.TXT

| Option | Description |
|--------|-------------|
| `format` | Output format: `object` (JS object), or any dictionary |
| `type` | Alias of `format` |

### Bibliography & Citation

Bibliography and citation formatting is done by the [citeproc-js](https://github.com/Juris-M/citeproc-js/) engine, currently maintained by Frank Bennett.

| Option | Description |
|--------|-------------|
| `format` | Output format: `object` (JS object), or any dictionary |
| `template`* | CSL Template (default: `apa`) |
| `lang`* | CSL Locale (default: `en-US`) |
| `entry`^ | Control which entries are outputted |
| `prepend`§ | Add arbitrary content to the start of each entry |
| `append`§ | Add arbitrary content to the end of each entry |
| `nosort`§ | Don't sort according to the template-dependent guidelines |

_* Add your own with {@tutorial output_plugins_csl}_
_^ Only for the `citation` format at the moment_
_§ Only for the `bibliography` format at the moment_

#### `entry`

Here's an example for `entry`:

```js
let cite = new Cite([
  {id: 'a', title: 'Item A', issued: {'date-parts': [[2016]]}},
  {id: 'b', title: 'Item B', issued: {'date-parts': [[2017]]}},
  {id: 'c', title: 'Item C', issued: {'date-parts': [[2018]]}}
])

cite.format('citation')
// '(“Item A,” 2016; “Item B,” 2017; “Item C,” 2018)'

cite.format('citation', {entry: ['a', 'b']})
// '(“Item A,” 2016; “Item B,” 2017)'

cite.format('citation', {entry: 'a'})
// '(“Item A,” 2016)'
```

#### `prepend` and `append`

Here's an example for `prepend` and `append`:

```js
let cite = new Cite({id: 'a', title: 'Item A'})

cite.format('bibliography', {append: ' [foobar]'})
// 'Item A. (n.d.). [foobar]\n'

cite.format('bibliography', {prepend (entry) { return `${entry.id}: ` }})
// 'a: Item A. (n.d.).\n'
```

And here's another example, possibly more realistic:

```js
let cite = new Cite('Q30000000')

let date = (new Date()).toLocaleDateString()

cite.format('bibliography', {
  format: 'html',
  template: 'apa',
  prepend (entry) {
    return `[${entry.id}]: `
  },
  append: ` [Retrieved on ${date}]`
})

// `<div class="csl-bib-body">
//   <div data-csl-entry-id="Q30000000" class="csl-entry">
//     [Q30000000]: Miccadei, S., De Leo, R., Zammarchi, E., Natali, P. G., &#38; Civitareale, D. (2002). The Synergistic Activity of Thyroid Transcription Factor 1 and Pax 8 Relies on the Promoter/Enhancer Interplay. <i>Molecular Endocrinology</i>, <i>16</i>(4), 837–846. https://doi.org/10.1210/MEND.16.4.0808 [Retrieved on 2018-7-10]
//   </div>
// </div>`
```

This prepends `[$ID]: ` to each entry, where `$ID` is the ID of that entry, and appends ` [Retrieved on $DATE]`, where `$DATE` is today (constant for all entries).

#### CSL Templates

Currently, the following CSL Templates are built-in in Citation.js:

  * `apa` (default)
  * `vancouver`
  * `harvard1`

For different templates, see {@tutorial output_plugins_csl}.

#### CSL Locales

Currently, the following CSL Locales are built-in in Citation.js:

  * `en-US` (default)
  * `es-ES`
  * `de-DE`
  * `fr-FR`
  * `nl-NL`

For different locales, see {@tutorial output_plugins_csl}.

### RIS

| Option | Description |
|--------|-------------|
| `format` | Output format: `object` (JS object) or plain text |
| `type` | Alias of `format` |

### Label

No options.

### JSON

| Option | Description |
|--------|-------------|
| `format` | Output format: `object` (JS object), or any dictionary |
| `type` | Alias of `format` |
