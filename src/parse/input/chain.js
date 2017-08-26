import deepCopy from '../../util/deepCopy'

import parseInputType from './type'
import parseInputData from './data'

/**
 * Parse input until success.
 *
 * @access protected
 * @method parseInput
 *
 * @param {String|Array<String>|Object|Array<Object>} input - The input data
 * @param {Object} [options] - Options
 * @param {Number} [options.maxChainLength=10] - Max. number of parsing iterations before giving up
 *
 * @return {Array<CSL>} The parsed input
 */
const parseInput = (input, {maxChainLength = 10} = {}) => {
  let type = parseInputType(input)
  let output = type.match(/^(array|object)\//) ? deepCopy(input) : input

  while (type !== 'array/csl') {
    if (maxChainLength-- <= 0) {
      console.error('[set]', 'Max. number of parsing iterations reached')
      return []
    }

    output = parseInputData(output, type)
    type = parseInputType(output)
  }

  return output
}

export default parseInput
