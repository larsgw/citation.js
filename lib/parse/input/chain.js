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
 * Parse input until success.
 *
 * @access protected
 * @method parseInput
 *
 * @param {String|Array<String>|Object|Array<Object>} input - The input data
 * @param {Object} [options] - Options
 * @param {Number} [options.maxChainLength=10] - Max. number of parsing iterations before giving up
 *
 * @return {Array<CSL>} The parsed input
 */
var parseInput = function parseInput(input) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$maxChainLength = _ref.maxChainLength,
      maxChainLength = _ref$maxChainLength === undefined ? 10 : _ref$maxChainLength;

  var type = (0, _type2.default)(input);
  var output = type.match(/^(array|object)\//) ? (0, _deepCopy2.default)(input) : input;

  while (type !== 'array/csl') {
    if (maxChainLength-- <= 0) {
      console.error('[set]', 'Max. number of parsing iterations reached');
      return [];
    }

    output = (0, _data2.default)(output, type);
    type = (0, _type2.default)(output);
  }

  return output;
};

exports.default = parseInput;