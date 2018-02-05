"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = exports.types = exports.scope = void 0;

var _stack = _interopRequireDefault(require("../../../util/stack"));

var _tokens = _interopRequireDefault(require("./tokens.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tokenPattern = /\\url|\\href|{\\[a-zA-Z]+}|\$\\[a-zA-Z]+\$|\$[_^]{[0-9()+=\-n]}\$|`{2,3}|'{2,3}|-{2,3}|[!?]!|!\?|{\\~}|\\[#$%&~_^\\{}]|{\\(?:[a-z] |[`"'^~=.])\\?[a-zA-Z]}|[\s\S]/g;
var whitespace = /^\s$/;
var syntax = /^[@{}"=,\\]$/;
var delimiters = {
  '"': '"',
  '{': '}',
  '': ''
};

var getTokenizedBibtex = function getTokenizedBibtex(str) {
  str = str.replace(/(\\[`"'^~=.]){\\?([A-Za-z])}/g, '{$1$2}').replace(/(\\[a-z]) ?{\\?([A-Za-z])}/g, '{$1 $2}');
  return str.match(tokenPattern);
};

var parseBibTeX = function parseBibTeX(str) {
  var entries = [];
  var tokens = getTokenizedBibtex(str);
  var stack = new _stack.default(tokens);

  try {
    stack.consumeWhitespace();

    while (stack.tokensLeft()) {
      stack.consumeToken('@', {
        spaced: false
      });
      stack.consumeWhitespace();
      var type = stack.consume([whitespace, syntax], {
        inverse: true
      }).toLowerCase();
      stack.consumeToken('{');
      var label = stack.consume([whitespace, syntax], {
        inverse: true
      });
      stack.consumeToken(',');
      var properties = {};

      var _loop = function _loop() {
        var key = stack.consume([whitespace, '='], {
          inverse: true
        }).toLowerCase();
        stack.consumeToken('=');
        var startDelimiter = stack.consume(/^({|"|)$/g);
        var endDelimiter = delimiters[startDelimiter];

        if (!delimiters.hasOwnProperty(startDelimiter)) {
          throw new SyntaxError("Unexpected field delimiter at index ".concat(stack.index, ". Expected ") + "".concat(Object.keys(delimiters).map(function (v) {
            return "\"".concat(v, "\"");
          }).join(', '), "; got \"").concat(startDelimiter, "\""));
        }

        var tokenMap = function tokenMap(token) {
          if (_tokens.default.hasOwnProperty(token)) {
            return _tokens.default[token];
          } else if (token.match(/^\\[#$%&~_^\\{}]$/)) {
            return token.slice(1);
          } else if (token.length > 1) {
            throw new SyntaxError("Escape sequence not recognized: ".concat(token));
          } else {
            return token;
          }
        };

        var openBrackets = 0;
        var val = stack.consume(function (token, index) {
          if (token === '{') {
            openBrackets++;
          }

          if (stack.tokensLeft() < endDelimiter.length) {
            throw new SyntaxError("Unmatched delimiter at index ".concat(stack.index, ": Expected ").concat(endDelimiter));
          } else if (!endDelimiter.length) {
            return ![whitespace, syntax].some(function (rgx) {
              return rgx.test(token);
            });
          } else {
            return token === '}' && openBrackets-- || !stack.matchesSequence(endDelimiter);
          }
        }, {
          tokenMap: tokenMap
        });
        properties[key] = val;
        stack.consumeN(endDelimiter.length);
        stack.consumeWhitespace();

        if (stack.matches('}')) {
          return "break";
        }

        stack.consumeToken(',', {
          spaced: false
        });
        stack.consumeWhitespace();

        if (stack.matches('}')) {
          return "break";
        }
      };

      while (stack.tokensLeft()) {
        var _ret = _loop();

        if (_ret === "break") break;
      }

      stack.consumeToken('}', {
        spaced: false
      });
      stack.consumeWhitespace();
      entries.push({
        type: type,
        label: label,
        properties: properties
      });
    }
  } catch (e) {
    logger.error("Uncaught SyntaxError: ".concat(e.message, ". Returning completed entries."));
    entries.pop();
  }

  return entries;
};

exports.default = exports.parse = parseBibTeX;
var scope = '@bibtex';
exports.scope = scope;
var types = '@bibtex/text';
exports.types = types;