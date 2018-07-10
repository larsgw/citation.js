> Note that `Cite#get()` is deprecated. Use {@tutorial cite_output `Cite#format()`}

`Cite#get()` can be used like this:

```js
let cite = new Cite('10.5281/zenodo.1005176')

// CSL-JSON
cite.get() // {title: 'Citation.js', ...}
cite.get({format: 'real', type: 'json', style: 'csl'})

// Bibliography
```

Output options can be set in three different ways: the default output options for a given instance of `Cite` can be set in the second argument to the constructor or by changing them with `Cite#options()`; and the non-default options can be set as an argument in `Cite#get()`. Non-default options take priority over the default ones.

Here are the output options.

| Option    | Description                                          |
|-----------|------------------------------------------------------|
| `format`  | Output format (datatype)                             |
| `type`    | Output type (media type)                             |
| `style`   | Output style (structure)                             |
| `lang`    | Output language                                      |
| `prepend` | String or callback function to prepend to each entry |
| `append`  | String or callback function to append to each entry  |

## `format`

| Value    | Description                                                                        |
|----------|------------------------------------------------------------------------------------|
| `real`*  | Actual JSON Object, HTML DOM Element (if possible, else string anyway) or a string |
| `string` | String representation of JSON/HTML/String (doesn't do much in the last example)    |

_*: default_

## `type`

| Value    | Description          |
|----------|----------------------|
| `json`*  | Output as JSON       |
| `html`   | Output as HTML       |
| `string` | Output as plain text |

_*: default_

## `style`

| Value        | Description                                                                      |
|--------------|----------------------------------------------------------------------------------|
| `csl`*       | Outputs CSL-JSON data                                                            |
| `bibtex`     | Outputs a BibTeX string, or BibTeX-JSON if `type: "json"`                        |
| `bibtxt`     | Outputs a Bib.TXT string, or BibTeX-JSON if `type: "json"`                       |
| `citation-*` | Formatted citation, formatted with citeproc-js, where `*` is a CSL Template name |

_*: default_

## `prepend` and `append`

> Functionality only available when using `citation-*` styles

The value passed to the append/prepend options is either

  1. a constant string or
  2. a callback taking a parameter `entry`, a CSL-JSON object, and returning HTML or plain text

that should either be appended or prepended to the corresponding entry in the outputted bibliography. Example:

```js
const Cite = require('citation-js')
const data = new Cite('Q30000000')

const date = (new Date()).toLocaleDateString()

data.get({
  type: 'html',
  style: 'citation-apa',
  prepend ({id}) {
    return `[${id}]: `
  },
  append: ` [Retreived on ${date}]`
})
```

Or in older JavaScript:

```js
var Cite = require('citation-js')
var data = new Cite('Q30000000')

var date = (new Date()).toLocaleDateString()

data.get({
  type: 'html',
  style: 'citation-apa',
  prepend: function (entry) {
    return '[' + entry.id + ']: '
  },
  append: ' [Retrieved on ' + date + ']'
})
```

This prepends `[$ID]: ` to each entry, where `$ID` is the ID of that entry, and appends ` [Retrieved on $DATE]`, where `$DATE` is today (constant for all entries).

## CSL Templates

Currently, the following CSL Templates are built-in in Citation.js:

  * `apa` (default)
  * `vancouver`
  * `harvard1`

For different templates, see CSL Template Plugins.

## CSL Locales

Currently, the following CSL Locales are built-in in Citation.js:

  * `en-US` (default)
  * `es-ES`
  * `de-DE`
  * `fr-FR`
  * `nl-NL`

For different locales, see CSL Locale Plugins.

## Limitations

In the future, output options will get a rework. Most importantly, it will be possible to register output plugins. When that is possible, `style` will be the plugin identifier, and `format`, `type`, and other options can be used to customise the output.

Currently, there are a lot of problems: for example, `style: 'citation-*'` is incompatible with `type: 'json'`; the same `style: 'citation-*'` is a dynamic name holding a different output option, which should just be a separate property; the CSL Enginge has a lot more options than the ones covered here; `prepend` and `append` are `citation-*`-only; and when `type: 'string'`, the format is a bit redundant.

Also, the output option names are bad and probably confusing.
