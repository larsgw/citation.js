'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stack = require('../../util/stack');

var _stack2 = _interopRequireDefault(_stack);

var _tokens = require('./tokens.json');

var _tokens2 = _interopRequireDefault(_tokens);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Match any BibTeX token.
 *
 *     new RegExp(
 *       // word commands
 *       '\\\\url|\\\\href|' +
 *       '{\\\\[a-zA-Z]+}|\\$\\\\[a-zA-Z]+\\$|' +
 *       // math
 *       '\\$[_^]{[0-9()+\\-=n]}\\$|'+
 *       // symbols
 *       '`{2,3}|\'{2,3}|-{2,3}|[!?]!|!\\?|{\\\\~}|' +
 *       // escaped symbols
 *       '\\\\[#$%&~_^\\{}]|' +
 *       // diacritics
 *       '{\\\\(?:[a-z] |[`"\'^~=.])\\\\?[a-zA-Z]}|' +
 *       // non-breaking space
 *       '[\\s\\S]', 'g')
 *
 * @access private
 * @constant tokenPattern
 * @default
 */
var tokenPattern = /\\url|\\href|{\\[a-zA-Z]+}|\$\\[a-zA-Z]+\$|\$[_^]{[0-9()+=\-n]}\$|`{2,3}|'{2,3}|-{2,3}|[!?]!|!\?|{\\~}|\\[#$%&~_^\{}]|{\\(?:[a-z] |[`"'^~=.])\\?[a-zA-Z]}|[\s\S]/g;

/**
 * Tokenize a BibTeX string
 *
 * @access private
 * @method getTokenizedBibtex
 *
 * @param {String} str - Input BibTeX
 *
 * @return {String[]} list of tokens
 */


/**
 * Mapping of BibTeX Escaped Chars to Unicode.
 *
 * From [Zotero's reversed mapping table](https://github.com/zotero/translators/blob/master/BibTeX.js#L2353)
 * [REPO](https://github.com/zotero/translators)
 *
 * Accesed 11/09/2016
 *
 * @access private
 * @constant varBibTeXTokens
 * @default
 */
var getTokenizedBibtex = function getTokenizedBibtex(str) {
  // Substitute command of form "\X{X}" into "{\X X}"
  str = str.replace(/{?(\\[`"'^~=.]){?\\?([A-Za-z])}/g, '{$1$2}').replace(/{?(\\[a-z]){?\\?([A-Za-z])}/g, '{$1 $2}');

  // Tokenize, with escaped characters in mind
  return str.match(tokenPattern);
};

/**
 * Format BibTeX data
 *
 * @access protected
 * @method parseBibTeX
 *
 * @param {String} str - The input data
 *
 * @return {CSL[]} The formatted input data
 */
var parseBibTeX = function parseBibTeX(str) {
  var whitespace = /^\s$/;
  var syntax = /^[@{}"=,\\]$/;
  var delimiters = {
    '"': '"',
    '"{': '}"',
    '{': '}',
    '{{': '}}',
    '': ''
  };

  var tokens = getTokenizedBibtex(str);
  var stack = new _stack2.default(tokens);
  var entries = [];

  try {
    stack.consume(whitespace);

    while (stack.tokensLeft()) {
      stack.consumeToken('@');
      stack.consume(whitespace);

      var type = stack.consume([whitespace, syntax], { inverse: true }).toLowerCase();

      stack.consume(whitespace);
      stack.consumeToken('{');
      stack.consume(whitespace);

      var label = stack.consume([whitespace, syntax], { inverse: true });

      stack.consume(whitespace);
      stack.consumeToken(',');
      stack.consume(whitespace);

      var properties = {};

      var _loop = function _loop() {
        var key = stack.consume([whitespace, '='], { inverse: true }).toLowerCase();

        stack.consume(whitespace);
        stack.consumeToken('=');
        stack.consume(whitespace);

        var startDelimiter = stack.consume(syntax);

        if (!delimiters.hasOwnProperty(startDelimiter)) {
          throw new SyntaxError('Unexpected field delimiter at index ' + stack.index + '. Expected ' + (Object.keys(delimiters).map(function (v) {
            return '"' + v + '"';
          }).join(', ') + '; got "' + startDelimiter + '"'));
        }

        var endDelimiter = delimiters[startDelimiter];

        var tokenMap = function tokenMap(token) {
          if (_tokens2.default.hasOwnProperty(token)) {
            return _tokens2.default[token];
          } else if (token.match(/^\\[#$%&~_^\\{}]$/)) {
            return token.slice(1);
          } else if (token.length > 1) {
            throw new SyntaxError('Escape sequence not recognized: ' + token);
          } else {
            return token;
          }
        };
        var tokenFilter = function tokenFilter(token) {
          return !/^[{}]$/.test(token);
        };

        var val = stack.consume(function (_, index) {
          if (stack.tokensLeft() < endDelimiter.length) {
            throw new SyntaxError('Unmatched delimiter at index ' + stack.index + ': Expected ' + endDelimiter);
          } else if (!endDelimiter.length) {
            var token = _;
            return ![whitespace, syntax].some(function (rgx) {
              return rgx.test(token);
            });
          } else {
            var _token = stack.stack.slice(index, index + endDelimiter.length).join('');
            return _token !== endDelimiter;
          }
        }, { tokenMap: tokenMap, tokenFilter: tokenFilter });

        properties[key] = val;

        stack.consumeN(endDelimiter.length);
        stack.consume(whitespace);

        // Last entry (no trailing comma)
        if (stack.matches('}')) {
          return 'break';
        }

        stack.consumeToken(',');
        stack.consume(whitespace);

        // Last entry (trailing comma)
        if (stack.matches('}')) {
          return 'break';
        }
      };

      while (stack.tokensLeft()) {
        var _ret = _loop();

        if (_ret === 'break') break;
      }

      stack.consumeToken('}');
      stack.consume(whitespace);

      entries.push({ type: type, label: label, properties: properties });
    }
  } catch (e) {
    console.error('Uncaught SyntaxError: ' + e.message + '. Returning completed entries.');

    // Remove last, possibly incomplete entry
    entries.pop();
  }

  return entries;
};

exports.default = parseBibTeX;