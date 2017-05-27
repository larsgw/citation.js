'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _locales = require('./locales.json');

var _locales2 = _interopRequireDefault(_locales);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Retrieve CSL locale
 *
 * @access protected
 * @method fetchCSLLocale
 *
 * @param {String} lang - lang code
 *
 * @return {String} CSL locale
 */
var fetchCSLLocale = function fetchCSLLocale(lang) {
  return _locales2.default[lang];
}; /**
    * Object containing CSL locales
    *
    * Locales from the [CSL Project](http://citationstyles.org/)<br>
    * [REPO](https://github.com/citation-style-language/locales)
    *
    * Accesed 10/22/2016
    *
    * @access private
    * @constant varCSLLocales
    * @default
    */
exports.default = fetchCSLLocale;