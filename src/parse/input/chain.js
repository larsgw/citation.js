import deepCopy from '../../util/deepCopy'

import parseInputType from './type'
import parseInputData from './data'

/**
 * Parse input until success.
 *
 * @access protected
 * @method parseInput
 *
 * @param {String|String[]|Object|Object[]} input - The input data
 *
 * @return {CSL[]} The parsed input
 */
const parseInput = function (input) {
  let output = input
  let type = parseInputType(output)

  if (type.match(/^(array|object)\//)) {
    output = deepCopy(output)
  }

  // TODO max recursion level
  while (type !== 'array/csl') {
    output = parseInputData(output, type)
    type = parseInputType(output)
  }

  return output
}

export default parseInput
