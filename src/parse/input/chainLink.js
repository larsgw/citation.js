import deepCopy from '../../util/deepCopy'

import {
  type as parseInputType,
  data as parseInputData
} from '../register'

/**
 * Parse input once.
 *
 * @access protected
 * @method parseInputChainLink
 *
 * @param {String|Array<String>|Object|Array<Object>} input - The input data
 *
 * @return {Array<CSL>} The parsed input
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
