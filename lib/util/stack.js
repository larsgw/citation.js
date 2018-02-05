"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TokenStack = function () {
  function TokenStack(array) {
    _classCallCheck(this, TokenStack);

    this.stack = array;
    this.index = 0;
    this.current = this.stack[this.index];
  }

  _createClass(TokenStack, [{
    key: "tokensLeft",
    value: function tokensLeft() {
      return this.stack.length - this.index;
    }
  }, {
    key: "matches",
    value: function matches(pattern) {
      return TokenStack.getMatchCallback(pattern)(this.current, this.index, this.stack);
    }
  }, {
    key: "matchesSequence",
    value: function matchesSequence(sequence) {
      var part = this.stack.slice(this.index, this.index + sequence.length).join('');
      return typeof sequence === 'string' ? part === sequence : sequence.every(function (pattern, index) {
        return TokenStack.getMatchCallback(pattern)(part[index]);
      });
    }
  }, {
    key: "consumeToken",
    value: function consumeToken() {
      var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : /^[\s\S]$/;

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$inverse = _ref.inverse,
          inverse = _ref$inverse === void 0 ? false : _ref$inverse,
          _ref$spaced = _ref.spaced,
          spaced = _ref$spaced === void 0 ? true : _ref$spaced;

      if (spaced) {
        this.consumeWhitespace();
      }

      var token = this.current;
      var match = TokenStack.getMatchCallback(pattern)(token, this.index, this.stack);

      if (match) {
        this.current = this.stack[++this.index];
      } else {
        throw new SyntaxError("Unexpected token at index ".concat(this.index, ": Expected ").concat(TokenStack.getPatternText(pattern), ", got \"").concat(token, "\""));
      }

      if (spaced) {
        this.consumeWhitespace();
      }

      return token;
    }
  }, {
    key: "consumeWhitespace",
    value: function consumeWhitespace() {
      var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : /^\s$/;

      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$optional = _ref2.optional,
          optional = _ref2$optional === void 0 ? true : _ref2$optional;

      return this.consume(pattern, {
        min: +!optional
      });
    }
  }, {
    key: "consumeN",
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
  }, {
    key: "consumeSequence",
    value: function consumeSequence(sequence) {
      if (this.matchesSequence(sequence)) {
        return this.consumeN(sequence.length);
      } else {
        throw new SyntaxError("Expected \"".concat(sequence, "\", got \"").concat(this.consumeN(sequence.length), "\""));
      }
    }
  }, {
    key: "consume",
    value: function consume() {
      var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : /^[\s\S]$/;

      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref3$min = _ref3.min,
          min = _ref3$min === void 0 ? 0 : _ref3$min,
          _ref3$max = _ref3.max,
          max = _ref3$max === void 0 ? Infinity : _ref3$max,
          _ref3$inverse = _ref3.inverse,
          inverse = _ref3$inverse === void 0 ? false : _ref3$inverse,
          tokenMap = _ref3.tokenMap,
          tokenFilter = _ref3.tokenFilter;

      var start = this.index;
      var match = TokenStack.getMatchCallback(pattern);

      while (match(this.current, this.index, this.stack) !== inverse) {
        this.current = this.stack[++this.index];
      }

      var consumed = this.stack.slice(start, this.index);

      if (consumed.length < min) {
        throw new SyntaxError("Not enough ".concat(TokenStack.getPatternText(pattern)));
      } else if (consumed.length > max) {
        throw new SyntaxError("Too many ".concat(TokenStack.getPatternText(pattern)));
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
    key: "getPatternText",
    value: function getPatternText(pattern) {
      return "\"".concat(pattern instanceof RegExp ? pattern.source : pattern, "\"");
    }
  }, {
    key: "getMatchCallback",
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

var _default = TokenStack;
exports.default = _default;