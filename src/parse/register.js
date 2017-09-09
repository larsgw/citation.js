import parseInputType from './input/type'
import parseInputData from './input/data'
import parseInputDataAsync from './input/async/data'

const types = []
const parsers = {}
const async = {}
const _ = {}

const camelCase = (prefix = '', ...words) => prefix.toLowerCase() + words.map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join('')
const getMethodName = type => camelCase(...type.match(/^(?:(.+?)\/)?(.*?)(?:\+(.+))?$/).slice(1).filter(Boolean))

const add = (format, {type, data, dataAsync} = {}) => {
  if (type) {
    if (['regex', 'function'].includes(typeof type)) {
      types.push([format, typeof type === 'regex' ? type.test.bind(type) : type])
    } else {
      throw new TypeError(`Invalid type parser, expected callback or regex, got ${typeof type}`)
    }
  }

  if (typeof data === 'function') {
    parsers[format] = data
    _[getMethodName(format)] = data
  } else if (data) {
    throw new TypeError(`Invalid data parser, expected callback, got ${typeof data}`)
  }

  if (typeof dataAsync === 'function') {
    parsers[format] = dataAsync
    _[getMethodName(format) + 'Async'] = dataAsync
  } else if (dataAsync) {
    throw new TypeError(`Invalid data parser, expected callback, got ${typeof dataAsync}`)
  }
}

const type = (data) => {
  const result = types.find(([_, typeParser]) => typeParser(data))

  if (result === undefined) {
    // TODO could not match type
    // return 'invalid'
    return parseInputType(data)
  } else {
    return result[0]
  }
}

const data = (data, type) => {
  if (parsers.hasOwnProperty(type)) {
    return parsers[type](data)
  } else {
    // TODO ERROR 404 parser not found
    // return []
    return parseInputData(data, type)
  }
}

const dataAsync = async (data, type) => {
  if (async.hasOwnProperty(type)) {
    return async[type](data)
  } else {
    // TODO ERROR 404 parser not found
    // return []
    return parseInputDataAsync(data, type)
  }
}

export {
  add,
  type,
  data,
  dataAsync,
  _
}
