import {typeMatcher} from './type'

const parsers = {}
const asyncParsers = {}
const nativeParsers = {}
const nativeAsyncParsers = {}
const _ = {}
const methodNames = {}

const capitalize = word => word[0].toUpperCase() + word.slice(1).toLowerCase()
const camelCase = (prefix = '', ...words) => prefix.toLowerCase() + words.map(capitalize).join('')
const getMethodName = type => camelCase(...type.match(typeMatcher).slice(1).filter(Boolean))

const hasDataParser = (type, async = false) => async
  ? asyncParsers[type] || nativeAsyncParsers[type]
  : parsers[type] || nativeParsers[type]

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

const dataAsync = async (input, type) => {
  if (asyncParsers.hasOwnProperty(type)) {
    return asyncParsers[type](input)
  } else if (nativeAsyncParsers.hasOwnProperty(type)) {
    return nativeAsyncParsers[type](input)
  } else if (hasDataParser(type)) {
    // Off-load handling of @invalid to data(), for DRY
    return data(input, type)
  } else {
    logger.error('[set]', `No parser found for ${type}`)
    return null
  }
}

const addDataParser = (format, parser, {async = false, native = false} = {}) => {
  let methodName = methodNames[format] = methodNames[format] || getMethodName(format)
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
