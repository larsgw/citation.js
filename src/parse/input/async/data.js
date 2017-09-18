import {add} from '../../register'

import parseInputAsync from '../async/chain'
import fetchFileAsync from '../../../util/fetchFileAsync'
import parseWikidataJSONAsync from '../../wikidata/async/json'
import parseDoiApiAsync from '../../doi/async/api'

const parsers = {
  'api/wikidata': input => fetchFileAsync(input),
  'object/wikidata': input => parseWikidataJSONAsync(input),
  'api/doi': input => parseDoiApiAsync(input),
  'url/else': input => fetchFileAsync(input),
  'array/else': async input => [].concat(...await Promise.all(input.map(parseInputAsync)))
}

for (let type in parsers) {
  add(type, {parseAsync: parsers[type]})
}
