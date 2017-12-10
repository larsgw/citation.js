'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepCopy = require('../../util/deepCopy');

var _deepCopy2 = _interopRequireDefault(_deepCopy);

var _registrar = require('../registrar/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseInputChainLink = function parseInputChainLink(input) {
  var type = (0, _registrar.type)(input);
  var output = type.match(/array|object/) ? (0, _deepCopy2.default)(input) : input;

  return (0, _registrar.data)(output, type);
};

exports.default = parseInputChainLink;