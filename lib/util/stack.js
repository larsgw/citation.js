'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Create a TokenStack for parsing strings with complex escape sequences.
 *
 * @access protected
 * @class TokenStack
 *
 * @param {Array<String>} array - list of tokens
 */
var TokenStack = function () {
  function TokenStack(array) {
    _classCallCheck(this, TokenStack);

    this.stack = array;
    this.index = 0;
    this.current = this.stack[this.index];
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


  _createClass(TokenStack, [{
    key: 'tokensLeft',


    /**
     * Get a number representing the number of tokens that are left.
     *
     * @method tokensLeft
     * @memberof TokenStack
     *
     * @return {Number} tokens left
     */
    value: function tokensLeft() {
      return this.stack.length - this.index;
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

  }, {
    key: 'matches',
    value: function matches(pattern) {
      return TokenStack.getMatchCallback(pattern)(this.current, this.index, this.stack);
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

  }, {
    key: 'matchesSequence',
    value: function matchesSequence(sequence) {
      var part = this.stack.slice(this.index, this.index + sequence.length).join('');
      return typeof sequence === 'string' ? part === sequence : sequence.every(function (pattern, index) {
        return TokenStack.getMatchCallback(pattern)(part[index]);
      });
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

  }, {
    key: 'consumeToken',
    value: function consumeToken() {
      var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : /^[\s\S]$/;

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$inverse = _ref.inverse,
          inverse = _ref$inverse === undefined ? false : _ref$inverse,
          _ref$spaced = _ref.spaced,
          spaced = _ref$spaced === undefined ? true : _ref$spaced;

      if (spaced) {
        this.consumeWhitespace();
      }

      var token = this.current;
      var match = TokenStack.getMatchCallback(pattern)(token, this.index, this.stack);
      if (match) {
        this.current = this.stack[++this.index];
      } else {
        throw new SyntaxError('Unexpected token at index ' + this.index + ': Expected ' + TokenStack.getPatternText(pattern) + ', got "' + token + '"');
      }

      if (spaced) {
        this.consumeWhitespace();
      }

      return token;
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

  }, {
    key: 'consumeWhitespace',
    value: function consumeWhitespace() {
      var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : /^\s$/;

      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$optional = _ref2.optional,
          optional = _ref2$optional === undefined ? true : _ref2$optional;

      return this.consume(pattern, { min: +!optional });
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

  }, {
    key: 'consumeN',
    value: function consumeN(length) {
      if (this.tokensLeft() < length) {
        throw new SyntaxError('Not enough tokens left');
      }
      var start = this.index;
      while (length--) {
        this.current = this.stack[++this.index];
      }
      return this.stack.slice(start, this.index).join('');
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

  }, {
    key: 'consumeSequence',
    value: function consumeSequence(sequence) {
      if (this.matchesSequence(sequence)) {
        return this.consumeN(sequence.length);
      } else {
        throw new SyntaxError('Expected "' + sequence + '", got "' + this.consumeN(sequence.length) + '"');
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

  }, {
    key: 'consume',
    value: function consume() {
      var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : /^[\s\S]$/;

      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref3$min = _ref3.min,
          min = _ref3$min === undefined ? 0 : _ref3$min,
          _ref3$max = _ref3.max,
          max = _ref3$max === undefined ? Infinity : _ref3$max,
          _ref3$inverse = _ref3.inverse,
          inverse = _ref3$inverse === undefined ? false : _ref3$inverse,
          tokenMap = _ref3.tokenMap,
          tokenFilter = _ref3.tokenFilter;

      var start = this.index;
      var match = TokenStack.getMatchCallback(pattern);

      while (match(this.current, this.index, this.stack) !== inverse) {
        this.current = this.stack[++this.index];
      }

      var consumed = this.stack.slice(start, this.index);

      if (consumed.length < min) {
        throw new SyntaxError('Not enough ' + TokenStack.getPatternText(pattern));
      } else if (consumed.length > max) {
        throw new SyntaxError('Too many ' + TokenStack.getPatternText(pattern));
      }

      if (tokenMap) {
        consumed = consumed.map(tokenMap);
      }
      if (tokenFilter) {
        consumed = consumed.filter(tokenFilter);
      }

      return consumed.join('');
    }
  }], [{
    key: 'getPatternText',
    value: function getPatternText(pattern) {
      return '"' + (pattern instanceof RegExp ? pattern.source : pattern) + '"';
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

  }, {
    key: 'getMatchCallback',
    value: function getMatchCallback(pattern) {
      if (Array.isArray(pattern)) {
        var matches = pattern.map(TokenStack.getMatchCallback);
        return function (token) {
          return matches.some(function (matchCallback) {
            return matchCallback(token);
          });
        };
      } else if (pattern instanceof Function) {
        return pattern;
      } else if (pattern instanceof RegExp) {
        return function (token) {
          return pattern.test(token);
        };
      } else {
        return function (token) {
          return pattern === token;
        };
      }
    }
  }]);

  return TokenStack;
}();

exports.default = TokenStack;