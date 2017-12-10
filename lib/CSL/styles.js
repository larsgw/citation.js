'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _register = require('./register');

var _styles = require('./styles.json');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchCSLStyle = function fetchCSLStyle(style) {
  return (0, _register.hasTemplate)(style) ? (0, _register.getTemplate)(style) : _styles2.default.hasOwnProperty(style) ? _styles2.default[style] : _styles2.default['apa'];
};

exports.default = fetchCSLStyle;