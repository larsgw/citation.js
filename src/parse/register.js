import parseInputType from './input/type'

const types = []
const parsers = {}
const async = {}
const _ = {}

const typeMatcher = /^(?:(.+?)\/)?(.+?)(?:\/(.+?))?$/ // /^(?:@(.+?))(?:\/(.+?))?(?:\/(.+?))?$/

const capitalize = word => word[0].toUpperCase() + word.slice(1).toLowerCase()
const camelCase = (prefix = '', ...words) => prefix.toLowerCase() + words.map(capitalize).join('')
const getMethodName = type => camelCase(...type.match(typeMatcher).slice(1).filter(Boolean))

const addTypeParser = (format, type) => {
  const index = types.findIndex(([comparison]) => format === comparison)
  if (index !== -1) {
    types[index][1] = type
  } else {
    types.push([format, type])
  }
}

const add = (format, {type, data, dataAsync} = {}) => {
  if (typeof format !== 'string' || !format.match(typeMatcher)) {
    throw new TypeError('Invalid format name') //, expected name starting with \'@\'')
  } else if (type && typeof type !== 'function' && !(type instanceof RegExp)) {
    throw new TypeError(`Invalid type parser, expected callback or regex, got ${typeof type}`)
  } else if (data && typeof data !== 'function') {
    throw new TypeError(`Invalid data parser, expected callback, got ${typeof data}`)
  } else if (dataAsync && typeof dataAsync !== 'function') {
    throw new TypeError(`Invalid data parser, expected callback, got ${typeof dataAsync}`)
  }

  const methodName = getMethodName(format)

  if (typeof type === 'function') {
    addTypeParser(format, type)
  } else if (type instanceof RegExp) {
    addTypeParser(format, type.test.bind(type))
  }

  if (data) {
    parsers[format] = _[methodName] = data
  }

  if (dataAsync) {
    async[format] = _[methodName + 'Async'] = dataAsync
  }
}

const type = (input) => {
  const result = types.find(([_, typeParser]) => typeParser(input))

  if (result === undefined) {
    // TODO could not match type
    // return 'invalid'
    return parseInputType(input)
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
  if (async.hasOwnProperty(type)) {
    return async[type](input)
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
