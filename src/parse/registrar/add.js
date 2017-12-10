import {addTypeParser, type, typeMatcher} from './type'
import {addDataParser} from './data'
import {typeOf} from './dataType'

/**
 * @typedef Cite.parse~format
 * @type String
 */

/**
 * @typedef Cite.parse~parserObject
 * @type Object
 *
 * @property {Cite.parse~parse} parse
 * @property {Cite.parse~parseAsync} parseAsync
 * @property {Cite.parse~parseType} parseType
 * @property {Cite.parse~dataType} dataType
 * @property {Cite.parse~propertyConstraint} propertyConstraint
 * @property {Cite.parse~elementConstraint} elementConstraint
 */

/**
 * @callback Cite.parse~parse
 * @param {InputData} input
 * @return parsed data
 */

/**
 * @async
 * @callback Cite.parse~parseAsync
 * @param {InputData} input
 * @return parsed data
 */

/**
 * @callback Cite.parse~parseType
 * @param {InputData} input
 * @return {Boolean} pass
 */

/**
 * @typedef Cite.parse~dataType
 * @type String
 */

/**
 * @typedef Cite.parse~propertyConstraint
 * @type Object
 * @property {Array<String>} [props=[]]
 * @property {String} [match='every']
 * @property {Cite.parse~entryPredicate} [value]
 */

/**
 * @callback Cite.parse~entryPredicate
 * @param value
 * @return {Boolean} pass
 */

/**
 * @typedef Cite.parse~elementConstraint
 * @type {Array<String>}
 */

/**
 * Validate input arguments.
 *
 * @access private
 * @memberof Cite.parse
 *
 * @param {Cite.parse~format} format
 * @param {Cite.parse~parserObject} parsers
 * @throw {TypeError} Invalid format name
 * @throw {TypeError} Invalid parser
 */
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
    throw new TypeError(`Invalid property constraint, expected object, got ${typeOf(propertyConstraint)}`)
  } else if (elementConstraint && typeof elementConstraint !== 'string') {
    throw new TypeError(`Invalid element constraint, expected string, got ${typeOf(elementConstraint)}`)
  } else if (parse && typeof parse !== 'function') {
    throw new TypeError(`Invalid data parser, expected callback, got ${typeOf(parse)}`)
  } else if (parseAsync && typeof parseAsync !== 'function') {
    throw new TypeError(`Invalid data parser, expected callback, got ${typeOf(parseAsync)}`)
  }
}

/**
 * Turn property constraint into regular callbacks
 *
 * @access private
 * @memberof Cite.parse
 *
 * @param {Cite.parse~propertyConstraint} propertyConstraint
 * @return {Cite.parse~parseType}
 */
const parsePropertyConstraint = ({props = [], match = 'every', value}) => {
  const hasProp = input => prop => input.hasOwnProperty(prop)
  props = [].concat(props)
  return typeof value === 'function'
    ? input => props[match](hasProp(input)) && props[match](prop => value(input[prop]))
    : input => props[match](hasProp(input))
}

/**
 * @access private
 * @memberof Cite.parse
 *
 * @param {Cite.parse~elementConstraint} elementConstraint
 * @return {Cite.parse~parseType}
 */
const parseElementConstraint = elementConstraint => input => input.every(entry => type(entry) === elementConstraint)

/**
 * @access private
 * @memberof Cite.parse
 *
 * @param {Cite.parse~parserObject} parsers
 * @return {Cite.parse~dataType} dataType
 */
const getDataType = ({dataType, parseType}) => {
  return dataType || (parseType instanceof RegExp ? 'String' : 'Primitive')
}

/**
 * @access private
 * @memberof Cite.parse
 *
 * @param {Cite.parse~parserObject} parsers
 * @return {Cite.parse~parseType}
 */
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

/**
 * See the relevant tutorial: {@tutorial input_plugins}
 *
 * @access public
 * @memberof Cite.parse
 *
 * @param {Cite.parse~format} format - input format name
 * @param {Cite.parse~parserObject} parsers - parsers
 * @throw {TypeError} validation errors
 *
 * @tutorial input_plugins
 */
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
