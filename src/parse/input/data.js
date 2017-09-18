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
  '@wikidata/id': input => parseWikidata(input.match(varRegex.wikidata[0])[1]),
  '@wikidata/list+text': input => parseWikidata(input.match(varRegex.wikidata[1])[1]),
  '@wikidata/api': input => fetchFile(input),
  '@wikidata/url': input => parseWikidata(input.match(varRegex.wikidata[3])[1]),
  '@wikidata/list+object': input => parseWikidata(input.join(',')),
  '@doi/api': input => parseDoiApi(input),
  '@doi/id': input => parseDoi(input),
  '@doi/list+text': input => parseDoi(input),
  '@doi/list+object': input => parseDoi(input.join('\n')),
  '@else/url': input => fetchFile(input),
  '@else/jquery': input => input.val() || input.text() || input.html(),
  '@else/html': input => input.value || input.textContent,
  '@else/json': input => parseJSON(input),
  '@bibtex/text': input => parseBibTeX(input),
  '@bibtxt/text': input => parseBibTxt(input),
  '@bibtex/object': input => parseBibTeXJSON(input),
  '@wikidata/object': input => parseWikidataJSON(input),
  '@contentmine/object': input => parseContentMine(input),
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
