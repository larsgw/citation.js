Below is a list of built-in input types.

## DOI

  * `@doi/api`: URL in the form of `http[s]://doi.org/$DOI` where `$DOI` is the [DOI](https://www.doi.org/)
  * `@doi/id`: A DOI surrounded by whitespace
  * `@doi/list+text`: A whitespace-separated list of DOIs
  * `@doi/list+object`: An array of strings of type `@doi/id`
  * There's no `@doi/url`, because that's equivalent to `@doi/api` through [DOI Content Negotiation](https://citation.crosscite.org/docs.html)
  * There's no `@doi/object`, because the API output is CSL-JSON (it currently does need some minor changes, see [CrossRef/rest-api-doc#222](https://github.com/CrossRef/rest-api-doc/issues/222)).

## Wikidata

  * `@wikidata/url`: URL with [Wikidata](https://www.wikidata.org/) [Entity ID](https://www.wikidata.org/wiki/Wikidata:Glossary#Entities.2C_items.2C_properties_and_queries). Gets and parses the entity data
  * `@wikidata/list+text`: List of Wikidata Entity IDs, separated by spaces, newlines or commas. Gets and parses the entity data
  * `@wikidata/id`: Single Wikidata Entity ID. Gets and parses the entity data
  * `@wikidata/list+object`: Array of strings of type `@wikidata/id`
  * `@wikidata/api`: Wikidata API URL. Gets and parses the entity data
  * `@wikidata/object`: Wikidata Entity data. Parses the entity data

## BibTeX

  * `@bibtex/text`: [BibTeX](http://www.bibtex.org/) string. Parses the data
  * `@bibtex/object`: BibTeX JSON. A (non-standard) JSON represenation of BibTeX, and Bib.TXT for that matter. Parses the data
  * `@bibtxt/text`: [Bib.TXT](http://bibtxt.github.io) string. Parses the data

## BibJSON

  * `@bibjson/record+object`: [BibJSON](http://okfnlabs.org/bibjson/) object. Parses the data
  * `@bibjson/quickscrape+record+object`: BibJSON object with some [quickscrape](https://github.com/ContentMine/quickscrape) customisation. Parses the data
  * `@bibjson/collection+object`: BibJSON object, with a list of records and some collection metadata. Parses the data

## CSL-JSON

  * `object/csl`: [CSL-JSON](https://github.com/citation-style-language/schema#csl-json-schema). Adds the data
  * `array/csl`: Array of CSL-JSON. Adds the data

## Other
These formats are not input-ready, but are rather parsed and re-evaluated, e.g. `@else/html` (DOM element) to `@else/json` to `@csl/object`.

  * `@else/json`: JSON or JavaScript Object string. Parses and re-evaluates the data
  * `@else/jquery`: jQuery element. Fetches and re-evaluates the contents
  * `@else/html`: HTML DOM element. Fetches and re-evaluates the contents
  * `@else/url`: URL. Fetches and re-evaluates the file
  * `@empty/text`: Empty string.
  * `@empty/whitespace+text`: String with only whitespace
  * `@empty`: `null` or `undefined`

## *Really* built-in
These formats are defined inside the parser engine, and need to be. They have a special role in parsing.

  * `@csl/list+object`: Array of CSL-JSON. End product
  * `@csl/object`: CSL-JSON. Wraps object in array.
  * `@else/list+object`: JavaScript array. Re-evaluates every element in the array
  * `@invalid`: Any format that is not recognized.
