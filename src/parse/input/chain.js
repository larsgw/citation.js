import deepCopy from '../../util/deepCopy'

import {
  type as parseInputType,
  data as parseInputData
} from '../registrar/'
import {applyGraph, removeGraph} from './graph'

/**
 * Parse input until success.
 *
 * @access protected
 * @method parseInput
 *
 * @param {String|Array<String>|Object|Array<Object>} input - The input data
 * @param {Object} [options] - [Options](../#cite.in.options)
 *
 * @return {Array<CSL>} The parsed input
 */
const parseInput = (input, {
  maxChainLength = 10,
  generateGraph = true,
  forceType
} = {}) => {
  let type = forceType || parseInputType(input)
  let output = type.match(/object$/) ? deepCopy(input) : input

  const graph = [{type, data: input}]

  while (type !== '@csl/list+object') {
    if (maxChainLength-- <= 0) {
      logger.error('[set]', 'Max. number of parsing iterations reached')
      return []
    }

    output = parseInputData(output, type)
    type = parseInputType(output)
    graph.push({type})
  }

  return output.map(generateGraph ? entry => applyGraph(entry, graph) : removeGraph)
}

export default parseInput
