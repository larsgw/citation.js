"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _deepCopy = _interopRequireDefault(require("../../util/deepCopy"));

var _registrar = require("../registrar/");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseInputChainLink = function parseInputChainLink(input) {
  var type = (0, _registrar.type)(input);
  var output = type.match(/array|object/) ? (0, _deepCopy.default)(input) : input;
  return (0, _registrar.data)(output, type);
};

var _default = parseInputChainLink;
exports.default = _default;