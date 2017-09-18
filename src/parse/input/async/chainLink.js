import deepCopy from '../../../util/deepCopy'

import {
  type as parseInputType,
  dataAsync as parseInputDataAsync
} from '../../register'

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
  const type = parseInputType(input)
  let output = type.match(/array|object/) ? deepCopy(input) : input

  return parseInputDataAsync(output, type)
}

export default parseInputChainLinkAsync
