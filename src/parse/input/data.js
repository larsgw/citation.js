import {add} from '../register'

import fetchFile from '../../util/fetchFile'
import parseInput from './chain'

import varRegex from '../regex'
import parseJSON from '../json'

const parsers = {
  '@wikidata/api': fetchFile,
  '@wikidata/url': input => input.match(varRegex.wikidata[3])[1],
  '@else/url': fetchFile,
  '@else/jquery': input => input.val() || input.text() || input.html(),
  '@else/html': input => input.value || input.textContent,
  '@else/json': parseJSON,
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
