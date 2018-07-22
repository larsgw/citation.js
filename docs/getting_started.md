Here's a small guide to get you started with Citation.js.

<!-- toc -->

## Install

On Node.js, install the package ([citation-js](https://npmjs.org/package/citation-js)) like this:

    npm install citation-js

To install the CLI as a global command, do this:

    npm install --global citation-js

## Browser Releases

Browser release guides are available [here](https://github.com/larsgw/citation.js/tree/archive). In short, since `v0.4.0-7`, releases are available through the NPM module, and can be included and/or downloaded like this:

    # Specific version
    https://cdn.jsdelivr.net/npm/citation-js@0.4.0-7
    
    # Latest version (not recommended for prod)
    https://cdn.jsdelivr.net/npm/citation-js
    
    # Unminified
    https://cdn.jsdelivr.net/npm/citation-js@0.4.0-7/build/citation.js

These define `require` and add `citation-js` as a module.

```html
<script src="url/to/citation.js" type="text/javascript"></script>
<script>
  const Cite = require('citation-js')
</script>
```

### Older versions

Most older versions (at least up to `v0.3.4`) are available like this:

    https://cdn.rawgit.com/larsgw/citation.js/archive/citation.js/citation-0.3.4.min.js
    
    # Unminified
    https://cdn.rawgit.com/larsgw/citation.js/archive/citation.js/citation-0.3.4.js

> Note that
> * all GitHub builds before version `0.4.0-0` [don't work in IE](https://github.com/larsgw/citation.js/issues/87)
> * the bundle.run builds don't transpile dependencies, so don't work in IE either

## CLI

> Read more on the {@tutorial cli}

An example on how to run the CLI:

    $ citation-js -t Q30000000 -f html -s citation-apa

This prints a HTML document containing [wd:Q30000000](https://wikidata.org/wiki/Q30000000) formatted as an APA-styled bibliographic entry.

## `Cite`

> Read more on {@tutorial cite}

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
