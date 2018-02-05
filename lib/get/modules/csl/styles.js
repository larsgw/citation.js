"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = exports.default = void 0;

var _register = _interopRequireDefault(require("../../../util/register"));

var _styles = _interopRequireDefault(require("./styles.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var templates = new _register.default(_styles.default);
exports.templates = templates;

var fetchStyle = function fetchStyle(style) {
  if (templates.has(style)) {
    return templates.get(style);
  } else {
    return templates.get('apa');
  }
};

var _default = fetchStyle;
exports.default = _default;