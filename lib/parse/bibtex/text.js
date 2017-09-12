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
 *       '\\\\[#$%&~_^\\\\{}]|' +
 *       // diacritics
 *       '{\\\\(?:[a-z] |[`"\'^~=.])\\\\?[a-zA-Z]}|' +
 *       // non-breaking space
 *       '[\\s\\S]', 'g')
 *
 * @access private
 * @constant tokenPattern
 * @default
 */
var tokenPattern = /\\url|\\href|{\\[a-zA-Z]+}|\$\\[a-zA-Z]+\$|\$[_^]{[0-9()+=\-n]}\$|`{2,3}|'{2,3}|-{2,3}|[!?]!|!\?|{\\~}|\\[#$%&~_^\\{}]|{\\(?:[a-z] |[`"'^~=.])\\?[a-zA-Z]}|[\s\S]/g;

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


var whitespace = /^\s$/;
var syntax = /^[@{}"=,\\]$/;
var delimiters = {
  '"': '"',
  '{': '}',
  '': ''

  /**
   * Tokenize a BibTeX string
   *
   * @access private
   * @method getTokenizedBibtex
   *
   * @param {String} str - Input BibTeX
   *
   * @return {Array<String>} list of tokens
   */
};var getTokenizedBibtex = function getTokenizedBibtex(str) {
  // Substitute command of form "\X{X}" into "{\X X}"
  str = str.replace(/(\\[`"'^~=.]){\\?([A-Za-z])}/g, '{$1$2}').replace(/(\\[a-z]) ?{\\?([A-Za-z])}/g, '{$1 $2}');

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
 * @return {Array<CSL>} The formatted input data
 */
var parseBibTeX = function parseBibTeX(str) {
  var entries = [];
  var tokens = getTokenizedBibtex(str);
  var stack = new _stack2.default(tokens);

  try {
    stack.consumeWhitespace();

    while (stack.tokensLeft()) {
      stack.consumeToken('@', { spaced: false });
      stack.consumeWhitespace();

      var type = stack.consume([whitespace, syntax], { inverse: true }).toLowerCase();

      stack.consumeToken('{');

      var label = stack.consume([whitespace, syntax], { inverse: true });

      stack.consumeToken(',');

      var properties = {};

      var _loop = function _loop() {
        var key = stack.consume([whitespace, '='], { inverse: true }).toLowerCase();

        stack.consumeToken('=');

        var startDelimiter = stack.consume(/^({|"|)$/g);
        var endDelimiter = delimiters[startDelimiter];

        if (!delimiters.hasOwnProperty(startDelimiter)) {
          throw new SyntaxError('Unexpected field delimiter at index ' + stack.index + '. Expected ' + (Object.keys(delimiters).map(function (v) {
            return '"' + v + '"';
          }).join(', ') + '; got "' + startDelimiter + '"'));
        }

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

        var openBrackets = 0;
        var val = stack.consume(function (token, index) {
          if (token === '{') {
            openBrackets++;
          }

          if (stack.tokensLeft() < endDelimiter.length) {
            throw new SyntaxError('Unmatched delimiter at index ' + stack.index + ': Expected ' + endDelimiter);
          } else if (!endDelimiter.length) {
            return ![whitespace, syntax].some(function (rgx) {
              return rgx.test(token);
            });
          } else {
            return token === '}' && openBrackets-- || !stack.matchesSequence(endDelimiter);
          }
        }, { tokenMap: tokenMap });

        properties[key] = val;

        stack.consumeN(endDelimiter.length);
        stack.consumeWhitespace();

        // Last entry (no trailing comma)
        if (stack.matches('}')) {
          return 'break';
        }

        stack.consumeToken(',', { spaced: false });
        stack.consumeWhitespace();

        // Last entry (trailing comma)
        if (stack.matches('}')) {
          return 'break';
        }
      };

      while (stack.tokensLeft()) {
        var _ret = _loop();

        if (_ret === 'break') break;
      }

      stack.consumeToken('}', { spaced: false });
      stack.consumeWhitespace();

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