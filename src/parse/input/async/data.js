import parseInputAsync from '../async/chain'
import parseInputData from '../data'

import fetchFileAsync from '../../../util/fetchFileAsync'
import parseWikidataJSONAsync from '../../wikidata/async/json'
import parseDoiApiAsync from '../../doi/async/api'

/**
 * Standardise input (internal use)
 *
 * @access protected
 * @method parseInputDataAsync
 *
 * @param {String|Array<String>|Object|Array<Object>} input - The input data
 * @param {String} type - The input type
 *
 * @return {Array<CSL>} The parsed input
 */
const parseInputDataAsync = async function (input, type) {
  switch (type) {
    case 'api/wikidata':
      return fetchFileAsync(input)

    case 'object/wikidata':
      return parseWikidataJSONAsync(input)

    case 'api/doi':
      return parseDoiApiAsync(input)

    case 'url/else':
      return fetchFileAsync(input)

    case 'array/else':
      return [].concat(...await Promise.all(input.map(value => parseInputAsync(value))))

    default:
      return parseInputData(input, type)
  }
}

export default parseInputDataAsync
