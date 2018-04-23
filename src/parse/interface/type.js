import {dataTypeOf} from './dataType'

// register
const types = {}

// extensions not registered as such
const unregExts = {}

/**
 * Hard-coded, for reasons
 *
 * @access private
 * @memberof Cite.plugins.input
 *
 * @param {InputData} input
 * @param {Cite.plugins.input~dataType} dataType
 * @return {Cite.plugins.input~format} native format
 */
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
      // might, of course, be something completely else, but this is how the parser works
      return '@csl/object'

    default:
      logger.warn('[set]', 'This format is not supported or recognized')
      return '@invalid'
  }
}

/**
 * @access private
 * @memberof Cite.plugins.input
 *
 * @param {Object} [types={}]
 * @param {InputData} data
 *
 * @return {Cite.plugins.input~format} native format
 */
const matchType = (types = {}, data) => {
  for (const type in types) {
    if (types[type].predicate(data)) {
      return matchType(types[type].extensions) || type
    }
  }
}

/**
 * @access public
 * @memberof Cite.plugins.input
 *
 * @param {InputData} input
 *
 * @return {Cite.plugins.input~format} type
 */
export const type = (input) => {
  const dataType = dataTypeOf(input)

  if (!types.hasOwnProperty(dataType)) {
    // TODO if no parsers registered, this warning is always thrown
    logger.warn('[set]', 'Data type has no formats listed')
    return parseNativeTypes(input, dataType)
  }

  // Empty array should be @csl/list+object too
  if (dataType === 'Array' && input.length === 0) {
    // Off-load to parseNativeTypes() to not repeat the name
    // '@csl/list+object' here as well, as it might change
    return parseNativeTypes(input, dataType)
  }

  const match = matchType(types[dataType], input)

  // If no matching formats found, test if native format,
  // else invalid input.
  return match || parseNativeTypes(input, dataType)
}

/**
 * @access public
 * @memberof Cite.plugins.input
 *
 * @param {Cite.plugins.input~format} format
 * @param {Cite.plugins.input.TypeParser} typeParser
 */
export const addTypeParser = (format, {dataType, predicate, extends: extend}) => {
  // 1. check if any subclass formats are waiting for this format
  let extensions = {}
  if (format in unregExts) {
    extensions = unregExts[format]
    delete unregExts[format]
    logger.info('[set]', `Subclasses "${Object.keys(extensions)}" finally registered to parent type "${format}"`)
  }

  // 2. create object to add to type lists
  const object = {predicate, extensions}

  // 3. determine which type lists the object should be added to
  const typeList = types[dataType] || (types[dataType] = {})

  if (extend) {
    // 3.1. if format is subclass, check if parent type is registered
    // TODO recursive 'find'
    const parentTypeParser = typeList[extend]

    if (parentTypeParser) {
      // 3.1.1. if it is, add the type parser
      parentTypeParser.extensions[format] = object
    } else {
      // 3.1.2. if it isn't, register type as waiting
      if (!unregExts[extend]) {
        unregExts[extend] = {}
      }
      unregExts[extend][format] = object
      logger.info('[set]', `Subclass "${format}" is waiting on parent type "${extend}"`)
    }
  } else {
    // 3.2. else, add
    typeList[format] = object
  }
}

/**
 * @access public
 * @memberof Cite.plugins.input
 *
 * @param {Cite.plugins.input~format} type
 *
 * @return {Boolean} type parser is registered
 */
export const hasTypeParser = type => types.hasOwnProperty(type)

/**
 * Validate and parse the format name
 *
 * @access public
 * @memberof Cite.plugins.input
 * @type {RegExp}
 */
export const typeMatcher = /^(?:@(.+?))(?:\/(?:(.+?)\+)?(?:(.+)))?$/
