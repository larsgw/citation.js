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
 * @access private
 * @method parseInputChainLink
 * 
 * @param {String|String[]|Object|Object[]} input - The input data
 * 
 * @return {CSL[]} The parsed input
 */
var parseInputChainLink = function parseInputChainLink(input) {
  var type = (0, _type2.default)(input);

  if (type.match(/^(array|object)\//)) input = (0, _deepCopy2.default)(input);

  return (0, _data2.default)(input, type);
};

exports.default = parseInputChainLink;