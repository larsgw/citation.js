"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.locales = exports.default = void 0;

var _register = _interopRequireDefault(require("../../../util/register"));

var _locales = _interopRequireDefault(require("./locales.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var locales = new _register.default(_locales.default);
exports.locales = locales;

var fetchLocale = function fetchLocale(lang) {
  if (locales.has(lang)) {
    return locales.get(lang);
  } else {
    return locales.get('en-US');
  }
};

var _default = fetchLocale;
exports.default = _default;