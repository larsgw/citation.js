import {add} from '../../register'

import parseInputAsync from '../async/chain'
import fetchFileAsync from '../../../util/fetchFileAsync'

import {parseAsync as parseWikidataJSONAsync} from '../../modules/wikidata/json'
import {parseAsync as parseDoiApiAsync} from '../../modules/doi/api'

const parsers = {
  '@wikidata/api': fetchFileAsync,
  '@wikidata/object': parseWikidataJSONAsync,
  '@doi/api': parseDoiApiAsync,
  '@else/url': fetchFileAsync,
  '@else/list+object': async input => [].concat(...await Promise.all(input.map(parseInputAsync)))
}

for (let type in parsers) {
  add(type, {parseAsync: parsers[type]})
}

export default async function parseInputDataAsync (data, type) {
  return parsers[type](data)
}
