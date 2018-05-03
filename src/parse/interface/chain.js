import deepCopy from '../../util/deepCopy'

import {type as parseType} from './type'
import {data as parseData, dataAsync as parseDataAsync} from './data'
import {applyGraph, removeGraph} from './graph'

/**
 * Parse input until success.
 *
 * @access protected
 * @method chain
 * @memberof Cite.plugins.input
 *
 * @param {InputData} input - input data
 * @param {Cite~InputOptions} [options] - options
 *
 * @return {Array<CSL>} The parsed input
 */
export const chain = (input, options = {}) => {
  let {
    maxChainLength = 10,
    generateGraph = true,
    forceType
  } = options

  let type = forceType || parseType(input)
  let output = type.match(/object$/) ? deepCopy(input) : input

  const graph = [{type, data: input}]

  while (type !== '@csl/list+object') {
    if (maxChainLength-- <= 0) {
      logger.error('[set]', 'Max. number of parsing iterations reached')
      return []
    }

    output = parseData(output, type)
    type = parseType(output)
    graph.push({type})
  }

  return output.map(generateGraph ? entry => applyGraph(entry, graph) : removeGraph)
}

/**
 * Parse input once.
 *
 * @access protected
 * @method chainLink
 * @memberof Cite.plugins.input
 *
 * @param {InputData} input - input data
 *
 * @return {Array<CSL>} The parsed input
 */
export const chainLink = (input) => {
  const type = parseType(input)
  const output = type.match(/array|object/) ? deepCopy(input) : input

  return parseData(output, type)
}

/**
 * Parse input until success. (async)
 *
 * @access protected
 * @method chainAsync
 * @memberof Cite.plugins.input
 *
 * @param {InputData} input - input data
 * @param {Cite~InputOptions} [options] - options
 *
 * @return {Promise<Array<CSL>>} The parsed input
 */
export const chainAsync = async (input, options = {}) => {
  let {
    maxChainLength = 10,
    generateGraph = true,
    forceType
  } = options

  let type = forceType || parseType(input)
  let output = type.match(/array|object/) ? deepCopy(input) : input

  const graph = [{type, data: input}]

  while (type !== '@csl/list+object') {
    if (maxChainLength-- <= 0) {
      logger.error('[set]', 'Max. number of parsing iterations reached')
      return []
    }

    output = await parseDataAsync(output, type)
    type = parseType(output)
    graph.push({type})
  }

  return output.map(generateGraph ? entry => applyGraph(entry, graph) : removeGraph)
}

/**
 * Parse input once. (async)
 *
 * @access protected
 * @method chainLinkAsync
 * @memberof Cite.plugins.input
 *
 * @param {InputData} input - The input data
 *
 * @return {Promise} The parsed input
 */
export const chainLinkAsync = async (input) => {
  const type = parseType(input)
  let output = type.match(/array|object/) ? deepCopy(input) : input

  return parseDataAsync(output, type)
}
