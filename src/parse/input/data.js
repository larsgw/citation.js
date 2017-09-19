import {add} from '../register'

import varRegex from '../regex'

import fetchFile from '../../util/fetchFile'
import parseInput from './chain'
import parseWikidata from '../wikidata/list'
import parseWikidataJSON from '../wikidata/json'
import parseDoi from '../doi/id'
import parseDoiApi from '../doi/api'
import parseContentMine from '../bibjson/index'
import parseBibTeX from '../bibtex/text'
import {text as parseBibTxt} from '../bibtxt'
import parseBibTeXJSON from '../bibtex/json'
import parseJSON from '../json'

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
