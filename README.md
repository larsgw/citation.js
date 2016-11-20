# Citation.js

Citation.js converts formats like BibTeX, Wikidata JSON and ContentMine JSON to CSL-JSON to convert to other formats like APA, Vancouver and back to BibTeX.

Generate docs with `jsdoc ./ README.md -r -c docs/conf.json -d docs/api/`.

[![NPM version](https://img.shields.io/npm/v/citation-js.svg)](https://www.npmjs.org/package/citation-js)
[![Build Status](https://travis-ci.org/larsgw/citation.js.svg?branch=master)](https://travis-ci.org/larsgw/citation.js)

# Use

## Node.js ([citation-js](https://www.npmjs.org/package/citation-js))

Install the package like this:

    npm install -g citation-js

To run the program, use

    citation-js  [options]

    Options:

      -h, --help                      output usage information
      -V, --version                   output the version number
      
      -i, --input <path>              Input file
      -u, --url <url>                 Input url
      -t, --text <string>             Input text
      
      -o, --output <path>             Output file (omit file extension)
      
      -R, --output-non-real           Do not output the file in its mime type, but as a string
      -f, --output-type <option>      Output structure type: string, html, json
      -s, --output-style <option>     Ouput scheme. A combination of --output-format json and --output-style citation-* is considered invalid. Options: csl (Citation Style Lanugage JSON), bibtex, citation-* (where * is any formatting style)
      -l, --output-language <option>  Output language. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes

To use the [`Cite`](#Cite) constructor, `require()` the module like this:

```js
var Cite = require('citation-js')
```

### Dependencies

* commander
* striptags
* wikidata-sdk
* citeproc-js (included automatically)

## Browser

With the following code, the [`Cite`](#Cite) contructor is available.

```html
<script src="path/to/citation-0.2.js" type="text/javascript"></script>
```

### Dependencies

* citeproc-js (included in the [src/](https://github.com/larsgw/citation.js/tree/master/src) folder)  
Include like `<script src="path/to/citeproc.js" type="text/javascript"></script>`

<a name="Cite">
## Cite
</a>

Use the object constructor `Cite()` to parse input and get output.

<a name="input">
### Input
</a>

Make a `Cite` object like this:

```js
var example = new Cite( <data>, <options> )
```

1. In the first parameter you pass the input data. [Input types](#input_type)
2. In the second parameter you pass the settings. It contains the following properties. These are the default options for using `.get()`
  1. `format`: The output format: `"real"` (default) or `"string"`
  2. `type`: The output type: `"html"`, `"string"` or `"json"` (default).
  3. `style`: The output style. See [Output](#output). `"csl"` is default
  4. `lang`: The language of the output. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes. Currently supported: `"en-US"` (default), `"fr-FR"`, `"es-ES"` ,`"de-DE"` and `"nl-NL"`

<a name="input_type">
#### Input types
</a>

* `url/wikidata`: URL with [Wikidata](https://www.wikidata.org/) [Entity ID](https://www.wikidata.org/wiki/Wikidata:Glossary#Entities.2C_items.2C_properties_and_queries). Gets and parses the entity data
* `list/wikidata`: List of Wikidata Entity IDs, separated by spaces, newlines or commas. Gets and parses the entity data
* `json/wikidata`: Wikidata Entity data. Parses the data
* `json/contentmine`: [ContentMine](http://contentmine.org/) data, as outputted by [quickscrape](https://github.com/ContentMine/quickscrape). Parses the data
* `json/csl`: [CSL-JSON](https://github.com/citation-style-language/schema#csl-json-schema). Adds the data
* `string/json`: JSON or JavaScript Object string. Parses and re-evaluates the data
* `string/bibtex`: [BibTeX](http://www.bibtex.org/) string. Parses the data
* `jquery/else`: jQuery element. Fetches and re-evaluates the contents
* `html/else`: HTML DOM element. Fetches and re-evaluates the contents
* `url/else`: URL. Fetches and re-evaluates the file
* `list/else`: JavaScript array. Re-evaluates every element in the array

<a name="output">
### Ouput
</a>

When using the `.get()` function, your output depends on the options you pass. If you don't pass any options, the values you passed as default are used. When you didn't pass default options, standard options are passed.

#### Type

* `json`: Output as JSON. Not possible together with `style:"citation-*"`
* `html`: Output as HTML
* `string`: Output as string

#### Style

* `csl`: Outputs raw CSL-JSON data
* `bibtex`: Outputs a BibTeX string, or BibTeX-JSON if `type: "json"`
* `citation-*`: Formatted citation, formatted with citeproc-js. `*` is a [CSL Template](#csl_templates) name.

<a name="csl_templates">
#### CSL Templates
</a>

Currently, the following CSL Templates are suppported in Citation.js.

* `apa`
* `vancouver`
* `harvard1`

Different [CSL Templates](https://github.com/citation-style-language/styles) can be used by passing an XML string to `.get()` with the option `template:<string>`. E.g.

```js
var data = new Cite(...)

data.get({
  format: 'string',
  type: 'html',
  style: 'citation',
  lang: 'en-US',
  
  template: '...' // XML String
})
```

Currently, you need to pass `"citation"` to the `style` option for this to work.

#### CSL Locales

If you want different languages than the standard, you can pass a [CSL Locale](https://github.com/citation-style-language/locales) as an XML string to `.get()` with the option `locale:<string>`. E.g.

```js
var data = new Cite(...)

data.get({
  format: 'string',
  type: 'html',
  style: 'citation-apa',
  
  locale: '...' // XML String
})
```

### Misc

`Cite` has some more functions:

* `.options(<options>)`: Change default options
* `.set(<data>)`: Replace all data with new data
* `.add(<data>)`: Add data
* `.reset()`: Remove all data
* `.currentVersion()`: Get current version number
* `.undo()`: Restore previous version
* `.retrieveVersion(<version number>)`: Retrieve a certain version of the object
* `.sort()`: Sort all entries on basis of their BibTeX label

# More

## More Docs
Further explanation can be found [here](https://larsgw.github.io/citation.js/api/). The explanation of the jQuery plugin can be found there too.

## Demo

### NPM Demo

[NPM Demo](https://runkit.com/npm/citation-js). Example code:

```js
var Cite = require( 'citation-js' )

var data = new Cite( 'Q21972834', {
  format: 'string',
  type: 'html',
  style: 'citation-apa',
  lang: 'en-US'
} )

data.get() // Should implicitly display
```

### Browser Demos

* [Normal demo](https://larsgw.github.io/citation.js/demo/demo.html)
* [Demo including jQuery plugin](https://larsgw.github.io/citation.js/demo/jquery.html)