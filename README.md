<p align="center"><img alt="Citation.js" src="https://citation.js.org/static/img/square_logo_medium.png" /></p>

Citation.js converts formats like BibTeX, Wikidata JSON and ContentMine JSON to CSL-JSON to convert to other formats like APA, Vancouver and back to BibTeX.

[![NPM version](https://img.shields.io/npm/v/citation-js.svg)](https://www.npmjs.org/citation-js)
[![NPM total downloads](https://img.shields.io/npm/dt/citation-js.svg)](https://npmjs.org/citation-js)
[![Build Status](https://travis-ci.org/larsgw/citation.js.svg?branch=master)](https://travis-ci.org/larsgw/citation.js)
[![Dependency Status](https://david-dm.org/larsgw/citation.js/status.svg)](https://david-dm.org/larsgw/citation.js)
[![codecov](https://codecov.io/gh/larsgw/citation.js/branch/master/graph/badge.svg)](https://codecov.io/gh/larsgw/citation.js)
[![license](https://img.shields.io/github/license/larsgw/citation.js.svg)](https://github.com/larsgw/citation.js/blob/master/LICENSE.md)

---

Thanks to JS.ORG for providing the citation.js.org domain:

[![JS.ORG](https://logo.js.org/dark_tiny.png)](https://js.org)

---

##### Table of Contents

* [Get Started](#starting)
  * [Install](#install)
    * [Node.js](#starting.install.node)
      * [CLI](#starting.install.node.cli)
    * [Browser](#starting.install.browser)
  * [Example](#starting.example)
* [Use](#use)
  * [Cite](#cite)
    * [Input](#cite.in)
      * [Input types](#cite.in.type)
      * [Options](#cite.in.options)
    * [Ouput](#cite.out)
      * [Options](#cite.out.options)
      * [Format](#cite.out.format)
      * [Type](#cite.out.type)
      * [Style](#cite.out.style)
      * [CSL Templates](#cite.out.templates)
      * [CSL Locales](#cite.out.locales)
      * [Append/Prepend](#cite.out.wrap)
    * [Misc](#cite.misc)
      * [Iterator](#cite.misc.iterator)
  * [Internal functions](#internal)
  * [Async](#async)
* [More](#more)
  * [More Docs](#more.docs)
  * [Demo](#more.demo)
    * [NPM Demo](#more.demo.npm)
    * [Browser Demos](#more.demo.browser)

# <a id="starting" href="#starting">Get Started</a>

## <a id="starting.install" href="#starting.install">Install</a>

### <a id="starting.install.node" href="#starting.install.node">Node.js</a>

Install the package ([citation-js](https://npmjs.org/package/citation-js)) like this:

    npm install citation-js
    
    OR
    
    npm i citation-js

To use the [`Cite`](#cite) constructor, `require()` the module like this:

```js
const Cite = require('citation-js')
```

### <a id="starting.install.node.cli" href="#starting.install.node.cli">CLI</a>

To install the CLI, do this:

    npm install --global citation-js
    
    OR
    
    npm i -g citation-js

Run the CLI like this:

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

### <a id="starting.install.browser" href="#starting.install.browser">Browser</a>

Download [citation.js](https://github.com/larsgw/citation.js/tree/archive)
([citation.min.js](https://github.com/larsgw/citation.js/tree/archive)),
include it in you page, and you can `require('citation-js')` to get the [`Cite`](#cite) contructor.

```html
<script src="path/to/citation.js" type="text/javascript"></script>
<script>
  const Cite = require('citation.js')
</script>
```

## <a id="starting.example" href="#starting.example">Example</a>

```js
const Cite = require('citation-js')
 
const data = new Cite('Q21972834')

const output = data.get({
  format: 'string',
  type: 'html',
  style: 'citation-apa',
  lang: 'en-US'
})

console.log(output)
```

To test this code, go to [RunKit](https://runkit.com/larsgw/591b5651bd9b40001113931c).

# <a id="use" href="#use">Use</a>

## <a id="cite" href="#cite">Cite</a>

Use the object constructor `Cite()` to parse input and get output.

### <a id="cite.in" href="#cite.in">Input</a>

Make a `Cite` object like this:

```js
var example = new Cite( <data>, <options> )
```

  1. In the first parameter you pass the input data. [Input types](#cite.in.type)
  2. In the second parameter you pass the [options](#cite.in.options).

#### <a id="cite.in.options" href="#cite.in.options">Options</a>

  * `output`: Default [output options](#cite.out.options), used when calling `Cite#get()`.
  * `maxChainLength`: Max number of parsing iterations (before giving up). Default: 10.
  * `generateGraph`: Generate a parsing chain graph. Holds info on how an entry was parsed. Default: true.
  * `forceType`: Force parsing as a certain [type](#cite.in.type), if the type checking methods fail (or are slow, and you already know what the input type is, etc.).

#### <a id="cite.in.type" href="#cite.in.type">Input types</a>
Input type doesn't have to be specified. The identifiers below are used by internal functions.

##### <a id="cite.in.type.doi" href="#cite.in.type.doi">DOI</a>

  * `api/doi`: URL in the form of `http[s]://doi.org/$DOI` where `$DOI` is the [DOI](https://www.doi.org/)
  * `string/doi`: A DOI surrounded by whitespace
  * `list/doi`: A whitespace-separated list of DOIs
  * `array/doi`: An array of strings of type `string/doi`
  * There's no `url/doi`, because that's equivalent to `api/doi` through [DOI Content Negotiation](https://citation.crosscite.org/docs.html)
  * There's no `object/doi`, because the API output is CSL-JSON (it currently does need some minor changes, see [CrossRef/rest-api-doc#222](https://github.com/CrossRef/rest-api-doc/issues/222)).

##### <a id="cite.in.type.wikidata" href="#cite.in.type.wikidata">Wikidata</a>

  * `url/wikidata`: URL with [Wikidata](https://www.wikidata.org/) [Entity ID](https://www.wikidata.org/wiki/Wikidata:Glossary#Entities.2C_items.2C_properties_and_queries). Gets and parses the entity data
  * `list/wikidata`: List of Wikidata Entity IDs, separated by spaces, newlines or commas. Gets and parses the entity data
  * `string/wikidata`: Single Wikidata Entity ID. Gets and parses the entity data
  * `array/wikidata`: Array of strings of type `string/wikidata`
  * `api/wikidata`: Wikidata API URL. Gets and parses the entity data
  * `object/wikidata`: Wikidata Entity data. Parses the entity data

##### <a id="cite.in.type.bibtex" href="#cite.in.type.bibtex">BibTeX</a>

  * `string/bibtex`: [BibTeX](http://www.bibtex.org/) string. Parses the data
  * `object/bibtex`: BibTeX JSON. Nothing special, or standardised. Parses the data
  * `string/bibtxt`: [Bib.TXT](http://bibtxt.github.io) string. Parses the data

##### <a id="cite.in.type.bibjson" href="#cite.in.type.bibjson">BibJSON</a>

  * `object/contentmine`: Actually BibJSON, all references to ContentMine will be removed when the parser is fully done. Parses the data

##### <a id="cite.in.type.csl" href="#cite.in.type.csl">CSL-JSON</a>

  * `object/csl`: [CSL-JSON](https://github.com/citation-style-language/schema#csl-json-schema). Adds the data
  * `array/csl`: Array of CSL-JSON. Adds the data

##### <a id="cite.in.type.inter" href="#cite.in.type.inter">Intermediary formats</a>
These formats are not input-ready, but are rather parsed and re-evaluated, e.g. `html/else` (DOM element) to `string/json` to `json/csl`.

  * `string/json`: JSON or JavaScript Object string. Parses and re-evaluates the data
  * `jquery/else`: jQuery element. Fetches and re-evaluates the contents
  * `html/else`: HTML DOM element. Fetches and re-evaluates the contents
  * `url/else`: URL. Fetches and re-evaluates the file
  * `array/else`: JavaScript array. Re-evaluates every element in the array

### <a id="cite.out" href="#cite.out">Ouput</a>

When using the `Cite#get()` function, your output depends on the options you pass. If you don't pass any options, the values you passed as default are used. When you didn't pass default options, standard options are passed.

#### <a id="cite.out.options" href="#cite.out.options">Options</a>

  * `format`: The output format: `"real"` (default) or `"string"`
  * `type`: The output type. See [Type](#cite.out.type)
  * `style`: The output style. See [Style](#cite.out.style)
  * `lang`: The language of the output. See [Locales](#cite.out.locales)
  * `prepend`: Function taking source CSL-JSON as input or constant string to prepend to each element
  * `append`: Same, but appending

#### <a id="cite.out.format" href="#cite.out.format">Format</a>

  * `string`: String representation of JSON/HTML/String (doesn't do much in the last example)
  * `real` (default): Actual JSON Object, HTML DOM Element (if possible, else string anyway) or a string

#### <a id="cite.out.type" href="#cite.out.type">Type</a>

  * `json` (default): Output as JSON. Not possible together with `style: 'citation-*'`
  * `html`: Output as HTML
  * `string`: Output as string

#### <a id="cite.out.style" href="#cite.out.style">Style</a>

  * `csl` (default): Outputs raw CSL-JSON data
  * `bibtex`: Outputs a BibTeX string, or BibTeX-JSON if `type: "json"`
  * `bibtxt`: Outputs a Bib.TXT string, or BibTeX-JSON if `type: "json"`
  * `citation-*`: Formatted citation, formatted with citeproc-js. `*` is a [CSL Template](#cite.out.templates) name

#### <a id="cite.out.wrap" href="#cite.out.wrap">Append/Prepend</a>

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

**Functionality only available when using `citation-*` styles**

#### <a id="cite.out.templates" href="#cite.out.templates">CSL Templates</a>

Currently, the following CSL Templates are built-in in Citation.js:

  * `apa` (default)
  * `vancouver`
  * `harvard1`

Different [CSL Templates](https://github.com/citation-style-language/styles) can be registered like this:

```js
var templateName = 'custom'
var template = '<?xml version="1.0" encoding="utf-8"?><style ...>...</style>' // The actual XML file

Cite.CSL.register.addTemplate(templateName, template)

var data = new Cite(...)
data.get({
  format: 'string',
  type: 'html',
  style: 'citation-' + templateName,
  lang: 'en-US'
})
```

Replace `templateName` with the template name you want to use.

#### <a id="cite.out.locales" href="#cite.out.locales">CSL Locales</a>

Currently, the following CSL Locales are built-in in Citation.js:

  * `en-US` (default)
  * `es-ES`
  * `de-DE`
  * `fr-FR`
  * `nl-NL`

Different [CSL Locales](https://github.com/citation-style-language/locales) can be registered like this:

```js
var language = 'en-GB'
var locale = '<?xml version="1.0" encoding="utf-8"?><locale ...>...</locale>' // The actual XML file

Cite.CSL.register.addLocale(language, locale)

var data = new Cite(...)
data.get({
  format: 'string',
  type: 'html',
  style: 'citation-apa',
  lang: language
})
```
### <a id="cite.misc" href="#cite.misc">Misc</a>

`Cite` instances have some more functions:

  * `Cite#options(<options>)`: Change default options
  * `Cite#set(<data>)`: Replace all data with new data
  * `Cite#add(<data>)`: Add data
  * `Cite#reset()`: Remove all data and options
  * `Cite#currentVersion()`: Get current version number
  * `Cite#retrieveVersion(<version number>)`: Retrieve a certain version of the object
  * `Cite#retrieveLastVersion()`: Retrieve the last saved version of the object
  * `Cite#undo(<number>)`: Restore the n to last version (default: `1`)
  * `Cite#save()`: Save the current object
  * `Cite#sort()`: Sort all entries on basis of their BibTeX label

`Cite#set()` and `Cite#get()` also have async variants (`Cite#setAsync()` and `Cite#addAsync()`), which return Promises.

#### <a id="cite.misc.iterator" href="#cite.misc.iterator">Iterator</a>

Every `Cite` instance is an Iterator, so you can loop over an instance with `for of`:

```js
const data = new Cite([{id: 1}, {id: 2}, {id: 3}])
const array = []

for (let item of data) {
  array.push(item.id)
}

array // [1, 2, 3]
```

## <a id="cite.internal" href="#cite.internal">Internal functions</a>

`Cite` holds most internal functions, too. These are documented [here](https://citation.js.org/api/global.html) and can be accessed like this:

Note that most `get*` functions expect CSL-JSON normalised with `Cite.parse.csl: [Function: parseCsl]`.

```js
{ [Function: Cite]
  async: [Function: async],
  get: 
   { bibtex: 
      { json: [Function: getBibTeXJSON],
        text: [Function: getBibTeX],
        label: [Function: getBibTeXLabel],
        type: [Function: fetchBibTeXType] },
     bibtxt: [Function: getBibTxt],
     dict: 
      { htmlDict: [Object],
        textDict: [Object] },
     json: [Function: getJSON],
     date: [Function: getDate],
     name: [Function: getName],
     label: [Function: getLabel] },
  CSL: 
   { style: [Function: fetchCSLStyle],
     locale: [Function: fetchCSLLocale],
     engine: [Function: fetchCSLEngine],
     item: [Function: fetchCSLItemCallback],
     register: 
      { addTemplate: [Function: addTemplate],
        addLocale: [Function: addLocale],
        getTemplate: [Function: getTemplate],
        getLocale: [Function: getLocale],
        hasTemplate: [Function: hasTemplate],
        hasLocale: [Function: hasLocale] } },
  parse: 
   { input: 
      { type: [Function: parseInputType],
        data: [Function: parseInputData],
        chain: [Function: parseInput],
        chainLink: [Function: parseInputChainLink],
        async: 
         { data: [Function: parseInputDataAsync],
           chain: [Function: parseInputAsync],
           chainLink: [Function: parseInputChainLinkAsync] } },
     wikidata: 
      { list: [Function: parseWikidata],
        json: [Function: parseWikidataJSON],
        prop: [Function: parseWikidataProp],
        type: [Function: fetchWikidataType],
        async: 
         { json: [Function: parseWikidataJSONAsync],
           prop: [Function: parseWikidataPropAsync] } },
     bibtex: 
      { json: [Function: parseBibTeXJSON],
        text: [Function: parseBibTeX],
        prop: [Function: parseBibTeXProp],
        type: [Function: parseBibTeXType] },
     bibtxt: 
      { text: [Function: parseBibTxt],
        textEntry: [Function: parseBibTxtEntry] },
     bibjson: [Function: parseContentMine],
     doi: 
      { id: [Function: parseDoi],
        api: [Function: parseDoiApi],
        async: { api: [Function: parseDoiApiAsync] } },
     date: [Function: parseDate],
     name: [Function: parseName],
     json: [Function: parseJSON],
     csl: [Function: parseCsl] },
  util: 
   { attr: 
      { getAttributedEntry: [Function: getAttributedEntry],
        getPrefixedEntry: [Function: getPrefixedEntry],
        getWrappedEntry: [Function: getWrappedEntry] },
     deepCopy: [Function: deepCopy],
     fetchFile: [Function: fetchFile],
     fetchFileAsync: [Function: fetchFileAsync],
     fetchId: [Function: fetchId],
     TokenStack: [Function: TokenStack] },
  version: { cite: '0.3.0-14', citeproc: '1.1.169' },
  normalise: [Function: parseInput],
  normaliseAsync: [Function: parseInputAsync] }
```

## <a id="async" href="#async">Async</a>

Use the async API (recommended for Wikidata, URL, and DOI input) like this (with callback):

```js
Cite.async(<DATA>, <OPTIONS>, function (data) {
  data // instance of Cite
  
  // Further manipulations...
  console.log(data.get())
})
```

Or with a promise, like this:

```js
Cite.async(<DATA>, <OPTIONS>).then(function (data) {
  data // instance of Cite
  
  // Further manipulations...
  console.log(data.get())
})
```

Where `<DATA>` is the input data and `<OPTIONS>` is the input options. `<OPTIONS>` is optional in both examples.

# <a id="more" href="#more">More</a>

## <a id="more.docs" href="#more.docs">More Docs</a>

Further explanation can be found [here](https://citation.js.org/api/).

## <a id="more.demo" href="#more.demo">Demo</a>

### <a id="more.demo.npm" href="#more.demo.npm">NPM Demo</a>

[NPM Demo](https://runkit.com/npm/citation-js). Example code:

```js
var Cite = require('citation-js')

var data = new Cite('Q21972834')

data.get({
  format: 'string',
  type: 'html',
  style: 'citation-apa',
  lang: 'en-US'
})

// Should implicitly display
```

### <a id="more.demo.browser" href="#more.demo.browser">Browser Demos</a>

* [Normal demo](https://citation.js.org/demo/)
* [Bib.TXT demo](https://citation.js.org/demo/bibtxt.html)
