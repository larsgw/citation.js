import {add} from '../register'

import fetchFile from '../../util/fetchFile'
import parseInput from './chain'

import varRegex from '../regex'
import parseJSON from '../json'

import parseWikidata from '../modules/wikidata/list'
import parseWikidataJSON from '../modules/wikidata/json'
import parseDoi from '../modules/doi/id'
import parseDoiApi from '../modules/doi/api'
import parseContentMine from '../modules/bibjson/index'
import parseBibTeX from '../modules/bibtex/text'
import {text as parseBibTxt} from '../modules/bibtex/bibtxt'
import parseBibTeXJSON from '../modules/bibtex/json'

const parsers = {
  '@wikidata/id': parseWikidata,
  '@wikidata/list+text': parseWikidata,
  '@wikidata/api': fetchFile,
  '@wikidata/url': input => input.match(varRegex.wikidata[3])[1],
  '@wikidata/list+object': parseWikidata,
  '@doi/api': parseDoiApi,
  '@doi/id': parseDoi,
  '@doi/list+text': parseDoi,
  '@doi/list+object': parseDoi,
  '@else/url': fetchFile,
  '@else/jquery': input => input.val() || input.text() || input.html(),
  '@else/html': input => input.value || input.textContent,
  '@else/json': parseJSON,
  '@bibtex/text': parseBibTeX,
  '@bibtxt/text': parseBibTxt,
  '@bibtex/object': parseBibTeXJSON,
  '@wikidata/object': parseWikidataJSON,
  '@contentmine/object': parseContentMine,
  '@else/list+object': input => [].concat(...input.map(parseInput)),
  '@csl/object': input => [input],
  '@csl/list+object': input => input,
  '@empty/text': () => [],
  '@empty/whitespace+text': () => [],
  '@empty': () => [],
  '@invalid': () => []
}

for (let type in parsers) {
  add(type, {parse: parsers[type]})
}

export default function parseInputData (data, type) {
  return parsers[type](data)
}
