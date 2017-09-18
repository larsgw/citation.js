/* global jQuery, HTMLElement */

import varRegex from '../regex'
import {add, type} from '../register'

const stringTypes = {
  // Empty
  'string/empty': input => input === '',
  // Only whitespace
  'string/whitespace': /^\s+$/,
  // DOI API URL
  'api/doi': varRegex.doi[0],
  // DOI ID
  'string/doi': varRegex.doi[1],
  // DOI ID list
  'list/doi': varRegex.doi[2],
  // Wikidata ID
  'string/wikidata': varRegex.wikidata[0],
  // Wikidata entity list
  'list/wikidata': varRegex.wikidata[1],
  // Wikidata API URL
  'api/wikidata': varRegex.wikidata[2],
  // Wikidata URL
  'url/wikidata': varRegex.wikidata[3],
  // BibTeX
  'string/bibtex': varRegex.bibtex,
  // Bib.TXT
  'string/bibtxt': varRegex.bibtxt,
  // JSON
  'string/json': /^\s*(\{|\[)/,
  // Else URL
  'url/else': varRegex.url
}

const types = {
  // Empty
  'empty': input => input === null || input === undefined,
  // jQuery
  'jquery/else': input => typeof jQuery !== 'undefined' && input instanceof jQuery,
  // HTML
  'html/else': input => typeof HTMLElement !== 'undefined' && input instanceof HTMLElement
}

const arrayTypes = {
  'array/csl': input => input.every(v => type(v) === 'object/csl'),
  'array/wikidata': input => input.every(v => type(v) === 'string/wikidata'),
  'array/doi': input => input.every(v => type(v) === 'string/doi'),
  'array/else': () => true
}

const objectTypes = {
  'object/wikidata': input => input.hasOwnProperty('entities'),
  'object/contentmine': input => ['fulltext_html', 'fulltext_xml', 'fulltext_pdf'].some(prop => input[prop] && Array.isArray(input[prop].value)),
  'object/bibtex': input => ['type', 'label', 'properties'].every(prop => input.hasOwnProperty(prop)),
  'object/csl': input => true
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
