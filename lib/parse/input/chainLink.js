'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepCopy = require('../../util/deepCopy');

var _deepCopy2 = _interopRequireDefault(_deepCopy);

var _register = require('../register');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Parse input once.
 *
 * @access protected
 * @method parseInputChainLink
 *
 * @param {String|Array<String>|Object|Array<Object>} input - The input data
 *
 * @return {Array<CSL>} The parsed input
 */
var parseInputChainLink = function parseInputChainLink(input) {
  var type = (0, _register.type)(input);
  var output = type.match(/array|object/) ? (0, _deepCopy2.default)(input) : input;

  return (0, _register.data)(output, type);
};

exports.default = parseInputChainLink;