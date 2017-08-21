'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepCopy = require('../../util/deepCopy');

var _deepCopy2 = _interopRequireDefault(_deepCopy);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _data = require('./data');

var _data2 = _interopRequireDefault(_data);

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
  var output = input;
  var type = (0, _type2.default)(input);

  if (type.match(/^(array|object)\//)) {
    output = (0, _deepCopy2.default)(output);
  }

  return (0, _data2.default)(output, type);
};

exports.default = parseInputChainLink;