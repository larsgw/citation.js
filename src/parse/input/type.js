/* global jQuery, HTMLElement */

import varRegex from '../regex'
import {add, type} from '../register'

const stringTypes = {
  // Empty
  '@empty/text': input => input === '',
  // Only whitespace
  '@empty/whitespace+text': /^\s+$/,
  // DOI API URL
  '@doi/api': varRegex.doi[0],
  // DOI ID
  '@doi/id': varRegex.doi[1],
  // DOI ID list
  '@doi/list+text': varRegex.doi[2],
  // Wikidata ID
  '@wikidata/id': varRegex.wikidata[0],
  // Wikidata entity list
  '@wikidata/list+text': varRegex.wikidata[1],
  // Wikidata API URL
  '@wikidata/api': varRegex.wikidata[2],
  // Wikidata URL
  '@wikidata/url': varRegex.wikidata[3],
  // BibTeX
  '@bibtex/text': varRegex.bibtex,
  // Bib.TXT
  '@bibtxt/text': varRegex.bibtxt,
  // JSON
  '@else/json': /^\s*(\{[\S\s]+\}|\[[\S\s]*\])\s*$/,
  // Else URL
  '@else/url': varRegex.url
}

const types = {
  // Empty
  '@empty': input => input === null || input === undefined,
  // jQuery
  '@else/jquery': input => typeof jQuery !== 'undefined' && input instanceof jQuery,
  // HTML
  '@else/html': input => typeof HTMLElement !== 'undefined' && input instanceof HTMLElement
}

const arrayTypes = {
  '@csl/list+object': input => input.every(v => type(v) === '@csl/object'),
  '@wikidata/array': input => input.every(v => type(v) === '@wikidata/id'),
  '@doi/list+object': input => input.every(v => type(v) === '@doi/id'),
  '@else/list+object': () => true
}

const objectTypes = {
  '@wikidata/object': input => input.hasOwnProperty('entities'),
  '@contentmine/object': input => ['fulltext_html', 'fulltext_xml', 'fulltext_pdf'].some(prop => input[prop] && Array.isArray(input[prop].value)),
  '@bibtex/object': input => ['type', 'label', 'properties'].every(prop => input.hasOwnProperty(prop)),
  '@csl/object': input => true
}

for (let type in stringTypes) {
  add(type, {parseType: stringTypes[type]})
}
for (let type in types) {
  add(type, {parseType: types[type]})
}
for (let type in arrayTypes) {
  add(type, {parseType: input => Array.isArray(input) && arrayTypes[type](input)})
}
for (let type in objectTypes) {
  add(type, {parseType: objectTypes[type]})
}

export default type
