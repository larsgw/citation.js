/**
 * Create a TokenStack for parsing strings with complex escape sequences.
 *
 * @access protected
 * @class TokenStack
 *
 * @param {String[]} array - list of tokens
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
   * @param {String|RegExp|TokenStack~match|Array} pattern - pattern
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
   * @return {Boolean} match
   */
  matches (pattern) {
    return TokenStack.getMatchCallback(pattern)(this.current, this.index, this.stack)
  }

  /**
   * Consume a single token if possible, and throw if not.
   *
   * @method consumeToken
   * @memberof TokenStack
   *
   * @param {String|RegExp|TokenStack~match|Array} [pattern=/^[\s\S]$/g] - pattern
   * @param {Object} options
   * @param {Boolean} [options.inverse=false] - invert pattern
   *
   * @return {String} token
   * @throws {SyntaxError} Unexpected token at index: Expected pattern, got token
   */
  consumeToken (pattern = /^[\s\S]$/, {inverse = false} = {}) {
    const token = this.current
    const match = TokenStack.getMatchCallback(pattern)(token, this.index, this.stack)
    if (match) {
      this.current = this.stack[++this.index]
    } else {
      throw new SyntaxError(`Unexpected token at index ${this.index}: Expected ${TokenStack.getPatternText(pattern)}, got "${token}"`)
    }
    return token
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
   * Consumes all consecutive tokens matching pattern. Throws if number of matched tokens not within range min-max.
   *
   * @method consume
   * @memberof TokenStack
   *
   * @param {String|RegExp|TokenStack~match|Array} [pattern=/^[\s\S]$/g] - pattern
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
