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
  'string/wikidata': input => parseWikidata(input.match(varRegex.wikidata[0])[1]),
  'list/wikidata': input => parseWikidata(input.match(varRegex.wikidata[1])[1]),
  'api/wikidata': input => fetchFile(input),
  'url/wikidata': input => parseWikidata(input.match(varRegex.wikidata[3])[1]),
  'array/wikidata': input => parseWikidata(input.join(',')),
  'api/doi': input => parseDoiApi(input),
  'string/doi': input => parseDoi(input),
  'list/doi': input => parseDoi(input),
  'array/doi': input => parseDoi(input.join('\n')),
  'url/else': input => fetchFile(input),
  'jquery/else': input => input.val() || input.text() || input.html(),
  'html/else': input => input.value || input.textContent,
  'string/json': input => parseJSON(input),
  'string/bibtex': input => parseBibTeX(input),
  'string/bibtxt': input => parseBibTxt(input),
  'object/bibtex': input => parseBibTeXJSON(input),
  'object/wikidata': input => parseWikidataJSON(input),
  'object/contentmine': input => parseContentMine(input),
  'array/else': input => [].concat(...input.map(parseInput)),
  'object/csl': input => [input],
  'array/csl': input => input,
  'string/empty': () => [],
  'string/whitespace': () => [],
  'empty': () => [],
  'invalid': () => []
}

for (let type in parsers) {
  add(type, {data: parsers[type]})
}

export default function parseInputData (data, type) {
  return parsers[type](data)
}
