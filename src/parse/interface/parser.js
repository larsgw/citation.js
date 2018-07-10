import {type, typeMatcher} from './type'

// ============================================================================
// Type definitions
// ============================================================================

/**
 * @typedef Cite.plugins.input~format
 * @type String
 */

/**
 * @typedef Cite.plugins.input~parsers
 * @type Object
 *
 * @property {Cite.plugins.input~dataParser} parse
 * @property {Cite.plugins.input~asyncDataParser} parseAsync
 * @property {Cite.plugins.input~typeParser} parseType
 */

/**
 * @callback Cite.plugins.input~dataParser
 * @param {InputData} input
 * @return parsed data
 */

/**
 * @async
 * @callback Cite.plugins.input~asyncDataParser
 * @param {InputData} input
 * @return parsed data
 */

/**
 * @typedef Cite.plugins.input~typeParser
 * @type Object
 *
 * @property {Cite.plugins.input~dataType} dataType
 * @property {Cite.plugins.input~predicate|RegExp} predicate
 * @property {Cite.plugins.input~tokenList|RegExp} tokenList
 * @property {Cite.plugins.input~propertyConstraint|Array<Cite.plugins.input~propertyConstraint>} propertyConstraint
 * @property {Cite.plugins.input~elementConstraint|Array<Cite.plugins.input~elementConstraint>} elementConstraint
 * @property {Cite.plugins.input~format} extends
 */

/**
 * @typedef Cite.plugins.input~dataType
 * @type String
 */

/**
 * @callback Cite.plugins.input~predicate
 * @param {InputData} input
 * @return {Boolean} pass
 */

/**
 * @typedef Cite.plugins.input~tokenList
 * @type Object
 * @property {RegExp} token - token pattern
 * @property {RegExp} [split=/\s+/] - token delimiter
 * @property {Boolean} [every=true] - match every token, or only some
 * @property {Boolean} [trim=true] - trim input whitespace before testing
 */

/**
 * @typedef Cite.plugins.input~propertyConstraint
 * @type Object
 * @property {String|Array<String>} [props=[]]
 * @property {String} [match='every']
 * @property {Cite.plugins.input~valuePredicate} [value]
 */

/**
 * @callback Cite.plugins.input~valuePredicate
 * @param value
 * @return {Boolean} pass
 */

/**
 * @typedef Cite.plugins.input~elementConstraint
 * @type Cite.plugins.input~format
 */

export class TypeParser {
  validDataTypes = ['String', 'Array', 'SimpleObject', 'ComplexObject', 'Primitive']

  /**
   * @class TypeParser
   * @memberof Cite.plugins.input.util
   * @param {Cite.plugins.input~typeParser}
   */
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

  validateTokenList () {
    const tokenList = this.data.tokenList
    if (tokenList && typeof tokenList !== 'object') {
      throw new TypeError(`tokenList was ${typeof tokenList}; expected object or RegExp`)
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
    if (this.data === null || typeof this.data !== 'object') {
      throw new TypeError(`typeParser was ${typeof this.data}; expected object`)
    }
    this.validateDataType()
    this.validateParseType()
    this.validateTokenList()
    this.validatePropertyConstraint()
    this.validateElementConstraint()
    this.validateExtends()
  }

  // ==========================================================================
  // Simplification helpers
  // ==========================================================================

  parseTokenList () {
    let tokenList = this.data.tokenList

    if (!tokenList) {
      return []
    } else if (tokenList instanceof RegExp) {
      tokenList = {token: tokenList}
    }

    let {token, split = /\s+/, trim = true, every = true} = tokenList

    let trimInput = (input) => trim ? input.trim() : input
    let testTokens = every ? 'every' : 'some'

    let predicate = (input) =>
      trimInput(input).split(split)[testTokens](part => token.test(part))

    return [predicate]
  }

  parsePropertyConstraint () {
    let constraints = [].concat(this.data.propertyConstraint || [])

    return constraints.map(({props, match = 'every', value = () => true}) => {
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
      ...this.parseTokenList(),
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
    } else if (this.data.tokenList) {
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
  /**
   * @class DataParser
   * @memberof Cite.plugins.input.util
   * @param {Cite.plugins.input~dataParser|Cite.plugins.input~asyncDataParser} parser
   * @param {Object} options
   * @param {Boolean} [options.async=false]
   */
  constructor (parser, {async} = {}) {
    this.parser = parser
    this.async = async
  }

  // ==========================================================================
  // Validation
  // ==========================================================================

  validate () {
    const parser = this.parser
    if (typeof parser !== 'function') {
      throw new TypeError(`parser was ${typeof parser}; expected function`)
    }
  }
}

export class FormatParser {
  /**
   * @class FormatParser
   * @memberof Cite.plugins.input.util
   * @param {Cite.plugins.input~format} format
   * @param {Cite.plugins.input~parsers} parsers
   */
  constructor (format, parsers = {}) {
    this.format = format

    if (parsers.parseType) {
      this.typeParser = new TypeParser(parsers.parseType)
    }
    if (parsers.parse) {
      this.dataParser = new DataParser(parsers.parse, {async: false})
    }
    if (parsers.parseAsync) {
      this.asyncDataParser = new DataParser(parsers.parseAsync, {async: true})
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
    if (this.asyncDataParser) {
      this.asyncDataParser.validate()
    }
  }
}
