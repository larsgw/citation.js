import {dataTypeOf} from './dataType'

const types = {}

const addTypeParser = (format, dataType, parseType) => {
  const typeList = types[dataType] || (types[dataType] = {})
  typeList[format] = parseType
}

const parseNativeTypes = (input, dataType = dataTypeOf(input)) => {
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

export {type, addTypeParser}
export const hasTypeParser = type => types.hasOwnProperty(type)
export const typeMatcher = /^(?:@(.+?))(?:\/(?:(.+?)\+)?(?:(.+)))?$/
