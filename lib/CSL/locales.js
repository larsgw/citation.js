'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _register = require('./register');

var _locales = require('./locales.json');

var _locales2 = _interopRequireDefault(_locales);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchCSLLocale = function fetchCSLLocale(lang) {
  return (0, _register.hasLocale)(lang) ? (0, _register.getLocale)(lang) : _locales2.default.hasOwnProperty(lang) ? _locales2.default[lang] : _locales2.default['en-US'];
};

exports.default = fetchCSLLocale;