import deepCopy from '../../util/deepCopy'

import parseInputType from './type'
import parseInputData from './data'

/**
 * Parse input once.
 *
 * @access protected
 * @method parseInputChainLink
 *
 * @param {String|String[]|Object|Object[]} input - The input data
 *
 * @return {CSL[]} The parsed input
 */
const parseInputChainLink = function (input) {
  let output = input
  const type = parseInputType(input)

  if (type.match(/^(array|object)\//)) {
    output = deepCopy(output)
  }

  return parseInputData(output, type)
}

export default parseInputChainLink
