import deepCopy from '../../../util/deepCopy'

import parseInputDataAsync from '../async/data'
import parseInputType from '../type'

/**
 * Parse input once. (async)
 *
 * @access protected
 * @method parseInputChainLinkAsync
 *
 * @param {String|Array<String>|Object|Array<Object>} input - The input data
 *
 * @return {Promise} The parsed input
 */
const parseInputChainLinkAsync = async function (input) {
  let output = input
  const type = parseInputType(input)

  if (type.match(/^(array|object)\//)) {
    output = deepCopy(output)
  }

  return parseInputDataAsync(output, type)
}

export default parseInputChainLinkAsync
