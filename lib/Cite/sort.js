'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sort = undefined;

var _label = require('../get/label');

var _label2 = _interopRequireDefault(_label);

var _name = require('../get/name');

var _name2 = _interopRequireDefault(_name);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Get value for comparing
 *
 * @access private
 * @method getComparisonValue
 *
 * @param {CSL} obj - obj
 * @param {String} prop - The prop in question
 * @param {Boolean} label - Prop is label
 *
 * @return {String|Number} something to compare
 */
var getComparisonValue = function getComparisonValue(obj, prop) {
  var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : prop === 'label';

  var value = label ? (0, _label2.default)(obj) : obj[prop];

  switch (prop) {
    case 'author':
    case 'editor':
      return value.map(function (name) {
        return name.literal || name.family || (0, _name2.default)(name);
      });

    case 'accessed':
    case 'issued':
      return value['date-parts'][0];

    case 'page':
      return value.split('-').map(function (num) {
        return parseInt(num);
      });

    case 'edition':
    case 'issue':
    case 'volume':
      value = parseInt(value);
      return !isNaN(value) ? value : -Infinity;

    default:
      return value || -Infinity;
  }
};

/**
 * Compares props
 *
 * @access private
 * @method compareProp
 *
 * @param {CSL} a - Object a
 * @param {CSL} b - Object b
 * @param {String} prop - The prop in question. Prepend ! to sort the other way around.
 * @param {Boolean} flip - Override flip
 *
 * @return {Number} positive for a > b, negative for b > a, zero for a = b (flips if prop has !)
 */
var compareProp = function compareProp(a, b, prop) {
  var flip = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : /^!/.test(prop);

  prop = prop.replace(/^!/, '');
  var valueA = getComparisonValue(a, prop);
  var valueB = getComparisonValue(b, prop);

  return valueA === valueB ? 0 : flip !== valueA > valueB ? 1 : -1;
};

/**
 * Generates a sorting callback based on props.
 *
 * @access private
 * @method getSortCallback
 *
 * @param {...String} props - How to sort
 *
 * @return {Cite~sort} sorting callback
 */
var getSortCallback = function getSortCallback() {
  for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
    props[_key] = arguments[_key];
  }

  return function (a, b) {
    var keys = props.slice();
    var output = 0;

    while (!output && keys.length) {
      output = compareProp(a, b, keys.shift());
    }

    return output;
  };
};

/**
 * Sort the dataset
 *
 * @method sort
 * @memberof Cite
 * @this Cite
 *
 * @param {Cite~sort|Array<String>} [method=[]] - How to sort
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Cite} The updated parent object
 */
var sort = function sort() {
  var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var log = arguments[1];

  if (log) {
    this.save();
  }

  this.data.sort(typeof method === 'function' ? method : getSortCallback.apply(undefined, _toConsumableArray(method).concat(['label'])));

  return this;
};

exports.sort = sort;