import deepCopy from '../../util/deepCopy'

import {
  type as parseInputType,
  data as parseInputData
} from '../registrar/'

/**
 * Parse input once.
 *
 * @access protected
 * @method chainLink
 * @memberof Cite.parse.input
 *
 * @param {InputData} input - input data
 *
 * @return {Array<CSL>} The parsed input
 */
const parseInputChainLink = function (input) {
  const type = parseInputType(input)
  let output = type.match(/array|object/) ? deepCopy(input) : input

  return parseInputData(output, type)
}

export default parseInputChainLink
