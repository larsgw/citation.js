/**
 * Create a TokenStack for parsing strings with complex escape sequences.
 *
 * @access protected
 * @class TokenStack
 *
 * @param {Array<String>} array - list of tokens
 */
class TokenStack {
  constructor (array) {
    this.stack = array
    this.index = 0
    this.current = this.stack[this.index]
  }

  /**
   * Get string representation of pattern.
   *
   * @access protected
   * @method getPatternText
   * @static
   * @memberof TokenStack
   *
   * @param {String|RegExp} pattern - pattern
   *
   * @return {String} string representation
   */
  static getPatternText (pattern) {
    return `"${pattern instanceof RegExp ? pattern.source : pattern}"`
  }

  /**
   * Get a single callback to match a token against one or several patterns.
   *
   * @access protected
   * @method getMatchCallback
   * @static
   * @memberof TokenStack
   *
   * @param {TokenStack~pattern} pattern - pattern
   *
   * @return {TokenStack~match} Match callback
   */
  static getMatchCallback (pattern) {
    if (Array.isArray(pattern)) {
      const matches = pattern.map(TokenStack.getMatchCallback)
      return token => matches.some(matchCallback => matchCallback(token))
    } else if (pattern instanceof Function) {
      return pattern
    } else if (pattern instanceof RegExp) {
      return token => pattern.test(token)
    } else {
      return token => pattern === token
    }
  }

  /**
   * Get a number representing the number of tokens that are left.
   *
   * @method tokensLeft
   * @memberof TokenStack
   *
   * @return {Number} tokens left
   */
  tokensLeft () {
    return this.stack.length - this.index
  }

  /**
   * Match current token against pattern.
   *
   * @method matches
   * @memberof TokenStack
   *
   * @param {TokenStack~pattern} pattern - pattern
   *
   * @return {Boolean} match
   */
  matches (pattern) {
    return TokenStack.getMatchCallback(pattern)(this.current, this.index, this.stack)
  }

  /**
   * Match current token against pattern.
   *
   * @method matches
   * @memberof TokenStack
   *
   * @param {TokenStack~sequence} pattern - pattern
   *
   * @return {Boolean} match
   */
  matchesSequence (sequence) {
    const part = this.stack.slice(this.index, this.index + sequence.length).join('')
    return typeof sequence === 'string'
      ? part === sequence
      : sequence.every((pattern, index) => TokenStack.getMatchCallback(pattern)(part[index]))
  }

  /**
   * Consume a single token if possible, and throw if not.
   *
   * @method consumeToken
   * @memberof TokenStack
   *
   * @param {TokenStack~pattern} [pattern=/^[\s\S]$/] - pattern
   * @param {Object} options
   * @param {Boolean} [options.inverse=false] - invert pattern
   * @param {Boolean} [options.spaced=true] - allow leading and trailing whitespace
   *
   * @return {String} token
   * @throws {SyntaxError} Unexpected token at index: Expected pattern, got token
   */
  consumeToken (pattern = /^[\s\S]$/, {inverse = false, spaced = true} = {}) {
    if (spaced) {
      this.consumeWhitespace()
    }

    const token = this.current
    const match = TokenStack.getMatchCallback(pattern)(token, this.index, this.stack)
    if (match) {
      this.current = this.stack[++this.index]
    } else {
      throw new SyntaxError(`Unexpected token at index ${this.index}: Expected ${TokenStack.getPatternText(pattern)}, got "${token}"`)
    }

    if (spaced) {
      this.consumeWhitespace()
    }

    return token
  }

  /**
   * Consume a single token if possible, and throw if not.
   *
   * @method consumeToken
   * @memberof TokenStack
   *
   * @param {TokenStack~pattern} [pattern=/^\s$/] - whitespace pattern
   * @param {Object} options
   * @param {Boolean} [options.optional=true] - allow having no whitespace
   *
   * @return {String} matched whitespace
   * @throws {SyntaxError} Unexpected token at index: Expected whitespace, got token
   */
  consumeWhitespace (pattern = /^\s$/, {optional = true} = {}) {
    return this.consume(pattern, {min: +!optional})
  }

  /**
   * Consume n tokens. Throws if not enough tokens left
   *
   * @method consumeN
   * @memberof TokenStack
   *
   * @param {Number} length - number of tokens
   *
   * @return {String} consumed tokens
   * @throws {SyntaxError} Not enough tokens left
   */
  consumeN (length) {
    if (this.tokensLeft() < length) {
      throw new SyntaxError('Not enough tokens left')
    }
    const start = this.index
    while (length--) {
      this.current = this.stack[++this.index]
    }
    return this.stack.slice(start, this.index).join('')
  }

  /**
   * Consume a pattern spanning multiple tokens ('sequence').
   *
   * @method consumeSequence
   * @memberof TokenStack
   *
   * @param {TokenStack~sequence} sequence - sequence
   *
   * @return {String} consumed tokens
   * @throws {SyntaxError} Expected sequence, got tokens
   */
  consumeSequence (sequence) {
    if (this.matchesSequence(sequence)) {
      return this.consumeN(sequence.length)
    } else {
      throw new SyntaxError(`Expected "${sequence}", got "${this.consumeN(sequence.length)}"`)
    }
  }

  /**
   * Consumes all consecutive tokens matching pattern. Throws if number of matched tokens not within range min-max.
   *
   * @method consume
   * @memberof TokenStack
   *
   * @param {TokenStack~pattern} [pattern=/^[\s\S]$/] - pattern
   * @param {Object} options
   * @param {Boolean} [options.inverse=false] - invert pattern
   * @param {Number} [options.min=0] - mininum number of consumed tokens
   * @param {Number} [options.max=Infinity] - maximum number of matched tokens
   * @param {TokenStack~tokenMap} [options.tokenMap] - map tokens before returning
   * @param {TokenStack~tokenFilter} [options.tokenFilter] - filter tokens before returning
   *
   * @return {String} consumed tokens
   * @throws {SyntaxError} Not enough tokens
   * @throws {SyntaxError} Too many tokens
   */
  consume (pattern = /^[\s\S]$/, {
    min = 0,
    max = Infinity,
    inverse = false,
    tokenMap,
    tokenFilter
  } = {}) {
    const start = this.index
    const match = TokenStack.getMatchCallback(pattern)

    while (match(this.current, this.index, this.stack) !== inverse) {
      this.current = this.stack[++this.index]
    }

    let consumed = this.stack.slice(start, this.index)

    if (consumed.length < min) {
      throw new SyntaxError(`Not enough ${TokenStack.getPatternText(pattern)}`)
    } else if (consumed.length > max) {
      throw new SyntaxError(`Too many ${TokenStack.getPatternText(pattern)}`)
    }

    if (tokenMap) {
      consumed = consumed.map(tokenMap)
    }
    if (tokenFilter) {
      consumed = consumed.filter(tokenFilter)
    }

    return consumed.join('')
  }
}

export default TokenStack
