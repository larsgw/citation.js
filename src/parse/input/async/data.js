import {add} from '../../register'

import parseInputAsync from '../async/chain'
import fetchFileAsync from '../../../util/fetchFileAsync'
import parseWikidataJSONAsync from '../../wikidata/async/json'
import parseDoiApiAsync from '../../doi/async/api'

const parsers = {
  '@wikidata/api': input => fetchFileAsync(input),
  '@wikidata/object': input => parseWikidataJSONAsync(input),
  '@doi/api': input => parseDoiApiAsync(input),
  '@else/url': input => fetchFileAsync(input),
  '@else/list+object': async input => [].concat(...await Promise.all(input.map(parseInputAsync)))
}

for (let type in parsers) {
  add(type, {parseAsync: parsers[type]})
}
