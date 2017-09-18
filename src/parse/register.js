const types = []
const parsers = {}
const asyncParsers = {}
const _ = {}

const typeOf = thing => thing === undefined ? 'Undefined' : thing === null ? 'Null' : thing.constructor.name

const typeMatcher = /^(?:(.+?)\/)?(.+?)(?:\/(.+?))?$/ // /^(?:@(.+?))(?:\/(.+?))?(?:\/(.+?))?$/
const capitalize = word => word[0].toUpperCase() + word.slice(1).toLowerCase()
const camelCase = (prefix = '', ...words) => prefix.toLowerCase() + words.map(capitalize).join('')
const getMethodName = type => camelCase(...type.match(typeMatcher).slice(1).filter(Boolean))

const addTypeParser = (format, type) => {
  const index = types.findIndex(([comparison]) => format === comparison)

  if (index === -1) {
    types.push([format, type])
  } else {
    types[index][1] = type
  }
}

const add = (format, {parseType, parse, parseAsync} = {}) => {
  if (typeof format !== 'string' || !format.match(typeMatcher)) {
    throw new TypeError('Invalid format name') //, expected name starting with \'@\'')
  } else if (parseType && typeof parseType !== 'function' && !(parseType instanceof RegExp)) {
    throw new TypeError(`Invalid type parser, expected callback or regex, got ${typeof parseType}`)
  } else if (parse && typeof parse !== 'function') {
    throw new TypeError(`Invalid data parser, expected callback, got ${typeof parse}`)
  } else if (parseAsync && typeof parseAsync !== 'function') {
    throw new TypeError(`Invalid data parser, expected callback, got ${typeof parseAsync}`)
  }

  const methodName = getMethodName(format)

  if (typeof parseType === 'function') {
    addTypeParser(format, parseType)
  } else if (parseType instanceof RegExp) {
    addTypeParser(format, input => typeof input === 'string' && parseType.test(input))
  }

  if (typeof parse === 'function') {
    parsers[format] = _[methodName] = parse
  }

  if (typeof parseAsync === 'function') {
    asyncParsers[format] = _[methodName + 'Async'] = parseAsync
  }
}

const type = (input) => {
  const result = types.find(([_, typeParser]) => typeParser(input))

  if (result === undefined) {
    logger.warn('[set]', 'This format is not supported or recognized')
    return 'invalid'
  } else {
    return result[0]
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
