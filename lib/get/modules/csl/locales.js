'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.locales = undefined;

var _register = require('../../../util/register');

var _register2 = _interopRequireDefault(_register);

var _locales = require('./locales.json');

var _locales2 = _interopRequireDefault(_locales);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var locales = new _register2.default(_locales2.default);

var fetchLocale = function fetchLocale(lang) {
  if (locales.has(lang)) {
    return locales.get(lang);
  } else {
    return locales.get('en-US');
  }
};

exports.default = fetchLocale;
exports.locales = locales;