const memoize = function () {
  
}

// TODO jsdoc
class TokenStack {
  constructor (array) {
    this.stack = array
    this.index = 0
    this.current = this.stack[this.index]
  }

  static getPatternText (pattern) {
    return `"${pattern instanceof RegExp ? pattern.source : pattern}"`
  }

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

  tokensLeft () {
    return this.stack.length - this.index
  }

  matches (pattern) {
    return TokenStack.getMatchCallback(pattern)(this.current, this.index, this.stack)
  }

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
