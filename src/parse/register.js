const types = {}
const parsers = {}
const asyncParsers = {}
const _ = {}

const typeOf = thing => thing === undefined ? 'Undefined' : thing === null ? 'Null' : thing.constructor.name
const dataTypeOf = thing => {
  switch (typeof thing) {
    case 'string':
      return 'String'

    case 'object':
      if (Array.isArray(thing)) {
        return 'Array'
      } else if (typeOf(thing) === 'Object') {
        return 'SimpleObject'
      } else if (typeOf(thing) !== 'Null') {
        return 'ComplexObject'
      }
      // falls through when thing === null, returns default

    default:
      return 'Primitive'
  }
}

const typeMatcher = /^(?:@(.+?))(?:\/(?:(.+?)\+)?(?:(.+)))?$/
const capitalize = word => word[0].toUpperCase() + word.slice(1).toLowerCase()
const camelCase = (prefix = '', ...words) => prefix.toLowerCase() + words.map(capitalize).join('')
const getMethodName = type => camelCase(...type.match(typeMatcher).slice(1).filter(Boolean))

const addTypeParser = (format, dataType, parseType) => {
  const typeList = types[dataType] || (types[dataType] = {})
  typeList[format] = parseType
}

const add = (format, {dataType, parseType, parse, parseAsync} = {}) => {
  if (typeof format !== 'string' || !format.match(typeMatcher)) {
    throw new TypeError('Invalid format name, expected name starting with \'@\'')
  } else if (dataType && typeof dataType !== 'string') {
    throw new TypeError(`Invalid data type, expected string, got ${typeOf(dataType)}`)
  } else if (parseType && typeof parseType !== 'function' && !(parseType instanceof RegExp)) {
    throw new TypeError(`Invalid type parser, expected callback or regex, got ${typeOf(parseType)}`)
  } else if (parse && typeof parse !== 'function') {
    throw new TypeError(`Invalid data parser, expected callback, got ${typeOf(parse)}`)
  } else if (parseAsync && typeof parseAsync !== 'function') {
    throw new TypeError(`Invalid data parser, expected callback, got ${typeOf(parseAsync)}`)
  }

//   const input = [+(typeof parseType === 'function' || parseType instanceof RegExp), +!!parse, +!!parseAsync]
//   logger.log(format.padEnd(25), ...input)
//   if (input.every(n=>n===0)) {
//     logger.log(arguments[1])
//   }

  const methodName = parse || parseAsync ? getMethodName(format) : ''

  if (parseType) {
    if (parseType instanceof RegExp) {
      dataType = dataType || 'String'
      parseType = parseType.test.bind(parseType)
    }
    addTypeParser(format, dataType, parseType)
  }

  if (parse) {
    parsers[format] = _[methodName] = parse
  }

  if (parseAsync) {
    asyncParsers[format] = _[methodName + 'Async'] = parseAsync
  }
}

const parseNativeTypes = (input, dataType) => {
  switch (dataType) {
    case 'Array':
      if (input.length === 0 || input.every(entry => type(entry) === '@csl/object')) {
        return '@csl/list+object'
      } else {
        return '@else/list+object'
      }

    case 'SimpleObject':
    case 'ComplexObject':
      // might, of course, be something completely else, but we're gonna parse it as CSL dammit!
      return '@csl/object'
  }
}

const handleInvalidInput = () => {
  logger.warn('[set]', 'This format is not supported or recognized')
  return '@invalid'
}

const type = (input) => {
  const dataType = dataTypeOf(input)

  if (!types.hasOwnProperty(dataType)) {
    logger.warn('[set]', 'Data type has no formats listed')
    return handleInvalidInput(input)
  }

  // Empty array should be @csl/list+object too
  if (dataType === 'Array' && input.length === 0) {
    // Off-loading to parseNativeTypes to not repeat the name
    // '@csl/list+object' here as well, as it might change
    return parseNativeTypes(input, dataType)
  }

  const matches = Object.entries(types[dataType]).filter(([, parse]) => parse(input)).map(([format]) => format)

  if (matches.length === 0) {
    // No matching formats found, testing if native format,
    // eles invalid input.
    return parseNativeTypes(input, dataType) || handleInvalidInput(input)
  } else {
    return matches[0]
  }
}

const data = (input, type) => {
  if (parsers.hasOwnProperty(type)) {
    return parsers[type](input)
  } else {
    logger.error('[set]', `No synchronous parser found for ${type}`)
    return []
  }
}

const dataAsync = async (input, type) => {
  if (asyncParsers.hasOwnProperty(type)) {
    return asyncParsers[type](input)
  } else if (parsers.hasOwnProperty(type)) {
    return data(input, type)
  } else {
    logger.error('[set]', `No parser found for ${type}`)
    return []
  }
}

export {
  add,
  type,
  data,
  dataAsync,
  _
}
