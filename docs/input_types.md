Below is a list of built-in input types.

## DOI

  * `api/doi`: URL in the form of `http[s]://doi.org/$DOI` where `$DOI` is the [DOI](https://www.doi.org/)
  * `string/doi`: A DOI surrounded by whitespace
  * `list/doi`: A whitespace-separated list of DOIs
  * `array/doi`: An array of strings of type `string/doi`
  * There's no `url/doi`, because that's equivalent to `api/doi` through [DOI Content Negotiation](https://citation.crosscite.org/docs.html)
  * There's no `object/doi`, because the API output is CSL-JSON (it currently does need some minor changes, see [CrossRef/rest-api-doc#222](https://github.com/CrossRef/rest-api-doc/issues/222)).

## Wikidata

  * `url/wikidata`: URL with [Wikidata](https://www.wikidata.org/) [Entity ID](https://www.wikidata.org/wiki/Wikidata:Glossary#Entities.2C_items.2C_properties_and_queries). Gets and parses the entity data
  * `list/wikidata`: List of Wikidata Entity IDs, separated by spaces, newlines or commas. Gets and parses the entity data
  * `string/wikidata`: Single Wikidata Entity ID. Gets and parses the entity data
  * `array/wikidata`: Array of strings of type `string/wikidata`
  * `api/wikidata`: Wikidata API URL. Gets and parses the entity data
  * `object/wikidata`: Wikidata Entity data. Parses the entity data

## BibTeX

  * `string/bibtex`: [BibTeX](http://www.bibtex.org/) string. Parses the data
  * `object/bibtex`: BibTeX JSON. Nothing special, or standardised. Parses the data
  * `string/bibtxt`: [Bib.TXT](http://bibtxt.github.io) string. Parses the data

## BibJSON

  * `object/contentmine`: Actually BibJSON, all references to ContentMine will be removed when the parser is fully done. Parses the data

## CSL-JSON

  * `object/csl`: [CSL-JSON](https://github.com/citation-style-language/schema#csl-json-schema). Adds the data
  * `array/csl`: Array of CSL-JSON. Adds the data

## Other
These formats are not input-ready, but are rather parsed and re-evaluated, e.g. `html/else` (DOM element) to `string/json` to `json/csl`.

  * `string/json`: JSON or JavaScript Object string. Parses and re-evaluates the data
  * `jquery/else`: jQuery element. Fetches and re-evaluates the contents
  * `html/else`: HTML DOM element. Fetches and re-evaluates the contents
  * `url/else`: URL. Fetches and re-evaluates the file
  * `array/else`: JavaScript array. Re-evaluates every element in the array
