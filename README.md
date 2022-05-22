[![NPM version](https://img.shields.io/npm/v/citation-js.svg)](https://npmjs.org/package/citation-js)
[![NPM total downloads](https://img.shields.io/npm/dt/citation-js.svg)](https://npmcharts.com/compare/citation-js?minimal=true)
[![Build Status](https://travis-ci.org/larsgw/citation.js.svg?branch=master)](https://travis-ci.org/larsgw/citation.js)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Please use [citation-js/citation-js](https://github.com/citation-js/citation-js) if possible.

| [citation-js/citation-js](https://github.com/citation-js/citation-js) | replaces | [larsgw/citation.js](https://github.com/larsgw/citation.js) |
|---|---|---|
| This repository contains the npm package `@citation-js/core` and several other components. || This repository contains the npm package `citation-js` that wraps the aforementioned components for backwards compatibility. |

---

<!-- toc -->

- [Install](#install)
- [Getting Started](#getting-started)
- [CLI](#cli)
- [`Cite`](#cite)
  * [Async](#async)
- [Acknowledgements](#acknowledgements)

<!-- tocstop -->

# Install

On Node.js, install the package ([citation-js](https://npmjs.org/package/citation-js)) like this:

    npm install citation-js

To install the CLI as a global command, do this:

    npm install --global citation-js

Browser releases are available [here](https://github.com/larsgw/citation.js/tree/archive). These define `require` and add `citation-js` as a module.

```html
<script src="path/to/citation.js" type="text/javascript"></script>
<script>
  const Cite = require('citation-js')
</script>
```

# Getting Started

You can read a guide on how to get started, together with some tutorials and examples, [here](https://citation.js.org/api/tutorial-getting_started.html).

# CLI

> [More info](https://citation.js.org/api/tutorial-cli.html)

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
      -s, --output-style <option>     Output scheme. A combination of --output-format json and --output-style citation-* is considered invalid. Options: csl (Citation Style Lanugage JSON), bibtex, citation-* (where * is any formatting style)
      -l, --output-language <option>  Output language. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes

# `Cite`

> [More info](https://citation.js.org/api/tutorial-cite_.html)

To use the [`Cite`](#cite) constructor, `require()` the module like this:

```js
const Cite = require('citation-js')
```

For example, to get the bibliographical data of the Wikidata item [`wd:Q21972834`](https://wikidata.org/wiki/Q21972834), and then format it in HTML, English and APA:

```js
let example = new Cite('Q21972834')

let output = example.format('bibliography', {
  format: 'html',
  template: 'apa',
  lang: 'en-US'
})

console.log(output)
```

To test this code, go to [RunKit](https://runkit.com/larsgw/591b5651bd9b40001113931c).

## Async

Use the async API (recommended for Wikidata, URL, and DOI input) like this:

```js
let example = await Cite.async('Q21972834')

let output = example.format('bibliography', {
  format: 'html',
  template: 'apa',
  lang: 'en-US'
})

console.log(output)
```

> `Cite.async()` also supports options as the second argument, and a callback function as last argument.
