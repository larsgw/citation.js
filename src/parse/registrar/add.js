import {addTypeParser, type, typeMatcher} from './type'
import {addDataParser} from './data'
import {typeOf} from './dataType'

const validate = (format, parsers) => {
  if (typeof format !== 'string' || !format.match(typeMatcher)) {
    throw new TypeError('Invalid format name, expected name starting with \'@\'')
  }

  const {dataType, parseType, propertyConstraint, elementConstraint, parse, parseAsync} = parsers
  if (dataType && typeof dataType !== 'string') {
    throw new TypeError(`Invalid data type, expected string, got ${typeOf(dataType)}`)
  } else if (parseType && typeof parseType !== 'function' && !(parseType instanceof RegExp)) {
    throw new TypeError(`Invalid type parser, expected callback or regex, got ${typeOf(parseType)}`)
  } else if (propertyConstraint && typeof propertyConstraint !== 'object') {
    throw new TypeError(`Invalid type parser, expected object, got ${typeOf(propertyConstraint)}`)
  } else if (elementConstraint && typeof elementConstraint !== 'string') {
    throw new TypeError(`Invalid type parser, expected string, got ${typeOf(elementConstraint)}`)
  } else if (parse && typeof parse !== 'function') {
    throw new TypeError(`Invalid data parser, expected callback, got ${typeOf(parse)}`)
  } else if (parseAsync && typeof parseAsync !== 'function') {
    throw new TypeError(`Invalid data parser, expected callback, got ${typeOf(parseAsync)}`)
  }
}

const parsePropertyConstraint = ({props = [], match = 'every', value}) => {
  const hasProp = input => prop => input.hasOwnProperty(prop)
  props = [].concat(props)
  return typeof value === 'function'
    ? input => props[match](hasProp(input)) && props[match](prop => value(input[prop]))
    : input => props[match](hasProp(input))
}

const parseElementConstraint = elementConstraint => input => input.every(entry => type(entry) === elementConstraint)

const getDataType = ({dataType, parseType}) => {
  return dataType || (parseType instanceof RegExp ? 'String' : 'Primitive')
}

const getParseType = ({parseType, propertyConstraint, elementConstraint}) => {
  const tests = []

  if (parseType instanceof RegExp) {
    tests.push(parseType.test.bind(parseType))
  } else if (parseType) {
    tests.push(parseType)
  }

  if (propertyConstraint) {
    tests.push(...[].concat(propertyConstraint).map(parsePropertyConstraint))
  }
  if (elementConstraint) {
    tests.push(parseElementConstraint(elementConstraint))
  }

  return tests.length === 1 ? tests[0] : input => tests.every(test => test(input))
}

const add = (format, parsers = {}) => {
  validate(format, parsers)

  if (parsers.parseType || parsers.propertyConstraint || parsers.elementConstraint) {
    const dataType = getDataType(parsers)
    const parseType = getParseType(parsers, format)
    addTypeParser(format, dataType, parseType)
  }

  if (parsers.parse) {
    addDataParser(format, parsers.parse, {async: false})
  }
  if (parsers.parseAsync) {
    addDataParser(format, parsers.parseAsync, {async: true})
  }
}

export {add}
