'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = undefined;

var _register = require('../../../util/register');

var _register2 = _interopRequireDefault(_register);

var _styles = require('./styles.json');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var templates = new _register2.default(_styles2.default);

var fetchStyle = function fetchStyle(style) {
  if (templates.has(style)) {
    return templates.get(style);
  } else {
    return templates.get('apa');
  }
};

exports.default = fetchStyle;
exports.templates = templates;