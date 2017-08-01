'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var memoize = function memoize() {};

// TODO jsdoc

var TokenStack = function () {
  function TokenStack(array) {
    _classCallCheck(this, TokenStack);

    this.stack = array;
    this.index = 0;
    this.current = this.stack[this.index];
  }

  _createClass(TokenStack, [{
    key: 'tokensLeft',
    value: function tokensLeft() {
      return this.stack.length - this.index;
    }
  }, {
    key: 'matches',
    value: function matches(pattern) {
      return TokenStack.getMatchCallback(pattern)(this.current, this.index, this.stack);
    }
  }, {
    key: 'consumeToken',
    value: function consumeToken() {
      var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : /^[\s\S]$/;

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$inverse = _ref.inverse,
          inverse = _ref$inverse === undefined ? false : _ref$inverse;

      var token = this.current;
      var match = TokenStack.getMatchCallback(pattern)(token, this.index, this.stack);
      if (match) {
        this.current = this.stack[++this.index];
      } else {
        throw new SyntaxError('Unexpected token at index ' + this.index + ': Expected ' + TokenStack.getPatternText(pattern) + ', got "' + token + '"');
      }
      return token;
    }
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
  }, {
    key: 'consume',
    value: function consume() {
      var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : /^[\s\S]$/;

      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$min = _ref2.min,
          min = _ref2$min === undefined ? 0 : _ref2$min,
          _ref2$max = _ref2.max,
          max = _ref2$max === undefined ? Infinity : _ref2$max,
          _ref2$inverse = _ref2.inverse,
          inverse = _ref2$inverse === undefined ? false : _ref2$inverse,
          tokenMap = _ref2.tokenMap,
          tokenFilter = _ref2.tokenFilter;

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