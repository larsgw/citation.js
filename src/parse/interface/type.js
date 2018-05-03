import {dataTypeOf} from './dataType'

// register
const types = {}
const dataTypes = {}

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
 * @param {Array<Cite.plugins.input~format>} [typeList=[]]
 * @param {InputData} data
 *
 * @return {Cite.plugins.input~format} native format
 */
const matchType = (typeList = [], data) => {
  for (const type of typeList) {
    if (types[type].predicate(data)) {
      return matchType(types[type].extensions, data) || type
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

  // Empty array should be @csl/list+object too
  if (dataType === 'Array' && input.length === 0) {
    // Off-load to parseNativeTypes() to not repeat the name
    // '@csl/list+object' here as well, as it might change
    return parseNativeTypes(input, dataType)
  }

  const match = matchType(dataTypes[dataType], input)

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
  let extensions = []
  if (format in unregExts) {
    extensions = unregExts[format]
    delete unregExts[format]
    logger.info('[set]', `Subclasses "${extensions}" finally registered to parent type "${format}"`)
  }

  // 2. create object with parser info
  const object = {predicate, extensions}
  types[format] = object

  // 3. determine which type lists the type should be added to
  if (extend) {
    // 3.1. if format is subclass, check if parent type is registered
    const parentTypeParser = types[extend]

    if (parentTypeParser) {
      // 3.1.1. if it is, add the type parser
      parentTypeParser.extensions.push(format)
    } else {
      // 3.1.2. if it isn't, register type as waiting
      if (!unregExts[extend]) {
        unregExts[extend] = []
      }
      unregExts[extend].push(format)
      logger.info('[set]', `Subclass "${format}" is waiting on parent type "${extend}"`)
    }
  } else {
    // 3.2. else, add
    const typeList = dataTypes[dataType] || (dataTypes[dataType] = [])
    typeList.push(format)
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
 * @access public
 * @memberof Cite.plugins.input
 *
 * @param {Cite.plugins.input~format} type
 */
export const removeTypeParser = type => {
  delete types[type]

  // Removing orphaned type refs
  const typeLists = [
    ...Object.values(dataTypes),
    ...Object.values(types).map(type => type.extensions).filter(list => list.length > 0)
  ]
  typeLists.forEach(typeList => {
    const index = typeList.indexOf(type)
    if (index > -1) {
      typeList.splice(index, 1)
    }
  })
}

/**
 * @access public
 * @memberof Cite.plugins.input
 *
 * @return {Array<Cite.plugins.input~format>} list of registered type parsers
 */
export const listTypeParser = () => Object.keys(types)

/**
 * @access public
 * @memberof Cite.plugins.input
 *
 * @return {Object} tree structure
 */
export const treeTypeParser = /* istanbul ignore next: debugging */ () => {
  const attachNode = name => ({name, children: types[name].extensions.map(attachNode)})
  return {
    name: 'Type tree',
    children: Object.entries(dataTypes)
      .map(([name, children]) => ({name, children: children.map(attachNode)}))
  }
}

/**
 * Validate and parse the format name
 *
 * @access public
 * @memberof Cite.plugins.input
 * @type {RegExp}
 */
export const typeMatcher = /^(?:@(.+?))(?:\/(?:(.+?)\+)?(?:(.+)))?$/
