'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _register = require('./register');

var _styles = require('./styles.json');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Retrieve CSL style
 *
 * @access protected
 * @method fetchCSLStyle
 *
 * @param {String} [style="apa"] - style name
 *
 * @return {String} CSL style
 */
var fetchCSLStyle = function fetchCSLStyle(style) {
  return (0, _register.hasTemplate)(style) ? (0, _register.getTemplate)(style) : _styles2.default.hasOwnProperty(style) ? _styles2.default[style] : _styles2.default['apa'];
};

/**
 * Object containing CSL templates
 *
 * Templates from the [CSL Project](http://citationstyles.org/)<br>
 * [REPO](https://github.com/citation-style-language/styles), [LICENSE](https://creativecommons.org/licenses/by-sa/3.0/)
 *
 * Accesed 10/22/2016
 *
 * @access private
 * @constant varCSLStyles
 * @default
 */
exports.default = fetchCSLStyle;