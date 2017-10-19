const typeOf = thing => thing === undefined ? 'Undefined' : thing === null ? 'Null' : thing.constructor.name
const dataTypeOf = thing => {
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

export {typeOf, dataTypeOf}
