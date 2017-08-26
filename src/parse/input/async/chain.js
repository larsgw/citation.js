import deepCopy from '../../../util/deepCopy'

import parseInputDataAsync from '../async/data'
import parseInputType from '../type'

/**
 * Parse input until success. (async)
 *
 * @access protected
 * @method parseInputAsync
 *
 * @param {String|Array<String>|Object|Array<Object>} input - The input data
 * @param {Object} [options] - Options
 * @param {Number} [options.maxChainLength=10] - Max. number of parsing iterations before giving up
 *
 * @return {Promise} The parsed input
 */
const parseInputAsync = async (input, {maxChainLength = 10} = {}) => {
  let type = parseInputType(input)
  let output = type.match(/^(array|object)\//) ? deepCopy(input) : input

  while (type !== 'array/csl') {
    if (maxChainLength-- <= 0) {
      console.error('[set]', 'Max. number of parsing iterations reached')
      return []
    }

    output = await parseInputDataAsync(output, type)
    type = parseInputType(output)
  }

  return output
}

export default parseInputAsync
