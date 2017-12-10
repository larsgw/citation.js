import {dataTypeOf} from './dataType'

// register
const types = {}

/**
 * @access private
 * @memberof Cite.parse
 *
 * @return {Cite.parse~format} the 'invalid' type (`'@invalid'`)
 */
const handleInvalidInput = () => {
  logger.warn('[set]', 'This format is not supported or recognized')
  return '@invalid'
}

/**
 * Hard-coded, for reasons
 *
 * @access private
 * @memberof Cite.parse
 *
 * @param {InputData} input
 * @param {Cite.parse~dataType} dataType
 * @return {Cite.parse~format} native format
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
  }
}

/**
 * @access public
 * @memberof Cite.parse
 *
 * @param {InputData} input
 *
 * @return {Cite.parse~format} type
 */
const type = (input) => {
  const dataType = dataTypeOf(input)

  if (!types.hasOwnProperty(dataType)) {
    logger.warn('[set]', 'Data type has no formats listed')
    return handleInvalidInput(input)
  }

  // Empty array should be @csl/list+object too
  if (dataType === 'Array' && input.length === 0) {
    // Off-load to parseNativeTypes() to not repeat the name
    // '@csl/list+object' here as well, as it might change
    return parseNativeTypes(input, dataType)
  }

  const matches = Object.entries(types[dataType]).filter(([, parse]) => parse(input)).map(([format]) => format)

  if (matches.length === 0) {
    // No matching formats found, test if native format,
    // else invalid input.
    return parseNativeTypes(input, dataType) || handleInvalidInput(input)
  } else {
    return matches[0]
  }
}

/**
 * @access public
 * @memberof Cite.parse
 *
 * @param {Cite.parse~format} format
 * @param {Cite.parse~dataType} dataType
 * @param {Cite.parse~parseType} parseType
 */
const addTypeParser = (format, dataType, parseType) => {
  const typeList = types[dataType] || (types[dataType] = {})
  typeList[format] = parseType
}

export {type, addTypeParser}

/**
 * @access public
 * @memberof Cite.parse
 *
 * @param {Cite.parse~format} type
 *
 * @return {Boolean} type parser is registered
 */
export const hasTypeParser = type => types.hasOwnProperty(type)

/**
 * Validate and parse the format name
 *
 * @access public
 * @memberof Cite.parse
 * @type {RegExp}
 */
export const typeMatcher = /^(?:@(.+?))(?:\/(?:(.+?)\+)?(?:(.+)))?$/
