import {chain, chainAsync} from './chain'

const flatten = array => [].concat(...array)

// Different registers to store parsers in
const parsers = {}
const asyncParsers = {}
const nativeParsers = {
  '@csl/object': input => [input],
  '@csl/list+object': input => input,
  '@else/list+object': input => flatten(input.map(chain)),
  '@invalid': () => []
}
const nativeAsyncParsers = {
  '@else/list+object': async input => flatten(await Promise.all(input.map(chainAsync)))
}

/**
 * @access public
 * @memberof Cite.plugins.input
 *
 * @param {InputData} input - input data
 * @param {Cite.plugins.input~format} type - input type
 *
 * @return {*} parsed data
 * @return {Null} if no parser available
 */
export const data = (input, type) => {
  if (parsers.hasOwnProperty(type)) {
    return parsers[type](input)
  } else if (nativeParsers.hasOwnProperty(type)) {
    return nativeParsers[type](input)
  } else {
    logger.error('[set]', `No synchronous parser found for ${type}`)
    return null
  }
}

/**
 * @access public
 * @memberof Cite.plugins.input
 *
 * @param {InputData} input - input data
 * @param {Cite.plugins.input~format} type - input type
 *
 * @return {Promise} parsed data
 * @return {Promise<Null>} if no parser available
 */
export const dataAsync = async (input, type) => {
  if (asyncParsers.hasOwnProperty(type)) {
    return asyncParsers[type](input)
  } else if (nativeAsyncParsers.hasOwnProperty(type)) {
    return nativeAsyncParsers[type](input)
  } else if (hasDataParser(type, false)) {
    return data(input, type)
  } else {
    logger.error('[set]', `No parser found for ${type}`)
    return null
  }
}

/**
 * @access protected
 * @memberof Cite.plugins.input
 *
 * @param {Cite.plugins.input~format} format
 * @param {Cite.plugins.input~parse|Cite.plugins.input~parseAsync} parser
 * @param {Object} [options={}]
 * @param {Boolean} [options.async=false]
 */
export const addDataParser = (format, {parser, async}) => {
  if (async) {
    asyncParsers[format] = parser
  } else {
    parsers[format] = parser
  }
}

/**
 * @access public
 * @memberof Cite.plugins.input
 *
 * @param {Cite.plugins.input~format} type
 * @param {Boolean} [async=false] - check only for async, or only sync
 *
 * @return {Boolean} parser exists
 */
export const hasDataParser = (type, async) => async
  ? asyncParsers[type] || nativeAsyncParsers[type]
  : parsers[type] || nativeParsers[type]

/**
 * @access public
 * @memberof Cite.plugins.input
 *
 * @param {Cite.plugins.input~format} type
 * @param {Boolean} [async=false]
 */
export const removeDataParser = (type, async) => { delete (async ? asyncParsers : parsers)[type] }

/**
 * @access public
 * @memberof Cite.plugins.input
 *
 * @param {Boolean} [async=false]
 */
export const listDataParser = (async) => Object.keys(async ? asyncParsers : parsers)
