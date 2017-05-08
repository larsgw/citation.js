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
 * @param {String|String[]|Object|Object[]} input - The input data
 *
 * @return {CSL[]} The parsed input
 */
var parseInput = function parseInput(input) {
  var output = input;
  var type = (0, _type2.default)(output);

  if (type.match(/^(array|object)\//)) {
    output = (0, _deepCopy2.default)(output);
  }

  // TODO max recursion level
  while (type !== 'array/csl') {
    output = (0, _data2.default)(output, type);
    type = (0, _type2.default)(output);
  }

  return output;
};

exports.default = parseInput;