import deepCopy from '../../../util/deepCopy'

import parseInputDataAsync from '../async/data'
import parseInputType from '../type'

/**
 * Parse input until success. (async)
 *
 * @access protected
 * @method parseInputAsync
 *
 * @param {String|String[]|Object|Object[]} input - The input data
 *
 * @return {Promise} The parsed input
 */
const parseInputAsync = async function (input) {
  let output = input
  let type = parseInputType(output)

  if (type.match(/^(array|object)\//)) {
    output = deepCopy(output)
  }

  // TODO max recursion level
  while (type !== 'array/csl') {
    output = await parseInputDataAsync(output, type)
    type = parseInputType(output)
  }

  return output
}

export default parseInputAsync
