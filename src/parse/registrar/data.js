import {typeMatcher} from './type'

// Different registers to store parsers in
const parsers = {}
const asyncParsers = {}
const nativeParsers = {}
const nativeAsyncParsers = {}

// Global register
const _ = {}

// Cache method names
const methodNames = {}

// All methods for `getMethodName`
const capitalize = word => word[0].toUpperCase() + word.slice(1).toLowerCase()
const camelCase = (prefix = '', ...words) => prefix.toLowerCase() + words.map(capitalize).join('')

// Get method name to put in the global register
const getMethodName = format => {
  if (!methodNames[format]) {
    methodNames[format] = camelCase(...format.match(typeMatcher).slice(1).filter(Boolean))
  }
  return methodNames[format]
}

/**
 * @access public
 * @memberof Cite.parse
 *
 * @param {Cite.parse~format} type
 * @param {Boolean} [async=false] - check only for async, or only sync
 *
 * @return {Boolean} parser exists
 */
const hasDataParser = (type, async = false) => async
  ? asyncParsers[type] || nativeAsyncParsers[type]
  : parsers[type] || nativeParsers[type]

/**
 * @access public
 * @memberof Cite.parse
 *
 * @param {InputData} input - input data
 * @param {Cite.parse~format} type - input type
 *
 * @return {*} parsed data
 * @return {Null} if no parser available
 */
const data = (input, type) => {
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
 * @memberof Cite.parse
 *
 * @param {InputData} input - input data
 * @param {Cite.parse~format} type - input type
 *
 * @return {Promise} parsed data
 * @return {Promise<Null>} if no parser available
 */
const dataAsync = async (input, type) => {
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
 * @memberof Cite.parse
 *
 * @param {Cite.parse~format} format
 * @param {Cite.parse~parse|Cite.parse~parseAsync} parser
 * @param {Object} [options={}]
 * @param {Boolean} [options.async=false]
 * @param {Boolean} [options.native=false] - native parsers get less priority when parsing type, like urls get less priority over Wikidata API URLs or DOIs
 */
const addDataParser = (format, parser, {async = false, native = false} = {}) => {
  let methodName = getMethodName(format)
  let parserObject

  if (async) {
    methodName += 'Async'
    parserObject = native ? nativeAsyncParsers : asyncParsers
  } else {
    parserObject = native ? nativeParsers : parsers
  }

  parserObject[format] = _[methodName] = parser
}

export {data, dataAsync, addDataParser, hasDataParser}
