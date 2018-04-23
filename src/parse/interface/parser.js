import {type, typeMatcher, addTypeParser} from './type'
import {addDataParser} from './data'

export class TypeParser {
  validDataTypes = ['String', 'Array', 'SimpleObject', 'ComplexObject', 'Primitive']

  constructor (data) {
    this.data = data
  }

  // ==========================================================================
  // Validation
  // ==========================================================================

  validateDataType () {
    const dataType = this.data.dataType
    if (dataType && !this.validDataTypes.includes(dataType)) {
      throw new RangeError(`dataType was ${dataType}; expected one of ${this.validDataTypes}`)
    }
  }

  validateParseType () {
    const predicate = this.data.predicate
    if (predicate && !(predicate instanceof RegExp || typeof predicate === 'function')) {
      throw new TypeError(`predicate was ${typeof predicate}; expected RegExp or function`)
    }
  }

  validatePropertyConstraint () {
    const propertyConstraint = this.data.propertyConstraint
    if (propertyConstraint && typeof propertyConstraint !== 'object') {
      throw new TypeError(`propertyConstraint was ${typeof propertyConstraint}; expected array or object`)
    }
  }

  validateElementConstraint () {
    const elementConstraint = this.data.elementConstraint
    if (elementConstraint && typeof elementConstraint !== 'string') {
      throw new TypeError(`elementConstraint was ${typeof elementConstraint}; expected string`)
    }
  }

  validateExtends () {
    const extend = this.data.extends
    if (extend && typeof extend !== 'string') {
      throw new TypeError(`extends was ${typeof extend}; expected string`)
    }
  }

  validate () {
    this.validateDataType()
    this.validateParseType()
    this.validatePropertyConstraint()
    this.validateElementConstraint()
    this.validateExtends()
  }

  // ==========================================================================
  // Simplification helpers
  // ==========================================================================

  parsePropertyConstraint () {
    let constraints = [].concat(this.data.propertyConstraint || [])

    return constraints.map(({props = [], match = 'every', value = () => true}) => {
      props = [].concat(props)

      return input => props[match](prop => prop in input && value(input[prop]))
    })
  }

  parseElementConstraint () {
    let constraint = this.data.elementConstraint
    return !constraint ? [] : [input => input.every(entry => type(entry) === constraint)]
  }

  parsePredicate () {
    if (this.data.predicate instanceof RegExp) {
      return [this.data.predicate.test.bind(this.data.predicate)]
    } else if (this.data.predicate) {
      return [this.data.predicate]
    } else {
      return []
    }
  }

  getCombinedPredicate () {
    let predicates = [
      ...this.parsePredicate(),
      ...this.parsePropertyConstraint(),
      ...this.parseElementConstraint()
    ]

    if (predicates.length === 0) {
      return () => true
    } else if (predicates.length === 1) {
      return predicates[0]
    } else {
      return input => predicates.every(predicate => predicate(input))
    }
  }

  getDataType () {
    if (this.data.dataType) {
      return this.data.dataType
    } else if (this.data.predicate instanceof RegExp) {
      return 'String'
    } else if (this.data.elementConstraint) {
      return 'Array'
    } else {
      return 'Primitive'
    }
  }

  // ==========================================================================
  // Data simplification
  // ==========================================================================

  get dataType () {
    return this.getDataType()
  }

  get predicate () {
    return this.getCombinedPredicate()
  }

  get extends () {
    return this.data.extends
  }
}

export class DataParser {
  constructor (parser, {async} = {}) {
    this.parser = parser
    this.async = async
  }

  // ==========================================================================
  // Validation
  // ==========================================================================

  validate () {
    const parser = this.parser
    if (parser && typeof parser !== 'function') {
      throw new TypeError(`parser was ${typeof parser}; expected function`)
    }
  }
}

export class FormatParser {
  constructor (format, parsers) {
    this.format = format
    if (parsers.parseType) {
      this.typeParser = new TypeParser(parsers.parseType)
    }
    if (parsers.parse) {
      this.dataParser = new DataParser(parsers.parse, {async: false})
    }
    if (parsers.parseAsync) {
      this.dataAsyncParser = new DataParser(parsers.parseAsync, {async: true})
    }
  }

  // ==========================================================================
  // Validation
  // ==========================================================================

  validateFormat () {
    const format = this.format
    if (!typeMatcher.test(format)) {
      throw new TypeError(`format name was "${format}"; didn't match expected pattern`)
    }
  }

  validate () {
    this.validateFormat()
    if (this.typeParser) {
      this.typeParser.validate()
    }
    if (this.dataParser) {
      this.dataParser.validate()
    }
    if (this.dataAsyncParser) {
      this.dataAsyncParser.validate()
    }
  }

  // ==========================================================================
  // Register handling
  // ==========================================================================

  add () {
    const format = this.format
    if (this.typeParser) {
      addTypeParser(format, this.typeParser)
    }
    if (this.dataParser) {
      addDataParser(format, this.dataParser)
    }
    if (this.dataAsyncParser) {
      addDataParser(format, this.dataAsyncParser)
    }
  }
}
