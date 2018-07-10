/**
 * Gets the constructor name, with a special case for `null` and `undefined`
 *
 * @access public
 * @memberof Cite.plugins.input.util
 *
 * @param {*} thing - input data or anything else
 *
 * @return {String} type
 */
export const typeOf = thing => {
  switch (thing) {
    case undefined:
      return 'Undefined'
    case null:
      return 'Null'
    default:
      return thing.constructor.name
  }
}

/**
 * @access public
 * @memberof Cite.plugins.input.util
 *
 * @param {*} thing - input data or anything else
 *
 * @return {} dataType
 */
export const dataTypeOf = thing => {
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
      // fall through when thing === null, return default value

    default:
      return 'Primitive'
  }
}
