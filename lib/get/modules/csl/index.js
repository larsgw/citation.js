"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./locales");

require("./styles");

var _bibliography = _interopRequireDefault(require("./bibliography"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = [{
  name: 'bibliography',
  formatter: _bibliography.default
}];
exports.default = _default;